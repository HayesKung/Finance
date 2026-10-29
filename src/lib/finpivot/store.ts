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
  inquiryToLead,
  makeInquiryRef,
  type Inquiry,
} from "@/lib/finpivot/inquiry";
import { makeAgreementRef, methodReady, signatureOk, type Agreement, type PayMethod } from "@/lib/finpivot/agreement";

export type Firm = {
  legalName: string;
  signerName: string;
  payeeName: string;
  payeeBank: string;
  payeeAccount: string;
  wechatId: string;
  alipayAccount: string;
};

const emptyFirm: Firm = {
  legalName: "",
  signerName: "",
  payeeName: "",
  payeeBank: "",
  payeeAccount: "",
  wechatId: "",
  alipayAccount: "",
};
import {
  admissionReady,
  applyReceipt,
  applyReversal,
  buildPlan,
  canForget,
  deliverableNames,
  diagnosisReady,
  gateMove,
  handoffReady,
  qualifyReady,
  reportSignoff,
  reviewReady,
  revisePrice,
  sopItems,
  sopReady,
  type Admission,
  type Billing,
  type ClientStatus,
  type Handoff,
  type OrderStatus,
  type ProjectStatus,
  type Qualification,
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
  qualification?: Qualification;
  diagnosis?: string;
  block?: string;
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
  block?: string;
  forgottenAt?: string;
};

export type Project = {
  id: string;
  clientId: string;
  name: string;
  market: string;
  quoteCurrency: string;
  settleCurrency: string;
  quoteAmount: number;
  fxRate: number;
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
  admission?: Admission;
  sop?: { id: string; done: boolean }[];
  handoff?: Handoff;
  changeNote?: string;
  priceLog?: { at: string; fromYuan: number; toYuan: number; note: string }[];
};

export type Payment = {
  id: string;
  orderId: string;
  kind: "定金" | "预收" | "阶段费" | "尾款";
  label: string;
  expectedYuan: number;
  receivedYuan: number;
  method: "" | PayMethod;
  reversalReason?: string;
  receiptRef?: string;
};

