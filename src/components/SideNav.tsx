import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const NAV_SECTIONS = [
  { id: "hero",      label: "Overview",          tone: "lav"   as const },
  { id: "snapshot",  label: "Q2 25 vs Q2 26",    tone: "ink"   as const },
  { id: "phase1",    label: "1 · Data integrity", tone: "sky"   as const },
  { id: "phase2",    label: "2 · Funnel",         tone: "lav"   as const },
  { id: "phase3",    label: "3 · Campaigns",      tone: "rose"  as const },
  { id: "phase4",    label: "4 · Pricing",        tone: "peach" as const },
  { id: "phase5",    label: "5 · Confounders",    tone: "sand"  as const },
  { id: "recovery",  label: "Recovery plan",     tone: "mint"  as const },
  { id: "outcome",   label: "Expected outcome",   tone: "mint"  as const },
];

const dotBg: Record<string, string> = {
  lav:   "bg-lav-deep",
  ink:   "bg-ink",
  sky:   "bg-sky2-deep",
  rose:  "bg-rose-deep",
  peach: "bg-peach-deep",
  sand:  "bg-sand-deep",
  mint:  "bg-mint-deep",
};

export function SideNav() {
  const [active, setActive] = useState<string>("hero");
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
      setProgress(Math.max(0, Math.min(1, scrolled)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio > 0.18) {
              setActive(s.id);
            }
          });
        },
        { threshold: [0.18, 0.5, 0.8], rootMargin: "-20% 0px -50% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-lav-soft via-sky2-soft to-mint-soft"
          style={{ scaleX: progress }}
          transition={{ duration: 0 }}
        />
      </div>

      {/* Compact right-side dot rail (hidden on small screens) */}
      <nav
        aria-label="Section navigation"
        className="hidden lg:flex flex-col fixed right-3 top-1/2 -translate-y-1/2 z-40 select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.ul
          className={cn(
            "flex flex-col gap-1 p-2 rounded-2xl border transition-all duration-300",
            hovered
              ? "bg-bg-surface/95 backdrop-blur-md border-line shadow-soft"
              : "bg-transparent border-transparent",
          )}
        >
          {NAV_SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cn(
                    "group relative flex items-center justify-end gap-2.5 py-1.5 px-1.5 rounded-full transition-colors",
                    isActive ? "bg-bg-subtle/80" : "hover:bg-bg-subtle/60",
                  )}
                >
                  <motion.span
                    initial={false}
                    animate={{
                      width: hovered ? "auto" : 0,
                      opacity: hovered ? 1 : 0,
                      marginRight: hovered ? 4 : 0,
                    }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "overflow-hidden whitespace-nowrap text-xs font-medium",
                      isActive ? "text-ink" : "text-ink-mute group-hover:text-ink",
                    )}
                  >
                    {s.label}
                  </motion.span>
                  <span
                    className={cn(
                      "shrink-0 h-2 rounded-full transition-all duration-300",
                      dotBg[s.tone],
                      isActive
                        ? "w-6 opacity-100"
                        : "w-2 opacity-50 group-hover:opacity-90",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </motion.ul>
      </nav>
    </>
  );
}
