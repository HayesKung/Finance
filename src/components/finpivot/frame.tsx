import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { META } from "@/lib/finpivot/copy";
import { hydrateDesk } from "@/lib/finpivot/store";

const browse = [
  { to: "/", label: "首页", hash: "" },
  { to: "/", label: "服务", hash: "sheet" },
  { to: "/diagnose", label: "诊断", hash: "" },
] as const;

const desk = [
  { to: "/os", label: "总览" },
  { to: "/pipeline", label: "名单" },
  { to: "/clients", label: "客户" },
  { to: "/orders", label: "订单" },
  { to: "/playbook", label: "获客" },
  { to: "/templates", label: "模板" },
] as const;

export function Frame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    hydrateDesk();
  }, []);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-seal text-seal-ink">
        <p className="mx-auto max-w-6xl px-4 py-2 text-sm leading-snug">
          内部工作稿。品牌名、域名与联系方式尚未确认，不得当作已上线官网对外发布。
        </p>
      </div>
      <header className="sticky top-0 z-10 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="min-w-0">
              <p className="text-xs tracking-widest text-muted">{META.code}</p>
              <p className="truncate font-serif text-xl text-ink">海外项目与出口财务</p>
            </Link>
            <nav className="flex shrink-0 gap-2">
              {browse.map((l) => {
                const on =
                  l.to === "/diagnose"
                    ? path === "/diagnose"
                    : path === "/" && (l.hash ? hash === l.hash : hash === "");
                return (
                  <Link
                    key={l.label}
                    to={l.to}
                    hash={l.hash || undefined}
                    className={`inline-flex h-11 items-center border px-3 text-sm ${
                      on ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="内部工作台">
            <span className="shrink-0 text-xs text-muted">内部</span>
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
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted md:flex-row md:justify-between">
          <p>
            {META.owner} 跟踪 · {META.reviewer} 核验 · {META.checkpoint}
          </p>
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
