import { Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { Link } from "wouter";
import { Signature } from "@/components/ui/Signature";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const projectLinks = [
  { label: "Neural PCB Controller", href: "/projects/neural-pcb" },
  { label: "ROS2 Autonomous Rover", href: "/projects/ros2-rover" },
  { label: "STM32 Flight Controller", href: "/projects/stm32-flight" },
  { label: "Edge AI Vision System", href: "/projects/edge-ai-vision" },
];

const socials = [
  { icon: Github,   href: "https://github.com/infinitytech-dev",       label: "GitHub"   },
  { icon: Linkedin, href: "https://linkedin.com/in/fares-salah-eng",    label: "LinkedIn" },
  { icon: Mail,     href: "mailto:fares@infinitytech.dev",              label: "Email"    },
  { icon: Twitter,  href: "#",                                          label: "Twitter"  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0A0E13] mt-auto overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(34,211,238,0.25)] to-transparent" />

      {/* Background signature watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="text-[clamp(4rem,14vw,10rem)] font-black uppercase tracking-tighter whitespace-nowrap"
          style={{
            color: "rgba(34,211,238,0.03)",
            WebkitTextStroke: "1.5px rgba(34,211,238,0.12)",
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          INFINITY TECH
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="lg:col-span-1 space-y-5">
            <div>
              <span className="text-xl font-black tracking-tight text-foreground">
                Infinity <span className="font-light text-muted-foreground">Tech</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Engineering real-world systems at the intersection of hardware, firmware, and edge intelligence.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">Explore</p>
            <ul className="space-y-3">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">Featured Work</p>
            <ul className="space-y-3">
              {projectLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">Get In Touch</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">fares@infinitytech.dev</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block border border-primary/40 text-primary hover:bg-primary/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Infinity Tech. All rights reserved.
          </p>
          <Signature size="sm" opacity={0.35} color="#22D3EE" rotate={-3} animate={false} />

          {/* Hidden admin access — discreet lock icon */}
          <Link
            href="/admin"
            aria-label="System access"
            className="absolute bottom-5 right-4 sm:right-6 lg:right-8 opacity-[0.12] hover:opacity-[0.35] transition-opacity duration-500 cursor-pointer"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
