"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";

// ── Pool of FOMO messages ──────────────────────────────────────────────────
//  Edit / add to this list — a random one is picked each time the popup
//  is triggered, so users don't see the same line on repeat visits.
const FOMO_MESSAGES: Array<{
  badge: string;
  headline: string;
  sub: string;
  cta: string;
  code?: string;
}> = [
  {
    badge: "🔥 One-Time Offer",
    headline: "Wait — don't leave just yet.",
    sub: "Take 10% off your first ARA order. This code only works in the next few minutes.",
    cta: "Claim 10% Off",
    code: "COLDTHERAPY",
  },
  {
    badge: "🎁 Exclusive Drop",
    headline: "Before you go…",
    sub: "Get ₹100 off any order above ₹499. We won't show this to you again.",
    cta: "Apply ₹100 Off",
    code: "ARAFRESH",
  },
  {
    badge: "⏰ Limited Stock",
    headline: "Only a few ice bowls left.",
    sub: "First-time visitor? Take 15% off (max ₹200) before stock runs out.",
    cta: "Grab 15% Off",
    code: "WELCOME15",
  },
  {
    badge: "✨ Hold On",
    headline: "Skip the second-guessing.",
    sub: "Flat ₹50 off if you order in the next 10 minutes — no minimum.",
    cta: "Use ₹50 Off",
    code: "ICEBOWL50",
  },
  {
    badge: "💫 Insider Deal",
    headline: "One last thing before you leave.",
    sub: "Buying a combo? Take 20% off (max ₹300) on any combo over ₹599.",
    cta: "Save On Combo",
    code: "COMBO20",
  },
  {
    badge: "🧊 Don't Miss Out",
    headline: "Your skin won't argue twice.",
    sub: "Come back today and we'll knock 10% off your order with code COLDTHERAPY.",
    cta: "Shop Now — 10% Off",
    code: "COLDTHERAPY",
  },
];

const SESSION_KEY = "ara-fomo-shown";

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<typeof FOMO_MESSAGES[number] | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Once per browser session
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      triggeredRef.current = true;
      return;
    }

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
      const pick = FOMO_MESSAGES[Math.floor(Math.random() * FOMO_MESSAGES.length)];
      setMessage(pick);
      setOpen(true);
    };

    // Desktop: cursor leaving the top of the viewport (heading for the URL bar / tab close)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    // Mobile fallback: fire after the user scrolls back up sharply
    let lastY = window.scrollY;
    let upDistance = 0;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < lastY) {
        upDistance += lastY - y;
        if (upDistance > 250 && y < 200) trigger();
      } else {
        upDistance = 0;
      }
      lastY = y;
    };

    // Mobile fallback: trigger on browser back navigation away from the page
    const handlePopState = () => trigger();

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!open || !message) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-in fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl border border-[rgba(124,58,237,0.15)] shadow-[0_30px_80px_rgba(15,10,30,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a78bfa]" />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-[#9ca3af] hover:text-[#0f0a1e] hover:bg-[#f5f3ff] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="px-6 py-7 md:px-8 md:py-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#f5f3ff] border border-[rgba(124,58,237,0.2)] text-[#7c3aed] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-5">
            <Zap size={11} />
            {message.badge}
          </div>

          <h3 className="font-serif text-2xl md:text-3xl font-light text-[#0f0a1e] leading-tight mb-3">
            {message.headline}
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed mb-5">
            {message.sub}
          </p>

          {message.code && (
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#9ca3af]">
                Use code
              </span>
              <span className="font-mono text-sm font-semibold text-[#7c3aed] bg-[#f5f3ff] border border-dashed border-[#7c3aed] px-3 py-1 rounded-md tracking-widest">
                {message.code}
              </span>
            </div>
          )}

          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="btn-primary w-full inline-block text-center"
          >
            {message.cta}
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="block mx-auto mt-4 text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors"
          >
            No thanks, I&apos;ll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
