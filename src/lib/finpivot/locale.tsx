import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { content } from "@/lib/finpivot/content";
import { formatYuan, show, type Locale } from "@/lib/finpivot/glossary";
import { docTitle, t, type UiKey } from "@/lib/finpivot/ui";

const KEY = "finpivot-locale";

const LocaleContext = createContext<{ locale: Locale; setLocale: (next: Locale) => void }>({
  locale: "zh",
  setLocale: () => undefined,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const hydrated = useRef(false);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    const next: Locale = fromUrl === "en" || fromUrl === "zh" ? fromUrl : stored === "en" ? "en" : "zh";
    hydrated.current = true;
    setLocaleState(next);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title = docTitle(locale);
    document.querySelector('meta[name="description"]')?.setAttribute("content", t(locale, "metaDesc"));
    try {
      localStorage.setItem(KEY, locale);
    } catch {
      /* 无存储权限时，这一次打开仍然可切换 */
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: (next) => { hydrated.current = true; setLocaleState(next); } }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const { locale, setLocale } = useContext(LocaleContext);
  return {
    locale,
    setLocale,
    t: (key: UiKey) => t(locale, key),
    show: (text: string) => show(locale, text),
    yuan: (amount: number) => formatYuan(locale, amount),
    copy: content(locale),
  };
}
