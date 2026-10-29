import { bothSigned, type PayMethod } from "./agreement.ts";

export type ContractPayload = {
  ref: string;
  company: string;
  firmName: string;
  product: string;
  title: string;
  billing: string;
  amountYuan: number;
  dueLabel: string;
  dueYuan: number;
  deliverables: string[];
  payeeName: string;
  payeeBank: string;
  payeeAccount: string;
  wechatId: string;
  alipayAccount: string;
  signedName: string;
  signedAt: string;
  signedImage: string;
  firmSigner: string;
  firmSignedAt: string;
  firmSignImage: string;
  claimedMethod: "" | PayMethod;
  claimedAt: string;
  receivedYuan: number;
  signedContentHash?: string;
};

const COMMERCIAL = [
  "ref",
  "company",
  "firmName",
  "product",
  "title",
  "billing",
  "amountYuan",
  "dueLabel",
  "dueYuan",
  "deliverables",
  "payeeName",
  "payeeBank",
  "payeeAccount",
  "wechatId",
  "alipayAccount",
] as const;

export async function contractDigest(payload: ContractPayload) {
  const body: Record<string, unknown> = {};
  for (const key of COMMERCIAL) body[key] = payload[key];
  const bytes = new TextEncoder().encode(JSON.stringify(body));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((part) => part.toString(16).padStart(2, "0")).join("");
}

export function tokenOk(token: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
}

export function customerView(payload: ContractPayload): ContractPayload {
  if (bothSigned(payload)) return payload;
  return {
    ...payload,
    payeeName: "",
    payeeBank: "",
    payeeAccount: "",
    wechatId: "",
    alipayAccount: "",
  };
}

export function mergeStaffSave(existing: ContractPayload | null, incoming: ContractPayload): ContractPayload {
  if (!existing) return incoming;
  const frozen = Boolean(existing.signedAt || existing.firmSignedAt);
  const commercial = frozen ? existing : incoming;
  return {
    ...commercial,
    signedName: existing.signedAt ? existing.signedName : incoming.signedName,
    signedAt: existing.signedAt || incoming.signedAt,
    signedImage: existing.signedAt ? existing.signedImage : incoming.signedImage,
    firmSigner: existing.firmSignedAt ? existing.firmSigner : incoming.firmSigner,
    firmSignedAt: existing.firmSignedAt || incoming.firmSignedAt,
    firmSignImage: existing.firmSignedAt ? existing.firmSignImage : incoming.firmSignImage,
    claimedMethod: existing.claimedAt ? existing.claimedMethod : incoming.claimedMethod,
    claimedAt: existing.claimedAt || incoming.claimedAt,
    receivedYuan: Math.max(existing.receivedYuan, incoming.receivedYuan),
    signedContentHash: existing.signedContentHash || incoming.signedContentHash,
  };
}
