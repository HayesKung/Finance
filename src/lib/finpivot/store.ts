import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  IMPACTS,
  OUTREACH_RESULTS,
  PRODUCTS,
  SOURCES,
  STAGES,
  firstWeek,
  questionGroups,
  templateSeeds,
} from "@/lib/finpivot/copy";
import {
  buildPlan,
  deliverableNames,
  gateMove,
  type Billing,
  type ClientStatus,
  type OrderStatus,
  type ProjectStatus,
} from "@/lib/finpivot/flow";

export type Stage = (typeof STAGES)[number];
export type Source = (typeof SOURCES)[number];
export type Product = (typeof PRODUCTS)[number];
export type Impact = (typeof IMPACTS)[number];
export type OutreachResult = (typeof OUTREACH_RESULTS)[number];

export type Lead = {
  id: string;
  alias: string;
  company: string;
  industry: string;
  direction: string;
  market: string;
  publicChannel: string;
  source: Source;
  stage: Stage;
  product: Product;
  next: string;
  nextDate: string;
  note: string;
  consentPrivate: boolean;
  privateContact: string;
};

export type Outreach = {
  id: string;
  alias: string;
  scene: "老关系" | "转介绍" | "内容来询";
  date: string;
  result: OutreachResult;
  reason: string;
  next: string;
};

export type Client = {
  id: string;
  leadId: string;
  alias: string;
  company: string;
  industry: string;
  direction: string;
  market: string;
  source: Source;
  publicChannel: string;
  consentPrivate: boolean;
  privateContact: string;
  status: ClientStatus;
  note: string;
};

export type Project = {
  id: string;
  clientId: string;
  name: string;
  market: string;
  quoteCurrency: string;
  settleCurrency: string;
  status: ProjectStatus;
  note: string;
};

export type Order = {
  id: string;
  clientId: string;
  projectId: string;
  product: Product;
  billing: Billing;
  title: string;
  amountYuan: number;
  status: OrderStatus;
  blockReason: string;
};

export type Payment = {
  id: string;
  orderId: string;
  kind: "定金" | "预收" | "阶段费" | "尾款";
  label: string;
  expectedYuan: number;
  receivedYuan: number;
};

export type Deliverable = {
  id: string;
  orderId: string;
  name: string;
  done: boolean;
};

export type OrderInput = {
  clientId: string;
  projectId: string;
  product: Product;
  billing: Billing;
  title: string;
  amountYuan: number;
};

export type Risk = { id: string; point: string; impact: Impact; next: string };
export type Answer = { checked: boolean; note: string };

export type WeekReport = {
  range: string;
  added: string;
  invited: string;
  diagnosed: string;
  listed: string;
  quoted: string;
  note: string;
  status: "草稿" | "待小m核验" | "已核验";
};

type OsState = {
  leads: Lead[];
  outreach: Outreach[];
  answers: Record<string, Answer>;
  risks: Risk[];
  diagAlias: string;
  days: boolean[];
  templates: Record<string, string>;
  articleChecked: Record<string, boolean>;
  report: WeekReport;
  hostingClients: number;
  hostingFee: number;
  exportOrders: number;
  exportFee: number;
  clients: Client[];
  projects: Project[];
  orders: Order[];
  payments: Payment[];
  deliverables: Deliverable[];
  addLead: (lead: Omit<Lead, "id">) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  importLeads: (rows: Omit<Lead, "id">[]) => void;
  addOutreach: (row: Omit<Outreach, "id">) => void;
  removeOutreach: (id: string) => void;
  setAnswer: (id: string, patch: Partial<Answer>) => void;
  setDiagAlias: (v: string) => void;
  addRisk: () => void;
  updateRisk: (id: string, patch: Partial<Risk>) => void;
  removeRisk: (id: string) => void;
  toggleDay: (i: number) => void;
  setTemplate: (id: string, body: string) => void;
  toggleArticle: (id: string) => void;
  setReport: (patch: Partial<WeekReport>) => void;
  setModel: (patch: Partial<Pick<OsState, "hostingClients" | "hostingFee" | "exportOrders" | "exportFee">>) => void;
  addClient: (row: Omit<Client, "id" | "leadId"> & { leadId?: string }) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
  promoteLead: (leadId: string) => void;
  addProject: (row: Omit<Project, "id">) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addOrder: (row: OrderInput) => void;
  issuePlan: (orderId: string) => void;
  moveOrder: (orderId: string, status: OrderStatus) => void;
  recordReceipt: (paymentId: string, yuan: number) => void;
  toggleDeliverable: (id: string) => void;
};

