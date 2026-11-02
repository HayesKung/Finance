// Explanatory notes. Facts are limited to methods the public site already states.
// No client names, no performance figures, no license numbers, no prices.
// Set published: true only after a person has read the note. The template
// below is not in `articles`, so it is never written to the site.

export const ARTICLE_TEMPLATE = {
  slug: "your-slug",
  date: "YYYY-MM-DD",
  published: false,
  image: "export.svg",
  related: ["services/export.html", "faq.html", "start.html"],
  zh: {
    title: "用问句写出读者会搜的问题",
    description: "一两句答案。不写数字，不写客户，不写牌照。",
    lede: "第一段就回答标题里的问题，并写明这不是法律、审计、投资或税务意见。",
    sections: [
      { h: "这一节讲什么", paragraphs: ["只写本站已经公开的做法。"], list: ["栏目一", "栏目二"] },
      { h: "这一节不承诺什么", paragraphs: ["写明边界。"] },
    ],
  },
  en: {
    title: "The question a reader would type",
    description: "The answer in one or two sentences. No figures, clients or licenses.",
    lede: "Answer the title in the first paragraph, and say this is not legal, audit, investment or tax advice.",
    sections: [
      { h: "What this section explains", paragraphs: ["Stay inside what the site already says."], list: ["Item one", "Item two"] },
      { h: "What this section does not promise", paragraphs: ["State the boundary."] },
    ],
  },
};

