import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { admissionReady, applyReversal, booksBalance, buildPlan, canDeliver, canForget, canStart, diagnosisReady, evidenceFunnel, gateMove, handoffReady, monthCloseReady, qualifyReady, reconcileSnapshot, reportSignoff, revisePrice, serviceAllowed, settled, sopItems, sopReady } from "./flow.ts";

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
    assert.equal(qualifyReady({ fit: "不适合", reason: "没有出口业务", at: "2026-10-29T00:00:00.000Z" }).ok, false);
    assert.equal(qualifyReady({ fit: "适合", reason: "有在执行的出口合同", at: "2026-10-29T00:00:00.000Z" }).ok, true);
    assert.equal(handoffReady({ version: "v1", customerConfirmedAt: "", closeoutNote: "已经对过账" }).ok, false);
    const funnel = evidenceFunnel({
      leads: [{ qualification: { fit: "适合", reason: "有在执行的出口合同", at: "2026-10-29" } }, {}],
      clients: [{ leadId: "l1" }, {}],
      orders: [{ status: "已交付" }, { status: "已交付", handoff: { version: "v1", customerConfirmedAt: "2026-10-29", closeoutNote: "款项与交付物已对上" } }],
    });
    assert.deepEqual(funnel, { judged: 1, fit: 1, filed: 1, delivered: 1 });
    assert.equal(diagnosisReady("合同和物流对不上").ok, true);
    assert.equal(diagnosisReady("太短").ok, false);
    assert.match(revisePrice({ status: "执行中", nextYuan: 3000, note: "客户要求改范围", received: 0 }).reason, /不能直接改价/);
    assert.equal(revisePrice({ status: "待收款", nextYuan: 3000, note: "诊断后缩小了范围", received: 0 }).amountYuan, 3000);
    assert.equal(reportSignoff({ status: "已核验", preparer: "海", reviewer: "海", counts: { added: "1" } }).ok, false);
    assert.equal(reportSignoff({ status: "已核验", preparer: "海", reviewer: "支撑", counts: { added: "1", invited: "0" } }).ok, true);
    assert.equal(reportSignoff({ status: "已核验", preparer: "海", reviewer: "支撑", counts: { added: "约1" } }).ok, false);
    const shot = { orders: 2, payments: 4, receivedYuan: 8000, contracts: 2 };
    assert.equal(reconcileSnapshot(shot, shot).ok, true);
    assert.match(reconcileSnapshot(shot, { ...shot, receivedYuan: 7000 }).reason, /receivedYuan/);
    assert.equal(booksBalance(4000, "待收款", [{ expectedYuan: 2000 }, { expectedYuan: 2000 }]).ok, true);
    assert.equal(booksBalance(4000, "待收款", [{ expectedYuan: 2000 }]).ok, false);
    assert.equal(canForget([{ id: "o", clientId: "c", status: "执行中" }], [], "c").ok, false);
    assert.equal(canForget([{ id: "o", clientId: "c", status: "已交付" }], [{ orderId: "o", expectedYuan: 100, receivedYuan: 100 }], "c").ok, true);
    assert.equal(monthCloseReady([{ status: "草稿" }, { status: "已交付" }]).ok, true);
    assert.match(monthCloseReady([{ status: "待收款" }]).reason, /月结/);
  });
});
