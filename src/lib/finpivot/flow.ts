export const CLIENT_STATUSES = ["潜在", "诊断中", "方案中", "在服", "暂停", "结束"] as const;
export const PROJECT_STATUSES = ["立项", "进行", "暂停", "结项"] as const;
export const BILLINGS = ["按单", "月度", "阶段"] as const;
export const ORDER_STATUSES = ["草稿", "待收款", "执行中", "待尾款", "已交付", "已取消"] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type Billing = (typeof BILLINGS)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PayKind = "定金" | "预收" | "阶段费" | "尾款";

export type PayDraft = {
  kind: PayKind;
  label: string;
  expectedYuan: number;
  receivedYuan: number;
};

export const E2E_STEPS = [
  "名单",
  "客户建档",
  "诊断只出风险清单",
  "订单报价",
  "收款计划",
  "定金或当月预收到账才开工",
  "交付物勾完且款项结清",
  "复盘。案例公开另需客户同意",
] as const;

const NEXT: Record<OrderStatus, OrderStatus[]> = {
  草稿: ["待收款", "已取消"],
  待收款: ["执行中", "已取消"],
  执行中: ["待尾款", "已交付", "已取消"],
  待尾款: ["已交付", "已取消"],
  已交付: [],
  已取消: [],
};

export function nextStatuses(status: OrderStatus) {
  return NEXT[status];
}

export function deliverableNames(product: string) {
  if (product === "海外项目财务托管") {
    return ["项目预算表", "资金计划", "进度结算跟踪", "月度财务包", "回款预警"];
  }
  if (product === "结算与清欠专项") {
    return ["合同、签证、结算单、发票、付款记录对齐", "可谈判结算口径"];
  }
  if (product === "出口财务包") {
    return ["单据核对清单", "收汇核对表", "退税资料包", "汇率风险提示"];
  }
  return ["交付范围待定"];
}

export function buildPlan(billing: Billing, amountYuan: number): PayDraft[] {
  const yuan = Math.max(0, Math.round(amountYuan));
  if (billing === "月度") {
    return [{ kind: "预收", label: "当月预收", expectedYuan: yuan, receivedYuan: 0 }];
  }
  if (billing === "阶段") {
    const first = Math.round(yuan * 0.5);
    return [
      { kind: "阶段费", label: "首段费用", expectedYuan: first, receivedYuan: 0 },
      { kind: "阶段费", label: "后续阶段费", expectedYuan: yuan - first, receivedYuan: 0 },
    ];
  }
  const deposit = Math.round(yuan * 0.5);
  return [
    { kind: "定金", label: "定金 50%", expectedYuan: deposit, receivedYuan: 0 },
    { kind: "尾款", label: "尾款，交付前结清", expectedYuan: yuan - deposit, receivedYuan: 0 },
  ];
}

export function settled(line: { expectedYuan: number; receivedYuan: number }) {
  return line.expectedYuan > 0 && line.receivedYuan >= line.expectedYuan;
}

export type Admission = {
  scope: string;
  ndaAt: string;
  conflictClear: boolean;
  authorizedAt: string;
};

const LICENSED_ONLY = ["代理记账", "审计", "法律意见", "税务申报"];

export function serviceAllowed(product: string) {
  if (LICENSED_ONLY.some((word) => product.includes(word))) {
    return { ok: false, reason: "这项涉及执业资质，本所不能直接开工。" };
  }
  if (product !== "出口财务包" && product !== "海外项目财务托管" && product !== "结算与清欠专项") {
    return { ok: false, reason: "服务范围未定，不能开工。" };
  }
  return { ok: true, reason: "" };
}

export function admissionReady(row: Admission | undefined) {
  if (!row || row.scope.trim().length < 8) return { ok: false, reason: "还没有写清服务范围和边界。" };
  if (!row.ndaAt) return { ok: false, reason: "保密还没有记下。" };
  if (!row.conflictClear) return { ok: false, reason: "利益冲突还没有核对。" };
  if (!row.authorizedAt) return { ok: false, reason: "客户授权还没有记下。" };
  return { ok: true, reason: "" };
}

export function sopItems(product: string) {
  if (product === "出口财务包") return ["三单是否齐全", "差异已列出", "退税只整理不承诺", "汇率只写预警"];
  if (product === "海外项目财务托管") return ["预算与实际对照", "资金计划滚到下月", "质保金和账龄", "变更有证据索引"];
  if (product === "结算与清欠专项") return ["逐笔对应", "证据缺口已列出", "争议金额与底稿一致", "确认栏已留"];
  return [];
}

export function sopReady(product: string, checks: { id: string; done: boolean }[] | undefined) {
  const need = sopItems(product);
  if (need.length === 0) return { ok: false, reason: "没有这条服务的底稿。" };
  const done = new Set((checks ?? []).filter((item) => item.done).map((item) => item.id));
  if (need.some((id) => !done.has(id))) return { ok: false, reason: "工作底稿还没勾完。" };
  return { ok: true, reason: "" };
}

