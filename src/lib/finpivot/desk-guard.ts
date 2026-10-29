import { BILLINGS, ORDER_STATUSES, canForget } from "./flow.ts";

const ORDER_KEYS = [
  "id",
  "clientId",
  "projectId",
  "product",
  "billing",
  "title",
  "amountYuan",
  "status",
  "blockReason",
  "admission",
  "sop",
  "handoff",
  "changeNote",
  "priceLog",
] as const;

const PAY_KEYS = ["id", "orderId", "kind", "label", "expectedYuan", "receivedYuan", "method", "reversalReason", "receiptRef"] as const;
const ITEM_KEYS = ["id", "orderId", "name", "done", "preparer", "reviewer", "reviewedAt"] as const;
const SHEET_KEYS = [
  "id",
  "ref",
  "inquiryId",
  "leadId",
  "clientId",
  "orderId",
  "customerToken",
  "staffToken",
  "payeeName",
  "payeeBank",
  "payeeAccount",
  "signedName",
  "signedAt",
  "signedImage",
  "firmSigner",
  "firmSignedAt",
  "firmSignImage",
  "claimedMethod",
  "claimedAt",
] as const;
const PAY_KINDS = ["定金", "预收", "阶段费", "尾款"] as const;
const METHODS = ["", "微信", "支付宝", "银行转账"] as const;
const FRESH = new Set(["草稿", "待收款", "已取消"]);
const FIRM_FIELDS = ["payeeName", "payeeBank", "payeeAccount", "wechatId", "alipayAccount"] as const;

type Result = { ok: true; reason: "" } | { ok: false; reason: string };
type OrderRow = { id: string; status: string };
type PayRow = { id: string; orderId: string; receivedYuan: number };

function pass(): Result {
  return { ok: true, reason: "" };
}

