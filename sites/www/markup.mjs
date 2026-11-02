import { analytics } from "./analytics-config.mjs";
import { articles } from "./articles.mjs";
import {
  MAIL,
  ORIGIN,
  QQ,
  UPDATED,
  absent,
  assetAlt,
  assetAltEn,
  faqs,
  flowSteps,
  homeSteps,
  inquirySteps,
  nav,
  principles,
  services,
  topics,
  ui,
} from "./copy.mjs";

export { MAIL, ORIGIN, QQ, assetAlt };

const serviceArticle = {
  export: "export-papers-and-receipts",
  project: "project-monthly-note",
  collect: "screenshot-is-not-a-receipt",
  report: "project-monthly-note",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function L(locale, zh, en) {
  return locale === "en" ? en : zh;
}

export function locPath(file, locale) {
  if (file === "index.html") return locale === "en" ? "/en/" : "/";
  return locale === "en" ? `/en/${file}` : `/${file}`;
}

function abs(file, locale) {
  return `${ORIGIN}${locPath(file, locale)}`;
}

function outFile(file, locale) {
  return locale === "en" ? `en/${file}` : file;
}

function img(file, locale, { priority = false, className = "" } = {}) {
  const alt = locale === "en" ? assetAltEn[file] : assetAlt[file];
  const size = {
    "hero.svg": [720, 520],
    "export.svg": [640, 360],
    "project.svg": [640, 360],
    "collect.svg": [640, 360],
    "report.svg": [640, 360],
    "flow.svg": [880, 180],
    "ledger.svg": [720, 280],
  }[file];
  const cls = className ? ` class="${className}"` : "";
  const extra = priority ? ' fetchpriority="high"' : ' decoding="async"';
  return `<img${cls} src="/assets/${file}" alt="${esc(alt)}" width="${size[0]}" height="${size[1]}"${extra}>`;
}

function contactActions(locale) {
  const text = ui[locale];
  const web = `https://wpa.qq.com/msgrd?v=3&uin=${QQ}&site=qq&menu=yes`;
  const desktop = `tencent://message/?uin=${QQ}&amp;Site=finanpivot.com&amp;Menu=yes`;
  const mobile = `mqqwpa://im/chat?chat_type=wpa&amp;uin=${QQ}&amp;version=1&amp;src_type=web&amp;web_src=finanpivot.com`;
  return `<div class="contact-group">
    <div class="contact-row">
      <a class="contact-card" href="mailto:${MAIL}" data-track="cta_email">
        <span class="label">${esc(text.emailLabel)}</span>
        <strong>${MAIL}</strong>
      </a>
      <div class="contact-card">
        <a class="qq-open" href="${web}" data-desktop="${desktop}" data-mobile="${mobile}">
          <span class="label">${esc(text.qqLabel)}</span>
          <strong>${esc(text.qqOpen)}</strong>
        </a>
        <p class="qq-fallback" hidden>
          <span>${QQ}</span>
          <button type="button" data-copy="${QQ}">${esc(text.copy)}</button>
          <span class="copy-status" role="status"></span>
        </p>
      </div>
    </div>
  </div>`;
}

function cta(locale, href) {
  const text = ui[locale];
  return `<aside class="cta">
    <h2>${esc(text.ctaTitle)}</h2>
    <p>${esc(text.ctaBody)}</p>
    <div class="btnrow">
      <a class="btn solid" href="${href}" data-track="cta_inquiry">${esc(text.ctaInquiry)}</a>
      <a class="btn" href="mailto:${MAIL}" data-track="cta_email">${esc(text.ctaEmail)}</a>
    </div>
  </aside>`;
}

function crumbs(locale, items) {
  const html = items
    .map((item, index) => {
      if (index === items.length - 1) return `<span aria-current="page">${esc(item.label)}</span>`;
      return `<a href="${item.href}">${esc(item.label)}</a>`;
    })
    .join('<span aria-hidden="true"> / </span>');
  return `<nav class="crumbs" aria-label="${esc(ui[locale].crumb)}">${html}</nav>`;
}

function crumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };
}

function jsonScript(graph) {
  const payload = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${payload}</script>`;
}

function baseGraph(locale, page) {
  const zh = locale === "zh";
  return [
    {
      "@type": "Organization",
      "@id": `${ORIGIN}/#organization`,
      name: "FinanPivot",
      url: `${ORIGIN}/`,
      email: MAIL,
      slogan: "Financial Clarity. Business Forward.",
      description: zh
        ? "为出口贸易、海外项目和跨境经营企业提供财务运营、项目台账、结算协同与管理报告支持。"
        : "Finance operations, project ledgers, settlement support and management reports for export, overseas-project and cross-border companies.",
      logo: { "@type": "ImageObject", url: `${ORIGIN}/favicon.svg` },
      knowsLanguage: ["zh-CN", "en"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: MAIL,
          availableLanguage: ["zh-CN", "en"],
          url: `${ORIGIN}/contact.html`,
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${ORIGIN}/#practice`,
      name: "FinanPivot",
      url: `${ORIGIN}/`,
      email: MAIL,
      image: `${ORIGIN}/assets/hero.svg`,
      parentOrganization: { "@id": `${ORIGIN}/#organization` },
      description: zh
        ? "为出口贸易、海外项目和跨境经营企业提供财务运营、项目台账、结算协同与管理报告支持。网站不收款，不展示客户名单、业绩数字或牌照。"
        : "Finance operations, project ledgers, settlement support and management reports for export, overseas-project and cross-border companies. This site does not take payment and shows no client list, performance numbers or license.",
    },
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: "FinanPivot",
      inLanguage: ["zh-CN", "en"],
      publisher: { "@id": `${ORIGIN}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${page.url}#webpage`,
      url: page.url,
      name: page.title,
      description: page.description,
      inLanguage: zh ? "zh-CN" : "en",
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#practice` },
    },
  ];
}

