import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { analytics } from "./analytics-config.mjs";
import { assetAltEn } from "./copy.mjs";
import { illustrations } from "./illustrations.mjs";
import { assetAlt, llmsFullTxt, llmsTxt, pages } from "./markup.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "..", "..", "dist", "www");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file, acc);
    else acc.push(file);
  }
  return acc;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

if (analytics.enabled) {
  const privacy = pages.find((page) => page.out === "privacy.html");
  if (!privacy || privacy.html.includes("不加载第三方统计")) {
    throw new Error("Privacy page still says third-party analytics is off. Rewrite that paragraph before enabling analytics.");
  }
  if (analytics.provider !== "plausible" || !String(analytics.siteId).trim()) {
    throw new Error("Set analytics provider to plausible and a siteId, or leave analytics disabled.");
  }
}

const titles = new Set();
for (const page of pages) {
  const key = `${page.locale}:${page.title}`;
  if (titles.has(key)) throw new Error(`duplicate title ${key}`);
  titles.add(key);
  const h1 = page.html.match(/<h1\b/g) || [];
  if (h1.length !== 1) throw new Error(`${page.out} has ${h1.length} h1`);
  if (!page.html.includes('rel="canonical"')) throw new Error(`canonical missing ${page.out}`);
  if (page.sitemap) {
    for (const needle of ['hreflang="zh-CN"', 'hreflang="en"', 'hreflang="x-default"', "application/ld+json"]) {
      if (!page.html.includes(needle)) throw new Error(`${page.out} missing ${needle}`);
    }
  }
  if (page.html.includes("<form")) throw new Error(`stored form in ${page.out}`);
  if (page.out.includes("insights/") && (/\d+\s*%/.test(page.html) || page.html.includes("成功率") || page.html.includes("客户包括"))) {
    throw new Error(`unsupported claim in ${page.out}`);
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(root, "assets"), join(out, "assets"), { recursive: true });
for (const locale of ["zh", "en"]) {
  const dir = locale === "en" ? join(out, "assets", "en") : join(out, "assets");
  mkdirSync(dir, { recursive: true });
  for (const [name, svg] of Object.entries(illustrations(locale))) {
    writeFileSync(join(dir, name), svg);
  }
}
cpSync(join(root, "assets", "favicon.svg"), join(out, "favicon.svg"));
writeFileSync(join(out, "styles.css"), readFileSync(join(root, "site.css")));
writeFileSync(join(out, "site.js"), readFileSync(join(root, "site.js")));
writeFileSync(join(out, "llms.txt"), llmsTxt());
writeFileSync(join(out, "llms-full.txt"), llmsFullTxt());
for (const page of pages) {
  const dest = join(out, page.out);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, page.html);
}

const urls = pages
  .filter((page) => page.sitemap)
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.updated}</lastmod>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${page.zhUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${page.enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${page.zhUrl}"/>
  </url>`,
  );
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
);
writeFileSync(
  join(out, "robots.txt"),
  "User-agent: *\nAllow: /\n\n# Machine-readable summary: https://finanpivot.com/llms.txt\nSitemap: https://finanpivot.com/sitemap.xml\n",
);

const manifest = {
  generatedFor: "finanpivot.com",
  assets: walk(join(out, "assets"))
    .concat([join(out, "favicon.svg")])
    .map((file) => {
      const name = file.split(/[/\\]/).pop();
      const english = file.includes(`${join("assets", "en")}`) || name.startsWith("og.en");
      const alt = (english ? assetAltEn[name] : assetAlt[name]) || assetAlt[name] || "";
      return {
        path: relative(out, file).replaceAll("\\", "/"),
        source: "original",
        license: "Original illustration created for finanpivot.com. No third-party photograph or customer image.",
        sha256: sha256(file),
        alt,
      };
    }),
};
writeFileSync(join(out, "assets-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const forbidden = [
  "DATABASE_URL",
  "FINANCE_SESSION_SECRET",
  "FINANCE_DATA_KEY",
  "FINANCE_OWNER_PASSWORD",
  "BEGIN PRIVATE KEY",
  "fin_staff",
  "1500–4000",
  "12000–30000",
  "小ke",
  "unsplash",
];
for (const file of walk(out)) {
  if (!/\.(html|js|css|svg|txt|xml)$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const word of forbidden) {
    if (text.includes(word)) throw new Error(`forbidden token ${word} in ${file}`);
  }
}
const hash = createHash("sha256");
for (const file of walk(out).filter((file) => !file.endsWith("ARTIFACT_SHA256.txt")).sort()) {
  hash.update(relative(out, file).replaceAll("\\", "/"));
  hash.update(readFileSync(file));
}
const digest = hash.digest("hex");
writeFileSync(join(out, "ARTIFACT_SHA256.txt"), `${digest}\n`);
console.log(digest);
