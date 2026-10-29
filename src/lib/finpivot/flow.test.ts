import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { admissionReady, applyReversal, buildPlan, canDeliver, canStart, gateMove, serviceAllowed, settled, sopItems, sopReady } from "./flow.ts";

describe("service fee gates", () => {
  it("splits a per-order fee into 50% deposit and the rest", () => {
    const plan = buildPlan("按单", 4000);
    assert.deepEqual(
      plan.map((l) => l.expectedYuan),
      [2000, 2000],
    );
    assert.equal(canStart("按单", plan).ok, false);
    plan[0].receivedYuan = 2000;
    assert.equal(canStart("按单", plan).ok, true);
    assert.equal(canDeliver(plan, true).ok, false);
    plan[1].receivedYuan = 2000;
    assert.equal(canDeliver(plan, true).ok, true);
    assert.equal(canDeliver(plan, false).ok, false);
  });

  it("blocks monthly work until the month is prepaid in full", () => {
    const plan = buildPlan("月度", 12000);
    assert.equal(plan.length, 1);
    assert.equal(plan[0].kind, "预收");
    assert.match(canStart("月度", plan).reason, /当月/);
    plan[0].receivedYuan = 11999;
    assert.equal(settled(plan[0]), false);
    plan[0].receivedYuan = 12000;
    assert.equal(gateMove("待收款", "执行中", "月度", plan, false).ok, true);
    assert.equal(gateMove("待收款", "执行中", "月度", plan, false, false).reason, "服务确认书还没双方签完，不能开工。");
    assert.equal(gateMove("执行中", "已交付", "月度", plan, false).reason.length > 0, true);
  });

  it("refuses to skip from draft into execution", () => {
    const plan = buildPlan("按单", 1500);
    plan[0].receivedYuan = 750;
    assert.equal(gateMove("草稿", "执行中", "按单", plan, true).ok, false);
  });

  it("rejects a zero fee", () => {
    const plan = buildPlan("按单", 0);
    assert.equal(canStart("按单", plan).ok, false);
  });

  it("stops licensed work and unsigned scope before execution", () => {
    const plan = buildPlan("按单", 4000);
    plan[0].receivedYuan = 2000;
    assert.match(serviceAllowed("代理记账").reason, /执业资质/);
    assert.equal(admissionReady(undefined).ok, false);
    assert.equal(gateMove("待收款", "执行中", "按单", plan, false, true, true, false, "出口财务包").ok, false);
    const checks = sopItems("出口财务包").map((id) => ({ id, done: true }));
    assert.equal(sopReady("出口财务包", checks).ok, true);
    assert.equal(sopReady("出口财务包", []).ok, false);
    assert.equal(applyReversal(2000, 1500, "短").ok, false);
    assert.equal(applyReversal(2000, 1500, "回单重复登记，冲回").ok, true);
  });
});