function analyticsStub() {
  const dnt = analytics.respectDoNotTrack ? 'if(navigator.doNotTrack==="1"||window.doNotTrack==="1")return;' : "";
  const third =
    analytics.enabled && analytics.provider === "plausible" && analytics.siteId
      ? `<script defer data-domain="${esc(analytics.siteId)}" src="https://plausible.io/js/script.js"></script>`
      : "";
  return `${third}<script>window.finanpivot=window.finanpivot||{};window.finanpivot.track=function(name,detail){${dnt}(window.finanpivot.queue=window.finanpivot.queue||[]).push({name:name,detail:detail||{},at:Date.now()});if(typeof window.plausible==="function")window.plausible(name,{props:{path:(detail&&detail.path)||""}});};</script>`;
}

function shell(page) {
  const locale = page.locale;
  const text = ui[locale];
  const other = locale === "en" ? "zh" : "en";
  const links = nav
    .map(([file, zh, en]) => {
      const current = file === page.file || (file === "services.html" && page.file.startsWith("services/")) || (file === "insights.html" && page.file.startsWith("insights/"));
      return `<a href="${locPath(file, locale)}"${current ? ' aria-current="page"' : ""}>${esc(L(locale, zh, en))}</a>`;
    })
    .join("");
  const graph = baseGraph(locale, page);
  if (page.crumbs) graph.push(crumbLd(page.crumbs));
  if (page.extraLd) graph.push(...page.extraLd);
  const homeLabel = L(locale, "首页", "Home");
  const footLinks = [
    ["index.html", homeLabel],
    ["services.html", L(locale, "服务", "Services")],
    ["insights.html", L(locale, "见解", "Insights")],
    ["faq.html", L(locale, "问答", "FAQ")],
  ]
    .map(([file, label]) => `<a href="${locPath(file, locale)}">${esc(label)}</a>`)
    .join(" · ");
  return `<!doctype html>
<html lang="${locale === "en" ? "en" : "zh-CN"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="format-detection" content="telephone=no">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${page.robots}">
<link rel="canonical" href="${page.url}">
<link rel="alternate" hreflang="zh-CN" href="${page.zhUrl}">
<link rel="alternate" hreflang="en" href="${page.enUrl}">
<link rel="alternate" hreflang="x-default" href="${page.zhUrl}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:type" content="${page.ogType}">
<meta property="og:url" content="${page.url}">
<meta property="og:locale" content="${locale === "en" ? "en_US" : "zh_CN"}">
<meta property="og:locale:alternate" content="${locale === "en" ? "zh_CN" : "en_US"}">
<meta property="og:site_name" content="FinanPivot">
<meta property="og:image" content="${ORIGIN}/assets/hero.svg">
<meta property="og:image:alt" content="${esc(locale === "en" ? assetAltEn["hero.svg"] : assetAlt["hero.svg"])}">
<meta property="og:image:width" content="720">
<meta property="og:image:height" content="520">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="theme-color" content="#1b3830">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="describedby" href="/llms.txt" type="text/plain" title="LLM site summary">
${page.articleMeta || ""}
${jsonScript(graph)}
${analyticsStub()}
</head>
<body>
<a class="skip" href="#content">${esc(text.skip)}</a>
<header class="top">
  <a class="brand" href="${locPath("index.html", locale)}"><span class="mark">FP</span><span><span class="kicker">FinanPivot</span><strong>${esc(text.tagline)}</strong></span></a>
  <a class="lang" href="${locPath(page.file, other)}" hreflang="${other === "en" ? "en" : "zh-CN"}" lang="${other === "en" ? "en" : "zh-CN"}" aria-label="${esc(text.langLabel)}">${esc(text.lang)}</a>
  <nav aria-label="${esc(text.navLabel)}">
    <input class="menu-check" id="nav-menu" type="checkbox">
    <label class="menu-toggle" for="nav-menu">${esc(text.menu)}</label>
    <div class="menu-links">${links}</div>
  </nav>
</header>
<main id="content">${page.crumbHtml || ""}${page.body}</main>
<footer>
  <p>Financial Clarity. Business Forward.</p>
  <p><a href="mailto:${MAIL}">${MAIL}</a> · <a href="${locPath("contact.html", locale)}">${esc(text.contact)}</a></p>
  <p>${footLinks}</p>
  <p><a href="${locPath("privacy.html", locale)}">${esc(text.privacy)}</a> · <a href="${locPath("terms.html", locale)}">${esc(text.terms)}</a></p>
  <p>${esc(text.disclaimer)}</p>
</footer>
<script src="/site.js"></script>
</body>
</html>
`;
}

