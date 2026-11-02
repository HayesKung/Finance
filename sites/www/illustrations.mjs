// Original illustrations for finanpivot.com.
// Drawn with shapes, not live text, so a missing CJK font cannot blank them out.
// No amounts, clients, licenses, or results.

const C = {
  pine: "#12352c",
  cream: "#fffcf8",
  sage: "#e7f1ec",
  sage2: "#d5e4dc",
  copper: "#7c3828",
  gold: "#e6d3b0",
  ink: "#14211c",
  line: "#e4ddd2",
  blush: "#f3e6df",
  mist: "#c5ddd4",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img">
<title>${esc(title)}</title>
<rect width="${w}" height="${h}" fill="${C.sage}"/>
<circle cx="${w - 36}" cy="28" r="120" fill="${C.pine}" opacity="0.05"/>
<circle cx="18" cy="${h - 8}" r="88" fill="${C.copper}" opacity="0.05"/>
${body}
</svg>
`;
}

function shadow(x, y, w, h, r = 24) {
  return `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="${r}" fill="${C.pine}" opacity="0.08"/>`;
}

function check(x, y, size, color) {
  const sw = Math.max(2.2, size * 0.14);
  return `<path d="M${x} ${y + size * 0.52} l${size * 0.28} ${size * 0.26} ${size * 0.52 - size * 0.28} ${-(size * 0.58)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function seal(cx, cy, r, color = C.copper) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="${color}" stroke-width="1.5"/>
  ${check(cx - r * 0.38, cy - r * 0.42, r * 0.85, color)}`;
}

function doc(x, y, w, h) {
  const fold = 28;
  return `${shadow(x, y, w, h, 18)}
  <path d="M${x} ${y + 16} q0-16 16-16 h${w - 16 - fold} l${fold} ${fold} v${h - 16 - fold} q0 16 -16 16 h-${w - 32} q-16 0 -16-16 z" fill="${C.cream}"/>
  <path d="M${x + w - fold} ${y} v${fold} h${fold}" fill="${C.sage2}"/>`;
}

function row(x, y, w, tone = C.sage2) {
  return `<rect x="${x}" y="${y}" width="14" height="14" rx="4" fill="${tone}"/>
  <rect x="${x + 24}" y="${y + 3}" width="${w}" height="8" rx="4" fill="${tone}"/>`;
}

function hero(title) {
  return svg(800, 520, title, `
  ${shadow(86, 58, 250, 400, 28)}
  <rect x="78" y="46" width="250" height="400" rx="28" fill="${C.pine}"/>
  <rect x="106" y="78" width="46" height="4" rx="2" fill="${C.gold}"/>
  <circle cx="128" cy="132" r="26" fill="${C.pine}" stroke="${C.gold}" stroke-width="2.5"/>
  <path d="M128 114 l-14 6 v12 c0 10 6 16 14 19 8-3 14-9 14-19 v-12 z" fill="none" stroke="${C.gold}" stroke-width="2"/>
  ${[0, 1, 2, 3].map((i) => {
    const y = 196 + i * 52;
    return `<circle cx="122" cy="${y}" r="14" fill="#1c4a3e"/>
      ${check(114, y - 10, 16, C.gold)}
      <rect x="148" y="${y - 5}" width="${i === 3 ? 92 : 128}" height="10" rx="5" fill="${C.mist}" opacity="${0.95 - i * 0.12}"/>`;
  }).join("")}
  ${doc(300, 78, 390, 360)}
  <rect x="332" y="112" width="84" height="10" rx="5" fill="${C.copper}"/>
  ${row(332, 156, 180, C.pine)}
  ${row(332, 196, 150, C.sage2)}
  ${row(332, 236, 168, C.sage2)}
  <rect x="332" y="286" width="168" height="72" rx="16" fill="${C.blush}"/>
  <rect x="352" y="308" width="22" height="18" rx="3" fill="none" stroke="${C.copper}" stroke-width="2"/>
  <path d="M358 308 v-6 a7 7 0 0 1 14 0 v6" fill="none" stroke="${C.copper}" stroke-width="2"/>
  <rect x="386" y="312" width="88" height="8" rx="4" fill="${C.copper}" opacity="0.8"/>
  ${seal(628, 168, 36)}
  `);
}

function papers(title) {
  return svg(800, 520, title, `
  <g transform="translate(64 96) rotate(-8 130 160)">
    ${doc(0, 0, 230, 300)}
    ${row(28, 48, 110, C.pine)}
    ${row(28, 88, 140)}
    ${row(28, 124, 100)}
  </g>
  ${doc(168, 64, 300, 380)}
  <rect x="200" y="100" width="72" height="10" rx="5" fill="${C.copper}"/>
  ${[0, 1, 2, 3].map((i) => {
    const y = 150 + i * 52;
    return `<rect x="200" y="${y}" width="36" height="36" rx="10" fill="${i === 3 ? C.blush : C.sage}"/>
      <path d="M212 ${y + 10} h12 v16 h-12 z" fill="none" stroke="${i === 3 ? C.copper : C.pine}" stroke-width="2"/>
      <rect x="250" y="${y + 8}" width="${150 - i * 16}" height="8" rx="4" fill="${C.pine}" opacity="0.85"/>
      <rect x="250" y="${y + 22}" width="70" height="8" rx="4" fill="${C.sage2}"/>`;
  }).join("")}
  ${shadow(500, 118, 236, 270, 28)}
  <rect x="492" y="106" width="236" height="270" rx="28" fill="${C.pine}"/>
  <rect x="520" y="138" width="42" height="4" rx="2" fill="${C.gold}"/>
  <rect x="520" y="168" width="120" height="10" rx="5" fill="${C.cream}" opacity="0.9"/>
  <rect x="520" y="196" width="160" height="10" rx="5" fill="${C.mist}" opacity="0.55"/>
  <rect x="520" y="224" width="96" height="10" rx="5" fill="${C.gold}"/>
  ${seal(610, 312, 34, C.gold)}
  `);
}

function project(title) {
  const icons = [
    (x, y) => `<ellipse cx="${x}" cy="${y + 4}" rx="10" ry="6" fill="none" stroke="${C.pine}" stroke-width="2"/><ellipse cx="${x}" cy="${y - 2}" rx="10" ry="6" fill="${C.sage}" stroke="${C.pine}" stroke-width="2"/>`,
    (x, y) => `<path d="M${x - 10} ${y + 8} v-6 M${x - 3} ${y + 8} v-12 M${x + 4} ${y + 8} v-8 M${x + 11} ${y + 8} v-14" stroke="${C.pine}" stroke-width="2.4" stroke-linecap="round"/>`,
    (x, y) => `<rect x="${x - 8}" y="${y - 2}" width="16" height="12" rx="2" fill="none" stroke="${C.pine}" stroke-width="2"/><path d="M${x - 4} ${y - 2} v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="${C.pine}" stroke-width="2"/>`,
    (x, y) => `<path d="M${x - 12} ${y} h10 M${x + 2} ${y} h10" stroke="${C.pine}" stroke-width="3" stroke-linecap="round"/><path d="M${x - 4} ${y - 6} l4 6 -4 6 M${x + 4} ${y - 6} l-4 6 4 6" fill="none" stroke="${C.copper}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  ];
  const lanes = icons.map((icon, index) => {
    const y = 132 + index * 84;
    const split = index === 3;
    return `<rect x="64" y="${y}" width="672" height="70" rx="18" fill="${C.cream}"/>
      <rect x="84" y="${y + 14}" width="42" height="42" rx="12" fill="${C.sage}"/>
      ${icon(105, y + 35)}
      ${split
        ? `<rect x="150" y="${y + 28}" width="250" height="14" rx="7" fill="${C.sage2}"/>
           <rect x="412" y="${y + 28}" width="250" height="14" rx="7" fill="${C.blush}"/>
           <circle cx="392" cy="${y + 35}" r="6" fill="${C.pine}"/>
           <circle cx="654" cy="${y + 35}" r="6" fill="${C.copper}"/>`
        : `<rect x="150" y="${y + 28}" width="520" height="14" rx="7" fill="${C.sage}"/>
           <rect x="150" y="${y + 28}" width="${220 + index * 70}" height="14" rx="7" fill="${C.sage2}"/>
           <circle cx="${150 + 220 + index * 70}" cy="${y + 35}" r="7" fill="${C.pine}"/>`}
    `;
  }).join("");
  return svg(800, 520, title, `
  <rect x="64" y="48" width="120" height="36" rx="18" fill="${C.cream}"/>
  <rect x="80" y="60" width="18" height="14" rx="2" fill="none" stroke="${C.copper}" stroke-width="2"/>
  <path d="M80 64 h18 M86 58 v4 M96 58 v4" stroke="${C.copper}" stroke-width="1.6" fill="none"/>
  <rect x="108" y="64" width="56" height="8" rx="4" fill="${C.copper}"/>
  ${lanes}
  `);
}

function collect(title) {
  return svg(800, 520, title, `
  ${shadow(48, 70, 300, 380, 28)}
  <rect x="40" y="58" width="300" height="380" rx="28" fill="${C.cream}"/>
  <rect x="68" y="90" width="244" height="168" rx="16" fill="${C.sage}"/>
  <path d="M68 210 l70-52 46 34 40-28 88 70 v16 a16 16 0 0 1 -16 16 h-212 a16 16 0 0 1 -16-16 z" fill="${C.sage2}"/>
  <circle cx="118" cy="132" r="16" fill="${C.gold}"/>
  <rect x="68" y="284" width="150" height="12" rx="6" fill="${C.line}"/>
  <rect x="68" y="312" width="190" height="12" rx="6" fill="${C.line}"/>
  ${seal(250, 360, 32)}
  <circle cx="400" cy="250" r="36" fill="${C.paper}" stroke="${C.copper}" stroke-width="3"/>
  <path d="M384 238 h32 M384 262 h32" stroke="${C.copper}" stroke-width="4" stroke-linecap="round"/>
  ${shadow(460, 70, 300, 380, 28)}
  <rect x="452" y="58" width="300" height="380" rx="28" fill="${C.pine}"/>
  <rect x="484" y="96" width="48" height="4" rx="2" fill="${C.gold}"/>
  <path d="M484 150 h16 l8-14 8 28 8-14 h48" fill="none" stroke="${C.gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="484" y="190" width="180" height="12" rx="6" fill="${C.cream}" opacity="0.9"/>
  <rect x="484" y="220" width="140" height="12" rx="6" fill="${C.mist}" opacity="0.5"/>
  <rect x="484" y="250" width="160" height="12" rx="6" fill="${C.mist}" opacity="0.35"/>
  <circle cx="600" cy="350" r="36" fill="#1c4a3e"/>
  ${check(582, 332, 36, C.gold)}
  `);
}

function report(title) {
  return svg(800, 520, title, `
  <rect x="118" y="64" width="28" height="392" rx="8" fill="${C.pine}"/>
  ${shadow(146, 48, 360, 424, 24)}
  <rect x="138" y="36" width="360" height="424" rx="24" fill="${C.cream}"/>
  <rect x="170" y="72" width="96" height="10" rx="5" fill="${C.copper}"/>
  <rect x="170" y="110" width="220" height="90" rx="16" fill="${C.sage}"/>
  <path d="M196 176 v-36 M230 176 v-52 M264 176 v-24 M298 176 v-44" stroke="${C.pine}" stroke-width="8" stroke-linecap="round"/>
  ${[0, 1, 2].map((i) => {
    const y = 230 + i * 58;
    return `<rect x="170" y="${y}" width="36" height="36" rx="10" fill="${i === 2 ? C.blush : C.sage}"/>
      <rect x="220" y="${y + 8}" width="${180 - i * 24}" height="8" rx="4" fill="${C.pine}" opacity="0.85"/>
      <rect x="220" y="${y + 22}" width="90" height="8" rx="4" fill="${C.sage2}"/>`;
  }).join("")}
  ${shadow(520, 150, 220, 250, 24)}
  <rect x="512" y="138" width="220" height="250" rx="24" fill="${C.cream}" stroke="${C.copper}" stroke-width="2" stroke-dasharray="7 6"/>
  <circle cx="622" cy="210" r="28" fill="${C.blush}"/>
  <path d="M622 190 v28 M610 204 h24" stroke="${C.copper}" stroke-width="2.4" stroke-linecap="round"/>
  <rect x="548" y="262" width="148" height="10" rx="5" fill="${C.copper}" opacity="0.75"/>
  <rect x="568" y="286" width="108" height="10" rx="5" fill="${C.line}"/>
  <rect x="548" y="322" width="36" height="28" rx="8" fill="${C.sage}"/>
  <rect x="594" y="322" width="36" height="28" rx="8" fill="${C.blush}"/>
  <rect x="640" y="322" width="36" height="28" rx="8" fill="${C.sage2}"/>
  `);
}

function flow(title) {
  const nodes = [0, 1, 2, 3].map((index) => {
    const x = 70 + index * 180;
    const dark = index === 3;
    const fill = dark ? C.pine : C.cream;
    const ink = dark ? C.gold : C.pine;
    return `<rect x="${x}" y="150" width="140" height="200" rx="24" fill="${fill}"/>
      <circle cx="${x + 70}" cy="214" r="28" fill="${dark ? "#1c4a3e" : C.sage}"/>
      ${check(x + 56, 200, 28, ink)}
      <rect x="${x + 28}" y="268" width="84" height="10" rx="5" fill="${dark ? C.gold : C.pine}"/>
      <rect x="${x + 40}" y="292" width="60" height="8" rx="4" fill="${dark ? C.mist : C.sage2}"/>`;
  }).join("");
  return svg(800, 520, title, `
  <path d="M150 250 h500" stroke="${C.copper}" stroke-width="3" stroke-linecap="round"/>
  ${nodes}
  `);
}

function ledger(title) {
  const cards = [0, 1, 2].map((index) => {
    const y = 36 + index * 160;
    const dark = index === 2;
    return `<rect x="48" y="${y}" width="704" height="140" rx="24" fill="${dark ? C.pine : C.cream}"/>
      <circle cx="118" cy="${y + 70}" r="28" fill="${dark ? "#1c4a3e" : C.sage}"/>
      ${check(104, y + 56, 28, dark ? C.gold : C.pine)}
      <rect x="170" y="${y + 46}" width="220" height="12" rx="6" fill="${dark ? C.gold : C.pine}"/>
      <rect x="170" y="${y + 74}" width="320" height="10" rx="5" fill="${dark ? C.mist : C.sage2}"/>`;
  }).join("");
  return svg(800, 520, title, cards);
}

const titles = {
  zh: {
    hero: "示意：授权、记录、资金分开，由负责人确认",
    export: "出口单据与收汇记录对照",
    project: "项目预算、进度、质保金与现金流",
    collect: "付款截图与银行记录不是同一件事",
    report: "管理说明的栏目，不是审计意见",
    flow: "服务流程：边界、书面、核验、交付",
    ledger: "申报经确认后才记入银行存款和合同负债",
  },
  en: {
    hero: "Illustration: authority, a record, separate funds, and a person confirming",
    export: "Export documents beside the receipt",
    project: "Budget, progress, retention and cash",
    collect: "A payment screenshot is not a bank record",
    report: "Sections of a management note, not an audit",
    flow: "Path: boundary, writing, check, delivery",
    ledger: "A claim is booked only after the principal confirms it",
  },
};

export function ogSvg(locale) {
  const en = locale === "en";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#12352c"/>
  <circle cx="1040" cy="90" r="210" fill="none" stroke="#e6d3b0" stroke-opacity="0.28" stroke-width="26"/>
  <rect x="72" y="78" width="48" height="4" rx="2" fill="#e6d3b0"/>
  <text x="72" y="128" fill="#e6d3b0" font-family="Noto Sans SC, sans-serif" font-size="18" letter-spacing="3.5">FINANPIVOT</text>
  ${en
    ? `<text x="72" y="210" fill="#f7f4ee" font-family="Noto Sans SC, sans-serif" font-size="48" font-weight="600">Clearer cross-border</text>
  <text x="72" y="270" fill="#f7f4ee" font-family="Noto Sans SC, sans-serif" font-size="48" font-weight="600">finance, for clearer</text>
  <text x="72" y="330" fill="#f7f4ee" font-family="Noto Sans SC, sans-serif" font-size="48" font-weight="600">decisions.</text>`
    : `<text x="72" y="214" fill="#f7f4ee" font-family="Noto Sans SC, sans-serif" font-size="52" font-weight="600">让跨境财务更清晰</text>
  <text x="72" y="286" fill="#f7f4ee" font-family="Noto Sans SC, sans-serif" font-size="52" font-weight="600">让经营决策更有依据</text>`}
  <text x="72" y="${en ? 390 : 360}" fill="#c5ddd4" font-family="Noto Sans SC, sans-serif" font-size="22">Financial Clarity. Business Forward.</text>
</svg>
`;
}

export function illustrations(locale) {
  const t = titles[locale] || titles.zh;
  return {
    "hero.svg": hero(t.hero),
    "export.svg": papers(t.export),
    "project.svg": project(t.project),
    "collect.svg": collect(t.collect),
    "report.svg": report(t.report),
    "flow.svg": flow(t.flow),
    "ledger.svg": ledger(t.ledger),
  };
}
