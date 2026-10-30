import { mkdirSync, writeFileSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "..", "..", "dist", "www");

const pages = [
  ["index.html", "首页", "FinanPivot"],
  ["services.html", "服务", "四项服务"],
  ["how-we-work.html", "流程", "服务流程"],
  ["about.html", "原则", "工作原则"],
  ["contact.html", "联系", "联系我们"],
  ["privacy.html", "隐私", "隐私说明"],
  ["terms.html", "条款", "服务边界"],
];

const css = `
:root { color-scheme: light; --ink:#1c1915; --paper:#f6f1e8; --line:#d9d0c3; --seal:#8c3a2f; }
* { box-sizing: border-box; }
body { margin:0; background:var(--paper); color:var(--ink); font:18px/1.6 "Segoe UI", sans-serif; }
header, main, footer { width:min(960px, calc(100% - 32px)); margin:0 auto; }
header { display:flex; justify-content:space-between; gap:16px; align-items:end; padding:24px 0 12px; }
nav { display:flex; flex-wrap:wrap; gap:8px 14px; }
a { color:inherit; }
nav a { text-decoration:none; border-bottom:1px solid transparent; }
nav a[aria-current="page"] { border-color:var(--seal); }
h1, h2 { font-family: Georgia, serif; font-weight:500; line-height:1.25; }
h1 { font-size: clamp(36px, 6vw, 64px); margin:12px 0; }
.kicker { letter-spacing:.08em; text-transform:uppercase; font-size:13px; color:var(--seal); }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.card, .note { border:1px solid var(--line); padding:16px 18px; background:#fffdf8; }
.note { border-left:3px solid var(--seal); }
footer { padding:28px 0 48px; color:#5c564c; font-size:15px; }
@media (max-width:720px) { .grid { grid-template-columns:1fr; } }
`;

