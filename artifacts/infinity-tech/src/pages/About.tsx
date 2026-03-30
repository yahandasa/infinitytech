import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Link } from "wouter";
import { Signature } from "@/components/ui/Signature";
import { SEO } from "@/components/SEO";

const skills = [
  { category: "Hardware & PCB", items: ["KiCad", "Altium Designer", "High-Speed Routing", "Impedance Control", "SMD Assembly"] },
  { category: "Embedded Firmware", items: ["C/C++", "FreeRTOS", "STM32", "ESP32", "Nordic", "CAN/SPI/I2C"] },
  { category: "Robotics & Systems", items: ["Python", "ROS2", "OpenCV", "Sensor Fusion", "CMake"] },
  { category: "Tools", items: ["Linux", "Bash", "Docker", "Git", "JIRA"] }
];

export function About() {
  return (
    <div className="min-h-screen w-full pt-20 sm:pt-28 pb-16 sm:pb-24">
      <SEO
        title="About — Fares Salah"
        description="Hardware engineer with expertise in multi-layer PCB design, embedded firmware, and robotics systems. Based in San Francisco, available for hardware consulting."
        keywords="hardware engineer biography, PCB designer, embedded systems expert, robotics engineer, Fares Salah"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Avatar — capped height on mobile */}
            <div className="w-full max-h-[260px] sm:max-h-[340px] lg:max-h-none aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-border bg-card relative group transition-[box-shadow] duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <img
                src={`${import.meta.env.BASE_URL}images/avatar.png`}
                alt="Fares Salah Profile"
                loading="lazy"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-[filter,opacity] duration-500"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl sm:rounded-3xl" />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Bio block */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground mb-1">eng. Fares Salah</h1>
              <p className="text-primary font-medium text-sm sm:text-base mb-3">Hardware Engineer & PCB Designer</p>
              <Signature size="sm" opacity={0.55} color="#22D3EE" rotate={-4} className="mb-4 hidden sm:block" />

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Specializing in the full hardware stack — from schematic capture and multi-layer PCB layout to bare-metal firmware and real-time control systems.
              </p>

              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="flex-1 py-3 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Contact Me
                </Link>
                <button
                  className="p-3 bg-card border border-border rounded-xl text-foreground hover:border-primary/50 hover:bg-white/5 transition-colors"
                  title="Download Resume"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 space-y-10 lg:space-y-16"
          >

            <section>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Philosophy</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-5">My Vision</h2>
              <div className="text-base sm:text-lg text-muted-foreground leading-relaxed space-y-4 sm:space-y-6 font-light">
                <p>
                  The next paradigm shift isn't just in software — it's in how software interacts with the physical world. I build the nervous systems for these new machines.
                </p>
                <p>
                  My engineering philosophy is rooted in <strong className="font-semibold text-foreground">first-principles design</strong> and <strong className="font-semibold text-foreground">vertical integration</strong>. By understanding a system from the bare metal substrate up through the silicon, the RTOS, and into the firmware layer, I create architectures that are highly optimized, power-efficient, and incredibly robust.
                </p>
                <p>
                  Whether it's designing a 6-layer high-density PCB, writing lock-free ring buffers for DMA-driven sensors, or fine-tuning motor control PID loops — I thrive on hard technical constraints.
                </p>
              </div>
            </section>

            <div className="section-divider" />

            <section>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Skills</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6 sm:mb-8">Technical Arsenal</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {skills.map((skillGroup, idx) => (
                  <div key={idx} className="p-4 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider mb-3 sm:mb-4">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map(item => (
                        <span key={item} className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg bg-background border border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors cursor-default">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
