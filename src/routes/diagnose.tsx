import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Btn, Field, Frame, Kicker, Note, Waiting, areaCls, inputCls } from "@/components/finpivot/frame";
import { IMPACTS, closeScript, questionGroups } from "@/lib/finpivot/copy";
import { useHydrated, useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/diagnose")({ component: DiagnosePage });

function DiagnosePage() {
  const ready = useHydrated();
  const [copied, setCopied] = useState(false);
  const answers = useOs((s) => s.answers);
  const setAnswer = useOs((s) => s.setAnswer);
  const risks = useOs((s) => s.risks);
  const addRisk = useOs((s) => s.addRisk);
  const updateRisk = useOs((s) => s.updateRisk);
  const removeRisk = useOs((s) => s.removeRisk);
  const alias = useOs((s) => s.diagAlias);
  const setAlias = useOs((s) => s.setDiagAlias);

  const markdown = useMemo(() => {
    const lines = [
      `# 诊断风险清单`,
      `客户脱敏简称：${alias || "（未填）"}`,
      `规则：只给风险清单，不给完整方案。不预测汇率，不承诺退税、贷款与回款。`,
      ``,
      `## 已问到的情况`,
    ];
    questionGroups.forEach((g) => {
      lines.push(`### ${g.title}`);
      g.items.forEach((item) => {
        const a = answers[item.id];
        if (!a?.checked && !a?.note) return;
        lines.push(`- ${a?.checked ? "已问" : "未完成"} ${item.text}`);
        if (a?.note) lines.push(`  记录：${a.note}`);
      });
    });
    lines.push(``, `## 风险清单`);
    risks.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.point || "（空）"}｜影响：${r.impact}｜下一步：${r.next}`);
    });
    lines.push(``, closeScript);
    return lines.join("\n");
  }, [alias, answers, risks]);

  if (!ready) return <Waiting />;

  return (
    <Frame>
      <Kicker n="04">免费诊断工作台</Kicker>
      <Note>照着问。免费只输出风险清单。完整做法留在付费方案。不要在记录里写私人电话。</Note>
      <div className="mt-4 max-w-md">
        <Field label="客户脱敏简称">
          <input className={inputCls} value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="例如：华东门窗-甲" />
        </Field>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {questionGroups.map((g, gi) => (
          <section key={g.title}>
            <h3 className="font-serif text-xl">
              {gi + 1}. {g.title}
            </h3>
            <ul className="mt-3 border-t border-ink">
              {g.items.map((item) => {
                const a = answers[item.id] ?? { checked: false, note: "" };
                return (
                  <li key={item.id} className="border-b border-rule py-3">
                    <button
                      type="button"
                      onClick={() => setAnswer(item.id, { checked: !a.checked })}
                      className="flex w-full items-start gap-3 text-left"
                    >
                      <span
                        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border text-xs ${
                          a.checked ? "border-seal bg-seal text-seal-ink" : "border-rule"
                        }`}
                      >
                        {a.checked ? "✓" : ""}
                      </span>
                      <span className="text-sm leading-relaxed">{item.text}</span>
                    </button>
                    <textarea
                      className={`${areaCls} mt-2`}
                      placeholder="只记公开事实，不记私人联系方式"
                      value={a.note}
                      onChange={(e) => setAnswer(item.id, { note: e.target.value })}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <Kicker n="07">风险清单</Kicker>
        <div className="flex flex-col gap-4">
          {risks.map((r, i) => (
            <div key={r.id} className="grid gap-2 border-b border-rule pb-4 md:grid-cols-12">
              <p className="font-serif text-seal md:col-span-1">{i + 1}</p>
              <div className="md:col-span-5">
                <Field label="风险点">
                  <input className={inputCls} value={r.point} onChange={(e) => updateRisk(r.id, { point: e.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="影响">
                  <select
                    className={inputCls}
                    value={r.impact}
                    onChange={(e) => updateRisk(r.id, { impact: e.target.value as (typeof IMPACTS)[number] })}
                  >
                    {IMPACTS.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="md:col-span-3">
                <Field label="建议下一步">
                  <input className={inputCls} value={r.next} onChange={(e) => updateRisk(r.id, { next: e.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-1 md:self-end">
                <Btn tone="paper" onClick={() => removeRisk(r.id)}>
                  删
                </Btn>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Btn tone="paper" onClick={addRisk}>
            加一条风险
          </Btn>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">诊断后转化话术</h3>
        <p className="mt-3 max-w-3xl leading-relaxed">{closeScript}</p>
        <pre className="mt-4 overflow-x-auto border border-rule bg-paper-2 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {markdown}
        </pre>
        <div className="mt-3">
          <Btn
            onClick={() => {
              void navigator.clipboard.writeText(markdown).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              });
            }}
          >
            {copied ? "已复制" : "复制风险清单"}
          </Btn>
        </div>
      </section>
    </Frame>
  );
}