export function applyReversal(current: number, next: number, reason: string) {
  if (!Number.isFinite(next)) return { ok: false as const, receivedYuan: current, reason: "冲正金额不正确。" };
  const yuan = Math.max(0, Math.round(next));
  if (yuan >= current) return { ok: false as const, receivedYuan: current, reason: "冲正金额不正确。" };
  if (reason.trim().length < 8) return { ok: false as const, receivedYuan: current, reason: "冲正要写明原因。" };
  return { ok: true as const, receivedYuan: yuan, reason: "" };
}

export type Qualification = {
  fit: "" | "适合" | "不适合";
  reason: string;
  at: string;
};

export type Handoff = {
  version: string;
  customerConfirmedAt: string;
  closeoutNote: string;
};

export type PriceChange = { at: string; fromYuan: number; toYuan: number; note: string };

export type MoneySnapshot = {
  orders: number;
  payments: number;
  receivedYuan: number;
  contracts: number;
};

export function booksBalance(amountYuan: number, status: string, lines: { expectedYuan: number }[]) {
  if (status === "草稿" || status === "已取消") return { ok: true, reason: "" };
  const sum = lines.reduce((total, line) => total + line.expectedYuan, 0);
  if (sum !== amountYuan) return { ok: false, reason: "收款计划合计和订单金额不一致。" };
  return { ok: true, reason: "" };
}

export function canForget(
  orders: { id: string; clientId: string; status: string }[],
  payments: { orderId: string; expectedYuan: number; receivedYuan: number }[],
  clientId: string,
) {
  const mine = orders.filter((order) => order.clientId === clientId);
  for (const order of mine) {
    if (order.status !== "已交付" && order.status !== "已取消") return { ok: false, reason: "还有未收尾的订单，不能销毁联系方式。" };
    const lines = payments.filter((line) => line.orderId === order.id);
    if (order.status === "已交付" && lines.some((line) => line.receivedYuan < line.expectedYuan)) {
      return { ok: false, reason: "款项未结清，不能销毁联系方式。" };
    }
  }
  return { ok: true, reason: "" };
}

export function monthCloseReady(orders: { status: string }[]) {
  const open = orders.filter((order) => order.status === "待收款" || order.status === "执行中" || order.status === "待尾款").length;
  if (open > 0) return { ok: false, reason: `还有 ${open} 张单没到收尾，不能做月结。` };
  return { ok: true, reason: "" };
}

export function reportSignoff(input: {
  status: "草稿" | "待小m核验" | "已核验";
  preparer: string | undefined;
  reviewer: string | undefined;
  counts: Record<string, string | undefined>;
}) {
  if (input.status !== "已核验") return { ok: true, reason: "" };
  const preparer = (input.preparer ?? "").trim();
  const reviewer = (input.reviewer ?? "").trim();
  if (!preparer || !reviewer || preparer === reviewer) return { ok: false, reason: "周报不能由同一个人编写并核验。" };
  if (Object.values(input.counts).some((value) => !/^\d+$/.test((value ?? "").trim()))) {
    return { ok: false, reason: "周报数字只能是已经发生的笔数。" };
  }
  return { ok: true, reason: "" };
}

export function reconcileSnapshot(before: MoneySnapshot, after: MoneySnapshot) {
  const fields = ["orders", "payments", "receivedYuan", "contracts"] as const;
  const drift = fields.filter((key) => before[key] !== after[key]);
  if (drift.length > 0) return { ok: false, reason: `恢复后对不上：${drift.join("、")}` };
  return { ok: true, reason: "" };
}

export function diagnosisReady(note: string | undefined) {
  if ((note?.trim().length ?? 0) < 8) return { ok: false, reason: "还没有诊断出的风险要点。" };
  return { ok: true, reason: "" };
}

export function revisePrice(input: { status: OrderStatus; nextYuan: number; note: string; received: number }) {
  if (input.status === "执行中" || input.status === "待尾款" || input.status === "已交付" || input.status === "已取消") {
    return { ok: false as const, amountYuan: 0, reason: "已经开工或交付的单，不能直接改价。" };
  }
  if (input.received > 0) return { ok: false as const, amountYuan: 0, reason: "已有实收，不能直接改价。" };
  if (!Number.isFinite(input.nextYuan) || Math.round(input.nextYuan) <= 0) return { ok: false as const, amountYuan: 0, reason: "金额要大于 0。" };
  if (input.note.trim().length < 8) return { ok: false as const, amountYuan: 0, reason: "改价要写明原因。" };
  return { ok: true as const, amountYuan: Math.round(input.nextYuan), reason: "" };
}

export function qualifyReady(row: Qualification | undefined) {
  if (!row || (row.fit !== "适合" && row.fit !== "不适合") || !row.at) return { ok: false, reason: "还没有资格判断。" };
  if (row.reason.trim().length < 8) return { ok: false, reason: "资格判断要写明原因。" };
  if (row.fit !== "适合") return { ok: false, reason: "判断为不适合，不能建档。" };
  return { ok: true, reason: "" };
}