function make(spec) {
  const page = {
    file: spec.file,
    locale: spec.locale,
    out: outFile(spec.file, spec.locale),
    url: abs(spec.file, spec.locale),
    zhUrl: abs(spec.file, "zh"),
    enUrl: abs(spec.file, "en"),
    title: spec.title,
    description: spec.description,
    robots: spec.robots || "index, follow",
    sitemap: spec.sitemap !== false,
    ogType: spec.ogType || "website",
    updated: spec.updated || UPDATED,
    crumbs: spec.crumbs,
    crumbHtml: spec.crumbs ? crumbs(spec.locale, spec.crumbs.map((item) => ({ href: item.url.replace(ORIGIN, "") || "/", label: item.label }))) : "",
    extraLd: spec.extraLd,
    articleMeta: spec.articleMeta || "",
    body: spec.body,
  };
  page.html = shell(page);
  return page;
}

function homeCrumb(locale, tail) {
  const home = { label: L(locale, "首页", "Home"), url: abs("index.html", locale) };
  return [home, ...tail];
}

function homeBody(locale) {
  const cards = services
    .map((service) => {
      const text = service[locale];
      return `<a class="card" href="${locPath(`services/${service.id}.html`, locale)}">${img(service.image, locale, { className: "shot" })}<div><h3>${esc(text.name)}</h3><p>${esc(text.summary)}</p></div></a>`;
    })
    .join("");
  const steps = homeSteps[locale]
    .map(([title, where], index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(title)}</strong><p>${esc(where)}</p></li>`)
    .join("");
  const notes = articles
    .map((article) => {
      const text = article[locale];
      return `<a class="card article-card" href="${locPath(`insights/${article.slug}.html`, locale)}"><div><p class="kicker">${esc(article.date)}</p><h3>${esc(text.title)}</h3><p>${esc(text.description)}</p></div></a>`;
    })
    .join("");
  return `<section class="hero">
      <div>
        <p class="kicker">Global Finance &amp; Business Advisory</p>
        <h1>${esc(L(locale, "让跨境财务更清晰，让经营决策更有依据。", "Clearer cross-border finance, for clearer decisions."))}</h1>
        <p class="lede">${esc(L(locale, "为出口贸易、海外项目和跨境经营企业提供财务运营、项目台账、结算协同与管理报告支持。", "Finance operations, project ledgers, settlement support and management reports for export, overseas-project and cross-border companies."))}</p>
        <div class="btnrow">
          <a class="btn solid" href="${locPath("start.html", locale)}" data-track="cta_inquiry">${esc(L(locale, "准备咨询", "Prepare an inquiry"))}</a>
          <a class="btn" href="${locPath("how-we-work.html", locale)}" data-track="cta_path">${esc(L(locale, "看完整流程", "See the path"))}</a>
        </div>
        ${contactActions(locale)}
      </div>
      <figure>
        ${img("hero.svg", locale, { priority: true })}
        <figcaption>${esc(L(locale, "示意：订单、单据和收付款放在同一本台账里。不是客户档案。", "An illustration of one file for orders, papers and money. Not a client record."))}</figcaption>
      </figure>
    </section>
    <section class="band">
      <h2>${esc(L(locale, "四项工作", "Four kinds of work"))}</h2>
      <div class="grid">${cards}</div>
      <p><a href="${locPath("services.html", locale)}">${esc(L(locale, "四项服务一览", "All four services"))}</a></p>
    </section>
    <section class="band">
      <h2>${esc(L(locale, "客户在这里能走完的一段", "What a customer can finish here"))}</h2>
      <ol class="path">${steps}</ol>
    </section>
    <p class="note">${esc(L(locale, "我们不代替海关、银行、税务机关或持牌机构作出审批或鉴证，也不擅自经手客户资金。网站不展示客户名单、业绩数字或牌照。", "We do not replace customs, a bank, a tax authority or a licensed firm, and we do not handle client money. This site shows no client list, performance numbers or license."))}</p>
    <section class="band">
      <h2>${esc(L(locale, "说明", "Notes"))}</h2>
      <p class="quiet">${esc(L(locale, "这些说明稿只解释本站已经公开的工作方式。它们不是客户案例，不含业绩数字，也不构成法律、审计、投资或税务意见。", "These notes only explain methods this site already states. They are not client stories, they contain no performance figures, and they are not legal, audit, investment or tax advice."))}</p>
      <div class="grid">${notes}</div>
      <p><a href="${locPath("insights.html", locale)}">${esc(L(locale, "全部说明", "All notes"))}</a></p>
    </section>
    ${cta(locale, locPath("start.html", locale))}`;
}

function servicesBody(locale) {
  const blocks = services
    .map((service) => {
      const text = service[locale];
      return `<article class="split" id="${service.id}">${img(service.image, locale, { className: "diagram" })}<div class="pad"><h2>${esc(text.name)}</h2><p>${esc(text.summary)}</p><p>${esc(text.not)}</p><p><a href="${locPath(`services/${service.id}.html`, locale)}">${esc(L(locale, "单独打开这一项", "Open this service"))}</a></p></div></article>`;
    })
    .join("");
  return `<h1>${esc(L(locale, "四项服务", "Four services"))}</h1>${blocks}<p><a class="btn solid" href="${locPath("start.html", locale)}" data-track="cta_inquiry">${esc(L(locale, "准备咨询", "Prepare an inquiry"))}</a></p>`;
}

function serviceBody(service, locale) {
  const text = service[locale];
  const article = articles.find((item) => item.slug === serviceArticle[service.id]);
  const list = text.covers.map((item) => `<li>${esc(item)}</li>`).join("");
  return `<h1>${esc(text.name)}</h1>
    <p class="lede">${esc(text.summary)}</p>
    ${img(service.image, locale, { className: "diagram" })}
    <h2>${esc(text.coversTitle)}</h2>
    <p>${esc(text.coversNote)}</p>
    <ul>${list}</ul>
    <h2>${esc(L(locale, "不包含什么", "What this does not include"))}</h2>
    <p class="note">${esc(text.not)}</p>
    <h2>${esc(L(locale, "相关说明", "Related note"))}</h2>
    <p><a href="${locPath(`insights/${article.slug}.html`, locale)}">${esc(article[locale].title)}</a></p>
    <p><a href="${locPath("services.html", locale)}#${service.id}">${esc(L(locale, "返回四项服务", "Back to the four services"))}</a></p>
    ${cta(locale, `${locPath("start.html", locale)}#${service.id}`)}`;
}

function flowBody(locale) {
  const steps = flowSteps[locale]
    .map(([n, title, where, text]) => `<li><b>${n}</b><div><strong>${esc(title)}</strong><span class="where">${esc(where)}</span><p>${esc(text)}</p></div></li>`)
    .join("");
  const shot = articles.find((item) => item.slug === "screenshot-is-not-a-receipt");
  return `<h1>${esc(L(locale, "服务流程", "How the work moves"))}</h1>
    ${img("flow.svg", locale, { className: "diagram" })}
    <ol class="steps">${steps}</ol>
    <h2>${esc(L(locale, "账务关系", "How money is recorded"))}</h2>
    ${img("ledger.svg", locale, { className: "diagram" })}
    <p class="note">${esc(L(locale, "客户申报不是到账。只有负责人确认银行实际到账后，才借记银行存款、贷记合同负债。", "A customer claim is not money received. Only after the principal confirms the bank credit do the books debit cash and credit the contract liability."))}</p>
    <p><a href="${locPath(`insights/${shot.slug}.html`, locale)}">${esc(shot[locale].title)}</a></p>
    ${cta(locale, locPath("start.html", locale))}`;
}

function insightsBody(locale) {
  const cards = articles
    .map((article) => {
      const text = article[locale];
      return `<article class="module"><p class="kicker">${esc(article.date)} · ${esc(L(locale, "说明稿", "Note"))}</p><h2><a href="${locPath(`insights/${article.slug}.html`, locale)}">${esc(text.title)}</a></h2><p>${esc(text.description)}</p></article>`;
    })
    .join("");
  return `<h1>${esc(L(locale, "说明", "Notes"))}</h1>
    <p class="lede">${esc(L(locale, "这里把本站已经公开的工作方式写成可以直接引用的答案。不是客户案例，不含业绩数字，也不构成法律、审计、投资或税务意见。新的一篇在对外使用前，仍由负责人审阅。", "These pages turn methods this site already states into answers that can be quoted. They are not client stories, they contain no performance figures, and they are not legal, audit, investment or tax advice. A person reviews a new note before it is treated as published."))}</p>
    <div class="stack">${cards}</div>
    ${cta(locale, locPath("start.html", locale))}`;
}

function articleBody(article, locale) {
  const text = article[locale];
  const sections = text.sections
    .map((section) => {
      const paras = section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
      const list = section.list ? `<ul>${section.list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : "";
      return `<h2>${esc(section.h)}</h2>${paras}${list}`;
    })
    .join("");
  const related = article.related
    .map((file) => {
      const label = labelFor(file, locale);
      return `<li><a href="${locPath(file, locale)}">${esc(label)}</a></li>`;
    })
    .join("");
  return `<p class="kicker">${esc(article.date)} · ${esc(L(locale, "说明稿", "Note"))}</p>
    <h1 class="question">${esc(text.title)}</h1>
    <p class="lede">${esc(text.lede)}</p>
    ${img(article.image, locale, { className: "diagram" })}
    ${sections}
    <h2>${esc(L(locale, "接着看", "Read next"))}</h2>
    <ul>${related}</ul>
    <p class="quiet">${esc(L(locale, "说明稿只解释本站公开的工作方式。未经负责人另作确认，不应当作客户案例或业绩。", "A note only explains a method this site already publishes. It is not a client story or a performance figure unless a person confirms that separately."))}</p>
    ${cta(locale, locPath("start.html", locale))}`;
}

