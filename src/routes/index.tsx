import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSearch, Ship, HardHat, Scale, Ban } from "lucide-react";
import { Frame, Kicker, Note } from "@/components/finpivot/frame";
import { useI18n } from "@/lib/finpivot/locale";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t, copy } = useI18n();
  const pains = [
    { icon: Ship, title: t("painShip"), text: t("painShipT") },
    { icon: FileSearch, title: t("painDocs"), text: t("painDocsT") },
    { icon: HardHat, title: t("painSettle"), text: t("painSettleT") },
    { icon: Scale, title: t("painFx"), text: t("painFxT") },
  ];
  const shots: Record<string, { src: string; alt: string }> = {
    A: { src: "/fin/export.jpg", alt: t("shotExportAlt") },
    B: { src: "/fin/site.jpg", alt: t("shotSiteAlt") },
    C: { src: "/fin/settle.jpg", alt: t("shotSettleAlt") },
  };
  return (
    <Frame>
      <section className="grid items-center gap-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="mb-4 inline-flex h-11 items-center border border-seal px-3 text-sm text-seal">{t("draft")}</p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{t("heroLede")}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#sheet" className="inline-flex h-11 items-center justify-center border border-ink bg-ink px-4 text-sm text-paper">
              {t("ctaPrices")}
            </a>
            <Link to="/diagnose" className="inline-flex h-11 items-center justify-center border border-rule px-4 text-sm text-ink">
              {t("ctaDiagnose")}
            </Link>
          </div>
        </div>
        <figure className="md:col-span-6">
          <img src="/fin/hero.jpg" alt={t("heroAlt")} className="aspect-video w-full border border-rule object-cover" />
          <figcaption className="mt-2 text-sm text-muted">{t("heroCaption")}</figcaption>
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
        <Kicker n="01">{t("servicesKicker")}</Kicker>
        <Note>{t("servicesNote")}</Note>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {copy.products.map((p) => (
            <article key={p.id} className="flex flex-col border border-ink bg-paper">
              <img src={shots[p.id].src} alt={shots[p.id].alt} className="shot" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-xs text-seal">{t("productTag")} {p.id}</p>
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
        <Kicker n="02">{t("flowKicker")}</Kicker>
        <ol className="grid gap-3 md:grid-cols-5">
          {copy.flow.map((step, i) => (
            <li key={step} className="border border-rule bg-paper-2 p-4">
              <span className="font-serif text-2xl text-seal">{i + 1}</span>
              <p className="mt-2 text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">{t("flowNote")}</p>
        <p className="mt-2 text-sm text-muted">{t("fxRule")}</p>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Kicker n="03">{t("whoKicker")}</Kicker>
          <ul className="space-y-3">
            {copy.audiences.map((a) => (
              <li key={a} className="border-b border-rule pb-3 text-sm leading-relaxed">{a}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-7">
          <Kicker n="04">{t("capKicker")}</Kicker>
          <div className="ledger">
            {copy.capabilities.map(([from, to]) => (
              <div key={from} className="ledger-row md:grid-cols-2 md:items-center">
                <p className="text-sm text-muted">{from}</p>
                <p className="text-sm">{to}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <Kicker n="05">{t("wontKicker")}</Kicker>
        <ul className="grid gap-3 md:grid-cols-2">
          {copy.wontDo.map((w) => (
            <li key={w} className="flex gap-3 border border-rule p-4 text-sm leading-relaxed">
              <Ban className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-6 border border-ink md:grid-cols-2">
        <div className="bg-ink p-6 text-paper">
          <p className="font-serif text-2xl">{t("nextTitle")}</p>
          <p className="mt-3 text-sm leading-relaxed text-paper-2">{t("nextBody")}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link to="/diagnose" className="inline-flex h-11 items-center justify-center bg-paper px-4 text-sm text-ink">
              {t("openDiagnose")}
            </Link>
            <Link to="/os" className="inline-flex h-11 items-center justify-center border border-paper px-4 text-sm text-paper">
              {t("openDesk")}
            </Link>
          </div>
        </div>
        <div className="p-6">
          <p className="font-serif text-2xl">{t("missingTitle")}</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed">
            <li>{t("missBrand")}</li>
            <li>{t("missDomain")}</li>
            <li>{t("missBook")}</li>
          </ul>
          <p className="mt-4 text-sm text-muted">{t("contactBlank")}</p>
        </div>
      </section>
    </Frame>
  );
}
