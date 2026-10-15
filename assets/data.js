// GEEK ARSENAL 数据层：页面上的所有设备、编年史与拓扑都来自这里。
// 改设备只改这个文件。状态改 status，KPI（核心数 / 存储 / 显存 / 跨度）会自动重算。
//   status: active 现役 · family 家人使用 · spare 备用/收藏 · sold 已售 · dead 报废/待修 · vault 仓储
//   cores: 计入「现役计算核心」（仅台式节点与笔记本）
//   storageGB / vramGB: 计入「在线 / 近线存储」与「现役独显显存」（仅 status=active 的设备）
//   accent: cyan | violet | lime | amber | rose | slate
'use strict';

const SITE = { version: '2026.10', name: 'GEEK ARSENAL', since: 2006 };

const TABS = [
  {
    "id": "rigs",
    "idx": "01",
    "name": "计算",
    "short": "节点",
    "label": "现役计算节点",
    "icon": "fa-desktop"
  },
  {
    "id": "laptops",
    "idx": "02",
    "name": "笔电",
    "short": "笔电",
    "label": "笔记本矩阵",
    "icon": "fa-laptop"
  },
  {
    "id": "mobile",
    "idx": "03",
    "name": "移动",
    "short": "手机",
    "label": "影像旗舰与特种移动终端",
    "icon": "fa-mobile-screen"
  },
  {
    "id": "topology",
    "idx": "04",
    "name": "拓扑",
    "short": "拓扑",
    "label": "拓扑架构与数据流",
    "icon": "fa-diagram-project",
    "special": true
  },
  {
    "id": "history",
    "idx": "05",
    "name": "编年",
    "short": "编年",
    "label": "20年编年史 (2006-2026)",
    "icon": "fa-timeline",
    "special": true
  },
  {
    "id": "spares",
    "idx": "06",
    "name": "仓储",
    "short": "备件",
    "label": "战备仓储与备件",
    "icon": "fa-box-archive"
  },
  {
    "id": "peripherals",
    "idx": "07",
    "name": "外设",
    "short": "外设",
    "label": "外设军团 (键鼠/音频)",
    "icon": "fa-computer-mouse"
  }
];

const STATUS_ORDER = [
  "active",
  "family",
  "spare",
  "sold",
  "dead",
  "vault"
];

const STATUS = {
  "active": {
    "label": "现役"
  },
  "family": {
    "label": "家人使用"
  },
  "spare": {
    "label": "备用/收藏"
  },
  "sold": {
    "label": "已售"
  },
  "dead": {
    "label": "报废/待修"
  },
  "vault": {
    "label": "仓储"
  }
};