export function handoffReady(row: Handoff | undefined) {
  if (!row || !/^v\d+$/.test(row.version.trim())) return { ok: false, reason: "交付包还没有版本号。" };
  if (!row.customerConfirmedAt) return { ok: false, reason: "客户还没有确认这一版交付。" };
  if (row.closeoutNote.trim().length < 8) return { ok: false, reason: "收尾对账还没写。" };
  return { ok: true, reason: "" };
}

export function evidenceFunnel(input: {
  leads: { qualification?: Qualification }[];
  clients: { leadId?: string }[];
  orders: { status: string; handoff?: Handoff }[];
}) {
  const judged = input.leads.filter((lead) => lead.qualification?.fit === "适合" || lead.qualification?.fit === "不适合");
  return {
    judged: judged.length,
    fit: judged.filter((lead) => lead.qualification?.fit === "适合").length,
    filed: input.clients.filter((client) => client.leadId).length,
    delivered: input.orders.filter((order) => order.status === "已交付" && handoffReady(order.handoff).ok).length,
  };
}

export type PayLine = {
  kind: PayKind;
  expectedYuan: number;
  receivedYuan: number;
};

export function canStart(billing: Billing, lines: PayLine[]) {
  if (lines.length === 0) return { ok: false, reason: "还没有收款计划。" };
  if (billing === "月度") {
    const line = lines.find((l) => l.kind === "预收");
    if (!line || !settled(line)) return { ok: false, reason: "月度服务要先收当月费用，才能开工。" };
    return { ok: true, reason: "" };
  }
  if (billing === "阶段") {
    const first = lines[0];
    if (!first || !settled(first)) return { ok: false, reason: "首段费用未收齐，不能开工。" };
    return { ok: true, reason: "" };
  }
  const deposit = lines.find((l) => l.kind === "定金");
  if (!deposit || !settled(deposit)) return { ok: false, reason: "定金未收齐（50%），不能开工。" };
  return { ok: true, reason: "" };
}

export function applyReceipt(current: number, next: number) {
  if (!Number.isFinite(next)) return { ok: false as const, receivedYuan: current, reason: "金额不正确。" };
  const yuan = Math.max(0, Math.round(next));
  if (yuan < current) return { ok: false as const, receivedYuan: current, reason: "实收不能直接改小。冲正要单独记录原因。" };
  return { ok: true as const, receivedYuan: yuan, reason: "" };
}

export function reviewReady(items: { done?: boolean; preparer?: string; reviewer?: string; reviewedAt?: string }[]) {
  const relevant = items.filter((item) => item.done !== false);
  if (relevant.length === 0) return { ok: false, reason: "没有已勾选的交付物。" };
  for (const item of relevant) {
    const preparer = item.preparer?.trim() ?? "";
    const reviewer = item.reviewer?.trim() ?? "";
    if (!preparer || !reviewer || preparer === reviewer || !item.reviewedAt) {
      return { ok: false, reason: "交付前要有编制人和另一名复核人。" };
    }
  }
  return { ok: true, reason: "" };
}

export function canDeliver(lines: PayLine[], deliverablesDone: boolean) {
  if (!deliverablesDone) return { ok: false, reason: "交付物还没勾完，不能标已交付。" };
  if (lines.length === 0 || lines.some((l) => !settled(l))) {
    return { ok: false, reason: "还有款项未结清，不能标已交付。" };
  }
  return { ok: true, reason: "" };
}

export function gateMove(
  status: OrderStatus,
  next: OrderStatus,
  billing: Billing,
  lines: PayLine[],
  deliverablesDone: boolean,
  contractReady = true,
  reviewOk = true,
  admitted = true,
  product = "出口财务包",
  sopOk = true,
  handoffOk = true,
) {
  if (!NEXT[status].includes(next)) return { ok: false, reason: `不能从${status}改到${next}。` };
  if (next === "执行中" && !contractReady) return { ok: false, reason: "服务确认书还没双方签完，不能开工。" };
  if (next === "执行中") {
    const allowed = serviceAllowed(product);
    if (!allowed.ok) return allowed;
    if (!admitted) return { ok: false, reason: "还没有客户授权和服务边界。" };
    return canStart(billing, lines);
  }
  if (next === "已交付") {
    const delivered = canDeliver(lines, deliverablesDone);
    if (!delivered.ok) return delivered;
    if (!reviewOk) return { ok: false, reason: "交付前要有编制人和另一名复核人。" };
    if (!sopOk) return { ok: false, reason: "工作底稿还没勾完。" };
    if (!handoffOk) return { ok: false, reason: "交付版本、客户确认或收尾对账还不齐。" };
    return { ok: true, reason: "" };
  }
  if (next === "待收款" && lines.length === 0) return { ok: false, reason: "先生成收款计划。" };
  return { ok: true, reason: "" };
}
