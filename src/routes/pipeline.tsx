import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Btn, CanonSelect, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { OUTREACH_RESULTS, PRODUCTS, SOURCES, STAGES } from "@/lib/finpivot/copy";
import { canon } from "@/lib/finpivot/glossary";
import { useI18n } from "@/lib/finpivot/locale";
import { leadCount } from "@/lib/finpivot/ui";
import { BILLINGS, type Billing } from "@/lib/finpivot/flow";
import { needToProduct } from "@/lib/finpivot/inquiry";
import { pushSheet } from "@/lib/finpivot/publish-client";
import { useOs, type Lead, type Outreach, type Source, type Stage } from "@/lib/finpivot/store";

export const Route = createFileRoute("/pipeline")({ component: PipelinePage });

const empty = {
  alias: "",
  company: "",
  industry: "",
  direction: "",
  market: "",
  publicChannel: "",
  source: "老关系" as Source,
  stage: "线索" as Stage,
  product: "未定" as Lead["product"],
  next: "",
  nextDate: "",
  note: "",
  consentPrivate: false,
  privateContact: "",
};

const SCENES = ["老关系", "转介绍", "内容来询"] as const;

function PipelinePage() {
  const { locale, t, show } = useI18n();
  const leads = useOs((s) => s.leads);
  const inquiries = useOs((s) => s.inquiries ?? []);
  const acceptInquiry = useOs((s) => s.acceptInquiry);
  const declineInquiry = useOs((s) => s.declineInquiry);
  const agreements = useOs((s) => s.agreements ?? []);
  const quoteInquiry = useOs((s) => s.quoteInquiry);
  const [quoteFor, setQuoteFor] = useState("");
  const [fee, setFee] = useState("");
  const [matter, setMatter] = useState("");
  const [bill, setBill] = useState<Billing>("按单");
  const addLead = useOs((s) => s.addLead);
  const updateLead = useOs((s) => s.updateLead);
  const removeLead = useOs((s) => s.removeLead);
  const promoteLead = useOs((s) => s.promoteLead);
  const clients = useOs((s) => s.clients);
  const importLeads = useOs((s) => s.importLeads);
  const outreach = useOs((s) => s.outreach);
  const addOutreach = useOs((s) => s.addOutreach);
  const removeOutreach = useOs((s) => s.removeOutreach);
  const [form, setForm] = useState(empty);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<Stage | "全部">("全部");
  const [warn, setWarn] = useState("");
  const [oform, setOform] = useState<Omit<Outreach, "id">>({
    alias: "",
    scene: "老关系",
    date: "",
    result: "未回复",
    reason: "",
    next: "",
  });

  const shown = useMemo(
    () =>
      leads.filter((l) => {
        if (stage !== "全部" && l.stage !== stage) return false;
        const blob = `${l.alias}${l.company}${l.industry}${l.market}${l.direction}`.toLowerCase();
        return blob.includes(q.trim().toLowerCase());
      }),
    [leads, q, stage],
  );

  const onPublic = (v: string) => {
    setForm({ ...form, publicChannel: v });
    setWarn(/1[3-9]\d{9}/.test(v) ? t("phoneWarn") : "");
  };

  const submit = () => {
    if (!form.alias.trim() || !form.company.trim()) return;
    addLead(form);
    setForm(empty);
    setWarn("");
  };

  const exportCsv = () => {
    const head = locale === "en"
      ? ["Alias", "Public company", "Industry", "Direction", "Overseas market", "Public channel", "Source", "Stage", "Product", "Next", "Date", "Note"]
      : ["脱敏简称", "企业名", "行业", "方向", "出海市场", "公开联系渠道", "来源", "阶段", "产品", "下一步", "日期", "备注"];
    const rows = leads.map((l) =>
      [l.alias, l.company, l.industry, l.direction, l.market, l.publicChannel, show(l.source), show(l.stage), show(l.product), l.next, l.nextDate, l.note]
        .map(csvCell)
        .join(","),
    );
    download(`pipeline-${leads.length}.csv`, `\uFEFF${[head.join(","), ...rows].join("\n")}`);
  };

  const onImport = async (file: File) => {
    const text = (await file.text()).replace(/^\uFEFF/, "");
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const body = lines.slice(1);
    const parsed: Omit<Lead, "id">[] = [];
    body.forEach((line) => {
      const c = splitCsv(line);
      if (!c[0] || !c[1]) return;
      const source = SOURCES.includes(canon(c[6] ?? "") as Source) ? (canon(c[6] ?? "") as Source) : "公开信息";
      const st = STAGES.includes(canon(c[7] ?? "") as Stage) ? (canon(c[7] ?? "") as Stage) : "线索";
      const product = PRODUCTS.includes(canon(c[8] ?? "") as Lead["product"]) ? (canon(c[8] ?? "") as Lead["product"]) : "未定";
      parsed.push({
        alias: c[0],
        company: c[1],
        industry: c[2] ?? "",
        direction: c[3] ?? "",
        market: c[4] ?? "",
        publicChannel: c[5] ?? "",
        source,
        stage: st,
        product,
        next: c[9] ?? "",
        nextDate: c[10] ?? "",
        note: c[11] ?? "",
        consentPrivate: false,
        privateContact: "",
      });
    });
    if (parsed.length) importLeads(parsed);
  };

  return (
    <Frame>
      <Kicker n="05">{t("inqKicker")}</Kicker>
      {inquiries.length === 0 ? (
        <Note>{t("inqEmpty")}</Note>
      ) : (
        <ul className="border-t border-ink">
          {inquiries.map((item) => {
            const sheet = agreements.find((a) => a.inquiryId === item.id);
            return (
            <li key={item.id} className="grid gap-3 border-b border-rule py-4 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <p className="font-serif text-xl">{item.ref}</p>
                <p className="mt-1 text-sm">
                  {item.company} · {item.contactName} · {item.market || "—"} · {show(item.need)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {show(item.status)} · {item.createdAt.slice(0, 10)} · {item.contact}
                </p>
                {item.note ? <p className="mt-1 text-sm leading-relaxed text-muted">{item.note}</p> : null}
                {sheet ? <p className="mt-2 text-sm">{sheet.ref}</p> : null}
              </div>
              {item.status === "待处理" ? (
                <div className="flex flex-col gap-2 md:col-span-4 md:items-end">
                  <Btn onClick={() => acceptInquiry(item.id)}>{t("inqAccept")}</Btn>
                  <Btn tone="paper" onClick={() => declineInquiry(item.id)}>{t("inqDecline")}</Btn>
                </div>
              ) : null}
              {item.status === "已转入名单" && !sheet ? (
                <div className="grid gap-2 md:col-span-12">
                  {quoteFor === item.id ? (
                    <>
                      <div className="grid gap-2 md:grid-cols-3">
                        <Field label={t("quoteTitle")}>
                          <input className={inputCls} value={matter} onChange={(e) => setMatter(e.target.value)} />
                        </Field>
                        <Field label={t("billing")}>
                          <CanonSelect value={bill} options={BILLINGS} onChange={(value) => setBill(value as Billing)} />
                        </Field>
                        <Field label={t("quoteFee")}>
                          <input className={inputCls} inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value.replace(/[^\d]/g, ""))} />
                        </Field>
                      </div>
                      <div>
                        <Btn
                          onClick={() => {
                            const amountYuan = Number(fee);
                            if (!matter.trim() || !amountYuan) return;
                            const ref = quoteInquiry(item.id, {
                              product: needToProduct(item.need),
                              billing: bill,
                              title: matter.trim(),
                              amountYuan,
                            });
                            const snap = useOs.getState();
                            const sheet = snap.agreements.find((entry) => entry.ref === ref);
                            const order = sheet ? snap.orders.find((entry) => entry.id === sheet.orderId) : undefined;
                            const client = sheet ? snap.clients.find((entry) => entry.id === sheet.clientId) : undefined;
                            if (!sheet || !order) return;
                            const lines = snap.payments.filter((entry) => entry.orderId === order.id);
                            const items = snap.deliverables.filter((entry) => entry.orderId === order.id);
                            void pushSheet({
                              sheet,
                              firm: snap.firm,
                              company: client?.company ?? "",
                              product: order.product,
                              title: order.title,
                              billing: order.billing,
                              amountYuan: order.amountYuan,
                              dueLabel: lines[0]?.label ?? "",
                              dueYuan: lines[0]?.expectedYuan ?? 0,
                              deliverables: items.map((entry) => entry.name),
                              receivedYuan: lines[0]?.receivedYuan ?? 0,
                            });
                          }}
                        >
                          {t("quoteIssue")}
                        </Btn>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Btn
                        onClick={() => {
                          setQuoteFor(item.id);
                          setMatter(item.company);
                        }}
                      >
                        {t("quoteOpen")}
                      </Btn>
                    </div>
                  )}
                </div>
              ) : null}
              {sheet ? (
                <div className="md:col-span-4 md:text-right">
                  <a className="inline-flex h-11 items-center text-sm underline decoration-rule underline-offset-4" href={sheet.customerToken ? `/sign?t=${encodeURIComponent(sheet.customerToken)}` : `/sign?ref=${encodeURIComponent(sheet.ref)}`}>
                    {t("openSign")}
                  </a>
                </div>
              ) : null}
            </li>
            );
          })}
        </ul>
      )}

      <div className="mt-14">
      <Kicker n="06">{t("pipeKicker")}</Kicker>
      <Note>
        {t("pipeNote")} {leadCount(locale, leads.length)}
      </Note>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Field label={t("aliasLabel")}>
          <input className={inputCls} value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} />
        </Field>
        <Field label={t("company")}>
          <input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
        <Field label={t("industry")}>
          <input className={inputCls} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        </Field>
        <Field label={t("directionLong")}>
          <input className={inputCls} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} />
        </Field>
        <Field label={t("market")}>
          <input className={inputCls} value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} />
        </Field>
        <Field label={t("publicChannel")}>
          <input className={inputCls} value={form.publicChannel} onChange={(e) => onPublic(e.target.value)} />
        </Field>
        <Field label={t("source")}>
          <CanonSelect value={form.source} options={SOURCES} onChange={(value) => setForm({ ...form, source: value as Source })} />
        </Field>
        <Field label={t("stage")}>
          <CanonSelect value={form.stage} options={STAGES} onChange={(value) => setForm({ ...form, stage: value as Stage })} />
        </Field>
        <Field label={t("productIntent")}>
          <CanonSelect value={form.product} options={PRODUCTS} onChange={(value) => setForm({ ...form, product: value as Lead["product"] })} />
        </Field>
        <Field label={t("next")}>
          <input className={inputCls} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
        </Field>
        <Field label={t("date")}>
          <input className={inputCls} type="date" value={form.nextDate} onChange={(e) => setForm({ ...form, nextDate: e.target.value })} />
        </Field>
        <Field label={t("note")}>
          <input className={inputCls} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </Field>
      </div>
      {warn ? <p className="mt-3 text-sm text-seal">{warn}</p> : null}
      <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5"
          checked={form.consentPrivate}
          onChange={(e) => setForm({ ...form, consentPrivate: e.target.checked, privateContact: e.target.checked ? form.privateContact : "" })}
        />
        {t("consent")}
      </label>
      {form.consentPrivate ? (
        <div className="mt-3 max-w-md">
          <Field label={t("privateLabel")}>
            <input className={inputCls} value={form.privateContact} onChange={(e) => setForm({ ...form, privateContact: e.target.value })} />
          </Field>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn onClick={submit}>{t("saveLead")}</Btn>
        <Btn tone="paper" onClick={exportCsv}>{t("exportCsv")}</Btn>
        <label className="inline-flex h-11 cursor-pointer items-center border border-rule px-4 text-sm">
          {t("importCsv")}
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImport(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <Field label={t("search")}>
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")} />
        </Field>
        <Field label={t("stageFilter")}>
          <CanonSelect
            value={stage}
            options={STAGES}
            blank={{ value: "全部", label: show("全部") }}
            onChange={(value) => setStage(value as Stage | "全部")}
          />
        </Field>
      </div>

      <ul className="mt-4 border-t border-ink">
        {shown.length === 0 ? (
          <li className="border-b border-rule py-6 text-sm text-muted">{t("emptyLeads")}</li>
        ) : (
          shown.map((l) => (
            <li key={l.id} className="grid gap-2 border-b border-rule py-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-medium">{l.alias}</p>
                <p className="text-sm text-muted">{l.company}</p>
                <p className="mt-1 text-sm">{l.industry} · {l.direction} · {l.market}</p>
              </div>
              <div className="text-sm leading-relaxed md:col-span-4">
                <p>{show(l.source)} · {show(l.product)}</p>
                <p className="text-muted">{l.publicChannel || t("noChannel")}</p>
                <p>{t("nextPrefix")}：{l.next || t("unwritten")} {l.nextDate}</p>
                {l.consentPrivate ? <p className="text-seal">{t("privateKept")}</p> : null}
              </div>
              <div className="flex flex-wrap items-start gap-2 md:col-span-4">
                <CanonSelect className="h-11 border border-rule bg-paper px-2 text-sm" value={l.stage} options={STAGES} onChange={(value) => updateLead(l.id, { stage: value as Stage })} />
                <Btn tone="paper" onClick={() => removeLead(l.id)}>{t("remove")}</Btn>
                <Btn tone={clients.some((c) => c.leadId === l.id) ? "seal" : "paper"} onClick={() => promoteLead(l.id)}>
                  {clients.some((c) => c.leadId === l.id) ? t("promoted") : t("promote")}
                </Btn>
              </div>
            </li>
          ))
        )}
      </ul>

      <section className="mt-12">
        <Kicker n="06">{t("outKicker")}</Kicker>
        <p className="text-sm text-muted">{t("outNote")}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label={t("aliasLabel")}>
            <input className={inputCls} value={oform.alias} onChange={(e) => setOform({ ...oform, alias: e.target.value })} />
          </Field>
          <Field label={t("scene")}>
            <CanonSelect value={oform.scene} options={SCENES} onChange={(value) => setOform({ ...oform, scene: value as Outreach["scene"] })} />
          </Field>
          <Field label={t("date")}>
            <input className={inputCls} type="date" value={oform.date} onChange={(e) => setOform({ ...oform, date: e.target.value })} />
          </Field>
          <Field label={t("result")}>
            <CanonSelect value={oform.result} options={OUTREACH_RESULTS} onChange={(value) => setOform({ ...oform, result: value as Outreach["result"] })} />
          </Field>
          <Field label={t("reason")}>
            <input className={inputCls} value={oform.reason} onChange={(e) => setOform({ ...oform, reason: e.target.value })} />
          </Field>
          <Field label={t("next")}>
            <input className={inputCls} value={oform.next} onChange={(e) => setOform({ ...oform, next: e.target.value })} />
          </Field>
        </div>
        <div className="mt-3">
          <Btn
            onClick={() => {
              if (!oform.alias.trim()) return;
              addOutreach(oform);
              setOform({ alias: "", scene: "老关系", date: "", result: "未回复", reason: "", next: "" });
            }}
          >
            {t("saveOut")}
          </Btn>
        </div>
        <ul className="mt-4 border-t border-ink">
          {outreach.length === 0 ? (
            <li className="py-4 text-sm text-muted">{t("emptyOut")}</li>
          ) : (
            outreach.map((o) => (
              <li key={o.id} className="flex flex-col gap-1 border-b border-rule py-3 text-sm md:flex-row md:items-center md:justify-between">
                <p>
                  <span className="font-medium">{o.alias}</span>
                  <span className="text-muted"> · {show(o.scene)} · {o.date || t("noDate")} · {show(o.result)}</span>
                </p>
                <p className="text-muted">{o.reason} {o.next}</p>
                <Btn tone="paper" onClick={() => removeOutreach(o.id)}>{t("remove")}</Btn>
              </li>
            ))
          )}
        </ul>
      </section>
      </div>
    </Frame>
  );
}

function csvCell(v: string) {
  const s = v.replaceAll('"', '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function splitCsv(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function download(name: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
