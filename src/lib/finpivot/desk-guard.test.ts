import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { diffSensitive } from "./desk-guard.ts";

const prev = JSON.stringify({
  clients: [{ id: "c1", privateContact: "a@example.com" }],
  firm: { payeeName: "甲", payeeBank: "银行", payeeAccount: "100" },
  orders: [{ id: "o1", clientId: "c1", status: "执行中" }],
  payments: [],
});

describe("desk authority", () => {
  it("lets only the owner change a private contact or a collection account", () => {
    const contact = JSON.stringify({
      clients: [{ id: "c1", privateContact: "b@example.com" }],
      firm: { payeeName: "甲", payeeBank: "银行", payeeAccount: "100" },
      orders: [{ id: "o1", clientId: "c1", status: "执行中" }],
      payments: [],
    });
    assert.match(diffSensitive(prev, contact, "support").reason, /私人/);
    assert.equal(diffSensitive(prev, contact, "owner").ok, true);
    const account = JSON.stringify({
      clients: [{ id: "c1", privateContact: "a@example.com" }],
      firm: { payeeName: "甲", payeeBank: "银行", payeeAccount: "200" },
      orders: [{ id: "o1", clientId: "c1", status: "执行中" }],
      payments: [],
    });
    assert.match(diffSensitive(prev, account, "support").reason, /收款账户/);
  });

  it("refuses to drop a client who still has an open order", () => {
    const dropped = JSON.stringify({
      clients: [],
      firm: { payeeName: "甲", payeeBank: "银行", payeeAccount: "100" },
      orders: [{ id: "o1", clientId: "c1", status: "执行中" }],
      payments: [],
    });
    assert.match(diffSensitive(prev, dropped, "owner").reason, /未收尾/);
  });
});
