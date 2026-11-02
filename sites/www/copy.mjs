export const ORIGIN = "https://finanpivot.com";
export const MAIL = "admin@finanpivot.com";
export const QQ = "3942114211";
export const UPDATED = "2026-11-02";

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

export const assetAltEn = {
  "favicon.svg": "FinanPivot mark",
  "hero.svg": "Illustration: orders, documents and receipts brought into one ledger",
  "flow.svg": "Service path: admission, fee, check, delivery",
  "ledger.svg": "Books: a customer claim is recorded as cash and contract liability only after the principal confirms it",
  "export.svg": "Export documents set beside the receipt record",
  "project.svg": "Project progress and a cash plan",
  "collect.svg": "Contract, invoice and bank credit checked against each other",
  "report.svg": "A monthly management-note trend",
};

export const nav = [
  ["index.html", "首页", "Home"],
  ["services.html", "服务", "Services"],
  ["how-we-work.html", "流程", "Path"],
  ["insights.html", "见解", "Insights"],
  ["start.html", "咨询", "Start"],
  ["about.html", "原则", "Rules"],
  ["faq.html", "问答", "FAQ"],
  ["contact.html", "联系", "Contact"],
];

export const ui = {
  zh: {
    tagline: "跨境财务与专业外包",
    skip: "跳到正文",
    navLabel: "主导航",
    menu: "菜单",
    crumb: "面包屑",
    privacy: "隐私",
    terms: "条款",
    contact: "联系",
    emailLabel: "邮件联系",
    qqLabel: "QQ 联系",
    qqOpen: "单击打开 QQ",
    copy: "复制",
    lang: "EN",
    langLabel: "English",
    disclaimer: "本网站介绍服务范围，不构成法律、审计、投资或税务意见。正式工作以书面合同为准。",
    ctaTitle: "先写一封咨询",
    ctaBody: "说明企业、地区和想先看的事项。邮件在你自己的邮箱里发出。这一页不报价、不收款、不保存。",
    ctaInquiry: "准备咨询",
    ctaEmail: "直接发邮件",
  },
  en: {
    tagline: "Cross-border finance and outsourcing",
    skip: "Skip to content",
    navLabel: "Primary",
    menu: "Menu",
    crumb: "Breadcrumb",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    emailLabel: "Email",
    qqLabel: "QQ",
    qqOpen: "Open QQ",
    copy: "Copy",
    lang: "中文",
    langLabel: "中文",
    disclaimer: "These pages describe scope. They are not legal, audit, investment or tax advice. A signed contract governs the work.",
    ctaTitle: "Write the inquiry first",
    ctaBody: "Name the company, the region and the topic. The mail leaves from your own mailbox. This page is not a quote, a payment or a stored form.",
    ctaInquiry: "Prepare an inquiry",
    ctaEmail: "Email directly",
  },
};

