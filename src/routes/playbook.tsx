import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Frame, Kicker, Note } from "@/components/finpivot/frame";
import { articles, channels, partnerLine, scripts, seoDirections, topics, weeks } from "@/lib/finpivot/copy";
import { useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/playbook")({ component: PlaybookPage });

function PlaybookPage() {
  const checked = useOs((s) => s.articleChecked);
  const toggle = useOs((s) => s.toggleArticle);
  const [copied, setCopied] = useState("");

  const copy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      window.setTimeout(() => setCopied(""), 1400);
    });
  };

  return (
    <Frame>
      <Kicker n="07">获客不卖记账，卖诊断</Kicker>
      <Note>先约免费诊断，只给风险清单。不要一上来投广告。对外发布须财务人员本人确认。</Note>

      <div className="ledger mt-6">
        {channels.map((c) => (
          <div key={c.rank} className="ledger-row md:grid-cols-4">
            <p className="font-serif">{c.rank}</p>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm leading-relaxed">{c.how}</p>
            <p className="text-sm text-seal">{c.goal}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h3 className="font-serif text-xl">约访话术</h3>
        <div className="mt-4 grid gap-4">
          {scripts.map((s) => (
            <article key={s.scene} className="border border-rule p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{s.scene}</p>
                <Btn tone="paper" onClick={() => copy(s.scene, s.text)}>
                  {copied === s.scene ? "已复制" : "复制"}
                </Btn>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
            </article>
          ))}
        </div>
        <article className="mt-4 border border-ink p-4">
          <p className="font-medium">合作转介绍，一句话</p>
          <p className="mt-2 text-sm leading-relaxed">{partnerLine}</p>
        </article>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">四周执行表</h3>
        <p className="mt-2 text-sm text-muted">系统补充，按方案里的渠道顺序排，不是另起一套获客。</p>
        <div className="mt-4 grid gap-4">
          {weeks.map((w) => (
            <article key={w.week} className="border-t border-ink pt-3">
              <p className="font-serif text-lg">{w.week}</p>
              <dl className="mt-2 grid gap-2 text-sm md:grid-cols-2">
                <div><dt className="text-muted">内容 2 篇</dt><dd>{w.content}</dd></div>
                <div><dt className="text-muted">问答</dt><dd>{w.qa}</dd></div>
                <div><dt className="text-muted">约访</dt><dd>{w.outreach}</dd></div>
                <div><dt className="text-muted">合作方</dt><dd>{w.partner}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">十二个选题</h3>
        <p className="mt-2 text-sm text-muted">先写前四个里的三个。下面三篇是草稿，脱敏复核勾上之前不要外发。</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          {topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-6">
          {articles.map((a) => (
            <article key={a.id} className="border border-rule p-4">
              <p className="text-xs text-seal">草稿 · 选题 {a.topic} · 不预测汇率</p>
              <h3 className="mt-2 font-serif text-2xl">{a.title}</h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed whitespace-pre-wrap">{a.body}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn tone="paper" onClick={() => copy(a.id, `${a.title}\n\n${a.body}`)}>
                  {copied === a.id ? "已复制" : "复制全文"}
                </Btn>
                <Btn tone={checked[a.id] ? "seal" : "paper"} onClick={() => toggle(a.id)}>
                  {checked[a.id] ? "已做脱敏复核" : "标记脱敏复核"}
                </Btn>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="font-serif text-xl">二十个可写标题</h3>
        <Note>按服务范围整理的工作稿。上传的方案正本没有单独的关键词表，所以这里标明是系统补充，不是原文第几节。</Note>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {seoDirections.map((d) => (
            <article key={d.direction} className="border-t border-rule pt-3">
              <p className="text-sm text-muted">{d.direction}</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {d.titles.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </Frame>
  );
}
