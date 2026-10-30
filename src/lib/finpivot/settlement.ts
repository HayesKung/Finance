export const LIVE_ESIGN_CONTRACTED = false;

export function createProviderEnvelope() {
  if (!LIVE_ESIGN_CONTRACTED) {
    return { ok: false as const, reason: "未签约电子签服务商，不能创建正式签署。" };
  }
  return { ok: false as const, reason: "正式通道未接通。" };
}

export function sandboxEvidence(input: { ref: string; amountYuan: number; body: string }) {
  const material = `${input.ref}|${input.amountYuan}|${input.body}`;
  return {
    provider: "sandbox",
    legallyBinding: false,
    ref: input.ref,
    bytes: material.length,
  };
}

export function confirmBankReceipt(input: {
  role: "owner" | "support";
  claimIsCash: boolean;
  key: string;
  seen: Set<string>;
  amountYuan: number;
  expectedYuan: number;
}) {
  if (input.claimIsCash) return { ok: false as const, reason: "客户申报不是到账。" };
  if (input.role !== "owner") return { ok: false as const, reason: "只有负责人能确认到账。" };
  if (!Number.isInteger(input.amountYuan) || input.amountYuan <= 0 || input.amountYuan > input.expectedYuan) {
    return { ok: false as const, reason: "金额不符。" };
  }
  if (input.seen.has(input.key)) return { ok: true as const, duplicate: true, amountYuan: input.amountYuan };
  input.seen.add(input.key);
  return { ok: true as const, duplicate: false, amountYuan: input.amountYuan };
}
