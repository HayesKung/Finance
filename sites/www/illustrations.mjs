// Original bilingual illustrations for finanpivot.com.
// Labels stay inside what the public site already says. No amounts, clients, or results.

const sans = "Inter, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif";
const serif = "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Liberation Serif', 'Songti SC', 'Noto Serif CJK SC', serif";

const copy = {
  zh: {
    heroTitle: "示意：订单、单据与收付款汇入同一本台账",
    clarity: "清晰",
    oneFile: "同一本台账",
    sample: "示意",
    principal: "负责人",
    order: "订单",
    invoice: "发票",
    papers: "单据",
    bank: "收汇",
    open: "未核对",
    exportTitle: "出口单据与收汇记录对照",
    compare: "对照",
    projectTitle: "项目预算、进度、质保金与现金流",
    month: "月度",
    budget: "预算",
    progress: "进度",
    retention: "质保金",
    cash: "现金流",
    collectTitle: "付款截图与银行记录不是同一件事",
    shot: "截图",
    record: "银行",
    notReceipt: "不是到账",
    reportTitle: "管理说明的栏目，不是审计意见",
    note: "说明",
    books: "账务资料",
    analysis: "经营分析",
    licensed: "资质另列",
    notAudit: "不是审计意见",
    flowTitle: "服务流程：边界、书面、核验、交付",
    boundary: "边界",
    writing: "书面",
    check: "核验",
    delivery: "交付",
    ledgerTitle: "申报经确认后才记入银行存款和合同负债",
    claim: "申报",
    confirm: "确认",
    post: "入账",
    debit: "借记银行存款",
    credit: "贷记合同负债",
  },
  en: {
    heroTitle: "Illustration: orders, documents and receipts in one ledger",
    clarity: "Clarity",
    oneFile: "One file",
    sample: "Sample",
    principal: "Principal",
    order: "Order",
    invoice: "Invoice",
    papers: "Papers",
    bank: "Bank",
    open: "Open",
    exportTitle: "Export documents beside the receipt",
    compare: "Match",
    projectTitle: "Budget, progress, retention and cash",
    month: "Month",
    budget: "Budget",
    progress: "Progress",
    retention: "Retention",
    cash: "Cash",
    collectTitle: "A payment screenshot is not a bank record",
    shot: "Screenshot",
    record: "Bank",
    notReceipt: "Not received",
    reportTitle: "Sections of a management note, not an audit",
    note: "Note",
    books: "Books",
    analysis: "Analysis",
    licensed: "License aside",
    notAudit: "Not an audit",
    flowTitle: "Path: boundary, writing, check, delivery",
    boundary: "Boundary",
    writing: "Writing",
    check: "Check",
    delivery: "Delivery",
    ledgerTitle: "A claim is booked only after the principal confirms it",
    claim: "Claim",
    confirm: "Confirm",
    post: "Books",
    debit: "Debit cash",
    credit: "Credit liability",
  },
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function frame(w, h) {
  return `<rect width="${w}" height="${h}" fill="#e7f1ec"/>
  <defs>
    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="1.15" fill="#12352c" opacity="0.16"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>`;
}

function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img">
<title>${esc(title)}</title>
${frame(w, h)}
${body}
</svg>
`;
}

function hero(t) {
  const big = t.clarity.length > 3 ? 40 : 68;
  const cardX = t.clarity.length > 3 ? 292 : 248;
  return svg(800, 520, t.heroTitle, `
  <rect x="48" y="64" width="268" height="392" rx="24" fill="#12352c"/>
  <rect x="76" y="96" width="42" height="4" rx="2" fill="#e6d3b0"/>
  <text x="76" y="172" fill="#f7f4ee" font-family="${serif}" font-size="${big}">${esc(t.clarity)}</text>
  <text x="76" y="214" fill="#c5ddd4" font-family="${sans}" font-size="22">${esc(t.oneFile)}</text>
  <g fill="#e7f1ec" font-family="${sans}" font-size="20">
    <text x="76" y="286">${esc(t.order)}</text>
    <text x="76" y="328">${esc(t.papers)}</text>
    <text x="76" y="370">${esc(t.bank)}</text>
    <text x="76" y="412">${esc(t.open)}</text>
  </g>
  <circle cx="250" cy="412" r="6" fill="#e6d3b0"/>
  <rect x="${cardX + 16}" y="88" width="${736 - cardX}" height="344" rx="24" fill="#12352c" opacity="0.08"/>
  <rect x="${cardX}" y="72" width="${720 - cardX}" height="344" rx="24" fill="#fffcf8"/>
  <text x="${cardX + 32}" y="124" fill="#14211c" font-family="${serif}" font-size="32">${esc(t.compare)}</text>
  <rect x="${cardX + 150}" y="98" width="${t.open.length > 3 ? 132 : 108}" height="36" rx="18" fill="#f3e6df"/>
  <text x="${cardX + 168}" y="122" fill="#7c3828" font-family="${sans}" font-size="16">${esc(t.open)}</text>
  <g fill="#e6e0d4">
    <rect x="${cardX + 32}" y="168" width="180" height="12" rx="6"/>
    <rect x="${cardX + 32}" y="210" width="220" height="12" rx="6"/>
    <rect x="${cardX + 32}" y="252" width="150" height="12" rx="6"/>
    <rect x="${cardX + 32}" y="294" width="200" height="12" rx="6"/>
    <rect x="${cardX + 32}" y="336" width="120" height="12" rx="6"/>
  </g>
  <g fill="#7c3828" font-family="${sans}" font-size="16">
    <text x="${cardX + 280}" y="178">${esc(t.order)}</text>
    <text x="${cardX + 280}" y="220">${esc(t.invoice)}</text>
    <text x="${cardX + 280}" y="262">${esc(t.papers)}</text>
    <text x="${cardX + 280}" y="304">${esc(t.bank)}</text>
    <text x="${cardX + 280}" y="346">${esc(t.open)}</text>
  </g>
  `);
}

function papers(t) {
  return svg(800, 520, t.exportTitle, `
  <g transform="translate(78 108) rotate(-7 140 150)">
    <rect width="250" height="310" rx="18" fill="#fffcf8" stroke="#e3dcd0"/>
    <rect x="28" y="36" width="110" height="12" rx="6" fill="#12352c" opacity=".85"/>
    <rect x="28" y="68" width="170" height="8" rx="4" fill="#e6e0d4"/>
    <rect x="28" y="90" width="140" height="8" rx="4" fill="#e6e0d4"/>
    <rect x="28" y="112" width="160" height="8" rx="4" fill="#e6e0d4"/>
  </g>
  <rect x="168" y="78" width="280" height="340" rx="20" fill="#fffcf8" stroke="#e4ddd2"/>
  <text x="196" y="132" fill="#7c3828" font-family="${sans}" font-size="16">${esc(t.order)}</text>
  <text x="196" y="188" fill="#14211c" font-family="${serif}" font-size="64">${esc(t.compare)}</text>
  <text x="196" y="236" fill="#3a4742" font-family="${sans}" font-size="22">${esc(t.invoice)} · ${esc(t.papers)}</text>
  <rect x="196" y="268" width="200" height="10" rx="5" fill="#e6e0d4"/>
  <rect x="196" y="294" width="160" height="10" rx="5" fill="#e6e0d4"/>
  <rect x="196" y="320" width="180" height="10" rx="5" fill="#e7d2c8"/>
  <text x="196" y="378" fill="#7c3828" font-family="${sans}" font-size="20">${esc(t.open)}</text>
  <rect x="470" y="120" width="250" height="250" rx="24" fill="#12352c"/>
  <text x="498" y="176" fill="#e6d3b0" font-family="${sans}" font-size="16">${esc(t.bank)}</text>
  <rect x="498" y="204" width="150" height="12" rx="6" fill="#f7f4ee" opacity=".9"/>
  <rect x="498" y="236" width="180" height="12" rx="6" fill="#f7f4ee" opacity=".45"/>
  <rect x="498" y="268" width="120" height="12" rx="6" fill="#e7d2c8"/>
  <text x="498" y="330" fill="#f7f4ee" font-family="${sans}" font-size="22">${esc(t.open)}</text>
  `);
}

function project(t) {
  const rows = [t.budget, t.progress, t.retention, t.cash];
  const lanes = rows
    .map((label, index) => {
      const y = 168 + index * 78;
      return `<rect x="64" y="${y}" width="672" height="62" rx="16" fill="#fffcf8"/>
      <text x="88" y="${y + 40}" fill="#14211c" font-family="${sans}" font-size="24">${esc(label)}</text>
      ${
        index === 3
          ? `<rect x="300" y="${y + 24}" width="150" height="14" rx="7" fill="#d5e4dc"/><rect x="462" y="${y + 24}" width="150" height="14" rx="7" fill="#e7d2c8"/>`
          : `<rect x="300" y="${y + 24}" width="280" height="14" rx="7" fill="#d5e4dc"/>`
      }`;
    })
    .join("");
  return svg(800, 520, t.projectTitle, `
  <text x="64" y="92" fill="#7c3828" font-family="${sans}" font-size="16">${esc(t.sample)}</text>
  <text x="64" y="148" fill="#14211c" font-family="${serif}" font-size="56">${esc(t.month)}</text>
  ${lanes}
  `);
}

function collect(t) {
  return svg(800, 520, t.collectTitle, `
  <rect x="48" y="70" width="320" height="380" rx="24" fill="#fffcf8"/>
  <text x="80" y="122" fill="#7c3828" font-family="${sans}" font-size="18">${esc(t.shot)}</text>
  <rect x="80" y="150" width="200" height="12" rx="6" fill="#e6e0d4"/>
  <rect x="80" y="178" width="240" height="12" rx="6" fill="#e6e0d4"/>
  <rect x="80" y="206" width="160" height="12" rx="6" fill="#e6e0d4"/>
  <rect x="80" y="250" width="200" height="64" rx="14" fill="none" stroke="#7c3828" stroke-width="3"/>
  <text x="104" y="290" fill="#7c3828" font-family="${serif}" font-size="28">${esc(t.open)}</text>
  <text x="80" y="390" fill="#14211c" font-family="${serif}" font-size="36">${esc(t.notReceipt)}</text>
  <rect x="432" y="70" width="320" height="380" rx="24" fill="#12352c"/>
  <text x="464" y="122" fill="#e6d3b0" font-family="${sans}" font-size="18">${esc(t.record)}</text>
  <text x="464" y="200" fill="#f7f4ee" font-family="${serif}" font-size="52">${esc(t.confirm)}</text>
  <rect x="464" y="236" width="200" height="12" rx="6" fill="#f7f4ee" opacity=".85"/>
  <rect x="464" y="268" width="160" height="12" rx="6" fill="#f7f4ee" opacity=".4"/>
  <text x="464" y="360" fill="#c5ddd4" font-family="${sans}" font-size="20">${esc(t.principal)}</text>
  <circle cx="400" cy="260" r="28" fill="#f4f1ea" stroke="#7c3828" stroke-width="3"/>
  <text x="388" y="268" fill="#7c3828" font-family="${serif}" font-size="28">≠</text>
  `);
}

function report(t) {
  return svg(800, 520, t.reportTitle, `
  <rect x="180" y="48" width="440" height="424" rx="24" fill="#fffcf8"/>
  <rect x="148" y="78" width="36" height="300" rx="8" fill="#12352c"/>
  <text x="220" y="112" fill="#7c3828" font-family="${sans}" font-size="16">${esc(t.notAudit)}</text>
  <text x="220" y="176" fill="#14211c" font-family="${serif}" font-size="64">${esc(t.note)}</text>
  <g font-family="${sans}" font-size="24" fill="#14211c">
    <rect x="220" y="214" width="28" height="28" rx="8" fill="#e7f1ec"/>
    <text x="264" y="236">${esc(t.books)}</text>
    <rect x="220" y="270" width="28" height="28" rx="8" fill="#e7f1ec"/>
    <text x="264" y="292">${esc(t.analysis)}</text>
    <rect x="220" y="326" width="28" height="28" rx="8" fill="#f3e6df"/>
    <text x="264" y="348">${esc(t.licensed)}</text>
  </g>
  <rect x="220" y="400" width="220" height="12" rx="6" fill="#e6e0d4"/>
  `);
}

function flow(t) {
  const cells = [
    ["01", t.boundary, false],
    ["02", t.writing, false],
    ["03", t.check, false],
    ["04", t.delivery, true],
  ];
  const body = cells
    .map(([n, label, dark], index) => {
      const x = (index % 2) * 380 + 32;
      const y = Math.floor(index / 2) * 300 + 28;
      const ink = dark ? "#f7f4ee" : "#14211c";
      const kicker = dark ? "#e6d3b0" : "#7c3828";
      return `<rect x="${x}" y="${y}" width="356" height="272" rx="24" fill="${dark ? "#12352c" : "#fffcf8"}"/>
      <text x="${x + 32}" y="${y + 84}" fill="${kicker}" font-family="${sans}" font-size="22">${n}</text>
      <text x="${x + 32}" y="${y + 164}" fill="${ink}" font-family="${serif}" font-size="52">${esc(label)}</text>`;
    })
    .join("");
  return svg(800, 640, t.flowTitle, body);
}

function ledger(t) {
  const rows = [
    ["01", t.claim, t.notReceipt, false],
    ["02", t.confirm, t.open, false],
    ["03", t.post, `${t.debit} · ${t.credit}`, true],
  ];
  const body = rows
    .map(([n, title, sub, dark], index) => {
      const y = 28 + index * 216;
      return `<rect x="32" y="${y}" width="736" height="196" rx="24" fill="${dark ? "#12352c" : "#fffcf8"}"/>
      <text x="64" y="${y + 64}" fill="${dark ? "#e6d3b0" : "#7c3828"}" font-family="${sans}" font-size="20">${n}</text>
      <text x="140" y="${y + 78}" fill="${dark ? "#f7f4ee" : "#14211c"}" font-family="${serif}" font-size="48">${esc(title)}</text>
      <text x="64" y="${y + 142}" fill="${dark ? "#c5ddd4" : "#3a4742"}" font-family="${sans}" font-size="24">${esc(sub)}</text>`;
    })
    .join("");
  return svg(800, 700, t.ledgerTitle, body);
}

