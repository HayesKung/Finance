import { providerPending } from "./provider.ts";

export const LIVE_ESIGN_CONTRACTED = false;

export function createProviderEnvelope() {
  if (!LIVE_ESIGN_CONTRACTED) return providerPending();
  return providerPending("正式通道未接通。");
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

export function confirmBankReceipt() {
  return { ok: false as const, reason: "内存确认已停用。到账必须写入账务表。" };
}
