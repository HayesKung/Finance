const QQ = "3942114211";
const MAIL = "admin@finanpivot.com";

export const assetAlt = {
  "favicon.svg": "FinanPivot 标志",
  "hero.svg": "示意：订单、单据与收付款汇入同一本台账",
  "flow.svg": "服务流程：准入、报价、核验、交付",
  "ledger.svg": "账务关系：客户申报经负责人确认后记入银行存款和合同负债",
  "export.svg": "出口单据与收汇记录对照",
  "project.svg": "项目进度与资金计划",
  "collect.svg": "合同、发票与到账三方核对",
  "report.svg": "月度管理报告趋势",
};

const nav = [
  ["index.html", "首页"],
  ["services.html", "服务"],
  ["how-we-work.html", "流程"],
  ["about.html", "原则"],
  ["faq.html", "问答"],
  ["contact.html", "联系"],
];

function contactActions() {
  return `<div class="actions">
    <a href="mailto:${MAIL}">${MAIL}</a>
    <a href="https://wpa.qq.com/msgrd?v=3&uin=${QQ}&amp;site=qq&amp;menu=yes">在电脑上打开 QQ ${QQ}</a>
    <a href="mqqwpa://im/chat?chat_type=wpa&amp;uin=${QQ}&amp;version=1&amp;src_type=web&amp;web_src=finanpivot.com">在手机上打开 QQ</a>
    <button type="button" data-copy="${QQ}">复制 QQ 号 ${QQ}</button>
    <span id="copy-status" role="status"></span>
  </div>`;
}

