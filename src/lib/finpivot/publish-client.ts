import type { Agreement } from "@/lib/finpivot/agreement";
import type { Firm } from "@/lib/finpivot/store";
import type { ContractPayload } from "@/lib/finpivot/contract-share";
import { tokenOk } from "@/lib/finpivot/contract-share";
import { publishContract } from "@/lib/finpivot/contract-api";

export function toPayload(input: {
  sheet: Agreement;
  firm: Firm;
  company: string;
  product: string;
  title: string;
  billing: string;
  amountYuan: number;
  dueLabel: string;
  dueYuan: number;
  deliverables: string[];
  receivedYuan: number;
}): ContractPayload {
  const firm = input.firm;
  const sheet = input.sheet;
  return {
    ref: sheet.ref,
    company: input.company,
    firmName: firm.legalName,
    product: input.product,
    title: input.title,
    billing: input.billing,
    amountYuan: input.amountYuan,
    dueLabel: input.dueLabel,
    dueYuan: input.dueYuan,
    deliverables: input.deliverables,
    payeeName: firm.payeeName,
    payeeBank: firm.payeeBank,
    payeeAccount: firm.payeeAccount,
    wechatId: firm.wechatId,
    alipayAccount: firm.alipayAccount,
    signedName: sheet.signedName ?? "",
    signedAt: sheet.signedAt ?? "",
    signedImage: sheet.signedImage ?? "",
    firmSigner: sheet.firmSigner ?? "",
    firmSignedAt: sheet.firmSignedAt ?? "",
    firmSignImage: sheet.firmSignImage ?? "",
    claimedMethod: sheet.claimedMethod ?? "",
    claimedAt: sheet.claimedAt ?? "",
    receivedYuan: input.receivedYuan,
  };
}

export async function pushSheet(input: {
  sheet: Agreement;
  firm: Firm;
  company: string;
  product: string;
  title: string;
  billing: string;
  amountYuan: number;
  dueLabel: string;
  dueYuan: number;
  deliverables: string[];
  receivedYuan: number;
}) {
  if (!tokenOk(input.sheet.customerToken ?? "") || !tokenOk(input.sheet.staffToken ?? "")) return false;
  await publishContract({
    data: {
      customerToken: input.sheet.customerToken,
      staffToken: input.sheet.staffToken,
      payload: toPayload(input),
    },
  });
  return true;
}
