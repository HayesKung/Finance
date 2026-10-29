import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canon, formatYuan, show } from "./glossary.ts";

describe("locale labels", () => {
  it("shows English for a stored Chinese stage and maps it back", () => {
    assert.equal(show("zh", "线索"), "线索");
    assert.equal(show("en", "线索"), "Lead");
    assert.equal(canon("Lead"), "线索");
    assert.equal(canon("线索"), "线索");
    assert.equal(canon("not a label"), "not a label");
  });

  it("keeps yuan in CNY when the screen is English", () => {
    assert.equal(formatYuan("en", 15000), "CNY 15,000");
    assert.match(formatYuan("zh", 15000), /15,000 元/);
  });

  it("translates a blocked status change without storing English", () => {
    assert.equal(show("en", "不能从草稿改到执行中。"), "Cannot move from Draft to In progress.");
  });
});
