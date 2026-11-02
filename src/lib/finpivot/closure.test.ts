import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { can } from "./access.ts";
import { admissionReady, reportSignoff, reviewReady, revisePrice, serviceAllowed } from "./flow.ts";
import { createProviderEnvelope } from "./settlement.ts";

describe("synthetic service loop", () => {
  it("keeps quote, signature, and delivery on the owner side of the rules", () => {
    assert.equal(serviceAllowed("出口财务包").ok, true);
    assert.equal(serviceAllowed("代理记账").ok, false);
    const admission = admissionReady({
      scope: "出口单据与收汇核对",
      ndaAt: "2026-10-30",
      conflictClear: true,
      authorizedAt: "2026-10-30",
    });
    assert.equal(admission.ok, true);
    assert.equal(can("support", "changePrice"), false);
    assert.equal(revisePrice({ status: "草稿", nextYuan: 2000, note: "范围已经写进报价单", received: 0 }).ok, true);
    assert.equal(createProviderEnvelope().ok, false);
    assert.equal(createProviderEnvelope().provider, "PROVIDER_PENDING");
    assert.equal(can("support", "confirmReceipt"), false);
    assert.equal(can("support", "refund"), false);
    assert.equal(can("support", "issueDelivery"), false);
    const review = reviewReady([{ done: true, preparer: "support", reviewer: "owner", reviewedAt: "2026-10-30" }]);
    assert.equal(review.ok, true);
    const report = reportSignoff({
      status: "已核验",
      preparer: "support",
      reviewer: "owner",
      counts: { orders: "1" },
    });
    assert.equal(report.ok, true);
  });
});
