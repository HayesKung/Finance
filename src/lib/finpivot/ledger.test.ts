import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { diffDesk } from "./ledger.ts";
import { applyReceipt, reviewReady, sopItems } from "./flow.ts";

const order = {
  id: "o1",
  status: "待收款" as const,
  billing: "按单" as const,
  amountYuan: 4000,
};

const lines = [
  { id: "p1", orderId: "o1", kind: "定金" as const, expectedYuan: 2000, receivedYuan: 2000 },
  { id: "p2", orderId: "o1", kind: "尾款" as const, expectedYuan: 2000, receivedYuan: 0 },
];

describe("server desk checks", () => {
  it("rejects execution before both signatures even if the deposit is paid", () => {
    const prev = { orders: [order], payments: lines, deliverables: [], agreements: [] };
    const next = {
      ...prev,
      orders: [{ ...order, status: "执行中" as const }],
      agreements: [{ orderId: "o1", signedAt: "2026-10-29T00:00:00.000Z" }],
    };
    assert.match(diffDesk(prev, next).reason, /确认书/);
  });

  it("rejects a receipt cut unless the reversal reason is written", () => {
    const prev = { orders: [order], payments: lines, deliverables: [] };
    const bare = { ...prev, payments: [{ ...lines[0], receivedYuan: 1500 }, lines[1]] };
    assert.match(diffDesk(prev, bare).reason, /冲正/);
    const noted = {
      ...prev,
      payments: [{ ...lines[0], receivedYuan: 1500, reversalReason: "回单金额写错，冲回五百" }, lines[1]],
    };
    assert.equal(diffDesk(prev, noted).ok, true);
    assert.equal(applyReceipt(2000, 2000).ok, true);
    assert.equal(applyReceipt(2000, 1000).ok, false);
  });

  it("rejects delivery when the same person prepares and reviews", () => {
    const items = [{ orderId: "o1", done: true, preparer: "海", reviewer: "海", reviewedAt: "2026-10-29T00:00:00.000Z" }];
    assert.equal(reviewReady(items).ok, false);
    const ready = [{ ...items[0], reviewer: "支撑" }];
    const sop = sopItems("出口财务包").map((id) => ({ id, done: true }));
    const running = { ...order, status: "执行中" as const, product: "出口财务包", sop };
    const prev = { orders: [running], payments: lines.map((line) => ({ ...line, receivedYuan: 2000 })), deliverables: ready };
    const next = { ...prev, orders: [{ ...running, status: "已交付" as const }], agreements: [{ orderId: "o1", signedAt: "a", firmSignedAt: "b" }] };
    assert.equal(diffDesk({ ...prev, deliverables: items }, { ...next, deliverables: items }).ok, false);
    assert.equal(diffDesk(prev, next).ok, true);
  });

  it("blocks start when the file is signed but the client has not authorized the scope", () => {
    const prev = { orders: [{ ...order, product: "出口财务包" }], payments: lines, deliverables: [], agreements: [] };
    const next = {
      ...prev,
      orders: [{ ...order, product: "出口财务包", status: "执行中" as const }],
      agreements: [{ orderId: "o1", signedAt: "a", firmSignedAt: "b" }],
    };
    assert.match(diffDesk(prev, next).reason, /授权|范围/);
  });
});