function fail(reason: string): Result {
  return { ok: false, reason };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function keysOk(row: Record<string, unknown>, allowed: readonly string[]) {
  return Object.keys(row).every((key) => allowed.includes(key));
}

function textId(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function yuan(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function uniqueIds(rows: { id: string }[]) {
  const ids = rows.map((row) => row.id);
  return ids.every((id) => id.length > 0) && new Set(ids).size === ids.length;
}

export function shapeOrders(rows: unknown[]): Result {
  if (!rows.every(isRecord)) return fail("台账字段不正确。");
  for (const row of rows) {
    if (!keysOk(row, ORDER_KEYS) || !textId(row.id)) return fail("台账字段不正确。");
    if (!(ORDER_STATUSES as readonly string[]).includes(String(row.status))) return fail("状态不正确。");
    if (!(BILLINGS as readonly string[]).includes(String(row.billing))) return fail("台账字段不正确。");
    if (!yuan(row.amountYuan)) return fail("金额不符。");
  }
  if (!uniqueIds(rows as { id: string }[])) return fail("台账里有重复编号。");
  return pass();
}

export function shapePayments(rows: unknown[], orderIds: Set<string>): Result {
  if (!rows.every(isRecord)) return fail("台账字段不正确。");
  for (const row of rows) {
    if (!keysOk(row, PAY_KEYS) || !textId(row.id) || !textId(row.orderId)) return fail("台账字段不正确。");
    if (!orderIds.has(String(row.orderId))) return fail("收款行没有对应的订单。");
    if (!(PAY_KINDS as readonly string[]).includes(String(row.kind))) return fail("收款类型不正确。");
    if (row.method !== undefined && !(METHODS as readonly string[]).includes(String(row.method))) return fail("收款类型不正确。");
    if (!yuan(row.expectedYuan) || !yuan(row.receivedYuan)) return fail("金额不符。");
    if (Number(row.receivedYuan) > Number(row.expectedYuan)) return fail("实收不能高于这一笔应收。");
  }
  if (!uniqueIds(rows as { id: string }[])) return fail("台账里有重复编号。");
  return pass();
}

export function shapeItems(rows: unknown[], orderIds: Set<string>): Result {
  if (!rows.every(isRecord)) return fail("台账字段不正确。");
  for (const row of rows) {
    if (!keysOk(row, ITEM_KEYS) || !textId(row.id) || typeof row.done !== "boolean") return fail("台账字段不正确。");
    if (!orderIds.has(String(row.orderId))) return fail("交付物没有对应的订单。");
  }
  if (!uniqueIds(rows as { id: string }[])) return fail("台账里有重复编号。");
  return pass();
}

function shapeSheets(rows: unknown[] | undefined): Result {
  if (!rows) return pass();
  if (!rows.every(isRecord)) return fail("台账字段不正确。");
  for (const row of rows) {
    if (!keysOk(row, SHEET_KEYS)) return fail("台账字段不正确。");
  }
  return pass();
}

export function guardDesk(prev: { orders: OrderRow[]; payments: PayRow[] }, next: { orders: OrderRow[]; payments: PayRow[]; deliverables: unknown[]; agreements?: unknown[] }): Result {
  const orders = shapeOrders(next.orders);
  if (!orders.ok) return orders;
  const orderIds = new Set(next.orders.map((order) => order.id));
  const payments = shapePayments(next.payments, orderIds);
  if (!payments.ok) return payments;
  const items = shapeItems(next.deliverables, orderIds);
  if (!items.ok) return items;
  const sheets = shapeSheets(next.agreements);
  if (!sheets.ok) return sheets;
  const known = new Set(prev.orders.map((order) => order.id));
  for (const order of next.orders) {
    if (!known.has(order.id) && !FRESH.has(order.status)) return fail("新订单不能直接开工或交付。");
  }
  const before = new Map(prev.payments.map((line) => [line.id, line]));
  for (const line of next.payments) {
    const old = before.get(line.id);
    if (old && old.orderId !== line.orderId) return fail("收款行不能改到别的订单。");
  }
  return pass();
}

function textField(row: Record<string, unknown> | null, key: string) {
  const value = row?.[key];
  return typeof value === "string" ? value : "";
}

function firmChanged(prev: unknown, next: unknown) {
  const left = isRecord(prev) ? prev : null;
  const right = isRecord(next) ? next : null;
  return FIRM_FIELDS.some((key) => textField(left, key) !== textField(right, key));
}

function clientRows(body: Record<string, unknown> | null) {
  if (!Array.isArray(body?.clients)) return [] as { id: string; privateContact: string }[];
  return body.clients.filter(isRecord).map((row) => ({
    id: typeof row.id === "string" ? row.id : "",
    privateContact: typeof row.privateContact === "string" ? row.privateContact : "",
  }));
}

export function diffSensitive(prevRaw: string, nextRaw: string, role: "owner" | "support"): Result {
  let prev: unknown = {};
  let next: unknown;
  try {
    if (prevRaw) prev = JSON.parse(prevRaw) as unknown;
    next = JSON.parse(nextRaw) as unknown;
  } catch {
    return fail("台账不正确");
  }
  if (!isRecord(prev) || !isRecord(next)) return fail("台账不正确");
  const orders = Array.isArray(next.orders) ? next.orders.filter(isRecord) : [];
  const payments = Array.isArray(next.payments) ? next.payments.filter(isRecord) : [];
  const orderRows = orders.map((row) => ({ id: String(row.id ?? ""), clientId: String(row.clientId ?? ""), status: String(row.status ?? "") }));
  const payRows = payments.map((row) => ({
    orderId: String(row.orderId ?? ""),
    expectedYuan: Number(row.expectedYuan ?? 0),
    receivedYuan: Number(row.receivedYuan ?? 0),
  }));
  for (const before of clientRows(prev)) {
    if (!before.id) continue;
    const found = clientRows(next).find((row) => row.id === before.id);
    if (!found) {
      const forget = canForget(orderRows, payRows, before.id);
      if (!forget.ok) return fail(forget.reason);
      continue;
    }
    if (role !== "owner" && before.privateContact !== found.privateContact) return fail("私人联系方式只有负责人能改。");
  }
  if (role !== "owner" && firmChanged(prev.firm, next.firm)) return fail("收款账户只有负责人能改。");
  return pass();
}
