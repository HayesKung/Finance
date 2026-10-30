import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("public website artifact", () => {
  it("builds a static site without finance secrets", () => {
    const run = spawnSync(process.execPath, ["sites/www/build-www.mjs"], { encoding: "utf8" });
    assert.equal(run.status, 0, run.stderr);
    const page = readFileSync("dist/www/index.html", "utf8");
    assert.match(page, /让跨境财务更清晰/);
    assert.match(page, /admin@finanpivot.com/);
    assert.equal(page.includes("DATABASE_URL"), false);
    assert.equal(page.includes("<form"), false);
    const digest = readFileSync("dist/www/ARTIFACT_SHA256.txt", "utf8").trim();
    assert.equal(digest.length, 64);
  });
});