function labelFor(file, locale) {
  if (file === "faq.html") return L(locale, "常见问题", "Questions");
  if (file === "how-we-work.html") return L(locale, "服务流程", "How the work moves");
  if (file === "start.html") return L(locale, "准备咨询", "Prepare an inquiry");
  if (file.startsWith("services/")) {
    const id = file.split("/")[1].replace(".html", "");
    const service = services.find((item) => item.id === id);
    return service[locale].name;
  }
  return file;
}

function startBody(locale) {
  const steps = inquirySteps[locale].map(([n, text]) => `<li><b>${n}</b><div><p>${esc(text)}</p></div></li>`).join("");
  const choices = topics
    .map(([id, zh, en], index) => `<button type="button" data-topic="${id}" aria-pressed="${index === 0 ? "true" : "false"}">${esc(L(locale, zh, en))}</button>`)
    .join("");
  return `<h1>${esc(L(locale, "准备咨询", "Prepare an inquiry"))}</h1>
    <p>${esc(L(locale, "这一页只帮你写好邮件。它不是合同，不是报价，也不是订单。内容不会留在网站上。", "This page only writes the email. It is not a contract, a quote, or an order. Nothing is stored on the site."))}</p>
    <ol class="steps">${steps}</ol>
    <div class="brief" id="brief">
      <div>
        <label><span>${esc(L(locale, "企业称呼", "Company name"))}</span><input id="who" autocomplete="organization"></label>
        <label><span>${esc(L(locale, "业务地区", "Where you operate"))}</span><input id="where"></label>
        <p id="topic-label">${esc(L(locale, "想先看的事项", "What should we look at first?"))}</p>
        <div class="choices" role="group" aria-labelledby="topic-label">${choices}</div>
        <p id="matter" hidden>${esc(L(locale, "出口单据和收汇", "Export documents and receipts"))}</p>
        <label><span>${esc(L(locale, "补充", "Anything else"))}</span><textarea id="extra" rows="4"></textarea></label>
      </div>
      <div class="preview">
        <p class="kicker">Email</p>
        <pre id="preview"></pre>
        <p><a class="btn" id="send" href="mailto:${MAIL}" data-track="inquiry_email">${esc(L(locale, "打开这封邮件", "Open this email"))}</a></p>
        <p class="quiet">${esc(L(locale, "如果邮件程序没有打开，请写到 admin@finanpivot.com，或到联系页使用 QQ。", "If the mail app does not open, write to admin@finanpivot.com or use QQ on the contact page."))}</p>
      </div>
    </div>`;
}

