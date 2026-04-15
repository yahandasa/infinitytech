import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const AUTH_KEY   = "it-leads-auth";
const PIN_KEY    = "it-admin-pin";
const DEFAULT_PIN = "admin2024";
const API_BASE   = import.meta.env.VITE_API_URL || "";
const POLL_MS    = 30_000;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Request notification permission ──────────────────────────────────────────
async function askNotifPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

function fireNotif(msg: Message) {
  if (Notification.permission !== "granted") return;
  new Notification("New message — Infinity Tech", {
    body: `${msg.name}: ${msg.message.slice(0, 80)}…`,
    icon: "/favicon.svg",
    tag: `lead-${msg.id}`,
  });
}

// ── PIN Gate ──────────────────────────────────────────────────────────────────
function PinGate({ onAuth }: { onAuth: (pin: string) => void }) {
  const [pin, setPin]       = useState("");
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState("");
  const [shake, setShake]   = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const valid = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
    if (pin === valid) {
      sessionStorage.setItem(AUTH_KEY, pin);
      onAuth(pin);
    } else {
      setError("Incorrect PIN");
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0b1120", fontFamily: "'Inter', sans-serif",
    }}>
      {/* Glow blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "rgba(34,211,238,0.04)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 280, height: 280, borderRadius: "50%", background: "rgba(34,211,238,0.025)", filter: "blur(60px)" }} />
      </div>

      <div
        style={{
          transform: shake ? "translateX(0)" : undefined,
          animation: shake ? "shake 0.4s ease" : undefined,
          width: "100%", maxWidth: 360, padding: "0 16px",
        }}
      >
        <div style={{
          background: "rgba(12,20,35,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(34,211,238,0.12)",
          borderRadius: 20,
          padding: "36px 32px",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{
                position: "absolute", inset: -4, borderRadius: 16,
                background: "rgba(34,211,238,0.15)", filter: "blur(16px)",
              }} />
              <div style={{
                position: "relative", width: 56, height: 56, borderRadius: 14,
                background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
                  <defs>
                    <linearGradient id="pg" x1="7" y1="0" x2="41" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#22D3EE" stopOpacity="0.5"/>
                      <stop offset="0.5" stopColor="#22D3EE" stopOpacity="1"/>
                      <stop offset="1" stopColor="#22D3EE" stopOpacity="0.5"/>
                    </linearGradient>
                  </defs>
                  <path d="M 7 24 C 7 20 9.5 17 13.5 17 C 17.5 17 20.5 20.5 24 24 C 27.5 27.5 30.5 31 34.5 31 C 38.5 31 41 28 41 24 C 41 20 38.5 17 34.5 17 C 30.5 17 27.5 20.5 24 24 C 20.5 27.5 17.5 31 13.5 31 C 9.5 31 7 28 7 24 Z" stroke="url(#pg)" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: "#e2e8f0", letterSpacing: "0.08em", fontFamily: "'Space Grotesk', sans-serif" }}>
              INFINITY<span style={{ color: "hsl(188 86% 53%)" }}>.</span>TECH
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
              Leads Dashboard
            </p>
          </div>

          {/* Auth notice */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 22,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(188 86% 53%)" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Restricted — Authorized personnel only
            </p>
          </div>

          <form onSubmit={submit}>
            <input type="text" name="username" value="admin" autoComplete="username" readOnly style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} tabIndex={-1} />
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
                Admin PIN
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"}
                  value={pin}
                  onChange={e => { setPin(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  maxLength={20}
                  autoComplete="current-password"
                  autoFocus
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "11px 40px 11px 14px",
                    color: "#e2e8f0", fontSize: 14, fontFamily: "monospace",
                    letterSpacing: "0.15em", outline: "none",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {show
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 11, color: "#f87171", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "hsl(188 86% 53%)", color: "#0b1120",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "box-shadow 0.2s ease",
                willChange: "transform",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(34,211,238,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              Access Dashboard
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 20 }}>
            Default PIN: <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>admin2024</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

// ── Message Card ──────────────────────────────────────────────────────────────
function MessageCard({ msg, isNew }: { msg: Message; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "rgba(12,20,35,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${isNew ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: isNew ? "0 0 0 1px rgba(34,211,238,0.15), 0 0 24px rgba(34,211,238,0.07)" : "none",
        transition: "border-color 0.3s ease",
        willChange: "transform",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: "hsl(188 86% 53%)",
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {msg.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {msg.name}
              {isNew && (
                <span style={{
                  marginLeft: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "hsl(188 86% 53%)",
                  background: "rgba(34,211,238,0.12)", borderRadius: 4, padding: "2px 6px",
                }}>New</span>
              )}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {msg.email}
            </p>
          </div>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>
          {timeSince(msg.created_at)}
        </span>
      </div>

      {/* Subject */}
      <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(188 86% 53% / 0.8)", marginBottom: 8, marginTop: 0 }}>
        {msg.subject}
      </p>

      {/* Message body */}
      <p style={{
        fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0,
        display: "-webkit-box", WebkitLineClamp: expanded ? undefined : 3,
        WebkitBoxOrient: "vertical", overflow: expanded ? "visible" : "hidden",
      }}>
        {msg.message}
      </p>

      {/* Expand / footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          {fmtDate(msg.created_at)}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {msg.message.length > 120 && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                fontSize: 11, color: "hsl(188 86% 53%)", background: "none", border: "none",
                cursor: "pointer", padding: 0, fontWeight: 600,
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
            style={{
              fontSize: 11, color: "rgba(255,255,255,0.4)",
              textDecoration: "none", fontWeight: 600,
              padding: "3px 10px", borderRadius: 6,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "inline-flex", alignItems: "center", gap: 4,
              transition: "background 0.18s ease, color 0.18s ease",
              willChange: "transform",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(34,211,238,0.1)";
              el.style.color = "hsl(188 86% 53%)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.05)";
              el.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Reply
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ pin, onLogout }: { pin: string; onLogout: () => void }) {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [newIds, setNewIds]       = useState<Set<number>>(new Set());
  const [lastCount, setLastCount] = useState(0);
  const seenIds                   = useRef<Set<number>>(new Set());

  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/messages?pin=${encodeURIComponent(pin)}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data: { messages: Message[] } = await res.json();
      const msgs = data.messages;

      // Detect brand-new entries (not in seenIds yet)
      const fresh: number[] = [];
      msgs.forEach(m => {
        if (!seenIds.current.has(m.id)) {
          fresh.push(m.id);
          seenIds.current.add(m.id);
        }
      });

      // First load — seed seen IDs without firing notifications
      if (lastCount === 0 && seenIds.current.size > 0) {
        setLastCount(msgs.length);
        setMessages(msgs);
        setLoading(false);
        return;
      }

      // Subsequent polls — fire notifications for genuinely new messages
      if (fresh.length > 0 && lastCount > 0) {
        setNewIds(prev => new Set([...prev, ...fresh]));
        const newest = msgs.find(m => m.id === fresh[0]);
        if (newest) fireNotif(newest);
      }

      setLastCount(msgs.length);
      setMessages(msgs);
      setError("");
    } catch {
      setError("Could not reach the server. Retrying…");
    } finally {
      setLoading(false);
    }
  }, [pin, lastCount]);

  // Initial fetch + request notification permission
  useEffect(() => {
    askNotifPermission();
    fetchMessages();
  }, []);

  // Polling
  useEffect(() => {
    const id = setInterval(() => fetchMessages(true), POLL_MS);
    return () => clearInterval(id);
  }, [fetchMessages]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b1120", fontFamily: "'Inter', sans-serif" }}>
      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70%", height: "50vh", background: "radial-gradient(ellipse at top, rgba(34,211,238,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,17,32,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 20px",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="hg" x1="7" y1="0" x2="41" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#22D3EE" stopOpacity="0.5"/>
                <stop offset="0.5" stopColor="#22D3EE" stopOpacity="1"/>
                <stop offset="1" stopColor="#22D3EE" stopOpacity="0.5"/>
              </linearGradient>
            </defs>
            <path d="M 7 24 C 7 20 9.5 17 13.5 17 C 17.5 17 20.5 20.5 24 24 C 27.5 27.5 30.5 31 34.5 31 C 38.5 31 41 28 41 24 C 41 20 38.5 17 34.5 17 C 30.5 17 27.5 20.5 24 24 C 20.5 27.5 17.5 31 13.5 31 C 9.5 31 7 28 7 24 Z" stroke="url(#hg)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#e2e8f0", letterSpacing: "0.06em", fontFamily: "'Space Grotesk', sans-serif" }}>
              INFINITY<span style={{ color: "hsl(188 86% 53%)" }}>.</span>TECH
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 8, fontWeight: 500 }}>
              Leads
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => fetchMessages(true)}
            title="Refresh"
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "6px 10px", cursor: "pointer",
              color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center",
              transition: "background 0.18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(34,211,238,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600,
              transition: "background 0.18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 48px" }}>

        {/* Stats row */}
        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Total",  value: messages.length },
              { label: "New",    value: newIds.size },
              { label: "Today",  value: messages.filter(m => new Date(m.created_at).toDateString() === new Date().toDateString()).length },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(12,20,35,0.7)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "14px 18px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "hsl(188 86% 53%)", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* States */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "2px solid rgba(34,211,238,0.2)", borderTopColor: "hsl(188 86% 53%)",
              animation: "spin 0.7s linear infinite", margin: "0 auto 14px",
            }} />
            Loading messages…
          </div>
        )}

        {error && !loading && (
          <div style={{
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 12, padding: "16px 20px",
            color: "#f87171", fontSize: 13, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 14px", display: "block", opacity: 0.3 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            No messages yet. Share your contact page!
          </div>
        )}

        {/* Message list */}
        {!loading && messages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map(m => (
              <MessageCard key={m.id} msg={m} isNew={newIds.has(m.id)} />
            ))}
          </div>
        )}

        {/* Polling indicator */}
        {!loading && !error && messages.length > 0 && (
          <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.15)", marginTop: 28 }}>
            Auto-refreshes every 30 seconds
          </p>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────
export default function AdminInfinity() {
  const [pin, setPin] = useState<string | null>(() => {
    const cached = sessionStorage.getItem(AUTH_KEY);
    if (!cached) return null;
    const valid = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
    return cached === valid ? cached : null;
  });

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setPin(null);
  }

  if (!pin) {
    return <PinGate onAuth={p => setPin(p)} />;
  }

  return <Dashboard pin={pin} onLogout={handleLogout} />;
}
