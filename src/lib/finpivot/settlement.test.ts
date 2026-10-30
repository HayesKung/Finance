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

  it("lets only the owner confirm a bank receipt once", () => {
    const seen = new Set<string>();
    const row = { role: "owner" as const, claimIsCash: false, key: "bank-1", seen, amountYuan: 500, expectedYuan: 500 };
    assert.equal(confirmBankReceipt({ ...row, claimIsCash: true }).ok, false);
    assert.equal(confirmBankReceipt({ ...row, role: "support" }).ok, false);
    const first = confirmBankReceipt(row);
    const second = confirmBankReceipt(row);
    assert.equal(first.ok && first.duplicate, false);
    assert.equal(second.ok && second.duplicate, true);
    assert.equal(seen.size, 1);
  });
});
