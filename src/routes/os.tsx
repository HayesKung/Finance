import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn, Field, Frame, Kicker, Note, Waiting, inputCls, areaCls } from "@/components/finpivot/frame";
import { META, STAGES, firstWeek, funnelMetrics, gates, rhythm } from "@/lib/finpivot/copy";
import { useHydrated, useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/os")({ component: OsPage });

function OsPage() {
  const ready = useHydrated();
  if (!ready) return <Waiting />;
  return (
    <Frame>
      <Kicker n="00">作战台</Kicker>
      <p className="max-w-3xl leading-relaxed text-muted">
        给 {META.owner} 跟踪、给 {META.reviewer} 核验。数据只存在这台浏览器里，不上传，也不当作已经成交。
      </p>
      <Counters />
      <WeekList />
      <Report />
      <Rhythm />
      <Model />
      <Gates />
    </Frame>
  );
}

function Counters() {
  const leads = useOs((s) => s.leads);
  const outreach = useOs((s) => s.outreach);
  const booked = outreach.filter((o) => o.result === "已约到").length;
  const byStage = STAGES.map((st) => ({ st, n: leads.filter((l) => l.stage === st).length }));
  return (
    <section className="mt-8 border-t border-ink pt-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat k="目标清单" v={`${leads.length}/100`} d="只计已录入的公开线索" />
        <Stat k="约访记录" v={`${outreach.length}`} d={`其中约到 ${booked}，目标 20 家诊断`} />
        <Stat k="检查点" v="11 月 4 日" d="20:00 前交清单、约访、跟踪" />
        <Stat k="网站先行" v="11 月 11 日" d="线框与文案已在本系统，上线仍待确认" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-px bg-rule md:grid-cols-6">
        {byStage.map((x) => (
          <div key={x.st} className="bg-paper p-3">
            <p className="text-xs text-muted">{x.st}</p>
            <p className="font-serif text-2xl tabular-nums">{x.n}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pipeline" className="inline-flex h-11 items-center border border-ink bg-ink px-4 text-sm text-paper">
          去补名单
        </Link>
        <Link to="/playbook" className="inline-flex h-11 items-center border border-rule px-4 text-sm">
          看四周获客
        </Link>
      </div>
      <p className="mt-4 text-sm text-muted">每周必看的五个漏斗数：{funnelMetrics.join("、")}。成交数不是这五个里的考核项。</p>
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
  const days = useOs((s) => s.days);
  const toggleDay = useOs((s) => s.toggleDay);
  const done = days.filter(Boolean).length;
  return (
    <section className="mt-10">
      <Kicker n="01">首周七天</Kicker>
      <p className="mb-4 text-sm text-muted">已勾 {done}/7。勾选只代表这台设备上的进度。</p>
      <ul className="border-t border-ink">
        {firstWeek.map((item, i) => (
          <li key={item} className="border-b border-rule">
            <button
              type="button"
              onClick={() => toggleDay(i)}
              className="flex w-full items-start gap-3 py-3 text-left"
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border text-xs ${
                  days[i] ? "border-seal bg-seal text-seal-ink" : "border-rule"
                }`}
              >
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

function Report() {
  const report = useOs((s) => s.report);
  const setReport = useOs((s) => s.setReport);
  return (
    <section className="mt-10">
      <Kicker n="02">周报底稿</Kicker>
      <Note>无报告不算交付。这里的数字要能回到名单和约访记录，不要手填一个对不上的成交。</Note>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Field label="周期">
          <input className={inputCls} value={report.range} onChange={(e) => setReport({ range: e.target.value })} />
        </Field>
        {(
          [
            ["added", "新增线索"],
            ["invited", "发出邀约"],
            ["diagnosed", "约到诊断"],
            ["listed", "已出风险清单"],
            ["quoted", "进入报价"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              className={inputCls}
              inputMode="numeric"
              value={report[key]}
              onChange={(e) => setReport({ [key]: e.target.value })}
            />
          </Field>
        ))}
      </div>
      <div className="mt-3">
        <Field label="本周事实与未完成原因">
          <textarea className={areaCls} value={report.note} onChange={(e) => setReport({ note: e.target.value })} />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["草稿", "待小m核验", "已核验"] as const).map((st) => (
          <Btn key={st} tone={report.status === st ? "seal" : "paper"} onClick={() => setReport({ status: st })}>
            {st}
          </Btn>
        ))}
      </div>
    </section>
  );
}

function Rhythm() {
  return (
    <section className="mt-10">
      <Kicker n="03">九十天节奏</Kicker>
      <div className="ledger">
        {rhythm.map((r) => (
          <div key={r.phase} className="ledger-row md:grid-cols-4">
            <p className="font-serif">{r.phase}</p>
            <p className="text-sm text-muted">{r.time}</p>
            <p className="text-sm leading-relaxed md:col-span-1">{r.do}</p>
            <p className="text-sm leading-relaxed text-muted">{r.done}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        如果三十天内一个诊断都约不到，问题大概率在邀约对象，不在能力。先只约老关系，或把诊断包降到 3000 元以内跑通 3 单。不要先去投广告。
      </p>
    </section>
  );
}

function Model() {
  const hostingClients = useOs((s) => s.hostingClients);
  const hostingFee = useOs((s) => s.hostingFee);
  const exportOrders = useOs((s) => s.exportOrders);
  const exportFee = useOs((s) => s.exportFee);
  const setModel = useOs((s) => s.setModel);
  const monthly = hostingClients * hostingFee + exportOrders * exportFee;
  return (
    <section className="mt-10">
      <Kicker n="04">收入测算示例</Kicker>
      <Note>只是示例，不是承诺。试点后按真实成交、价格与回款重算。默认数来自方案：3 个托管 × 15000，加 10 单出口包 × 2500。</Note>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Num label="托管客户数" value={hostingClients} onChange={(n) => setModel({ hostingClients: n })} />
        <Num label="托管月费（元）" value={hostingFee} onChange={(n) => setModel({ hostingFee: n })} />
        <Num label="出口单量 / 月" value={exportOrders} onChange={(n) => setModel({ exportOrders: n })} />
        <Num label="出口单价（元）" value={exportFee} onChange={(n) => setModel({ exportFee: n })} />
      </div>
      <p className="mt-4 font-serif text-3xl tabular-nums">
        {monthly.toLocaleString("zh-CN")}
        <span className="ml-2 text-base text-muted">元 / 月 · 示例</span>
      </p>
    </section>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <Field label={label}>
      <input
        className={inputCls}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
      />
    </Field>
  );
}

function Gates() {
  return (
    <section className="mt-10">
      <Kicker n="05">先立红线再接单</Kicker>
      <ul className="grid gap-2">
        {gates.map((g) => (
          <li key={g} className="border-b border-rule py-3 text-sm leading-relaxed">
            {g}
          </li>
        ))}
      </ul>
    </section>
  );
}
