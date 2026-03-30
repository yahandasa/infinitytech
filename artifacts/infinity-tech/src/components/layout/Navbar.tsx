import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const navLinks = [
  { name: "Home",     nameAr: "الرئيسية",  path: "/" },
  { name: "Projects", nameAr: "المشاريع",  path: "/projects" },
  { name: "About",    nameAr: "عني",       path: "/about" },
  { name: "Contact",  nameAr: "تواصل",     path: "/contact" },
];


export function Navbar() {
  const [isScrolled,  setIsScrolled]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <>
      <header
        dir="ltr"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl saturate-150",
          "bg-[#0F172A]/40 border-b border-white/5",
          "transition-[box-shadow,background-color] duration-500 ease-out",
          isScrolled && "bg-[#0F172A]/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        )}
      >
        {/* Subtle top glow line on scroll */}
        {isScrolled && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 md:h-[4.5rem]">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg
                  viewBox="0 0 48 24"
                  width="44"
                  height="22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Infinity Tech logo"
                  className="relative transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.65)]"
                >
                  <defs>
                    <linearGradient id="inf-g" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#22D3EE" stopOpacity="0.40" />
                      <stop offset="0.5" stopColor="#22D3EE" stopOpacity="1" />
                      <stop offset="1" stopColor="#22D3EE" stopOpacity="0.40" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 7 12 C 7 8 9.5 5 13.5 5 C 17.5 5 20.5 8.5 24 12 C 27.5 15.5 30.5 19 34.5 19 C 38.5 19 41 16 41 12 C 41 8 38.5 5 34.5 5 C 30.5 5 27.5 8.5 24 12 C 20.5 15.5 17.5 19 13.5 19 C 9.5 19 7 16 7 12 Z"
                    stroke="url(#inf-g)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-black tracking-[0.12em] text-foreground font-display">
                  INFINITY<span className="text-primary">.</span>
                </span>
                <span className="text-[8.5px] font-semibold text-muted-foreground/50 tracking-[0.32em] uppercase mt-[3px]">
                  TECH
                </span>
              </div>
            </Link>

            {/* Desktop Nav — centered */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = link.path === "/" ? location === "/" : location.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative px-4 py-2.5 text-[13px] font-medium tracking-wide transition-colors duration-200",
                      isActive ? "text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {link.name}
                    <span className={cn(
                      "absolute bottom-1.5 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent rounded-full transition-transform duration-300 ease-out origin-center",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )} />
                  </Link>
                );
              })}
            </nav>

            {/* Right — actions */}
            <div className="flex items-center gap-1.5">

              {/* Language Toggle — borderless minimalist */}
              <button
                onClick={toggleLang}
                aria-label="Switch language"
                className="hidden md:flex items-center gap-1 px-2 py-1.5 transition-all duration-200 text-[11px] font-semibold tracking-[0.1em]"
              >
                <span className={lang === "en" ? "text-white" : "text-slate-500 hover:text-slate-300 transition-colors"}>EN</span>
                <span className="text-white/15 select-none">/</span>
                <span className={lang === "ar" ? "text-white" : "text-slate-500 hover:text-slate-300 transition-colors"}>AR</span>
              </button>

              {/* Mobile toggle */}
              <button
                aria-label="Toggle menu"
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all duration-200"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{    opacity: 0, rotate:  90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="open"
                      initial={{ opacity: 0, rotate:  90 }}
                      animate={{ opacity: 1, rotate:  0 }}
                      exit={{    opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[6px] md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0,     opacity: 1 }}
              exit={{    x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir="ltr"
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] flex flex-col md:hidden border-l border-primary/10"
              style={{ backgroundColor: "rgba(15, 23, 42, 0.97)", backdropFilter: "blur(20px)" }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/6">
                <div className="flex flex-col leading-none">
                  <span className="text-[13px] font-black tracking-[0.1em] text-foreground font-display">
                    INFINITY<span className="text-primary">.</span>
                  </span>
                  <span className="text-[8.5px] font-medium text-muted-foreground/55 tracking-[0.25em] uppercase mt-0.5">TECH</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language toggle in drawer */}
                  <button
                    onClick={toggleLang}
                    aria-label="Switch language"
                    className="flex items-center gap-0.5 px-2 py-1 rounded-md border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all text-[11px] font-semibold tracking-[0.08em]"
                  >
                    <span className={lang === "en" ? "text-primary" : "text-muted-foreground/60"}>EN</span>
                    <span className="text-white/15 mx-0.5 select-none">|</span>
                    <span className={lang === "ar" ? "text-primary" : "text-muted-foreground/60"}>AR</span>
                  </button>
                  <button
                    aria-label="Close menu"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer links */}
              <nav aria-label="Mobile navigation" className="flex flex-col px-3 pt-5 gap-1 flex-grow">
                {navLinks.map((link, idx) => {
                  const isActive = link.path === "/" ? location === "/" : location.startsWith(link.path);
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.055, duration: 0.22, ease: "easeOut" }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center px-4 py-3.5 rounded-xl text-sm font-medium border transition-all duration-200",
                          isActive
                            ? "text-primary bg-primary/6 border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent hover:border-white/8"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/4 to-transparent pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
