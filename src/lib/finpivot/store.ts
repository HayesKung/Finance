import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    }),
    { name: "finpivot-os-v1" },
  ),
);

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const persistApi = useOs.persist;
    if (persistApi.hasHydrated()) setReady(true);
    return persistApi.onFinishHydration(() => setReady(true));
  }, []);
  return ready;
}
