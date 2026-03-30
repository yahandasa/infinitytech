import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, CircuitBoard, Cpu, Layers, Mail, Microchip, Wifi, Zap } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { SEO, SITE_JSONLD, PERSON_JSONLD } from "@/components/SEO";

/* ─── constants ─────────────────────────────────────────── */

const CODE_SNIPPET = `// PCB system init — CISPR 32B compliant
#define IMU_RATE_HZ   8000
#define SW_FREQ_KHZ    500
#define PCB_LAYERS       6

void board_init(void) {
  pwm_set_freq(SW_FREQ_KHZ);
  imu_set_rate(IMU_RATE_HZ);
  emi_filter_enable(CISPR_32B);
}`;

const CHAR_BASE      = 55;
const CHAR_VARIANCE  = 0.4;
const PUNCT_PAUSE    = 180;
const NEWLINE_PAUSE  = 320;

/* ─── code typewriter ────────────────────────────────────── */

function useCodeTypewriter(text: string, startDelay = 900) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      const i = idxRef.current;
      if (i >= text.length) { setDone(true); return; }
      const ch = text[i];
      idxRef.current = i + 1;
      setDisplayed(text.slice(0, i + 1));
      let delay = CHAR_BASE * 0.6 * (1 + (Math.random() * 2 - 1) * CHAR_VARIANCE);
      if (ch === "\n") delay += NEWLINE_PAUSE;
      else if (".,:;{}()".includes(ch)) delay += PUNCT_PAUSE * 0.5;
      timer = setTimeout(tick, delay);
    }
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay]);

  return { displayed, done };
}

/* ─── blinking cursor ────────────────────────────────────── */

function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="inline-block w-[2px] h-[0.82em] bg-primary align-middle ml-[2px] rounded-[1px]"
      style={{ opacity: on ? 1 : 0, transition: "opacity 0.08s" }}
    />
  );
}

/* ─── professional typewriter ────────────────────────────── */

const HEADLINE_WORDS = ["ARCHITECTURE", "LOGIC", "SYSTEMS"] as const;

type Phase = "typing" | "hold" | "deleting" | "gap";

function useProfessionalTypewriter(words: readonly string[]) {
  const [display,   setDisplay]   = useState("");
  const [wordIdx,   setWordIdx]   = useState(0);
  const [phase,     setPhase]     = useState<Phase>("typing");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const TYPE_MS   = 105; // per-char base (forward)
    const DELETE_MS =  48; // per-char base (backspace — snappier)
    const HOLD_MS   = 1600; // pause after word fully typed
    const GAP_MS    =  280; // pause after word fully deleted

    const word = words[wordIdx];

    if (phase === "typing") {
      if (display.length < word.length) {
        const jitter = TYPE_MS * (0.75 + Math.random() * 0.5);
        timer = setTimeout(
          () => setDisplay(word.slice(0, display.length + 1)),
          jitter,
        );
      } else {
        timer = setTimeout(() => setPhase("hold"), HOLD_MS);
      }
    } else if (phase === "hold") {
      setPhase("deleting");
    } else if (phase === "deleting") {
      if (display.length > 0) {
        const jitter = DELETE_MS * (0.75 + Math.random() * 0.5);
        timer = setTimeout(
          () => setDisplay(d => d.slice(0, -1)),
          jitter,
        );
      } else {
        timer = setTimeout(() => {
          setWordIdx(i => (i + 1) % words.length);
          setPhase("gap");
        }, GAP_MS);
      }
    } else {
      // gap — short breath before typing next word
      timer = setTimeout(() => setPhase("typing"), 80);
    }

    return () => clearTimeout(timer);
  }, [display, phase, wordIdx, words]);

  return { display, isDeleting: phase === "deleting" };
}

/* ─── metrics ────────────────────────────────────────────── */

const METRICS = [
  { icon: Wifi,         label: "EMI Class",  value: "CISPR 32B", accent: false },
  { icon: Layers,       label: "PCB Stack",  value: "Up to 6L",  accent: false },
  { icon: Zap,          label: "IMU Rate",   value: "8 kHz",     accent: true  },
  { icon: CircuitBoard, label: "Sw. Freq",   value: "500 kHz",   accent: false },
];

/* ─── framer variants ────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

/* ─── component ──────────────────────────────────────────── */

