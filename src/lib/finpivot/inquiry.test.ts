import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { acceptInquiryDraft, inquiryToLead, makeInquiryRef, needToProduct } from "./inquiry.ts";

describe("public inquiry", () => {
  it("builds a readable reference and does not invent a product when the visitor is unsure", () => {
    assert.equal(makeInquiryRef("20261029", "abcd-ef"), "INQ-20261029-ABCD");
    assert.equal(needToProduct("还不确定"), "未定");
    assert.equal(needToProduct("项目结算"), "结算与清欠专项");
    assert.equal(needToProduct("单证与退税"), "出口财务包");
  });

  it("turns one inquiry into a lead without copying it into a client", () => {
    const lead = inquiryToLead({
      ref: "INQ-20261029-ABCD",
      company: "华东门窗",
      contactName: "周某",
      contact: "zhou@example.com",
      market: "阿联酋",
      need: "单证与退税",
      currency: "USD",
      note: "信用证交单被拒过一次",
    });
    assert.equal(lead.stage, "线索");
    assert.equal(lead.source, "公开信息");
    assert.equal(lead.publicChannel, "对外页面");
    assert.equal(lead.product, "出口财务包");
    assert.equal(lead.consentPrivate, true);
    assert.equal(lead.privateContact, "zhou@example.com");
    assert.match(lead.note, /INQ-20261029-ABCD/);
    assert.match(lead.note, /USD/);
    assert.equal("clientId" in lead, false);
  });

  it("refuses a public inquiry that has no consent or an unknown need", () => {
    const row = {
      company: "华东门窗",
      contactName: "周某",
      contact: "zhou@example.com",
      market: "",
      need: "还不确定",
      currency: "usd",
      note: "",
      consent: true,
    };
    const saved = acceptInquiryDraft(row);
    assert.equal(saved.ok, true);
    if (saved.ok) assert.equal(saved.value.currency, "USD");
    assert.equal(acceptInquiryDraft({ ...row, consent: false }).ok, false);
    assert.equal(acceptInquiryDraft({ ...row, need: "代持股" }).ok, false);
  });
});
