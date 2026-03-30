import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  /** true when Arabic is active — used for font/text-align switching, NOT layout direction */
  isRTL: boolean;
  isTransitioning: boolean;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  isRTL: true,
  isTransitioning: false,
  t: (_en, ar) => ar,
});

const TRANSITION_MS = 160;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  /*
   * Default language is Arabic.
   * Layout is ALWAYS LTR — Arabic is handled via font + per-element text-align,
   * not by flipping the global layout direction.
   */
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem("it-lang") as Language | null;
    return stored || "ar";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  /** Convenience alias — means "Arabic is active", NOT "layout is RTL" */
  const isRTL = lang === "ar";

  useEffect(() => {
    const root = document.documentElement;

    /*
     * Layout direction: ALWAYS ltr.
     * The page structure never flips — Arabic text uses text-align / unicode
     * bidi for correct rendering inside an LTR grid.
     */
    root.setAttribute("dir", "ltr");

    /*
     * lang attribute drives the CSS font rule in index.css:
     *   [lang="ar"] { font-family: var(--font-arabic); ... }
     * It also benefits screen readers and SEO crawlers.
     */
    root.setAttribute("lang", lang);

    localStorage.setItem("it-lang", lang);
  }, [lang]);

  /** Fade content out → swap language → fade back in */
  const setLang = useCallback(
    (l: Language) => {
      if (l === lang) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setLangState(l);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setIsTransitioning(false))
        );
      }, TRANSITION_MS);
    },
    [lang],
  );

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL, isTransitioning, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