export function Home() {
  const { data: projects, isLoading } = useProjects();
  const featuredProjects = projects?.slice(0, 3) || [];
  const { displayed: codeDisplayed, done: codeDone } = useCodeTypewriter(CODE_SNIPPET, 600);
  const { display: headlineText, isDeleting: headlineDeleting } = useProfessionalTypewriter(HEADLINE_WORDS);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <SEO
        title="Fares Salah — Hardware Engineer & PCB Design"
        description="Hardware engineer specializing in multi-layer PCB design, bare-metal firmware, and production-ready embedded systems — from schematic to silicon."
        keywords="hardware engineer, PCB design, embedded systems, firmware, STM32, FPGA, KiCad, Altium, robotics, ROS2"
        jsonLd={[SITE_JSONLD, PERSON_JSONLD]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full lg:h-[100dvh] overflow-hidden flex flex-col">

        {/* Background glow */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.055) 0%, transparent 68%)",
          }}
        />

        {/* Navbar clearance */}
        <div className="flex-none h-16" />

        {/* ── MOBILE layout (< lg): natural flow ── */}
        <div className="lg:hidden flex flex-col items-center text-center px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16 relative z-10">

          {/* Badge */}
          <motion.div {...fadeUp(0)} className="inline-flex self-center items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border backdrop-blur-[8px] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
              Hardware Eng &amp; PCB Design
            </span>
          </motion.div>

          {/* Static bilingual headline */}
          <div className="mb-5 text-center relative">
            {/* Radial glow behind text */}
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.0) 75%)",
              }}
            />
            {/* Arabic headline */}
            <h1
              className="font-black leading-[1.25] tracking-tight text-[#F8FAFC] mb-3"
              style={{
                fontSize: "clamp(1.7rem, 6vw, 2.4rem)",
                fontFamily: "var(--font-arabic), sans-serif",
                direction: "rtl",
                textShadow: "0 2px 24px rgba(34,211,238,0.10)",
              }}
            >
              هندسة التفاصيل.. إتقان النظم.
            </h1>
            {/* Animated typewriter — mobile */}
            <div
              className="flex items-center justify-center select-none mt-1"
              aria-label="Architecture · Logic · Systems"
            >
              {/* Width anchor — locked to longest word so layout never shifts */}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="invisible whitespace-nowrap font-bold uppercase tracking-[0.22em]"
                  style={{ fontSize: "clamp(0.72rem, 2.8vw, 0.82rem)" }}
                >
                  ARCHITECTURE
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="whitespace-nowrap font-bold uppercase tracking-[0.22em] text-primary"
                    style={{ fontSize: "clamp(0.72rem, 2.8vw, 0.82rem)" }}
                  >
                    {headlineText}
                  </span>
                  <span className="flex-shrink-0 ml-[2px]"><Cursor /></span>
                </span>
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.38)}
            className="text-sm sm:text-[15px] text-muted-foreground leading-[1.75] mb-7 max-w-lg"
          >
            Hardware engineer specializing in{" "}
            <span className="text-foreground/90 font-medium">multi-layer PCB design</span>,{" "}
            <span className="text-foreground/90 font-medium">bare-metal firmware</span>, and
            production-ready{" "}
            <span className="text-foreground/90 font-medium">embedded systems</span>{" "}
            <span className="text-primary/80">—</span>{" "}
            from schematic to silicon.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.44)}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link
              href="/projects"
              className="px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors duration-200 text-[15px]"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-white/5 transition-colors duration-200 text-center text-[15px]"
            >
              <Mail className="w-4 h-4 text-primary" />
              Contact
            </Link>
          </motion.div>

        </div>

        {/* ── DESKTOP layout (lg+): grid + pinned stats ── */}
        <div className="hidden lg:flex flex-1 items-center px-6 lg:px-8 relative z-10 min-h-0">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-12 gap-10 xl:gap-14 items-center">

              {/* Left column */}
              <div className="col-span-7 flex flex-col items-start">
                <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border backdrop-blur-[8px] mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
                    Hardware Eng &amp; PCB Design
                  </span>
                </motion.div>

                {/* Static bilingual headline — desktop */}
                <div className="mb-6 relative">
                  {/* Radial glow behind text */}
                  <div
                    aria-hidden
                    className="absolute -inset-10 -z-10 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.0) 72%)",
                    }}
                  />
                  {/* Arabic headline */}
                  <h1
                    className="font-black leading-[1.2] tracking-tight text-[#F8FAFC] mb-4"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.4rem)",
                      fontFamily: "var(--font-arabic), sans-serif",
                      direction: "rtl",
                      textAlign: "center",
                      textShadow: "0 2px 32px rgba(34,211,238,0.10)",
                    }}
                  >
                    هندسة التفاصيل.. إتقان النظم.
                  </h1>
                  {/* Animated typewriter — desktop */}
                  <div
                    className="flex items-center select-none mt-1"
                    aria-label="Architecture · Logic · Systems"
                  >
                    {/* Width anchor — locked to longest word so layout never shifts */}
                    <span className="relative inline-block">
                      <span
                        aria-hidden
                        className="invisible whitespace-nowrap font-bold uppercase tracking-[0.25em]"
                        style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)" }}
                      >
                        ARCHITECTURE
                      </span>
                      <span className="absolute inset-0 flex items-center">
                        <span
                          className="whitespace-nowrap font-bold uppercase tracking-[0.25em] text-primary"
                          style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)" }}
                        >
                          {headlineText}
                        </span>
                        <span className="flex-shrink-0 ml-[2px]"><Cursor /></span>
                      </span>
                    </span>
                  </div>
                </div>

                <motion.p
                  {...fadeUp(0.38)}
                  className="text-[15px] md:text-base text-muted-foreground leading-[1.75] mb-6 max-w-xl"
                >
                  Hardware engineer specializing in{" "}
                  <span className="text-foreground/90 font-medium">multi-layer PCB design</span>,{" "}
                  <span className="text-foreground/90 font-medium">bare-metal firmware</span>, and
                  production-ready{" "}
                  <span className="text-foreground/90 font-medium">embedded systems</span>{" "}
                  <span className="text-primary/80">—</span>{" "}
                  from schematic to silicon.
                </motion.p>

                <motion.div
                  {...fadeUp(0.48)}
                  className="flex items-center gap-4"
                >
                  <Link
                    href="/projects"
                    className="px-7 py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors duration-200 text-[15px]"
                  >
                    View Projects <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-white/5 transition-colors duration-200 text-[15px]"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    Contact
                  </Link>
                </motion.div>
              </div>

              {/* Right column — dashboard card */}
              <div className="col-span-5 flex">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-full rounded-xl bg-card overflow-hidden group/card"
                  style={{
                    border: "1px solid rgba(34,211,238,0.12)",
                    boxShadow: "0 0 0 1px rgba(34,211,238,0.04), 0 8px 32px rgba(0,0,0,0.4)",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  whileHover={{
                    boxShadow: "0 0 0 1px rgba(34,211,238,0.2), 0 0 40px rgba(34,211,238,0.08), 0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)" }} />
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0D1117]">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">system · live</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-primary/30" />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {METRICS.map(({ icon: Icon, label, value, accent }, i) => (
                        <div
                          key={label}
                          className="metric-shimmer flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-background border border-white/5 hover:border-primary/25 hover:bg-primary/5 transition-colors duration-200 cursor-default"
                          style={{ animationDelay: `${i * 0.9}s` }}
                        >
                          <div className="w-7 h-7 flex-shrink-0 rounded-md bg-primary/8 border border-primary/15 flex items-center justify-center group-hover/card:bg-primary/12 transition-colors duration-300">
                            <Icon className="w-3.5 h-3.5 text-primary/80" />
                          </div>
                          <div className="min-w-0 flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 leading-none mb-0.5">{label}</span>
                            <span className={`text-[13px] font-mono font-semibold leading-none truncate ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border border-white/5 bg-[#0D1117] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                          <div className="w-2 h-2 rounded-full bg-primary/20" />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground/50">inference.c</span>
                        <span className="text-[9px] font-mono text-primary/50 uppercase tracking-widest">● ready</span>
                      </div>
                      <div className="relative px-3 py-3">
                        <pre aria-hidden className="invisible text-[10.5px] font-mono leading-[1.65] whitespace-pre">
                          <code>{CODE_SNIPPET}</code>
                        </pre>
                        <pre className="absolute inset-0 px-3 py-3 text-[10.5px] font-mono leading-[1.65] whitespace-pre overflow-x-hidden">
                          <code className="text-[#A8B5C8]">
                            {codeDisplayed.split("\n").map((line, li, arr) => {
                              const isComment    = line.trimStart().startsWith("//");
                              const isPreproc    = line.trimStart().startsWith("#");
                              return (
                                <span key={li} className="block">
                                  {isComment
                                    ? <span className="text-[#4D6880]">{line}</span>
                                    : isPreproc
                                    ? <span className="text-[#4D6880]">{line}</span>
                                    : line.split(/(\b(?:void|pwm_set_freq|imu_set_rate|emi_filter_enable|IMU_RATE_HZ|SW_FREQ_KHZ|PCB_LAYERS|CISPR_32B)\b)/).map((seg, si) =>
                                        /^(void)$/.test(seg)
                                          ? <span key={si} className="text-primary/80">{seg}</span>
                                          : /^(pwm_set_freq|imu_set_rate|emi_filter_enable|IMU_RATE_HZ|SW_FREQ_KHZ|PCB_LAYERS|CISPR_32B)$/.test(seg)
                                          ? <span key={si} className="text-[#79C0FF]">{seg}</span>
                                          : <span key={si}>{seg}</span>
                                      )
                                  }
                                  {li === arr.length - 1 && !codeDone && <Cursor />}
                                </span>
                              );
                            })}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>

      </section>

      <div className="section-divider" />

      {/* ── Expertise ─────────────────────────────────────── */}
      <section className="py-24 relative z-10 bg-background/50 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Core Disciplines</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground">What I Build</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Layers,
                badge: "Up to 6L",
                title: "PCB Layout & Signal Integrity",
                desc: "Multi-layer stack-up design with controlled-impedance routing for high-speed differential pairs, CAN bus transceivers, and dense power rails. Every layer assignment optimized for signal return paths, thermal relief, and DFM-ready production output.",
                tags: ["KiCad", "Altium Designer", "Impedance Control", "CISPR 32B", "DFM"],
              },
              {
                icon: Cpu,
                badge: "ARM Cortex-M",
                title: "Embedded Firmware & RTOS",
                desc: "Bare-metal and FreeRTOS firmware on STM32 F4/H7 targets — DMA-driven sensor acquisition at 8 kHz, lock-free ring buffers, CAN/SPI/I2C/USB protocol stacks, and deterministic task scheduling under hard real-time constraints.",
                tags: ["C / C++", "FreeRTOS", "STM32", "DMA", "CAN Bus"],
              },
              {
                icon: Zap,
                badge: "500 kHz",
                title: "Power Electronics & EMI",
                desc: "GaN FET switching regulators, multi-cell LiPo BMS, and low-noise LDO rails tailored for mixed-signal boards. EMI filtering designed and bench-validated against CISPR 32 Class B — from bulk decoupling strategy to ferrite bead placement.",
                tags: ["GaN FETs", "BMS", "EMI Filter", "LDO Design", "CISPR 32B"],
              },
              {
                icon: CircuitBoard,
                badge: "ROS2 / Nav2",
                title: "Robotics & Autonomous Systems",
                desc: "Full-stack robotic platforms spanning custom sensor PCBs, stereo vision pipelines, and Nav2-based autonomous navigation. Sensor fusion using EKF across IMU, wheel encoders, and lidar — from bench prototype to field-tested deployment.",
                tags: ["ROS2", "SLAM", "EKF Fusion", "OpenCV", "Nav2"],
              },
            ].map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/25 transition-all duration-300 group flex flex-col gap-3.5"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[9px] font-mono font-semibold text-primary/70 tracking-widest uppercase bg-primary/5 border border-primary/15 px-2 py-0.5 rounded">
                    {f.badge}
                  </span>
                </div>

                {/* Body */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5 tracking-tight">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-[1.7]">{f.desc}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {f.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Featured Projects ─────────────────────────────── */}
      <section className="py-24 relative z-10 bg-background/30 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Portfolio</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-2">Featured Work</h2>
              <p className="text-muted-foreground">Select highlights from recent hardware and embedded systems projects.</p>
            </div>
            <Link href="/projects" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-card animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 hover-card-anim flex flex-col relative"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-1 text-[10px] font-mono font-medium rounded bg-card/90 backdrop-blur-[8px] border border-border text-foreground">
                      {idx === 0 ? "Active" : "Completed"}
                    </span>
                  </div>
                  <div className="h-48 w-full bg-gradient-to-br from-border/50 to-background relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 text-[10px] font-mono font-medium rounded bg-background/80 backdrop-blur-[8px] border border-border text-primary uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-grow line-clamp-3 mb-6">
                      {project.description}
                    </p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="w-full py-2.5 text-center text-sm font-medium rounded-lg bg-background border border-border text-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 sm:hidden text-center">
            <Link href="/projects" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
              View All Projects <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