const notes = [
  {
    slug: "export-papers-and-receipts",
    date: "2026-11-02",
    published: true,
    image: "export.svg",
    related: ["services/export.html", "how-we-work.html", "faq.html"],
    zh: {
      title: "出口订单、单据和收汇怎么放在同一张对照表里？",
      description: "出口财务运营里，一张对照表通常并列订单或合同、发票、约定单据和银行收汇记录。这不是退税申报，也不是收款承诺。",
      lede: "出口财务运营里，常见的做法是把一笔生意的订单或合同、发票、约定的运输或交单类单据，以及银行收汇记录放在同一张对照表里。下面只说明这张表通常有哪些栏。它不代表任何一票业务的结果，也不代替报关、银行或税务审批。",
      sections: [
        {
          h: "对照表通常有哪些栏",
          paragraphs: ["币种和金额以银行记录和双方单据为准。公开说明不填写任何一票真实业务的数字。还没对上的项目只标成未核对，不把付款截图写成已收。"],
          list: ["订单或合同编号", "发票号与币种", "约定单据的名称和日期", "银行收汇的日期、币种和金额", "尚未对上的差异"],
        },
        {
          h: "结算方式只作为分类",
          paragraphs: ["电汇（TT）、信用证（LC）和付款交单（DP）是常见的分类名称。本站不统计某一家企业或市场上各占多少，也不建议只凭分类判断能不能做。"],
        },
        {
          h: "这张表不是什么",
          paragraphs: ["它不是退税申报表，不是审计报告，也不是收款承诺。需要执业资质的事项，只有在主体具备资质或由合资格机构提供时才承接。"],
        },
      ],
    },
    en: {
      title: "How do an export order, its documents and the receipt sit on one sheet?",
      description: "An export file usually lines up the order or contract, the invoice, the agreed documents and the bank receipt. It is not a tax filing and not a promise that money will arrive.",
      lede: "In export finance operations, one sheet usually holds the order or contract, the invoice, the shipping or presentation papers that were agreed, and the bank receipt. The columns below are only a description of that sheet. They are not the result of any shipment, and they do not replace customs, a bank or a tax approval.",
      sections: [
        {
          h: "Columns the sheet usually has",
          paragraphs: ["Currency and amount follow the bank record and the two sides' papers. A public note does not fill in the figures of a real shipment. Anything that does not match yet is marked unchecked. A payment screenshot is not written down as money received."],
          list: ["Order or contract reference", "Invoice number and currency", "Name and date of the agreed documents", "Date, currency and amount of the bank receipt", "A difference that is still open"],
        },
        {
          h: "Settlement method is only a label",
          paragraphs: ["Telegraphic transfer (TT), letter of credit (LC) and documents against payment (DP) are common labels. This site does not count how often a company or a market uses each one, and a label alone is not a reason to take the work."],
        },
        {
          h: "What the sheet is not",
          paragraphs: ["It is not an export-rebate filing, not an audit report, and not a promise of collection. Licensed work is accepted only when the firm is qualified, or a qualified firm does it."],
        },
      ],
    },
  },
  {
    slug: "project-monthly-note",
    date: "2026-11-02",
    published: true,
    image: "project.svg",
    related: ["services/project.html", "services/report.html", "how-we-work.html"],
    zh: {
      title: "海外项目的月度说明通常列哪些栏目？",
      description: "月度说明把预算、进度款、质保金和仍待核对的事项放在同一份文字里。它是管理备忘，不是审计意见。",
      lede: "海外项目财务管理里，月度说明用来把预算、进度、质保金和仍待核对的事项放在同一份文字里。它是管理备忘，不是审计意见，也不代替工程质量、法律或税务结论。公开文章不写任何一个项目的金额。",
      sections: [
        {
          h: "通常会出现的栏目",
          paragraphs: ["已确认的银行记录，和只是申报的部分，分开写。客户资金仍在客户自己的账户里，这里不代收、不托管。"],
          list: ["本月约定要看的范围", "预算，以及已经有单据的成本记录（不在公开说明里写金额）", "进度款：节点、已有单据、仍未核对的部分", "质保金：合同里的条件是否已经摘出，不判断能否收回", "未决问题：缺哪一份资料"],
        },
        {
          h: "这份说明不是什么",
          paragraphs: ["不是审计意见，不代替工程质量、法律或税务结论，也不托管客户资金。客户名称、业绩数字和牌照不写进公开说明。"],
        },
        {
          h: "和按周期整理的报告怎么分开",
          paragraphs: ["按约定周期整理账务资料和经营分析，是另一项工作。需要执业资质的记账、审计、税务或付款事项，只有在主体具备资质或由合资格机构提供时才承接。"],
        },
      ],
    },
    en: {
      title: "What does a monthly note on an overseas project usually list?",
      description: "A monthly note puts the budget, progress billings, retention and open questions in one place. It is a management note, not an audit opinion.",
      lede: "On an overseas project, a monthly note keeps the budget, progress, retention and anything still unchecked in one piece of writing. It is a management note. It is not an audit opinion, and it does not replace an engineering, legal or tax conclusion. A public article does not state any project's amounts.",
      sections: [
        {
          h: "Headings that usually appear",
          paragraphs: ["Confirmed bank records stay apart from amounts that are only claimed. Client money stays in the client's own account. This work does not collect it or hold it."],
          list: ["The scope agreed for the month", "The budget, and cost records that already have papers (a public note states no amounts)", "Progress billings: the milestone, the papers on hand, and what is still unchecked", "Retention: whether the contract condition has been copied out, without judging if it will be released", "Open questions: which paper is missing"],
        },
        {
          h: "What the note is not",
          paragraphs: ["It is not an audit opinion. It does not replace an engineering, legal or tax conclusion, and it does not hold client money. Client names, performance figures and licenses stay out of a public note."],
        },
        {
          h: "How this differs from a periodic report",
          paragraphs: ["Sorting the books and writing a management note on an agreed cycle is a separate piece of work. Licensed bookkeeping, audit, tax or payment work is accepted only when a qualified firm does it."],
        },
      ],
    },
  },
  {
    slug: "screenshot-is-not-a-receipt",
    date: "2026-11-02",
    published: true,
    image: "collect.svg",
    related: ["services/collect.html", "how-we-work.html", "faq.html"],
    zh: {
      title: "付款截图为什么不能当作到账？",
      description: "付款截图只是待核验的申报。实际到账要由负责人核对银行记录。网站不收款，也不把截图写成已入账。",
      lede: "在 FinanPivot 已经公开的流程里，付款截图只是一项待核验的申报。实际到账要由负责人核对银行记录。这一条同时适用于服务费和客户自己的项目回款记录：网站不收款，也不把截图写成已入账。",
      sections: [
        {
          h: "截图通常证明不了的事",
          paragraphs: ["这些要看银行记录，而不是看图片。"],
          list: ["银行是否已经贷记", "入账账户是不是合同里约定的账户", "金额和币种是否与申报一致"],
        },
        {
          h: "一份差异备忘可以怎么列",
          paragraphs: ["不写预计何时收回，也不写收回了多少。不承诺债务回收，不提供诉讼或资金支付服务。"],
          list: ["合同或订单编号", "发票或结算单编号", "对方申报已支付的金额和日期", "银行记录里是否已见到对应贷记：见到，或尚未见到", "仍缺的资料"],
        },
        {
          h: "入账顺序",
          paragraphs: ["客户申报不是到账。只有负责人确认银行实际到账后，才借记银行存款、贷记合同负债。这是本站公开的账务关系，不是对某一客户的结果描述。"],
        },
      ],
    },
    en: {
      title: "Why is a payment screenshot not a confirmed receipt?",
      description: "A payment screenshot is only a claim waiting to be checked. The principal confirms the bank record. This site does not take payment, and it does not book a screenshot as money received.",
      lede: "On the path FinanPivot already publishes, a payment screenshot is only a claim waiting to be checked. The principal confirms it against the bank record. The same rule covers a service fee and a project's own receipts: this site does not take payment, and it does not book a screenshot as money received.",
      sections: [
        {
          h: "What a picture usually cannot show",
          paragraphs: ["Those points are read from the bank record, not from the picture."],
          list: ["Whether the bank has credited the account", "Whether the account is the one named in the contract", "Whether the amount and currency match the claim"],
        },
        {
          h: "How a difference note can be listed",
          paragraphs: ["Do not write when the money is expected back, and do not write how much came back. We do not promise collection, and we do not sue or pay money out."],
          list: ["The contract or order reference", "The invoice or settlement reference", "The amount and date the other side says it paid", "Whether the bank record shows that credit: seen, or not seen yet", "The paper that is still missing"],
        },
        {
          h: "The order of the books",
          paragraphs: ["A customer claim is not money received. Only after the principal confirms the bank credit do the books debit cash and credit the contract liability. That is the bookkeeping relationship this site publishes. It is not a result for any one client."],
        },
      ],
    },
  },
];

export const articles = notes.filter((article) => article.published);
