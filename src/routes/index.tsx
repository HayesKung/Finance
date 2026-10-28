import { createFileRoute, Link } from "@tanstack/react-router";
import { Frame, Kicker, Note } from "@/components/finpivot/frame";
import { audiences, capabilities, flow, products, wontDo } from "@/lib/finpivot/copy";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <Frame>
      <section className="grid gap-8 border-b border-ink pb-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="mb-4 inline-flex h-11 items-center border border-seal px-3 text-sm text-seal">
            草案 · 品牌名待确认
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            不卖记账。卖回款、结算、单证、退税与汇率风险清单。
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            把建筑财务和外贸财务做成可卖的产品，卖给要出海、要出口的中国企业。客户买的是直接省钱避损的事，不是锦上添花。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#sheet"
              className="inline-flex h-11 items-center justify-center border border-ink bg-ink px-4 text-sm text-paper"
            >
              看一页服务单
            </a>
            <Link
              to="/os"
              className="inline-flex h-11 items-center justify-center border border-rule px-4 text-sm text-ink"
            >
              打开内部作战台
            </Link>
          </div>
        </div>
        <aside className="border border-rule bg-paper-2 p-5 md:col-span-4">
          <p className="font-serif text-xl">护城河</p>
          <p className="mt-3 text-sm leading-relaxed">
            单点记账公司做不了工程进度款、质保金、索赔结算；纯外贸公司又不懂工程成本和项目回款。这个组合本身就是壁垒。
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            别再去国内建筑存量市场拼低价记账。
          </p>
        </aside>
      </section>

      <section className="py-10">
        <Kicker n="01">我们解决的问题</Kicker>
        <p className="max-w-3xl leading-relaxed">
          海外回款拖、单据错、退税资料乱、汇率波动没预警、工程结算对不上账。不做泛泛的记账，只做回款、结算、单证、退税与汇率这几件直接影响现金流的事。
        </p>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {audiences.map((a) => (
            <li key={a} className="border-b border-rule py-3 text-sm leading-relaxed">
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-rule py-10">
        <Kicker n="02">原有能力，翻译成可卖的服务</Kicker>
        <div className="ledger">
          {capabilities.map(([from, to]) => (
            <div key={from} className="ledger-row md:grid-cols-2">
              <p className="text-sm text-muted">{from}</p>
              <p className="text-sm">{to}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sheet" className="border-t border-ink py-10">
        <Kicker n="03">一页服务单</Kicker>
        <Note>可在联系方式由财务人员本人填写后外发。发出前删除内部提示，并确认价格与不做事项和实际承接能力一致。</Note>
        <div className="mt-6 border border-ink p-5 md:p-8">
          <p className="font-serif text-2xl">海外项目与出口财务服务</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            面向要出海、要出口的中国企业：建材、设备、钢结构、门窗、预制件等出口企业，以及承接东南亚、中东、中亚、非洲项目的中小承包商、劳务公司和材料供应商。
          </p>
          <div className="mt-8 flex flex-col gap-8">
            {products.map((p) => (
              <article key={p.id} className="border-t border-rule pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl">
                    产品 {p.id} · {p.name}
                  </h3>
                  <span className="text-xs text-seal">起步建议价</span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-muted">适合谁</dt>
                    <dd className="mt-1 leading-relaxed">{p.who}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">交付物</dt>
                    <dd className="mt-1 leading-relaxed">{p.deliver}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">价格区间</dt>
                    <dd className="mt-1 font-medium leading-relaxed">{p.price}</dd>
                    <dd className="mt-1 text-muted">{p.note}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-rule pt-5">
            <p className="text-sm text-muted">合作流程</p>
            <ol className="mt-3 grid gap-2 md:grid-cols-5">
              {flow.map((step, i) => (
                <li key={step} className="text-sm leading-relaxed">
                  <span className="font-serif text-seal">{i + 1}</span> {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-8 grid gap-2 border border-rule bg-paper-2 p-4 text-sm">
            <p>联系方式：姓名＿＿＿＿　电话 / 微信＿＿＿＿</p>
            <p className="text-muted">发出前填写。不得冒用他人名义。本草案故意留空，不编造号码。</p>
          </div>
        </div>
      </section>

      <section className="border-t border-rule py-10">
        <Kicker n="04">不做事项</Kicker>
        <ul className="grid gap-3">
          {wontDo.map((w) => (
            <li key={w} className="border-b border-rule py-3 text-sm leading-relaxed">
              {w}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 border-t border-ink py-10 md:grid-cols-2">
        <div>
          <Kicker n="05">免费诊断只给风险清单</Kicker>
          <p className="leading-relaxed">
            三十分钟照着清单问。结束时输出一张风险清单，并约下一步付费方案的时间。完整方案和测算表是付费产品。
          </p>
          <Link
            to="/diagnose"
            className="mt-5 inline-flex h-11 items-center border border-seal px-4 text-sm text-seal"
          >
            打开诊断工作台（内部预演）
          </Link>
        </div>
        <div className="border border-rule p-5">
          <p className="font-serif text-xl">上线前仍缺三项确认</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            <li>品牌名：未确认，页面不用自拟商号。</li>
            <li>域名：不自动购买。独立站点，不放在其他项目域名下。</li>
            <li>预约方式：微信、邮件或表单，待本人选定。本页不建客户数据库。</li>
          </ul>
        </div>
      </section>
    </Frame>
  );
}
