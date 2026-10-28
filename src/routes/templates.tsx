import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Frame, Kicker, Note, Waiting, areaCls } from "@/components/finpivot/frame";
import { templateSeeds } from "@/lib/finpivot/copy";
import { useHydrated, useOs } from "@/lib/finpivot/store";

export const Route = createFileRoute("/templates")({ component: TemplatesPage });

function TemplatesPage() {
  const ready = useHydrated();
  const templates = useOs((s) => s.templates);
  const setTemplate = useOs((s) => s.setTemplate);
  const [id, setId] = useState(templateSeeds[0].id);
  const [copied, setCopied] = useState(false);
  if (!ready) return <Waiting />;
  const meta = templateSeeds.find((t) => t.id === id) ?? templateSeeds[0];
  const body = templates[meta.id] ?? meta.body;

  return (
    <Frame>
      <Kicker n="08">七张可改模板</Kicker>
      <Note>前四张对应方案里的准备期模板。后三张是任务要求的补充：月度财务包、合同要点、复盘案例。合同要点不是法律文本。</Note>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {templateSeeds.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setId(t.id)}
            className={`inline-flex h-11 shrink-0 items-center border px-3 text-sm ${
              t.id === meta.id ? "border-ink bg-ink text-paper" : "border-rule"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{meta.from}</p>
      <textarea className={`${areaCls} mt-3 min-h-96 font-mono`} value={body} onChange={(e) => setTemplate(meta.id, e.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            void navigator.clipboard.writeText(body).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            });
          }}
        >
          {copied ? "已复制" : "复制"}
        </Btn>
        <Btn
          tone="paper"
          onClick={() => {
            const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${meta.name}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          下载
        </Btn>
        <Btn tone="paper" onClick={() => setTemplate(meta.id, meta.body)}>
          恢复底稿
        </Btn>
      </div>
    </Frame>
  );
}
