import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSearch, Ship, HardHat, Scale, Ban } from "lucide-react";
import { Frame, Kicker, Note } from "@/components/finpivot/frame";
import { audiences, capabilities, flow, products, wontDo } from "@/lib/finpivot/copy";

export const Route = createFileRoute("/")({ component: Home });

const shots: Record<string, { src: string; alt: string }> = {
  A: { src: "/fin/export.jpg", alt: "出口单据和船模，表示按单核对收汇与退税资料" },
  B: { src: "/fin/site.jpg", alt: "海外工地与塔吊，表示项目预算、进度款和回款" },
  C: { src: "/fin/settle.jpg", alt: "对齐的结算单据，表示把合同、签证和付款记录对上" },
};

const pains = [
  { icon: Ship, title: "回款拖", text: "海外账期长，到账和合同对不上。" },
  { icon: FileSearch, title: "单据错", text: "信用证、交单、退税资料一处错就卡住。" },
  { icon: HardHat, title: "结算对不上", text: "进度款、签证、质保金和成本账各说各话。" },
  { icon: Scale, title: "汇率没人看", text: "只提示风险，不预测汇率，也不承诺结果。" },
];

function Home() {
  return (
    <Frame>
      <section className="grid items-center gap-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="mb-4 inline-flex h-11 items-center border border-seal px-3 text-sm text-seal">
            草案 · 品牌名待确认
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            不卖记账。卖回款、结算、单证和退税。
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            给要出海、要出口的中国企业。先看三件服务和起步价，再决定要不要做一次三十分钟诊断。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#sheet"
              className="inline-flex h-11 items-center justify-center border border-ink bg-ink px-4 text-sm text-paper"
            >
              看三件服务和价格
            </a>
            <Link
              to="/diagnose"
              className="inline-flex h-11 items-center justify-center border border-rule px-4 text-sm text-ink"
            >
              先做风险诊断
            </Link>
          </div>
        </div>
        <figure className="md:col-span-6">
          <img
            src="/fin/hero.jpg"
            alt="靠窗的出口办公桌，窗外是集装箱码头"
            className="aspect-video w-full border border-rule object-cover"
          />
          <figcaption className="mt-2 text-sm text-muted">单证、回款和项目账放在同一张桌子上。这是画面，不是客户现场。</figcaption>
        </figure>
      </section>

      <section className="mt-12 grid gap-3 sm:grid-cols-2">
        {pains.map((p) => (
          <article key={p.title} className="flex gap-3 border border-rule bg-paper-2 p-4">
            <p.icon className="mt-0.5 size-5 shrink-0 text-seal" aria-hidden />
            <div>
              <h2 className="font-serif text-xl">{p.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="sheet" className="mt-14 scroll-mt-28">
        <Kicker n="01">三件服务</Kicker>
        <Note>价格是起步建议价，不是市场核实价。联系方式留空，由本人填写后再外发。</Note>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="flex flex-col border border-ink bg-paper">
              <img src={shots[p.id].src} alt={shots[p.id].alt} className="shot" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-xs text-seal">产品 {p.id}</p>
                <h3 className="font-serif text-2xl">{p.name}</h3>
                <p className="text-sm leading-relaxed">{p.who}</p>
                <p className="text-sm leading-relaxed text-muted">{p.deliver}</p>
                <p className="mt-auto border-t border-rule pt-3 text-sm font-medium">{p.price}</p>
                <p className="text-xs leading-relaxed text-muted">{p.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <Kicker n="02">怎么合作</Kicker>
        <ol className="grid gap-3 md:grid-cols-5">
          {flow.map((step, i) => (
            <li key={step} className="border border-rule bg-paper-2 p-4">
              <span className="font-serif text-2xl text-seal">{i + 1}</span>
              <p className="mt-2 text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">免费诊断只给风险清单。完整方案和测算表是付费产品。</p>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Kicker n="03">卖给谁</Kicker>
          <ul className="space-y-3">
            {audiences.map((a) => (
              <li key={a} className="border-b border-rule pb-3 text-sm leading-relaxed">
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-7">
          <Kicker n="04">原有能力，换成可卖的交付</Kicker>
          <div className="ledger">
            {capabilities.map(([from, to]) => (
              <div key={from} className="ledger-row md:grid-cols-2 md:items-center">
                <p className="text-sm text-muted">{from}</p>
                <p className="text-sm">{to}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <Kicker n="05">明确不做</Kicker>
        <ul className="grid gap-3 md:grid-cols-2">
          {wontDo.map((w) => (
            <li key={w} className="flex gap-3 border border-rule p-4 text-sm leading-relaxed">
              <Ban className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-6 border border-ink md:grid-cols-2">
        <div className="bg-ink p-6 text-paper">
          <p className="font-serif text-2xl">下一步只做两件事</p>
          <p className="mt-3 text-sm leading-relaxed text-paper-2">内部预演诊断，或打开作战台记名单。对外联系仍由财务人员本人进行。</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link to="/diagnose" className="inline-flex h-11 items-center justify-center bg-paper px-4 text-sm text-ink">
              打开诊断
            </Link>
            <Link to="/os" className="inline-flex h-11 items-center justify-center border border-paper px-4 text-sm text-paper">
              打开作战台
            </Link>
          </div>
        </div>
        <div className="p-6">
          <p className="font-serif text-2xl">上线前仍缺三项</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed">
            <li>品牌名未确认，页面不用自拟商号。</li>
            <li>域名不自动购买，也不挂在其他项目下面。</li>
            <li>预约走微信、邮件或表单，待本人选定。这里不建客户库。</li>
          </ul>
          <p className="mt-4 text-sm text-muted">联系方式：姓名＿＿＿＿　电话 / 微信＿＿＿＿</p>
        </div>
      </section>
    </Frame>
  );
}
