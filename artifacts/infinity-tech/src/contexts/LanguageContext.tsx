import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  isRTL: false,
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("it-lang") as Language) || "en";
  });

  const isRTL = lang === "ar";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", isRTL ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
    localStorage.setItem("it-lang", lang);
  }, [lang, isRTL]);

  const setLang = (l: Language) => setLangState(l);

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
