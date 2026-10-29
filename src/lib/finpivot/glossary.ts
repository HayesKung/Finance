export type Locale = "zh" | "en";

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
