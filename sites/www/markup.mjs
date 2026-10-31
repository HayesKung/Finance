const QQ = "3942114211";
const MAIL = "admin@finanpivot.com";
const HOST = "https://www.finanpivot.com";

export const assetAlt = {
  "favicon.svg": "FinanPivot 标志",
  "hero.svg": "出口台账示意：发票、提单和收汇记在同一页",
  "flow.svg": "客户路径：看清、来信、书面确认、交付",
  "ledger.svg": "到账以银行记录为准，截图只是说明",
  "export.svg": "出口单据与收汇记录对照",
  "project.svg": "项目进度与资金计划",
  "collect.svg": "合同、发票与到账三方核对",
  "report.svg": "月度管理报告的栏目",
  "og.png": "FinanPivot",
};

const assetAltEn = {
  "hero.svg": "A sample export file with invoice, shipping paper and receipt. Not a client record.",
  "flow.svg": "The client path: read, write, confirm in writing, receive the file.",
  "ledger.svg": "A screenshot only says the money was sent. The bank record is what counts.",
  "export.svg": "Export papers set beside the receipt record.",
  "project.svg": "Project milestones and money plan.",
  "collect.svg": "Contract, invoice and bank line compared.",
  "report.svg": "Columns of a monthly management note.",
};

const nav = [
  ["index.html", "首页", "Home"],
  ["services.html", "服务", "Services"],
  ["how-we-work.html", "流程", "Path"],
  ["inquiry.html", "咨询", "Inquiry"],
  ["faq.html", "问答", "FAQ"],
];

function contactActions() {
  return `<div class="actions">
    <a href="mailto:${MAIL}">${MAIL}</a>
    <a href="https://wpa.qq.com/msgrd?v=3&uin=${QQ}&site=qq&menu=yes" data-en="Open QQ ${QQ} on a computer">在电脑上打开 QQ ${QQ}</a>
    <a href="mqqwpa://im/chat?chat_type=wpa&uin=${QQ}&version=1&src_type=web&web_src=finanpivot.com" data-en="Open QQ on a phone">在手机上打开 QQ</a>
    <button type="button" data-copy="${QQ}" data-en="Copy QQ number ${QQ}">复制 QQ 号 ${QQ}</button>
    <span id="copy-status" role="status"></span>
  </div>`;
}

function step(n, title, en, where, whereEn, text, textEn) {
  return `<li><b>${n}</b><div><strong data-en="${en}">${title}</strong><span class="where" data-en="${whereEn}">${where}</span><p data-en="${textEn}">${text}</p></div></li>`;
}

