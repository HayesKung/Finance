import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { confirmBankReceipt, createProviderEnvelope, sandboxEvidence } from "./settlement.ts";

describe("settlement boundaries", () => {
  it("does not open a live e-sign provider", () => {
    assert.equal(createProviderEnvelope().ok, false);
    const evidence = sandboxEvidence({ ref: "C-1", amountYuan: 1000, body: "范围" });
    assert.equal(evidence.legallyBinding, false);
    assert.equal(evidence.provider, "sandbox");
  });

  it("does not treat an in-memory set as a bank receipt", () => {
    const refused = confirmBankReceipt();
    assert.equal(refused.ok, false);
    assert.match(refused.reason, /账务表/);
  });
});
