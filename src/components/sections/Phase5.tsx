import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, ArrowDown } from "lucide-react";

import { Section } from "@/components/ui/Section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
} from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import {
  confounderBattery,
  asoSeries,
  waterfallMeta,
  waterfallGoogle,
  readmeRevisions,
} from "@/data/cac";

const COLORS = {
  rose: "#F4A6A6",
  roseDeep: "#D88080",
  mint: "#9FD8B6",
  mintDeep: "#5FB286",
  sky: "#9DC5E8",
  skyDeep: "#5C95C4",
  lav: "#C5B4E3",
  lavDeep: "#8E76C4",
  peach: "#F8C896",
  peachDeep: "#D69653",
  sand: "#E8DCC4",
  sandDeep: "#B59B6A",
  grid: "#EAE3D2",
  ink: "#1F2937",
  inkSoft: "#475569",
};

type ConfTone = "ok" | "warn" | "primary";
type RevTone = "good" | "warn" | "bad";

const confToneToDot: Record<ConfTone, "mint" | "peach" | "lav"> = {
  ok: "mint",
  warn: "peach",
  primary: "lav",
};

const revToneToBadge: Record<RevTone, "mint" | "peach" | "rose"> = {
  good: "mint",
  warn: "peach",
  bad: "rose",
};

function ASOTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: (typeof asoSeries)[number] }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div
      className="rounded-xl border bg-white text-xs shadow-soft px-3 py-2"
      style={{ borderColor: COLORS.grid }}
    >
      <div className="font-semibold text-ink mb-1">{label}</div>
      <div className="space-y-0.5 font-mono tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: COLORS.roseDeep }}>Daily CR</span>
          <span className="text-ink">{p.cr.toFixed(2)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: COLORS.roseDeep }}>14-day mean</span>
          <span className="text-ink">{p.rolling.toFixed(2)}%</span>
        </div>
        {p.event && (
          <div className="mt-1 pt-1 border-t border-line/60 text-[11px] text-ink-soft font-sans not-italic">
            {p.event}
          </div>
        )}
      </div>
    </div>
  );
}

function WaterfallTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { lever: string; within: number; post: number; total: number };
  }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div
      className="rounded-xl border bg-white text-xs shadow-soft px-3 py-2"
      style={{ borderColor: COLORS.grid }}
    >
      <div className="font-semibold text-ink mb-1">{label ?? p.lever}</div>
      <div className="space-y-0.5 font-mono tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: COLORS.peachDeep }}>Within ₹4 era</span>
          <span className="text-ink">{p.within.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: COLORS.roseDeep }}>Post ₹4 era</span>
          <span className="text-ink">{p.post.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 mt-1 border-t border-line/60">
          <span className="text-ink-soft">Total</span>
          <span className="text-ink font-semibold">{p.total.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

function WaterfallChart({
  data,
  title,
}: {
  data: typeof waterfallMeta;
  title: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute font-semibold mb-2">
        {title}
      </div>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 16, right: 48, left: 16, bottom: 8 }}
            stackOffset="sign"
          >
            <CartesianGrid
              stroke={COLORS.grid}
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              unit="%"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: COLORS.inkSoft }}
            />
            <YAxis
              type="category"
              dataKey="lever"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: COLORS.ink }}
              width={140}
            />
            <Tooltip
              content={<WaterfallTooltip />}
              cursor={{ fill: COLORS.grid, fillOpacity: 0.25 }}
            />
            <ReferenceLine x={0} stroke={COLORS.grid} />
            <Bar
              dataKey="within"
              name="Within ₹4 era"
              stackId="a"
              fill={COLORS.peach}
              animationDuration={1200}
            />
            <Bar
              dataKey="post"
              name="Post ₹4 era"
              stackId="a"
              fill={COLORS.rose}
              animationDuration={1200}
              label={{
                position: "right",
                fontSize: 11,
                fill: COLORS.ink,
                formatter: (value: number, _name?: string, _props?: unknown) => {
                  // value here is "post"; total is unknown context. Use payload via formatter alt below.
                  return `${value.toFixed(1)}%`;
                },
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Total labels — manual list to avoid Recharts label overlap */}
      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
        {data.map((d) => (
          <div
            key={d.lever}
            className="rounded-md bg-bg-subtle/50 border border-line/60 px-2 py-1.5 text-center"
          >
            <div className="text-ink-mute uppercase tracking-wider text-[9px]">
              total
            </div>
            <div
              className={cn(
                "font-mono tabular-nums font-semibold",
                d.total < 0 ? "text-mint-deep" : "text-rose-deep",
              )}
            >
              {d.total > 0 ? "+" : ""}
              {d.total.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Phase5() {
  const dailyDots = asoSeries; // unique alias for clarity

  return (
    <Section
      id="phase5"
      eyebrow="Phase 05"
      number="P5"
      title="Confounders & synthesis"
      lede="Before locking the narrative, we ran a battery of alternative-explanation tests. The CAC rise is mathematically over-determined — many things shifted simultaneously. We had to make sure we hadn't over-attributed to any single mechanism."
    >
      <div className="space-y-12">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* A. Confounder battery table                                   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>
                Confounder battery — what else could it have been?
              </CardTitle>
              <CardSubtitle>
                Each alternative explanation tested against the data; only one
                survives as primary.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              {/* Header row */}
              <div className="grid grid-cols-[1.4fr_1.6fr_1.4fr_0.9fr] gap-3 px-3 pb-2 border-b border-line/60">
                <div className="uppercase tracking-wider text-[11px] text-ink-mute font-semibold">
                  Alternative
                </div>
                <div className="uppercase tracking-wider text-[11px] text-ink-mute font-semibold">
                  Test
                </div>
                <div className="uppercase tracking-wider text-[11px] text-ink-mute font-semibold">
                  Result
                </div>
                <div className="uppercase tracking-wider text-[11px] text-ink-mute font-semibold">
                  Material?
                </div>
              </div>

              <div className="divide-y divide-line/50">
                {confounderBattery.map((row) => {
                  const tone = row.tone as ConfTone;
                  const isPrimary = tone === "primary";
                  return (
                    <div
                      key={row.name}
                      className={cn(
                        "grid grid-cols-[1.4fr_1.6fr_1.4fr_0.9fr] gap-3 px-3 py-3 items-center",
                        isPrimary &&
                          "bg-lav-tint/60 ring-1 ring-lav-soft rounded-lg my-1",
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Dot tone={confToneToDot[tone]} className="shrink-0" />
                        <span className="font-medium text-ink text-sm leading-snug">
                          {row.name}
                        </span>
                      </div>
                      <div className="text-sm text-ink-soft leading-snug">
                        {row.test}
                      </div>
                      <div className="font-mono text-xs text-ink leading-snug">
                        {row.result}
                      </div>
                      <div>
                        {tone === "ok" && (
                          <Badge tone="mint" className="text-[10px]">
                            {row.material}
                          </Badge>
                        )}
                        {tone === "warn" && (
                          <Badge tone="peach" className="text-[10px]">
                            {row.material}
                          </Badge>
                        )}
                        {tone === "primary" && (
                          <Badge
                            tone="lav"
                            className="text-[10px] font-bold inline-flex items-center gap-1"
                          >
                            <motion.span
                              animate={{ scale: [1, 1.2, 1], opacity: [0.85, 1, 0.85] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="inline-flex"
                            >
                              <Sparkles className="w-3 h-3" />
                            </motion.span>
                            PRIMARY DRIVER
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* B. ASO change-point chart                                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle>
                Play Console India store CR — daily, with 14-day rolling mean
              </CardTitle>
              <CardSubtitle>
                CUSUM change-point detection identifies 14 Oct 2025 as the
                inflection. Mean shifted from 30.16% → 18.52% in 30 days —
                exactly when Nikita's 27-keyword listing went live (24 Oct).
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={dailyDots}
                    margin={{ top: 28, right: 24, left: 4, bottom: 8 }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      interval={6}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: COLORS.inkSoft }}
                    />
                    <YAxis
                      unit="%"
                      domain={[10, 40]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: COLORS.inkSoft }}
                    />
                    <Tooltip
                      content={<ASOTooltip />}
                      cursor={{ stroke: COLORS.grid, strokeWidth: 1 }}
                    />

                    <ReferenceArea
                      x1={dailyDots[39].date}
                      x2={dailyDots[dailyDots.length - 1].date}
                      fill="#FCE6E6"
                      fillOpacity={0.25}
                    />

                    {/* Release halts — single combined dashed line at day 28 */}
                    <ReferenceLine
                      x={dailyDots[28].date}
                      stroke={COLORS.skyDeep}
                      strokeDasharray="3 3"
                      label={{
                        value: "Release halts (precautionary)",
                        position: "top",
                        fontSize: 10,
                        fill: COLORS.skyDeep,
                      }}
                    />
                    <ReferenceLine
                      x={dailyDots[29].date}
                      stroke={COLORS.skyDeep}
                      strokeDasharray="3 3"
                    />

                    {/* Nikita's listing live */}
                    <ReferenceLine
                      x={dailyDots[39].date}
                      stroke={COLORS.roseDeep}
                      strokeWidth={2}
                      label={{
                        value: "27-keyword listing live (24 Oct)",
                        position: "top",
                        fontSize: 11,
                        fontWeight: 600,
                        fill: COLORS.roseDeep,
                      }}
                    />

                    {/* Daily CR — small dots */}
                    <Line
                      type="monotone"
                      dataKey="cr"
                      stroke="transparent"
                      dot={{
                        r: 2,
                        fill: COLORS.rose,
                        fillOpacity: 0.5,
                        stroke: "none",
                      }}
                      activeDot={{
                        r: 4,
                        fill: COLORS.roseDeep,
                        stroke: "white",
                        strokeWidth: 1,
                      }}
                      isAnimationActive={false}
                      name="Daily CR"
                    />

                    {/* 14-day rolling mean — thick line */}
                    <Line
                      type="monotone"
                      dataKey="rolling"
                      stroke={COLORS.roseDeep}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                      animationDuration={1200}
                      name="14-day rolling mean"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Fact tiles below */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-mint-soft/60 bg-mint-tint/40 p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft flex items-center gap-2">
                    <Dot tone="mint" />
                    Mean before 24 Oct (30 days)
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-ink mt-2 tabular-nums">
                    30.16%
                  </div>
                </div>
                <div className="rounded-xl border border-rose-soft/60 bg-rose-tint/40 p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft flex items-center gap-2">
                    <ArrowDown className="w-3 h-3 text-rose-deep" />
                    Mean after 24 Oct (30 days)
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-rose-deep mt-2 tabular-nums">
                    18.52%
                  </div>
                </div>
                <div className="rounded-xl border border-rose-soft/60 bg-rose-tint/40 p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 text-rose-deep" />
                    Drop in 30 days
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-rose-deep mt-2 tabular-nums">
                    −11.64 pp
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* C. The integrated waterfall                                   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>
                Within-₹4-era + Post-₹4-era contributions to ΔCPI
              </CardTitle>
              <CardSubtitle>
                Each lever's contribution split into the locked-in
                (constant-price) phase and the post-₹4 phase. Sums to platform
                totals.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WaterfallChart data={waterfallMeta} title="Meta" />
                <WaterfallChart data={waterfallGoogle} title="Google" />
              </div>
              <p className="mt-5 text-sm text-ink-soft leading-relaxed">
                Roughly half of the CAC inflation was locked in before any
                pricing change — and it was the SAME mechanism (Click→Install
                collapse) operating in both phases.
              </p>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* D. README narrative revisions                                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle>
                Original framings vs what the data actually shows
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2.5">
                {readmeRevisions.map((row, i) => {
                  const tone = row.tone as RevTone;
                  return (
                    <Reveal key={row.claim} delay={i * 0.05}>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1.4fr] gap-3 md:gap-4 items-start py-2.5 border-b border-line/40 last:border-0">
                        <div className="text-sm text-ink leading-relaxed">
                          {row.claim}
                        </div>
                        <div className="text-ink-ghost text-base self-center hidden md:block">
                          →
                        </div>
                        <div className="text-sm leading-relaxed flex flex-wrap items-baseline gap-2">
                          <Badge
                            tone={revToneToBadge[tone]}
                            className="text-[10px] font-semibold uppercase tracking-wider shrink-0"
                          >
                            {tone === "good"
                              ? "Confirmed"
                              : tone === "warn"
                                ? "Partial"
                                : "Falsified"}
                          </Badge>
                          <span className="text-ink-soft">{row.verdict}</span>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* E. Two open questions resolved                                */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Callout
              variant="info"
              title="Why does organic stay broken when ₹19 returns?"
            >
              Organic install volume grew 2,737/day → 6,693/day (2.4×) at the
              same price. Channel attracted more, lower-intent users from the
              broad keyword listing wave. Returning to a lower price won't on
              its own fix this; the listing portfolio has to be repaired
              first.
            </Callout>
            <Callout
              variant="info"
              title="What is UAC_Conv_event_10Nov25 actually optimizing for?"
            >
              Not a misconfiguration. The campaign deliberately bids against{" "}
              <span className="font-mono text-xs">conversion_event</span> — a
              quality-gated signal that fires only when a user has paid for
              trial, started an exercise, and still has an active subscription
              at exercise start. ₹680 per activated trialer over 170 days,
              in line with the rest of the Google portfolio at a higher
              quality bar. The 0 payment_success is an artefact of per-action
              attribution (Google credits payment_success to whichever
              campaign owns that subscription).
            </Callout>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