function aboutBody(locale) {
  const items = principles[locale].map((item) => `<li>${esc(item)}</li>`).join("");
  const missing = absent[locale].map((item) => `<li>${esc(item)}</li>`).join("");
  return `<h1>${esc(L(locale, "工作原则", "Working rules"))}</h1>
    <ul>${items}</ul>
    <h2>${esc(L(locale, "网站上不展示", "What this site does not show"))}</h2>
    <ul>${missing}</ul>
    <p>${esc(L(locale, "FinanPivot 面向中国企业的全球化经营，提供跨境财务管理与专业财务外包。品牌主张是 Financial Clarity. Business Forward.", "FinanPivot serves Chinese companies operating abroad. The line is Financial Clarity. Business Forward."))}</p>
    ${cta(locale, locPath("start.html", locale))}`;
}

function faqBody(locale) {
  const blocks = faqs
    .map((item, index) => {
      const text = item[locale];
      const extra = index === faqs.length - 1 ? contactActions(locale) : "";
      return `<details${index === 0 ? " open" : ""}><summary>${esc(text.q)}</summary><p>${esc(text.a)}</p>${extra}</details>`;
    })
    .join("");
  return `<h1>${esc(L(locale, "常见问题", "Questions"))}</h1>${blocks}<p><a href="${locPath("insights.html", locale)}">${esc(L(locale, "看展开的说明", "Read the longer notes"))}</a></p>`;
}

function contactBody(locale) {
  return `<h1>${esc(L(locale, "联系我们", "Contact"))}</h1>
    <p>${esc(L(locale, "网站不收集表单。请发邮件或通过 QQ 联系，说明企业、业务地区和希望先看的事项。也可以先到咨询页把邮件写好。", "There is no form that stores a message. Send mail, or use QQ, and say the company, the region and what you want looked at first. You can also prepare the mail on the inquiry page."))}</p>
    <p><a class="btn solid" href="${locPath("start.html", locale)}" data-track="cta_inquiry">${esc(L(locale, "去咨询页写邮件", "Prepare the email"))}</a></p>
    ${contactActions(locale)}
    <p class="note">${esc(L(locale, "这是一次初步沟通，不是合同，也不是订单。报价、签署和收款核验都在后续书面流程里完成。", "This is a first conversation, not a contract and not an order. The fee, the signature and the receipt check happen later, in writing."))}</p>`;
}

