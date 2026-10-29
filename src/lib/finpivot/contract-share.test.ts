import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contractDigest, customerView, mergeStaffSave, tokenOk, type ContractPayload } from "./contract-share.ts";

const base = {
  ref: "AGR-1",
  company: "甲",
  firmName: "乙",
  product: "出口财务包",
  title: "核对",
  billing: "按单",
  amountYuan: 1000,
  dueLabel: "定金 50%",
  dueYuan: 500,
  deliverables: ["退税资料包"],
  payeeName: "周某",
  payeeBank: "某银行",
  payeeAccount: "6222",
  wechatId: "wx",
  alipayAccount: "ali",
  signedName: "",
  signedAt: "",
  signedImage: "",
  firmSigner: "",
  firmSignedAt: "",
  firmSignImage: "",
  claimedMethod: "" as const,
  claimedAt: "",
  receivedYuan: 0,
} satisfies ContractPayload;

describe("contract link", () => {
  it("rejects a short token", () => {
    assert.equal(tokenOk("abc"), false);
    assert.equal(tokenOk("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"), true);
  });

  it("hides accounts until both sides have signed", () => {
    const hidden = customerView(base);
    assert.equal(hidden.wechatId, "");
    assert.equal(hidden.payeeAccount, "");
    const open = customerView({ ...base, signedAt: "t", firmSignedAt: "t2" });
    assert.equal(open.wechatId, "wx");
  });

  it("does not let a staff save wipe a signature or the signed terms", async () => {
    const existing = { ...base, signedName: "吴某", signedAt: "t", signedImage: "data:image/png;base64,abc", signedContentHash: await contractDigest(base) };
    const incoming = { ...base, firmName: "新名称", amountYuan: 1, firmSigner: "周某", firmSignedAt: "t2", firmSignImage: "data:image/png;base64,firm" };
    const merged = mergeStaffSave(existing, incoming);
    assert.equal(merged.signedName, "吴某");
    assert.equal(merged.firmName, "乙");
    assert.equal(merged.amountYuan, 1000);
    assert.equal(merged.firmSigner, "周某");
    assert.equal(merged.signedContentHash, await contractDigest(merged));
  });
});
