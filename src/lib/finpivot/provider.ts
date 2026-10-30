import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const PROVIDER_PENDING = "PROVIDER_PENDING" as const;
export const REPLAY_WINDOW_MS = 5 * 60 * 1000;

export type SandboxState = "draft" | "sent" | "viewed" | "declined" | "voided" | "sandbox_completed";

const NEXT: Record<SandboxState, SandboxState[]> = {
  draft: ["sent", "voided"],
  sent: ["viewed", "declined", "voided"],
  viewed: ["sandbox_completed", "declined", "voided"],
  declined: [],
  voided: [],
  sandbox_completed: [],
};

export function providerPending(reason = "未签约电子签服务商，不能创建正式签署。") {
  return { ok: false as const, provider: PROVIDER_PENDING, legallyBinding: false, reason };
}

export function createSandboxEnvelope(ref: string) {
  return {
    ok: true as const,
    provider: PROVIDER_PENDING,
    legallyBinding: false,
    state: "draft" as const,
    ref,
  };
}

export function moveSandbox(state: SandboxState, next: SandboxState) {
  if (!NEXT[state].includes(next)) {
    return { ok: false as const, provider: PROVIDER_PENDING, legallyBinding: false, reason: "状态不能这样转移。" };
  }
  return { ok: true as const, provider: PROVIDER_PENDING, legallyBinding: false, state: next };
}

function signedHex(secret: string, timestamp: string, nonce: string, rawBody: string) {
  return createHmac("sha256", secret).update(`${timestamp}.${nonce}.${rawBody}`).digest("hex");
}

export function verifyWebhook(input: {
  secret: string | null;
  rawBody: string;
  signature: string | null;
  timestamp: string | null;
  nonce: string | null;
  now: number;
  seen: Set<string>;
}) {
  if (!input.secret) return providerPending("没有供应商凭据。");
  if (!input.signature || !input.timestamp || !input.nonce) return providerPending("签名材料不完整。");
  const stamp = Number(input.timestamp);
  if (!Number.isFinite(stamp) || Math.abs(input.now - stamp) > REPLAY_WINDOW_MS) {
    return providerPending("时间窗外，拒绝重放。");
  }
  if (input.seen.has(input.nonce)) return providerPending("随机数已用过。");
  const expected = signedHex(input.secret, input.timestamp, input.nonce, input.rawBody);
  const left = Buffer.from(input.signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return providerPending("签名不符。");
  input.seen.add(input.nonce);
  return {
    ok: true as const,
    provider: PROVIDER_PENDING,
    legallyBinding: false,
    reason: "sandbox 验签通过，不构成正式签署。",
  };
}

export function signWebhook(secret: string, timestamp: string, nonce: string, rawBody: string) {
  return signedHex(secret, timestamp, nonce, rawBody);
}

export function archiveEvidence(bytes: Buffer) {
  return {
    provider: PROVIDER_PENDING,
    legallyBinding: false,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}
