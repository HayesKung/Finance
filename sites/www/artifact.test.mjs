import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

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
});
