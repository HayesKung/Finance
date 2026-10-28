import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Field, Frame, Kicker, Note, Waiting, inputCls } from "@/components/finpivot/frame";
import { PRODUCTS } from "@/lib/finpivot/copy";
import { BILLINGS, E2E_STEPS, ORDER_STATUSES, nextStatuses } from "@/lib/finpivot/flow";
import { useHydrated, useOs, type Order, type Product } from "@/lib/finpivot/store";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const ready = useHydrated();
  const clients = useOs((s) => s.clients);
  const projects = useOs((s) => s.projects);
  const orders = useOs((s) => s.orders);
  const payments = useOs((s) => s.payments);
  const deliverables = useOs((s) => s.deliverables);
  const addOrder = useOs((s) => s.addOrder);
  const issuePlan = useOs((s) => s.issuePlan);
  const moveOrder = useOs((s) => s.moveOrder);
  const recordReceipt = useOs((s) => s.recordReceipt);
  const toggleDeliverable = useOs((s) => s.toggleDeliverable);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [product, setProduct] = useState<Product>("出口财务包");
  const [billing, setBilling] = useState<Order["billing"]>("按单");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [draftPay, setDraftPay] = useState<Record<string, string>>({});
  if (!ready) return <Waiting />;

  const clientProjects = projects.filter((p) => p.clientId === clientId);
  const open = orders.filter((o) => o.status !== "已取消" && o.status !== "已交付");
  const outstanding = payments.reduce((sum, p) => sum + Math.max(0, p.expectedYuan - p.receivedYuan), 0);

  return (
    <Frame>
      <Kicker n="10">订单与收款</Kicker>
      <Note>
        这是服务费台账，不是支付通道。不扣款，不代收客户的项目回款，也不经手客户资金。先收定金或当月预收才允许开工；交付物没齐、款没清，订单停在未交付。
      </Note>
      <ol className="mt-4 grid gap-2 md:grid-cols-4">
        {E2E_STEPS.map((step, i) => (
          <li key={step} className="border border-rule px-3 py-2 text-sm leading-relaxed">
            <span className="font-serif text-seal">{i + 1}</span> {step}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">
        未完成订单 {open.length} 张 · 服务费未收 {outstanding.toLocaleString("zh-CN")} 元
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Field label="客户">
          <select
            className={inputCls}
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setProjectId("");
            }}
          >
            <option value="">选择客户</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.alias}
              </option>
            ))}
          </select>
        </Field>
        <Field label="项目（可空）">
          <select className={inputCls} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">不挂项目</option>
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="产品">
          <select className={inputCls} value={product} onChange={(e) => setProduct(e.target.value as Product)}>
            {PRODUCTS.filter((p) => p !== "未定").map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="收费方式">
          <select className={inputCls} value={billing} onChange={(e) => setBilling(e.target.value as Order["billing"])}>
            {BILLINGS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field label="订单说明">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如 10 月出口财务包" />
        </Field>
        <Field label="服务费（元）">
          <input className={inputCls} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} />
        </Field>
      </div>
      <p className="mt-3 text-sm text-muted">
        按单：50% 定金后开工，尾款交付前结清。月度：当月费用预收后才做这个月。阶段：首段费用到账后开工，其余在交付前结清。金额由财务人员确认，系统不自动报价。
      </p>
      <div className="mt-3">
        <Btn
          onClick={() => {
            const amountYuan = Number(amount);
            if (!clientId || !title.trim() || !amountYuan) return;
            addOrder({ clientId, projectId, product, billing, title: title.trim(), amountYuan });
            setTitle("");
            setAmount("");
          }}
        >
          建立草稿订单
        </Btn>
      </div>

      <ul className="mt-8 border-t border-ink">
        {orders.length === 0 ? (
          <li className="py-6 text-sm text-muted">还没有订单。先有客户，再写明产品、收费方式和金额。</li>
        ) : (
          orders.map((o) => {
            const client = clients.find((c) => c.id === o.clientId);
            const project = projects.find((p) => p.id === o.projectId);
            const lines = payments.filter((p) => p.orderId === o.id);
            const items = deliverables.filter((d) => d.orderId === o.id);
            return (
              <li key={o.id} className="border-b border-rule py-5">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <p className="font-medium">
                    {client?.alias ?? "客户已不在"} · {o.title}
                  </p>
                  <p className="font-serif text-xl tabular-nums">{o.amountYuan.toLocaleString("zh-CN")} 元</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {o.product} · {o.billing}
                  {project ? ` · ${project.name}` : ""} · {o.status}
                </p>
                {o.blockReason ? <p className="mt-2 text-sm text-seal">{o.blockReason}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.status === "草稿" ? (
                    <Btn onClick={() => issuePlan(o.id)}>生成收款计划</Btn>
                  ) : null}
                  {nextStatuses(o.status).map((st) => (
                    <Btn key={st} tone={st === "已取消" ? "paper" : "ink"} onClick={() => moveOrder(o.id, st)}>
                      改为{st}
                    </Btn>
                  ))}
                </div>
                {lines.length > 0 ? (
                  <ul className="mt-4">
                    {lines.map((line) => (
                      <li key={line.id} className="grid gap-2 border-t border-rule py-3 md:grid-cols-4 md:items-end">
                        <p className="text-sm">
                          {line.label}
                          <span className="mt-1 block text-muted">应收 {line.expectedYuan.toLocaleString("zh-CN")}</span>
                        </p>
                        <p className="text-sm tabular-nums">已记 {line.receivedYuan.toLocaleString("zh-CN")}</p>
                        <input
                          className={inputCls}
                          inputMode="numeric"
                          value={draftPay[line.id] ?? ""}
                          placeholder="已收累计"
                          onChange={(e) => setDraftPay({ ...draftPay, [line.id]: e.target.value.replace(/[^\d]/g, "") })}
                        />
                        <Btn
                          tone="paper"
                          onClick={() => {
                            const raw = draftPay[line.id];
                            if (!raw) return;
                            recordReceipt(line.id, Number(raw));
                          }}
                        >
                          登记已收
                        </Btn>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {items.length > 0 ? (
                  <ul className="mt-2">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button type="button" className="flex items-center gap-3 py-2 text-left text-sm" onClick={() => toggleDeliverable(item.id)}>
                          <span className={`inline-flex h-6 w-6 items-center justify-center border text-xs ${item.done ? "border-seal bg-seal text-seal-ink" : "border-rule"}`}>
                            {item.done ? "✓" : ""}
                          </span>
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
      <p className="mt-4 text-xs text-muted">状态只允许按 {ORDER_STATUSES.join(" / ")} 的相邻步骤走，不能从草稿直接标已交付。</p>
    </Frame>
  );
}
