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
};

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
  return {
    ...incoming,
    signedName: incoming.signedAt ? incoming.signedName : existing.signedName,
    signedAt: incoming.signedAt || existing.signedAt,
    signedImage: incoming.signedAt ? incoming.signedImage : existing.signedImage,
    firmSigner: incoming.firmSignedAt ? incoming.firmSigner : existing.firmSigner,
    firmSignedAt: incoming.firmSignedAt || existing.firmSignedAt,
    firmSignImage: incoming.firmSignedAt ? incoming.firmSignImage : existing.firmSignImage,
    claimedMethod: incoming.claimedAt ? incoming.claimedMethod : existing.claimedMethod,
    claimedAt: incoming.claimedAt || existing.claimedAt,
    receivedYuan: Math.max(existing.receivedYuan, incoming.receivedYuan),
  };
}