const DEVICES = [
  {
    "id": "node-01",
    "tab": "rigs",
    "status": "active",
    "accent": "cyan",
    "cores": 8,
    "badge": "NODE-01 // 主力电竞与渲染台",
    "flag": "2K/4K 满血光追",
    "title": "AMD Ryzen™ 7 5700X + ASUS Dual 雪豹 RTX™ 4070 SUPER EVO OC 12GB",
    "sub": "ASRock B450M-HDV R1.0 极限压榨 / 内存 FCLK 1933MHz 1:1 同步超至 3866 C18",
    "tags": "5700x 4070s 4070 super evo oc dual-rtx4070s-o12g-evo 雪豹 b450m 3866 vermeer ad104 s790e 幻隐 hs2000 orico y20 wd10ezex-08wn4a0",
    "specs": [
      [
        "CPU",
        "AMD Ryzen™ 7 5700X 8-Core 16-Thread Desktop Processor (Socket AM4, Vermeer B2, TSMC 7nm FinFET, 3.4–4.6GHz, 32MB L3, TDP 65W, 默频 PPT 76W)"
      ],
      [
        "主板",
        "ASRock (华擎) B450M-HDV R1.0 Micro-ATX Motherboard (AMD Promontory B450, 4+2相供电, Realtek ALC887 + RTL8111H, PCIe 3.0 x16, AGESA Combo-AM4v2 1.2.0.7)"
      ],
      [
        "内存",
        "Gloway (光威) 32GB (16GB × 2) DDR4 3600MHz CL18 (SK Hynix CJR/DJR 颗粒 → 手工超频至 DDR4 3866MHz CL18-22-22-42 1.40V, FCLK 1933MHz 1:1, VSOC 1.125V)"
      ],
      [
        "显卡",
        "ASUS Dual 雪豹 GeForce RTX™ 4070 SUPER EVO OC 12GB 黑色 (DUAL-RTX4070S-O12G-EVO, AD104-350-A1, 7168 CUDA, 224 TMU, 80 ROP, 192-bit 21Gbps, 504GB/s, 220W TGP, Boost OC 2550 / Gaming 2520MHz, 2.5 槽 227.2×123.2×49.6mm, 1×16-pin, SFF-Ready)"
      ],
      [
        "存储阵列 (4盘 · 4TB)",
        [
          "Fanxiang 梵想 S790E 1TB M.2 2280 PCIe 4.0 x4 NVMe · 联芸 MAP1602 DRAM-less + 长江存储 · 标称读 7100 / 写 6100（B450M-HDV 的 M.2 为 PCIe 3.0 x4，本机降速至约 3500MB/s）",
          "幻隐 HS2000 1TB 2.5\" SATA 6Gb/s · 标称读 520MB/s / 写 470MB/s · 3D TLC",
          "ORICO Y20 1TB 2.5\" SATA 6Gb/s · 100×70×7mm · 标称读 480MB/s / 写 500MB/s · 300TBW",
          "WDC WD10EZEX-08WN4A0 1TB 3.5\" SATA 6Gb/s 7200RPM 64MB CMR"
        ]
      ],
      [
        "电源",
        "Great Wall (长城) 猎金 F8 850W 80 PLUS Platinum Full Modular Power Supply (全日系105℃电容, LLC+DC-DC, ATX 3.1 / PCIe 5.1)"
      ]
    ],
    "footL": "丐板上的绝技：3866MHz FCLK 1933 极限低延迟",
    "footR": "PCIe 3.0 性能损耗 < 2%",
    "storageGB": 4000,
    "vramGB": 12
  },
  {
    "id": "node-02",
    "tab": "rigs",
    "status": "active",
    "accent": "violet",
    "cores": 10,
    "badge": "NODE-02 // 本地 AI 推理与日常工作台",
    "flag": "Ollama / ComfyUI 专用",
    "title": "Intel® Core™ i5-13400TEF + GALAXY 影驰 RTX™ 2060 12GB",
    "sub": "35W 特挑低压工控/SI 定制 U 解锁 PL1/PL2 全核 3.9GHz + 12GB 大显存平民 AI 生产力",
    "tags": "13400tef 2060 12g 影驰 galax b660m 日常机 ai大模型 tu106 ollama comfyui raptorlake snv3s1000g rbusns8180s3512gj maxsun x5 wd5000aakx-001ca0",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i5-13400TEF Processor（Raptor Lake, 10C/16T: 6P+4E, 20MB Smart Cache, 工控/行业定制版 = 13400F 低功耗无核显版; PBP 35W / MTP 82W, 官方最高睿频 4.50GHz；解锁功耗后全核 3.9GHz。Mouser CM8071505104107 / Intel PCN845263）"
      ],
      [
        "主板",
        "ASUS PRIME B660M-K D4 Micro-ATX Motherboard (Intel® B660 Chipset, 6+1+1 相 DrMOS 供电, 2×PCIe 4.0 x4 M.2, 1GbE LAN)"
      ],
      [
        "内存",
        "Teclast (台电) 32GB (16GB × 2) DDR4 2666MHz（手工超频至 DDR4 3200MHz CL18-20-20-40 1.35V）"
      ],
      [
        "显卡",
        "GALAXY 影驰 GeForce RTX™ 2060 12GB 骁将MAX Pro (双 90mm 星将散热, TU106-300, 2176 CUDA, 272 Tensor Gen2, 34 RT Gen1, 12GB GDDR6 192-bit 14Gbps, 336GB/s, Boost 1650MHz)"
      ],
      [
        "存储阵列",
        [
          "Kingston NV3 SNV3S1000G 1TB M.2 2280 PCIe 4.0 x4 NVMe · DRAM-less HMB · 3D QLC · 标称读 6000 / 写 4000 · 320TBW · SN 50026B7283975A9D",
          "Kingston RBUSNS8180S3512GJ 512GB M.2 2280 SATA 6Gb/s · OEM 设计导入盘 · 512GB 档标称读 550 / 写 510 · SN 50026B76834F5F96",
          "MAXSUN 铭瑄 终结者 X5 480GB 2.5\" SATA 6Gb/s · 512MB 缓存 · 标称读 550 / 写 480 · 100×69.8×6.9mm · SN MX106A3B60000000008",
          "WDC WD5000AAKX-001CA0 WD Blue 500GB 3.5\" SATA 6Gb/s 7200RPM 16MB CMR · 标称持续约 126MB/s · 147×101.6×26.1mm · SN WD-WCAYUR467642"
        ]
      ],
      [
        "电源",
        "Huntkey (航嘉) JUMPER 750 (750W 80 PLUS Bronze Power Supply, 双管正激 + DC-DC 架构)"
      ]
    ],
    "footL": "12GB VRAM 完美承载 LLaMA-3 8B / Qwen 2.5",
    "footR": "颗粒归仓级多盘挂载",
    "storageGB": 2492,
    "vramGB": 12
  },
  {
    "id": "node-03",
    "tab": "rigs",
    "status": "active",
    "accent": "lime",
    "cores": 4,
    "badge": "NODE-03 // 近线存储与流媒体转码节点",
    "flag": "36.1TB 裸容量",
    "title": "Intel® Core™ i7-2600 + NVIDIA RTX™ A2000M 8GB + 2×14TB HMSMR",
    "sub": "驾驭主机托管叠瓦 (HMSMR / ZAC 指令集) + 70W 专业卡硬解多路 4K 串流",
    "tags": "i7 2600 z77 a2000m 肥猫 hmsmr 14t storage node nas 转码 ga107 sandybridge hts721010a9e630 hs2000 kimmidi t900 pylon650b",
    "specs": [
      [
        "计算平台",
        "Intel® Core™ i7-2600 Processor (Sandy Bridge 32nm, 4C/8T, 3.4–3.8GHz, 8MB L3, 95W TDP) + GIGABYTE GA-Z77X-D3H ATX Motherboard (Intel® Z77, 6+2+1 相全固态, 原生板载 mSATA) · 运行 飞牛OS (fnOS) 私有云"
      ],
      [
        "内存",
        "32GB (8GB × 4) DDR3-1600 @ 1333MHz CL9：HyperX 8GB ×2 + 威刚万紫千红 8GB ×2"
      ],
      [
        "转码显卡",
        "肥猫家魔改 NVIDIA RTX A2000 Mobile 8GB GDDR6 (GA107, 2560 CUDA, 80 TMUs, 48 ROPs, 128-bit, 70W TGP, 第7代 NVENC / AV1 硬件解码)"
      ],
      [
        "存储阵列拓扑 (36.1TB)",
        [
          "2× Western Digital Ultrastar DC HC620 14TB 3.5\"：HSH721414ALE6M0, 7200RPM, 512MB Buffer, Host-Managed SMR (HMSMR / ZBC/ZAC) 充氦盘 (Zoned Block 调度)",
          "1× Seagate BarraCuda 4TB 3.5\" Desktop HDD (ST4000DM004, 5400RPM, 256MB 缓存)",
          "1× Toshiba DT01ACA100 1TB 3.5\" 7200RPM Desktop HDD (32MB 缓存)",
          "1× Seagate ST1000DM003 1TB 3.5\" 7200RPM Desktop HDD (64MB 缓存)",
          "1× HGST Travelstar 7K1000 HTS721010A9E630 1TB 2.5\" 7200RPM 9.5mm 32MB SATA 6Gb/s",
          "1× 幻隐 HS2000 1TB 2.5\" SATA 6Gb/s",
          "1× KimMiDi SSD T900 128GB mSATA SATA 6Gb/s · Z77 板载 mSATA 引导"
        ]
      ],
      [
        "电源",
        "XPG PYLON 650W · PYLON650B-BKCJP · 80 PLUS Bronze"
      ]
    ],
    "footL": "掌握 Host-Managed SMR 底层分区技术",
    "footR": "Jellyfin 4K 实时转码",
    "storageGB": 36128,
    "vramGB": 8
  },
  {
    "id": "node-04",
    "tab": "rigs",
    "status": "active",
    "accent": "slate",
    "cores": 4,
    "badge": "NODE-04 // 边缘应用与 QQ 机器人节点",
    "flag": "6W 极低待机",
    "title": "中柏 Jumper N100 双网口迷你主机",
    "sub": "32GB 扩容 · 飞牛OS (fnOS) 常驻 QQ 机器人与 AdGuard 广告过滤",
    "tags": "n100 jumper 中柏 双网口 迷你主机 32g 飞牛 fnos qq机器人 napcat astrobot adguard docker gracemont 6w thnsn5128gpu7",
    "specs": [
      [
        "SoC",
        "Intel® Processor N100 (Alder Lake-N, Intel 7, 4C/4T Gracemont 全能效核, 睿频 3.4GHz, 6MB Smart Cache, 6W Base TDP, 解锁 PL1 15W)"
      ],
      [
        "核显",
        "Intel® UHD Graphics (24 EUs @ 750MHz, 支持 AV1 / HEVC 10-bit 4K/8K 硬件解码)"
      ],
      [
        "内存",
        "Gloway (光威) 32GB DDR4 2666MHz SO-DIMM"
      ],
      [
        "存储配置",
        [
          "OS: Toshiba XG3 THNSN5128GPU7 128GB M.2 2280 PCIe 3.0 x4 NVMe · 读 2100 / 写 600",
          "Data SSD: 梵想 S100 Pro 500GB 2.5\" SATA 6Gb/s · 标称读约 550MB/s"
        ]
      ],
      [
        "常驻服务",
        "飞牛OS (fnOS) · QQ 机器人 (ASTRBOT + NAPCAT) · AdGuard Home 广告过滤 · 轻量私有云"
      ]
    ],
    "footL": "QQ 机器人 + 广告过滤 7×24 常驻",
    "footR": "24×365 不间断运行",
    "storageGB": 628
  },
  {
    "id": "mobile-01",
    "tab": "laptops",
    "status": "active",
    "accent": "cyan",
    "cores": 10,
    "badge": "MOBILE-01 // 商务旗舰魔改本",
    "flag": "现役主力",
    "title": "HP Elite Dragonfly 13.5 inch Chromebook",
    "sub": "CNC 镁合金机身 + 13.5 英寸 3:2 广色域触控屏，自费购入 Coolstar 独立声卡与雷电驱动",
    "tags": "hp dragonfly chromebook 1245u win11 笔记本 驱动完美 3:2 镁合金 coolstar vpro 现役",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i5-1245U Processor (Alder Lake-U, 10C/12T: 2P@1.2–4.4GHz + 8E, 12MB L3, 15W, Intel vPro®)"
      ],
      [
        "RAM/ROM",
        "16GB LPDDR4x-4266 双通道 + 致态 TiPlus5000 512GB M.2 2280 PCIe 3.0 x4 NVMe · 读 3500 / 写 2700"
      ],
      [
        "屏幕",
        "13.5\" 3:2 QHD+ IPS 触控 (2256×1504 / 400nits / 100% sRGB / 康宁大猩猩 5)"
      ],
      [
        "显卡",
        "Intel® Iris® Xe Graphics G7 80EU"
      ],
      [
        "机身",
        "1.27kg 镁铝混合 CNC · 16.5×294×222mm · 50Wh 四电芯 · 双 Thunderbolt™ 4 40Gbps + USB-A + HDMI + microSD · Bang & Olufsen 四扬声器 · 指纹 · MrChromebox Full ROM 刷入 Windows 11 Pro（Coolstar 声卡 / 雷电驱动满血）"
      ]
    ],
    "footL": "顶级做工的 Windows 旗舰便携平替"
  },
  {
    "id": "jumper-ezpad-8",
    "tab": "laptops",
    "status": "active",
    "badge": "COMPACT TABLET",
    "flag": "现役",
    "title": "Jumper EZpad 8 · 10.1\" 便携平板 (4+64)",
    "sub": "中柏 EZpad 8，Intel Celeron N3350 入门 Windows 平板，轻量办公与随身终端",
    "tags": "ezpad 8 jumper 中柏 n3350 平板 4+64 10.1 现役 windows",
    "specs": [
      [
        "CPU",
        "Intel Celeron N3350 (Apollo Lake, 2C/2T, 1.1–2.4GHz)"
      ],
      [
        "RAM/ROM",
        "4GB + 64GB eMMC"
      ],
      [
        "屏幕",
        "10.1\" 1280×800 IPS 触控屏"
      ],
      [
        "显卡",
        "Intel HD Graphics 500 (12 EU)"
      ],
      [
        "机身",
        "约 580g · 247×167×10mm · 26.6Wh · USB + micro-HDMI + TF + 双频 Wi-Fi + 蓝牙 + OTG · Windows 10 便携平板"
      ]
    ],
    "footL": "N3350 10.1 寸入门便携平板",
    "footR": "Active"
  },
  {
    "id": "acer-chromebook-spin",
    "tab": "laptops",
    "status": "family",
    "accent": "slate",
    "cores": 4,
    "badge": "FAMILY LAPTOP // 3:2 QHD 翻转触控本",
    "flag": "家里 · 爸爸在用",
    "title": "Acer Chromebook Spin 13 (CP713-1WN-811P)",
    "sub": "全铝合金 360° 翻转机身 + 2256×1504 2K 3:2 触控屏，刷好 Windows 10，现放在家里给爸爸用",
    "tags": "acer spin 13 8650u 3:2 翻转本 笔记本 chromebook 刷机 cp713 wacom 1866 家人使用 爸爸 家用",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i7-8650U Processor (Kaby Lake Refresh 14nm++, 4C/8T, 1.9–4.2GHz, 8MB Cache)"
      ],
      [
        "RAM/ROM",
        "16GB LPDDR3-1866 板载双通道 + 128GB eMMC"
      ],
      [
        "屏幕",
        "13.5\" 3:2 QHD IPS 触控 (2256×1504) · 内置 Wacom EMR 电磁笔仓"
      ],
      [
        "显卡",
        "Intel® UHD Graphics 620"
      ],
      [
        "机身",
        "1.50kg 全铝 360° 翻转 · 约 18×309×245mm · 54Wh (4670mAh) 三电芯 / 官方约 10h · Coreboot UEFI 刷入 Windows 10 Pro，驱动全点亮"
      ]
    ],
    "footL": "3:2 纵向大视野高分阅读与轻办公终端",
    "footR": "Family"
  },
  {
    "id": "hp-elite-dragonfly",
    "tab": "laptops",
    "status": "sold",
    "cores": 10,
    "badge": "HISTORICAL LAPTOP // 同款二号机",
    "flag": "已售出",
    "title": "HP Elite Dragonfly 13.5 inch Chromebook (256GB 原盘)",
    "sub": "990 元入手的完全同款第二台，保留出厂原版 256GB 固态，曾与 MOBILE-01 双机镜像互备，现已出手",
    "tags": "hp dragonfly chromebook 1245u win11 笔记本 256g 原版 990元 同款双机 驱动完美 3:2 镁合金 coolstar vpro 已售出",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i5-1245U Processor (Alder Lake-U, 10C/12T: 2P@1.2–4.4GHz + 8E, 12MB L3, 15W, Intel vPro®)"
      ],
      [
        "RAM/ROM",
        "16GB LPDDR4x-4266 双通道 + 原厂 256GB NVMe（与一号机出厂配置完全一致；一号机后自行换装 512G 致态）"
      ],
      [
        "屏幕",
        "13.5\" 3:2 QHD+ IPS 触控 (2256×1504 / 400nits / 100% sRGB / 康宁大猩猩 5)"
      ],
      [
        "显卡",
        "Intel® Iris® Xe Graphics G7 80EU"
      ],
      [
        "机身",
        "1.27kg 镁铝混合 CNC · 16.5×294×222mm · 50Wh 四电芯 · 双 Thunderbolt™ 4 40Gbps + USB-A + HDMI + microSD · Bang & Olufsen 四扬声器 · 指纹 · MrChromebox Full ROM 刷入 Windows 11 Pro（Coolstar 声卡 / 雷电驱动满血）"
      ]
    ],
    "footL": "990 元入手 · 256G 原盘 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "ipason-s2-14-0",
    "tab": "laptops",
    "status": "sold",
    "cores": 6,
    "badge": "HISTORICAL LAPTOP // 高能效出差轻薄本",
    "flag": "已售出",
    "title": "IPASON (攀升) 暴风龙 S2 14.0英寸轻薄本",
    "sub": "出 Latitude 7410 → 购入 暴风龙 S2，算力翻倍与轻量化兼备，现已出手",
    "tags": "攀升 暴风龙 s2 5600u 2k轻薄本 7410置换 笔记本 zen3 cezanne 151元 vega7 ipason 已售出 铨兴 p300 酷芯客 海力士 oem",
    "specs": [
      [
        "CPU",
        "AMD Ryzen™ 5 5600U Processor (Cezanne Zen 3, TSMC 7nm, 6C/12T, 2.3–4.2GHz, 16MB L3, 15W TDP)"
      ],
      [
        "RAM/ROM",
        "16GB (8GB × 2) DDR4-2666 攀升 OEM 海力士颗粒 + 铨兴 酷芯客 P300 512GB M.2 2280 NVMe PCIe 3.0 · 读 2800MB/s"
      ],
      [
        "屏幕",
        "14.0\" 16:10 IPS 2.5K (2560×1600 / 60Hz / 约 100% sRGB；本机键盘压痕微瑕)"
      ],
      [
        "显卡",
        "AMD Radeon™ Vega 7 (7 CU @ 1800MHz，核显)"
      ],
      [
        "机身",
        "约 1.30kg 镁铝合金 · 311.6×217.8×15.6mm · 50.16Wh + 65W PD · 双全功能 Type-C + 双 USB 3.0 + HDMI 2.0 + MicroSD · Wi-Fi 6 (RZ608) · 电源键指纹 · 原生 Windows"
      ]
    ],
    "footL": "仅花 151 元差价实现 CPU 多核与续航翻倍",
    "footR": "Sold Out"
  },
  {
    "id": "dell-latitude-7410",
    "tab": "laptops",
    "status": "sold",
    "cores": 4,
    "badge": "HISTORICAL LAPTOP",
    "flag": "799元已售出",
    "title": "DELL Latitude 7410 2-in-1 Chromebook Enterprise",
    "sub": "企业级翻转模具，刷好 Win10，驱动基本照抄 7410 Windows 版",
    "tags": "dell latitude 7410 2-in-1 chromebook 10610u win10 已售出 799元 ssstc cl1-3d128 2230 128g",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i7-10610U Processor (Comet Lake 14nm, 4C/8T, 1.8–4.9GHz, 8MB Cache, vPro)"
      ],
      [
        "RAM/ROM",
        "16GB DDR4 板载双通道 + SSSTC 128GB M.2 2230 PCIe 3.0 x4 NVMe · CL1-3D128-Q11"
      ],
      [
        "屏幕",
        "14.0\" FHD IPS 翻转触控 (1920×1080 / 约 300nits / 72% NTSC / 康宁大猩猩 6，支持主动笔)"
      ],
      [
        "显卡",
        "Intel® UHD Graphics"
      ],
      [
        "机身",
        "约 1.39–1.46kg 全铝碳纤 2-in-1 · 约 16.2mm · 4-cell 52Wh ExpressCharge / 65W Type-C · 刷 Win10，驱动照抄 7410 Windows 版 · 2023–2026.3"
      ]
    ],
    "footL": "历史置换功臣",
    "footR": "Sold Out"
  },
  {
    "id": "zx6-cu5da",
    "tab": "laptops",
    "status": "sold",
    "cores": 6,
    "badge": "COLLEGE WORKHORSE",
    "flag": "2026年已售 (内存硬盘留用)",
    "title": "神舟战神 ZX6-CU5DA 桌面端 CPU 游戏本",
    "sub": "大学时代（2020–2025）主力战斗机，搭载可更换的桌面级 LGA1200 处理器",
    "tags": "神舟 zx6 cu5da 10400 1650 战神 大学主力 已售出 固态留用 内存留用 rbusns8180s3512gj",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i5-10400 Desktop Processor (Comet Lake-S, 6C/12T, 2.9–4.3GHz, 12MB L3, 65W，LGA1200 可插拔)"
      ],
      [
        "RAM/ROM",
        "16GB (8G×2) DDR4-2666（双 SO-DIMM，平台上限 32GB）+ Kingston RBUSNS8180S3512GJ 512GB M.2 SATA + 后加 梵想 S790E 1TB（出售时内存与两块固态均拆下留用，Kingston 512G 现装在 NODE-02）"
      ],
      [
        "屏幕",
        "15.6\" 16:9 FHD IPS (1920×1080 / 144Hz)"
      ],
      [
        "显卡",
        "NVIDIA® GeForce® GTX 1650 4GB 128-bit (TU117 移动版)"
      ],
      [
        "机身",
        "约 2.3kg 15.6 寸游戏模具 · miniDP + HDMI + Type-C + 双 USB 3.2 + RJ45 · 官方续航约 2–3h 游戏/办公 · 服役 2020–2026"
      ]
    ],
    "footL": "大学时代核心战力",
    "footR": "Sold Out"
  },
  {
    "id": "iwork8-8-2-32",
    "tab": "laptops",
    "status": "sold",
    "badge": "COMPACT TABLET",
    "flag": "已售出",
    "title": "iWork8 · 8\" 双系统平板 (2+32)",
    "sub": "入门级 8 英寸 Windows/Android 双系统平板，2015 年便携折腾设备",
    "tags": "iwork8 8寸 windows平板 atom z3735f 2+32 双系统 已售出",
    "specs": [
      [
        "CPU",
        "Intel Atom Z3735F (Bay Trail-T, 4× Silvermont, 最高 1.83GHz)"
      ],
      [
        "RAM/ROM",
        "2GB DDR3L + 32GB eMMC"
      ],
      [
        "屏幕",
        "8\" 1280×800 IPS 电容触控"
      ],
      [
        "显卡",
        "Intel HD Graphics (Bay Trail, Gen7)"
      ],
      [
        "机身",
        "约 350g 级 8 寸板 · micro-USB/OTG + HDMI + TF · 约 3300–5000mAh 视批次 · Windows 8.1/10 + Android 双启动"
      ]
    ],
    "footL": "入门双系统折腾板",
    "footR": "Sold Out"
  },
  {
    "id": "msi-gt73evr-7rd",
    "tab": "laptops",
    "status": "dead",
    "accent": "rose",
    "cores": 4,
    "badge": "FAILED IN BATTLE",
    "flag": "显卡烧毁报废",
    "title": "MSI GT73EVR 7RD Titan (朋友赠送)",
    "sub": "17.3 英寸 Titan 桌面替代模具，朋友赠送、专职打游戏的纯游戏机。2025年高负载游戏时突然黑屏，显卡芯片虚焊/损坏功成身退",
    "tags": "msi gt73evr 7rd titan 7700hq 1060 朋友送 黑屏 显卡报废 已坏 hts721010a9e630 thnsn5128gpu7 kingston 2400",
    "specs": [
      [
        "CPU",
        "Intel® Core™ i7-7700HQ Processor (Kaby Lake 14nm, 4C/8T, 2.8–3.8GHz, 6MB Cache, 45W)"
      ],
      [
        "RAM/ROM",
        "16GB (8GB × 2) Kingston DDR4-2400 OEM + Toshiba XG3 THNSN5128GPU7 128GB M.2 2280 PCIe 3.0 x4 + HGST HTS721010A9E630 1TB 2.5\" 7200RPM 32MB"
      ],
      [
        "屏幕",
        "17.3\" FHD 1920×1080 120Hz 5ms 94% NTSC"
      ],
      [
        "显卡",
        "NVIDIA® GeForce® GTX 1060 6GB GDDR5（本机高负载烧毁，功成身退）"
      ],
      [
        "机身",
        "4.14kg Titan 桌面替代模具 · 428×287×24–49mm · Intel HM175 · 8-Cell 75Wh · 230W 适配器 · 服役 2023–2025，机械硬盘与零件拆解备用"
      ]
    ],
    "footL": "高负载战死沙场",
    "footR": "Defunct"
  },
  {
    "id": "oppo-find-x9",
    "tab": "mobile",
    "status": "active",
    "accent": "cyan",
    "badge": "FLAGSHIP DAILY DRIVER",
    "flag": "现役随身主力",
    "title": "OPPO Find X9 Pro 5G (PLG110)",
    "sub": "16GB LPDDR5X + 512GB UFS 4.1",
    "tags": "oppo find x9 pro x9pro plg110 主力手机 旗舰 拍照 dimensity 9500 2亿 长焦 哈苏 现役",
    "specs": [
      [
        "CPU",
        "MediaTek Dimensity 9500（TSMC 3nm N3P 全大核：1× Arm C1-Ultra 4.21GHz + 3× C1-Premium 3.5GHz + 4× C1-Pro 2.7GHz，16MB L3 + 10MB SLC，GPU Mali-G1 Ultra MC12）"
      ],
      [
        "RAM/ROM",
        "16GB LPDDR5X + 512GB UFS 4.1"
      ],
      [
        "屏幕",
        "6.78\" FHD+ (2772×1272, 450 PPI) 120Hz AMOLED 柔性屏 · P3 广色域 · 全局激发 1800nits"
      ],
      [
        "摄像头",
        "50MP 23mm F1.5 OIS 主摄 + 200MP 70mm F2.1 OIS 3× 长焦 + 50MP 15mm F2.0 超广角 + 丹霞色彩还原镜头 · 哈苏影像 · 前置 50MP"
      ],
      [
        "重量",
        "约 224g · 161.26 × 76.46 × 8.25mm"
      ],
      [
        "其他",
        "7500mAh 电池（80W 有线 / 50W 无线）· Wi-Fi 7 · USB 3.2 Gen 1 · 屏下超声指纹 · 替换 Z60S Pro，ColorOS 流畅生态与全焦段稳定成片"
      ]
    ],
    "footL": "日常主力通信",
    "footR": "Flagship Tier"
  },
  {
    "id": "sharp-aquos-r8",
    "tab": "mobile",
    "status": "active",
    "accent": "violet",
    "badge": "1-INCH LEICA OPTICS",
    "flag": "现役纯血日系",
    "title": "Sharp AQUOS R8 pro (Docomo SH-51D)",
    "sub": "12GB LPDDR5X + 256GB UFS 4.0 / Snapdragon® 8 Gen 2",
    "tags": "sharp aquos r8 pro 1英寸 徕卡 日系 手机 igzo summicron 240hz imx989 sh-51d 现役",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 8 Gen 2 SM8550（TSMC 4nm：1× Cortex-X3 3.2GHz + 2× A715 2.8GHz + 2× A710 2.8GHz + 3× A510 2.0GHz，8MB L3，GPU Adreno 740）"
      ],
      [
        "RAM/ROM",
        "12GB LPDDR5X + 256GB UFS 4.0"
      ],
      [
        "屏幕",
        "6.6\" Pro IGZO OLED (1260×2730, 1–240Hz 自适应变频, 2000nits 峰值, 10-bit Dolby Vision)"
      ],
      [
        "摄像头",
        "47.2MP 1.0 英寸 Sony IMX989 + Leica Summicron 19mm F1.9 7P 物理非球面镜头 + 14 通道多光谱传感器"
      ],
      [
        "重量",
        "约 203g · 161 × 77 × 9.3mm"
      ],
      [
        "其他",
        "独创外置金属镜头环被动导热结构 + IP68/MIL-STD-810H 防护认证 · 可扩 microSD"
      ]
    ],
    "footL": "纯血日系光学天花板",
    "footR": "Leica Tuned"
  },
  {
    "id": "sharp-aquos-r5g",
    "tab": "mobile",
    "status": "spare",
    "badge": "LAST LCD FLAGSHIP",
    "flag": "断触收藏",
    "title": "Sharp AQUOS R5G (SoftBank 906SH)",
    "sub": "12GB LPDDR5 + 256GB UFS 3.0 / Snapdragon® 865",
    "tags": "sharp r5g 末代lcd 120hz 240hz igzo 收藏 双水滴 865 3168x1440 softbank 906sh",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 865 SM8250（7nm：1× Kryo 585 Prime / Cortex-A77 2.84GHz + 3× A77 2.42GHz + 4× A55 1.8GHz，GPU Adreno 650）"
      ],
      [
        "RAM/ROM",
        "12GB LPDDR5 + 256GB UFS 3.0"
      ],
      [
        "屏幕",
        "6.5\" 3168×1440 QHD+ 120Hz (240Hz 插帧) Pro IGZO LCD 顶级护眼屏, 10亿色, 1000nit"
      ],
      [
        "摄像头",
        "48MP 8K 超广角 + 12.2MP OIS 主摄 + 12.2MP OIS 长焦 + ToF 3D"
      ],
      [
        "重量",
        "约 189g · 162 × 75 × 8.9mm"
      ],
      [
        "其他",
        "出现日系通病断触，作为 LCD 黄金时代的终极标杆永久封存珍藏"
      ]
    ],
    "footL": "护眼 LCD 时代最后的光辉",
    "footR": "Collection Tier"
  },
  {
    "id": "sony-xperia-5",
    "tab": "mobile",
    "status": "active",
    "badge": "21:9 COMPACT CINEMA",
    "flag": "现役影音",
    "title": "Sony Xperia 5 III 5G (XQ-BQ72)",
    "sub": "8GB LPDDR5 + 128GB UFS 3.1 / Snapdragon® 888",
    "tags": "xperia 5 iii 索尼 21:9 潜望 手机 蔡司 t* 888 70mm 105mm xq-bq72 现役",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 888 SM8350（Samsung 5nm：1× Kryo 680 Prime / Cortex-X1 2.84GHz + 3× A78 2.42GHz + 4× A55 1.8GHz，GPU Adreno 660）"
      ],
      [
        "RAM/ROM",
        "8GB LPDDR5 + 128GB UFS 3.1"
      ],
      [
        "屏幕",
        "6.1\" 21:9 CinemaWide FHD+ HDR 120Hz OLED 窄边框带鱼屏 (2520×1080)"
      ],
      [
        "摄像头",
        "12MP 主摄 (24mm F1.7 OIS) + 12MP 超广角 (16mm F2.2) + 12MP 双核对焦可变物理焦段长焦 (70mm F2.3 / 105mm F2.8) + Zeiss® T* 镀膜"
      ],
      [
        "重量",
        "168g · 157 × 68 × 8.2mm"
      ],
      [
        "其他",
        "68mm 极窄机身, 双段式物理快门按键, 3.5mm 独立耳机孔"
      ]
    ],
    "footL": "日系单手影音与 Alpha 相机微缩",
    "footR": "Zeiss T* Coated"
  },
  {
    "id": "lg-g7-thinq",
    "tab": "mobile",
    "status": "active",
    "accent": "lime",
    "badge": "HIFI AUDIO ENGINE",
    "flag": "现役无损转盘",
    "title": "LG G7 ThinQ (LM-G710)",
    "sub": "4GB + 64GB / Snapdragon® 845",
    "tags": "lg g7 hifi quad dac 音频 手机 sabre es9218p boombox 1000nit lm-g710 现役",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 845 SDM845（Samsung 10nm LPP：4× Kryo 385 Gold / Cortex-A75 2.8GHz + 4× A55 1.8GHz，GPU Adreno 630）"
      ],
      [
        "RAM/ROM",
        "4GB + 64GB"
      ],
      [
        "屏幕",
        "6.1\" 3120×1440 QHD+ 1000nit Super Bright RGBW LCD 阳光屏"
      ],
      [
        "摄像头",
        "16MP Super Bright F1.6 OIS 主摄 + 16MP F1.9 超广角 + 8MP F1.9 前置"
      ],
      [
        "重量",
        "162g · 153.2 × 71.9 × 7.9mm"
      ],
      [
        "其他",
        "ESS SABRE ES9218P 32-bit Quad DAC, 130dB SNR, 2Vrms 推动 600Ω 高阻大耳 · 专职无损音乐播放器、车载高保真音源解码与高阻抗耳机转盘"
      ]
    ],
    "footL": "老牌音乐手机绝唱",
    "footR": "Audiophile Transport"
  },
  {
    "id": "lenovo-xiaoxin-pad",
    "tab": "mobile",
    "status": "active",
    "accent": "cyan",
    "badge": "12.7\" ENTERTAINMENT HUB",
    "flag": "现役大屏终端",
    "title": "Lenovo Xiaoxin Pad Pro 12.7 (2025款)",
    "sub": "8GB LPDDR5X + 256GB UFS 4.0 / Dimensity 8300",
    "tags": "小新 pad pro 12.7 联想 平板 影音 天玑8300 jbl 10200mah 2944x1840 现役",
    "specs": [
      [
        "CPU",
        "MediaTek Dimensity 8300（TSMC 第二代 4nm：1× Cortex-A715 3.35GHz + 3× A715 3.2GHz + 4× A510 2.2GHz，4MB L3，GPU Mali-G615 MC6 @ 1.4GHz）"
      ],
      [
        "RAM/ROM",
        "8GB LPDDR5X + 256GB UFS 4.0"
      ],
      [
        "屏幕",
        "12.7 英寸 2.9K (2944×1840) 144Hz 高刷大屏, DCI-P3 广色域, 莱茵全局护眼"
      ],
      [
        "摄像头",
        "13MP 后置（AF）+ 8MP 前置"
      ],
      [
        "重量",
        "615g · 约 292 × 189 × 6.9mm"
      ],
      [
        "其他",
        "JBL 定制四扬声器 (杜比全景声) + 10200mAh 超大电池 (45W 快充) · 床头大屏流媒体消费、PDF 技术文档精读与轻度便携生产力"
      ]
    ],
    "footL": "大屏高刷影音天花板",
    "footR": "Dolby Atmos Quad"
  },
  {
    "id": "sharp-aquos-wish3",
    "tab": "mobile",
    "status": "active",
    "accent": "cyan",
    "badge": "TACTICAL ESIM TERMINAL",
    "flag": "现役特种",
    "title": "Sharp AQUOS wish3 (SH-53D)",
    "sub": "4GB LPDDR4X + 64GB UFS 2.1 / Dimensity 700",
    "tags": "wish3 esim 三防 备用 特种 dimensity700 sh-53d 现役",
    "specs": [
      [
        "CPU",
        "MediaTek Dimensity 700 MT6833（TSMC 7nm：2× Cortex-A76 2.2GHz + 6× A55 2.0GHz，GPU Mali-G57 MC2）"
      ],
      [
        "RAM/ROM",
        "4GB LPDDR4X + 64GB UFS 2.1"
      ],
      [
        "屏幕",
        "5.7\" HD+ (1520×720) 紧凑防摔屏"
      ],
      [
        "摄像头",
        "13MP F2.0 后置 (26mm 广角, AF) + 5MP F2.2 前置"
      ],
      [
        "重量",
        "约 161g · 147 × 70 × 8.9mm"
      ],
      [
        "其他",
        "60% 再生环保塑料, IPX5/7 + IP6X / MIL-STD-810H 18项防护 · 实体 nano-SIM + 原生海外 eSIM 双卡双待, 3730mAh 电池"
      ]
    ],
    "footL": "跨国通信与 eSIM 特种终端",
    "footR": "eSIM Ready"
  },
  {
    "id": "nubia-z60s-pro",
    "tab": "mobile",
    "status": "spare",
    "accent": "violet",
    "badge": "35MM DOCUMENTARY MASTER",
    "flag": "备用 / 摄影收藏",
    "title": "nubia Z60S Pro 5G (NX725J)",
    "sub": "16GB LPDDR5X + 512GB UFS 4.0 / Snapdragon 8 Gen 2 领先版",
    "tags": "z60spro 努比亚 nx725j 35mm 人文 摄影 备用 imx906 卫星通信",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 8 Gen 2 领先版 SM8550-AC（TSMC 4nm：1× Cortex-X3 3.36GHz + 2× A715 2.8GHz + 2× A710 2.8GHz + 3× A510 2.0GHz，8MB L3，GPU Adreno 740）"
      ],
      [
        "RAM/ROM",
        "16GB LPDDR5X + 512GB UFS 4.0"
      ],
      [
        "屏幕",
        "6.78\" 2800×1260 1.5K 120Hz 京东方 Q9+ AMOLED (2160Hz PWM)"
      ],
      [
        "摄像头",
        "50MP Sony IMX906 35mm F1.59 人文定焦 OIS 主摄 + 50MP 13mm 超广角/微距 + 8MP 80mm OIS 长焦"
      ],
      [
        "重量",
        "220g · 163.63 × 75.98 × 8.7mm"
      ],
      [
        "其他",
        "5100mAh 高密度单电芯 + 80W 快充 · 双向卫星通信 · 实体物理滑动开关"
      ]
    ],
    "footL": "被 Find X9 Pro 接替，转摄影收藏",
    "footR": "Camera Flag"
  },
  {
    "id": "samsung-galaxy-z",
    "tab": "mobile",
    "status": "dead",
    "accent": "rose",
    "badge": "FOLDABLE BROKEN",
    "flag": "内屏待修",
    "title": "Samsung Galaxy Z Flip4 5G (SM-F7210)",
    "sub": "8GB LPDDR5 + 256GB UFS 3.1 / Snapdragon 8+ Gen 1",
    "tags": "samsung galaxy z flip4 sm-f7210 折叠 内屏坏 dex 待修",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 8+ Gen 1 SM8475（TSMC 4nm：1× Cortex-X2 3.19GHz + 3× A710 2.75GHz + 4× A510 2.0GHz，6MB L3，GPU Adreno 730）"
      ],
      [
        "RAM/ROM",
        "8GB LPDDR5 + 256GB UFS 3.1"
      ],
      [
        "屏幕",
        "内屏 6.7\" Dynamic AMOLED 2X (1–120Hz LTPO, UTG 柔性玻璃损坏待修复) / 外屏 1.9\" Super AMOLED (大猩猩 Victus+)"
      ],
      [
        "摄像头",
        "12MP F1.8 广角 OIS + 12MP F2.2 123° 超广角 + 10MP F2.4 封面屏自拍"
      ],
      [
        "重量",
        "187g · 展开 165.2 × 71.9 × 6.9mm / 折叠 84.9 × 71.9 × 15.9–17.1mm"
      ],
      [
        "其他",
        "3700mAh 双电芯 + 25W 快充 / 15W 无线充 · USB-C 不支持视频输出，Flip 系列（Flip7 之前）不支持 Samsung DeX · 内屏损坏，待维修"
      ]
    ],
    "footL": "内屏损坏 / 待维修",
    "footR": "Repair Pending"
  },
  {
    "id": "acer-pawbo-p52",
    "tab": "mobile",
    "status": "spare",
    "badge": "SPARE TABLET",
    "flag": "纯备用",
    "title": "Acer Pawbo P52 Pro 10.8-inch Tablet",
    "sub": "6GB RAM + 128GB / Android OS · 纯备用",
    "tags": "acer pawbo p52 pro 平板 备用",
    "specs": [
      [
        "CPU",
        "MediaTek Helio X23 MT6797D（TSMC 20nm 十核：2× Cortex-A72 2.3GHz + 4× A53 1.85GHz + 4× A53 1.4GHz，GPU Mali-T880 MP4 @ 780MHz）"
      ],
      [
        "RAM/ROM",
        "6GB RAM + 128GB 高速存储"
      ],
      [
        "屏幕",
        "10.8 英寸 2560×1600 (2.5K WQXGA) 高分辨率 IPS 显示屏"
      ],
      [
        "摄像头",
        "8MP 后置（LED 闪光）"
      ],
      [
        "重量",
        "约 670g · 258 × 178 × 9.5mm"
      ],
      [
        "其他",
        "Android OS · 纯备用，闲置收纳"
      ]
    ],
    "footL": "10.8\" 2.5K 备用平板",
    "footR": "Spare"
  },
  {
    "id": "xiaomi-mi-10",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Xiaomi Mi 10 Lite Zoom (小米10青春版)",
    "sub": "8GB LPDDR4x + 256GB UFS 2.1 / Snapdragon 765G",
    "tags": "xiaomi mi10 lite zoom 小米10青春版 765g 潜望 已售出",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 765G SM7250-AB（Samsung 7nm EUV：1× Kryo 475 Prime / Cortex-A76 2.4GHz + 1× A76 2.2GHz + 6× A55 1.8GHz，内置 X52 5G，GPU Adreno 620）"
      ],
      [
        "RAM/ROM",
        "8GB LPDDR4x + 256GB UFS 2.1"
      ],
      [
        "屏幕",
        "6.57\" 2400×1080 Super AMOLED, HDR10+, 600nits, 康宁大猩猩 5"
      ],
      [
        "摄像头",
        "8MP 5倍光学潜望 / 50倍数码变焦 (分体式 OIS 光学防抖) + 48MP OV48B 主摄 + 120° 超广角"
      ],
      [
        "重量",
        "约 192g · 164.02 × 74.77 × 7.88mm"
      ],
      [
        "其他",
        "曾因 USB 数据通道烧毁仅支持慢充，现整机已售出"
      ]
    ],
    "footL": "5倍光学潜望青春版 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "sharp-aquos-r",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Sharp AQUOS R (au SHV39)",
    "sub": "4GB LPDDR4x + 64GB UFS / Snapdragon 835",
    "tags": "sharp aquos r shv39 835 igzo 120hz 已售出 au",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 835 MSM8998（Samsung 10nm FinFET：4× Kryo 280 Gold / Cortex-A73 2.45GHz + 4× A53 1.9GHz，GPU Adreno 540）"
      ],
      [
        "RAM/ROM",
        "4GB LPDDR4x + 64GB UFS"
      ],
      [
        "屏幕",
        "5.3\" 2560×1440 WQHD Pro IGZO LCD 120Hz, 全球首批 120Hz 手机屏幕"
      ],
      [
        "摄像头",
        "16.4MP F1.9 OIS 主摄"
      ],
      [
        "重量",
        "约 169g · 153 × 74 × 8.7mm"
      ],
      [
        "其他",
        "3160mAh 电池, IPX5/IPX8/IP6X 三防"
      ]
    ],
    "footL": "2017 IGZO 120Hz 先行者",
    "footR": "Sold Out"
  },
  {
    "id": "sony-xperia-xz2",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Sony Xperia XZ2 Compact (docomo SO-05K)",
    "sub": "4GB LPDDR4X + 64GB UFS / Snapdragon 845",
    "tags": "sony xperia xz2 compact so-05k 845 小屏旗舰 已售出 docomo",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 845 SDM845（Samsung 10nm LPP：4× Kryo 385 Gold / Cortex-A75 2.8GHz + 4× A55 1.8GHz，GPU Adreno 630）"
      ],
      [
        "RAM/ROM",
        "4GB LPDDR4X + 64GB UFS"
      ],
      [
        "屏幕",
        "5.0\" 18:9 FHD+ (2160×1080) HDR LCD, 单手可握小旗舰"
      ],
      [
        "摄像头",
        "19MP F2.0 Motion Eye 影像传感器, 960fps 超慢动作, 4K HDR 录像"
      ],
      [
        "重量",
        "168g · 135 × 65 × 12.1mm"
      ],
      [
        "其他",
        "2870mAh, IP65/68"
      ]
    ],
    "footL": "小屏旗舰绝唱 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "google-pixel-3",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Google Pixel 3 (日版)",
    "sub": "4GB LPDDR4X + 64GB / Snapdragon 845",
    "tags": "google pixel 3 日版 845 计算摄影 已售出",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 845 SDM845（Samsung 10nm LPP：4× Kryo 385 Gold / Cortex-A75 2.8GHz + 4× A55 1.8GHz，GPU Adreno 630）+ Google Pixel Visual Core 8 核影像协处理"
      ],
      [
        "RAM/ROM",
        "4GB LPDDR4X + 64GB"
      ],
      [
        "屏幕",
        "5.5\" 2220×1080 P-OLED"
      ],
      [
        "摄像头",
        "12.2MP F1.8 单摄 + 超级夜景 / HDR+, 单摄超分算法引领行业"
      ],
      [
        "重量",
        "148g · 145.6 × 68.2 × 7.9mm"
      ],
      [
        "其他",
        "2915mAh, 无线充电, IP68, 日版 SIM 解锁"
      ]
    ],
    "footL": "计算摄影祖师爷 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "sony-xperia-xz1",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Sony Xperia XZ1 (国行)",
    "sub": "4GB LPDDR4X + 64GB UFS / Snapdragon 835",
    "tags": "sony xperia xz1 国行 835 960fps 已售出",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 835 MSM8998（Samsung 10nm FinFET：4× Kryo 280 Gold / Cortex-A73 2.45GHz + 4× A53 1.9GHz，GPU Adreno 540）"
      ],
      [
        "RAM/ROM",
        "4GB LPDDR4X + 64GB UFS"
      ],
      [
        "屏幕",
        "5.2\" 1080p HDR 显示屏, 前置双立体声扬声器"
      ],
      [
        "摄像头",
        "19MP F2.0 Motion Eye 影像传感器, 1080p 960fps 超慢动作, 预测捕获"
      ],
      [
        "重量",
        "156g · 148 × 73 × 7.4mm"
      ],
      [
        "其他",
        "2700mAh, IP65/68 三防, 国行版系统精简稳定"
      ]
    ],
    "footL": "960fps 慢动作时代 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "smartisan-pro-2",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Smartisan (锤子) 坚果 Pro 2",
    "sub": "4/6GB + 64/128GB / Snapdragon 660",
    "tags": "smartisan 锤子 坚果 pro2 660 全面屏 已售出",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 660 SDM660（14nm LPP：4× Kryo 260 Gold / Cortex-A73 2.2GHz + 4× A53 1.84GHz，GPU Adreno 512）"
      ],
      [
        "RAM/ROM",
        "4/6GB LPDDR4x + 64/128GB"
      ],
      [
        "屏幕",
        "5.99\" 2160×1080 18:9 全面屏"
      ],
      [
        "摄像头",
        "12MP+5MP 双摄"
      ],
      [
        "重量",
        "156g · 154.36 × 73.36 × 7.4mm"
      ],
      [
        "其他",
        "隐藏式听筒与指纹 Logo 一体化设计 · 3500mAh, USB-C, 2017 年锤子美学代表作"
      ]
    ],
    "footL": "锤子工业设计巅峰 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "motorola-edge-s30",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Motorola Edge S30 (12+256)",
    "sub": "12GB LPDDR5 + 256GB UFS 3.1 / Snapdragon 888+",
    "tags": "motorola edge s30 888+ 144hz 1亿像素 已售出",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 888+ SM8350-AC（Samsung 5nm：1× Kryo 680 Prime / Cortex-X1 3.0GHz + 3× A78 2.42GHz + 4× A55 1.8GHz，GPU Adreno 660）"
      ],
      [
        "RAM/ROM",
        "12GB LPDDR5 + 256GB UFS 3.1"
      ],
      [
        "屏幕",
        "6.8\" FHD+ (2460×1080) 144Hz 电竞级高刷 LCD"
      ],
      [
        "摄像头",
        "108MP 主摄 + 13MP 超广角 + 2MP 景深"
      ],
      [
        "重量",
        "约 202g · 168.07 × 75.53 × 8.89mm"
      ],
      [
        "其他",
        "5000mAh + 33W, 2021 国行"
      ]
    ],
    "footL": "144Hz 电竞钢炮 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "oppo-r9s",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "OPPO R9s",
    "sub": "4GB + 64GB / Snapdragon 625",
    "tags": "oppo r9s 625 imx398 vooc 已售出",
    "specs": [
      [
        "CPU",
        "Qualcomm Snapdragon® 625 MSM8953（14nm FinFET：8× Cortex-A53 2.0GHz，GPU Adreno 506）"
      ],
      [
        "RAM/ROM",
        "4GB + 64GB"
      ],
      [
        "屏幕",
        "5.5\" 1080p"
      ],
      [
        "摄像头",
        "16MP Sony IMX398 主摄 (F1.7 大光圈, 双核对焦) + 16MP 前置"
      ],
      [
        "重量",
        "145g · 151.8 × 74.3 × 6.58mm"
      ],
      [
        "其他",
        "3010mAh + VOOC 闪充, 2016 国民拍照机"
      ]
    ],
    "footL": "拍照手机国民爆款 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "huawei-nova-7",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "HUAWEI nova 7 Pro (8+256)",
    "sub": "8GB + 256GB / Kirin 985 5G",
    "tags": "huawei nova7 pro 985 5g 潜望 已售出",
    "specs": [
      [
        "CPU",
        "HiSilicon Kirin 985 5G（7nm：1× Cortex-A76 2.58GHz + 3× A76 2.40GHz + 4× A55 1.84GHz，GPU Mali-G77 MP8，双 NPU）"
      ],
      [
        "RAM/ROM",
        "8GB + 256GB UFS"
      ],
      [
        "屏幕",
        "6.57\" 2340×1080 OLED"
      ],
      [
        "摄像头",
        "64MP 主摄 + 8MP 潜望长焦 (5×) + 8MP 超广角 + 2MP 微距, 前置 32MP + 8MP 超广角"
      ],
      [
        "重量",
        "约 178g · 160.36 × 73.74 × 7.98mm"
      ],
      [
        "其他",
        "4000mAh + 40W 华为超级快充, 2020"
      ]
    ],
    "footL": "自拍+潜望长焦全能 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "meizu-metal",
    "tab": "mobile",
    "status": "sold",
    "badge": "HISTORICAL PHONE",
    "flag": "已售出",
    "title": "Meizu (魅族) 魅蓝 Metal",
    "sub": "2GB + 16/32GB / Helio X10",
    "tags": "meizu 魅蓝 metal x10 全金属 已售出",
    "specs": [
      [
        "CPU",
        "MediaTek Helio X10 MT6795（TSMC 28nm HPM：8× Cortex-A53 最高 2.0–2.2GHz，GPU PowerVR G6200）"
      ],
      [
        "RAM/ROM",
        "2GB + 16/32GB"
      ],
      [
        "屏幕",
        "5.5\" 1080p 2.5D 玻璃"
      ],
      [
        "摄像头",
        "13MP PDAF 主摄 + 5MP 前置"
      ],
      [
        "重量",
        "162g · 150.7 × 75.3 × 8.2mm"
      ],
      [
        "其他",
        "铝合金一体成型, 2015 千元金属机开山作 · 3140mAh, Flyme 系统"
      ]
    ],
    "footL": "魅蓝金属系开山之作 / 已出手",
    "footR": "Sold Out"
  },
  {
    "id": "star-snail-4-bay",
    "tab": "spares",
    "status": "vault",
    "group": "整机备机",
    "badge": "NAS 始祖 / 4盘位热插拔",
    "flag": "仓库封存备用",
    "title": "蜗牛星际 (Star Snail) 4-Bay NAS",
    "sub": "家庭 NAS 始祖机，已由 Z77 存储节点与 N100 接班，整机封存待唤醒",
    "tags": "j1900 蜗牛星际 闲置 nas baytrail star snail 4盘位",
    "specs": [
      [
        "SoC",
        "Intel® Celeron® Processor J1900 (Bay Trail-D, 22nm, 4C/4T, 基频 2.00GHz / Burst 2.42GHz, 2MB L2, TDP 10W, 核显 Intel HD Graphics)"
      ],
      [
        "内存",
        "4GB DDR3L-1600 SO-DIMM · 单通道 · 平台上限 8GB"
      ],
      [
        "存储",
        "16GB mSATA SSD 系统盘 + 4 盘位 3.5\" SATA 热插拔背板（当前空仓封存）"
      ],
      [
        "定位",
        "早期 4 盘位私有云 / 下载机 / 冷备热插拔试验台。飞牛与大容量盘已迁到 Z77 + i7-2600 节点"
      ],
      [
        "状态",
        "仓库封存备用，整机可随时点亮作临时 NAS"
      ]
    ],
    "footL": "4 盘位热插拔始祖",
    "footR": "封存"
  },
  {
    "id": "quadro-p400-2gb",
    "tab": "spares",
    "status": "vault",
    "group": "显卡备件",
    "badge": "专业半高刀卡 / 4K转码",
    "flag": "随时战备待命",
    "title": "NVIDIA Quadro® P400 2GB GDDR5",
    "sub": "Pascal 专业半高刀卡，30W 亮机 + NVENC 转码备件",
    "tags": "p400 nvidia quadro 亮机卡 转码 闲置 gp107 30w 2g",
    "specs": [
      [
        "核心",
        "NVIDIA Pascal GP107GL · 14nm · 256 CUDA · 16 TMU · 16 ROP · 2 SM"
      ],
      [
        "显存",
        "2GB GDDR5 · 64-bit · 带宽 32GB/s"
      ],
      [
        "接口/功耗",
        "PCIe 3.0 x16 · 半高单槽 · 30W · 无外接供电 · 3× Mini-DisplayPort 1.4"
      ],
      [
        "算力",
        "FP32 约 0.641 TFLOPS · 第 6 代 NVENC"
      ],
      [
        "履历",
        "X99 二奶机阶段亮机转码卡，平台淘汰后入库。随时可插回低功耗节点"
      ]
    ],
    "footL": "30W 专业转码刀卡",
    "footR": "待命"
  },
  {
    "id": "radeon-rx-6600",
    "tab": "spares",
    "status": "sold",
    "group": "显卡备件",
    "badge": "X99 二奶机退役独显",
    "flag": "已售出",
    "title": "AMD Radeon™ RX 6600 8GB GDDR6",
    "sub": "Navi 23 主流甜品卡，随 E5-2686 v4 平台淘汰后回血",
    "tags": "rx6600 amd radeon 二奶 已售 navi23",
    "specs": [
      [
        "核心",
        "RDNA 2 Navi 23 · 28 CU / 1792 SP · 64MB Infinity Cache"
      ],
      [
        "显存",
        "8GB GDDR6 · 128-bit · 14Gbps · 带宽 224GB/s"
      ],
      [
        "功耗/接口",
        "TBP 132W · 8-pin · PCIe 4.0 x8"
      ],
      [
        "能力",
        "1080p 主流游戏 + AMF/FFmpeg 硬件编码。2026.1–3 装在 E5-2686 v4 上做实验，2026.3 拆下出售"
      ]
    ],
    "footL": "X99 实验尾声回血",
    "footR": "Sold Out"
  },
  {
    "id": "asus-tuf-gaming",
    "tab": "spares",
    "status": "sold",
    "group": "显卡备件",
    "badge": "未上机直接转手",
    "flag": "已售出",
    "title": "ASUS TUF Gaming GeForce® RTX™ 2060 6GB",
    "sub": "图灵入门光追卡，买来后未上机使用，直接出售",
    "tags": "asus tuf rtx 2060 6g 已售 未使用",
    "specs": [
      [
        "核心",
        "TU106 · 1920 CUDA · 240 Tensor Gen2 · 30 RT Gen1 · 120 TMU · 48 ROP"
      ],
      [
        "显存",
        "6GB GDDR6 · 192-bit · 14Gbps · 带宽 336GB/s"
      ],
      [
        "功耗",
        "160W TGP · 图灵 RT + 第 7 代 NVENC"
      ],
      [
        "履历",
        "买来后没有装机使用，TUF 模具整卡原样出售"
      ]
    ],
    "footL": "未上机 / 直接转手",
    "footR": "Sold Out"
  },
  {
    "id": "micron-2450-256gb",
    "tab": "spares",
    "status": "spare",
    "group": "存储备件",
    "badge": "M.2 2230 高速拆机盘",
    "flag": "借出 (朋友)",
    "title": "Micron (美光) 2450 256GB PCIe Gen4 x4 NVMe SSD",
    "sub": "短槽 2230 拆机盘，Steam Deck / 轻薄本短槽专用规格",
    "tags": "美光 2450 256g nvme pcie 4.0 ssd 2230 借出 micron",
    "specs": [
      [
        "规格",
        "Micron 2450 · M.2 2230 (22×30mm) · PCIe Gen4 x4 NVMe · DRAM-less / HMB"
      ],
      [
        "性能",
        "顺序读约 3500MB/s · 写约 1600MB/s"
      ],
      [
        "功耗",
        "低功耗 OEM 盘，Modern Standby / 休眠功耗面向轻薄本与掌机"
      ],
      [
        "用途",
        "适配 Steam Deck、部分超极本短槽。目前借给朋友使用"
      ]
    ],
    "footL": "2230 短槽 Gen4",
    "footR": "借出"
  },
  {
    "id": "hp-s700-500gb",
    "tab": "spares",
    "status": "vault",
    "group": "存储备件",
    "badge": "M.2 SATA 备用固态",
    "flag": "仓库备用盘",
    "title": "HP (惠普) S700 500GB M.2 SATA SSD",
    "sub": "SM2258XT 无缓存 SATA 通道盘，老工控 / 轻薄本扩展备用",
    "tags": "hp 惠普 s700 500g m.2 sata ssd 固态 仓库 sm2258xt",
    "specs": [
      [
        "主控/闪存",
        "Silicon Motion SM2258XT 无 DRAM 主控 + 3D NAND"
      ],
      [
        "接口",
        "M.2 2280 · SATA 6Gb/s · 顺序读约 560MB/s"
      ],
      [
        "容量",
        "500GB"
      ],
      [
        "用途",
        "只认 SATA M.2 的老主板 / 工控 / 轻薄本第二槽"
      ]
    ],
    "footL": "SATA 协议 M.2",
    "footR": "备用"
  },
  {
    "id": "teamgroup-gt2-120gb",
    "tab": "spares",
    "status": "vault",
    "group": "存储备件",
    "badge": "2.5寸 SATA 引导固态",
    "flag": "维护引导盘",
    "title": "TEAMGROUP (十铨) GT2 120GB SATA SSD",
    "sub": "7mm 2.5 寸小容量盘，专职 PE / 测试机引导",
    "tags": "teamgroup 十铨 gt2 120g 2.5寸 sata ssd 固态 仓库",
    "specs": [
      [
        "型号",
        "T253TG120G3C101 · 2.5\" 7mm · SATA III 6Gb/s · 3D NAND"
      ],
      [
        "性能",
        "标称顺序读约 500MB/s"
      ],
      [
        "容量",
        "120GB"
      ],
      [
        "用途",
        "PE / 装机测试引导"
      ]
    ],
    "footL": "PE / 测试引导",
    "footR": "维护"
  },
  {
    "id": "wd5000aakx-wd-blue",
    "tab": "spares",
    "status": "vault",
    "group": "存储备件",
    "badge": "3.5 寸蓝盘 / 下机",
    "flag": "柜子上",
    "title": "WD5000AAKX · WD Blue 500GB 3.5\"",
    "sub": "从主机取下，现搁柜子上",
    "tags": "wd5000aakx wd blue 500g 3.5 hdd 蓝盘 7200 16mb 柜子 下机",
    "specs": [
      [
        "型号",
        "WD5000AAKX · WD Blue · 500GB · 3.5\" · SATA 6Gb/s · 7200RPM · 16MB · CMR"
      ],
      [
        "性能",
        "7200RPM · 平均延迟 4.2ms · 标称持续约 126MB/s"
      ],
      [
        "外形",
        "147 × 101.6 × 26.1mm · 约 450g"
      ],
      [
        "容量",
        "500GB"
      ],
      [
        "状态",
        "已下机，放在柜子上"
      ]
    ],
    "footL": "WD5000AAKX",
    "footR": "搁柜"
  },
  {
    "id": "hgst-travelstar-z7k500",
    "tab": "spares",
    "status": "dead",
    "group": "存储备件",
    "accent": "rose",
    "badge": "SMART Reallocated",
    "flag": "报废",
    "title": "HGST Travelstar Z7K500 500GB",
    "sub": "HTS725050A7E630 · Reallocated 警告",
    "tags": "hgst travelstar z7k500 hts725050a7e630 500g 2.5 hdd 7200 reallocated 警告盘",
    "specs": [
      [
        "型号",
        "HGST Travelstar Z7K500 · HTS725050A7E630 · 500GB · 2.5\" 7mm · SATA 6Gb/s · 7200RPM · 32MB · 512e"
      ],
      [
        "性能",
        "7200RPM · 介质传输 171MB/s · 缓存 32MB"
      ],
      [
        "外形",
        "70 × 100 × 7mm · 约 95g"
      ],
      [
        "容量",
        "500GB"
      ],
      [
        "状态",
        "SMART Reallocated 警告，下机封存"
      ]
    ],
    "footL": "Z7K500 Reallocated",
    "footR": "报废"
  },
  {
    "id": "4gb-ddr3l-1600mhz-1-35v",
    "tab": "spares",
    "status": "vault",
    "group": "内存备件",
    "badge": "DDR3 经典双通道",
    "flag": "仓库备件",
    "title": "4GB DDR3L-1600MHz 1.35V 台式机内存 ×2",
    "sub": "低压 1.35V 台式机条，老平台双通道补仓",
    "tags": "ddr3l 4g 内存 闲置 双通道 1.35v",
    "specs": [
      [
        "规格",
        "2× 4GB DDR3L-1600 (PC3L-12800) · 1.35V 低压 · UDIMM 台式机金手指"
      ],
      [
        "兼容",
        "LGA 1155 / 部分 775 改制板 / 老工控 ATX。多数主板可在 1.5V DDR3 插槽降压或兼容运行"
      ],
      [
        "容量",
        "双通道合计 8GB"
      ],
      [
        "用途",
        "老测试平台 / 工控补条"
      ]
    ],
    "footL": "8GB DDR3L 双通道",
    "footR": "备件"
  },
  {
    "id": "elpida-1gb-2gb",
    "tab": "spares",
    "status": "vault",
    "group": "内存备件",
    "badge": "G41 功勋条子",
    "flag": "仓库封存",
    "title": "Elpida 尔必达 1GB + 2GB DDR3-1066",
    "sub": "陪伴 G41 从 1GB 扩到 3GB 的原厂颗粒条，现封存",
    "tags": "elpida 尔必达 ddr3 1066 1g 2g pc3-8500 g41 仓库",
    "specs": [
      [
        "规格",
        "1× 1GB + 1× 2GB DDR3-1066 SDRAM · PC3-8500 · 240-pin UDIMM 非 ECC 台式机金手指"
      ],
      [
        "电气",
        "1.5V 标准 DDR3 · 常见时序 CL7-7-7 · 单条理论带宽 8.5GB/s"
      ],
      [
        "颗粒",
        "Elpida 尔必达原厂 · 1G 条型号 EBJ10UE8BDF0-AE-F · PC3-8500U"
      ],
      [
        "容量 / 插法",
        "合计 3GB · G41 双通道非对称（1G+2G）· 2010 出厂 1G，后加 2G 扩到 3G"
      ],
      [
        "履历",
        "2010–2020 插在联想 G41 上跟完 E3200 / E7500 / Q6600。现整套封存"
      ]
    ],
    "footL": "G41 3GB 功勋组合",
    "footR": "封存"
  },
  {
    "id": "samsung-16gb-ddr3-1866",
    "tab": "spares",
    "status": "sold",
    "group": "内存备件",
    "badge": "X99 三通道 ECC",
    "flag": "已售出",
    "title": "Samsung 16GB DDR3-1866 ECC REG ×3",
    "sub": "X99-D3M4 二奶机三星注册条，三通道 48GB，已出手",
    "tags": "samsung 三星 ddr3 1866 16g ecc reg pc3-14900r x99 已售出",
    "specs": [
      [
        "规格",
        "3× 16GB DDR3-1866 ECC Registered RDIMM · PC3-14900R · 240-pin · 常见 2Rx4 · 三星 OEM"
      ],
      [
        "电气",
        "1.5V · 官方数据率 1866MT/s · 单条理论带宽 14.9GB/s · 带 ECC + 寄存器缓冲"
      ],
      [
        "拓扑",
        "合计 48GB · X99 四通道板插三槽走三通道"
      ],
      [
        "兼容",
        "LGA2011-3 Xeon E5 v3/v4（本机 E5-2666 v3 / E5-2686 v4 内存控制器兼容 DDR3 / DDR4；Intel 官方只标 DDR4，DDR3 需搭配 X99 DDR3 版主板）"
      ],
      [
        "履历",
        "2025.8–2026.3 随 X99 二奶机服役。平台淘汰后整套售出"
      ]
    ],
    "footL": "48GB ECC REG 三通道",
    "footR": "Sold Out"
  },
  {
    "id": "g41-oem",
    "tab": "spares",
    "status": "vault",
    "group": "775 平台备件",
    "badge": "联想 OEM 钉子户",
    "flag": "仓库封存",
    "title": "联想扬天 / 启天 G41 OEM 主板",
    "sub": "2010 年起家的 LGA775 传家宝板，E3200 → E7500 → Q6600 都插过它",
    "tags": "联想 g41 oem 扬天 启天 l-ig41m lga775 x4500 仓库",
    "specs": [
      [
        "芯片组",
        "Intel® G41 Express (Eaglelake-G / AC82G41 GMCH) + ICH7 (82801GB) 南桥 · FSB 800/1066/1333MHz"
      ],
      [
        "插槽",
        "LGA775 · 支持 Core 2 Duo / Quad、Pentium Dual-Core、Celeron 双核（本机实际：E3200 → E7500 → Q6600）"
      ],
      [
        "内存",
        "双通道 DDR3 UDIMM（联想启天/扬天常见 L-IG41M 为 2 槽 DDR3；芯片组官方常见上限 4–8GB）· 本机长期 尔必达 1G+2G DDR3-1066"
      ],
      [
        "集显",
        "Intel GMA X4500 · 65nm · 10 EU / 533MHz · DirectX 10 / SM4.0 · 共享内存 · 2017 年前当亮机核显"
      ],
      [
        "扩展",
        "1× PCIe 2.0 x16 独显槽（后插 R7 240）· ICH7 侧 SATA II + USB 2.0 · VGA 板载输出"
      ],
      [
        "履历",
        "2010 联想扬天/启天整机拆板，钉到 2020 换 AM4。现整板封存"
      ]
    ],
    "footL": "十年钉子户主板",
    "footR": "封存"
  },
  {
    "id": "celeron-e3200",
    "tab": "spares",
    "status": "vault",
    "group": "775 平台备件",
    "badge": "G41 原装 U",
    "flag": "仓库封存",
    "title": "Intel® Celeron® Processor E3200",
    "sub": "联想整机出厂 U，Wolfdale-3M 入门双核",
    "tags": "e3200 celeron wolfdale 775 2.4g 仓库",
    "specs": [
      [
        "微架构",
        "Wolfdale-3M · 45nm · 2C/2T · 无 HT · LGA775 · 常见 sSpec SLGU5 (R0) · 晶体管约 2.28 亿量级 Wolfdale 裁切"
      ],
      [
        "频率 / 缓存",
        "2.40GHz 锁定 · FSB 800MHz · L1 2×32KB I + 2×32KB D · L2 1MB 共享 · 无 L3"
      ],
      [
        "指令集",
        "x86-64 (EM64T) · MMX / SSE / SSE2 / SSE3 / SSSE3 · 无 SSE4.1 · 无核显"
      ],
      [
        "内存 / 总线",
        "前端总线 FSB，内存由 G41 北桥管 · 本机插在联想 G41 + 尔必达 DDR3-1066"
      ],
      [
        "功耗 / 封装",
        "TDP 65W · 45nm 低端双核 · 无睿频"
      ],
      [
        "履历",
        "2010 联想整机出厂 U，后被 E7500 换下。现整颗封存"
      ]
    ],
    "footL": "G41 出厂双核",
    "footR": "封存"
  },
  {
    "id": "core-2-duo",
    "tab": "spares",
    "status": "vault",
    "group": "775 平台备件",
    "badge": "高中主力 U",
    "flag": "仓库封存",
    "title": "Intel® Core™ 2 Duo Processor E7500",
    "sub": "Wolfdale 满血双核，G41 中期换芯功臣",
    "tags": "e7500 core 2 duo wolfdale 775 2.93g 仓库",
    "specs": [
      [
        "微架构",
        "Wolfdale (Penryn 家族) · 45nm · 2C/2T · 无 HT · LGA775 · 常见 sSpec SLGTE / SLB9Z · 约 2.28 亿晶体管"
      ],
      [
        "频率 / 缓存",
        "2.93GHz · FSB 1066MHz · L2 3MB 共享 · 无 L3 · 无睿频"
      ],
      [
        "指令集",
        "x86-64 · MMX / SSE / SSE2 / SSE3 / SSSE3 / SSE4.1 · EIST · 部分步进带 VT-x（SLGTE 有 / SLB9Z 无）· 无核显"
      ],
      [
        "内存 / 总线",
        "FSB 架构，内存走 G41 北桥双通道 DDR3 · 本机 3GB 尔必达 1066"
      ],
      [
        "功耗 / 封装",
        "TDP 65W · 65W 满血双核，G41 供电压力不大"
      ],
      [
        "履历",
        "换下 E3200 后带过初高中。2019 被 Q6600 换下，现封存"
      ]
    ],
    "footL": "2.93GHz / 3MB L2",
    "footR": "封存"
  },
  {
    "id": "core-2-quad",
    "tab": "spares",
    "status": "vault",
    "group": "775 平台备件",
    "badge": "高考胶水四核",
    "flag": "仓库封存",
    "title": "Intel® Core™ 2 Quad Processor Q6600",
    "sub": "Kentsfield 胶水四核，775 终极压榨",
    "tags": "q6600 kentsfield 775 四核 2.4g 仓库 高考",
    "specs": [
      [
        "微架构",
        "Kentsfield · 65nm · 两颗 Conroe 核心胶水封装 · 4C/4T · 无 HT · LGA775 · 产品码 80562"
      ],
      [
        "频率 / 缓存",
        "2.40GHz · FSB 1066MHz · L2 2×4MB（合计 8MB）· 无 L3 · 无睿频"
      ],
      [
        "指令集",
        "x86-64 · MMX / SSE / SSE2 / SSE3 / SSSE3 · VT-x · 无 SSE4.1 · 无核显"
      ],
      [
        "功耗 / 步进",
        "早期 B3 步进 105W · 后期 G0 步进降至 95W（Intel PCN 107463）· G0 Tcase 约 71°C"
      ],
      [
        "平台",
        "插在联想 G41 上压榨，供电和集显北桥都是极限玩法 · 内存仍是 3GB DDR3-1066"
      ],
      [
        "履历",
        "2019–2020 高考阶段顶上 G41。现整颗封存"
      ]
    ],
    "footL": "775 最后一滴性能",
    "footR": "封存"
  },
  {
    "id": "sapphire-radeon-r7",
    "tab": "spares",
    "status": "vault",
    "group": "显卡备件",
    "badge": "横跨两代的功勋亮机卡",
    "flag": "仓库封存",
    "title": "Sapphire Radeon™ R7 240 1GB GDDR5 白金版",
    "sub": "Oland 入门卡，从 775 跟到 AM4 的传奇 30W 亮机卡",
    "tags": "sapphire r7 240 白金版 1g gddr5 oland 仓库",
    "specs": [
      [
        "核心",
        "AMD Oland PRO (GCN 1.0) · 28nm · 320 SP / 20 TMU / 8 ROP · 基频常见 730MHz / Boost 780MHz"
      ],
      [
        "显存",
        "1GB GDDR5 · 颗粒时钟约 1150MHz（等效 4.6Gbps）· TechPowerUp 白金版 1G 条目标 128-bit"
      ],
      [
        "API / 输出",
        "DirectX 12 (feature level 11_1) / OpenGL 4.6 / Mantle · HDMI + Dual-Link DVI + VGA"
      ],
      [
        "功耗 / 供电",
        "TDP 30W（TechPowerUp：公版与蓝宝石 1GB 版均为 30W，建议电源 200W）· 无外接供电 · 单槽 · PCIe 3.0 x8（物理 x16）"
      ],
      [
        "履历",
        "2017 插上 G41 终结 X4500；2020 跟到 Ryzen 5 2600 继续亮机；后被 RX 580 换下。现封存"
      ]
    ],
    "footL": "775 → AM4 功勋卡",
    "footR": "封存"
  },
  {
    "id": "pentium-ii-3dfx",
    "tab": "spares",
    "status": "vault",
    "group": "整机备机",
    "badge": "童年启蒙整机",
    "flag": "仓库封存",
    "title": "Intel® Pentium® II + 3dfx Voodoo + 80GB IDE",
    "sub": "Slot 1 时代第一台机，梦开始的地方，零件都还在",
    "tags": "pentium 2 奔腾2 slot1 voodoo 3dfx 80g ide 仓库 童年",
    "specs": [
      [
        "CPU",
        "Intel® Pentium® II（Slot 1 / P6，0.25µm Deschutes 常见档 266–450MHz，模块外置半速 512KB L2，MMX；具体频率档家里已经对不上丝印了）"
      ],
      [
        "显卡",
        "3dfx Voodoo 3D 硬件加速卡（Glide API；1/2/3 代数未标。系列共性：PCI 附加卡，Voodoo1 需另接 2D 卡出画，核心/显存常见 50MHz 起）"
      ],
      [
        "存储",
        "80GB 3.5\" IDE / PATA 机械硬盘 · 40-pin 并口 · 未标品牌与转速"
      ],
      [
        "内存",
        "编年史记录约 384MB SDRAM/DDR 时代条"
      ],
      [
        "状态",
        "整套零件仍在家中封存，不再点亮日常使用"
      ]
    ],
    "footL": "Glide API 启蒙",
    "footR": "封存"
  },
  {
    "id": "x99-d3m4",
    "tab": "spares",
    "status": "sold",
    "group": "X99 平台",
    "badge": "洋垃圾工作站底板",
    "flag": "已售出",
    "title": "科脑 X99-D3M4",
    "sub": "LGA2011-3 DDR3 四通道，E5-2666 v3 / 2686 v4 都插过，已出手",
    "tags": "x99 d3m4 科脑 lga2011-3 ddr3 ecc e5 已售出",
    "specs": [
      [
        "平台",
        "科脑 X99-D3M4 · Intel X99 / C612 系 · LGA2011-3 · 支持 Xeon E5 v3 / v4（本机 2666 v3 → 2686 v4）"
      ],
      [
        "内存",
        "4 槽 DDR3 四通道 · 支持 ECC REG RDIMM · 常见标称 1866/1600/1333 · 上限各批次写 64GB 或 128GB · 本机三星 16G×3 DDR3-1866 ECC（48GB 三通道）"
      ],
      [
        "扩展",
        "PCIe 3.0 显卡槽（本机插过 P400 / RX 6600）· 多路 SATA 3.0 · 部分批次带 M.2 / Mini-PCIe 无线位"
      ],
      [
        "供电 / 板型",
        "ATX · 8 相左右供电 · 24-pin + 8-pin CPU"
      ],
      [
        "履历",
        "2025.8–2026.3 二奶机底板。平台淘汰后整板售出"
      ]
    ],
    "footL": "DDR3 四通道 X99",
    "footR": "Sold Out"
  },
  {
    "id": "ryzen-5-2600",
    "tab": "spares",
    "status": "sold",
    "group": "CPU 已售",
    "badge": "AM4 起点 U",
    "flag": "已售出",
    "title": "AMD Ryzen™ 5 2600",
    "sub": "高考后第一颗现代 U，2023 换 5500 时拆下出手",
    "tags": "ryzen 5 2600 pinnacle ridge zen+ am4 已售出",
    "specs": [
      [
        "微架构",
        "Pinnacle Ridge (Zen+) · GlobalFoundries 12nm · 6C/12T SMT · AM4 · 无核显 · 盒装 YD2600BBAFBOX 常见配 Wraith Stealth"
      ],
      [
        "频率 / 缓存",
        "基频 3.4GHz / Boost 3.9GHz · L2 6×512KB · L3 16MB · 解锁倍频"
      ],
      [
        "内存 / I/O",
        "双通道 DDR4-2933 官方 · PCIe 3.0 · 本机插华擎 B450M-HDV R1.0 + 16GB DDR4-2666"
      ],
      [
        "功耗",
        "TDP 65W · cTDP 可调 · 12nm 比一代 1600 更凉快"
      ],
      [
        "履历",
        "2020 高考后第一颗现代 U，2023 换 R5 5500 后整颗售出"
      ]
    ],
    "footL": "AM4 启航功臣",
    "footR": "Sold Out"
  },
  {
    "id": "xeon-e5-2666-v3",
    "tab": "spares",
    "status": "sold",
    "group": "CPU 已售",
    "badge": "X99 第一颗洋垃圾",
    "flag": "已售出",
    "title": "Intel® Xeon® Processor E5-2666 v3",
    "sub": "Haswell-EP 10 核，X99 二奶机起点",
    "tags": "e5-2666 v3 haswell-ep 10c 2011-3 已售出 xeon",
    "specs": [
      [
        "微架构",
        "Haswell-EP · 22nm · 10C/20T · LGA2011-3 · 常见 sSpec SR1Y7 · 无核显 · 可双路"
      ],
      [
        "频率 / 缓存",
        "基频 2.90GHz / Turbo 3.50GHz · 全核常见 3.2GHz · 25MB L3"
      ],
      [
        "内存 / I/O",
        "四通道 · 内存控制器兼容 DDR3 / DDR4（Intel 官方标 DDR4-2133，本机走 DDR3-1866 ECC REG）· ECC · PCIe 3.0 ×40 · QPI 2× 9.6GT/s"
      ],
      [
        "指令集",
        "x86-64 · SSE4.2 · AVX2 · AES-NI · VT-x / VT-d · TSX（Haswell 后期微码可能关掉）"
      ],
      [
        "功耗",
        "TDP 135W"
      ],
      [
        "履历",
        "2025.8 上科脑 X99-D3M4 + 三星 48GB ECC。同年 12 月被 2686 v4 换下后售出"
      ]
    ],
    "footL": "10C/20T 入坑 U",
    "footR": "Sold Out"
  },
  {
    "id": "xeon-e5-2686-v4",
    "tab": "spares",
    "status": "sold",
    "group": "CPU 已售",
    "badge": "X99 18 核收官",
    "flag": "已售出",
    "title": "Intel® Xeon® Processor E5-2686 v4",
    "sub": "Broadwell-EP 18 核，X99 实验收官 U",
    "tags": "e5-2686 v4 broadwell-ep 18c 2011-3 已售出 xeon sr2k8",
    "specs": [
      [
        "微架构",
        "Broadwell-EP · 14nm · 18C/36T · LGA2011-3 · sSpec 常见 SR2K8 · 无核显 · 可双路"
      ],
      [
        "频率 / 缓存",
        "基频 2.30GHz / Turbo 最高约 3.0GHz（双核档更高、全核回落到基频附近）· L2 18×256KB · L3 45MB"
      ],
      [
        "内存 / I/O",
        "四通道 · 内存控制器兼容 DDR3 / DDR4（Intel 官方标 DDR4-2400，本机走 DDR3-1866 ECC REG）· ECC · 最大约 1.5TB（视主板）· PCIe 3.0 ×40 · QPI 2× 9.6GT/s"
      ],
      [
        "指令集",
        "x86-64 · SSE4.2 · AVX2 · AES-NI · VT-x / VT-d"
      ],
      [
        "功耗",
        "TDP 145W"
      ],
      [
        "履历",
        "2025.12–2026.3 顶上 X99-D3M4（P400 → RX 6600）。平台淘汰后整颗售出"
      ]
    ],
    "footL": "18C/36T 收官",
    "footR": "Sold Out"
  },
  {
    "id": "xtrfy-m4-wireless",
    "tab": "peripherals",
    "status": "active",
    "group": "鼠标",
    "accent": "cyan",
    "badge": "MOUSE // 轻量化 FPS",
    "flag": "现役",
    "title": "Xtrfy M4 Wireless (White)",
    "sub": "CHERRY XTRFY 人体工学无线电竞鼠 · 白色",
    "tags": "xtrfy m4 wireless 鼠标 白色 paw3370 71g 现役 cherry",
    "specs": [
      [
        "定位",
        "瑞典 Xtrfy（现 CHERRY XTRFY）M4 Wireless 白色。右利手人体工学，可调配重/握持尺寸"
      ],
      [
        "传感器",
        "PixArt PAW3370 · CPI 400–19000 · 400 IPS · 50G · 不支持玻璃追踪"
      ],
      [
        "连接/回报",
        "2.4GHz 无线（附接收器延长）· 有线可用 · 回报率 125 / 500 / 1000Hz"
      ],
      [
        "微动/滚轮",
        "Kailh GM 8.0（8000 万次）· 去抖 2/4/8/12ms"
      ],
      [
        "电池/重量",
        "500mAh · 官方续航最高约 75 小时 · 裸重 71g（不含线）"
      ],
      [
        "灯效",
        "可调 RGB，可关灯续航"
      ]
    ],
    "footL": "白色 71g 人体工学 FPS 鼠",
    "footR": "Mouse"
  },
  {
    "id": "vxe-r1-pro",
    "tab": "peripherals",
    "status": "active",
    "group": "鼠标",
    "accent": "violet",
    "badge": "MOUSE // 电竞轻量",
    "flag": "现役",
    "title": "VXE R1 Pro",
    "sub": "VXE 蜻蜓 R1 Pro · 48g · PAW3395",
    "tags": "vxe r1 pro 鼠标 paw3395 轻量化 4k 48g 现役",
    "specs": [
      [
        "系列",
        "VXE（VGN 旗下）蜻蜓 R1 Pro。对称/准对称中小手模具，冰感涂层"
      ],
      [
        "传感器",
        "PixArt PAW3395 · 最高 26000 DPI 级旗舰光学传感器"
      ],
      [
        "连接/回报",
        "2.4G + 有线 · 标配 1000Hz，另购 4K 接收器可达 4000Hz"
      ],
      [
        "微动",
        "Huano 冰蓝粉点"
      ],
      [
        "电池/重量",
        "250mAh · 官方约 75 小时（1000Hz）· 约 48g（评测秤重约 48.8g）"
      ],
      [
        "尺寸",
        "约 120.6 × 64 × 37.8mm"
      ]
    ],
    "footL": "48g / 3395 / 可选 4K",
    "footR": "Mouse"
  },
  {
    "id": "atk-f1-ultra",
    "tab": "peripherals",
    "status": "active",
    "group": "鼠标",
    "accent": "amber",
    "badge": "MOUSE // 旗舰顶配",
    "flag": "现役",
    "title": "ATK F1 Ultra Max 2.0",
    "sub": "ATK 烈空 F1 V2 Ultra Max · 中小手准对称 · 双 8K",
    "tags": "atk f1 ultra max 2.0 鼠标 paw3395 8k 轻量化 现役 烈空",
    "specs": [
      [
        "定位",
        "ATK 烈空 F1 V2 系列 Ultra Max 2.0。准对称中小手抓握，纳米涂层，Nordic 54 系主控 + 绝鲨 MAX 方案"
      ],
      [
        "传感器",
        "Ultra Max 档 PAW3395 Ultra（同系列 Ultimate/Extreme 才上 PAW3950 Ultra）"
      ],
      [
        "连接/回报",
        "USB-C 有线 + 2.4G 无线双 8K 轮询 · 另有蓝牙三模版本流通"
      ],
      [
        "重量/尺寸",
        "约 54±2g · 约 118.2 × 62.4 × 38.8mm"
      ],
      [
        "其他",
        "TTC 金轮编码器 · 长续航大电池档（Ultra Max 官方宣传可达数百小时量级，视回报率）"
      ]
    ],
    "footL": "烈空 F1 V2 Ultra Max 双 8K",
    "footR": "Mouse"
  },
  {
    "id": "vgn-v98-pro",
    "tab": "peripherals",
    "status": "active",
    "group": "键盘",
    "accent": "lime",
    "badge": "KEYBOARD // 98 键配列",
    "flag": "现役",
    "title": "VGN V98 Pro (97键)",
    "sub": "98 配列 Gasket · 三模热插拔 · 大电池",
    "tags": "vgn v98 pro 键盘 97键 gasket 三模 热插拔 现役",
    "specs": [
      [
        "配列",
        "98% 配列；去掉右侧 Alt 后常称 97 键。保留数字区的紧凑桌面布局"
      ],
      [
        "结构",
        "Gasket 硅胶减震定位板 · PCB 单键开槽 · 全键热插拔轴座 · 多层消音棉"
      ],
      [
        "连接",
        "有线 USB-C / 2.4G / 蓝牙三模，可多设备切换"
      ],
      [
        "电池",
        "系列常见 8000–10000mAh 大电池（V3/V4 宣传 10000mAh）"
      ],
      [
        "键帽/灯效",
        "PBT 二色键帽 + 单键 RGB"
      ],
      [
        "定位",
        "主力客制化日常盘，轴体可换"
      ]
    ],
    "footL": "98 配列 Gasket 三模",
    "footR": "KB"
  },
  {
    "id": "rog-rx-104",
    "tab": "peripherals",
    "status": "active",
    "group": "键盘",
    "accent": "rose",
    "badge": "KEYBOARD // 104 键有线",
    "flag": "现役",
    "title": "ROG 游侠 RX (104键 · 红轴)",
    "sub": "ROG Strix Scope RX · RX Red 光轴 · 铝合金上盖",
    "tags": "rog 游侠 rx 键盘 104键 光轴红轴 有线 strix scope 现役",
    "specs": [
      [
        "型号",
        "ASUS ROG Strix Scope RX（国行名：ROG 游侠 RX）· 100% / 104 键"
      ],
      [
        "轴体",
        "ROG RX Red 光学机械轴 · 线性 · 中央光源 · 总行程 4mm / 触发行程 1.5mm / 触发约 45gf / 触底 55gf · 寿命 1 亿次 · 1ms 光触发"
      ],
      [
        "结构",
        "铝合金上盖 · 440 × 137 × 39mm · 1.07kg · 加宽 Ctrl · Stealth 键"
      ],
      [
        "连接",
        "有线 USB 2.0（Type-C 转 Type-A）· 键线分离 · USB 直通"
      ],
      [
        "灯效/防护",
        "单键 Aura Sync RGB · IP57 防水防尘 · Armoury Crate · 全键无冲 · 板载 6 组宏"
      ]
    ],
    "footL": "RX Red 光轴 104 键",
    "footR": "KB"
  },
  {
    "id": "sennheiser-gsp-370",
    "tab": "peripherals",
    "status": "active",
    "group": "音频",
    "accent": "lime",
    "badge": "AUDIO // 无线游戏耳机",
    "flag": "现役",
    "title": "Sennheiser GSP 370",
    "sub": "封闭式 2.4G 无线游戏耳机 · 官方约 100 小时",
    "tags": "sennheiser gsp370 耳机 无线 100h 现役 epos",
    "specs": [
      [
        "单元",
        "50mm 动圈 · 封闭式头戴 · 阻抗 28Ω · 频响 20Hz–20kHz"
      ],
      [
        "连接",
        "2.4GHz 低延迟无线 · USB 接收器（后划归 EPOS 产品线，型号 1000231）"
      ],
      [
        "麦克风",
        "可翻转折叠静音 · 指向性降噪 · 频响 100–6300Hz · 灵敏度 -41 dBV/Pa"
      ],
      [
        "续航/重量",
        "官方最长约 100 小时 · 整机约 285g"
      ],
      [
        "定位",
        "主力机长续航无线大耳，牺牲一点麦素质换几乎不用充电"
      ]
    ],
    "footL": "100h 无线封闭大耳",
    "footR": "Headset"
  },
  {
    "id": "hyperx-cloud-ii",
    "tab": "peripherals",
    "status": "active",
    "group": "音频",
    "accent": "rose",
    "badge": "AUDIO // 经典游戏耳机",
    "flag": "现役",
    "title": "HyperX Cloud II (云2)",
    "sub": "53mm 钕磁 · USB 7.1 声卡 · 有线封闭式",
    "tags": "hyperx cloud ii 云2 耳机 7.1 53mm 现役",
    "specs": [
      [
        "单元",
        "53mm 钕磁动圈 · 封闭式头戴 · 阻抗 60Ω · 频响 15Hz–25kHz（早期 Kingston 标称；现行页亦见 10Hz–23kHz）"
      ],
      [
        "环绕",
        "独立 USB 声卡硬件 7.1 虚拟环绕 · 亦可 3.5mm 模拟直连"
      ],
      [
        "麦克风",
        "可拆卸降噪动圈麦"
      ],
      [
        "佩戴",
        "记忆海绵 + 皮革耳罩 · 铝合金支架 · 裸重约 320g（不含线）"
      ],
      [
        "定位",
        "有线参考/备用游戏耳机，云 2 常青树"
      ]
    ],
    "footL": "53mm / 60Ω / USB 7.1",
    "footR": "Headset"
  },
  {
    "id": "razer-hammerhead-v3",
    "tab": "peripherals",
    "status": "active",
    "group": "音频",
    "accent": "violet",
    "badge": "AUDIO // 有线入耳",
    "flag": "现役",
    "title": "Razer Hammerhead V3 Wired",
    "sub": "战锤狂鲨 V3 有线入耳 · 3.5mm + USB-C DAC · RZ12-0559",
    "tags": "razer hammerhead v3 雷蛇 耳机 有线 入耳 3.5 dac 现役",
    "specs": [
      [
        "型号",
        "Razer Hammerhead V3 Wired Earbuds · 战锤狂鲨 V3 有线入耳 · RZ12-0559"
      ],
      [
        "单元",
        "11mm 全频动圈 · 频响 20Hz–20kHz · 入耳式防漏音腔体"
      ],
      [
        "连接",
        "3.5mm 耳机插头 + 附赠 USB Type-C DAC（24-bit / 48kHz）· 线长 1.2m TPE"
      ],
      [
        "线控",
        "线控麦克风 + 音量/播放按键 · 兼容 PC / 主机手柄 / 手机 / Switch"
      ],
      [
        "附件",
        "硅胶耳塞多尺寸 · USB-C DAC 转接"
      ],
      [
        "用途",
        "随身有线监听、手机/主机低延迟入耳，对接 LG G7 3.5mm 或 Type-C 设备"
      ]
    ],
    "footL": "有线入耳 11mm + USB-C DAC",
    "footR": "Wired IEM"
  },
  {
    "id": "beyerdynamic-dt-270",
    "tab": "peripherals",
    "status": "active",
    "group": "音频",
    "badge": "AUDIO // 专业监听",
    "flag": "现役",
    "title": "Beyerdynamic DT 270 Pro",
    "sub": "封闭式紧凑录音室监听 · 45Ω",
    "tags": "beyerdynamic dt270 pro 拜亚 耳机 监听 45欧 现役",
    "specs": [
      [
        "定位",
        "拜亚动力 DT 270 Pro 专业封闭式头戴监听，录音/缩混入门工作室型号"
      ],
      [
        "单元",
        "动圈 · 封闭式包耳 · 标称阻抗 45Ω · 频响 5Hz–24kHz（-10dB）· 灵敏度 96dB"
      ],
      [
        "佩戴",
        "天鹅绒耳垫 · 紧凑头梁 · 约 196g"
      ],
      [
        "用途",
        "人声/器乐监听与混音参考；可被 G7 Quad DAC 或桌面口轻松驱动"
      ]
    ],
    "footL": "45Ω 封闭监听",
    "footR": "Studio"
  }
];