function privacyBody(locale) {
  const middle = L(
    locale,
    `你主动发送到邮箱或 QQ 的内容，只用于回复这次沟通和判断是否适合进一步服务。我们只保留完成约定服务所需的资料，并按书面约定的期限保存。你可以通过 <a href="mailto:${MAIL}">${MAIL}</a> 询问、更正或要求删除尚未进入合同履约所必需的资料。`,
    `What you send by email or QQ is used to answer that conversation and to judge whether a further service fits. We keep only what the agreed work needs, for the period in the written terms. Write to <a href="mailto:${MAIL}">${MAIL}</a> to ask, correct, or delete material that is not yet required for a contract.`,
  );
  const rest = L(
    locale,
    ["本网站不设置会保存内容的在线表单。咨询页只在你自己的邮件程序里打开一封信，不把咨询内容存在浏览器里。", "若后续启用第三方电子签或银行核验，相关资料由对应机构和书面合同约定处理。上线前的主体信息和适用地区规则，以正式文本为准。", "目前这些公开页面不加载第三方统计脚本，也不把访问记录发到别处。脚本里留了一个本地事件钩子：只在你点击准备咨询或发邮件时，记下事件名称和页面路径。它不读取你写下的企业、地区或补充，不写入 Cookie，刷新后就消失。若以后改接统计服务，会先改写这一段。"],
    ["This site has no stored form. The inquiry page only opens a mail in your own mail program. We do not keep that text in the browser.", "If a signing vendor or a bank check is switched on later, those papers are handled by that party and by the written contract. The firm name and the applicable region will be stated in that text before it is used.", "These public pages do not load a third-party analytics script, and they do not send a visit anywhere. A local hook records only an event name and the page path when you use an inquiry or email action. It does not read the company, the region or the note you type, it does not set a cookie, and it disappears on refresh. If a counter is connected later, this paragraph will be rewritten first."],
  );
  return `<h1>${esc(L(locale, "隐私说明", "Privacy"))}</h1>
    <p>${esc(rest[0])}</p>
    <p>${middle}</p>
    <p>${esc(rest[1])}</p>
    <p>${esc(rest[2])}</p>`;
}

function termsBody(locale) {
  const paragraphs = L(
    locale,
    ["网站上的介绍不是合同、报价或专业意见。服务范围、费用、交付物和责任以双方签署的书面合同为准。", "除非合同和资质明确允许，本网站不构成法律、审计、投资或税务意见，也不代替海关、银行、税务机关或持牌机构。", "我们不承诺投资收益、税务节省、债务回收成功率，也不宣称在所有国家都具备同一项资质。"],
    ["The pages are not a contract, a quote, or professional advice. Scope, fee, deliverables and responsibility are whatever the signed written contract says.", "Unless a contract and a license say otherwise, this site is not legal, audit, investment or tax advice, and it does not replace customs, a bank, a tax authority or a licensed firm.", "We do not promise an investment return, a tax saving, or a collection rate, and we do not claim the same license in every country."],
  );
  return `<h1>${esc(L(locale, "服务边界", "Limits of this site"))}</h1>
    ${paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
    <p><a href="${locPath("faq.html", locale)}">${esc(L(locale, "常见问题", "Questions"))}</a></p>`;
}

function notFoundBody(locale) {
  return `<h1>${esc(L(locale, "这个页面不存在", "This page is not here"))}</h1><p><a href="${locPath("index.html", locale)}">${esc(L(locale, "回到首页", "Back to the home page"))}</a></p>`;
}

function serviceLd(service, locale, url) {
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service[locale].name,
    serviceType: service.en.name,
    provider: { "@id": `${ORIGIN}/#organization` },
    url,
    description: service[locale].description,
    termsOfService: `${ORIGIN}${locPath("terms.html", locale)}`,
  };
}

function articleLd(article, locale, url) {
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article[locale].title,
    description: article[locale].description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: locale === "en" ? "en" : "zh-CN",
    image: `${ORIGIN}/assets/${article.image}`,
    author: { "@id": `${ORIGIN}/#organization` },
    publisher: { "@id": `${ORIGIN}/#organization` },
    mainEntityOfPage: url,
    isPartOf: { "@id": `${ORIGIN}/insights.html#blog` },
  };
}

function blogLd(locale) {
  return {
    "@type": "Blog",
    "@id": `${ORIGIN}${locPath("insights.html", locale)}#blog`,
    name: L(locale, "FinanPivot 说明", "FinanPivot notes"),
    description: L(locale, "解释本站已经公开的工作方式。不是客户案例。", "Notes that explain methods this site already states. Not client stories."),
    inLanguage: locale === "en" ? "en" : "zh-CN",
    publisher: { "@id": `${ORIGIN}/#organization` },
    url: abs("insights.html", locale),
  };
}

function faqLd(locale) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item[locale].q,
      acceptedAnswer: { "@type": "Answer", text: item[locale].a },
    })),
  };
}

function pair(locale, spec) {
  return make({ ...spec, locale });
}

