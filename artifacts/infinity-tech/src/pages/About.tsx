import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Cpu, Layers, Zap, Bot } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  level?: string | null;
  sort_order: number;
}

// ─── Intersection-observer fade-in ───────────────────────────────────────────

function useFadeIn(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
      style={{ color: "hsl(188 86% 53%)" }}
    >
      <span
        className="inline-block w-4 h-px"
        style={{ background: "hsl(188 86% 53%)" }}
      />
      {children}
    </p>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="w-full h-px my-20 sm:my-28"
      style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)" }}
    />
  );
}

// ─── Skill category card ──────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Hardware & PCB": <Layers className="w-4 h-4" />,
  "Embedded Firmware": <Cpu className="w-4 h-4" />,
  "Robotics & Systems": <Bot className="w-4 h-4" />,
  "Tools": <Zap className="w-4 h-4" />,
};

function SkillCard({
  category,
  items,
  isRTL,
  delay,
}: {
  category: string;
  items: Skill[];
  isRTL: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        className="h-full p-6 rounded-2xl transition-all duration-300 cursor-default"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(34,211,238,0.2)";
          el.style.boxShadow = "0 0 28px rgba(34,211,238,0.06)";
          el.style.background = "rgba(34,211,238,0.03)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,255,255,0.07)";
          el.style.boxShadow = "none";
          el.style.background = "rgba(255,255,255,0.03)";
        }}
      >
        {/* Icon + category */}
        <div
          className="flex items-center gap-2.5 mb-5"
          style={{ justifyContent: "start" }}
        >
          <span
            className="p-2 rounded-lg"
            style={{
              color: "hsl(188 86% 53%)",
              background: "rgba(34,211,238,0.1)",
            }}
          >
            {CATEGORY_ICONS[category] ?? <Zap className="w-4 h-4" />}
          </span>
          <h3
            className="text-xs font-bold uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {category}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {items.map(s => (
            <span
              key={s.id}
              className="px-2.5 py-1 text-[11px] font-medium rounded-md select-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {isRTL && s.name_ar ? s.name_ar : s.name_en}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Skills skeleton ──────────────────────────────────────────────────────────