const HISTORY = [
  {
    "color": "cyan",
    "period": "[Period 8] 2026.03 - 至今 (现役巅峰双主力与精细化调校)",
    "tag": "Dual Flagship + N100 Max",
    "title": "主力 FCLK 榨干、二奶机转入 13 代低功耗大显存平台、笔记本矩阵重组",
    "body": [
      "主力游戏机：AMD Ryzen™ 7 5700X + ASRock B450M-HDV R1.0 + 光威 32GB (16G×2) 海力士颗粒手工拉升至 DDR4 3866MHz CL18 (FCLK 1933MHz 1:1 满血同步) + ASUS Dual RTX 4070 SUPER OC 12GB + 梵想 S790E 1T + 幻隐 HS2000 1T + ORICO Y20 1T + WD10EZEX-08WN4A0 + 长城 850W 铂金电源。",
      "日常 AI 二奶机：Intel® Core™ i5-13400TEF（解锁功耗全核 3.9GHz，官方最高睿频 4.50GHz）+ ASUS B660M-K D4 + 台电 32GB DDR4 3200 + 影驰 RTX 2060 12GB 双风扇 + Kingston SNV3S1000G 1TB + RBUSNS8180S3512GJ 512G + 铭瑄 X5 480G + WD5000AAKX-001CA0 500G + 航嘉 750W 铜牌电源。柜子上另有一块 WD5000AAKX。",
      "边缘服务中枢：中柏 N100 双网口迷你主机，32GB DDR4 2666 单条 + Toshiba THNSN5128GPU7 128G NVMe + 梵想 S100 Pro 500GB，现运行飞牛OS (fnOS)，常驻 QQ 机器人 (ASTRBOT/NAPCAT) 与 AdGuard Home 广告过滤。",
      "移动端重大换代：以 799 元出掉 DELL Latitude 7410 2-in-1；以 950 元购入 攀升 暴风龙 S2 (Ryzen 5 5600U + 16G + 512G + 2.5K屏, 1.3kg)，仅补 151 元实现 CPU 算力翻倍；购入 Acer Chromebook Spin 13 (i7-8650U + 16GB LPDDR3 1866 + 3:2 2K QHD 触控屏 + Wacom) 刷好 Win10 作为独立阅读与办公副机。",
      "同款双机成型：以 990 元再入一台完全同款的 HP Elite Dragonfly 13.5 (i5-1245U + 16GB + 原厂 256GB)，与主力 MOBILE-01 出厂配置完全一致（一号机后自行换装 512G 致态），互为备份与轮换。",
      "笔记本矩阵收缩：同款二号 HP Dragonfly (256G 原盘) 与 攀升 暴风龙 S2 先后出手，Acer Spin 13 留在家里给爸爸用，随身只留主力 Dragonfly 一台；T7 中继随之闲置。",
      "手机换代：升级为 OPPO Find X9 Pro 5G (16+512)，原主力 nubia Z60S Pro (16+512) 转入备用摄影收藏。"
    ]
  },
  {
    "color": "violet",
    "period": "[Period 7] 2025.08 - 2026.03 (X99 洋垃圾工作站探索与 4070S 质变)",
    "tag": "X99 E5 V3/V4 → 4070S",
    "title": "显卡划时代升级与 E5 多核洋垃圾服务器实践",
    "body": [
      "主力机越级升级：CPU 换装 AMD Ryzen 7 5700X，显卡告别老旧 RX 580，直接跨入 ASUS Dual GeForce RTX 4070 SUPER OC 12GB，存储补齐 1T PCIe 4.0 S790E 固态（B450 主板只有 PCIe 3.0，暂时降速运行），2K/4K 3A 游戏性能彻底解放。",
      "二奶机折腾阶段 1 (2025.8)：Intel Xeon E5-2666 v3 (10C/20T) + 48GB (16G×3) 三星 DDR3-1866 ECC REG + 科脑 X99-D3M4 + 512GB SSD + NVIDIA Quadro P400 2GB。",
      "二奶机折腾阶段 2 (2025.12)：升级 CPU 为 Intel Xeon E5-2686 v4 (18C/36T Broadwell-EP, 45MB L3) + Quadro P400。",
      "二奶机折腾阶段 3 (2026.1 - 2026.3)：E5-2686 v4 平台换装 AMD Radeon RX 6600 8GB 显卡，完成多核实验后整套平台淘汰，全面转入现代低功耗平台，RX 6600 拆下后已出售回血。"
    ]
  },
  {
    "color": "lime",
    "period": "[Period 6] 2023 - 2025.12 (大学后期至毕业 · AM4 换芯与双笔记本护航)",
    "tag": "Ryzen 5500 + RX 580",
    "title": "B450M 传家宝升级 R5 5500 与微星 Titan 1060 笔记本战死",
    "body": [
      "台式主力微升：B450M 主板保持不动，CPU 从 R5 2600 升级为 AMD Ryzen 5 5500 (6C/12T Cezanne 7nm) + 16GB DDR4 2666 + 128G SSD + 1T M.2 NVMe + 大学期间购置的 MSI Radeon RX 580 8GB 2048SP。",
      "微星笔记本暴毙 (2023-2025)：朋友赠送的 MSI GT73EVR 7RD Titan (i7-7700HQ + 16G DDR4-2400 + GTX 1060 6G + Toshiba 128G NVMe + 1T HGST 7200RPM) 专职当纯游戏机，于 2025 年高负载游戏时突然黑屏显卡芯片虚焊损坏，功成身退。"
    ]
  },
  {
    "color": "slate",
    "period": "[Period 5] 2020 - 2023 (高考后装机与大学前期)",
    "tag": "AM4 起点 & 神舟 10400 准系统",
    "title": "Ryzen 5 2600 + B450M 启航与神舟战神桌面U游戏本",
    "body": [
      "高考后首台现代主机 (2020)：AMD Ryzen 5 2600 (6C/12T) + 华擎 B450M-HDV R1.0 + 16GB DDR4 2666 + 128GB SATA SSD + 陪伴多年的 320GB 老机械硬盘 + 功勋亮机卡蓝宝石 R7 240 1G 白金版继续站岗。",
      "显卡升级：大学期间将蓝宝石 R7 240 升级为 MSI Radeon RX 580 8GB 2048SP，加装 1TB M.2 固态。",
      "大学移动主力：神舟战神 ZX6-CU5DA (桌面级 LGA1200 i5-10400 + GTX 1650 4GB + Kingston 512GB + 后加 梵想 S790E 1TB)，陪伴 2020–2025 整个大学时代，2026 年毕业工作后售出，内存与 Kingston 512G、梵想 S790E 两块固态拆下留用。"
    ]
  },
  {
    "color": "slate",
    "period": "[Period 4] 2019 - 2020 高考阶段 (LGA 775 终极压榨)",
    "tag": "Q6600 胶水四核战神",
    "title": "Core 2 Quad Q6600 战至高考",
    "body": [
      "G41 主板迎来终极升级：Intel® Core™ 2 Quad Q6600 (Kentsfield 65nm, 4C/4T, 2.40GHz, 8MB L2, 105W TDP) + 3GB (1G+2G) DDR3 + 320GB SATA 硬盘 + 蓝宝石 R7 240 1GB 白金版。在有限供电下榨干 775 最后一滴性能，陪伴度过高考。"
    ]
  },
  {
    "color": "slate",
    "period": "[Period 3] 2017 - 2019 高中阶段 (独显时代开启)",
    "tag": "蓝宝石 R7 240 入列",
    "title": "E7500 + 加装 Sapphire Radeon R7 240 1GB 白金版",
    "body": [
      "配置演进：Intel Core 2 Duo E7500 + 3GB (1G+2G) DDR3 + G41 + 320GB SATA + 购入 Sapphire Radeon R7 240 Platinum Edition 1GB GDDR5。彻底摆脱 GMA X4500 亮机集显，这块 TDP 仅 30W 的显卡成为横跨 775 与 AM4 时代的传奇功勋硬件。"
    ]
  },
  {
    "color": "slate",
    "period": "[Period 2] 2010 - 2017 求学时期 (联想品牌整机与 CPU 迭代)",
    "tag": "G41 钉子户起点",
    "title": "联想 G41 整机：赛扬 E3200 → 酷睿2 双核 E7500",
    "body": [
      "初始形态 (2010)：联想扬天/启天 OEM G41 整机，搭载 Intel Celeron E3200 (2.4GHz, 45nm Wolfdale-3M, 1MB L2) + 1GB DDR3 1066 + Intel GMA X4500 集显 + 320GB SATA 3Gb/s 7200RPM 机械硬盘。",
      "CPU 与内存升级：升级为 Intel Core 2 Duo E7500 (2.93GHz, 3MB L2, 1066MHz FSB, 65W) + 扩充至 3GB (1G+2G DDR3) 内存。"
    ]
  },
  {
    "color": "amber",
    "period": "[Period 1] 2006 - 2010 童年启蒙 (3dfx Voodoo 传奇)",
    "tag": "Pentium II + Voodoo",
    "title": "Intel® 奔腾 2 + 3dfx Voodoo 3D 加速卡 + 80G IDE 硬盘",
    "body": [
      "童年最初的数码记忆：Intel® Pentium® II 处理器 (Slot 1 架构, 0.25µm) + 经典的 3dfx Voodoo 3D 硬件加速卡 (Glide API) + 384MB SDRAM/DDR 内存 + 80GB IDE PATA 机械硬盘。梦开始的地方。"
    ]
  }
];