function layout(title, current, body) {
  const nav = pages
    .map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · FinanPivot</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
  <div><div class="kicker">FinanPivot</div><strong>跨境财务与专业外包</strong></div>
  <nav>${nav}</nav>
</header>
<main>${body}</main>
<footer>
  <p>Financial Clarity. Business Forward.</p>
  <p>联系：<a href="mailto:admin@finanpivot.com">admin@finanpivot.com</a> · QQ 3942114211</p>
  <p>本网站介绍服务范围，不构成法律、审计、投资或税务意见。正式工作以书面合同为准。</p>
</footer>
</body>
</html>`;
}

const bodies = {
  "index.html": `
<p class="kicker">Global Finance &amp; Business Advisory</p>
<h1>让跨境财务更清晰，让企业经营更稳健。</h1>
<p>FinanPivot 为开展出口贸易、海外工程项目及跨境经营的企业提供财务运营支持、项目财务管理、跨境结算协同和专业财务外包服务。</p>
<div class="grid">
  <a class="card" href="services.html"><strong>出口企业财务运营支持</strong><p>把订单、单据和收付款放进同一本台账。</p></a>
  <a class="card" href="services.html"><strong>海外工程与项目财务管理</strong><p>跟踪预算、里程碑、质保金和现金流。</p></a>
  <a class="card" href="services.html"><strong>跨境结算与应收账款专项</strong><p>核对到账差异、账龄和跟进事项。</p></a>
  <a class="card" href="services.html"><strong>财务外包与管理报告</strong><p>按约定周期交出管理摘要，关键判断由授权人员负责。</p></a>
</div>
<p class="note">我们不代替海关、银行、税务机关或持牌机构作出审批或鉴证，也不擅自经手客户资金。</p>`,
  "services.html": `
<h1>四项服务</h1>
<article class="card"><h2>出口企业财务运营支持</h2><p>适用出口贸易、跨境供应链和外贸团队。工作包括单据归集、应收与到账差异、收汇结汇资料整理，以及按客户、订单、币种和合同批次形成管理报表。</p><p>交付：资料包、匹配表、差异清单、账龄表、月度摘要。不代替报关、银行或税务审批。</p></article>
<article class="card"><h2>海外工程与项目财务管理</h2><p>适用海外工程承包、项目型企业和跨境设备或工程服务商。工作包括预算、合同金额、里程碑、预付款、进度款、质保金和变更签证的台账，以及多币种资金计划和项目月报。</p><p>不代替工程质量、法律或税务结论，不托管客户资金。</p></article>
<article class="card"><h2>跨境结算与应收账款专项</h2><p>把合同、发票、出货或服务记录和银行流水对上。整理逾期事项、跨币种差异和跟进计划。</p><p>不承诺债务回收，不提供诉讼、法律催收或资金支付服务。</p></article>
<article class="card"><h2>财务外包与管理报告</h2><p>为没有完整内部财务团队的企业做资料归集、台账、月度汇总和流程留痕建议。</p><p>需要会计代理、审计、税务代理或支付许可的事项，只有在运营主体具备资质或由合资格机构提供时才承接。</p></article>`,
  "how-we-work.html": `
<h1>服务流程</h1>
<ol>
<li>初步沟通：了解企业、地区、业务模式和财务痛点。</li>
<li>范围确认：核实主体、授权、资料范围、交付物和时间。</li>
<li>方案与报价：按项目、周期或工作量报价，由负责人审批。</li>
<li>合同签署：通过经批准的第三方电子签服务商托管签署。</li>
<li>资料接收：只通过双方确认的渠道收集必要资料。</li>
<li>执行与跟踪：建立订单、应收、项目和差异台账。</li>
<li>财务核验：银行转账由财务负责人核验实际到账。付款截图只是待核验资料。</li>
<li>复核与交付：检查工作底稿、差异、复核和负责人签发。</li>
<li>复盘：月度复盘、风险提示和下一周期计划。</li>
</ol>`,
  "about.html": `
<h1>工作原则</h1>
<ul>
<li>授权优先：只处理客户明确授权的主体、账户、项目和资料。</li>
<li>数据最小化：只收集完成约定服务所需的信息。</li>
<li>过程可追溯：合同、资料、审批、收款核验和交付留有记录。</li>
<li>资金分离：不把客户资金和服务方资金混在一起，不擅自代付或托管。</li>
<li>专业边界：会计、税务、法律、审计和受监管服务按资质与当地法规执行。</li>
<li>人工负责：自动化可以协助整理，关键判断、资金确认、报价和交付由授权人员负责。</li>
</ul>
<p>FinanPivot 面向中国企业的全球化经营，提供跨境财务管理与专业财务外包。品牌主张是 Financial Clarity. Business Forward.</p>`,
  "contact.html": `
<h1>联系我们</h1>
<p>首期不在网站上收集表单。请发邮件或通过 QQ 联系，说明企业、业务地区和希望先看的事项。</p>
<p>邮箱：<a href="mailto:admin@finanpivot.com">admin@finanpivot.com</a></p>
<p>QQ：3942114211</p>
<p class="note">这是一次初步沟通，不是合同，也不是订单。报价、签署和收款核验都在后续书面流程里完成。</p>`,
  "privacy.html": `
<h1>隐私说明</h1>
<p>本网站首期不设置在线表单，不把咨询内容存在浏览器里。你主动发送到邮箱或 QQ 的内容，只用于回复这次沟通和判断是否适合进一步服务。</p>
<p>我们只保留完成约定服务所需的资料，并按书面约定的期限保存。你可以通过 admin@finanpivot.com 询问、更正或要求删除尚未进入合同履约所必需的资料。</p>
<p>若后续启用第三方电子签或银行核验，相关资料由对应机构和书面合同约定处理。上线前的主体信息和适用地区规则，以正式文本为准。</p>`,
  "terms.html": `
<h1>服务边界</h1>
<p>网站上的介绍不是合同、报价或专业意见。服务范围、费用、交付物和责任以双方签署的书面合同为准。</p>
<p>除非合同和资质明确允许，本网站不构成法律、审计、投资或税务意见，也不代替海关、银行、税务机关或持牌机构。</p>
<p>我们不承诺投资收益、税务节省、债务回收成功率，也不宣称在所有国家都具备同一项资质。</p>`,
};

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "styles.css"), css);
for (const [file, , title] of pages) {
  writeFileSync(join(out, file), layout(title, file, bodies[file]));
}

const forbidden = ["DATABASE_URL", "FINANCE_SESSION_SECRET", "FINANCE_DATA_KEY", "BEGIN PRIVATE KEY", "fin_staff"];
const files = readdirSync(out);
for (const file of files) {
  const text = readFileSync(join(out, file), "utf8");
  for (const word of forbidden) {
    if (text.includes(word)) throw new Error(`forbidden token in ${file}`);
  }
}
const hash = createHash("sha256");
for (const file of files.sort()) {
  hash.update(file);
  hash.update(readFileSync(join(out, file)));
  hash.update(String(statSync(join(out, file)).size));
}
const digest = hash.digest("hex");
writeFileSync(join(out, "ARTIFACT_SHA256.txt"), `${digest}\n`);
console.log(digest);