export const services = [
  {
    id: "export",
    image: "export.svg",
    zh: {
      name: "出口企业财务运营",
      summary: "订单、单据、应收与收款记录协同管理。",
      not: "不代替报关、银行或税务审批。",
      description: "出口企业财务运营：把订单、单据、应收与收款记录放在一起对照。不代替报关、银行或税务审批。",
      coversTitle: "通常放在一起看的资料",
      coversNote: "下面是本站已经公开的范围里的常见栏目，不是某一客户的交付清单，也不是结果承诺。",
      covers: ["订单或合同编号", "发票", "约定的运输或交单类单据", "应收记录", "银行收款记录", "尚未对上的差异，只标成未核对"],
    },
    en: {
      name: "Export finance operations",
      summary: "Orders, documents, receivables and receipts in one file.",
      not: "We do not replace customs, a bank or a tax approval.",
      description: "Export finance operations: orders, documents, receivables and receipts in one file. This does not replace customs, a bank or a tax approval.",
      coversTitle: "Papers usually read together",
      coversNote: "These are the kinds of papers already named on this site. They are not one client's deliverable list and not a promise of a result.",
      covers: ["An order or contract reference", "The invoice", "Shipping or presentation papers that were agreed", "The receivable record", "The bank receipt record", "A difference that is still unchecked"],
    },
  },
  {
    id: "project",
    image: "project.svg",
    zh: {
      name: "海外项目财务管理",
      summary: "跟踪项目预算、进度、质保金与现金流。",
      not: "不代替工程质量、法律或税务结论，不托管客户资金。",
      description: "海外项目财务管理：跟踪项目预算、进度、质保金与现金流。不代替工程质量、法律或税务结论，不托管客户资金。",
      coversTitle: "通常放在一起看的事项",
      coversNote: "下面是本站已经公开的范围，不是某一项目的完成情况。",
      covers: ["项目预算", "进度", "质保金", "现金流备忘：已确认的银行记录，和只是申报的部分，分开写"],
    },
    en: {
      name: "Overseas project finance",
      summary: "Budget, progress, retention and cash.",
      not: "We do not replace an engineering, legal or tax conclusion, and we do not hold client money.",
      description: "Overseas project finance: budget, progress, retention and cash. This does not replace an engineering, legal or tax conclusion, and it does not hold client money.",
      coversTitle: "What is usually kept in view",
      coversNote: "This is the scope already stated on this site, not the outcome of any one project.",
      covers: ["The project budget", "Progress", "Retention", "A cash note that separates confirmed bank records from claims that are only reported"],
    },
  },
  {
    id: "collect",
    image: "collect.svg",
    zh: {
      name: "跨境结算与应收管理",
      summary: "核对到账差异、应收账龄与跟进事项。",
      not: "不承诺债务回收，不提供诉讼或资金支付服务。",
      description: "跨境结算与应收管理：核对到账差异、应收账龄与跟进事项。不承诺债务回收，不提供诉讼或资金支付服务。",
      coversTitle: "通常核对的三件事",
      coversNote: "差异先标成未核对。付款截图不是到账。",
      covers: ["到账差异", "应收账龄", "跟进事项", "仍缺的银行记录或单据"],
    },
    en: {
      name: "Settlement and receivables",
      summary: "Receipt differences, aging and follow-up.",
      not: "We do not promise collection, and we do not sue or pay money out.",
      description: "Settlement and receivables: receipt differences, aging and follow-up. We do not promise collection, and we do not sue or pay money out.",
      coversTitle: "Three things usually checked",
      coversNote: "A difference stays unchecked until the papers match. A payment screenshot is not a confirmed receipt.",
      covers: ["A receipt difference", "Receivable aging", "The follow-up", "A bank record or paper that is still missing"],
    },
  },
  {
    id: "report",
    image: "report.svg",
    zh: {
      name: "财务外包与管理报告",
      summary: "按约定周期整理账务资料与经营分析。",
      not: "需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。",
      description: "财务外包与管理报告：按约定周期整理账务资料与经营分析。需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。",
      coversTitle: "按约定周期整理的内容",
      coversNote: "经营分析是管理说明，不是审计意见。本站不展示牌照。",
      covers: ["约定周期内的账务资料", "一份经营分析说明", "需要执业资质的事项单独标出，不在无资质时承接"],
    },
    en: {
      name: "Outsourced reporting",
      summary: "Books and a management note on the agreed cycle.",
      not: "Licensed accounting, audit, tax or payment work is accepted only when a qualified firm does it.",
      description: "Outsourced reporting: books and a management note on the agreed cycle. Licensed accounting, audit, tax or payment work is accepted only when a qualified firm does it.",
      coversTitle: "What the agreed cycle covers",
      coversNote: "A management note is not an audit opinion. This site does not display a license.",
      covers: ["The books for the agreed period", "One management note", "Licensed work marked separately and accepted only when a qualified firm does it"],
    },
  },
];

export const homeSteps = {
  zh: [
    ["看清边界", "本网站"],
    ["写下咨询", "本网站打开邮件"],
    ["范围与报价", "负责人确认后"],
    ["书面合同", "在线签署未开通"],
    ["银行转账", "网站不收款"],
    ["到账核验", "截图不算到账"],
    ["资料与底稿", "只在约定范围"],
    ["复核交付", "负责人签发"],
  ],
  en: [
    ["See the boundary", "On this site"],
    ["Write the inquiry", "This site opens the email"],
    ["Scope and fee", "After a person checks"],
    ["Written contract", "Online signing is not open"],
    ["Bank transfer", "This site does not take payment"],
    ["Money checked", "A screenshot is not a receipt"],
    ["Papers and work", "Only the agreed scope"],
    ["Review and delivery", "The principal signs off"],
  ],
};

export const flowSteps = {
  zh: [
    ["01", "看清服务和边界", "本网站", "先看四项服务和我们不做什么。"],
    ["02", "写下咨询", "本网站打开邮件", "填企业、地区和想先看的事项。邮件在你自己的邮箱里发出。网站不保存。"],
    ["03", "准入", "书面", "核实主体、授权、利益冲突和资料范围。"],
    ["04", "范围与报价", "负责人审批", "写清做什么、不做什么、交付物和时间。按项目、周期或工作量报价。"],
    ["05", "合同", "书面", "以书面合同为准。在线签署通道尚未开通。"],
    ["06", "付款", "银行", "按合同约定的银行账户转账。网站不收款。"],
    ["07", "核验", "负责人", "付款截图只是待核验资料。实际到账由负责人确认。"],
    ["08", "入账", "内部账", "确认后的金额才进入应收核销和复式分录。"],
    ["09", "执行", "约定范围", "收集必要资料，建立项目、任务和底稿。"],
    ["10", "复核交付", "负责人签发", "支撑人员检查，财务负责人复核并签发交付包。"],
  ],
  en: [
    ["01", "Read the boundary", "On this site", "Read the four services and what we will not do."],
    ["02", "Write the inquiry", "This site opens the email", "Company, region and topic. The mail leaves from your own mailbox. This site does not store it."],
    ["03", "Admission", "In writing", "Check the entity, authority, conflicts and the papers in scope."],
    ["04", "Scope and fee", "Principal approves", "What is in, what is out, the deliverable and the time. Priced by project, period or effort."],
    ["05", "Contract", "In writing", "The written contract governs. Online signing is not open."],
    ["06", "Payment", "Bank", "Transfer to the bank account named in the contract. This site does not take payment."],
    ["07", "Check", "Principal", "A payment screenshot is only a claim. The principal confirms the bank credit."],
    ["08", "Books", "Internal books", "Only a confirmed amount is applied to the receivable and the journal."],
    ["09", "Work", "Agreed scope", "Collect the needed papers and open the project, tasks and workpapers."],
    ["10", "Review and delivery", "Principal signs", "Support checks. The finance principal reviews and issues the pack."],
  ],
};