export const pages = [
  {
    file: "index.html",
    title: "首页",
    description: "FinanPivot 为出口、海外项目和跨境经营企业提供财务运营支持、项目财务管理、结算协同和财务外包。",
    body: `<section class="hero">
      <div>
        <p class="kicker">Global Finance &amp; Business Advisory</p>
        <h1>让跨境财务更清晰，让企业经营更稳健。</h1>
        <p>FinanPivot 为开展出口贸易、海外工程项目及跨境经营的企业提供财务运营支持、项目财务管理、跨境结算协同和专业财务外包服务。</p>
        ${contactActions()}
      </div>
      <img src="assets/hero.svg" alt="${assetAlt["hero.svg"]}">
    </section>
    <div class="grid">
      <a class="card" href="services.html"><strong>出口企业财务运营支持</strong><p>把订单、单据和收付款放进同一本台账。</p></a>
      <a class="card" href="services.html"><strong>海外工程与项目财务管理</strong><p>跟踪预算、里程碑、质保金和现金流。</p></a>
      <a class="card" href="services.html"><strong>跨境结算与应收账款专项</strong><p>核对到账差异、账龄和跟进事项。</p></a>
      <a class="card" href="services.html"><strong>财务外包与管理报告</strong><p>按约定周期交出管理摘要。关键判断由授权人员负责。</p></a>
    </div>
    <p class="note">我们不代替海关、银行、税务机关或持牌机构作出审批或鉴证，也不擅自经手客户资金。网站不展示客户名单、业绩数字或牌照。</p>`,
  },
  {
    file: "services.html",
    title: "服务",
    description: "FinanPivot 的四项服务：出口财务运营、海外项目财务、跨境结算专项、财务外包与管理报告。",
    body: `<h1>四项服务</h1>
    <article class="module split"><img src="assets/export.svg" alt="${assetAlt["export.svg"]}"><div><h2>出口企业财务运营支持</h2><p>适用出口贸易、跨境供应链和外贸团队。工作包括单据归集、应收与到账差异、收汇结汇资料整理，以及按客户、订单、币种和合同批次形成管理报表。</p><p>交付：资料包、匹配表、差异清单、账龄表、月度摘要。不代替报关、银行或税务审批。</p></div></article>
    <article class="module split"><img src="assets/project.svg" alt="${assetAlt["project.svg"]}"><div><h2>海外工程与项目财务管理</h2><p>适用海外工程承包、项目型企业和跨境设备或工程服务商。工作包括预算、合同金额、里程碑、预付款、进度款、质保金和变更签证的台账，以及多币种资金计划和项目月报。</p><p>不代替工程质量、法律或税务结论，不托管客户资金。</p></div></article>
    <article class="module split"><img src="assets/collect.svg" alt="${assetAlt["collect.svg"]}"><div><h2>跨境结算与应收账款专项</h2><p>把合同、发票、出货或服务记录和银行流水对上。整理逾期事项、跨币种差异和跟进计划。</p><p>不承诺债务回收，不提供诉讼、法律催收或资金支付服务。</p></div></article>
    <article class="module split"><img src="assets/report.svg" alt="${assetAlt["report.svg"]}"><div><h2>财务外包与管理报告</h2><p>为没有完整内部财务团队的企业做资料归集、台账、月度汇总和流程留痕建议。</p><p>需要会计代理、审计、税务代理或支付许可的事项，只有在运营主体具备资质或由合资格机构提供时才承接。</p></div></article>`,
  },
  {
    file: "how-we-work.html",
    title: "流程",
    description: "从客户准入、报价审批、书面合同、银行转账核验到复核交付的服务流程。",
    body: `<h1>服务流程</h1>
    <img class="diagram" src="assets/flow.svg" alt="${assetAlt["flow.svg"]}">
    <ol class="steps">
      <li>客户准入：核实主体、授权、利益冲突和资料范围。</li>
      <li>服务范围：写清做什么、不做什么、交付物和时间。</li>
      <li>报价：按项目、周期或工作量报价，由负责人审批。</li>
      <li>合同：以书面合同为准。在线签署通道尚未开通。</li>
      <li>付款：按合同约定的银行账户转账。网站不收款。</li>
      <li>核验：付款截图只是待核验资料。实际到账由负责人确认。</li>
      <li>入账：确认后的金额记入应收核销和复式分录。</li>
      <li>执行：收集必要资料，建立项目、任务和底稿。</li>
      <li>复核：支撑人员检查，财务负责人复核。</li>
      <li>交付：签发交付包，随后做月度报告和续约沟通。</li>
    </ol>
    <h2>账务关系</h2>
    <img class="diagram" src="assets/ledger.svg" alt="${assetAlt["ledger.svg"]}">
    <p class="note">客户申报不是到账。只有负责人确认银行实际到账后，才借记银行存款、贷记合同负债。</p>`,
  },
  {
    file: "about.html",
    title: "原则",
    description: "FinanPivot 的工作原则：授权、最小数据、可追溯、资金分离和人工负责。",
    body: `<h1>工作原则</h1>
    <ul>
      <li>授权优先：只处理客户明确授权的主体、账户、项目和资料。</li>
      <li>数据最小化：只收集完成约定服务所需的信息。</li>
      <li>过程可追溯：合同、资料、审批、收款核验和交付留有记录。</li>
      <li>资金分离：不把客户资金和服务方资金混在一起，不擅自代付或托管。</li>
      <li>专业边界：会计、税务、法律、审计和受监管服务按资质与当地法规执行。</li>
      <li>人工负责：自动化可以协助整理。关键判断、资金确认、报价和交付由授权人员负责。</li>
    </ul>
    <p>FinanPivot 面向中国企业的全球化经营，提供跨境财务管理与专业财务外包。品牌主张是 Financial Clarity. Business Forward.</p>`,
  },
  {
    file: "faq.html",
    title: "问答",
    description: "关于服务边界、资金、电子合同和联系方式的说明。",
    body: `<h1>常见问题</h1>
    <details open><summary>你们是否代替报关、税务或审计？</summary><p>不代替。需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。</p></details>
    <details><summary>你们是否代收或托管客户资金？</summary><p>不代收，不托管，不在网站上发起付款。</p></details>
    <details><summary>电子合同现在能签吗？</summary><p>不能。正式签署以书面合同为准。在线签署供应商尚未开通，sandbox 不构成签署成功。</p></details>
    <details><summary>付款截图能不能当到账？</summary><p>不能。截图只是申报。实际到账由负责人核对银行记录后再入账。</p></details>
    <details><summary>怎么联系？</summary>${contactActions()}</details>`,
  },
  {
    file: "contact.html",
    title: "联系",
    description: "通过邮箱 admin@finanpivot.com 或 QQ 3942114211 联系 FinanPivot。",
    body: `<h1>联系我们</h1>
    <p>网站不收集表单。请发邮件或通过 QQ 联系，说明企业、业务地区和希望先看的事项。</p>
    ${contactActions()}
    <p class="note">这是一次初步沟通，不是合同，也不是订单。报价、签署和收款核验都在后续书面流程里完成。</p>`,
  },
  {
    file: "privacy.html",
    title: "隐私",
    description: "FinanPivot 网站的隐私说明。",
    body: `<h1>隐私说明</h1>
    <p>本网站不设置在线表单，不把咨询内容存在浏览器里。你主动发送到邮箱或 QQ 的内容，只用于回复这次沟通和判断是否适合进一步服务。</p>
    <p>我们只保留完成约定服务所需的资料，并按书面约定的期限保存。你可以通过 <a href="mailto:${MAIL}">${MAIL}</a> 询问、更正或要求删除尚未进入合同履约所必需的资料。</p>
    <p>若后续启用第三方电子签或银行核验，相关资料由对应机构和书面合同约定处理。上线前的主体信息和适用地区规则，以正式文本为准。</p>`,
  },
  {
    file: "terms.html",
    title: "条款",
    description: "FinanPivot 网站的服务边界。",
    body: `<h1>服务边界</h1>
    <p>网站上的介绍不是合同、报价或专业意见。服务范围、费用、交付物和责任以双方签署的书面合同为准。</p>
    <p>除非合同和资质明确允许，本网站不构成法律、审计、投资或税务意见，也不代替海关、银行、税务机关或持牌机构。</p>
    <p>我们不承诺投资收益、税务节省、债务回收成功率，也不宣称在所有国家都具备同一项资质。</p>`,
  },
  {
    file: "404.html",
    title: "未找到",
    description: "这个页面不存在。",
    body: `<h1>这个页面不存在</h1><p><a href="index.html">回到首页</a></p>`,
  },
];

export function renderPage(page) {
  const links = nav
    .map(([href, label]) => `<a href="${href}"${href === page.file ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  const path = page.file === "index.html" ? "/" : `/${page.file}`;
  const canonical = `https://finanpivot.com${path}`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title} · FinanPivot</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${page.title} · FinanPivot">
<meta property="og:description" content="${page.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="zh_CN">
<meta property="og:image" content="https://finanpivot.com/assets/hero.svg">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<a class="skip" href="#content">跳到正文</a>
<header>
  <a class="brand" href="index.html"><span class="kicker">FinanPivot</span><strong>跨境财务与专业外包</strong></a>
  <nav aria-label="主导航">${links}</nav>
</header>
<main id="content">${page.body}</main>
<footer>
  <p>Financial Clarity. Business Forward.</p>
  <p>联系：<a href="mailto:${MAIL}">${MAIL}</a> · <a href="contact.html">QQ ${QQ}</a></p>
  <p><a href="privacy.html">隐私</a> · <a href="terms.html">条款</a></p>
  <p>本网站介绍服务范围，不构成法律、审计、投资或税务意见。正式工作以书面合同为准。</p>
</footer>
<script src="site.js"></script>
</body>
</html>`;
}
