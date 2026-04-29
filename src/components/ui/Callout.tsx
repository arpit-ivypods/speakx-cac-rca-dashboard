import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, Sparkles } from "lucide-react";

type Variant = "info" | "good" | "warn" | "bad" | "primary";

const map: Record<Variant, { wrap: string; icon: React.ComponentType<{ className?: string }>; iconWrap: string; label: string }> = {
  info:    { wrap: "bg-sky2-tint/60 border-sky2-soft/60",   icon: Info,         iconWrap: "bg-sky2-soft text-sky2-deep",   label: "Note" },
  good:    { wrap: "bg-mint-tint/60 border-mint-soft/60",   icon: CheckCircle2, iconWrap: "bg-mint-soft text-mint-deep",   label: "Confirmed" },
  warn:    { wrap: "bg-peach-tint/60 border-peach-soft/60", icon: AlertTriangle, iconWrap: "bg-peach-soft text-peach-deep", label: "Caveat" },
  bad:     { wrap: "bg-rose-tint/60 border-rose-soft/60",   icon: AlertOctagon, iconWrap: "bg-rose-soft text-rose-deep",   label: "Falsified" },
  primary: { wrap: "bg-lav-tint/60 border-lav-soft/60",     icon: Sparkles,     iconWrap: "bg-lav-soft text-lav-deep",     label: "Primary" },
};

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { wrap, icon: Icon, iconWrap, label } = map[variant];
  return (
    <div className={cn("rounded-2xl border p-4 md:p-5 flex gap-4", wrap, className)}>
      <div className={cn("shrink-0 w-9 h-9 rounded-full flex items-center justify-center", iconWrap)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold opacity-80">
          {title ?? label}
        </div>
        <div className="text-sm text-ink mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
