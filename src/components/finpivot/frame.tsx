import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { META } from "@/lib/finpivot/copy";
import { PUBLIC_SITE_LAUNCHED } from "@/lib/finpivot/inquiry";
import { useI18n } from "@/lib/finpivot/locale";
import { hydrateDesk } from "@/lib/finpivot/store";
import { footerLine } from "@/lib/finpivot/ui";

const browse = [
  { to: "/", label: "navHome", hash: "" },
  { to: "/", label: "navOffer", hash: "sheet" },
  { to: "/ask", label: "navAsk", hash: "" },
] as const;

const desk = [
  { to: "/os", label: "navOs" },
  { to: "/pipeline", label: "navLeads" },
  { to: "/clients", label: "navClients" },
  { to: "/orders", label: "navOrders" },
  { to: "/playbook", label: "navPlay" },
  { to: "/templates", label: "navTemplates" },
] as const;

const PUBLIC = new Set(["/", "/ask"]);

function useRobots(indexable: boolean) {
  useEffect(() => {
    const content = indexable ? "index, follow" : "noindex, nofollow";
    let meta = document.head.querySelector('meta[name="robots"]');
    if (!(meta instanceof HTMLMetaElement)) {
      const created = document.createElement("meta");
      created.setAttribute("name", "robots");
      document.head.appendChild(created);
      meta = created;
    }
    meta.setAttribute("content", content);
  }, [indexable]);
}

export function LocaleSwitch() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="inline-flex shrink-0 border border-rule" role="group" aria-label={t("language")}>
      {(["zh", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className={`inline-flex h-11 items-center px-3 text-sm ${locale === code ? "bg-ink text-paper" : "bg-paper text-ink"}`}
        >
          {code === "zh" ? "中文" : "EN"}
        </button>
      ))}
    </div>
  );
}

export function Frame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const publicPage = PUBLIC.has(path);
  useEffect(() => {
    hydrateDesk();
  }, []);
  useRobots(publicPage && PUBLIC_SITE_LAUNCHED);
  if (publicPage) {
    return (
      <PublicShell path={path} hash={hash}>
        {children}
      </PublicShell>
    );
  }
  return <DeskShell path={path}>{children}</DeskShell>;
}

function PublicShell({ path, hash, children }: { path: string; hash: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink text-paper">
        <p className="mx-auto max-w-6xl px-4 py-2 text-sm leading-snug">{t("publicBanner")}</p>
      </div>
      <header className="sticky top-0 z-10 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="min-w-0">
              <p className="text-xs tracking-widest text-muted">{t("draft")}</p>
              <p className="truncate font-serif text-xl text-ink">{t("appName")}</p>
            </Link>
            <LocaleSwitch />
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {browse.map((l) => {
              const on = l.to === "/ask" ? path === "/ask" : path === "/" && (l.hash ? hash === l.hash : hash === "");
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  hash={l.hash || undefined}
                  className={`inline-flex h-11 shrink-0 items-center border px-3 text-sm ${
                    on ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink"
                  }`}
                >
                  {t(l.label)}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>{t("publicFoot")}</p>
          <Link to="/os" className="inline-flex h-11 items-center text-sm text-muted underline decoration-rule underline-offset-4">
            {t("staffEntry")}
          </Link>
        </div>
      </footer>
    </div>
  );
}

function DeskShell({ path, children }: { path: string; children: ReactNode }) {
  const { locale, t } = useI18n();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-seal text-seal-ink">
        <p className="mx-auto max-w-6xl px-4 py-2 text-sm leading-snug">{t("banner")}</p>
      </div>
      <header className="sticky top-0 z-10 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/os" className="min-w-0">
              <p className="text-xs tracking-widest text-muted">{META.code}</p>
              <p className="truncate font-serif text-xl text-ink">{t("appName")}</p>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/" className="inline-flex h-11 items-center border border-rule px-3 text-sm text-ink">
                {t("seePublic")}
              </Link>
              <LocaleSwitch />
            </div>
          </div>
          <nav className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1" aria-label={t("deskLabel")}>
            <span className="shrink-0 text-xs text-muted">{t("deskLabel")}</span>
            {desk.map((l) => {
              const on = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`inline-flex h-11 shrink-0 items-center px-2 text-sm ${
                    on ? "border-b-2 border-seal text-ink" : "text-muted"
                  }`}
                >
                  {t(l.label)}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted md:flex-row md:justify-between">
          <p>{footerLine(locale)}</p>
          <p className="break-all">{META.github}</p>
        </div>
      </footer>
    </div>
  );
}

export function Kicker({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline gap-3">
      <span className="font-serif text-seal">{n}</span>
      <h2 className="font-serif text-2xl text-ink">{children}</h2>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-seal pl-3 text-sm leading-relaxed text-muted">{children}</p>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "h-11 w-full border border-rule bg-paper px-3 text-ink outline-none focus:border-ink";
export const areaCls =
  "min-h-28 w-full border border-rule bg-paper px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-ink";

export function CanonSelect({
  value,
  options,
  onChange,
  className,
  blank,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  className?: string;
  blank?: { value: string; label: string };
}) {
  const { show } = useI18n();
  return (
    <select className={className ?? inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      {blank ? <option value={blank.value}>{blank.label}</option> : null}
      {options.map((option) => (
        <option key={option} value={option}>
          {show(option)}
        </option>
      ))}
    </select>
  );
}

export function Btn({
  children,
  onClick,
  tone = "ink",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "ink" | "paper" | "seal";
  type?: "button" | "submit";
}) {
  const toneCls =
    tone === "seal"
      ? "border-seal bg-seal text-seal-ink"
      : tone === "paper"
        ? "border-rule bg-paper text-ink"
        : "border-ink bg-ink text-paper";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center border px-4 text-sm ${toneCls}`}
    >
      {children}
    </button>
  );
}
