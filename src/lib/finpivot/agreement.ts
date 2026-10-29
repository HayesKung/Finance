export type Agreement = {
  id: string;
  ref: string;
  inquiryId: string;
  leadId: string;
  clientId: string;
  orderId: string;
  payeeName: string;
  payeeBank: string;
  payeeAccount: string;
  signedName: string;
  signedAt: string;
  claimedAt: string;
};

export type AgreementPhase = "待客户确认" | "待转账" | "待核对到账" | "预收已核对";

export function makeAgreementRef(day: string, salt: string): string {
  const clean = salt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  return `AGR-${day}-${clean || "0000"}`;
}

export function agreementPhase(sheet: Pick<Agreement, "signedAt" | "claimedAt">, prepaidSettled: boolean): AgreementPhase {
  if (prepaidSettled) return "预收已核对";
  if (sheet.claimedAt) return "待核对到账";
  if (sheet.signedAt) return "待转账";
  return "待客户确认";
}
