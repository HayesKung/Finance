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
  ["index.html", "首页", "Home"],
  ["services.html", "服务", "Services"],
  ["how-we-work.html", "流程", "Path"],
  ["start.html", "咨询", "Start"],
  ["about.html", "原则", "Rules"],
  ["faq.html", "问答", "FAQ"],
  ["contact.html", "联系", "Contact"],
];

function contactActions() {
  const web = `https://wpa.qq.com/msgrd?v=3&uin=${QQ}&site=qq&menu=yes`;
  const desktop = `tencent://message/?uin=${QQ}&amp;Site=finanpivot.com&amp;Menu=yes`;
  const mobile = `mqqwpa://im/chat?chat_type=wpa&amp;uin=${QQ}&amp;version=1&amp;src_type=web&amp;web_src=finanpivot.com`;
  return `<div class="contact-group">
    <div class="contact-row">
      <a class="contact-card" href="mailto:${MAIL}">
        <span class="label" data-en="Email">邮件联系</span>
        <strong>${MAIL}</strong>
      </a>
      <div class="contact-card">
        <a class="qq-open" href="${web}" data-desktop="${desktop}" data-mobile="${mobile}">
          <span class="label" data-en="QQ">QQ 联系</span>
          <strong data-en="Open QQ">单击打开 QQ</strong>
        </a>
        <p class="qq-fallback" hidden>
          <span>${QQ}</span>
          <button type="button" data-copy="${QQ}" data-en="Copy">复制</button>
          <span class="copy-status" role="status"></span>
        </p>
      </div>
    </div>
  </div>`;
}

function step(n, title, en, where, whereEn, text, textEn) {
  return `<li><b>${n}</b><div><strong data-en="${en}">${title}</strong><span class="where" data-en="${whereEn}">${where}</span><p data-en="${textEn}">${text}</p></div></li>`;
}