export const pages = [
  {
    file: "index.html",
    title: "首页",
    titleEn: "Home",
    description: "FinanPivot 为出口、海外项目和跨境经营企业提供财务运营支持、项目财务管理、结算协同和财务外包。",
    descriptionEn: "FinanPivot keeps export papers, project money and settlement differences in one agreed file.",
    body: `<section class="hero">
      <div>
        <p class="kicker">Global Finance & Business Advisory</p>
        <h1 data-en="Make cross-border finance easier to see.">让跨境财务更清晰，让企业经营更稳健。</h1>
        <p class="lede" data-en="For export teams and overseas projects. We put orders, documents and receipts into one file, then hand you a written scope before any work starts.">FinanPivot 帮出口团队和海外项目把订单、单据和收付款放进同一本台账。动手之前，先给你一份书面范围。</p>
        <div class="btnrow">
          <a class="btn solid" href="inquiry.html" data-en="Write an inquiry">写一封咨询</a>
          <a class="btn" href="how-we-work.html" data-en="See what happens next">看接下来怎么走</a>
        </div>
        <p class="quiet" data-en="We reply on business days from admin@finanpivot.com. This site does not store the message.">工作日通过 admin@finanpivot.com 回复。网站不保存这封信。</p>
        ${contactActions()}
      </div>
      <figure>
        <img src="assets/hero.svg" alt="${assetAlt["hero.svg"]}">
        <figcaption data-en="A sample layout of an export file: invoice, bill of lading, and receipt. Not a client record.">示意的出口台账：发票、提单、收汇。不是客户档案。</figcaption>
      </figure>
    </section>
    <section class="band">
      <h2 data-en="What you can ask us to look at">你可以先让我们看的四件事</h2>
      <div class="grid">
        <a class="card" href="services.html#export"><img class="shot" src="assets/export.svg" alt="${assetAlt["export.svg"]}"><div><strong data-en="Export papers and receipts">出口单据和收汇</strong><p data-en="Orders, documents and money in one file. You first receive a difference list.">订单、单据和收款对不上。先给你一张差异清单。</p></div></a>
        <a class="card" href="services.html#project"><img class="shot" src="assets/project.svg" alt="${assetAlt["project.svg"]}"><div><strong data-en="An overseas project">海外项目的钱</strong><p data-en="Budget, milestones and retention. You first receive a project money sheet.">预算、里程碑和质保金散在各处。先给你一张项目资金表。</p></div></a>
        <a class="card" href="services.html#collect"><img class="shot" src="assets/collect.svg" alt="${assetAlt["collect.svg"]}"><div><strong data-en="A settlement difference">一笔对不上的结算</strong><p data-en="Contract, invoice and bank line. You first receive a match note. We do not promise collection.">合同、发票和银行到账对不上。先给你一张核对说明。不承诺收回欠款。</p></div></a>
        <a class="card" href="services.html#report"><img class="shot" src="assets/report.svg" alt="${assetAlt["report.svg"]}"><div><strong data-en="A monthly management note">一份给管理层的月报</strong><p data-en="A short note on the agreed cycle. A person, not a script, signs the judgment.">按约定周期交一份管理摘要。判断由人签发，不由程序签发。</p></div></a>
      </div>
    </section>
    <section class="band">
      <h2 data-en="What happens, in order">接下来按这个顺序</h2>
      <ol class="path">
        <li><span>01</span><strong data-en="Read the limit">看清边界</strong><p data-en="On this site">本网站</p></li>
        <li><span>02</span><strong data-en="Send one email">发一封咨询</strong><p data-en="Opens your own mailbox">打开你的邮箱</p></li>
        <li><span>03</span><strong data-en="We say if we can take it">回复能不能接</strong><p data-en="A person writes back">人工回复</p></li>
        <li><span>04</span><strong data-en="Written scope and fee">书面范围和费用</strong><p data-en="Counts only after you accept">你确认后才算</p></li>
        <li><span>05</span><strong data-en="Written contract">书面合同</strong><p data-en="This site cannot sign">本站不能签</p></li>
        <li><span>06</span><strong data-en="Bank transfer">银行转账</strong><p data-en="This site takes no payment">本站不收款</p></li>
        <li><span>07</span><strong data-en="Bank record">以银行记录为准</strong><p data-en="A screenshot is only a claim">截图只是说明</p></li>
        <li><span>08</span><strong data-en="You receive the file">把约定文件交给你</strong><p data-en="You confirm the delivery">你确认这份交付</p></li>
      </ol>
    </section>
    <p class="note" data-en="We do not replace customs, a bank, a tax authority or a licensed firm, and we do not handle client money. This site shows no client list, performance numbers or license.">我们不代替海关、银行、税务机关或持牌机构作出审批或鉴证，也不擅自经手客户资金。网站不展示客户名单、业绩数字或牌照。</p>`,
  },
  {
    file: "services.html",
    title: "服务",
    titleEn: "Services",
    description: "四项工作：出口单据和收汇、海外项目资金、结算核对、管理月报。费用在书面确认前不成立。",
    descriptionEn: "Four jobs: export papers, project money, settlement matching, and a management note. No fee exists before you accept it in writing.",
    body: `<h1 data-en="Four jobs, each with a first deliverable">四项工作，每项都有一份先交给你的文件</h1>
    <p data-en="The website does not quote a price. After we know the scope, a person sends a written fee. It counts only when you accept it.">网站不标价。范围写清之后，由人给出书面费用。你接受之后，费用才成立。</p>
    <article class="split" id="export"><img src="assets/export.svg" alt="${assetAlt["export.svg"]}"><div class="pad"><h2 data-en="Export papers and receipts">出口单据和收汇</h2><p data-en="For a trade team whose orders, shipping papers and receipts do not sit in one place.">适合订单、货运单据和收汇还没放在一处的外贸团队。</p><p data-en="You first receive a difference list: what matches, what does not, and which paper is missing. We do not file customs entries or approve tax or bank matters.">先交给你一张差异清单：对得上的、对不上的、缺哪份单据。不代替报关，也不代替银行或税务审批。</p></div></article>
    <article class="split" id="project"><img src="assets/project.svg" alt="${assetAlt["project.svg"]}"><div class="pad"><h2 data-en="Money on an overseas project">海外项目的钱</h2><p data-en="For a project with an advance, progress payments, retention and variations.">适合有预付款、进度款、质保金和变更的海外项目。</p><p data-en="You first receive one project money sheet. We do not replace an engineering, legal or tax conclusion, and we do not hold the project’s money.">先交给你一张项目资金表。不代替工程质量、法律或税务结论，也不替项目保管资金。</p></div></article>
    <article class="split" id="collect"><img src="assets/collect.svg" alt="${assetAlt["collect.svg"]}"><div class="pad"><h2 data-en="One settlement that does not match">一笔对不上的结算</h2><p data-en="For a contract, an invoice and a bank line that do not agree.">适合合同、发票和银行到账对不上的时候。</p><p data-en="You first receive a match note and a follow-up list. We do not promise to collect the debt, and we do not sue or pay anyone.">先交给你一张核对说明和跟进清单。不承诺收回欠款，不诉讼，也不替你付款。</p></div></article>
    <article class="split" id="report"><img src="assets/report.svg" alt="${assetAlt["report.svg"]}"><div class="pad"><h2 data-en="A note for management">给管理层的月报</h2><p data-en="For a company that wants a short management note on an agreed cycle.">适合需要按约定周期看一份管理摘要的公司。</p><p data-en="You receive the note. Bookkeeping, audit, tax returns or a payment license happen only when a qualified firm does that part.">交给你的是这份摘要。代理记账、审计、纳税申报或支付业务，只有具备相应资质的机构来做。</p></div></article>
    <p><a class="btn solid" href="inquiry.html" data-en="Write an inquiry">写一封咨询</a></p>`,
  },
  {
    file: "how-we-work.html",
    title: "流程",
    titleEn: "Path",
    description: "从看清边界、发咨询、书面确认范围，到银行转账和交付。本站不签署、不收款。",
    descriptionEn: "From reading the limit, to one email, a written scope, a bank transfer, and the file you receive. This site does not sign or take payment.",
    body: `<h1 data-en="What you do, then what we send back">你先做什么，我们再交回什么</h1>
    <img class="diagram" src="assets/flow.svg" alt="${assetAlt["flow.svg"]}">
    <ol class="steps">
      ${step("01", "看清我们接什么", "Read what we take", "本网站", "On this site", "先看四项工作和页面上写明不做什么。", "Read the four jobs and the limits written on the page.")}
      ${step("02", "发一封咨询", "Send one inquiry", "你的邮箱", "Your mailbox", "写下企业、地区和想先看的事。信从你的邮箱发出，网站不保存。第一封不要附银行口令、完整证件或客户资金账户。", "Company, region and topic. The mail leaves from your mailbox. This site does not store it. Do not attach bank passwords, full identity papers, or client money accounts.")}
      ${step("03", "我们回复能不能接", "We answer whether we can take it", "工作日来信", "A business-day reply", "承接这单的人用 admin@finanpivot.com 回复，并说明还要哪些资料。", "The person who would take the work replies from admin@finanpivot.com and says which papers are still needed.")}
      ${step("04", "书面范围和费用", "Scope and fee in writing", "你确认后才算", "Counts after you accept", "写清做什么、不做什么、交给你什么文件、什么时候交、费用多少。口头说明不算数。", "What is in, what is out, which file you get, when, and the fee. A spoken price does not count.")}
      ${step("05", "书面合同", "A written contract", "本站不能签", "Not signed on this site", "以双方书面文本为准。在线签署还没开通。", "The written text between you and us governs. Online signing is not open.")}
      ${step("06", "按合同转账", "Pay the account in the contract", "银行", "Your bank", "转到合同里写明的服务方账户。本网站没有收款按钮。", "Transfer to the service account named in the contract. This site has no pay button.")}
      ${step("07", "到账以银行记录为准", "The bank record decides", "不是截图", "Not a screenshot", "你发来的截图只说明你已经转出。入账要等负责人核对银行实际到账。", "Your screenshot only says you sent it. It is booked only after the principal checks the bank credit.")}
      ${step("08", "把约定的文件交给你", "You receive the agreed file", "你确认", "You confirm", "你收到的是事先写明的那份文件。你确认之后，这单一段才算交完。", "You receive the file named in the scope. That part is finished when you confirm it.")}
    </ol>
    <h2 data-en="What a screenshot is not">截图不是到账</h2>
    <img class="diagram" src="assets/ledger.svg" alt="${assetAlt["ledger.svg"]}">
    <p class="note" data-en="Saying you have paid is not the same as money received. Only a bank credit confirmed by the principal counts.">你说已经转出，不等于我们已经收到。只有负责人核对过的银行到账才算。</p>`,
  },
  {
    file: "inquiry.html",
    title: "咨询",
    titleEn: "Inquiry",
    description: "把企业、地区和想先看的事项写成一封邮件。网站不保存。工作日由人回复。",
    descriptionEn: "Write the company, region and topic into an email. This site does not store it. A person replies on a business day.",
    body: `<h1 data-en="Write one inquiry">写一封咨询</h1>
    <p data-en="This page only prepares an email in your own mail program. It is not a contract, a quote, or an order. Nothing is stored here.">这一页只在你自己的邮件程序里准备一封信。它不是合同，不是报价，也不是订单。内容不会留在网站上。</p>
    <p class="note" data-en="Do not attach bank passwords, full identity documents, or accounts that hold client money. We reply on business days from admin@finanpivot.com.">请不要附银行口令、完整证件，或存放客户资金的账户。工作日由人从 admin@finanpivot.com 回复。</p>
    <div class="brief" id="brief">
      <div>
        <label><span data-en="Company name">企业称呼</span><input id="who" autocomplete="organization"></label>
        <label><span data-en="Where the work is">业务地区</span><input id="where"></label>
        <p data-en="What should we look at first?">想先看的事项</p>
        <div class="choices">
          <button type="button" aria-pressed="true" data-en="Export papers and receipts">出口单据和收汇</button>
          <button type="button" aria-pressed="false" data-en="An overseas project">海外项目</button>
          <button type="button" aria-pressed="false" data-en="A settlement difference">结算差异</button>
          <button type="button" aria-pressed="false" data-en="A monthly note">月度报告</button>
        </div>
        <label><span data-en="Anything else, without account numbers">补充，不要写账号</span><textarea id="extra" rows="4"></textarea></label>
      </div>
      <div class="preview">
        <p class="kicker">Email</p>
        <pre id="preview"></pre>
        <p><a class="btn" id="send" href="mailto:${MAIL}" data-en="Open this email">打开这封邮件</a></p>
        <p class="quiet" data-en="If no mail app opens, write to admin@finanpivot.com. QQ is only a spare channel.">如果没有邮件程序打开，请直接写到 admin@finanpivot.com。QQ 只是备用。</p>
      </div>
    </div>`,
  },
  {
    file: "about.html",
    title: "原则",
    titleEn: "Rules",
    description: "授权、少收集、可追溯、不经手客户资金。关键判断由人负责。",
    descriptionEn: "Authority, as little data as the work needs, a record, and no client money in our hands. A person owns the judgment.",
    body: `<h1 data-en="The rules a client can check">你可以核对的规则</h1>
    <ul>
      <li data-en="We only touch the company, account, project and papers you have authorized.">只处理你明确授权的主体、账户、项目和资料。</li>
      <li data-en="The first email should not include bank passwords or full identity documents.">第一封邮件不要包含银行口令或完整证件。</li>
      <li data-en="The contract, the papers, the fee you accepted, the bank check and the delivery are written down.">合同、资料、你接受的费用、到账核对和交付都留有记录。</li>
      <li data-en="We do not hold client money or pay it out for you.">不保管客户资金，也不替你付出这笔钱。</li>
      <li data-en="Licensed accounting, tax, law and audit stay with a firm allowed to do that work.">需要执照的会计、税务、法律和审计，由有资格的机构做。</li>
      <li data-en="A person replies and a person signs the judgment. A script does not.">回复的是人，签发判断的也是人。不是一段程序。</li>
    </ul>
    <p data-en="Write to admin@finanpivot.com. That is the only address this site asks you to trust. The public name is FinanPivot.">来信请发到 admin@finanpivot.com。本网站只要求你认这一个地址。对外名称是 FinanPivot。</p>`,
  },
  {
    file: "faq.html",
    title: "问答",
    titleEn: "Questions",
    description: "关于服务边界、资金、电子合同、回复时间和联系方式。",
    descriptionEn: "Limits, money, electronic contracts, reply time, and how to reach us.",
    body: `<h1 data-en="Questions">常见问题</h1>
    <details open><summary data-en="Do you replace customs, tax or an audit?">你们是否代替报关、税务或审计？</summary><p data-en="No. That work is done only by a firm allowed to do it.">不代替。这类工作只由有资格的机构做。</p></details>
    <details><summary data-en="Do you take payment on this website?">网站上能付款吗？</summary><p data-en="No. You transfer to the account written in the contract, from your own bank.">不能。你从自己的银行，转到合同里写明的账户。</p></details>
    <details><summary data-en="Can we sign an electronic contract now?">电子合同现在能签吗？</summary><p data-en="No. The written contract governs. Online signing is not connected.">不能。以书面合同为准。在线签署还没接通。</p></details>
    <details><summary data-en="Does a payment screenshot count as received?">付款截图算到账吗？</summary><p data-en="No. It only says you sent the money. A person checks the bank record.">不算。它只说明你已经转出。银行记录由人核对。</p></details>
    <details><summary data-en="Who replies, and when?">谁回复，什么时候？</summary><p data-en="A person replies on business days from admin@finanpivot.com. The site does not store the inquiry.">工作日由人从 admin@finanpivot.com 回复。网站不保存咨询内容。</p></details>
    <details><summary data-en="How else can we reach you?">还有别的联系方式吗？</summary>${contactActions()}<p data-en="Email is the channel to use. QQ may not open on a company computer or a phone without the QQ app.">请优先用邮箱。公司电脑或没装 QQ 的手机，QQ 链接经常打不开。</p></details>`,
  },
  {
    file: "contact.html",
    title: "联系",
    titleEn: "Contact",
    description: "通过邮箱 admin@finanpivot.com 联系 FinanPivot。QQ 3942114211 只是备用。",
    descriptionEn: "Reach FinanPivot at admin@finanpivot.com. QQ 3942114211 is only a spare channel.",
    body: `<h1 data-en="Contact">联系</h1>
    <p data-en="Email is how a client should start. Use the inquiry page so the first mail has the company, the region and the topic, and leaves out account numbers.">客户请先用邮箱。到咨询页写上企业、地区和事项，不要写账号。</p>
    <p><a class="btn solid" href="inquiry.html" data-en="Write the email">去写这封邮件</a></p>
    <p data-en="We reply on business days from this address:">工作日从这个地址回复：</p>
    ${contactActions()}
    <p class="note" data-en="This is a first conversation, not a contract and not an order. The fee, the signature and the bank check happen later, in writing.">这是一次初步沟通，不是合同，也不是订单。费用、签署和到账核对都在后面的书面步骤里。</p>`,
  },
  {
    file: "privacy.html",
    title: "隐私",
    titleEn: "Privacy",
    description: "咨询从你的邮箱发出。本网站不保存表单。",
    descriptionEn: "The inquiry leaves from your mailbox. This site does not store a form.",
    body: `<h1 data-en="Privacy">隐私</h1>
    <p data-en="The inquiry page opens a message in your own mail program. We do not keep that text in the browser or on this site.">咨询页在你自己的邮件程序里打开一封信。我们不把这些字留在浏览器里，也不留在本网站上。</p>
    <p data-en="What you send to the mailbox or QQ is used to answer you and to decide whether the work fits. We keep only what the written work needs, for the period in that writing.">你发到邮箱或 QQ 的内容，只用来回复，以及判断这单是否适合接。只保留书面工作需要的资料，并按书面约定的期限保存。</p>
    <p data-en="To ask, correct, or delete material that a contract does not yet require, write to admin@finanpivot.com.">如果要询问、更正或删除一份合同尚未需要的资料，请写到 admin@finanpivot.com。</p>`,
  },
  {
    file: "terms.html",
    title: "条款",
    titleEn: "Terms",
    description: "网站介绍不是合同、报价或专业意见。",
    descriptionEn: "These pages are not a contract, a quote, or professional advice.",
    body: `<h1 data-en="What this site is not">本网站不是什么</h1>
    <p data-en="The pages are not a contract, a quote, or professional advice. Scope, fee, deliverable and responsibility are whatever you accept in writing.">页面上的介绍不是合同、报价或专业意见。范围、费用、交付物和责任，以你书面接受的文本为准。</p>
    <p data-en="Unless that writing and a license say otherwise, this site is not legal, audit, investment or tax advice, and it does not replace customs, a bank, a tax authority or a licensed firm.">除非书面文本和相应资质另有说明，本网站不构成法律、审计、投资或税务意见，也不代替海关、银行、税务机关或持牌机构。</p>
    <p data-en="We do not promise an investment return, a tax saving, or that a debt will be collected.">我们不承诺投资收益、少交的税，或一笔欠款一定能收回。</p>`,
  },
  {
    file: "404.html",
    title: "未找到",
    titleEn: "Not found",
    description: "这个页面不存在。",
    descriptionEn: "This page is not here.",
    body: `<h1 data-en="This page is not here">这个页面不存在</h1><p><a href="index.html" data-en="Back to the home page">回到首页</a></p>`,
  },
];

