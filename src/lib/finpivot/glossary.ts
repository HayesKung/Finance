export type Locale = "zh" | "en";

export const CURRENCIES = [
  "CNY",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "ZAR",
  "NGN",
  "KES",
  "IDR",
  "VND",
  "MYR",
  "SGD",
  "THB",
  "JPY",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export function knownCurrency(code: string | undefined): Currency | "" {
  if (code && (CURRENCIES as readonly string[]).includes(code)) return code as Currency;
  return "";
}

/** 只认 ISO 代码。两种币不同只说明需要记账汇率，不自己猜。 */
export function currencyLine(quote: string | undefined, settle: string | undefined) {
  const q = knownCurrency(quote);
  const s = knownCurrency(settle);
  return { quote: q, settle: s, differs: Boolean(q && s && q !== s) };
}

const ZERO_DECIMALS = new Set(["JPY", "VND", "IDR"]);

/** 结算金额 = 报价金额 × 记账汇率。汇率不是预测，调用方必须自己传入。 */
export function convertAtRate(amount: number, rate: number): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return amount * rate;
}

export function formatMoney(locale: Locale, currency: string, amount: number): string {
  const digits = ZERO_DECIMALS.has(currency) ? 0 : 2;
  const tag = locale === "en" ? "en-US" : "zh-CN";
  try {
    return new Intl.NumberFormat(tag, {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(digits)}`;
  }
}

/** 存进浏览器的仍是中文原词。英文只在显示时替换，导回时再认回原词。 */
const EN: Record<string, string> = {
  线索: "Lead",
  已约诊断: "Diagnosis booked",
  已出风险清单: "Risk list issued",
  已报价: "Quoted",
  已签约: "Signed",
  已交付: "Delivered",
  老关系: "Existing relationship",
  合作方推荐: "Partner referral",
  公开信息: "Public information",
  未定: "Undecided",
  出口财务包: "Export finance pack",
  海外项目财务托管: "Overseas project retainer",
  结算与清欠专项: "Settlement and collections",
  回款: "Collections",
  成本: "Cost",
  合规: "Compliance",
  未回复: "No reply",
  已约到: "Booked",
  拒绝: "Declined",
  改期: "Rescheduled",
  不合适: "Not a fit",
  转介绍: "Referral",
  内容来询: "Inbound from content",
  潜在: "Prospect",
  诊断中: "In diagnosis",
  方案中: "Proposal",
  在服: "Active",
  暂停: "Paused",
  结束: "Closed",
  立项: "Opened",
  进行: "Under way",
  结项: "Closed out",
  按单: "Per shipment",
  月度: "Monthly",
  阶段: "Milestone",
  草稿: "Draft",
  待收款: "Awaiting payment",
  执行中: "In progress",
  待尾款: "Balance due",
  已取消: "Cancelled",
  定金: "Deposit",
  预收: "Prepayment",
  阶段费: "Milestone fee",
  尾款: "Balance",
  "定金 50%": "Deposit 50%",
  "尾款，交付前结清": "Balance, due before delivery",
  当月预收: "This month, prepaid",
  首段费用: "First milestone",
  后续阶段费: "Later milestones",
  项目预算表: "Project budget",
  资金计划: "Cash plan",
  进度结算跟踪: "Progress-billing tracker",
  月度财务包: "Monthly finance pack",
  回款预警: "Collections warning",
  "合同、签证、结算单、发票、付款记录对齐": "Contract, variations, statements, invoices and payments aligned",
  可谈判结算口径: "Negotiable settlement basis",
  单据核对清单: "Document checklist",
  收汇核对表: "Receipt reconciliation",
  退税资料包: "Rebate file",
  汇率风险提示: "FX risk notes",
  交付范围待定: "Scope not set",
  "还没有收款计划。": "There is no collection plan yet.",
  "月度服务要先收当月费用，才能开工。": "Monthly work starts only after this month is prepaid.",
  "首段费用未收齐，不能开工。": "The first milestone is not paid, so work cannot start.",
  "定金未收齐（50%），不能开工。": "The 50% deposit is not paid, so work cannot start.",
  "交付物还没勾完，不能标已交付。": "Deliverables are not all checked, so this cannot be marked delivered.",
  "还有款项未结清，不能标已交付。": "A balance is still open, so this cannot be marked delivered.",
  "先生成收款计划。": "Issue a collection plan first.",
  "金额要大于 0。不接受先做后看。": "The fee must be greater than 0. Work before payment is not accepted.",
  付费方案才给完整做法: "The full method stays in the paid proposal",
  全部: "All",
  待小m核验: "Waiting for 小m",
  已核验: "Checked",
  "2026-10-28 至 2026-11-04": "2026-10-28 to 2026-11-04",
  回款与结算: "Collections and settlement",
  单证与退税: "Documents and rebate files",
  项目结算: "Project settlement",
  还不确定: "Not sure yet",
  对外页面: "Public page",
  待处理: "Waiting",
  已转入名单: "Moved to the lead list",
  不跟进: "Not followed up",
  待客户签署: "Waiting for the customer to sign",
  待我方签署: "Waiting for us to sign",
  待付款: "Waiting for payment",
  待转账: "Waiting for the transfer",
  待核对到账: "Transfer claimed, not checked",
  预收已核对: "Prepayment checked",
  微信: "WeChat",
  支付宝: "Alipay",
  银行转账: "Bank transfer",
  "交付前要有编制人和另一名复核人。": "A preparer and a different reviewer are required before delivery.",
  "实收不能直接改小。冲正要单独记录原因。": "A recorded receipt cannot be reduced directly. A reversal needs its own reason.",
  "没有已勾选的交付物。": "No deliverable has been checked.",
  "这项涉及执业资质，本所不能直接开工。": "This needs a licence this desk does not have.",
  "服务范围未定，不能开工。": "The service scope is not set.",
  "还没有写清服务范围和边界。": "The scope and limits are not written.",
  "还没有客户授权和服务边界。": "Client authorization and scope are missing.",
  "保密还没有记下。": "Confidentiality has not been noted.",
  "利益冲突还没有核对。": "The conflict check is missing.",
  "客户授权还没有记下。": "Client authorization has not been noted.",
  "工作底稿还没勾完。": "The workpaper is not complete.",
  "没有这条服务的底稿。": "This service has no workpaper.",
  "冲正要写明原因。": "A reversal needs a written reason.",
  "冲正金额不正确。": "The reversal amount is not valid.",
  "还没有资格判断。": "There is no qualification decision.",
  "资格判断要写明原因。": "The qualification decision needs a reason.",
  "判断为不适合，不能建档。": "Marked not a fit, so no client file.",
  "交付包还没有版本号。": "The delivery pack has no version.",
  "客户还没有确认这一版交付。": "The client has not confirmed this delivery version.",
  "收尾对账还没写。": "The close-out reconciliation is not written.",
  "交付版本、客户确认或收尾对账还不齐。": "Delivery version, client confirmation, or close-out is missing.",
  "实收增加要记下回单号。": "A receipt increase needs the voucher number.",
  "还没有诊断出的风险要点。": "The diagnosis has no risk point yet.",
  "已经开工或交付的单，不能直接改价。": "A started or delivered order cannot be repriced directly.",
  "已有实收，不能直接改价。": "Money already recorded, so the price cannot be changed directly.",
  "改价要写明原因。": "A price change needs a reason.",
  "改价只有负责人能做。": "Only the principal can change the price.",
  "同一回单号不能用两次。": "The same voucher number cannot be used twice.",
  "实收只有负责人能核对。": "Only the principal can confirm money received.",
  "交付确认只有负责人能做。": "Only the principal can confirm delivery.",
  "周报不能由同一个人编写并核验。": "The same person cannot write and verify the weekly note.",
  "周报数字只能是已经发生的笔数。": "Weekly figures must be counts that already happened.",
  "改价记录不能删。": "A price-change record cannot be deleted.",
};

const ZH = new Map(Object.entries(EN).map(([zh, en]) => [en.toLowerCase(), zh]));

export function show(locale: Locale, text: string): string {
  if (locale !== "en" || !text) return text;
  const direct = EN[text];
  if (direct) return direct;
  const moved = text.match(/^不能从(.+)改到(.+)。$/);
  if (moved) return `Cannot move from ${show("en", moved[1])} to ${show("en", moved[2])}.`;
  return text;
}

export function canon(text: string): string {
  const raw = text.trim();
  if (EN[raw]) return raw;
  return ZH.get(raw.toLowerCase()) ?? text;
}

export function formatYuan(locale: Locale, yuan: number): string {
  const n = new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN", {
    maximumFractionDigits: 0,
  }).format(yuan);
  return locale === "en" ? `CNY ${n}` : `${n} 元`;
}

export function activeBody(locale: Locale, stored: string | undefined, zhBody: string, enBody: string): string {
  if (!stored || stored === zhBody || stored === enBody) return locale === "en" ? enBody : zhBody;
  return stored;
}