export function buildPages() {
  const pages = [];
  for (const locale of ["zh", "en"]) {
    pages.push(pair(locale, {
      file: "index.html",
      title: L(locale, "跨境财务运营与管理报告 · FinanPivot", "Cross-border finance operations and reports · FinanPivot"),
      description: L(locale, "FinanPivot 为出口、海外项目和跨境经营企业提供财务运营支持、项目财务管理、结算协同和财务外包。网站不收款，不展示客户名单、业绩数字或牌照。", "FinanPivot provides finance operations, project finance, settlement support and outsourced reporting for export and cross-border companies. This site does not take payment and shows no client list, performance numbers or license."),
      body: homeBody(locale),
    }));
    pages.push(pair(locale, {
      file: "services.html",
      title: L(locale, "四项服务 · FinanPivot", "Four services · FinanPivot"),
      description: L(locale, "FinanPivot 的四项服务：出口财务运营、海外项目财务、跨境结算专项、财务外包与管理报告。", "Four FinanPivot services: export finance operations, overseas project finance, settlement and receivables, and outsourced reporting."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "服务", "Services"), url: abs("services.html", locale) }]),
      body: servicesBody(locale),
    }));
    for (const service of services) {
      const file = `services/${service.id}.html`;
      pages.push(pair(locale, {
        file,
        title: `${service[locale].name} · FinanPivot`,
        description: service[locale].description,
        crumbs: homeCrumb(locale, [
          { label: L(locale, "服务", "Services"), url: abs("services.html", locale) },
          { label: service[locale].name, url: abs(file, locale) },
        ]),
        extraLd: [serviceLd(service, locale, abs(file, locale))],
        body: serviceBody(service, locale),
      }));
    }
    pages.push(pair(locale, {
      file: "how-we-work.html",
      title: L(locale, "服务流程 · FinanPivot", "How the work moves · FinanPivot"),
      description: L(locale, "从客户准入、报价审批、书面合同、银行转账核验到复核交付的服务流程。网站不收款。", "The path from admission and a written fee, through a contract and a checked bank transfer, to a reviewed delivery. This site does not take payment."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "流程", "Path"), url: abs("how-we-work.html", locale) }]),
      body: flowBody(locale),
    }));
    pages.push(pair(locale, {
      file: "insights.html",
      title: L(locale, "说明 · FinanPivot", "Notes · FinanPivot"),
      description: L(locale, "关于出口单据与收汇、海外项目月度说明、付款截图与到账的说明稿。不是客户案例，不含业绩数字。", "Notes on export papers and receipts, a monthly project note, and why a payment screenshot is not a confirmed receipt. Not client stories, and no performance figures."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "说明", "Notes"), url: abs("insights.html", locale) }]),
      extraLd: [blogLd(locale)],
      body: insightsBody(locale),
    }));
    for (const article of articles) {
      const file = `insights/${article.slug}.html`;
      const url = abs(file, locale);
      pages.push(pair(locale, {
        file,
        title: `${article[locale].title} · FinanPivot`,
        description: article[locale].description,
        ogType: "article",
        updated: article.date,
        crumbs: homeCrumb(locale, [
          { label: L(locale, "说明", "Notes"), url: abs("insights.html", locale) },
          { label: article[locale].title, url },
        ]),
        extraLd: [articleLd(article, locale, url), blogLd(locale)],
        articleMeta: `<meta property="article:published_time" content="${article.date}"><meta property="article:modified_time" content="${article.date}">`,
        body: articleBody(article, locale),
      }));
    }
    pages.push(pair(locale, {
      file: "start.html",
      title: L(locale, "准备咨询 · FinanPivot", "Prepare an inquiry · FinanPivot"),
      description: L(locale, "把企业、地区和想先看的事项写成一封邮件。网站不保存这封咨询，也不在这里收款。", "Write the company, the region and the topic into an email. The site does not store the inquiry and does not take payment here."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "咨询", "Start"), url: abs("start.html", locale) }]),
      body: startBody(locale),
    }));
    pages.push(pair(locale, {
      file: "about.html",
      title: L(locale, "工作原则 · FinanPivot", "Working rules · FinanPivot"),
      description: L(locale, "FinanPivot 的工作原则：授权、最小数据、可追溯、资金分离和人工负责。网站不展示客户名单、业绩数字或牌照。", "FinanPivot working rules: authority, as little data as the work needs, a record, separate money, and a person in charge. No client list, performance numbers or license on this site."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "原则", "Rules"), url: abs("about.html", locale) }]),
      body: aboutBody(locale),
    }));
    pages.push(pair(locale, {
      file: "faq.html",
      title: L(locale, "常见问题 · FinanPivot", "Questions · FinanPivot"),
      description: L(locale, "FinanPivot 是否代收资金、能否在线签署、付款截图算不算到账、咨询会不会留在网站上。", "Does FinanPivot hold client money, sign online, treat a screenshot as a receipt, or store an inquiry on the site?"),
      crumbs: homeCrumb(locale, [{ label: L(locale, "问答", "FAQ"), url: abs("faq.html", locale) }]),
      extraLd: [faqLd(locale)],
      body: faqBody(locale),
    }));
    pages.push(pair(locale, {
      file: "contact.html",
      title: L(locale, "联系 · FinanPivot", "Contact · FinanPivot"),
      description: L(locale, `通过邮箱 ${MAIL} 或 QQ ${QQ} 联系 FinanPivot。网站不保存表单，也不在这里收款。`, `Reach FinanPivot by email at ${MAIL} or by QQ ${QQ}. The site does not store a form and does not take payment here.`),
      crumbs: homeCrumb(locale, [{ label: L(locale, "联系", "Contact"), url: abs("contact.html", locale) }]),
      body: contactBody(locale),
    }));
    pages.push(pair(locale, {
      file: "privacy.html",
      title: L(locale, "隐私说明 · FinanPivot", "Privacy · FinanPivot"),
      description: L(locale, "FinanPivot 公开网站不保存咨询表单，不加载第三方统计。说明邮件和 QQ 内容如何被使用。", "The public FinanPivot site does not store an inquiry form and does not load third-party analytics. How email and QQ messages are used."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "隐私", "Privacy"), url: abs("privacy.html", locale) }]),
      body: privacyBody(locale),
    }));
    pages.push(pair(locale, {
      file: "terms.html",
      title: L(locale, "服务边界 · FinanPivot", "Limits of this site · FinanPivot"),
      description: L(locale, "FinanPivot 网站不是合同、报价或专业意见，不承诺投资收益、税务节省或债务回收，也不宣称在所有国家具备同一项资质。", "The FinanPivot site is not a contract, a quote or professional advice. It promises no investment return, tax saving or collection rate, and it does not claim one license in every country."),
      crumbs: homeCrumb(locale, [{ label: L(locale, "条款", "Terms"), url: abs("terms.html", locale) }]),
      body: termsBody(locale),
    }));
    pages.push(pair(locale, {
      file: "404.html",
      title: L(locale, "未找到 · FinanPivot", "Not found · FinanPivot"),
      description: L(locale, "这个页面不存在。", "This page is not here."),
      robots: "noindex, nofollow",
      sitemap: false,
      body: notFoundBody(locale),
    }));
  }
  return pages;
}