function localize(html) {
  return html.replace(/data-en="([^"]*)">([^<]*)</g, (_, en) => `data-en="${en}">${en}<`);
}

export function renderPage(page, lang = "zh") {
  const en = lang === "en";
  const links = nav
    .map(([href, label, labelEn]) => {
      const text = en ? labelEn : label;
      const current = href === page.file ? ' aria-current="page"' : "";
      return `<a href="${href}"${current} data-en="${labelEn}">${text}</a>`;
    })
    .join("");
  const path = page.file === "index.html" ? "/" : `/${page.file}`;
  const canonical = en ? `${HOST}/en${path}` : `${HOST}${path}`;
  const title = en ? page.titleEn : page.title;
  const description = en ? page.descriptionEn : page.description;
  const root = en ? "../" : "";
  const switchHref = en ? `../${page.file}` : `en/${page.file}`;
  const switchLabel = en ? "中文" : "EN";
  let html = `<!doctype html>
<html lang="${en ? "en" : "zh-CN"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · FinanPivot</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="zh-CN" href="${HOST}${path}">
<link rel="alternate" hreflang="en" href="${HOST}/en${path}">
<meta property="og:title" content="${title} · FinanPivot">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${en ? "en_US" : "zh_CN"}">
<meta property="og:image" content="${HOST}/assets/og.png">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}styles.css">
</head>
<body>
<a class="skip" href="#content">${en ? "Skip to content" : "跳到正文"}</a>
<header class="top">
  <a class="brand" href="index.html"><span class="mark">FP</span><span><span class="kicker">FinanPivot</span><strong>${en ? "Cross-border finance" : "跨境财务与专业外包"}</strong></span></a>
  <nav aria-label="${en ? "Primary" : "主导航"}">${links}</nav>
  <a id="lang" href="${switchHref}">${switchLabel}</a>
</header>
<main id="content">${page.body}</main>
<footer>
  <p>Financial Clarity. Business Forward.</p>
  <p>${en ? "Reply address" : "回复地址"}：<a href="mailto:${MAIL}">${MAIL}</a> · <a href="contact.html">QQ ${QQ}</a></p>
  <p><a href="about.html">${en ? "Rules" : "原则"}</a> · <a href="privacy.html">${en ? "Privacy" : "隐私"}</a> · <a href="terms.html">${en ? "Terms" : "条款"}</a></p>
  <p>${en ? "These pages are not legal, audit, investment or tax advice. The written agreement governs." : "本网站介绍服务范围，不构成法律、审计、投资或税务意见。正式工作以书面文本为准。"}</p>
</footer>
<script src="${root}site.js"></script>
</body>
</html>`;
  if (en) {
    html = localize(html);
    for (const [name, alt] of Object.entries(assetAltEn)) {
      html = html.replaceAll(`alt="${assetAlt[name]}"`, `alt="${alt}"`);
    }
    html = html
      .replaceAll("hero.svg", "hero-en.svg")
      .replaceAll("flow.svg", "flow-en.svg")
      .replaceAll("ledger.svg", "ledger-en.svg");
    html = html.replaceAll('src="assets/', 'src="../assets/').replaceAll('href="assets/', 'href="../assets/');
  }
  return html;
}

export { HOST };
