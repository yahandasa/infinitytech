import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  isRTL: boolean;
  isTransitioning: boolean;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  isRTL: false,
  isTransitioning: false,
  t: (en) => en,
});

const TRANSITION_MS = 160;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("it-lang") as Language) || "en";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isRTL = lang === "ar";

  /* Sync dir/lang attrs on <html> so the browser scrollbar and
     OS accessibility tools get the correct reading direction.
     Header, Hero, and Footer override this with dir="ltr" explicitly. */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", isRTL ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
    localStorage.setItem("it-lang", lang);
  }, [lang, isRTL]);

  /* Fade content out → switch → fade back in */
  const setLang = useCallback((l: Language) => {
    if (l === lang) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setLangState(l);
      /* Small extra tick so the new dir has painted before we fade back */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(false));
      });
    }, TRANSITION_MS);
  }, [lang]);

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL, isTransitioning, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
