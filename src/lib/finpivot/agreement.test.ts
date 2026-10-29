import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { agreementPhase, makeAgreementRef } from "./agreement.ts";

describe("agreement", () => {
  it("builds a reference the customer can read back", () => {
    assert.equal(makeAgreementRef("20261029", "ab-cd"), "AGR-20261029-ABCD");
  });

  it("does not treat a customer claim as money received", () => {
    const sheet = { signedAt: "2026-10-29T00:00:00.000Z", claimedAt: "2026-10-29T01:00:00.000Z" };
    assert.equal(agreementPhase({ signedAt: "", claimedAt: "" }, false), "待客户确认");
    assert.equal(agreementPhase({ signedAt: sheet.signedAt, claimedAt: "" }, false), "待转账");
    assert.equal(agreementPhase(sheet, false), "待核对到账");
    assert.equal(agreementPhase(sheet, true), "预收已核对");
  });
});
