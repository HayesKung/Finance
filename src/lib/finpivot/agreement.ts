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
  firmSigner: string;
  firmSignedAt: string;
  claimedAt: string;
};

export type AgreementPhase = "待客户签署" | "待我方签署" | "待付款" | "待核对到账" | "预收已核对";

export type ContractInput = {
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
};

export function makeAgreementRef(day: string, salt: string): string {
  const clean = salt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  return `AGR-${day}-${clean || "0000"}`;
}

export function bothSigned(sheet: { signedAt?: string; firmSignedAt?: string }) {
  return Boolean(sheet.signedAt && sheet.firmSignedAt);
}

export function agreementPhase(
  sheet: { signedAt?: string; firmSignedAt?: string; claimedAt?: string },
  prepaidSettled: boolean,
): AgreementPhase {
  if (!sheet.signedAt) return "待客户签署";
  if (!sheet.firmSignedAt) return "待我方签署";
  if (prepaidSettled) return "预收已核对";
  if (sheet.claimedAt) return "待核对到账";
  return "待付款";
}

export function contractBody(input: ContractInput): string {
  const firm = input.firmName.trim() || "（乙方名称未填写）";
  const account = input.payeeAccount.trim()
    ? `${input.payeeName} / ${input.payeeBank} / ${input.payeeAccount}`
    : "待填写。填写前不要付款。";
  const scope = input.deliverables.length ? input.deliverables.map((item) => `· ${item}`).join("\n") : "· 交付范围待定";
  return [
    `服务确认书 ${input.ref}`,
    "",
    `甲方：${input.company.trim() || "（甲方未填写）"}`,
    `乙方：${firm}`,
    "",
    "一、事项",
    `${input.title}。服务：${input.product}。`,
    "",
    "二、交付",
    scope,
    "",
    "三、服务费",
    `人民币 ${input.amountYuan} 元。收费方式：${input.billing}。`,
    `开工前应付：${input.dueLabel} ${input.dueYuan} 元。其余在对应交付前结清。`,
    "服务费由甲方自行转账。乙方不代收甲方的项目回款。",
    "",
    "四、收款账户",
    account,
    "",
    "五、签署",
    "甲方先签，乙方再签。双方都签完才生效，之后才付款。",
    "本页只记下双方写下的名字和时间，不是电子认证服务机构的可靠电子签名。",
    "",
    "六、不做",
    "不代理记账。不承诺退税金额、融资或回款结果。",
  ].join("\n");
}