export const pages = [
  {
    file: "index.html",
    title: "首页",
    description: "FinanPivot 为出口、海外项目和跨境经营企业提供财务运营支持、项目财务管理、结算协同和财务外包。",
    body: `<section class="hero">
      <div>
        <p class="kicker">Global Finance & Business Advisory</p>
        <h1 data-en="Clearer cross-border finance, for clearer decisions.">让跨境财务更清晰，让经营决策更有依据。</h1>
        <p class="lede" data-en="Finance operations, project ledgers, settlement support and management reports for export, overseas-project and cross-border companies.">为出口贸易、海外项目和跨境经营企业提供财务运营、项目台账、结算协同与管理报告支持。</p>
        <div class="btnrow">
          <a class="btn solid" href="start.html" data-en="Prepare an inquiry">准备咨询</a>
          <a class="btn" href="how-we-work.html" data-en="See the path">看完整流程</a>
        </div>
        ${contactActions()}
      </div>
      <figure>
        <img src="assets/hero.svg" alt="${assetAlt["hero.svg"]}">
        <figcaption data-en="An illustration of one file for orders, papers and money. Not a client record.">示意：订单、单据和收付款放在同一本台账里。不是客户档案。</figcaption>
      </figure>
    </section>
    <section class="band">
      <h2 data-en="Four kinds of work">四项工作</h2>
      <div class="grid">
        <a class="card" href="services.html#export"><img class="shot" src="assets/export.svg" alt="${assetAlt["export.svg"]}"><div><strong data-en="Export finance operations">出口企业财务运营</strong><p data-en="Orders, documents, receivables and receipts in one file.">订单、单据、应收与收款记录协同管理。</p></div></a>
        <a class="card" href="services.html#project"><img class="shot" src="assets/project.svg" alt="${assetAlt["project.svg"]}"><div><strong data-en="Overseas project finance">海外项目财务管理</strong><p data-en="Budget, progress, retention and cash.">跟踪项目预算、进度、质保金与现金流。</p></div></a>
        <a class="card" href="services.html#collect"><img class="shot" src="assets/collect.svg" alt="${assetAlt["collect.svg"]}"><div><strong data-en="Settlement and receivables">跨境结算与应收管理</strong><p data-en="Receipt differences, aging and follow-up.">核对到账差异、应收账龄与跟进事项。</p></div></a>
        <a class="card" href="services.html#report"><img class="shot" src="assets/report.svg" alt="${assetAlt["report.svg"]}"><div><strong data-en="Outsourced reporting">财务外包与管理报告</strong><p data-en="Books and a management note on the agreed cycle.">按约定周期整理账务资料与经营分析。</p></div></a>
      </div>
    </section>
    <section class="band">
      <h2 data-en="What a customer can finish here">客户在这里能走完的一段</h2>
      <ol class="path">
        <li><span>01</span><strong data-en="See the boundary">看清边界</strong><p data-en="On this site">本网站</p></li>
        <li><span>02</span><strong data-en="Write the inquiry">写下咨询</strong><p data-en="This site opens the email">本网站打开邮件</p></li>
        <li><span>03</span><strong data-en="Scope and fee">范围与报价</strong><p data-en="After a person checks">负责人确认后</p></li>
        <li><span>04</span><strong data-en="Written contract">书面合同</strong><p data-en="Online signing is not open">在线签署未开通</p></li>
        <li><span>05</span><strong data-en="Bank transfer">银行转账</strong><p data-en="This site does not take payment">网站不收款</p></li>
        <li><span>06</span><strong data-en="Money checked">到账核验</strong><p data-en="A screenshot is not a receipt">截图不算到账</p></li>
        <li><span>07</span><strong data-en="Papers and work">资料与底稿</strong><p data-en="Only the agreed scope">只在约定范围</p></li>
        <li><span>08</span><strong data-en="Review and delivery">复核交付</strong><p data-en="The principal signs off">负责人签发</p></li>
      </ol>
    </section>
    <p class="note" data-en="We do not replace customs, a bank, a tax authority or a licensed firm, and we do not handle client money. This site shows no client list, performance numbers or license.">我们不代替海关、银行、税务机关或持牌机构作出审批或鉴证，也不擅自经手客户资金。网站不展示客户名单、业绩数字或牌照。</p>`,
  },
  {
    file: "services.html",
    title: "服务",
    description: "FinanPivot 的四项服务：出口财务运营、海外项目财务、跨境结算专项、财务外包与管理报告。",
    body: `<h1 data-en="Four services">四项服务</h1>
    <article class="split" id="export"><img src="assets/export.svg" alt="${assetAlt["export.svg"]}"><div class="pad"><h2 data-en="Export finance operations">出口企业财务运营</h2><p data-en="Orders, documents, receivables and receipts in one file.">订单、单据、应收与收款记录协同管理。</p><p data-en="We do not replace customs, a bank or a tax approval.">不代替报关、银行或税务审批。</p></div></article>
    <article class="split" id="project"><img src="assets/project.svg" alt="${assetAlt["project.svg"]}"><div class="pad"><h2 data-en="Overseas project finance">海外项目财务管理</h2><p data-en="Budget, progress, retention and cash.">跟踪项目预算、进度、质保金与现金流。</p><p data-en="We do not replace an engineering, legal or tax conclusion, and we do not hold client money.">不代替工程质量、法律或税务结论，不托管客户资金。</p></div></article>
    <article class="split" id="collect"><img src="assets/collect.svg" alt="${assetAlt["collect.svg"]}"><div class="pad"><h2 data-en="Settlement and receivables">跨境结算与应收管理</h2><p data-en="Receipt differences, aging and follow-up.">核对到账差异、应收账龄与跟进事项。</p><p data-en="We do not promise collection, and we do not sue or pay money out.">不承诺债务回收，不提供诉讼或资金支付服务。</p></div></article>
    <article class="split" id="report"><img src="assets/report.svg" alt="${assetAlt["report.svg"]}"><div class="pad"><h2 data-en="Outsourced reporting">财务外包与管理报告</h2><p data-en="Books and a management note on the agreed cycle.">按约定周期整理账务资料与经营分析。</p><p data-en="Licensed accounting, audit, tax or payment work is accepted only when a qualified firm does it.">需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。</p></div></article>
    <p><a class="btn solid" href="start.html" data-en="Prepare an inquiry">准备咨询</a></p>`,
  },
  {
    file: "how-we-work.html",
    title: "流程",
    description: "从客户准入、报价审批、书面合同、银行转账核验到复核交付的服务流程。",
    body: `<h1 data-en="How the work moves">服务流程</h1>
    <img class="diagram" src="assets/flow.svg" alt="${assetAlt["flow.svg"]}">
    <ol class="steps">
      ${step("01", "看清服务和边界", "Read the boundary", "本网站", "On this site", "先看四项服务和我们不做什么。", "Read the four services and what we will not do.")}
      ${step("02", "写下咨询", "Write the inquiry", "本网站打开邮件", "This site opens the email", "填企业、地区和想先看的事项。邮件在你自己的邮箱里发出。网站不保存。", "Company, region and topic. The mail leaves from your own mailbox. This site does not store it.")}
      ${step("03", "准入", "Admission", "书面", "In writing", "核实主体、授权、利益冲突和资料范围。", "Check the entity, authority, conflicts and the papers in scope.")}
      ${step("04", "范围与报价", "Scope and fee", "负责人审批", "Principal approves", "写清做什么、不做什么、交付物和时间。按项目、周期或工作量报价。", "What is in, what is out, the deliverable and the time. Priced by project, period or effort.")}
      ${step("05", "合同", "Contract", "书面", "In writing", "以书面合同为准。在线签署通道尚未开通。", "The written contract governs. Online signing is not open.")}
      ${step("06", "付款", "Payment", "银行", "Bank", "按合同约定的银行账户转账。网站不收款。", "Transfer to the bank account named in the contract. This site does not take payment.")}
      ${step("07", "核验", "Check", "负责人", "Principal", "付款截图只是待核验资料。实际到账由负责人确认。", "A payment screenshot is only a claim. The principal confirms the bank credit.")}
      ${step("08", "入账", "Books", "内部账", "Internal books", "确认后的金额才进入应收核销和复式分录。", "Only a confirmed amount is applied to the receivable and the journal.")}
      ${step("09", "执行", "Work", "约定范围", "Agreed scope", "收集必要资料，建立项目、任务和底稿。", "Collect the needed papers and open the project, tasks and workpapers.")}
      ${step("10", "复核交付", "Review and delivery", "负责人签发", "Principal signs", "支撑人员检查，财务负责人复核并签发交付包。", "Support checks. The finance principal reviews and issues the pack.")}
    </ol>
    <h2 data-en="How money is recorded">账务关系</h2>
    <img class="diagram" src="assets/ledger.svg" alt="${assetAlt["ledger.svg"]}">
    <p class="note" data-en="A customer claim is not money received. Only after the principal confirms the bank credit do the books debit cash and credit the contract liability.">客户申报不是到账。只有负责人确认银行实际到账后，才借记银行存款、贷记合同负债。</p>`,
  },
  {
    file: "start.html",
    title: "咨询",
    description: "把企业、地区和想先看的事项写成一封邮件。网站不保存这封咨询。",
    body: `<h1 data-en="Prepare an inquiry">准备咨询</h1>
    <p data-en="This page only writes the email. It is not a contract, a quote, or an order. Nothing is stored on the site.">这一页只帮你写好邮件。它不是合同，不是报价，也不是订单。内容不会留在网站上。</p>
    <div class="brief" id="brief">
      <div>
        <label><span data-en="Company name">企业称呼</span><input id="who" autocomplete="organization"></label>
        <label><span data-en="Where you operate">业务地区</span><input id="where"></label>
        <p data-en="What should we look at first?">想先看的事项</p>
        <div class="choices">
          <button type="button" aria-pressed="true" data-en="Export documents and receipts">出口单据和收汇</button>
          <button type="button" aria-pressed="false" data-en="An overseas project">海外项目</button>
          <button type="button" aria-pressed="false" data-en="A settlement difference">结算差异</button>
          <button type="button" aria-pressed="false" data-en="A monthly report">月度报告</button>
        </div>
        <p id="matter" hidden>出口单据和收汇</p>
        <label><span data-en="Anything else">补充</span><textarea id="extra" rows="4"></textarea></label>
      </div>
      <div class="preview">
        <p class="kicker">Email</p>
        <pre id="preview"></pre>
        <p><a class="btn" id="send" href="mailto:${MAIL}" data-en="Open this email">打开这封邮件</a></p>
        <p class="quiet" data-en="If the mail app does not open, write to admin@finanpivot.com or use QQ on the contact page.">如果邮件程序没有打开，请写到 admin@finanpivot.com，或到联系页使用 QQ。</p>
      </div>
    </div>`,
  },
  {
    file: "about.html",
    title: "原则",
    description: "FinanPivot 的工作原则：授权、最小数据、可追溯、资金分离和人工负责。",
    body: `<h1 data-en="How we work">工作原则</h1>
    <ul>
      <li data-en="Authority first: only the entity, account, project and papers the client has authorized.">授权优先：只处理客户明确授权的主体、账户、项目和资料。</li>
      <li data-en="As little data as the agreed work needs.">数据最小化：只收集完成约定服务所需的信息。</li>
      <li data-en="A record for the contract, the papers, the approval, the receipt check and the delivery.">过程可追溯：合同、资料、审批、收款核验和交付留有记录。</li>
      <li data-en="Client money and our fee stay apart. We do not pay on a client's behalf or hold their funds.">资金分离：不把客户资金和服务方资金混在一起，不擅自代付或托管。</li>
      <li data-en="Accounting, tax, law, audit and regulated work follow the license and the local rule.">专业边界：会计、税务、法律、审计和受监管服务按资质与当地法规执行。</li>
      <li data-en="A person remains responsible. Software may sort papers. It does not approve money, a price, or a delivery.">人工负责：自动化可以协助整理。关键判断、资金确认、报价和交付由授权人员负责。</li>
    </ul>
    <p data-en="FinanPivot serves Chinese companies operating abroad. The line is Financial Clarity. Business Forward.">FinanPivot 面向中国企业的全球化经营，提供跨境财务管理与专业财务外包。品牌主张是 Financial Clarity. Business Forward.</p>`,
  },
  {
    file: "faq.html",
    title: "问答",
    description: "关于服务边界、资金、电子合同和联系方式的说明。",
    body: `<h1 data-en="Questions">常见问题</h1>
    <details open><summary data-en="Do you replace customs, tax or an audit?">你们是否代替报关、税务或审计？</summary><p data-en="No. Licensed work is accepted only when the firm is qualified, or a qualified firm does it.">不代替。需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。</p></details>
    <details><summary data-en="Do you collect or hold client money?">你们是否代收或托管客户资金？</summary><p data-en="No. This site does not take a payment.">不代收，不托管，不在网站上发起付款。</p></details>
    <details><summary data-en="Can we sign an electronic contract now?">电子合同现在能签吗？</summary><p data-en="No. The written contract governs. An online signing vendor is not connected, and a sandbox is not a completed signature.">不能。正式签署以书面合同为准。在线签署供应商尚未开通，sandbox 不构成签署成功。</p></details>
    <details><summary data-en="Does a payment screenshot count?">付款截图能不能当到账？</summary><p data-en="No. It is only a claim. The principal checks the bank record before anything is booked.">不能。截图只是申报。实际到账由负责人核对银行记录后再入账。</p></details>
    <details><summary data-en="How do we reach you?">怎么联系？</summary>${contactActions()}</details>`,
  },
  {
    file: "contact.html",
    title: "联系",
    description: "通过邮箱 admin@finanpivot.com 或 QQ 3942114211 联系 FinanPivot。",
    body: `<h1 data-en="Contact">联系我们</h1>
    <p data-en="There is no form that stores a message. Send mail, or use QQ, and say the company, the region and what you want looked at first. You can also prepare the mail on the inquiry page.">网站不收集表单。请发邮件或通过 QQ 联系，说明企业、业务地区和希望先看的事项。也可以先到咨询页把邮件写好。</p>
    <p><a class="btn solid" href="start.html" data-en="Prepare the email">去咨询页写邮件</a></p>
    ${contactActions()}
    <p class="note" data-en="This is a first conversation, not a contract and not an order. The fee, the signature and the receipt check happen later, in writing.">这是一次初步沟通，不是合同，也不是订单。报价、签署和收款核验都在后续书面流程里完成。</p>`,
  },
  {
    file: "privacy.html",
    title: "隐私",
    description: "FinanPivot 网站的隐私说明。",
    body: `<h1 data-en="Privacy">隐私说明</h1>
    <p data-en="This site has no stored form. The inquiry page only opens a mail in your own mail program. We do not keep that text in the browser.">本网站不设置会保存内容的在线表单。咨询页只在你自己的邮件程序里打开一封信，不把咨询内容存在浏览器里。</p>
    <p data-en="What you send by email or QQ is used to answer that conversation and to judge whether a further service fits. We keep only what the agreed work needs, for the period in the written terms. Write to the address below to ask, correct, or delete material that is not yet required for a contract.">你主动发送到邮箱或 QQ 的内容，只用于回复这次沟通和判断是否适合进一步服务。我们只保留完成约定服务所需的资料，并按书面约定的期限保存。你可以通过 <a href="mailto:${MAIL}">${MAIL}</a> 询问、更正或要求删除尚未进入合同履约所必需的资料。</p>
    <p data-en="If a signing vendor or a bank check is switched on later, those papers are handled by that party and by the written contract. The firm name and the applicable region will be stated in that text before it is used.">若后续启用第三方电子签或银行核验，相关资料由对应机构和书面合同约定处理。上线前的主体信息和适用地区规则，以正式文本为准。</p>`,
  },
  {
    file: "terms.html",
    title: "条款",
    description: "FinanPivot 网站的服务边界。",
    body: `<h1 data-en="Limits of this site">服务边界</h1>
    <p data-en="The pages are not a contract, a quote, or professional advice. Scope, fee, deliverables and responsibility are whatever the signed written contract says.">网站上的介绍不是合同、报价或专业意见。服务范围、费用、交付物和责任以双方签署的书面合同为准。</p>
    <p data-en="Unless a contract and a license say otherwise, this site is not legal, audit, investment or tax advice, and it does not replace customs, a bank, a tax authority or a licensed firm.">除非合同和资质明确允许，本网站不构成法律、审计、投资或税务意见，也不代替海关、银行、税务机关或持牌机构。</p>
    <p data-en="We do not promise an investment return, a tax saving, or a collection rate, and we do not claim the same license in every country.">我们不承诺投资收益、税务节省、债务回收成功率，也不宣称在所有国家都具备同一项资质。</p>`,
  },
  {
    file: "404.html",
    title: "未找到",
    description: "这个页面不存在。",
    body: `<h1 data-en="This page is not here">这个页面不存在</h1><p><a href="index.html" data-en="Back to the home page">回到首页</a></p>`,
  },
];

export function renderPage(page) {
  const links = nav
    .map(([href, label, en]) => `<a href="${href}"${href === page.file ? ' aria-current="page"' : ""} data-en="${en}">${label}</a>`)
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
<header class="top">
  <a class="brand" href="index.html"><span class="mark">FP</span><span><span class="kicker">FinanPivot</span><strong>跨境财务与专业外包</strong></span></a>
  <nav aria-label="主导航">${links}</nav>
  <button type="button" id="lang">EN</button>
</header>
<main id="content">${page.body}</main>
<footer>
  <p>Financial Clarity. Business Forward.</p>
  <p><a href="mailto:${MAIL}">${MAIL}</a> · <a href="contact.html" data-en="Contact">联系</a></p>
  <p><a href="privacy.html">隐私</a> · <a href="terms.html">条款</a></p>
  <p>本网站介绍服务范围，不构成法律、审计、投资或税务意见。正式工作以书面合同为准。</p>
</footer>
<script src="site.js"></script>
</body>
</html>`;
}
