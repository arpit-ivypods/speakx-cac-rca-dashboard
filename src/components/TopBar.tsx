import { motion } from "framer-motion";
import { Calendar, FileText, Globe2, GitCommitVertical } from "lucide-react";
import { reportMeta } from "@/data/cac";
import type { View } from "@/App";
import { cn } from "@/lib/utils";

export function TopBar({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 backdrop-blur-md bg-bg-base/75 border-b border-line/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <button
          onClick={() => onChange("report")}
          className="flex items-center gap-2.5 group focus-ring rounded-lg"
        >
          <span className="relative w-7 h-7 rounded-lg pastel-lav flex items-center justify-center shadow-soft">
            <span className="display text-ink font-bold leading-none">S</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-mint-deep animate-pulse-soft" />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="display text-base font-semibold text-ink tracking-tight">SpeakX</span>
            <span className="text-xs text-ink-mute hidden sm:inline">CAC RCA</span>
          </div>
        </button>

        {/* Tab switcher */}
        <div className="relative flex items-center bg-bg-subtle/80 border border-line rounded-full p-1 shadow-soft">
          <TabButton active={view === "report"}   onClick={() => onChange("report")}   icon={FileText}          label="Report" />
          <TabButton active={view === "timeline"} onClick={() => onChange("timeline")} icon={GitCommitVertical} label="Timeline" />
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-ink-soft">
          <span className="chip border-line bg-bg-surface">
            <Globe2 className="w-3 h-3" /> {reportMeta.geography}
          </span>
          <span className="chip border-line bg-bg-surface">
            <Calendar className="w-3 h-3" /> {reportMeta.windowStart} → {reportMeta.windowEnd}
          </span>
        </div>
      </div>
    </motion.header>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors focus-ring z-10",
        active ? "text-ink" : "text-ink-mute hover:text-ink",
      )}
    >
      {active && (
        <motion.span
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-bg-surface shadow-soft border border-line/70 -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}