export type Deliverable = {
  id: string;
  orderId: string;
  name: string;
  done: boolean;
  preparer?: string;
  reviewer?: string;
  reviewedAt?: string;
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
  preparer: string;
  reviewer: string;
  block: string;
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
  inquiries: Inquiry[];
  addInquiry: (
    row: Omit<Inquiry, "id" | "ref" | "createdAt" | "status" | "leadId">,
  ) => Inquiry;
  acceptInquiry: (id: string) => void;
  declineInquiry: (id: string) => void;
  agreements: Agreement[];
  firm: Firm;
  setFirm: (patch: Partial<Firm>) => void;
  quoteInquiry: (
    inquiryId: string,
    row: { product: Product; billing: Billing; title: string; amountYuan: number },
  ) => string;
  setPayee: (id: string, patch: Partial<Pick<Agreement, "payeeName" | "payeeBank" | "payeeAccount">>) => void;
  signAgreement: (ref: string, name: string, image: string) => boolean;
  countersign: (ref: string, image: string) => boolean;
  claimPrepaid: (ref: string, method: PayMethod) => boolean;
  applyRemote: (
    ref: string,
    patch: Partial<
      Pick<
        Agreement,
        | "signedName"
        | "signedAt"
        | "signedImage"
        | "firmSigner"
        | "firmSignedAt"
        | "firmSignImage"
        | "claimedMethod"
        | "claimedAt"
      >
    >,
  ) => void;
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
  forgetPrivate: (clientId: string) => void;
  promoteLead: (leadId: string) => void;
  setQualification: (leadId: string, patch: Partial<Qualification>) => void;
  setDiagnosis: (leadId: string, note: string) => void;
  reviseAmount: (orderId: string, yuan: number, note: string) => void;
  addProject: (row: Omit<Project, "id">) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addOrder: (row: OrderInput) => void;
  issuePlan: (orderId: string) => void;
  moveOrder: (orderId: string, status: OrderStatus) => void;
  recordReceipt: (paymentId: string, yuan: number, method: "" | PayMethod, receiptRef: string) => void;
  setHandoff: (orderId: string, patch: Partial<Handoff>) => void;
  setReview: (orderId: string, preparer: string, reviewer: string) => void;
  setAdmission: (orderId: string, patch: Partial<Admission>) => void;
  toggleSop: (orderId: string, id: string) => void;
  reverseReceipt: (paymentId: string, yuan: number, reason: string) => void;
  toggleDeliverable: (id: string) => void;
  replaceDesk: (patch: Partial<OsState>) => void;
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
        preparer: "",
        reviewer: "",
        block: "",
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
      inquiries: [],
      firm: emptyFirm,
      setFirm: (patch) => set((s) => ({ firm: { ...emptyFirm, ...s.firm, ...patch } })),
      addInquiry: (row) => {
        const now = new Date();
        const id = uid();
        const inquiry: Inquiry = {
          ...row,
          id,
          ref: makeInquiryRef(now.toISOString().slice(0, 10).replace(/-/g, ""), id),
          createdAt: now.toISOString(),
          status: "待处理",
          leadId: "",
        };
        set((s) => ({ inquiries: [inquiry, ...(s.inquiries ?? [])] }));
        return inquiry;
      },
      acceptInquiry: (id) =>
        set((s) => {
          const list = s.inquiries ?? [];
          const inq = list.find((item) => item.id === id);
          if (!inq || inq.status !== "待处理") return s;
          const leadId = uid();
          return {
            leads: [{ ...inquiryToLead(inq), id: leadId }, ...s.leads],
            inquiries: list.map((item) => (item.id === id ? { ...item, status: "已转入名单", leadId } : item)),
          };
        }),
      declineInquiry: (id) =>
        set((s) => ({
          inquiries: (s.inquiries ?? []).map((item) =>
            item.id === id && item.status === "待处理" ? { ...item, status: "不跟进" } : item,
          ),
        })),
      agreements: [],
      quoteInquiry: (inquiryId, row) => {
        let created = "";
        set((s) => {
          const existing = (s.agreements ?? []).find((a) => a.inquiryId === inquiryId);
          if (existing) {
            created = existing.ref;
            return s;
          }
          const inq = (s.inquiries ?? []).find((item) => item.id === inquiryId);
          if (!inq || inq.status !== "已转入名单" || !inq.leadId) return s;
          const lead = s.leads.find((item) => item.id === inq.leadId);
          if (!lead || !row.title.trim() || row.amountYuan <= 0 || row.product === "未定") return s;
          const diagnosis = diagnosisReady(lead.diagnosis);
          const fit = qualifyReady(lead.qualification);
          if (!diagnosis.ok || !fit.ok) {
            return {
              leads: s.leads.map((item) => (item.id === lead.id ? { ...item, block: diagnosis.ok ? fit.reason : diagnosis.reason } : item)),
            };
          }
          const found = s.clients.find((item) => item.leadId === lead.id);
          const clientId = found?.id ?? uid();
          const clients = found
            ? s.clients.map((item) =>
                item.id === clientId && item.status === "潜在" ? { ...item, status: "方案中" as const } : item,
              )
            : [
                {
                  id: clientId,
                  leadId: lead.id,
                  alias: lead.alias,
                  company: lead.company,
                  industry: lead.industry,
                  direction: lead.direction,
                  market: lead.market,
                  source: lead.source,
                  publicChannel: lead.publicChannel,
                  consentPrivate: lead.consentPrivate,
                  privateContact: lead.privateContact,
                  status: "方案中" as const,
                  note: lead.note,
                },
                ...s.clients,
              ];
          const orderId = uid();
          const amountYuan = Math.round(row.amountYuan);
          const payments = buildPlan(row.billing, amountYuan).map((line) => ({
            ...line,
            id: uid(),
            orderId,
            method: "" as const,
          }));
          const deliverables = deliverableNames(row.product).map((name) => ({
            id: uid(),
            orderId,
            name,
            done: false,
          }));
          const id = uid();
          const ref = makeAgreementRef(new Date().toISOString().slice(0, 10).replace(/-/g, ""), id);
          created = ref;
          const agreement: Agreement = {
            id,
            ref,
            inquiryId,
            leadId: lead.id,
            clientId,
            orderId,
            customerToken: crypto.randomUUID(),
            staffToken: crypto.randomUUID(),
            payeeName: "",
            payeeBank: "",
            payeeAccount: "",
            signedName: "",
            signedAt: "",
            signedImage: "",
            firmSigner: "",
            firmSignedAt: "",
            firmSignImage: "",
            claimedMethod: "",
            claimedAt: "",
          };
          return {
            clients,
            orders: [
              {
                id: orderId,
                clientId,
                projectId: "",
                product: row.product,
                billing: row.billing,
                title: row.title.trim(),
                amountYuan,
                status: "待收款",
                blockReason: "",
              },
              ...s.orders,
            ],
            payments: [...payments, ...s.payments],
            deliverables: [...deliverables, ...s.deliverables],
            agreements: [agreement, ...(s.agreements ?? [])],
          };
        });
        return created;
      },
      setPayee: (id, patch) =>
        set((s) => ({
          agreements: (s.agreements ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),
      signAgreement: (ref, name, image) => {
        const signedName = name.trim();
        if (!signedName || !signatureOk(image)) return false;
        let ok = false;
        set((s) => {
          const sheet = (s.agreements ?? []).find((item) => item.ref === ref);
          if (!sheet || sheet.signedAt) return s;
          ok = true;
          return {
            agreements: s.agreements.map((item) =>
              item.ref === ref ? { ...item, signedName, signedImage: image, signedAt: new Date().toISOString() } : item,
            ),
          };
        });
        return ok;
      },
      countersign: (ref, image) => {
        if (!signatureOk(image)) return false;
        let ok = false;
        set((s) => {
          const signer = (s.firm ?? emptyFirm).signerName.trim();
          const sheet = (s.agreements ?? []).find((item) => item.ref === ref);
          if (!sheet || !sheet.signedAt || sheet.firmSignedAt || !signer) return s;
          ok = true;
          return {
            agreements: s.agreements.map((item) =>
              item.ref === ref
                ? { ...item, firmSigner: signer, firmSignImage: image, firmSignedAt: new Date().toISOString() }
                : item,
            ),
          };
        });
        return ok;
      },
      claimPrepaid: (ref, method) => {
        let ok = false;
        set((s) => {
          const firm = { ...emptyFirm, ...s.firm };
          const sheet = (s.agreements ?? []).find((item) => item.ref === ref);
          if (!sheet || !sheet.signedAt || !sheet.firmSignedAt || sheet.claimedAt || !methodReady(firm, method)) return s;
          ok = true;
          return {
            agreements: s.agreements.map((item) =>
              item.ref === ref ? { ...item, claimedMethod: method, claimedAt: new Date().toISOString() } : item,
            ),
          };
        });
        return ok;
      },
      applyRemote: (ref, patch) =>
        set((s) => ({
          agreements: (s.agreements ?? []).map((item) => {
            if (item.ref !== ref) return item;
            return {
              ...item,
              signedName: patch.signedAt ? patch.signedName || item.signedName : item.signedName,
              signedAt: patch.signedAt || item.signedAt,
              signedImage: patch.signedAt ? patch.signedImage || item.signedImage : item.signedImage,
              firmSigner: patch.firmSignedAt ? patch.firmSigner || item.firmSigner : item.firmSigner,
              firmSignedAt: patch.firmSignedAt || item.firmSignedAt,
              firmSignImage: patch.firmSignedAt ? patch.firmSignImage || item.firmSignImage : item.firmSignImage,
              claimedMethod: patch.claimedAt ? patch.claimedMethod || item.claimedMethod : item.claimedMethod,
              claimedAt: patch.claimedAt || item.claimedAt,
            };
          }),
        })),
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
      setReport: (patch) =>
        set((s) => {
          const report = { ...s.report, ...patch, block: "" };
          if (report.status === "已核验") {
            const gate = reportSignoff({
              status: report.status,
              preparer: report.preparer,
              reviewer: report.reviewer,
              counts: {
                added: report.added,
                invited: report.invited,
                diagnosed: report.diagnosed,
                listed: report.listed,
                quoted: report.quoted,
              },
            });
            if (!gate.ok) return { report: { ...s.report, block: gate.reason } };
          }
          return { report };
        }),
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
          const mine = s.orders.filter((order) => order.clientId === id);
          const received = s.payments
            .filter((line) => mine.some((order) => order.id === line.orderId))
            .reduce((sum, line) => sum + line.receivedYuan, 0);
          if (received > 0 || mine.some((order) => order.status !== "已取消" && order.status !== "草稿")) {
            return {
              clients: s.clients.map((client) =>
                client.id === id ? { ...client, block: "有未结束订单或实收，不能删除客户。" } : client,
              ),
            };
          }
          return {
            clients: s.clients.filter((client) => client.id !== id),
            projects: s.projects.filter((project) => project.clientId !== id),
          };
        }),
      forgetPrivate: (clientId) =>
        set((s) => {
          const gate = canForget(s.orders, s.payments, clientId);
          const client = s.clients.find((item) => item.id === clientId);
          if (!client) return s;
          if (!gate.ok) return { clients: s.clients.map((item) => (item.id === clientId ? { ...item, block: gate.reason } : item)) };
          const forgottenAt = new Date().toISOString();
          return {
            clients: s.clients.map((item) =>
              item.id === clientId ? { ...item, privateContact: "", publicChannel: "", consentPrivate: false, forgottenAt, block: "" } : item,
            ),
            leads: s.leads.map((lead) => (lead.id === client.leadId ? { ...lead, privateContact: "", publicChannel: "" } : lead)),
          };
        }),
      promoteLead: (leadId) =>
        set((s) => {
          if (s.clients.some((c) => c.leadId === leadId)) return s;
          const lead = s.leads.find((l) => l.id === leadId);
          if (!lead) return s;
          const gate = qualifyReady(lead.qualification);
          if (!gate.ok) {
            return { leads: s.leads.map((item) => (item.id === leadId ? { ...item, block: gate.reason } : item)) };
          }
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
          return {
            clients: [client, ...s.clients],
            leads: s.leads.map((item) => (item.id === leadId ? { ...item, block: "" } : item)),
          };
        }),
      setQualification: (leadId, patch) =>
        set((s) => ({
          leads: s.leads.map((lead) => {
            if (lead.id !== leadId) return lead;
            const current = lead.qualification ?? { fit: "" as const, reason: "", at: "" };
            const qualification = { ...current, ...patch };
            if (patch.fit) qualification.at = new Date().toISOString();
            return { ...lead, qualification, block: "" };
          }),
        })),
      setDiagnosis: (leadId, note) =>
        set((s) => ({
          leads: s.leads.map((lead) => (lead.id === leadId ? { ...lead, diagnosis: note, block: "" } : lead)),
        })),
      reviseAmount: (orderId, yuan, note) =>
        set((s) => {
          const order = s.orders.find((item) => item.id === orderId);
          if (!order) return s;
          const received = s.payments.filter((item) => item.orderId === orderId).reduce((sum, item) => sum + item.receivedYuan, 0);
          const revised = revisePrice({ status: order.status, nextYuan: yuan, note, received });
          if (!revised.ok) {
            return { orders: s.orders.map((item) => (item.id === orderId ? { ...item, blockReason: revised.reason } : item)) };
          }
          const orders = s.orders.map((item) =>
            item.id === orderId
              ? {
                  ...item,
                  amountYuan: revised.amountYuan,
                  changeNote: note.trim(),
                  blockReason: "",
                  priceLog: [...(item.priceLog ?? []), { at: new Date().toISOString(), fromYuan: order.amountYuan, toYuan: revised.amountYuan, note: note.trim() }],
                }
              : item,
          );
          if (order.status !== "待收款") return { orders };
          const payments = buildPlan(order.billing, revised.amountYuan).map((line) => ({
            ...line,
            id: uid(),
            orderId,
            method: "" as const,
          }));
          return { orders, payments: [...payments, ...s.payments.filter((item) => item.orderId !== orderId)] };
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
            method: "" as const,
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
              o.id === orderId ? { ...o, status: "待收款", blockReason: "", sop: sopItems(order.product).map((id) => ({ id, done: false })) } : o,
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
          const sheet = (s.agreements ?? []).find((item) => item.orderId === orderId);
          const contractReady = Boolean(sheet?.signedAt && sheet?.firmSignedAt);
          const reviewOk = reviewReady(items).ok;
          const admitted = admissionReady(order.admission).ok;
          const sopOk = sopReady(order.product, order.sop).ok;
          const hand = handoffReady(order.handoff);
          const move = gateMove(
            order.status,
            status,
            order.billing,
            lines,
            done,
            contractReady,
            reviewOk,
            admitted,
            order.product,
            sopOk,
            hand.ok,
          );
          const reason = move.ok ? "" : !hand.ok && status === "已交付" ? hand.reason : move.reason;
          return {
            orders: s.orders.map((o) =>
              o.id === orderId
                ? move.ok
                  ? { ...o, status, blockReason: "" }
                  : { ...o, blockReason: reason }
                : o,
            ),
          };
        }),
      recordReceipt: (paymentId, yuan, method, receiptRef) =>
        set((s) => {
          const payment = s.payments.find((item) => item.id === paymentId);
          if (!payment) return s;
          const ref = receiptRef.trim();
          if (ref.length < 4) {
            return {
              orders: s.orders.map((order) =>
                order.id === payment.orderId ? { ...order, blockReason: "实收增加要记下回单号。" } : order,
              ),
            };
          }
          const applied = applyReceipt(payment.receivedYuan, yuan);
          return {
            payments: s.payments.map((item) =>
              item.id === paymentId && applied.ok ? { ...item, receivedYuan: applied.receivedYuan, method, receiptRef: ref } : item,
            ),
            orders: s.orders.map((order) =>
              order.id === payment.orderId ? { ...order, blockReason: applied.ok ? "" : applied.reason } : order,
            ),
          };
        }),
      setReview: (orderId, preparer, reviewer) =>
        set((s) => {
          const left = preparer.trim();
          const right = reviewer.trim();
          const reviewedAt = left && right && left !== right ? new Date().toISOString() : "";
          return {
            deliverables: s.deliverables.map((item) =>
              item.orderId === orderId ? { ...item, preparer: left, reviewer: right, reviewedAt } : item,
            ),
          };
        }),
      setHandoff: (orderId, patch) =>
        set((s) => ({
          orders: s.orders.map((order) => {
            if (order.id !== orderId) return order;
            const current = order.handoff ?? { version: "", customerConfirmedAt: "", closeoutNote: "" };
            return { ...order, handoff: { ...current, ...patch }, blockReason: "" };
          }),
        })),
      setAdmission: (orderId, patch) =>
        set((s) => ({
          orders: s.orders.map((order) => {
            if (order.id !== orderId) return order;
            const current = order.admission ?? { scope: "", ndaAt: "", conflictClear: false, authorizedAt: "" };
            return { ...order, admission: { ...current, ...patch }, blockReason: "" };
          }),
        })),
      toggleSop: (orderId, id) =>
        set((s) => ({
          orders: s.orders.map((order) => {
            if (order.id !== orderId) return order;
            const sop = (order.sop ?? sopItems(order.product).map((item) => ({ id: item, done: false }))).map((item) =>
              item.id === id ? { ...item, done: !item.done } : item,
            );
            return { ...order, sop };
          }),
        })),
      reverseReceipt: (paymentId, yuan, reason) =>
        set((s) => {
          const payment = s.payments.find((item) => item.id === paymentId);
          if (!payment) return s;
          const applied = applyReversal(payment.receivedYuan, yuan, reason);
          return {
            payments: s.payments.map((item) =>
              item.id === paymentId && applied.ok
                ? { ...item, receivedYuan: applied.receivedYuan, reversalReason: reason.trim() }
                : item,
            ),
            orders: s.orders.map((order) =>
              order.id === payment.orderId ? { ...order, blockReason: applied.ok ? "" : applied.reason } : order,
            ),
          };
        }),
      toggleDeliverable: (id) =>
        set((s) => ({
          deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, done: !d.done } : d)),
        })),
      replaceDesk: (patch) => set(patch),
    }),
    { name: "finpivot-os-v1", storage: createJSONStorage(() => safeStorage), skipHydration: true },
  ),
);

export function hydrateDesk() {
  if (useOs.persist.hasHydrated()) return;
  void Promise.resolve(useOs.persist.rehydrate()).catch(() => undefined);
}

const DESK_KEYS = [
  "leads",
  "outreach",
  "answers",
  "risks",
  "diagAlias",
  "days",
  "templates",
  "articleChecked",
  "report",
  "hostingClients",
  "hostingFee",
  "exportOrders",
  "exportFee",
  "clients",
  "projects",
  "orders",
  "payments",
  "deliverables",
  "inquiries",
  "agreements",
  "firm",
] as const;

export function deskSnapshot() {
  const state = useOs.getState();
  const body: Record<string, unknown> = {};
  for (const key of DESK_KEYS) body[key] = state[key];
  return JSON.stringify(body);
}