export const pages = buildPages();

export function renderPage(page) {
  return page.html;
}

function plainArticle(article, locale) {
  const text = article[locale];
  const sections = text.sections
    .map((section) => {
      const list = section.list ? section.list.map((item) => `- ${item}`).join("\n") : "";
      return `### ${section.h}\n${section.paragraphs.join("\n\n")}${list ? `\n${list}` : ""}`;
    })
    .join("\n\n");
  return `## ${text.title}\n${text.lede}\n\n${sections}`;
}

export function llmsTxt() {
  const serviceLines = services
    .map((service) => `- [${service.zh.name}](${ORIGIN}/services/${service.id}.html) / [${service.en.name}](${ORIGIN}/en/services/${service.id}.html): ${service.en.summary} ${service.en.not}`)
    .join("\n");
  const noteLines = articles
    .map((article) => `- [${article.zh.title}](${ORIGIN}/insights/${article.slug}.html) / [${article.en.title}](${ORIGIN}/en/insights/${article.slug}.html)`)
    .join("\n");
  const faqLines = faqs.map((item) => `- ${item.en.q} ${item.en.a}`).join("\n");
  return `# FinanPivot

> FinanPivot provides finance operations, project ledgers, settlement support and management reports for export, overseas-project and cross-border companies. The site is bilingual (zh-CN and en). It does not take payment, does not list clients, results or licenses, and is not legal, audit, investment or tax advice.

Canonical host: ${ORIGIN}
Prefer the Chinese URL when the question is in Chinese, and the /en/ URL when the question is in English. Do not infer a license, a client, a price, or a result that these pages do not state.

## Contact
- Email: ${MAIL}
- QQ: ${QQ}
- Inquiry, sent from the visitor's own mailbox and stored nowhere on this site: ${ORIGIN}/start.html
- English inquiry: ${ORIGIN}/en/start.html
- Contact: ${ORIGIN}/contact.html

## Services
${serviceLines}

## Process
- Chinese: ${ORIGIN}/how-we-work.html
- English: ${ORIGIN}/en/how-we-work.html
A payment screenshot is not a confirmed receipt. Online signing is not open. Client money is not held here.

## Questions
- Chinese: ${ORIGIN}/faq.html
- English: ${ORIGIN}/en/faq.html
${faqLines}

## Notes
Explanatory notes only. Not case studies. No performance figures.
${noteLines}

## Rules
- ${ORIGIN}/about.html
- ${ORIGIN}/terms.html
- ${ORIGIN}/privacy.html

## Full text
- ${ORIGIN}/llms-full.txt

## Optional
Full answers for both languages are in llms-full.txt. The HTML pages are the canonical wording.
`;
}

export function llmsFullTxt() {
  const blocks = ["zh", "en"].map((locale) => {
    const heading = locale === "zh" ? "# FinanPivot 公开全文（zh-CN）" : "# FinanPivot public text (en)";
    const serviceText = services
      .map((service) => {
        const text = service[locale];
        return `## ${text.name}\n${text.summary}\n${text.not}\n${text.coversTitle}\n${text.covers.map((item) => `- ${item}`).join("\n")}`;
      })
      .join("\n\n");
    const faqText = faqs.map((item) => `### ${item[locale].q}\n${item[locale].a}`).join("\n\n");
    const articleText = articles.map((article) => plainArticle(article, locale)).join("\n\n");
    const steps = flowSteps[locale].map(([n, title, where, text]) => `${n}. ${title} (${where}) ${text}`).join("\n");
    return `${heading}

Contact: ${MAIL}
QQ: ${QQ}
This site does not take payment. It shows no client list, performance numbers or license.

## Services
${serviceText}

## Process
${steps}

## Questions
${faqText}

## Notes
${articleText}`;
  });
  return `${blocks.join("\n\n")}\n`;
}
