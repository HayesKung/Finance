import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Btn, Field, Frame, Kicker, Note, Waiting, inputCls } from "@/components/finpivot/frame";
import { PRODUCTS, SOURCES, STAGES } from "@/lib/finpivot/copy";
import { useHydrated, useOs, type Lead, type Outreach, type Source, type Stage } from "@/lib/finpivot/store";

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

function PipelinePage() {
  const ready = useHydrated();
  const leads = useOs((s) => s.leads);
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

  if (!ready) return <Waiting />;

  const onPublic = (v: string) => {
    setForm({ ...form, publicChannel: v });
    setWarn(/1[3-9]\d{9}/.test(v) ? "这像私人手机号。公开渠道只记官网、总机、公开邮箱。私人号放到下面，且须对方同意。" : "");
  };

  const submit = () => {
    if (!form.alias.trim() || !form.company.trim()) return;
    addLead(form);
    setForm(empty);
    setWarn("");
  };

  const exportCsv = () => {
    const head = ["脱敏简称", "企业名", "行业", "方向", "出海市场", "公开联系渠道", "来源", "阶段", "产品", "下一步", "日期", "备注"];
    const rows = leads.map((l) =>
      [l.alias, l.company, l.industry, l.direction, l.market, l.publicChannel, l.source, l.stage, l.product, l.next, l.nextDate, l.note]
        .map(csvCell)
        .join(","),
    );
    download(`pipeline-${leads.length}.csv`, [head.join(","), ...rows].join("\n"));
  };

  const onImport = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const body = lines.slice(1);
    const parsed: Omit<Lead, "id">[] = [];
    body.forEach((line) => {
      const c = splitCsv(line);
      if (!c[0] || !c[1]) return;
      const source = SOURCES.includes(c[6] as Source) ? (c[6] as Source) : "公开信息";
      const st = STAGES.includes(c[7] as Stage) ? (c[7] as Stage) : "线索";
      const product = PRODUCTS.includes(c[8] as Lead["product"]) ? (c[8] as Lead["product"]) : "未定";
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
      <Kicker n="05">一百家目标与约访</Kicker>
      <Note>
        来源只有三类：老关系、合作方推荐、公开信息。不买名单，不爬私人联系方式。企业名用公开名称，对外材料只用脱敏简称。当前 {leads.length} 家，空表不是编造的客户。
      </Note>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Field label="脱敏简称">
          <input className={inputCls} value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} />
        </Field>
        <Field label="公开企业名">
          <input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
        <Field label="行业">
          <input className={inputCls} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        </Field>
        <Field label="产品或工程方向">
          <input className={inputCls} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} />
        </Field>
        <Field label="出海市场">
          <input className={inputCls} value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} />
        </Field>
        <Field label="公开联系渠道">
          <input className={inputCls} value={form.publicChannel} onChange={(e) => onPublic(e.target.value)} />
        </Field>
        <Field label="来源">
          <select className={inputCls} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Source })}>
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="阶段">
          <select className={inputCls} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as Stage })}>
            {STAGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="产品意向">
          <select className={inputCls} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value as Lead["product"] })}>
            {PRODUCTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="下一步">
          <input className={inputCls} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
        </Field>
        <Field label="日期">
          <input className={inputCls} type="date" value={form.nextDate} onChange={(e) => setForm({ ...form, nextDate: e.target.value })} />
        </Field>
        <Field label="备注">
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
        对方已同意交换私人电话或微信。未勾选时不保存私人联系方式，导出也不含这一栏。
      </label>
      {form.consentPrivate ? (
        <div className="mt-3 max-w-md">
          <Field label="私人联系方式（仅本机）">
            <input className={inputCls} value={form.privateContact} onChange={(e) => setForm({ ...form, privateContact: e.target.value })} />
          </Field>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn onClick={submit}>记入清单</Btn>
        <Btn tone="paper" onClick={exportCsv}>导出公开字段</Btn>
        <label className="inline-flex h-11 cursor-pointer items-center border border-rule px-4 text-sm">
          导入 CSV
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
        <Field label="搜索">
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="简称、企业、市场" />
        </Field>
        <Field label="阶段筛选">
          <select className={inputCls} value={stage} onChange={(e) => setStage(e.target.value as Stage | "全部")}>
            <option>全部</option>
            {STAGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <ul className="mt-4 border-t border-ink">
        {shown.length === 0 ? (
          <li className="border-b border-rule py-6 text-sm text-muted">还没有线索。先从最熟的老关系里记公开信息，不要填示例公司充数。</li>
        ) : (
          shown.map((l) => (
            <li key={l.id} className="grid gap-2 border-b border-rule py-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-medium">{l.alias}</p>
                <p className="text-sm text-muted">{l.company}</p>
                <p className="mt-1 text-sm">{l.industry} · {l.direction} · {l.market}</p>
              </div>
              <div className="text-sm leading-relaxed md:col-span-4">
                <p>{l.source} · {l.product}</p>
                <p className="text-muted">{l.publicChannel || "未记公开渠道"}</p>
                <p>下一步：{l.next || "未写"} {l.nextDate}</p>
                {l.consentPrivate ? <p className="text-seal">已同意交换私人联系方式，仅留在本机。</p> : null}
              </div>
              <div className="flex flex-wrap items-start gap-2 md:col-span-4">
                <select className="h-11 border border-rule bg-paper px-2 text-sm" value={l.stage} onChange={(e) => updateLead(l.id, { stage: e.target.value as Stage })}>
                  {STAGES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <Btn tone="paper" onClick={() => removeLead(l.id)}>移除</Btn>
                <Btn
                  tone={clients.some((c) => c.leadId === l.id) ? "seal" : "paper"}
                  onClick={() => promoteLead(l.id)}
                >
                  {clients.some((c) => c.leadId === l.id) ? "已建档" : "升为客户"}
                </Btn>
              </div>
            </li>
          ))
        )}
      </ul>

      <section className="mt-12">
        <Kicker n="06">约访执行记录</Kicker>
        <p className="text-sm text-muted">未约到要写原因。不要把没发生的约访写成已约到。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label="脱敏简称">
            <input className={inputCls} value={oform.alias} onChange={(e) => setOform({ ...oform, alias: e.target.value })} />
          </Field>
          <Field label="场景">
            <select className={inputCls} value={oform.scene} onChange={(e) => setOform({ ...oform, scene: e.target.value as Outreach["scene"] })}>
              <option>老关系</option>
              <option>转介绍</option>
              <option>内容来询</option>
            </select>
          </Field>
          <Field label="日期">
            <input className={inputCls} type="date" value={oform.date} onChange={(e) => setOform({ ...oform, date: e.target.value })} />
          </Field>
          <Field label="结果">
            <select className={inputCls} value={oform.result} onChange={(e) => setOform({ ...oform, result: e.target.value as Outreach["result"] })}>
              <option>未回复</option>
              <option>已约到</option>
              <option>拒绝</option>
              <option>改期</option>
              <option>不合适</option>
            </select>
          </Field>
          <Field label="原因或情况">
            <input className={inputCls} value={oform.reason} onChange={(e) => setOform({ ...oform, reason: e.target.value })} />
          </Field>
          <Field label="下一步">
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
            记下这次约访
          </Btn>
        </div>
        <ul className="mt-4 border-t border-ink">
          {outreach.length === 0 ? (
            <li className="py-4 text-sm text-muted">还没有约访记录。目标是 20 家免费诊断的执行记录，不是 20 个成交。</li>
          ) : (
            outreach.map((o) => (
              <li key={o.id} className="flex flex-col gap-1 border-b border-rule py-3 text-sm md:flex-row md:items-center md:justify-between">
                <p>
                  <span className="font-medium">{o.alias}</span>
                  <span className="text-muted"> · {o.scene} · {o.date || "未写日期"} · {o.result}</span>
                </p>
                <p className="text-muted">{o.reason} {o.next}</p>
                <Btn tone="paper" onClick={() => removeOutreach(o.id)}>移除</Btn>
              </li>
            ))
          )}
        </ul>
      </section>
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
