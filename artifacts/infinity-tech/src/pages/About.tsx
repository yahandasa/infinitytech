import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { MapPin, Mail } from "lucide-react";
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

// ─── Intersection-observer fade-in hook ───────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Skill tag ────────────────────────────────────────────────────────────────

function SkillTag({ label }: { label: string }) {
  return (
    <span className="
      px-3 py-1.5 text-xs font-medium rounded-lg select-none cursor-default
      bg-background border border-border text-muted-foreground
      transition-all duration-200
      hover:border-primary/40 hover:bg-primary/5 hover:text-primary
      hover:shadow-[0_0_8px_rgba(34,211,238,0.15)]
    ">
      {label}
    </span>
  );
}

// ─── Skills grid ──────────────────────────────────────────────────────────────

function SkillsGrid({ skills, isRTL }: { skills: Skill[]; isRTL: boolean }) {
  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || "General";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {Object.entries(byCategory).map(([category, items]) => (
        <div
          key={category}
          className="
            p-4 sm:p-5 rounded-2xl bg-card border border-border
            transition-all duration-200
            hover:border-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]
          "
        >
          <h3
            className="text-[11px] font-bold text-foreground uppercase tracking-[0.18em] mb-3"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {category}
          </h3>
          <div
            className="flex flex-wrap gap-2"
            style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
          >
            {items.map(s => (
              <SkillTag key={s.id} label={isRTL && s.name_ar ? s.name_ar : s.name_en} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Skills skeleton ──────────────────────────────────────────────────────────

function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-5 rounded-2xl bg-card border border-border animate-pulse">
          <div className="h-3 w-28 rounded bg-border/60 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(j => <div key={j} className="h-7 w-16 rounded-lg bg-border/40" />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function About() {
  const { t, isRTL } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then(r => r.json())
      .then((d: { skills?: Skill[] }) => setSkills(d.skills ?? []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  const textAlign = isRTL ? "right" : "left";

  return (
    <div className="min-h-screen w-full pt-20 sm:pt-24 pb-20 sm:pb-32">
      <SEO
        title={t("About — Fares Salah", "عن — فارس صلاح")}
        description={t(
          "Hardware engineer specialising in multi-layer PCB design, embedded firmware, and robotics systems.",
          "مهندس أجهزة متخصص في تصميم لوحات PCB متعددة الطبقات، البرمجيات المدمجة، وأنظمة الروبوتات.",
        )}
        keywords="hardware engineer, PCB designer, embedded systems, robotics, Fares Salah"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
         * items-start is required so the sticky left column can work correctly.
         * Without it the grid items stretch to the same height and sticky never
         * has anywhere to scroll within.
         */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start">

          {/* ══ LEFT STICKY SIDEBAR ═══════════════════════════════════════════ */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div
              className="
                rounded-2xl sm:rounded-3xl overflow-hidden
                border border-border bg-card
                shadow-[0_4px_32px_rgba(0,0,0,0.35)]
              "
            >
              {/* Avatar */}
              <div className="relative group overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/avatar.png`}
                  alt="Fares Salah"
                  loading="lazy"
                  className="
                    w-full aspect-square object-cover
                    grayscale opacity-80
                    group-hover:grayscale-0 group-hover:opacity-100
                    transition-[filter,opacity] duration-500
                  "
                />
                {/* Cyan overlay on hover */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none" />
                {/* Bottom fade into card */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Identity block */}
              <div className="px-5 pb-5 pt-3" style={{ textAlign }}>
                {/* Primary name — always Arabic as requested */}
                <h1 className="text-2xl font-black tracking-tight text-foreground leading-tight mb-0.5" dir="rtl" style={{ textAlign: "right" }}>
                  مهندس فارس
                </h1>
                <p className="text-primary font-medium text-sm mb-4">
                  {t("Hardware Engineer & PCB Designer", "مهندس أجهزة ومصمم لوحات PCB")}
                </p>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 mb-5">
                  <div
                    className="flex items-center gap-2 text-muted-foreground text-xs"
                    style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
                  >
                    <MapPin className="w-3 h-3 shrink-0 text-primary/60" />
                    <span>{t("Alexandria, Egypt", "الإسكندرية، مصر")}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-muted-foreground text-xs"
                    style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
                  >
                    <Mail className="w-3 h-3 shrink-0 text-primary/60" />
                    <span>fares@infinitytech.dev</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                  {t(
                    "Specialising in the full hardware stack — from schematic capture and multi-layer PCB layout to bare-metal firmware and real-time control systems.",
                    "متخصص في المكدس الكامل للأجهزة — من رسم المخططات وتصميم لوحات PCB متعددة الطبقات إلى البرمجيات الثابتة وأنظمة التحكم الآني.",
                  )}
                </p>

                {/* ── CTA buttons ────────────────────────────────────────── */}
                <div className="flex gap-2.5">
                  {/* Primary: تواصل — solid cyan */}
                  <Link
                    href="/contact"
                    className="
                      flex-1 py-2.5 rounded-xl text-center text-sm font-bold
                      bg-primary text-primary-foreground
                      transition-all duration-200
                      hover:bg-primary/90
                      hover:shadow-[0_0_18px_rgba(34,211,238,0.35)]
                      active:scale-[0.97]
                    "
                  >
                    تواصل
                  </Link>

                  {/* Secondary: البورتفوليو — glassmorphism outline */}
                  <Link
                    href="/projects"
                    className="
                      flex-1 py-2.5 rounded-xl text-center text-sm font-bold
                      bg-white/5 backdrop-blur-sm
                      border border-white/12
                      text-foreground/80
                      transition-all duration-200
                      hover:bg-white/10 hover:border-primary/30 hover:text-primary
                      hover:shadow-[0_0_12px_rgba(34,211,238,0.12)]
                      active:scale-[0.97]
                    "
                  >
                    البورتفوليو
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT SCROLLABLE CONTENT ══════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-10 lg:space-y-14">

            {/* Philosophy */}
            <FadeSection delay={60}>
              <section style={{ textAlign }}>
                <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                  {t("Philosophy", "الفلسفة")}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-5">
                  {t("My Vision", "رؤيتي")}
                </h2>
                <div className="text-base text-muted-foreground leading-relaxed space-y-4 font-light">
                  <p>
                    {t(
                      "The next paradigm shift isn't just in software — it's in how software interacts with the physical world. I build the nervous systems for these new machines.",
                      "التحول النموذجي القادم ليس في البرمجيات وحدها — بل في كيفية تفاعل البرمجيات مع العالم المادي. أنا أبني الأنظمة العصبية لهذه الآلات الجديدة.",
                    )}
                  </p>
                  <p>
                    {t(
                      <>
                        My engineering philosophy is rooted in{" "}
                        <strong className="font-semibold text-foreground">first-principles design</strong>{" "}
                        and{" "}
                        <strong className="font-semibold text-foreground">vertical integration</strong>.
                        By understanding a system from the bare-metal substrate up through the silicon, the RTOS,
                        and into the firmware layer, I create architectures that are highly optimised,
                        power-efficient, and robust.
                      </>,
                      <>
                        فلسفتي الهندسية متجذرة في{" "}
                        <strong className="font-semibold text-foreground">التصميم من المبادئ الأولى</strong>{" "}
                        و
                        <strong className="font-semibold text-foreground">التكامل الرأسي</strong>.
                        من خلال فهم النظام من طبقة البرمجة المنخفضة المستوى عبر السيليكون ونظام RTOS إلى طبقة البرمجيات الثابتة،
                        أبني بنيات عالية الأداء وكفاءة استهلاك الطاقة والمتانة الاستثنائية.
                      </>,
                    )}
                  </p>
                  <p>
                    {t(
                      "Whether it's designing a 6-layer high-density PCB, writing lock-free ring buffers for DMA-driven sensors, or fine-tuning motor control PID loops — I thrive on hard technical constraints.",
                      "سواء كان ذلك تصميم لوحة PCB عالية الكثافة بستة طبقات، أو كتابة حلقات حلقية خالية من الإقفال لأجهزة استشعار DMA، أو ضبط حلقات PID للتحكم في المحركات — أزدهر في مواجهة القيود التقنية الصعبة.",
                    )}
                  </p>
                </div>
              </section>
            </FadeSection>

            <div className="h-px bg-border/40" />

            {/* Technical Arsenal */}
            <FadeSection delay={140}>
              <section>
                <div style={{ textAlign }} className="mb-6 sm:mb-8">
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                    {t("Skills", "المهارات")}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {t("Technical Arsenal", "الترسانة التقنية")}
                  </h2>
                </div>

                {loading ? (
                  <SkillsSkeleton />
                ) : skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground" style={{ textAlign }}>
                    {t("No skills listed yet.", "لم يتم إضافة مهارات بعد.")}
                  </p>
                ) : (
                  <SkillsGrid skills={skills} isRTL={isRTL} />
                )}
              </section>
            </FadeSection>

          </div>
        </div>
      </div>
    </div>
  );
}
