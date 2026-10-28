import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Field, Frame, Kicker, Note, inputCls } from "@/components/finpivot/frame";
import { SOURCES } from "@/lib/finpivot/copy";
import { CLIENT_STATUSES, PROJECT_STATUSES } from "@/lib/finpivot/flow";
import { useOs, type Client, type Project, type Source } from "@/lib/finpivot/store";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

const blank = {
  alias: "",
  company: "",
  industry: "",
  direction: "",
  market: "",
  source: "老关系" as Source,
  publicChannel: "",
  consentPrivate: false,
  privateContact: "",
  status: "潜在" as Client["status"],
  note: "",
};

function ClientsPage() {
  const clients = useOs((s) => s.clients);
  const projects = useOs((s) => s.projects);
  const orders = useOs((s) => s.orders);
  const addClient = useOs((s) => s.addClient);
  const updateClient = useOs((s) => s.updateClient);
  const removeClient = useOs((s) => s.removeClient);
  const addProject = useOs((s) => s.addProject);
  const updateProject = useOs((s) => s.updateProject);
  const removeProject = useOs((s) => s.removeProject);
  const [form, setForm] = useState(blank);
  const [projectName, setProjectName] = useState<Record<string, string>>({});
  const [warn, setWarn] = useState("");

  return (
    <Frame>
      <Kicker n="09">客户与项目</Kicker>
      <Note>
        客户是已经从名单升上来、准备诊断或报价的对象。项目是他的一票出口或一个海外工程，不是我们的服务订单。服务费在订单里记，客户的项目回款不经过这里。
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
        <Field label="方向">
          <input className={inputCls} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} />
        </Field>
        <Field label="出海市场">
          <input className={inputCls} value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} />
        </Field>
        <Field label="来源">
          <select className={inputCls} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Source })}>
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="公开联系渠道">
          <input
            className={inputCls}
            value={form.publicChannel}
            onChange={(e) => {
              const v = e.target.value;
              setForm({ ...form, publicChannel: v });
              setWarn(/1[3-9]\d{9}/.test(v) ? "这像私人手机号。公开渠道不要写私人号。" : "");
            }}
          />
        </Field>
        <Field label="状态">
          <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Client["status"] })}>
            {CLIENT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
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
          onChange={(e) =>
            setForm({
              ...form,
              consentPrivate: e.target.checked,
              privateContact: e.target.checked ? form.privateContact : "",
            })
          }
        />
        对方已同意交换私人联系方式
      </label>
      {form.consentPrivate ? (
        <div className="mt-3 max-w-md">
          <Field label="私人联系方式（仅本机）">
            <input className={inputCls} value={form.privateContact} onChange={(e) => setForm({ ...form, privateContact: e.target.value })} />
          </Field>
        </div>
      ) : null}
      <div className="mt-4">
        <Btn
          onClick={() => {
            if (!form.alias.trim() || !form.company.trim()) return;
            addClient(form);
            setForm(blank);
            setWarn("");
          }}
        >
          建立客户
        </Btn>
      </div>

      <ul className="mt-8 border-t border-ink">
        {clients.length === 0 ? (
          <li className="py-6 text-sm text-muted">还没有客户。可以在名单里把一条线索升为客户，也可以在这里直接建档。</li>
        ) : (
          clients.map((c) => {
            const own = projects.filter((p) => p.clientId === c.id);
            const openOrders = orders.filter((o) => o.clientId === c.id && o.status !== "已取消").length;
            return (
              <li key={c.id} className="border-b border-rule py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium">{c.alias}</p>
                    <p className="text-sm text-muted">{c.company} · {c.industry} · {c.market}</p>
                    <p className="mt-1 text-sm">{c.direction || "方向未写"} · {c.source}</p>
                    {c.consentPrivate ? <p className="text-sm text-seal">私人联系方式只留在本机。</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      className="h-11 border border-rule bg-paper px-2 text-sm"
                      value={c.status}
                      onChange={(e) => updateClient(c.id, { status: e.target.value as Client["status"] })}
                    >
                      {CLIENT_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <Btn tone="paper" onClick={() => removeClient(c.id)}>
                      移除
                    </Btn>
                  </div>
                </div>
                {openOrders > 0 ? (
                  <p className="mt-2 text-sm text-muted">有 {openOrders} 张未取消订单，所以不能删这个客户。</p>
                ) : null}
                <div className="mt-4 border-t border-rule pt-3">
                  <p className="text-sm text-muted">项目</p>
                  <ul className="mt-2">
                    {own.map((p) => (
                      <li key={p.id} className="flex flex-col gap-2 border-b border-rule py-2 md:flex-row md:items-center">
                        <p className="flex-1 text-sm">{p.name} · {p.market || "市场未写"}</p>
                        <select
                          className="h-11 border border-rule bg-paper px-2 text-sm"
                          value={p.status}
                          onChange={(e) => updateProject(p.id, { status: e.target.value as Project["status"] })}
                        >
                          {PROJECT_STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <Btn tone="paper" onClick={() => removeProject(p.id)}>移除项目</Btn>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      className={inputCls}
                      placeholder="项目名称，例如东南亚门窗一批"
                      value={projectName[c.id] ?? ""}
                      onChange={(e) => setProjectName({ ...projectName, [c.id]: e.target.value })}
                    />
                    <Btn
                      tone="paper"
                      onClick={() => {
                        const name = (projectName[c.id] ?? "").trim();
                        if (!name) return;
                        addProject({ clientId: c.id, name, market: c.market, status: "立项", note: "" });
                        setProjectName({ ...projectName, [c.id]: "" });
                      }}
                    >
                      加项目
                    </Btn>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Frame>
  );
}
