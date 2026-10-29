import { PRODUCTS } from "./copy.ts";

export const PUBLIC_SITE_LAUNCHED = false;

export const INQUIRY_NEEDS = ["回款与结算", "单证与退税", "项目结算", "还不确定"] as const;
export type InquiryNeed = (typeof INQUIRY_NEEDS)[number];
export type InquiryStatus = "待处理" | "已转入名单" | "不跟进";

export type Inquiry = {
  id: string;
  ref: string;
  createdAt: string;
  locale: "zh" | "en";
  company: string;
  contactName: string;
  contact: string;
  market: string;
  need: InquiryNeed;
  currency: string;
  note: string;
  status: InquiryStatus;
  leadId: string;
};

export type InquiryLeadDraft = {
  alias: string;
  company: string;
  industry: string;
  direction: string;
  market: string;
  publicChannel: string;
  source: "公开信息";
  stage: "线索";
  product: (typeof PRODUCTS)[number];
  next: string;
  nextDate: string;
  note: string;
  consentPrivate: boolean;
  privateContact: string;
};

export function acceptInquiryDraft(input: {
  company: string;
  contactName: string;
  contact: string;
  market: string;
  need: string;
  currency: string;
  note: string;
  consent: boolean;
}) {
  const company = input.company.trim();
  const contactName = input.contactName.trim();
  const contact = input.contact.trim();
  const market = input.market.trim();
  const note = input.note.trim();
  const currency = input.currency.trim().toUpperCase();
  if (!input.consent || !company || !contactName || !contact) return { ok: false as const, reason: "公司、姓名、联系方式和确认都要填。" };
  if (!(INQUIRY_NEEDS as readonly string[]).includes(input.need)) return { ok: false as const, reason: "需求不正确" };
  if (company.length > 200 || contactName.length > 200 || contact.length > 200 || market.length > 200 || note.length > 2000 || currency.length > 12) {
    return { ok: false as const, reason: "需求不正确" };
  }
  return {
    ok: true as const,
    value: { company, contactName, contact, market, need: input.need as InquiryNeed, currency, note },
  };
}

export function makeInquiryRef(day: string, salt: string): string {
  const clean = salt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  return `INQ-${day}-${clean || "0000"}`;
}

export function needToProduct(need: InquiryNeed): (typeof PRODUCTS)[number] {
  if (need === "项目结算") return "结算与清欠专项";
  if (need === "还不确定") return "未定";
  return "出口财务包";
}

export function inquiryToLead(inq: Pick<Inquiry, "ref" | "company" | "contactName" | "contact" | "market" | "need" | "currency" | "note">): InquiryLeadDraft {
  const company = inq.company.trim();
  const contact = inq.contact.trim();
  const note = [inq.note.trim(), inq.currency.trim() ? `合同币种 ${inq.currency.trim()}` : "", `对外编号 ${inq.ref}`]
    .filter(Boolean)
    .join("。");
  return {
    alias: inq.contactName.trim() || company,
    company,
    industry: "",
    direction: inq.need,
    market: inq.market.trim(),
    publicChannel: "对外页面",
    source: "公开信息",
    stage: "线索",
    product: needToProduct(inq.need),
    next: `回复对外来询 ${inq.ref}`,
    nextDate: "",
    note,
    consentPrivate: contact.length > 0,
    privateContact: contact,
  };
}
