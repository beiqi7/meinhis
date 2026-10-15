// GEEK ARSENAL 控制台前端。经典脚本（非 ES module），保证 file:// 直接打开也能运行。
// 依赖 assets/data.js 声明的全局：SITE TABS STATUS_ORDER STATUS DEVICES HISTORY TOPO_SEED
// 布局：分区栏 / 清单 / 检视器 三栏；窄屏（<980px）退化为页面滚动 + 全屏检视层。
(function () {
  'use strict';

  // ---------- 工具 ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]);
  const icon = (name, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const pad2 = n => String(n).padStart(2, '0');
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // localStorage / History 在 Safari 隐私模式、部分 file:// 环境下会抛异常，统一兜底。
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 忽略 */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* 忽略 */ } }
  };
  const nav = (url, push) => {
    try { history[push ? 'pushState' : 'replaceState'](null, '', url); } catch (e) { /* 受限环境下不影响功能 */ }
  };

  const TAB_ICON = { rigs: 'desktop', laptops: 'laptop', mobile: 'phone', topology: 'topology', history: 'timeline', spares: 'box', peripherals: 'mouse' };
  const ST_COLOR = { active: 'green', family: 'sky', spare: 'violet', sold: 'amber', dead: 'rose', vault: 'slate' };
  const SPEC_ORDER = {
    laptops: ['CPU', 'RAM/ROM', '屏幕', '显卡', '机身'],
    mobile: ['CPU', 'RAM/ROM', '屏幕', '摄像头', '重量', '其他']
  };
  const TOPO_KEY = 'ga.topo.v6';
  const THEMES = [
    { id: 'ember', name: '熔岩', a: '#ff8a3d', b: '#ffc46b', bg: '#0d0b09' },
    { id: 'acid', name: '酸性', a: '#c6f432', b: '#5eead4', bg: '#08090a' },
    { id: 'aurora', name: '极光', a: '#a78bfa', b: '#f472b6', bg: '#0a0a16' },
    { id: 'graphite', name: '石墨', a: '#7dd3fc', b: '#c4b5fd', bg: '#0b0d13' }
  ];
  const tabOf = id => TABS.find(t => t.id === id);
  const isListTab = id => !!tabOf(id) && !tabOf(id).special;
  const hasItems = id => isListTab(id) || id === 'history';
  // 窄屏：检视器变为全屏覆盖层，不自动选中
  const FLOW = matchMedia('(max-width: 979px)');

  // mode: list 清单 + 检视器 / full 全规格平铺。sel：每个分区各自记住选中项。
  const state = { tab: 'rigs', status: 'all', mode: 'list', sel: {}, q: '' };

  // ---------- 数据派生 ----------
  // 编年史：从 "[Period 8] 2026.03 - 至今 (…)" 里解析出起止年份，供时间轴与检视器使用
  const ERAS = HISTORY.map((h, i) => {
    const m = /^\[Period\s*(\d+)\]\s*(.*)$/.exec(h.period) || [null, String(HISTORY.length - i), h.period];
    const rest = m[2];
    const nums = (rest.match(/(?:19|20)\d{2}(?:\.\d{1,2})?/g) || []).map(s => {
      const [y, mo] = s.split('.');
      return { text: s, v: +y + (mo ? (+mo - 1) / 12 : 0) };
    });
    const now = new Date();
    const open = /至今/.test(rest);
    const a = nums[0] ? nums[0].v : SITE.since;
    let b = open ? now.getFullYear() + now.getMonth() / 12 : (nums[1] ? nums[1].v : a + 1);
    if (b <= a) b = a + .25;
    // 注释 = 年份之外的文字 + 括号里的说明，例如「高考阶段 · LGA 775 终极压榨」
    const paren = (/[（(]([^）)]+)[）)]/.exec(rest) || [])[1] || '';
    const bare = rest.replace(/[（(][^）)]*[）)]/g, '').replace(/(?:19|20)\d{2}(?:\.\d{1,2})?|至今|[-–~]/g, '').trim();
    const note = [bare, paren].filter(Boolean).join(' · ');
    return {
      kind: 'era', id: 'p' + m[1], tab: 'history', p: +m[1], h, a, b,
      from: nums[0] ? nums[0].text : '', to: open ? '至今' : (nums[1] ? nums[1].text : ''), note,
      accent: h.color || 'slate'
    };
  });
  const BY_ID = new Map();
  DEVICES.forEach(d => BY_ID.set(d.id, d));
  ERAS.forEach(e => BY_ID.set(e.id, e));
  const BY_TAB = {};
  TABS.forEach(t => { BY_TAB[t.id] = t.id === 'history' ? ERAS : DEVICES.filter(d => d.tab === t.id); });
  // 序号：设备在所属分区里的位置（01、02…），编年史用 P8、P7…
  const NUM = new Map();
  Object.keys(BY_TAB).forEach(k => BY_TAB[k].forEach((d, i) => NUM.set(d.id, d.kind === 'era' ? 'P' + d.p : pad2(i + 1))));
  const accentOf = d => d.kind === 'era' ? d.accent : (d.accent || (d.status === 'dead' ? 'rose' : d.status === 'sold' ? 'amber' : 'slate'));
  const stLabel = s => (STATUS[s] || STATUS.vault).label;
  function specsOf(d) {
    const order = SPEC_ORDER[d.tab];
    if (!order) return d.specs || [];
    const m = new Map((d.specs || []).map(([k, v]) => [k, v]));
    return order.map(k => [k, m.has(k) ? m.get(k) : '—']);
  }
  // 复制用纯文本
  function plainOf(d) {
    if (d.kind === 'era') return [d.h.period, d.h.tag, d.h.title, '', ...d.h.body].join('\n');
    return [
      d.title, d.sub, `${stLabel(d.status)} · ${d.flag || ''} · ${d.badge || ''}`, '',
      ...(d.specs || []).map(([k, v]) => Array.isArray(v) ? `${k}:\n${v.map(x => '  - ' + x).join('\n')}` : `${k}: ${v}`),
      '', [d.footL, d.footR].filter(Boolean).join(' / ')
    ].filter(x => x != null).join('\n').trim();
  }
  const titleOf = d => d.kind === 'era' ? d.h.title : d.title;
  // ---------- 路由：#tab、#tab?d=条目id、#tab?q=搜索词（打开命令面板） ----------
  function parseHash() {
    let raw = location.hash.replace(/^#/, '');
    try { raw = decodeURIComponent(raw); } catch (e) { /* 保留原文 */ }
    const i = raw.indexOf('?');
    const tabPart = i < 0 ? raw : raw.slice(0, i);
    let q = '', d = null;
    try {
      const p = new URLSearchParams(i < 0 ? '' : raw.slice(i + 1));
      q = (p.get('q') || '').trim();
      d = p.get('d');
    } catch (e) { /* 非法查询串按空处理 */ }
    const item = d && BY_ID.get(d);
    return { tab: tabOf(tabPart) ? tabPart : null, q, d: item ? d : null };
  }
  // 窄屏且未打开检视层时，URL 里不带 d
  function persist(push) {
    store.set('ga.tab', state.tab);
    const id = state.sel[state.tab];
    const withD = id && hasItems(state.tab) && state.mode !== 'full' && (!FLOW.matches || isOpen());
    nav('#' + state.tab + (withD ? '?d=' + encodeURIComponent(id) : ''), push);
  }

  // ---------- 文本渲染 ----------
  // 规格值里的数字+单位加粗，方便扫读；先切分再逐段转义，不会破坏实体
  const NUM_RE = /\d+(?:\.\d+)?\s?(?:GB\/s|MB\/s|Gbps|GHz|MHz|mAh|TBW|TB|GB|MB|nm|mm|Hz|W|V|g|核|线程)(?![A-Za-z])/g;
  function em(s) {
    const raw = String(s == null ? '' : s);
    let out = '', last = 0;
    raw.replace(NUM_RE, (m, at) => { out += esc(raw.slice(last, at)) + `<b>${esc(m)}</b>`; last = at + m.length; return m; });
    return out + esc(raw.slice(last));
  }
  // 命令面板里高亮搜索词
  let hiRe = null, hiFor = null;
  function hl(s) {
    const raw = String(s == null ? '' : s);
    const toks = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return esc(raw);
    if (hiFor !== state.q) {
      hiFor = state.q;
      hiRe = new RegExp('(' + toks.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    }
    return raw.split(hiRe).map((part, i) => i % 2 ? `<mark>${esc(part)}</mark>` : esc(part)).join('');
  }

  // ---------- 系统读数（全部由数据推导） ----------
  function kpis() {
    const act = DEVICES.filter(d => d.status === 'active');
    const sum = k => act.reduce((s, d) => s + (+d[k] || 0), 0);
    const lo = Math.floor(Math.min(...ERAS.map(e => e.a), SITE.since));
    const hi = Math.max(Math.floor(Math.max(...ERAS.map(e => e.b))), new Date().getFullYear());
    return [
      { label: '现役计算核心', value: sum('cores'), dec: 0, unit: 'CORES', c: 'var(--pri)', hint: `${act.filter(d => d.cores).length} 台节点 / 笔电` },
      { label: '在线 / 近线存储', value: sum('storageGB') / 1000, dec: 1, unit: 'TB', c: 'var(--green)', hint: '按标称容量合计' },
      { label: '现役独显显存', value: sum('vramGB'), dec: 0, unit: 'GB', c: 'var(--pri-2)', hint: `${act.filter(d => d.vramGB).length} 张独显` },
      { label: '装机跨度', value: hi - lo, dec: 0, unit: 'YEARS', c: 'var(--amber)', hint: `${lo} – ${hi}` }
    ];
  }
  function renderSys() {
    const list = kpis();
    const host = $('#sys');
    host.innerHTML = `<div class="sys__label"><span>SYSTEM</span><span>ONLINE</span></div><div class="kpis">${list.map((k, i) => `<div class="kpi" style="--c:${k.c}">
      <div class="kpi__val"><span data-kpi="${i}">${k.value.toFixed(k.dec)}</span><span class="kpi__unit">${k.unit}</span></div>
      <div class="kpi__label">${esc(k.label)}</div><div class="kpi__hint">${esc(k.hint)}</div></div>`).join('')}</div>`;
    if (reduceMotion()) return;
    // 首屏数字从 0 缓动到目标值
    const els = list.map((k, i) => [k, host.querySelector(`[data-kpi="${i}"]`)]);
    const t0 = performance.now(), dur = 1000;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      els.forEach(([k, el]) => { el.textContent = (k.value * e).toFixed(k.dec); });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- 分区栏 / 状态栏 ----------
  const distOf = list => STATUS_ORDER.map(s => [s, list.filter(d => d.status === s).length]).filter(([, n]) => n);
  function renderSectors() {
    $('#sectors').innerHTML = `<div class="sectors__label"><span>SECTORS</span><span>${pad2(TABS.length)}</span></div>` + TABS.map(t => {
      const items = BY_TAB[t.id];
      const on = state.tab === t.id;
      let n = '', extra = '';
      if (isListTab(t.id)) {
        n = pad2(items.length);
        extra = `<span class="sector__bar" aria-hidden="true">${distOf(items).map(([s, c]) => `<i data-st="${s}" style="flex:${c}"></i>`).join('')}</span>`;
      } else if (t.id === 'topology') {
        extra = `<span class="sector__note">${TOPO_SEED.nodes.length} 节点 · ${TOPO_SEED.links.length} 链路</span>`;
      } else {
        n = pad2(items.length);
        extra = `<span class="sector__note">${Math.floor(Math.min(...ERAS.map(e => e.a)))} → 至今</span>`;
      }
      return `<button type="button" class="sector" data-tab="${t.id}" aria-current="${on ? 'page' : 'false'}" title="${esc(t.label)}（按 ${t.idx.replace(/^0/, '')}）">
        <span class="sector__idx">${t.idx}</span><span class="sector__name">${icon(TAB_ICON[t.id] || 'box')}<span>${esc(t.name)}</span></span><span class="sector__n">${n}</span>${extra}</button>`;
    }).join('');
  }
  function renderStatus() {
    const segs = distOf(DEVICES).map(([s, n]) => `<span class="status__seg" data-st="${s}"><i class="led"></i>${esc(stLabel(s))} ${n}</span>`).join('');
    $('#status').innerHTML = `<span class="status__seg status__on" data-st="active"><i class="led"></i>LINK OK</span>
      <span class="status__seg">${DEVICES.length} DEVICES · ${ERAS.length} ERAS</span>${segs}
      <span class="status__keys"><span><kbd>Ctrl K</kbd>搜索</span><span><kbd>1-7</kbd>分区</span><span><kbd>J</kbd><kbd>K</kbd>上下</span><span><kbd>E</kbd>全规格</span><span><kbd>T</kbd>配色</span></span>`;
  }
  function tickClock() {
    const el = $('#clock');
    const d = new Date();
    el.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }
  // ---------- 清单 ----------
  const visible = () => {
    const all = BY_TAB[state.tab] || [];
    return state.tab === 'history' || state.status === 'all' ? all : all.filter(d => d.status === state.status);
  };
  const rowHTML = d => {
    const on = state.sel[state.tab] === d.id;
    if (d.kind === 'era') {
      return `<button type="button" class="row" data-pick="${d.id}" data-ac="${accentOf(d)}" aria-current="${on}">
        <span class="row__n">${NUM.get(d.id)}</span><span class="row__body">
        <span class="row__period">${esc(d.from)} – ${esc(d.to)}</span>
        <span class="row__title">${esc(d.h.title)}</span>
        <span class="row__badge">${esc(d.h.tag)}</span></span></button>`;
    }
    return `<button type="button" class="row" data-pick="${esc(d.id)}" data-ac="${accentOf(d)}" data-st="${d.status}" aria-current="${on}">
      <span class="row__n">${NUM.get(d.id)}</span><span class="row__body">
      <span class="row__badge">${esc(d.badge || '')}</span>
      <span class="row__title">${esc(d.title)}</span>
      <span class="row__meta"><i class="led"></i><span>${esc(stLabel(d.status))}${d.flag ? ' · ' + esc(d.flag) : ''}</span></span></span></button>`;
  };
  // 相邻同 group 的条目合并成一组，保持数据原始顺序
  function grouped(list, fn) {
    const groups = [];
    list.forEach(d => {
      const g = d.group || '';
      const last = groups[groups.length - 1];
      if (last && last.name === g) last.items.push(d); else groups.push({ name: g, items: [d] });
    });
    if (groups.length < 2 || !groups.some(g => g.name)) return list.map(fn).join('');
    return groups.map(g => `<div class="group-hd">${esc(g.name || '其他')} · ${g.items.length}</div>${g.items.map(fn).join('')}`).join('');
  }
  const emptyHTML = msg => `<div class="empty">${icon('search')}${esc(msg)}</div>`;

  // 编年史时间轴：按起止年份等比铺开
  function trackHTML() {
    const lo = Math.floor(Math.min(...ERAS.map(e => e.a))), hi = Math.max(...ERAS.map(e => e.b));
    const pct = v => ((v - lo) / (hi - lo) * 100).toFixed(2);
    const ticks = [lo];
    for (let y = Math.ceil((lo + 1) / 5) * 5; y < hi - 2; y += 5) ticks.push(y);
    const segs = ERAS.slice().reverse().map(e => `<button type="button" class="seg" data-pick="${e.id}" data-ac="${accentOf(e)}" aria-current="${state.sel.history === e.id}"
      style="left:${pct(e.a)}%;width:${(pct(e.b) - pct(e.a)).toFixed(2)}%" title="P${e.p} · ${esc(e.from)} – ${esc(e.to)}" aria-label="Period ${e.p}：${esc(e.from)} 至 ${esc(e.to)}"></button>`).join('');
    return `<div class="track"><span class="track__line"></span>${segs}${ticks.map(y => `<span class="track__tick" style="left:${pct(y)}%">${y}</span>`).join('')}<span class="track__tick end" style="left:100%">NOW</span></div>`;
  }

  function listHeadHTML() {
    const t = tabOf(state.tab);
    const all = BY_TAB[state.tab];
    const full = state.mode === 'full';
    const seg = `<div class="seg-ctl" role="group" aria-label="视图">
      <button type="button" data-mode="list" aria-pressed="${!full}" title="清单 + 检视器（E 切换）">${icon('rows')}<span class="seg-ctl__t">清单</span></button>
      <button type="button" data-mode="full" aria-pressed="${full}" title="一键展开全部${state.tab === 'history' ? '时期全文' : '规格'}（E 切换）">${icon('doc')}<span class="seg-ctl__t">${state.tab === 'history' ? '全文' : '全规格'}</span></button></div>`;
    let count, extra = '';
    if (state.tab === 'history') {
      count = `${all.length} 个时期 · ${ERAS[ERAS.length - 1].from} – 至今`;
      extra = trackHTML();
    } else {
      const shown = visible().length;
      const dist = distOf(all);
      count = state.status === 'all' ? `${all.length} 台` : `显示 ${shown} / ${all.length} 台`;
      extra = `<div class="dist" aria-hidden="true">${dist.map(([s, n]) => `<i data-st="${s}" style="flex:${n}" title="${esc(stLabel(s))} ${n}"></i>`).join('')}</div>`;
      if (dist.length > 1) {
        const chips = [['all', '全部', all.length], ...dist.map(([s, n]) => [s, stLabel(s), n])];
        extra += `<div class="chips" role="group" aria-label="按状态筛选">${chips.map(([id, label, n]) => `<button type="button" class="chip" data-filter="${id}" data-st="${id}" aria-pressed="${state.status === id}">
          ${id === 'all' ? '' : '<i class="led"></i>'}${esc(label)}<span class="chip__n">${n}</span></button>`).join('')}</div>`;
      }
    }
    return `<div class="list__hd"><div class="list__top"><div><div class="list__idx">SECTOR ${t.idx} / ${pad2(TABS.length)}</div>
      <h2 class="list__title">${esc(t.label)}</h2><div class="list__count">${esc(count)}</div></div>${seg}</div>${extra}</div>`;
  }
  // ---------- 档案（检视器与全规格模式共用） ----------
  const specVal = v => Array.isArray(v) ? `<ol>${v.map(i => `<li>${em(i)}</li>`).join('')}</ol>` : em(v);
  const actsHTML = () => `<span class="dossier__acts">
    <button type="button" class="ibtn" data-act="link" title="复制链接" aria-label="复制链接">${icon('link')}</button>
    <button type="button" class="ibtn" data-act="specs" title="复制全文" aria-label="复制全文">${icon('copy')}</button></span>`;
  function dossierHTML(d, inStack) {
    const H = inStack ? 'h3' : 'h2';
    const tid = inStack ? '' : ' id="inspTitle"';
    const t = tabOf(d.tab);
    if (d.kind === 'era') {
      return `<article class="dossier" data-id="${d.id}" data-ac="${accentOf(d)}">
        <span class="dossier__wm" aria-hidden="true">${NUM.get(d.id)}</span>
        <div class="dossier__tags"><span class="tag tag--ac">PERIOD ${d.p}</span><span class="tag">${esc(d.h.tag)}</span>${inStack ? actsHTML() : ''}</div>
        <div class="era-range">${esc(d.from)} <em>→</em> ${esc(d.to)}</div>
        ${d.note ? `<p class="era-note">${esc(d.note)}</p>` : ''}
        <${H} class="era-title"${tid}>${esc(d.h.title)}</${H}>
        <div class="era-body">${d.h.body.map(p => `<p>${em(p)}</p>`).join('')}</div>
      </article>`;
    }
    const specs = specsOf(d);
    const notes = [['看点', d.footL], ['备注', d.footR]].filter(([, v]) => v);
    return `<article class="dossier" data-id="${esc(d.id)}" data-ac="${accentOf(d)}">
      <span class="dossier__wm" aria-hidden="true">${NUM.get(d.id)}</span>
      <div class="dossier__tags"><span class="tag tag--st" data-st="${d.status}"><i class="led"></i>${esc(stLabel(d.status))}</span>
        ${d.flag ? `<span class="tag tag--ac">${esc(d.flag)}</span>` : ''}${d.badge ? `<span class="tag">${esc(d.badge)}</span>` : ''}${inStack ? actsHTML() : ''}</div>
      <${H} class="dossier__title"${tid}>${esc(d.title)}</${H}>
      ${d.sub ? `<p class="dossier__sub">${em(d.sub)}</p>` : ''}
      <div class="sheet-hd">SPEC SHEET<span>${specs.length} 项</span></div>
      <dl class="specsheet">${specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${specVal(v)}</dd>`).join('')}</dl>
      ${notes.length ? `<div class="callouts">${notes.map(([k, v]) => `<p class="callout"><small>${k}</small>${em(v)}</p>`).join('')}</div>` : ''}
      <div class="dossier__meta"><span>${esc(t ? t.label : '')}</span>${d.group ? `<span>${esc(d.group)}</span>` : ''}<span>ID ${esc(d.id)}</span></div>
    </article>`;
  }

  // ---------- 舞台 ----------
  const stage = $('#stage');
  let topoOff = null;
  const isOpen = () => { const p = $('#insp'); return !!(p && p.classList.contains('open')); };
  // 当前选中项：没有或被筛掉时，宽屏自动落到第一项，窄屏保持空
  function ensureSel() {
    const list = visible();
    const cur = state.sel[state.tab];
    if (cur && list.some(d => d.id === cur)) return cur;
    state.sel[state.tab] = FLOW.matches ? null : (list[0] ? list[0].id : null);
    return state.sel[state.tab];
  }
  function renderStage() {
    if (topoOff) topoOff();
    document.body.classList.remove('lock');
    const t = tabOf(state.tab);
    if (state.tab === 'topology') {
      stage.className = 'stage stage--full';
      stage.innerHTML = topologyHTML();
      bindTopology();
      return;
    }
    const list = visible();
    if (state.mode === 'full') {
      stage.className = 'stage stage--full';
      stage.innerHTML = `<section class="pane list" aria-label="${esc(t.label)}">${listHeadHTML()}
        <div class="pane__body"><div class="stack">${list.length ? grouped(list, d => dossierHTML(d, true)) : emptyHTML('没有匹配的条目')}</div></div></section>`;
      return;
    }
    ensureSel();
    stage.className = 'stage';
    stage.innerHTML = `<section class="pane list" aria-label="${esc(t.label)}">${listHeadHTML()}
        <div class="pane__body" id="rows">${list.length ? grouped(list, rowHTML) : emptyHTML('没有匹配的条目')}</div></section>
      <section class="pane insp" id="insp" role="region" aria-label="检视器"></section>`;
    renderInspector(false);
    const on = $('.row[aria-current="true"]', stage);
    if (on && !FLOW.matches) on.scrollIntoView({ block: 'nearest' });
  }
  function renderInspector(animate) {
    const host = $('#insp');
    if (!host) return;
    const id = state.sel[state.tab];
    const d = id && BY_ID.get(id);
    const list = visible();
    const i = d ? list.findIndex(x => x.id === d.id) : -1;
    const t = tabOf(state.tab);
    host.dataset.ac = d ? accentOf(d) : 'slate';
    const bar = `<div class="insp__bar">
      <button type="button" class="ibtn insp__back" data-act="close" aria-label="返回清单">${icon('back')}</button>
      <span class="insp__crumb">${d ? `<b>${esc(NUM.get(d.id))}</b> / ${pad2(list.length)} · ${esc(t.name)}` : 'INSPECTOR'}</span>
      <button type="button" class="ibtn" data-act="prev" aria-label="上一项" title="上一项（K）"${i > 0 ? '' : ' disabled'}>${icon('prev')}</button>
      <button type="button" class="ibtn" data-act="next" aria-label="下一项" title="下一项（J）"${i >= 0 && i < list.length - 1 ? '' : ' disabled'}>${icon('next')}</button>
      ${d ? `<button type="button" class="ibtn ibtn--pri" data-act="link" title="复制本条链接">${icon('link')}<span class="ibtn__t">复制链接</span></button>
      <button type="button" class="ibtn" data-act="specs" title="复制${d.kind === 'era' ? '全文' : '全部规格'}">${icon('copy')}<span class="ibtn__t">${d.kind === 'era' ? '复制全文' : '复制规格'}</span></button>` : ''}
    </div>`;
    const body = d ? dossierHTML(d, false) : emptyHTML(list.length ? '在左侧清单中选择一项' : '没有匹配的条目');
    host.innerHTML = `${bar}<div class="pane__body insp__body">${body}</div><div class="insp__scan" aria-hidden="true"></div>`;
    if (animate && !reduceMotion()) {
      const scan = $('.insp__scan', host), b = $('.insp__body', host);
      scan.classList.add('on'); b.classList.add('fresh');
      setTimeout(() => { scan.classList.remove('on'); b.classList.remove('fresh'); }, 900);
    }
  }
  // 只更新选中态与检视器，不重绘清单（保留清单滚动位置）
  function select(id, opts = {}) {
    const d = BY_ID.get(id);
    if (!d || d.tab !== state.tab) return;
    state.sel[state.tab] = id;
    stage.querySelectorAll('[data-pick]').forEach(el => el.setAttribute('aria-current', String(el.dataset.pick === id)));
    renderInspector(true);
    const row = $(`.row[data-pick="${CSS.escape(id)}"]`, stage);
    if (row && opts.scroll !== false) row.scrollIntoView({ block: 'nearest' });
    if (opts.focus && row) row.focus({ preventScroll: true });
    if (FLOW.matches && opts.open) openOverlay();
    persist(false);
  }
  // ---------- 窄屏检视层 ----------
  let overlayFrom = null;
  function openOverlay() {
    const p = $('#insp');
    if (!p || isOpen()) return;
    overlayFrom = document.activeElement;
    p.classList.add('open');
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-modal', 'true');
    p.setAttribute('aria-labelledby', 'inspTitle');
    document.body.classList.add('lock');
    requestAnimationFrame(() => { const b = $('.insp__back', p); if (b) b.focus({ preventScroll: true }); });
  }
  function closeOverlay(restore = true) {
    const p = $('#insp');
    if (!p || !isOpen()) return;
    p.classList.remove('open');
    p.setAttribute('role', 'region');
    p.removeAttribute('aria-modal');
    p.removeAttribute('aria-labelledby');
    document.body.classList.remove('lock');
    persist(false);
    if (!restore) return;
    // 焦点回到当前选中的行（窄屏里可能已在检视层内切换过条目）
    const row = $(`.row[data-pick="${CSS.escape(state.sel[state.tab] || '')}"]`, stage);
    const back = row || (overlayFrom && document.contains(overlayFrom) ? overlayFrom : stage);
    back.focus({ preventScroll: true });
    if (row) row.scrollIntoView({ block: 'nearest' });
  }

  // ---------- 切换 ----------
  // animate=false 时同步渲染（View Transition 的回调是异步的，紧接着要操作新 DOM 时必须关掉）
  function setTab(id, opts = {}) {
    if (!tabOf(id) || id === state.tab) return;
    const fromSectors = document.activeElement && document.activeElement.closest('#sectors');
    state.tab = id;
    state.status = 'all';
    // persist 放进 draw：选中项要等 renderStage 里的 ensureSel 才确定，URL 才能带上 ?d=
    const draw = () => {
      renderSectors(); renderStage();
      if (fromSectors) { const b = $(`.sector[data-tab="${id}"]`); if (b) b.focus(); }
      persist(opts.push !== false);
    };
    if (opts.animate !== false && document.startViewTransition && !reduceMotion() && !FLOW.matches) document.startViewTransition(draw);
    else draw();
    if (FLOW.matches) window.scrollTo(0, 0);
  }
  // 跳到某一条：命令面板 / 深链用
  function go(tab, id) {
    if (state.tab !== tab) setTab(tab, { animate: false });
    if (!id) return;
    const d = BY_ID.get(id);
    let redraw = false;
    if (state.status !== 'all' && d.status !== state.status) { state.status = 'all'; redraw = true; }
    if (state.mode === 'full') { state.mode = 'list'; store.set('ga.mode', 'list'); redraw = true; }
    if (redraw) { state.sel[tab] = id; renderStage(); }
    select(id, { open: true, focus: true });
  }
  function setMode(m, announce = true) {
    if (!hasItems(state.tab)) return;
    const next = m || (state.mode === 'full' ? 'list' : 'full');
    if (next === state.mode) return;
    const inSeg = document.activeElement && document.activeElement.closest('.seg-ctl');
    state.mode = next;
    store.set('ga.mode', next);
    renderStage();
    if (inSeg) { const b = $(`[data-mode="${next}"]`, stage); if (b) b.focus(); }
    persist(false);
    if (announce) toast(next === 'full' ? (state.tab === 'history' ? '已展开全部时期全文' : '已展开全部规格') : '清单视图');
  }
  function move(delta) {
    const list = visible();
    if (!list.length) return;
    const i = list.findIndex(d => d.id === state.sel[state.tab]);
    const n = i < 0 ? 0 : Math.min(list.length - 1, Math.max(0, i + delta));
    if (n === i) return;
    const rowFocused = document.activeElement && document.activeElement.matches('.row');
    select(list[n].id, { focus: rowFocused && !isOpen() });
  }
  function act(name, el) {
    const host = el && el.closest('.dossier[data-id]');
    const d = BY_ID.get(host ? host.dataset.id : state.sel[state.tab]);
    if (name === 'prev') return move(-1);
    if (name === 'next') return move(1);
    if (name === 'close') return closeOverlay();
    if (!d) return;
    if (name === 'link') copy(location.href.split('#')[0] + `#${d.tab}?d=${encodeURIComponent(d.id)}`, '链接已复制');
    if (name === 'specs') copy(plainOf(d), d.kind === 'era' ? '全文已复制' : '规格已复制');
  }

  // ---------- 配色主题：变量在 style.css 的 [data-theme] 里，这里只负责切换与记忆 ----------
  function applyTheme(id, announce) {
    const t = THEMES.find(x => x.id === id) || THEMES[0];
    document.documentElement.dataset.theme = t.id;
    store.set('ga.theme', t.id);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t.bg);
    $('#themes').querySelectorAll('[data-theme-id]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeId === t.id)));
    if (announce) toast(`配色：${t.name}`);
  }
  function renderThemes() {
    $('#themes').innerHTML = THEMES.map(t => `<button type="button" class="theme-dot" data-theme-id="${t.id}" style="--a:${t.a};--b:${t.b}" aria-pressed="false" title="配色：${t.name}（T 切换）" aria-label="切换配色：${t.name}"></button>`).join('');
  }
  const cycleTheme = () => {
    const cur = THEMES.findIndex(t => t.id === document.documentElement.dataset.theme);
    applyTheme(THEMES[(cur + 1) % THEMES.length].id, true);
  };
  // ---------- 拓扑编辑器 ----------
  const LINK_KIND = { wan: '上行', lan: '有线 1G', wifi: '无线', data: '数据', idle: '闲置', user: '自定义' };
  const LINK_C = { wan: 'var(--amber)', lan: 'var(--sky)', wifi: 'var(--violet)', data: 'var(--green)', idle: 'var(--ink-4)', user: 'var(--rose)' };
  const NODE_AC = { sky: 'sky', green: 'green', violet: 'violet', amber: 'amber', rose: 'rose', slate: 'slate' };

  function topologyHTML() {
    const t = tabOf('topology');
    const lg = (k, label, dash) => `<span><i class="${dash ? 'dash' : ''}" style="--c:${LINK_C[k]}"></i>${label}</span>`;
    return `<section class="pane topo" aria-label="${esc(t.label)}">
      <div class="topo__hd"><div><div class="list__idx">SECTOR ${t.idx} / ${pad2(TABS.length)}</div>
        <h2 class="list__title">${esc(t.label)}</h2>
        <p class="topo__desc">T7 OpenWrt 做主 · 8 口交换机下联台式 · AX5400 供手机笔电 · T7 中继与 Pawbo 暂闲置<span class="topo-hint"> · 拖节点 / 拉线 / 点线删除</span></p></div>
        <div class="legend">${lg('wan', '上行')}${lg('lan', '有线 1G')}${lg('wifi', '无线', 1)}${lg('idle', '闲置', 1)}${lg('user', '手拉')}
          <button type="button" class="ibtn" id="topoReset" style="border-color:var(--line-2)">${icon('reset')}<span>重置布局</span></button></div>
      </div>
      <div class="topo-list" id="topoList" role="list" aria-label="网络连接关系"></div>
      <div class="topo-stage" id="topoStage"><div class="topo-canvas" id="topoCanvas">
        <div class="topo-mark">全屋千兆 · 1GbE</div>
        <svg class="wires" id="topoWires"></svg><div id="topoNodes"></div>
      </div></div></section>`;
  }

  function bindTopology() {
    const canvas = $('#topoCanvas'), svg = $('#topoWires'), box = $('#topoNodes'), list = $('#topoList');
    if (!canvas) return;
    const seed = () => ({ nodes: TOPO_SEED.nodes.map(n => Object.assign({}, n)), links: TOPO_SEED.links.map(l => Object.assign({}, l)) });
    let model = seed();
    try {
      const raw = JSON.parse(store.get(TOPO_KEY) || 'null');
      if (raw && Array.isArray(raw.nodes) && Array.isArray(raw.links)) {
        raw.nodes.forEach(p => {
          const n = model.nodes.find(x => x.id === p.id);
          if (n && Number.isFinite(p.x) && Number.isFinite(p.y)) { n.x = p.x; n.y = p.y; }
        });
        const ok = new Set(model.nodes.map(n => n.id));
        const links = raw.links.filter(l => l && ok.has(l.a) && ok.has(l.b) && l.a !== l.b);
        if (links.length) model.links = links.map(l => ({ a: l.a, b: l.b, kind: LINK_KIND[l.kind] ? l.kind : 'user' }));
      }
    } catch (e) { model = seed(); }
    const save = () => store.set(TOPO_KEY, JSON.stringify({ nodes: model.nodes.map(n => ({ id: n.id, x: n.x, y: n.y })), links: model.links }));
    const NAMES = new Map(model.nodes.map(n => [n.id, n.title]));
    const nameOf = id => NAMES.get(id) || id;

    box.innerHTML = model.nodes.map(n => `<div class="node sz${n.sz || 3}${n.dim ? ' dim' : ''}${n.gig ? ' gig' : ''}" data-id="${esc(n.id)}" data-ac="${NODE_AC[n.accent] || 'slate'}" style="left:${(n.x * 100).toFixed(2)}%;top:${(n.y * 100).toFixed(2)}%">
        ${n.gig ? '<span class="gig">1G</span>' : ''}
        <div class="node__hd"><div class="node__t">${esc(n.title)}</div><div class="node__s">${esc(n.sub)}</div></div>
        <p class="node__n">${esc(n.note)}</p>
        <button type="button" class="port in" data-side="in" aria-label="${esc(n.title)} 输入端口"></button>
        <button type="button" class="port out" data-side="out" aria-label="${esc(n.title)} 输出端口"></button>
      </div>`).join('');
    const ports = new Map();
    box.querySelectorAll('.node').forEach(el => {
      ports.set(el.dataset.id + ':in', $('.port.in', el));
      ports.set(el.dataset.id + ':out', $('.port.out', el));
    });
    const center = (el, base) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top }; };
    const curve = (a, b) => {
      const dx = Math.max(48, Math.abs(b.x - a.x) * .42);
      return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}C${(a.x + dx).toFixed(1)} ${a.y.toFixed(1)},${(b.x - dx).toFixed(1)} ${b.y.toFixed(1)},${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    };
    let draft = null;
    function drawWires() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      if (!w || !h) return; // 小屏画布隐藏时跳过，避免无效布局读取
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const base = canvas.getBoundingClientRect();
      svg.innerHTML = model.links.map((l, i) => {
        const a = ports.get(l.a + ':out'), b = ports.get(l.b + ':in');
        if (!a || !b) return '';
        return `<path data-i="${i}" class="k-${l.kind}" d="${curve(center(a, base), center(b, base))}"><title>${esc(nameOf(l.a))} → ${esc(nameOf(l.b))} · 点击拆线</title></path>`;
      }).join('');
      if (draft) svg.appendChild(draft.el);
    }
    function drawList() {
      list.innerHTML = model.links.map((l, i) => `<div class="link-row" role="listitem">
        <span class="link-row__dot" style="--c:${LINK_C[l.kind]}"></span>
        <span class="link-row__names"><b>${esc(nameOf(l.a))}</b>${icon('arrow')}<b>${esc(nameOf(l.b))}</b></span>
        <span class="link-row__kind">${esc(LINK_KIND[l.kind] || '连接')}</span>
        <button type="button" class="icon-btn" data-cut="${i}" aria-label="拆除 ${esc(nameOf(l.a))} 到 ${esc(nameOf(l.b))} 的连接">${icon('unlink')}</button>
      </div>`).join('');
    }
    const draw = () => { drawWires(); drawList(); };
    let raf = 0;
    const drawSoon = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; drawWires(); }); };
    const addLink = (a, b) => {
      if (!a || !b || a === b || model.links.some(l => l.a === a && l.b === b)) return false;
      model.links.push({ a, b, kind: 'user' });
      save(); draw(); toast('已连线');
      return true;
    };
    const cut = i => {
      if (!Number.isInteger(i) || i < 0 || i >= model.links.length) return;
      model.links.splice(i, 1);
      save(); draw(); toast('已拆线');
    };
    const clearSrc = () => box.querySelectorAll('.port.src').forEach(p => p.classList.remove('src'));
    svg.addEventListener('click', e => { const p = e.target.closest('path[data-i]'); if (p) cut(+p.dataset.i); });
    list.addEventListener('click', e => { const b = e.target.closest('[data-cut]'); if (b) cut(+b.dataset.cut); });
    let drag = null, keyFrom = null;
    const point = e => (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
    const onDown = e => {
      const port = e.target.closest('.port');
      const node = e.target.closest('.node');
      if (!node) return;
      if (port) {
        if (port.dataset.side !== 'out') return;
        e.preventDefault();
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('class', 'draft');
        svg.appendChild(el);
        draft = { from: node.dataset.id, start: center(port, canvas.getBoundingClientRect()), el };
        port.classList.add('src');
        return;
      }
      if (!e.target.closest('.node__hd')) return;
      e.preventDefault();
      const n = model.nodes.find(x => x.id === node.dataset.id), p = point(e);
      drag = { n, el: node, sx: p.clientX, sy: p.clientY, ox: n.x, oy: n.y };
      node.classList.add('drag');
    };
    const onMove = e => {
      if (!drag && !draft) return;
      const p = point(e);
      if (e.cancelable) e.preventDefault();
      if (drag) {
        const cw = Math.max(1, canvas.offsetWidth), ch = Math.max(1, canvas.offsetHeight);
        const mx = Math.max(0, 1 - (drag.el.offsetWidth + 18) / cw), my = Math.max(0, 1 - (drag.el.offsetHeight + 14) / ch);
        drag.n.x = Math.min(mx, Math.max(0, drag.ox + (p.clientX - drag.sx) / cw));
        drag.n.y = Math.min(my, Math.max(0, drag.oy + (p.clientY - drag.sy) / ch));
        drag.el.style.left = (drag.n.x * 100).toFixed(2) + '%';
        drag.el.style.top = (drag.n.y * 100).toFixed(2) + '%';
        drawSoon();
      }
      if (draft) {
        const b = canvas.getBoundingClientRect();
        draft.el.setAttribute('d', curve(draft.start, { x: p.clientX - b.left, y: p.clientY - b.top }));
      }
    };
    const onUp = e => {
      if (drag) { drag.el.classList.remove('drag'); drag = null; save(); }
      if (draft) {
        const p = point(e);
        const hit = document.elementFromPoint(p.clientX, p.clientY);
        const pin = hit && hit.closest && hit.closest('.port.in');
        const to = pin && pin.closest('.node').dataset.id;
        const from = draft.from;
        draft.el.remove(); draft = null; clearSrc();
        if (!addLink(from, to)) drawWires();
      }
    };
    box.addEventListener('mousedown', onDown);
    box.addEventListener('touchstart', onDown, { passive: false });
    box.addEventListener('keydown', e => {
      const port = e.target.closest('.port');
      if (!port || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      const id = port.closest('.node').dataset.id;
      if (port.dataset.side === 'out') { keyFrom = id; clearSrc(); port.classList.add('src'); toast('已选择连线起点，请选择输入端口'); }
      else if (keyFrom) { addLink(keyFrom, id); keyFrom = null; clearSrc(); }
    });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('resize', drawSoon);
    topoOff = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', drawSoon);
      if (raf) cancelAnimationFrame(raf);
      topoOff = null;
    };
    $('#topoReset').addEventListener('click', () => {
      store.del(TOPO_KEY);
      renderStage();
      toast('已重置');
    });
    draw();
  }
  // ---------- Toast / 复制 ----------
  let toastT = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 1600);
  }
  async function copy(text, okMsg) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('no clipboard');
      await navigator.clipboard.writeText(text);
      toast(okMsg);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      toast(ok ? okMsg : '复制失败，请手动复制');
    }
  }

  // ---------- 命令面板（Ctrl/⌘ K 或 /）：跨分区搜设备、时期、分区与操作 ----------
  const pal = $('#palette'), input = $('#q'), palList = $('#paletteList');
  let results = [], cursor = 0, palFrom = null;
  const specText = v => Array.isArray(v) ? v.join(' ') : v;
  const HAY = new WeakMap();
  function hay(d) {
    let h = HAY.get(d);
    if (h === undefined) {
      h = (d.kind === 'era'
        ? [d.h.period, d.h.tag, d.h.title, ...d.h.body]
        : [d.title, d.sub, d.badge, d.flag, d.tags, d.footL, d.footR, d.group, ...(d.specs || []).map(([k, v]) => k + ' ' + specText(v))]
      ).join(' ').toLowerCase();
      HAY.set(d, h);
    }
    return h;
  }
  const tokens = () => state.q.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (text, toks) => toks.every(t => text.includes(t));
  // 命中片段：优先展示命中的那一行规格
  function snippetOf(d, toks) {
    if (!toks.length) return d.kind === 'era' ? `${d.from} – ${d.to} · ${d.h.tag}` : (d.badge || d.sub || '');
    const lines = d.kind === 'era' ? d.h.body : (d.specs || []).flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map(x => `${k} · ${x}`));
    const line = [d.sub, ...lines].find(l => l && toks.some(t => l.toLowerCase().includes(t)));
    if (!line) return d.kind === 'era' ? d.h.tag : (d.badge || '');
    const at = line.toLowerCase().indexOf(toks.find(t => line.toLowerCase().includes(t)));
    return (at > 28 ? '…' + line.slice(at - 20) : line).slice(0, 120);
  }
  const ACTIONS = [
    { label: '一键展开 / 收起全部规格', sub: '清单 ↔ 全规格（E）', icon: 'doc', run: () => setMode() },
    { label: '切换配色', sub: THEMES.map(t => t.name).join(' / ') + '（T）', icon: 'bolt', run: cycleTheme },
    { label: '复制当前条目链接', sub: '深链直达检视器', icon: 'link', run: () => act('link') },
    { label: '重置拓扑布局', sub: '恢复默认节点位置与连线', icon: 'reset', run: () => { store.del(TOPO_KEY); if (state.tab === 'topology') renderStage(); else go('topology'); toast('已重置'); } }
  ];
  function buildResults() {
    const toks = tokens();
    const out = [];
    const tabsHit = TABS.filter(t => !toks.length || hit(`${t.name} ${t.label} ${t.short} ${t.id}`.toLowerCase(), toks));
    tabsHit.forEach(t => out.push({ group: '分区', icon: TAB_ICON[t.id], title: `${t.idx} · ${t.label}`, sub: t.id === 'topology' ? `${TOPO_SEED.nodes.length} 节点` : `${BY_TAB[t.id].length} 条`, run: () => go(t.id) }));
    if (toks.length) {
      const score = d => { const t = titleOf(d).toLowerCase(); return t.includes(toks[0]) ? 0 : (d.badge || '').toLowerCase().includes(toks[0]) ? 1 : 2; };
      const devs = DEVICES.filter(d => hit(hay(d), toks)).sort((a, b) => score(a) - score(b)).slice(0, 40);
      devs.forEach(d => out.push({ group: '设备', icon: TAB_ICON[d.tab], title: d.title, sub: snippetOf(d, toks), st: d.status, right: `${tabOf(d.tab).name} · ${stLabel(d.status)}`, run: () => go(d.tab, d.id) }));
      ERAS.filter(e => hit(hay(e), toks)).forEach(e => out.push({ group: '编年史', icon: 'timeline', title: `P${e.p} · ${e.h.title}`, sub: snippetOf(e, toks), right: `${e.from} – ${e.to}`, run: () => go('history', e.id) }));
    }
    ACTIONS.filter(a => !toks.length || hit((a.label + ' ' + a.sub).toLowerCase(), toks)).forEach(a => out.push({ group: '操作', icon: a.icon, title: a.label, sub: a.sub, run: a.run }));
    return out;
  }
  function renderPalette() {
    results = buildResults();
    cursor = Math.min(cursor, Math.max(0, results.length - 1));
    if (!results.length) { palList.innerHTML = `<div class="pal-empty">没有匹配 “${esc(state.q)}” 的设备或时期</div>`; input.removeAttribute('aria-activedescendant'); return; }
    let g = '';
    palList.innerHTML = results.map((r, i) => {
      const hd = r.group !== g ? `<div class="pal-hd" role="presentation">${esc((g = r.group))}</div>` : '';
      return `${hd}<div class="pal-item" role="option" id="pal-${i}" data-run="${i}" aria-selected="${i === cursor}"${r.st ? ` data-st="${r.st}"` : ''}>
        ${icon(r.icon || 'arrow')}<div style="min-width:0"><div class="pal-item__t">${hl(r.title)}</div>${r.sub ? `<div class="pal-item__s">${hl(r.sub)}</div>` : ''}</div>
        ${r.right ? `<span class="pal-item__r">${r.st ? '<i class="led"></i>' : ''}${esc(r.right)}</span>` : ''}</div>`;
    }).join('');
    input.setAttribute('aria-activedescendant', 'pal-' + cursor);
  }
  function setCursor(i) {
    if (!results.length) return;
    cursor = (i + results.length) % results.length;
    palList.querySelectorAll('.pal-item').forEach(el => el.setAttribute('aria-selected', String(+el.dataset.run === cursor)));
    input.setAttribute('aria-activedescendant', 'pal-' + cursor);
    const el = $('#pal-' + cursor);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }
  const palOpen = () => !pal.hidden;
  function openPalette(q) {
    if (palOpen()) { input.select(); return; }
    palFrom = document.activeElement;
    pal.hidden = false;
    document.body.classList.add('lock');
    input.value = q || '';
    state.q = input.value.trim();
    cursor = 0;
    renderPalette();
    input.focus();
    input.select();
  }
  function closePalette(restore = true) {
    if (!palOpen()) return;
    pal.hidden = true;
    if (!isOpen()) document.body.classList.remove('lock');
    state.q = '';
    if (restore) (palFrom && document.contains(palFrom) ? palFrom : stage).focus({ preventScroll: true });
  }
  function runResult(i) {
    const r = results[i];
    if (!r) return;
    closePalette(false);
    r.run();
  }
  let palT = 0;
  input.addEventListener('input', () => {
    clearTimeout(palT);
    palT = setTimeout(() => { state.q = input.value.trim(); cursor = 0; renderPalette(); palList.scrollTop = 0; }, 60);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(cursor + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(cursor - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); clearTimeout(palT); state.q = input.value.trim(); results = buildResults(); runResult(Math.min(cursor, results.length - 1)); }
    else if (e.key === 'Tab') e.preventDefault(); // 面板里只有一个输入框，Tab 不外逃
  });
  palList.addEventListener('mousemove', e => { const it = e.target.closest('[data-run]'); if (it && +it.dataset.run !== cursor) setCursor(+it.dataset.run); });
  // ---------- 全局事件 ----------
  document.addEventListener('click', e => {
    const run = e.target.closest('.palette [data-run]');
    if (run) { runResult(+run.dataset.run); return; }
    if (e.target.closest('.palette [data-close]')) { closePalette(); return; }
    if (e.target.closest('#cmdOpen')) { openPalette(); return; }
    const th = e.target.closest('[data-theme-id]');
    if (th) { applyTheme(th.dataset.themeId, true); return; }
    const tab = e.target.closest('[data-tab]');
    if (tab) { if (tab.dataset.tab === state.tab && FLOW.matches) window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }); else setTab(tab.dataset.tab); return; }
    const chip = e.target.closest('[data-filter]');
    if (chip) {
      state.status = chip.dataset.filter;
      renderStage();
      const c = $(`[data-filter="${CSS.escape(chip.dataset.filter)}"]`, stage);
      if (c) c.focus();
      persist(false);
      return;
    }
    const mode = e.target.closest('[data-mode]');
    if (mode) { setMode(mode.dataset.mode); return; }
    const pick = e.target.closest('[data-pick]');
    if (pick) { select(pick.dataset.pick, { open: true, scroll: !pick.classList.contains('row') }); return; }
    const a = e.target.closest('[data-act]');
    if (a && !a.disabled) act(a.dataset.act, a);
  });

  document.addEventListener('keydown', e => {
    const k = e.key;
    if ((e.ctrlKey || e.metaKey) && (k === 'k' || k === 'K')) { e.preventDefault(); palOpen() ? closePalette() : openPalette(); return; }
    if (k === 'Escape') {
      if (palOpen()) { e.preventDefault(); closePalette(); return; }
      if (isOpen()) { e.preventDefault(); closeOverlay(); }
      return;
    }
    if (palOpen()) return; // 面板自己处理方向键与回车
    // 窄屏检视层：焦点陷阱
    if (k === 'Tab' && isOpen()) {
      const f = [...$('#insp').querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    const typing = e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]');
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === '/') { e.preventDefault(); openPalette(); return; }
    if (k === 'e' || k === 'E') { setMode(); return; }
    if (k === 't' || k === 'T') { cycleTheme(); return; }
    const listy = hasItems(state.tab) && state.mode !== 'full';
    if (listy && (k === 'j' || k === 'J' || (k === 'ArrowDown' && !isOpen()))) { e.preventDefault(); move(1); return; }
    if (listy && (k === 'k' || k === 'K' || (k === 'ArrowUp' && !isOpen()))) { e.preventDefault(); move(-1); return; }
    const n = parseInt(k, 10);
    if (n >= 1 && n <= TABS.length && !isOpen()) setTab(TABS[n - 1].id);
  });

  // 宽屏 ⇄ 窄屏切换：关闭覆盖层；进入宽屏时补上默认选中
  const onFlow = () => {
    if (!FLOW.matches) {
      closeOverlay(false);
      document.body.classList.remove('lock');
      if (hasItems(state.tab) && state.mode !== 'full' && !state.sel[state.tab]) renderStage();
    }
  };
  if (FLOW.addEventListener) FLOW.addEventListener('change', onFlow); else FLOW.addListener(onFlow);

  // 浏览器前进 / 后退：URL 为唯一来源
  window.addEventListener('hashchange', () => {
    const h = parseHash();
    if (palOpen()) closePalette(false);
    const tab = h.tab || (h.d && BY_ID.get(h.d).tab) || state.tab;
    if (tab !== state.tab) setTab(tab, { push: false, animate: false });
    if (h.d && BY_ID.get(h.d).tab === state.tab) {
      if (state.mode === 'full' || (state.status !== 'all' && BY_ID.get(h.d).status !== state.status)) { state.mode = 'list'; state.status = 'all'; state.sel[state.tab] = h.d; renderStage(); }
      if (state.sel[state.tab] !== h.d || (FLOW.matches && !isOpen())) select(h.d, { open: true });
    } else if (!h.d && isOpen()) closeOverlay();
    if (h.q) openPalette(h.q);
  });

  // ---------- 启动 ----------
  (function boot() {
    const v = $('#siteVersion');
    if (v && SITE.version) v.textContent = 'v' + SITE.version;
    const h = parseHash();
    const saved = store.get('ga.tab');
    state.tab = h.tab || (h.d && BY_ID.get(h.d).tab) || (tabOf(saved) ? saved : 'rigs');
    if (h.d && BY_ID.get(h.d).tab !== state.tab) state.tab = BY_ID.get(h.d).tab;
    if (h.d) state.sel[state.tab] = h.d;
    // 兼容旧版「一键展开」开关
    const m = store.get('ga.mode');
    state.mode = m === 'full' || (!m && store.get('ga.expand') === '1') ? 'full' : 'list';
    if (h.d) state.mode = 'list';
    renderThemes();
    applyTheme(document.documentElement.dataset.theme || store.get('ga.theme') || THEMES[0].id, false);
    renderSectors();
    renderSys();
    renderStatus();
    renderStage();
    tickClock();
    setInterval(tickClock, 1000);
    if (h.d && FLOW.matches) openOverlay();
    persist(false); // 写入基准记录，保证第一次「后退」有反应
    if (h.q) openPalette(h.q);
  })();
})();