// 拓扑：x / y 为画布内相对坐标 (0–1)；sz 1–4 为节点尺寸；dim 为闲置；gig 为千兆。
const TOPO_SEED = {
  "nodes": [
    {
      "id": "wan",
      "x": 0.015,
      "y": 0.12,
      "sz": 1,
      "accent": "slate",
      "title": "互联网",
      "sub": "WAN 入口",
      "note": "光猫 / 公网上行"
    },
    {
      "id": "t7",
      "x": 0.015,
      "y": 0.4,
      "sz": 1,
      "gig": true,
      "accent": "sky",
      "title": "360 T7",
      "sub": "OpenWrt 主路由",
      "note": "全屋千兆核心 · 全家出线"
    },
    {
      "id": "sw8",
      "x": 0.25,
      "y": 0.04,
      "sz": 2,
      "gig": true,
      "accent": "sky",
      "title": "8 口交换机",
      "sub": "千兆有线汇聚",
      "note": "T7 下联 · 台式全部走这里"
    },
    {
      "id": "ax",
      "x": 0.25,
      "y": 0.48,
      "sz": 2,
      "gig": true,
      "accent": "sky",
      "title": "TP-LINK AX5400",
      "sub": "千兆有线 AP",
      "note": "直连 T7 · 手机笔电 Wi-Fi 6"
    },
    {
      "id": "n100",
      "x": 0.45,
      "y": 0,
      "sz": 3,
      "gig": true,
      "accent": "sky",
      "title": "中柏 N100 双网口",
      "sub": "边缘应用",
      "note": "fnOS · QQ 机器人 · AdGuard"
    },
    {
      "id": "nas",
      "x": 0.45,
      "y": 0.18,
      "sz": 3,
      "gig": true,
      "accent": "green",
      "title": "Z77 存储节点",
      "sub": "i7-2600 + A2000M",
      "note": "36.1TB · 千兆下联"
    },
    {
      "id": "rig1",
      "x": 0.45,
      "y": 0.36,
      "sz": 3,
      "gig": true,
      "accent": "violet",
      "title": "主力机",
      "sub": "5700X + 4070S",
      "note": "2K/4K 电竞与渲染"
    },
    {
      "id": "rig2",
      "x": 0.45,
      "y": 0.54,
      "sz": 3,
      "gig": true,
      "accent": "violet",
      "title": "日常机",
      "sub": "13400TEF + 2060",
      "note": "Ollama 8B · ComfyUI"
    },
    {
      "id": "rep",
      "x": 0.45,
      "y": 0.76,
      "sz": 3,
      "dim": true,
      "accent": "sky",
      "title": "360 T7 中继",
      "sub": "挂 AX5400",
      "note": "无线中继 · 攀升已出，暂闲置"
    },
    {
      "id": "dfly",
      "x": 0.63,
      "y": 0.1,
      "sz": 4,
      "accent": "amber",
      "title": "HP Dragonfly",
      "sub": "i5-1245U · 512G",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "ezpad",
      "x": 0.63,
      "y": 0.34,
      "sz": 4,
      "accent": "amber",
      "title": "EZpad 8",
      "sub": "N3350 平板",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "spin",
      "x": 0.63,
      "y": 0.58,
      "sz": 4,
      "dim": true,
      "accent": "amber",
      "title": "Acer Spin 13",
      "sub": "i7-8650U · 爸爸在用",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "x9",
      "x": 0.78,
      "y": 0,
      "sz": 4,
      "accent": "rose",
      "title": "Find X9 Pro",
      "sub": "日常主力",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "r8",
      "x": 0.78,
      "y": 0.13,
      "sz": 4,
      "accent": "rose",
      "title": "AQUOS R8 Pro",
      "sub": "IMX989",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "xp5",
      "x": 0.78,
      "y": 0.26,
      "sz": 4,
      "accent": "rose",
      "title": "Xperia 5 III",
      "sub": "21:9 影音",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "g7",
      "x": 0.78,
      "y": 0.39,
      "sz": 4,
      "accent": "rose",
      "title": "LG G7 ThinQ",
      "sub": "Quad DAC",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "pad",
      "x": 0.78,
      "y": 0.52,
      "sz": 4,
      "accent": "rose",
      "title": "小新 Pad Pro 12.7",
      "sub": "天玑 8300",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "wish",
      "x": 0.78,
      "y": 0.65,
      "sz": 4,
      "accent": "rose",
      "title": "AQUOS wish3",
      "sub": "eSIM 特种",
      "note": "AX5400 Wi-Fi"
    },
    {
      "id": "paw",
      "x": 0.78,
      "y": 0.78,
      "sz": 4,
      "dim": true,
      "accent": "rose",
      "title": "Pawbo P52 Pro",
      "sub": "纯备用",
      "note": "闲置 · 未常驻联网"
    }
  ],
  "links": [
    {
      "a": "wan",
      "b": "t7",
      "kind": "wan"
    },
    {
      "a": "t7",
      "b": "sw8",
      "kind": "lan"
    },
    {
      "a": "t7",
      "b": "ax",
      "kind": "lan"
    },
    {
      "a": "sw8",
      "b": "n100",
      "kind": "lan"
    },
    {
      "a": "sw8",
      "b": "nas",
      "kind": "lan"
    },
    {
      "a": "sw8",
      "b": "rig1",
      "kind": "lan"
    },
    {
      "a": "sw8",
      "b": "rig2",
      "kind": "lan"
    },
    {
      "a": "ax",
      "b": "dfly",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "ezpad",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "spin",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "x9",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "r8",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "xp5",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "g7",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "pad",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "wish",
      "kind": "wifi"
    },
    {
      "a": "ax",
      "b": "paw",
      "kind": "idle"
    },
    {
      "a": "ax",
      "b": "rep",
      "kind": "idle"
    }
  ]
};