export const principles = {
  zh: [
    "授权优先：只处理客户明确授权的主体、账户、项目和资料。",
    "数据最小化：只收集完成约定服务所需的信息。",
    "过程可追溯：合同、资料、审批、收款核验和交付留有记录。",
    "资金分离：不把客户资金和服务方资金混在一起，不擅自代付或托管。",
    "专业边界：会计、税务、法律、审计和受监管服务按资质与当地法规执行。",
    "人工负责：自动化可以协助整理。关键判断、资金确认、报价和交付由授权人员负责。",
  ],
  en: [
    "Authority first: only the entity, account, project and papers the client has authorized.",
    "As little data as the agreed work needs.",
    "A record for the contract, the papers, the approval, the receipt check and the delivery.",
    "Client money and our fee stay apart. We do not pay on a client's behalf or hold their funds.",
    "Accounting, tax, law, audit and regulated work follow the license and the local rule.",
    "A person remains responsible. Software may sort papers. It does not approve money, a price, or a delivery.",
  ],
};

export const absent = {
  zh: ["客户名单", "业绩数字", "牌照或许可编号", "在线收款"],
  en: ["A client list", "Performance numbers", "A license or permit number", "A payment taken on this site"],
};

export const faqs = [
  {
    zh: { q: "你们是否代替报关、税务或审计？", a: "不代替。需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。" },
    en: { q: "Do you replace customs, tax or an audit?", a: "No. Licensed work is accepted only when the firm is qualified, or a qualified firm does it." },
  },
  {
    zh: { q: "你们是否代收或托管客户资金？", a: "不代收，不托管，不在网站上发起付款。" },
    en: { q: "Do you collect or hold client money?", a: "No. This site does not take a payment." },
  },
  {
    zh: { q: "电子合同现在能签吗？", a: "不能。正式签署以书面合同为准。在线签署供应商尚未开通，sandbox 不构成签署成功。" },
    en: { q: "Can we sign an electronic contract now?", a: "No. The written contract governs. An online signing vendor is not connected, and a sandbox is not a completed signature." },
  },
  {
    zh: { q: "付款截图能不能当到账？", a: "不能。截图只是申报。实际到账由负责人核对银行记录后再入账。" },
    en: { q: "Does a payment screenshot count?", a: "No. It is only a claim. The principal checks the bank record before anything is booked." },
  },
  {
    zh: { q: "咨询会留在网站上吗？", a: "不会。咨询页只在你自己的邮件程序里打开一封信，网站不保存这封内容，也不把它变成订单。" },
    en: { q: "Is an inquiry stored on this site?", a: "No. The inquiry page only opens an email in your own mail program. The site does not store that text, and the email is not an order." },
  },
  {
    zh: { q: "网站上有报价、客户名单或业绩数字吗？", a: "没有。范围和费用在负责人确认后另行书面约定。本网站不展示客户名单、业绩数字或牌照。" },
    en: { q: "Are fees, client names or results listed here?", a: "No. Scope and fee are agreed in writing after a person checks. This site shows no client list, performance numbers or license." },
  },
  {
    zh: { q: "怎么联系？", a: `请发邮件到 ${MAIL}，或通过 QQ ${QQ} 联系。也可以先到咨询页把邮件写好。网站不收集会保存内容的表单。` },
    en: { q: "How do we reach you?", a: `Email ${MAIL}, or use QQ ${QQ}. You can draft the email on the inquiry page. This site has no form that stores a message.` },
  },
];

export const topics = [
  ["export", "出口单据和收汇", "Export documents and receipts"],
  ["project", "海外项目", "An overseas project"],
  ["collect", "结算差异", "A settlement difference"],
  ["report", "月度报告", "A monthly report"],
];

export const inquirySteps = {
  zh: [
    ["01", "写下企业、地区和想先看的事项。"],
    ["02", "在你自己的邮件程序里把信发出。网站不保存。"],
    ["03", "由人回复。这一页不报价、不签约、不收款。"],
  ],
  en: [
    ["01", "Write the company, the region and the topic."],
    ["02", "Send it from your own mail program. This site does not store it."],
    ["03", "A person replies. This page does not quote, sign or take payment."],
  ],
};