export function ogSvg(locale) {
  if (locale === "en") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#12352c"/>
  <circle cx="1040" cy="90" r="210" fill="none" stroke="#e6d3b0" stroke-opacity="0.28" stroke-width="26"/>
  <rect x="72" y="78" width="48" height="4" rx="2" fill="#e6d3b0"/>
  <text x="72" y="128" fill="#e6d3b0" font-family="${sans}" font-size="18" letter-spacing="3.5">FINANPIVOT</text>
  <text x="72" y="206" fill="#f7f4ee" font-family="${serif}" font-size="46">Clearer cross-border</text>
  <text x="72" y="262" fill="#f7f4ee" font-family="${serif}" font-size="46">finance, for clearer</text>
  <text x="72" y="318" fill="#f7f4ee" font-family="${serif}" font-size="46">decisions.</text>
  <text x="72" y="378" fill="#c5ddd4" font-family="${sans}" font-size="22">Financial Clarity. Business Forward.</text>
  <g font-family="${sans}" font-size="16" fill="#12352c">
    <rect x="72" y="428" width="148" height="42" rx="21" fill="#e7f1ec"/>
    <text x="94" y="455">No payment</text>
    <rect x="232" y="428" width="132" height="42" rx="21" fill="#e7f1ec"/>
    <text x="258" y="455">No clients</text>
    <rect x="376" y="428" width="168" height="42" rx="21" fill="#f3e6df"/>
    <text x="398" y="455" fill="#7c3828">Not stored here</text>
  </g>
  <rect x="760" y="78" width="376" height="474" rx="28" fill="#fffcf8"/>
  <text x="792" y="132" fill="#14211c" font-family="${serif}" font-size="32">Sheet</text>
  <rect x="980" y="100" width="120" height="36" rx="18" fill="#f3e6df"/>
  <text x="1006" y="124" fill="#7c3828" font-family="${sans}" font-size="16">Sample</text>
  <g font-family="${sans}" font-size="18" fill="#3a4742">
    <text x="792" y="196">Order</text>
    <text x="792" y="254">Invoice</text>
    <text x="792" y="312">Papers</text>
    <text x="792" y="370">Bank</text>
    <text x="792" y="436">Open</text>
  </g>
  <g fill="#e6e0d4">
    <rect x="930" y="180" width="150" height="12" rx="6"/>
    <rect x="930" y="238" width="120" height="12" rx="6"/>
    <rect x="930" y="296" width="160" height="12" rx="6"/>
    <rect x="930" y="354" width="100" height="12" rx="6"/>
  </g>
  <rect x="930" y="412" width="128" height="32" rx="16" fill="#f3e6df"/>
  <text x="948" y="434" fill="#7c3828" font-family="${sans}" font-size="16">Unchecked</text>
</svg>
`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#12352c"/>
  <circle cx="1040" cy="90" r="210" fill="none" stroke="#e6d3b0" stroke-opacity="0.28" stroke-width="26"/>
  <rect x="72" y="78" width="48" height="4" rx="2" fill="#e6d3b0"/>
  <text x="72" y="128" fill="#e6d3b0" font-family="${sans}" font-size="18" letter-spacing="3.5">FINANPIVOT</text>
  <text x="72" y="220" fill="#f7f4ee" font-family="${serif}" font-size="54">让跨境财务更清晰</text>
  <text x="72" y="294" fill="#f7f4ee" font-family="${serif}" font-size="54">让经营决策更有依据</text>
  <text x="72" y="360" fill="#c5ddd4" font-family="${sans}" font-size="22">Financial Clarity. Business Forward.</text>
  <g font-family="${sans}" font-size="18" fill="#12352c">
    <rect x="72" y="418" width="168" height="44" rx="22" fill="#e7f1ec"/>
    <text x="96" y="446">网站不收款</text>
    <rect x="256" y="418" width="168" height="44" rx="22" fill="#e7f1ec"/>
    <text x="280" y="446">不展示名单</text>
    <rect x="440" y="418" width="168" height="44" rx="22" fill="#f3e6df"/>
    <text x="464" y="446" fill="#7c3828">咨询不留存</text>
  </g>
  <rect x="760" y="78" width="376" height="474" rx="28" fill="#fffcf8"/>
  <text x="792" y="132" fill="#14211c" font-family="${serif}" font-size="32">对照表</text>
  <rect x="980" y="100" width="116" height="36" rx="18" fill="#f3e6df"/>
  <text x="1008" y="124" fill="#7c3828" font-family="${sans}" font-size="16">示意</text>
  <g font-family="${sans}" font-size="18" fill="#3a4742">
    <text x="792" y="196">订单</text>
    <text x="792" y="254">发票</text>
    <text x="792" y="312">单据</text>
    <text x="792" y="370">收汇</text>
    <text x="792" y="436">差异</text>
  </g>
  <g fill="#e6e0d4">
    <rect x="900" y="180" width="180" height="12" rx="6"/>
    <rect x="900" y="238" width="140" height="12" rx="6"/>
    <rect x="900" y="296" width="170" height="12" rx="6"/>
    <rect x="900" y="354" width="110" height="12" rx="6"/>
  </g>
  <rect x="900" y="412" width="108" height="32" rx="16" fill="#f3e6df"/>
  <text x="918" y="434" fill="#7c3828" font-family="${sans}" font-size="16">未核对</text>
</svg>
`;
}

export function illustrations(locale) {
  const t = copy[locale] || copy.zh;
  return {
    "hero.svg": hero(t),
    "export.svg": papers(t),
    "project.svg": project(t),
    "collect.svg": collect(t),
    "report.svg": report(t),
    "flow.svg": flow(t),
    "ledger.svg": ledger(t),
  };
}