function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="p-6 rounded-2xl animate-pulse"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/5" />
            <div className="h-2.5 w-24 rounded bg-white/5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="h-6 w-14 rounded-md bg-white/5" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function About() {
  const { t, isRTL } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then(r => r.json())
      .then((d: { skills?: Skill[] }) => setSkills(d.skills ?? []))
      .catch(() => setSkills([]))
      .finally(() => setLoadingSkills(false));
  }, []);

  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || "General";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO
        title={t("About — Fares Salah", "عن — فارس صلاح")}
        description={t(
          "Hardware engineer specialising in multi-layer PCB design, embedded firmware, and robotics systems.",
          "مهندس أجهزة متخصص في تصميم لوحات PCB متعددة الطبقات، البرمجيات المدمجة، وأنظمة الروبوتات.",
        )}
        keywords="hardware engineer, PCB designer, embedded systems, robotics, Fares Salah"
      />

      {/* ════════════════════════════════════════════════════════════════════
          §1  HERO
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center min-h-screen pt-20 pb-16 overflow-hidden">

        {/* Ambient gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(34,211,238,0.07) 0%, transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">

          {/* Tag */}
          <Reveal delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-wide"
              style={{
                border: "1px solid rgba(34,211,238,0.2)",
                background: "rgba(34,211,238,0.06)",
                color: "hsl(188 86% 65%)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "hsl(188 86% 53%)" }}
              />
              {t("Hardware Engineer & PCB Designer", "مهندس أجهزة ومصمم لوحات PCB")}
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={80}>
            <h1 className="font-black leading-[1.08] tracking-tight text-white mb-6">
              <span
                className="block text-4xl sm:text-5xl lg:text-7xl"
                style={{ fontFamily: isRTL ? "inherit" : "inherit" }}
              >
                {t("Building the", "أبني")}
              </span>
              <span
                className="block text-4xl sm:text-5xl lg:text-7xl"
                style={{
                  background: "linear-gradient(135deg, hsl(188 86% 60%) 0%, hsl(200 90% 70%) 50%, hsl(220 80% 70%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("Hardware of Tomorrow", "أجهزة الغد")}
              </span>
            </h1>
          </Reveal>

          {/* Subheadline */}
          <Reveal delay={160}>
            <p
              className="text-base sm:text-lg leading-relaxed mx-auto mb-10"
              style={{ color: "rgba(255,255,255,0.5)", maxWidth: "560px" }}
            >
              {t(
                "From silicon-level PCB design to real-time firmware — I build the systems that make intelligent machines work.",
                "من تصميم لوحات PCB على مستوى السيليكون إلى البرمجيات الآنية — أبني الأنظمة التي تجعل الآلات الذكية تعمل.",
              )}
            </p>
          </Reveal>

          {/* CTA */}
          <Reveal delay={240}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: "hsl(188 86% 53%)",
                  boxShadow: "0 0 0 0 rgba(34,211,238,0)",
                  color: "#0a0f18",
                  transition: "background 0.2s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "hsl(188 86% 47%)";
                  el.style.boxShadow = "0 0 28px rgba(34,211,238,0.4), 0 4px 16px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "hsl(188 86% 53%)";
                  el.style.boxShadow = "0 0 0 0 rgba(34,211,238,0)";
                }}
              >
                {t("Start a Project", "ابدأ مشروعًا")}
                <ArrowRight className="w-4 h-4" style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.04)",
                  transition: "border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(34,211,238,0.25)";
                  el.style.color = "hsl(188 86% 65%)";
                  el.style.background = "rgba(34,211,238,0.05)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.1)";
                  el.style.color = "rgba(255,255,255,0.7)";
                  el.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {t("View Portfolio", "عرض الأعمال")}
              </Link>
            </div>
          </Reveal>

          {/* Scroll indicator */}
          <Reveal delay={400}>
            <div className="mt-20 flex justify-center">
              <div
                className="flex flex-col items-center gap-2 opacity-30"
                style={{ color: "white" }}
              >
                <div
                  className="w-px h-10 rounded-full"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          §2  SKILLS / TECH STACK
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <Divider />

        <Reveal delay={0}>
          <div className="mb-12 sm:mb-16">
            <SectionLabel>{t("Tech Stack", "المكدس التقني")}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              {t("Technical Arsenal", "الترسانة التقنية")}
            </h2>
            <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "500px" }}>
              {t(
                "Four domains, one system. Every tool chosen for precision.",
                "أربعة مجالات، منظومة واحدة. كل أداة مختارة للدقة.",
              )}
            </p>
          </div>
        </Reveal>

        {loadingSkills ? (
          <SkillsSkeleton />
        ) : Object.keys(byCategory).length === 0 ? (
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            {t("No skills listed yet.", "لم يتم إضافة مهارات بعد.")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(byCategory).map(([category, items], i) => (
              <SkillCard
                key={category}
                category={category}
                items={items}
                isRTL={isRTL}
                delay={i * 80}
              />
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          §4  VISION
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <Divider />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div className="space-y-6">
            <Reveal delay={0}>
              <SectionLabel>{t("Vision", "الرؤية")}</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mt-1">
                {t(
                  "The future is physical — and programmable.",
                  "المستقبل مادي — وقابل للبرمجة.",
                )}
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t(
                  "The next paradigm shift isn't just in software — it's in how software interacts with the physical world. Intelligent machines need nervous systems: sensors, actuators, real-time control, and power-optimised silicon.",
                  "التحول النموذجي القادم ليس في البرمجيات وحدها — بل في كيفية تفاعل البرمجيات مع العالم المادي. تحتاج الآلات الذكية إلى أنظمة عصبية: مستشعرات، مشغّلات، تحكم آني، وسيليكون مُحسَّن للطاقة.",
                )}
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t(
                  "My goal with Infinity is to push that boundary — building systems where software and hardware are co-designed from the ground up, optimised together, and deployed with confidence.",
                  "هدفي مع إنفينيتي هو دفع هذا الحد — بناء أنظمة يُصمَّم فيها البرنامج والأجهزة معاً من الصفر، مُحسَّنان معاً، ومُنشَران بثقة.",
                )}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div
                className="flex flex-col gap-3 pt-2"
              >
                {[
                  t("Co-designed hardware + firmware architectures", "بنيات أجهزة وبرمجيات مُصمَّمة معاً"),
                  t("Power-aware embedded systems", "أنظمة مدمجة واعية بالطاقة"),
                  t("Real-time robotics & autonomous control", "روبوتيات آنية وتحكم مستقل"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "hsl(188 86% 53%)" }}
                    />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Decorative feature grid */}
          <Reveal delay={120}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Cpu className="w-5 h-5" />,
                  title: t("Silicon to System", "من السيليكون إلى النظام"),
                  desc: t(
                    "Full-stack ownership from component selection to deployment.",
                    "ملكية كاملة من اختيار المكون إلى النشر.",
                  ),
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: t("Power-Optimised", "مُحسَّن للطاقة"),
                  desc: t(
                    "Every µA matters. Firmware and layout co-optimised.",
                    "كل ميكروأمبير مهم. برمجيات وتخطيط مُحسَّنان معاً.",
                  ),
                },
                {
                  icon: <Bot className="w-5 h-5" />,
                  title: t("Real-Time Control", "التحكم الآني"),
                  desc: t(
                    "Hard real-time RTOS, PID, and sensor fusion.",
                    "نظام RTOS صارم، PID، ودمج حساسات.",
                  ),
                },
                {
                  icon: <Layers className="w-5 h-5" />,
                  title: t("High-Density PCB", "لوحات PCB عالية الكثافة"),
                  desc: t(
                    "6-layer HDI boards with signal integrity focus.",
                    "لوحات HDI بستة طبقات مع تركيز على سلامة الإشارة.",
                  ),
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(34,211,238,0.18)";
                    el.style.background = "rgba(34,211,238,0.03)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <span
                    className="inline-flex p-2 rounded-lg mb-3"
                    style={{ background: "rgba(34,211,238,0.1)", color: "hsl(188 86% 53%)" }}
                  >
                    {feat.icon}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-1">{feat.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          §5  CTA
          ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-24 sm:pb-36">
        <Divider />

        <Reveal delay={0}>
          <div
            className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(96,165,250,0.06) 50%, rgba(167,139,250,0.04) 100%)",
              border: "1px solid rgba(34,211,238,0.12)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, rgba(34,211,238,0.3), transparent)" }}
            />

            <SectionLabel>{t("Let's Build", "لنبني معاً")}</SectionLabel>

            <h2
              className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2 mb-5 leading-tight"
            >
              {t(
                <>Have a project<br />in mind?</>,
                <>لديك مشروع<br />في ذهنك؟</>,
              )}
            </h2>

            <p
              className="text-base mx-auto mb-10"
              style={{ color: "rgba(255,255,255,0.5)", maxWidth: "480px" }}
            >
              {t(
                "From concept to prototype to production — let's engineer it right from the start.",
                "من الفكرة إلى النموذج إلى الإنتاج — لنهندسها بشكل صحيح من البداية.",
              )}
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold tracking-wide active:scale-[0.97] transition-transform"
              style={{
                background: "hsl(188 86% 53%)",
                color: "#0a0f18",
                transition: "background 0.2s ease, box-shadow 0.25s ease, transform 0.15s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "hsl(188 86% 47%)";
                el.style.boxShadow = "0 0 32px rgba(34,211,238,0.45), 0 8px 24px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "hsl(188 86% 53%)";
                el.style.boxShadow = "none";
              }}
            >
              {t("Get in Touch", "تواصل معي")}
              <ArrowRight className="w-4 h-4" style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
