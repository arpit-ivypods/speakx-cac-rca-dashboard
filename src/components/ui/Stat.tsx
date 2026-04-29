import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { CountUp } from "./CountUp";
import { TrendingDown, TrendingUp } from "lucide-react";

const accentMap: Record<string, { tag: string; bar: string; pill: string }> = {
  rose:  { tag: "text-rose-deep",  bar: "from-rose-tint to-rose-soft",  pill: "bg-rose-tint text-rose-deep" },
  mint:  { tag: "text-mint-deep",  bar: "from-mint-tint to-mint-soft",  pill: "bg-mint-tint text-mint-deep" },
  sky:   { tag: "text-sky2-deep",  bar: "from-sky2-tint to-sky2-soft",  pill: "bg-sky2-tint text-sky2-deep" },
  lav:   { tag: "text-lav-deep",   bar: "from-lav-tint to-lav-soft",    pill: "bg-lav-tint text-lav-deep" },
  peach: { tag: "text-peach-deep", bar: "from-peach-tint to-peach-soft", pill: "bg-peach-tint text-peach-deep" },
  sand:  { tag: "text-sand-deep",  bar: "from-sand-tint to-sand-soft",  pill: "bg-sand-tint text-sand-deep" },
};

export function StatCard({
  label,
  unit,
  from,
  to,
  multiplier,
  decimals = 2,
  prefix = "₹",
  color = "lav",
  badge,
}: {
  label: string;
  unit?: string;
  from: number;
  to: number;
  multiplier: number;
  decimals?: number;
  prefix?: string;
  color?: keyof typeof accentMap;
  badge?: string;
}) {
  const a = accentMap[color];
  const worse = to > from;
  return (
    <Card className="overflow-hidden relative group">
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", a.bar)} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-ink-soft tracking-wide uppercase">{label}</div>
            {unit && <div className="text-[10px] text-ink-ghost mt-0.5">{unit}</div>}
          </div>
          {badge && (
            <span className={cn("chip", a.pill)}>
              {badge}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="display text-4xl md:text-5xl text-ink leading-none tracking-tight">
            <CountUp to={to} prefix={prefix} decimals={decimals} duration={1.4} />
          </span>
          <span className={cn("text-sm font-semibold", a.tag)}>
            {worse ? <TrendingUp className="inline w-4 h-4 -mt-0.5" /> : <TrendingDown className="inline w-4 h-4 -mt-0.5" />}
            {" "}
            {multiplier.toFixed(2)}×
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
          <span className="font-mono">{prefix}{from.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
          <span className="text-ink-ghost">→</span>
          <span className="font-mono font-medium text-ink">{prefix}{to.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
          <span className="ml-auto text-ink-ghost">Q2 25 → Q2 26</span>
        </div>

        <div className="mt-3 h-1.5 bg-bg-subtle rounded-full overflow-hidden">
          <div
            className={cn("h-full bg-gradient-to-r rounded-full", a.bar)}
            style={{ width: `${Math.min(100, (1 / multiplier) * 100)}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-ink-ghost">
          <span>Healthy 1×</span>
          <span>Now {multiplier.toFixed(2)}×</span>
        </div>
      </div>
    </Card>
  );
}

export function MetricRow({
  label,
  q1,
  q2,
  delta,
  tone = "neutral",
}: {
  label: string;
  q1: string;
  q2: string;
  delta: string;
  tone?: "good" | "bad" | "neutral";
}) {
  const t =
    tone === "bad"
      ? "bg-rose-tint text-rose-deep"
      : tone === "good"
      ? "bg-mint-tint text-mint-deep"
      : "bg-bg-subtle text-ink-soft";
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-bg-subtle/60 transition-colors">
      <div className="col-span-5 text-sm font-medium text-ink">{label}</div>
      <div className="col-span-3 text-sm font-mono text-ink-soft">{q1}</div>
      <div className="col-span-2 text-sm font-mono text-ink">{q2}</div>
      <div className="col-span-2 text-right">
        <span className={cn("chip text-xs font-semibold border-transparent", t)}>{delta}</span>
      </div>
    </div>
  );
}