const emptyAnswers = () => {
  const out: Record<string, Answer> = {};
  questionGroups.forEach((g) => {
    g.items.forEach((item) => {
      out[item.id] = { checked: false, note: "" };
    });
  });
  return out;
};

const seedTemplates = () => {
  const out: Record<string, string> = {};
  templateSeeds.forEach((t) => {
    out[t.id] = t.body;
  });
  return out;
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const safeStorage = {
  getItem: (name: string) => {
    try {
      if (typeof localStorage === "undefined") return null;
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* 无存储权限时，这一次打开仍然可用 */
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

export const useOs = create<OsState>()(
  persist(
    (set) => ({
      leads: [],
      outreach: [],
      answers: emptyAnswers(),
      risks: [
        { id: "r1", point: "", impact: "回款", next: "付费方案才给完整做法" },
      ],
      diagAlias: "",
      days: firstWeek.map(() => false),
      templates: seedTemplates(),
      articleChecked: {},
      report: {
        range: "2026-10-28 至 2026-11-04",
        added: "",
        invited: "",
        diagnosed: "",
        listed: "",
        quoted: "",
        note: "",
        status: "草稿",
      },
      hostingClients: 3,
      hostingFee: 15000,
      exportOrders: 10,
      exportFee: 2500,
      clients: [],
      projects: [],
      orders: [],
      payments: [],
      deliverables: [],
      addLead: (lead) => set((s) => ({ leads: [{ ...lead, id: uid() }, ...s.leads] })),
      updateLead: (id, patch) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      removeLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      importLeads: (rows) =>
        set((s) => ({
          leads: [...rows.map((r) => ({ ...r, id: uid() })), ...s.leads],
        })),
      addOutreach: (row) => set((s) => ({ outreach: [{ ...row, id: uid() }, ...s.outreach] })),
      removeOutreach: (id) =>
        set((s) => ({ outreach: s.outreach.filter((o) => o.id !== id) })),
      setAnswer: (id, patch) =>
        set((s) => {
          const prev = s.answers[id] ?? { checked: false, note: "" };
          return { answers: { ...s.answers, [id]: { ...prev, ...patch } } };
        }),
      setDiagAlias: (v) => set({ diagAlias: v }),
      addRisk: () =>
        set((s) => ({
          risks: [
            ...s.risks,
            { id: uid(), point: "", impact: "回款", next: "付费方案才给完整做法" },
          ],
        })),
      updateRisk: (id, patch) =>
        set((s) => ({
          risks: s.risks.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      removeRisk: (id) => set((s) => ({ risks: s.risks.filter((r) => r.id !== id) })),
      toggleDay: (i) =>
        set((s) => ({ days: s.days.map((d, idx) => (idx === i ? !d : d)) })),
      setTemplate: (id, body) => set((s) => ({ templates: { ...s.templates, [id]: body } })),
      toggleArticle: (id) =>
        set((s) => ({ articleChecked: { ...s.articleChecked, [id]: !s.articleChecked[id] } })),
      setReport: (patch) => set((s) => ({ report: { ...s.report, ...patch } })),
      setModel: (patch) => set(patch),
      addClient: (row) =>
        set((s) => ({
          clients: [{ ...row, leadId: row.leadId ?? "", id: uid() }, ...s.clients],
        })),
      updateClient: (id, patch) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      removeClient: (id) =>
        set((s) => {
          if (s.orders.some((o) => o.clientId === id && o.status !== "已取消")) return s;
          return {
            clients: s.clients.filter((c) => c.id !== id),
            projects: s.projects.filter((p) => p.clientId !== id),
          };
        }),
      promoteLead: (leadId) =>
        set((s) => {
          if (s.clients.some((c) => c.leadId === leadId)) return s;
          const lead = s.leads.find((l) => l.id === leadId);
          if (!lead) return s;
          const client: Client = {
            id: uid(),
            leadId,
            alias: lead.alias,
            company: lead.company,
            industry: lead.industry,
            direction: lead.direction,
            market: lead.market,
            source: lead.source,
            publicChannel: lead.publicChannel,
            consentPrivate: lead.consentPrivate,
            privateContact: lead.privateContact,
            status: "潜在",
            note: lead.note,
          };
          return { clients: [client, ...s.clients] };
        }),
      addProject: (row) => set((s) => ({ projects: [{ ...row, id: uid() }, ...s.projects] })),
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeProject: (id) =>
        set((s) => {
          if (s.orders.some((o) => o.projectId === id && o.status !== "已取消")) return s;
          return { projects: s.projects.filter((p) => p.id !== id) };
        }),
      addOrder: (row) =>
        set((s) => {
          if (!row.clientId || row.product === "未定" || row.amountYuan <= 0) return s;
          const order: Order = {
            ...row,
            id: uid(),
            amountYuan: Math.round(row.amountYuan),
            status: "草稿",
            blockReason: "",
          };
          return { orders: [order, ...s.orders] };
        }),
      issuePlan: (orderId) =>
        set((s) => {
          const order = s.orders.find((o) => o.id === orderId);
          if (!order || order.status !== "草稿") return s;
          if (order.amountYuan <= 0) {
            return {
              orders: s.orders.map((o) =>
                o.id === orderId ? { ...o, blockReason: "金额要大于 0。不接受先做后看。" } : o,
              ),
            };
          }
          const payments = buildPlan(order.billing, order.amountYuan).map((line) => ({
            ...line,
            id: uid(),
            orderId,
          }));
          const deliverables = deliverableNames(order.product).map((name) => ({
            id: uid(),
            orderId,
            name,
            done: false,
          }));
          const move = gateMove(order.status, "待收款", order.billing, payments, false);
          if (!move.ok) {
            return {
              orders: s.orders.map((o) => (o.id === orderId ? { ...o, blockReason: move.reason } : o)),
            };
          }
          return {
            payments: [...payments, ...s.payments.filter((p) => p.orderId !== orderId)],
            deliverables: [...deliverables, ...s.deliverables.filter((d) => d.orderId !== orderId)],
            orders: s.orders.map((o) =>
              o.id === orderId ? { ...o, status: "待收款", blockReason: "" } : o,
            ),
          };
        }),
      moveOrder: (orderId, status) =>
        set((s) => {
          const order = s.orders.find((o) => o.id === orderId);
          if (!order) return s;
          const lines = s.payments.filter((p) => p.orderId === orderId);
          const items = s.deliverables.filter((d) => d.orderId === orderId);
          const done = items.length > 0 && items.every((d) => d.done);
          const move = gateMove(order.status, status, order.billing, lines, done);
          return {
            orders: s.orders.map((o) =>
              o.id === orderId
                ? move.ok
                  ? { ...o, status, blockReason: "" }
                  : { ...o, blockReason: move.reason }
                : o,
            ),
          };
        }),
      recordReceipt: (paymentId, yuan) =>
        set((s) => ({
          payments: s.payments.map((p) => {
            if (p.id !== paymentId) return p;
            const receivedYuan = Math.max(0, Math.min(p.expectedYuan, Math.round(yuan)));
            return { ...p, receivedYuan };
          }),
        })),
      toggleDeliverable: (id) =>
        set((s) => ({
          deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, done: !d.done } : d)),
        })),
    }),
    { name: "finpivot-os-v1", storage: createJSONStorage(() => safeStorage), skipHydration: true },
  ),
);

export function hydrateDesk() {
  if (useOs.persist.hasHydrated()) return;
  void Promise.resolve(useOs.persist.rehydrate()).catch(() => undefined);
}
