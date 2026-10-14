#!/usr/bin/env node
// 重新生成 index.html 里 <style id="tw-prebuilt"> 的预编译 Tailwind 样式。
//
//   node build-css.mjs
//
// 需要 Node 18+ 且能访问 npm（通过 npx 临时拉取 tailwindcss，不在仓库里留依赖）。
// 主题配置直接读 index.html 里的 window.TW_CONFIG，与运行时 Play CDN 保持同一来源。
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// cdn.tailwindcss.com 提供的是 v3，这里固定同一大版本，保证两边生成的类一致。
const TAILWIND = 'tailwindcss@3.4.17';
// 只认独占一行开头的标签，避免误匹配注释或字符串里提到的同名标签。
const BLOCK_RE = /^([ \t]*<style id="tw-prebuilt">)([\s\S]*?)(<\/style>)/m;

const htmlPath = join(dirname(fileURLToPath(import.meta.url)), 'index.html');
const html = readFileSync(htmlPath, 'utf8');
if (!BLOCK_RE.test(html)) throw new Error('index.html 里没找到 <style id="tw-prebuilt">');

const configScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => m[1])
  .find(code => code.includes('window.TW_CONFIG'));
if (!configScript) throw new Error('index.html 里没找到 window.TW_CONFIG');
const sandbox = { window: {} };
vm.runInNewContext(configScript, sandbox);
const config = sandbox.window.TW_CONFIG;

const dir = mkdtempSync(join(tmpdir(), 'tw-prebuilt-'));
try {
  // 扫描前先清空旧的预编译块，否则旧 CSS 里的选择器会被当成“仍在使用的类名”永远留下来。
  const page = join(dir, 'page.html');
  writeFileSync(page, html.replace(BLOCK_RE, (_, open, _old, close) => open + close));
  writeFileSync(join(dir, 'in.css'), '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
  writeFileSync(join(dir, 'tailwind.config.cjs'),
    `module.exports = ${JSON.stringify({ ...config, content: [page] }, null, 2)};\n`);

  const out = join(dir, 'out.css');
  execFileSync('npx', ['--yes', TAILWIND,
    '-c', join(dir, 'tailwind.config.cjs'), '-i', join(dir, 'in.css'), '-o', out, '--minify'],
    { stdio: 'inherit', shell: process.platform === 'win32' });

  const css = readFileSync(out, 'utf8').trim();
  writeFileSync(htmlPath, html.replace(BLOCK_RE, (_, open, _old, close) => open + css + close));
  console.log(`tw-prebuilt 已更新：${(Buffer.byteLength(css) / 1024).toFixed(1)} KB`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
