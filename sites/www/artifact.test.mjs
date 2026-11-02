import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { ARTICLE_TEMPLATE, articles } from "./articles.mjs";

describe("public website artifact", () => {
  it("builds a static site without finance secrets", () => {
    const run = spawnSync(process.execPath, ["sites/www/build-www.mjs"], { encoding: "utf8" });
    assert.equal(run.status, 0, run.stderr);
    const page = readFileSync("dist/www/index.html", "utf8");
    const contact = readFileSync("dist/www/contact.html", "utf8");
    const manifest = readFileSync("dist/www/assets-manifest.json", "utf8");
    assert.match(page, /让跨境财务更清晰/);
    assert.match(page, /admin@finanpivot.com/);
    assert.match(page, /让经营决策更有依据/);
    assert.match(page, /订单、单据、应收与收款记录协同管理/);
    assert.match(contact, /class="contact-row"/);
    assert.match(contact, /https:\/\/wpa\.qq\.com\/msgrd\?v=3&uin=3942114211/);
    assert.match(contact, /data-desktop="tencent:\/\/message\/\?uin=3942114211/);
    assert.match(contact, /data-mobile="mqqwpa:\/\/im\/chat/);
    assert.match(contact, /class="qq-fallback" hidden/);
    assert.match(contact, /data-copy="3942114211"/);
    assert.equal(contact.includes("在电脑上打开"), false);
    assert.equal(contact.includes("在手机上打开"), false);
    assert.equal(contact.includes("<form"), false);
    assert.equal(page.includes("DATABASE_URL"), false);
    assert.equal(readFileSync("dist/www/faq.html", "utf8").includes("电子合同"), true);
    assert.equal(readFileSync("dist/www/404.html", "utf8").includes("这个页面不存在"), true);
    assert.match(readFileSync("dist/www/robots.txt", "utf8"), /Sitemap/);
    assert.match(readFileSync("dist/www/sitemap.xml", "utf8"), /finanpivot\.com/);
    assert.match(manifest, /"source": "original"/);
    assert.equal(manifest.includes("unsplash"), false);
    const digest = readFileSync("dist/www/ARTIFACT_SHA256.txt", "utf8").trim();
    assert.equal(digest.length, 64);
  });

  it("publishes crawlable bilingual pages, answers and notes", () => {
    assert.equal(articles.length, 3);
    assert.equal(articles.some((article) => article.slug === ARTICLE_TEMPLATE.slug), false);
    const page = readFileSync("dist/www/index.html", "utf8");
    const en = readFileSync("dist/www/en/index.html", "utf8");
    const faq = readFileSync("dist/www/faq.html", "utf8");
    const detail = readFileSync("dist/www/services/export.html", "utf8");
    const note = readFileSync("dist/www/insights/screenshot-is-not-a-receipt.html", "utf8");
    const sitemap = readFileSync("dist/www/sitemap.xml", "utf8");
    const llms = readFileSync("dist/www/llms.txt", "utf8");
    assert.match(page, /rel="canonical" href="https:\/\/finanpivot.com\/"/);
    assert.match(page, /hreflang="en" href="https:\/\/finanpivot.com\/en\/"/);
    assert.match(page, /hreflang="zh-CN"/);
    assert.match(page, /"@type":"Organization"/);
    assert.match(page, /"@type":"ProfessionalService"/);
    assert.equal(page.includes('"telephone"'), false);
    assert.equal(page.includes("aggregateRating"), false);
    assert.equal(page.includes("plausible.io"), false);
    assert.equal(page.includes("googletagmanager"), false);
    assert.match(page, /finanpivot\.track/);
    assert.match(en, /lang="en"/);
    assert.match(en, /Clearer cross-border finance/);
    assert.equal(en.includes("让跨境财务更清晰"), false);
    assert.match(en, /hreflang="zh-CN" href="https:\/\/finanpivot.com\/"/);
    assert.match(faq, /"@type":"FAQPage"/);
    assert.equal((detail.match(/<h1\b/g) || []).length, 1);
    assert.match(detail, /不代替报关、银行或税务审批/);
    assert.match(detail, /\/start\.html#export/);
    assert.match(detail, /"@type":"Service"/);
    assert.match(detail, /"@type":"BreadcrumbList"/);
    assert.match(note, /"@type":"BlogPosting"/);
    assert.equal(note.includes("成功率"), false);
    assert.match(note, /付款截图只是一项待核验的申报/);
    assert.match(readFileSync("dist/www/404.html", "utf8"), /noindex/);
    assert.match(readFileSync("dist/www/privacy.html", "utf8"), /不加载第三方统计/);
    assert.equal(readFileSync("dist/www/start.html", "utf8").includes("<form"), false);
    assert.match(llms, /admin@finanpivot.com/);
    assert.match(llms, /does not take payment/);
    assert.match(readFileSync("dist/www/llms-full.txt", "utf8"), /QQ 3942114211|QQ: 3942114211/);
    assert.equal(sitemap.includes("your-slug"), false);
    assert.match(sitemap, /insights\/export-papers-and-receipts\.html/);
    assert.match(sitemap, /xhtml:link/);
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert.equal(new Set(locs).size, locs.length);
    for (const loc of locs) {
      const path = loc.replace("https://finanpivot.com", "");
      const file = path === "/" ? "dist/www/index.html" : path === "/en/" ? "dist/www/en/index.html" : `dist/www${path}`;
      assert.equal(existsSync(file), true, file);
    }
    for (const file of ["dist/www/index.html", "dist/www/en/faq.html", "dist/www/insights/project-monthly-note.html", "dist/www/en/services/collect.html"]) {
      const html = readFileSync(file, "utf8");
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert.equal(blocks.length, 1, file);
      JSON.parse(blocks[0][1]);
      assert.equal((html.match(/<h1\b/g) || []).length, 1, file);
    }
  });
});
