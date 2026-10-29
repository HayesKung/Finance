import { admissionReady, booksBalance, gateMove, handoffReady, reviewReady, serviceAllowed, sopReady, type Admission, type Billing, type Handoff, type OrderStatus, type PayKind } from "./flow.ts";

export type DeskOrder = {
  id: string;
  status: OrderStatus;
  billing: Billing;
  amountYuan: number;
  product?: string;
  admission?: Admission;
  sop?: { id: string; done: boolean }[];
  handoff?: Handoff;
  changeNote?: string;
  priceLog?: { at: string; fromYuan: number; toYuan: number; note: string }[];
};

export type DeskPay = {
  id: string;
  orderId: string;
  kind: PayKind;
  expectedYuan: number;
  receivedYuan: number;
  reversalReason?: string;
  receiptRef?: string;
};

export type DeskItem = {
  orderId: string;
  done: boolean;
  preparer?: string;
  reviewer?: string;
  reviewedAt?: string;
};

export type DeskAgreement = {
  orderId: string;
  signedAt?: string;
  firmSignedAt?: string;
};

export type DeskBody = {
  orders: DeskOrder[];
  payments: DeskPay[];
  deliverables: DeskItem[];
  agreements?: DeskAgreement[];
};

export function diffDesk(prev: DeskBody, next: DeskBody, role: "owner" | "support" = "owner") {
  const refs = next.payments.map((line) => line.receiptRef?.trim() ?? "").filter((ref) => ref.length >= 4);
  if (new Set(refs).size !== refs.length) return { ok: false, reason: "同一回单号不能用两次。" };
  for (const before of prev.orders) {
    if (next.orders.some((order) => order.id === before.id)) continue;
    const received = prev.payments.filter((line) => line.orderId === before.id).reduce((sum, line) => sum + line.receivedYuan, 0);
    if (received > 0 || before.status === "执行中" || before.status === "已交付") {
      return { ok: false, reason: "有实收或已开工的订单不能删。" };
    }
  }
  for (const before of prev.payments) {
    if (!next.payments.some((line) => line.id === before.id) && before.receivedYuan > 0) {
      return { ok: false, reason: "有实收的收款行不能删。" };
    }
  }
  const prevOrders = new Map(prev.orders.map((order) => [order.id, order]));
  for (const order of next.orders) {
    const before = prevOrders.get(order.id);
    if (before && (before.priceLog?.length ?? 0) > (order.priceLog?.length ?? 0)) {
      return { ok: false, reason: "改价记录不能删。" };
    }
    if (before && before.amountYuan !== order.amountYuan) {
      if (role !== "owner") return { ok: false, reason: "改价只有负责人能做。" };
      if ((order.changeNote?.trim().length ?? 0) < 8) return { ok: false, reason: "改价要写明原因。" };
      const received = next.payments.filter((line) => line.orderId === order.id).reduce((sum, line) => sum + line.receivedYuan, 0);
      if (received > 0) return { ok: false, reason: "已有实收，不能直接改价。" };
    }
    const balance = booksBalance(
      order.amountYuan,
      order.status,
      next.payments.filter((line) => line.orderId === order.id),
    );
    if (!balance.ok) return balance;
    if (!before || before.status === order.status) continue;
    if (order.status === "已交付" && role !== "owner") return { ok: false, reason: "交付确认只有负责人能做。" };
    const lines = next.payments.filter((line) => line.orderId === order.id);
    const items = next.deliverables.filter((item) => item.orderId === order.id);
    const done = items.length > 0 && items.every((item) => item.done);
    const sheet = (next.agreements ?? []).find((item) => item.orderId === order.id);
    const contractReady = Boolean(sheet?.signedAt && sheet?.firmSignedAt);
    const product = order.product || before.product || "";
    const admitted = serviceAllowed(product).ok && admissionReady(order.admission).ok;
    const move = gateMove(
      before.status,
      order.status,
      order.billing,
      lines,
      done,
      contractReady,
      reviewReady(items).ok,
      admitted,
      product,
      sopReady(product, order.sop).ok,
      handoffReady(order.handoff).ok,
    );
    if (!move.ok) return move;
  }
  const prevPay = new Map(prev.payments.map((line) => [line.id, line]));
  for (const line of next.payments) {
    const before = prevPay.get(line.id);
    if (before && line.receivedYuan !== before.receivedYuan && role !== "owner") {
      return { ok: false, reason: "实收只有负责人能核对。" };
    }
    if (before && line.receivedYuan > before.receivedYuan && (line.receiptRef?.trim().length ?? 0) < 4) {
      return { ok: false, reason: "实收增加要记下回单号。" };
    }
    if (before && line.receivedYuan < before.receivedYuan && (line.reversalReason?.trim().length ?? 0) < 8) {
      return { ok: false, reason: "实收不能直接改小。冲正要单独记录原因。" };
    }
  }
  return { ok: true, reason: "" };
}

export function parseDesk(raw: string): DeskBody | null {
  try {
    const value = JSON.parse(raw) as Partial<DeskBody>;
    if (!value || !Array.isArray(value.orders) || !Array.isArray(value.payments) || !Array.isArray(value.deliverables)) return null;
    return {
      orders: value.orders,
      payments: value.payments,
      deliverables: value.deliverables,
      agreements: Array.isArray(value.agreements) ? value.agreements : [],
    };
  } catch {
    return null;
  }
}
