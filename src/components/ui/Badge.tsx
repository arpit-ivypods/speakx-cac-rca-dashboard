import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "rose"
  | "mint"
  | "sky"
  | "lav"
  | "peach"
  | "sand"
  | "ink"
  | "neutral";

const toneMap: Record<Tone, string> = {
  rose:    "bg-rose-tint text-rose-deep border-rose-soft/60",
  mint:    "bg-mint-tint text-mint-deep border-mint-soft/60",
  sky:     "bg-sky2-tint text-sky2-deep border-sky2-soft/60",
  lav:     "bg-lav-tint text-lav-deep border-lav-soft/60",
  peach:   "bg-peach-tint text-peach-deep border-peach-soft/60",
  sand:    "bg-sand-tint text-sand-deep border-sand-soft/60",
  ink:     "bg-ink/5 text-ink border-ink/15",
  neutral: "bg-bg-subtle text-ink-soft border-line",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...p
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span className={cn("chip", toneMap[tone], className)} {...p}>
      {children}
    </span>
  );
}

export function Dot({ tone = "neutral", className }: { tone?: Tone; className?: string }) {
  const m: Record<Tone, string> = {
    rose: "bg-rose-deep",
    mint: "bg-mint-deep",
    sky: "bg-sky2-deep",
    lav: "bg-lav-deep",
    peach: "bg-peach-deep",
    sand: "bg-sand-deep",
    ink: "bg-ink",
    neutral: "bg-ink-ghost",
  };
  return <span className={cn("inline-block w-1.5 h-1.5 rounded-full", m[tone], className)} />;
}
