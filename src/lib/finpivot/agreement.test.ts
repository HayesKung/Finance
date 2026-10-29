import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { agreementPhase, bothSigned, contractBody, makeAgreementRef, methodReady } from "./agreement.ts";

describe("service confirmation", () => {
  it("builds a reference the customer can read back", () => {
    assert.equal(makeAgreementRef("20261029", "ab-cd"), "AGR-20261029-ABCD");
  });

  it("requires both signatures before payment, and a claim is not a receipt", () => {
    assert.equal(agreementPhase({}, false), "待客户签署");
    assert.equal(agreementPhase({ signedAt: "t" }, false), "待我方签署");
    assert.equal(bothSigned({ signedAt: "t" }), false);
    assert.equal(bothSigned({ signedAt: "t", firmSignedAt: "t2" }), true);
    assert.equal(agreementPhase({ signedAt: "t", firmSignedAt: "t2" }, false), "待付款");
    assert.equal(agreementPhase({ signedAt: "t", firmSignedAt: "t2", claimedAt: "t3" }, false), "待核对到账");
    assert.equal(agreementPhase({ signedAt: "t", firmSignedAt: "t2", claimedAt: "t3" }, true), "预收已核对");
  });

  it("writes the fee and says this is not a certified electronic signature", () => {
    const text = contractBody({
      ref: "AGR-20261029-ABCD",
      company: "岭南门窗",
      firmName: "",
      product: "出口财务包",
      title: "退税资料",
      billing: "按单",
      amountYuan: 4000,
      dueLabel: "定金 50%",
      dueYuan: 2000,
      deliverables: ["退税资料包"],
      payeeName: "",
      payeeBank: "",
      payeeAccount: "",
      wechatId: "",
      alipayAccount: "",
    });
    assert.match(text, /人民币 4000 元/);
    assert.match(text, /定金 50% 2000 元/);
    assert.match(text, /不是电子认证服务机构的可靠电子签名/);
    assert.match(text, /乙方名称未填写/);
    assert.match(text, /填写前不要付款/);
  });

  it("only offers a channel that has an account", () => {
    assert.equal(methodReady({ wechatId: "wx-desk" }, "微信"), true);
    assert.equal(methodReady({ wechatId: "wx-desk" }, "支付宝"), false);
    assert.equal(methodReady({ payeeAccount: "6222" }, "银行转账"), true);
    const text = contractBody({
      ref: "AGR-1",
      company: "甲",
      firmName: "乙",
      product: "出口财务包",
      title: "核对",
      billing: "按单",
      amountYuan: 1000,
      dueLabel: "定金 50%",
      dueYuan: 500,
      deliverables: [],
      payeeName: "",
      payeeBank: "",
      payeeAccount: "",
      wechatId: "wx-desk",
      alipayAccount: "",
    });
    assert.match(text, /微信：wx-desk/);
    assert.doesNotMatch(text, /支付宝：/);
  });
});
