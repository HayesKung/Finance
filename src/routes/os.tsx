import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, CanonSelect, Field, Frame, Kicker, Note, inputCls, areaCls } from "@/components/finpivot/frame";
import { META, STAGES } from "@/lib/finpivot/copy";
import { canon } from "@/lib/finpivot/glossary";
import { monthCloseReady } from "@/lib/finpivot/flow";
import { useI18n } from "@/lib/finpivot/locale";
import { requireStaffPage } from "@/lib/finpivot/staff-gate";
import { deskHealth } from "@/lib/finpivot/staff-api";
import { outreachDetail, perMonth, weekProgress } from "@/lib/finpivot/ui";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/os")({ beforeLoad: () => requireStaffPage(), component: OsPage });

function OsPage() {
  const { t } = useI18n();
  return (
    <Frame>
      <Kicker n="00">{t("navOs")}</Kicker>
      <p className="max-w-3xl leading-relaxed text-muted">
        {META.owner} / {META.reviewer}. {t("osLede")}
      </p>
      <Counters />
      <HealthLine />
      <MonthLine />
      <WeekList />
      <Report />
      <Rhythm />
      <Model />
      <Gates />
    </Frame>
  );
}

function Counters() {
  const { locale, t, show, copy } = useI18n();
  const leads = useOs((s) => s.leads);
  const inquiries = useOs((s) => s.inquiries ?? []);
  const waiting = inquiries.filter((item) => item.status === "待处理").length;
  const outreach = useOs((s) => s.outreach);
  const booked = outreach.filter((o) => o.result === "已约到").length;
  const byStage = STAGES.map((st) => ({ st, n: leads.filter((l) => l.stage === st).length }));
  return (
    <section className="mt-8 border-t border-ink pt-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat k={t("statLeads")} v={`${leads.length}/100`} d={t("statLeadsD")} />
        <Stat k={t("statOutreach")} v={`${outreach.length}`} d={outreachDetail(locale, booked)} />
        <Stat k={t("statCheck")} v={t("checkNov4")} d={t("statCheckD")} />
        <Stat k={t("statSite")} v={t("siteNov11")} d={t("statSiteD")} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-px bg-rule md:grid-cols-6">
        {byStage.map((x) => (
          <div key={x.st} className="bg-paper p-3">
            <p className="text-xs text-muted">{show(x.st)}</p>
            <p className="font-serif text-2xl tabular-nums">{x.n}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pipeline" className="inline-flex h-11 items-center border border-ink bg-ink px-4 text-sm text-paper">{t("goLeads")}</Link>
        <Link to="/orders" className="inline-flex h-11 items-center border border-rule px-4 text-sm">{t("goOrders")}</Link>
      </div>
      <p className="mt-4 text-sm text-muted">{t("inqPending")}：{waiting}</p>
      <p className="mt-4 text-sm text-muted">{t("funnelPrefix")}：{copy.funnelMetrics.join(locale === "en" ? ", " : "、")}。{t("funnelSuffix")}</p>
    </section>
  );
}

function Stat({ k, v, d }: { k: string; v: string; d: string }) {
  return (
    <div className="border border-rule p-4">
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-1 font-serif text-2xl">{v}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
    </div>
  );
}

function WeekList() {
  const { locale, t, copy } = useI18n();
  const days = useOs((s) => s.days);
  const toggleDay = useOs((s) => s.toggleDay);
  const done = days.filter(Boolean).length;
  return (
    <section className="mt-10">
      <Kicker n="01">{t("weekKicker")}</Kicker>
      <p className="mb-4 text-sm text-muted">{weekProgress(locale, done)}</p>
      <ul className="border-t border-ink">
        {copy.firstWeek.map((item, i) => (
          <li key={item} className="border-b border-rule">
            <button type="button" onClick={() => toggleDay(i)} className="flex w-full items-start gap-3 py-3 text-left">
              <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border text-xs ${days[i] ? "border-seal bg-seal text-seal-ink" : "border-rule"}`}>
                {days[i] ? "✓" : i + 1}
              </span>
              <span className={`text-sm leading-relaxed ${days[i] ? "text-muted" : ""}`}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MonthLine() {
  const { t, show } = useI18n();
  const orders = useOs((s) => s.orders);
  const gate = monthCloseReady(orders);
  return (
    <p className="mt-2 text-sm text-muted">
      {t("monthClose")} · {gate.ok ? t("healthOn") : show(gate.reason)}
    </p>
  );
}

function HealthLine() {
  const { t } = useI18n();
  const [health, setHealth] = useState<{ db: boolean; accessSchema: boolean } | null>(null);
  useEffect(() => {
    void deskHealth()
      .then((row) => setHealth(row))
      .catch(() => setHealth({ db: false, accessSchema: false }));
  }, []);
  if (!health) return null;
  return (
    <p className="mt-4 text-sm text-muted">
      {t("healthDb")} {health.db ? t("healthOn") : t("healthOff")} · {t("healthSchema")} {health.accessSchema ? t("healthOn") : t("healthOff")}
    </p>
  );
}

function Report() {
  const { t, show } = useI18n();
  const report = useOs((s) => s.report);
  const setReport = useOs((s) => s.setReport);
  const fields = [
    ["added", "added"],
    ["invited", "invited"],
    ["diagnosed", "diagnosed"],
    ["listed", "listed"],
    ["quoted", "quoted"],
  ] as const;
  return (
    <section className="mt-10">
      <Kicker n="02">{t("reportKicker")}</Kicker>
      <Note>{t("reportNote")}</Note>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Field label={t("period")}>
          <input className={inputCls} value={show(report.range)} onChange={(e) => setReport({ range: canon(e.target.value) })} />
        </Field>
        {fields.map(([key, label]) => (
          <Field key={key} label={t(label)}>
            <input className={inputCls} inputMode="numeric" value={report[key]} onChange={(e) => setReport({ [key]: e.target.value })} />
          </Field>
        ))}
      </div>
      <div className="mt-3">
        <Field label={t("factNote")}>
          <textarea className={areaCls} value={report.note} onChange={(e) => setReport({ note: e.target.value })} />
        </Field>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Field label={t("preparer")}>
          <input className={inputCls} value={report.preparer ?? ""} onChange={(e) => setReport({ preparer: e.target.value })} />
        </Field>
        <Field label={t("reviewer")}>
          <input className={inputCls} value={report.reviewer ?? ""} onChange={(e) => setReport({ reviewer: e.target.value })} />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["草稿", "待小m核验", "已核验"] as const).map((st) => (
          <Btn key={st} tone={report.status === st ? "seal" : "paper"} onClick={() => setReport({ status: st })}>
            {show(st)}
          </Btn>
        ))}
      </div>
      {report.block ? <p className="mt-2 text-sm text-seal">{show(report.block)}</p> : null}
    </section>
  );
}

function Rhythm() {
  const { t, copy } = useI18n();
  return (
    <section className="mt-10">
      <Kicker n="03">{t("rhythmKicker")}</Kicker>
      <div className="ledger">
        {copy.rhythm.map((r) => (
          <div key={r.phase} className="ledger-row md:grid-cols-4">
            <p className="font-serif">{r.phase}</p>
            <p className="text-sm text-muted">{r.time}</p>
            <p className="text-sm leading-relaxed">{r.do}</p>
            <p className="text-sm leading-relaxed text-muted">{r.done}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{t("rhythmWarn")}</p>
    </section>
  );
}

function Model() {
  const { locale, t } = useI18n();
  const hostingClients = useOs((s) => s.hostingClients);
  const hostingFee = useOs((s) => s.hostingFee);
  const exportOrders = useOs((s) => s.exportOrders);
  const exportFee = useOs((s) => s.exportFee);
  const setModel = useOs((s) => s.setModel);
  const monthly = hostingClients * hostingFee + exportOrders * exportFee;
  return (
    <section className="mt-10">
      <Kicker n="04">{t("modelKicker")}</Kicker>
      <Note>{t("modelNote")}</Note>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Num label={t("hostN")} value={hostingClients} onChange={(n) => setModel({ hostingClients: n })} />
        <Num label={t("hostFee")} value={hostingFee} onChange={(n) => setModel({ hostingFee: n })} />
        <Num label={t("exportN")} value={exportOrders} onChange={(n) => setModel({ exportOrders: n })} />
        <Num label={t("exportFee")} value={exportFee} onChange={(n) => setModel({ exportFee: n })} />
      </div>
      <p className="mt-4 font-serif text-3xl tabular-nums">
        {new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN", { maximumFractionDigits: 0 }).format(monthly)}
        <span className="ml-2 text-base text-muted">{perMonth(locale)}</span>
      </p>
    </section>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <Field label={label}>
      <input className={inputCls} inputMode="numeric" value={value} onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)} />
    </Field>
  );
}

function Gates() {
  const { t, copy } = useI18n();
  return (
    <section className="mt-10">
      <Kicker n="05">{t("gatesKicker")}</Kicker>
      <ul className="grid gap-2">
        {copy.gates.map((g) => (
          <li key={g} className="border-b border-rule py-3 text-sm leading-relaxed">{g}</li>
        ))}
      </ul>
    </section>
  );
}
