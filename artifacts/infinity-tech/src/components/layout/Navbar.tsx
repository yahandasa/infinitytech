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

/*
 * Navbar stability contract
 * ─────────────────────────
 * The header height is locked at 4.5rem at ALL breakpoints.
 * Every text node inside the header has an explicit font-size and
 * line-height so that switching between Inter (EN) and Cairo (AR)
 * cannot cause vertical reflow.
 *
 * The `data-navbar` attribute is the hook for the CSS override in
 * index.css that prevents `body.lang-ar *` from changing font metrics
 * inside this component.
 *
 * Design reference: Stripe / Vercel
 * ──────────────────────────────────
 * - No heavy glow shadows on hover
 * - Nav items use a ghost-pill background on hover / active
 * - Border is a ::after pseudo-element in CSS (no overlap risk)
 * - Scrolled state: refined bg + a single-pixel ring shadow, not a
 *   large drop-shadow
 */

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
  const isAR = lang === "ar";

  return (
    <>
      {/* ─── Fixed header ─────────────────────────────────────────────── */}
      <header
        data-navbar
        dir="ltr"
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "bg-[#080d18]/50 backdrop-blur-[18px] saturate-[180%]",
          /*
           * border-b is the bottom separator.
           * Height is 5rem (80px) — the extra 8px over the old 72px
           * gives the content genuine vertical breathing room so the
           * border reads as a deliberate separator and never feels
           * cramped against the logo or nav text.
           */
          "border-b border-white/[0.07]",
          "transition-[background-color,box-shadow] duration-500 ease-out",
          isScrolled && [
            "bg-[#080d18]/80",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.28)]",
          ],
        )}
        style={{ height: "5rem", minHeight: "5rem", maxHeight: "5rem" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full overflow-hidden">

            {/* ── Logo ──────────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              {/*
               * Logo icon — no blur-orb; a clean drop-shadow on hover only.
               * Opacity transition on the path itself so it feels responsive
               * without any jarring glow burst.
               */}
              <svg
                viewBox="0 0 48 24"
                width="44"
                height="22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Infinity Tech logo"
                className={cn(
                  "flex-shrink-0 transition-all duration-300 ease-out",
                  "group-hover:drop-shadow-[0_0_7px_rgba(34,211,238,0.38)]",
                  "group-hover:scale-[1.04]",
                )}
              >
                <defs>
                  <linearGradient id="inf-g" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22D3EE" stopOpacity="0.35" />
                    <stop offset="0.5" stopColor="#22D3EE" stopOpacity="1" />
                    <stop offset="1" stopColor="#22D3EE" stopOpacity="0.35" />
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

              {/* Wordmark */}
              <div className="flex flex-col leading-none" style={{ gap: "3px" }}>
                <span
                  className="nb-wordmark font-black text-foreground"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    lineHeight: 1,
                    letterSpacing: "0.12em",
                  }}
                >
                  INFINITY<span style={{ color: "hsl(188 86% 53%)" }}>.</span>
                </span>
                <span
                  className="nb-wordmark-sub font-semibold text-muted-foreground/50"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "8.5px",
                    lineHeight: 1,
                    letterSpacing: "0.32em",
                  }}
                >
                  TECH
                </span>
              </div>
            </Link>

            {/* ── Desktop nav — centered ─────────────────────────────── */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2"
            >
              {navLinks.map((link) => {
                const isActive = link.path === "/" ? location === "/" : location.startsWith(link.path);
                const label = isAR ? link.nameAr : link.name;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      /*
                       * Ghost-pill style — inspired by Stripe / Vercel nav.
                       *
                       * Active:  white text + slightly visible pill background
                       * Hover:   off-white text + faint pill background
                       * Default: muted slate text, no background
                       *
                       * No sliding underlines, no glow shadows — just clean
                       * background transitions and color shifts.
                       */
                      "relative px-3.5 py-2 rounded-lg",
                      "transition-[color,background-color] duration-200 ease-out",
                      isActive
                        ? "text-white bg-white/[0.08]"
                        : "text-slate-400 hover:text-white/90 hover:bg-white/[0.05]",
                    )}
                    style={{
                      fontFamily: isAR ? "var(--font-arabic)" : "var(--font-sans)",
                      fontSize: "13px",
                      lineHeight: 1,
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: isAR ? 0 : "0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                    {/*
                     * Active indicator — a 1.5px line in primary color anchored
                     * at the bottom of the pill.  Always rendered for active
                     * items; no scale-in animation to keep it stable.
                     */}
                    {isActive && (
                      <span
                        className="absolute bottom-[5px] left-[30%] right-[30%] h-[1.5px] rounded-full"
                        style={{ background: "hsl(188 86% 53% / 0.7)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right actions ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-shrink-0">

              {/*
               * Language toggle — bordered pill with a soft hover background.
               * Fixed width (56 px) so the EN↔AR switch never causes
               * the right-edge to shift.
               */}
              <button
                onClick={toggleLang}
                aria-label="Switch language"
                className={cn(
                  "hidden md:flex items-center h-7 rounded-md",
                  "border border-white/[0.09] hover:border-white/[0.18] hover:bg-white/[0.05]",
                  "transition-all duration-200 ease-out",
                )}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  lineHeight: 1,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  width: "56px",
                  justifyContent: "center",
                  gap: "3px",
                }}
              >
                <span style={{ color: lang === "en" ? "rgba(255,255,255,0.9)" : "rgba(148,163,184,0.45)" }}>EN</span>
                <span style={{ color: "rgba(255,255,255,0.12)" }}>/</span>
                <span style={{ color: lang === "ar" ? "rgba(255,255,255,0.9)" : "rgba(148,163,184,0.45)" }}>AR</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                aria-label="Toggle menu"
                className={cn(
                  "md:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  "text-slate-400 hover:text-white",
                  "border border-transparent hover:border-white/[0.1] hover:bg-white/[0.05]",
                  "transition-all duration-200",
                )}
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

      {/* ─── Mobile drawer ────────────────────────────────────────────── */}
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[4px] md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%", opacity: 0.6 }}
              animate={{ x: 0,      opacity: 1   }}
              exit={{    x: "100%", opacity: 0   }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              dir="ltr"
              className="fixed top-0 right-0 bottom-0 z-50 w-[272px] flex flex-col md:hidden"
              style={{
                backgroundColor: "rgba(8, 13, 24, 0.97)",
                backdropFilter: "blur(24px)",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5"
                style={{
                  height: "5rem",
                  minHeight: "5rem",
                  flexShrink: 0,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex flex-col leading-none" style={{ gap: "3px" }}>
                  <span
                    className="font-black text-foreground"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      lineHeight: 1,
                      letterSpacing: "0.1em",
                    }}
                  >
                    INFINITY<span style={{ color: "hsl(188 86% 53%)" }}>.</span>
                  </span>
                  <span
                    className="font-medium text-muted-foreground/55"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "8.5px",
                      lineHeight: 1,
                      letterSpacing: "0.25em",
                    }}
                  >
                    TECH
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language toggle in drawer */}
                  <button
                    onClick={toggleLang}
                    aria-label="Switch language"
                    className="flex items-center h-7 px-2.5 rounded-md border border-white/[0.09] hover:border-primary/30 hover:bg-primary/[0.06] transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      lineHeight: 1,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      gap: "3px",
                    }}
                  >
                    <span style={{ color: lang === "en" ? "hsl(188 86% 53%)" : "rgba(148,163,184,0.55)" }}>EN</span>
                    <span style={{ color: "rgba(255,255,255,0.12)", margin: "0 1px" }}>|</span>
                    <span style={{ color: lang === "ar" ? "hsl(188 86% 53%)" : "rgba(148,163,184,0.55)" }}>AR</span>
                  </button>

                  <button
                    aria-label="Close menu"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Drawer nav links */}
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col px-3 pt-4 gap-1 flex-grow"
              >
                {navLinks.map((link, idx) => {
                  const isActive = link.path === "/" ? location === "/" : location.startsWith(link.path);
                  const label = isAR ? link.nameAr : link.name;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.2, ease: "easeOut" }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-xl border transition-all duration-200",
                          isActive
                            ? "text-primary bg-primary/[0.07] border-primary/[0.18]"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.05] border-transparent hover:border-white/[0.08]",
                        )}
                        style={{
                          fontFamily: isAR ? "var(--font-arabic)" : "var(--font-sans)",
                          fontSize: "14px",
                          fontWeight: isActive ? 600 : 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Subtle bottom gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(34,211,238,0.03), transparent)" }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
