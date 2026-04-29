import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";
import { RotateCw, CalendarX } from "lucide-react";

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
  legacyMetaCampaigns,
  geUacHighIntent,
  cliffSeries,
  cliffPhases,
  heatmapRows,
  heatmapMonths,
  phase3Falsification,
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
};

type StatChangeTone = "good" | "bad" | "neutral";

function classifyGeChange(metric: string, change: string): StatChangeTone {
  // Spend rising is neutral context, CPM falling is mint-good for advertiser cost (here marked good-mint),
  // CPI/CPT rising is bad, Click-to-Install falling is bad.
  if (metric.startsWith("Spend")) return "neutral";
  if (metric.startsWith("CPM")) return "good"; // CPM fell — green/mint
  if (metric.startsWith("Click")) return "bad"; // C→I fell — red
  if (metric.startsWith("CPI") || metric.startsWith("CPT")) return "bad";
  return "neutral";
}

const changeBadgeTone: Record<StatChangeTone, "mint" | "rose" | "sand"> = {
  good: "mint",
  bad: "rose",
  neutral: "sand",
};

function heatmapCellStyles(v: number | null) {
  if (v === null) {
    return {
      cls: "bg-bg-subtle/40 text-ink-ghost",
      label: "—",
    };
  }
  let cls = "";
  if (v < 15) cls = "bg-rose-soft text-ink";
  else if (v < 25) cls = "bg-peach-soft text-ink";
  else if (v < 40) cls = "bg-sand-soft text-ink";
  else cls = "bg-mint-soft text-ink";
  return {
    cls,
    label: `${Math.round(v)}`,
  };
}

const eraToTone: Record<
  "stable" | "cliff" | "post",
  { wrap: string; badge: "mint" | "rose" | "sand"; ring: string }
> = {
  stable: {
    wrap: "bg-mint-tint/60 border-mint-soft/50",
    badge: "mint",
    ring: "border-mint-soft/60",
  },
  cliff: {
    wrap: "bg-rose-tint/60 border-rose-soft/50",
    badge: "rose",
    ring: "border-rose-soft/60",
  },
  post: {
    wrap: "bg-sand-tint/60 border-sand-soft/50",
    badge: "sand",
    ring: "border-sand-soft/60",
  },
};

// cliffPhases entries map by index/order to era classification
const cliffPhaseTone: Array<keyof typeof eraToTone> = [
  "stable",
  "cliff",
  "cliff",
  "post",
];

function CliffTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const get = (key: string) => payload.find((p) => p.dataKey === key)?.value;
  const cpm = get("cpm");
  const cpi = get("cpi");
  const cpt = get("cpt");
  const ci = get("click2install");
  return (
    <div
      className="rounded-xl border bg-white text-xs shadow-soft px-3 py-2"
      style={{ borderColor: COLORS.grid }}
    >
      <div className="font-semibold text-ink mb-1">{label}</div>
      <div className="space-y-0.5 font-mono tabular-nums">
        {typeof cpm === "number" && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-soft">CPM</span>
            <span className="text-ink">₹{cpm.toFixed(2)}</span>
          </div>
        )}
        {typeof cpi === "number" && (
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: COLORS.roseDeep }}>CPI</span>
            <span className="text-ink">₹{cpi.toFixed(2)}</span>
          </div>
        )}
        {typeof cpt === "number" && (
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: COLORS.lavDeep }}>CPT</span>
            <span className="text-ink">₹{cpt.toFixed(0)}</span>
          </div>
        )}
        {typeof ci === "number" && (
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: COLORS.skyDeep }}>Click→Install</span>
            <span className="text-ink">{ci.toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Phase3() {
  return (
    <Section
      id="phase3"
      eyebrow="Phase 03"
      number="P3"
      title="Campaign-level attribution — same campaigns, or new ones?"
      lede="A blended account-level number can hide a great deal. A 10× rise on three campaigns plus 1.2× on the rest looks identical to 2.5× across the board. Phase 3 narrows down to specific campaigns to find out whether the same campaign is getting worse, or whether new campaigns at structurally higher CAC have replaced old ones."
    >
      <div className="space-y-12">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* A. Portfolio rotation (Meta)                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal>
          <div className="space-y-4">
            <Callout variant="info" title="Portfolio rotation">
              Of all 88 Meta campaigns active in the window,{" "}
              <span className="font-semibold text-ink">zero</span> were active
              in both Q2 2025 and Q2 2026.
            </Callout>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT — Q2 2025 legacy */}
              <Card className="border-sand-soft/60 bg-sand-tint/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>Q2 2025: 4 legacy workhorses</CardTitle>
                  </div>
                  <CardSubtitle>
                    Total ₹1.22 Cr at ₹10–11 CPI
                  </CardSubtitle>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2.5">
                    {legacyMetaCampaigns.map((c) => (
                      <div
                        key={c.name}
                        className="flex items-center gap-3 text-xs"
                      >
                        <Dot tone="lav" className="shrink-0" />
                        <span
                          className="font-mono text-[11px] text-ink truncate flex-1 min-w-0"
                          title={c.name}
                        >
                          {c.name}
                        </span>
                        <span className="shrink-0 font-mono tabular-nums text-ink-soft">
                          {c.spend}
                        </span>
                        <span className="shrink-0 text-[10px] text-ink-ghost w-[88px] text-right">
                          {c.end}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-sand-soft/50">
                    <Badge tone="sand" className="text-[11px]">
                      All wound down by Jan 2026
                    </Badge>
                  </div>
                </CardBody>
              </Card>

              {/* RIGHT — Q2 2026 new launches */}
              <Card className="border-rose-soft/60 bg-rose-tint/30">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Q2 2026: 20 new launches</CardTitle>
                      <CardSubtitle>
                        Tier1 / Tier2 / vernacular / influencer at ₹50–62 CPI
                      </CardSubtitle>
                    </div>
                    <RotateCw className="w-5 h-5 text-rose-deep shrink-0" />
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="rose" className="text-[11px] font-mono">
                      Tier1_Mar26
                    </Badge>
                    <Badge tone="rose" className="text-[11px] font-mono">
                      Tier2_Mar26
                    </Badge>
                    <Badge tone="rose" className="text-[11px] font-mono">
                      Vernacular_Hindi_Mar26
                    </Badge>
                    <Badge tone="rose" className="text-[11px] font-mono">
                      InfluencerCampaign
                    </Badge>
                    <Badge tone="neutral" className="text-[11px]">
                      +16 others
                    </Badge>
                  </div>
                  <div className="mt-6 pt-4 border-t border-rose-soft/40 flex items-baseline gap-3">
                    <span
                      className="font-display text-4xl md:text-5xl font-semibold tracking-tight"
                      style={{ color: COLORS.roseDeep }}
                    >
                      5×
                    </span>
                    <span className="text-xs text-ink-soft leading-snug">
                      higher CPI than the campaigns they replaced
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* B. GE_UAC_High_Intent — like-for-like Google                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle>
                GE_UAC_High_Intent — same campaign, same audience, same bid
                strategy
              </CardTitle>
              <CardSubtitle>
                32% of total Google spend. Active every single day of the
                366-day window.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              {/* 5-column micro-stat strip */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {geUacHighIntent.map((row) => {
                  const tone = classifyGeChange(row.metric, row.change);
                  return (
                    <div
                      key={row.metric}
                      className="rounded-xl border border-line/60 bg-bg-subtle/40 p-3"
                    >
                      <div className="text-[10px] uppercase tracking-[0.14em] text-ink-mute font-semibold">
                        {row.metric}
                      </div>
                      <div className="font-display text-xl md:text-2xl text-ink mt-1 tabular-nums leading-tight">
                        {row.q2_2026}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge
                          tone={changeBadgeTone[tone]}
                          className="text-[10px] font-semibold px-2"
                        >
                          {row.change}
                        </Badge>
                        <span className="text-[10px] text-ink-ghost">
                          vs {row.q2_2025}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ComposedChart */}
              <div style={{ width: "100%", height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={cliffSeries}
                    margin={{ top: 24, right: 24, left: 12, bottom: 8 }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#475569" }}
                    />
                    <YAxis
                      yAxisId="rupees"
                      orientation="left"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#475569" }}
                      label={{
                        value: "CPM ₹",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 11,
                        fill: "#475569",
                        offset: 0,
                      }}
                    />
                    <YAxis
                      yAxisId="pct"
                      orientation="right"
                      domain={[0, 50]}
                      unit="%"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#475569" }}
                    />
                    <Tooltip
                      content={<CliffTooltip />}
                      cursor={{ stroke: COLORS.grid, strokeWidth: 1 }}
                    />
                    <Legend
                      iconType="circle"
                      verticalAlign="top"
                      align="right"
                      height={32}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <ReferenceArea
                      yAxisId="rupees"
                      x1="Oct 25"
                      x2="Dec 25"
                      fill={COLORS.peach}
                      fillOpacity={0.18}
                      label={{
                        value: "ASO listing blitz — late Oct to mid Dec",
                        position: "insideTop",
                        fontSize: 11,
                        fill: COLORS.peachDeep,
                      }}
                    />
                    <Bar
                      yAxisId="rupees"
                      dataKey="cpm"
                      name="CPM"
                      fill={COLORS.sand}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1200}
                    />
                    <Line
                      yAxisId="rupees"
                      type="monotone"
                      dataKey="cpi"
                      name="CPI"
                      stroke={COLORS.roseDeep}
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        stroke: COLORS.roseDeep,
                        fill: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                      animationDuration={1200}
                    />
                    <Line
                      yAxisId="rupees"
                      type="monotone"
                      dataKey="cpt"
                      name="CPT"
                      stroke={COLORS.lavDeep}
                      strokeWidth={2.5}
                      strokeDasharray="5 3"
                      dot={{
                        r: 3,
                        stroke: COLORS.lavDeep,
                        fill: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 5 }}
                      animationDuration={1200}
                    />
                    <Line
                      yAxisId="pct"
                      type="monotone"
                      dataKey="click2install"
                      name="Click→Install"
                      stroke={COLORS.skyDeep}
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        stroke: COLORS.skyDeep,
                        fill: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 7 }}
                      animationDuration={1200}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Cliff phase mini-cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {cliffPhases.map((p, i) => {
                  const era = cliffPhaseTone[i] ?? "post";
                  const tone = eraToTone[era];
                  return (
                    <div
                      key={p.period}
                      className={cn(
                        "rounded-xl border p-4",
                        tone.wrap,
                      )}
                    >
                      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft">
                        {p.period}
                      </div>
                      <div className="mt-2">
                        <Badge
                          tone={tone.badge}
                          className="text-[11px] font-mono tabular-nums"
                        >
                          {p.range}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-ink leading-snug">
                        {p.note}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Callout variant="bad" title="The destination-side mechanism">
                  Same campaign, same audience targeting, same bid strategy.
                  CPM actually fell 50%. CPI rose 5.13×. The mechanism cannot
                  be "the auction got more expensive" and cannot be "we scaled
                  into a worse audience". The only mechanism left is
                  destination-side: the Play Store listing the campaign was
                  routing to lost the ability to convert clicks into installs.
                </Callout>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* C. Top-10 heatmap                                             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>
                Top-10 spend campaigns × month — Click-to-Install
              </CardTitle>
              <CardSubtitle>
                Green is healthy; red is broken. Both platforms shift to red
                around Oct–Nov 2025.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <div className="min-w-[860px]">
                  {/* Header row */}
                  <div className="grid grid-cols-[220px_repeat(13,minmax(0,1fr))] gap-1 text-[11px] mb-1">
                    <div className="text-ink-mute font-semibold uppercase tracking-[0.12em] text-[10px] flex items-end">
                      Campaign
                    </div>
                    {heatmapMonths.map((m) => (
                      <div
                        key={m}
                        className="text-center text-ink-mute font-mono tabular-nums text-[10px] flex items-end justify-center"
                      >
                        {m}
                      </div>
                    ))}
                  </div>

                  {/* Body rows */}
                  <div className="space-y-1">
                    {heatmapRows.map((row) => (
                      <div
                        key={row.campaign}
                        className="grid grid-cols-[220px_repeat(13,minmax(0,1fr))] gap-1 text-[11px]"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <Badge
                            tone={row.platform === "Meta" ? "lav" : "sky"}
                            className="text-[9px] font-mono px-1.5 py-0 shrink-0"
                          >
                            {row.platform === "Meta" ? "M" : "G"}
                          </Badge>
                          <span
                            className="truncate text-ink text-[11px]"
                            title={row.campaign}
                          >
                            {row.campaign}
                          </span>
                        </div>
                        {row.values.map((v, i) => {
                          const { cls, label } = heatmapCellStyles(v);
                          const tooltip =
                            v === null
                              ? `${row.campaign} · ${heatmapMonths[i]} · inactive`
                              : `${row.campaign} · ${heatmapMonths[i]} · ${v.toFixed(1)}%`;
                          return (
                            <div
                              key={i}
                              title={tooltip}
                              className={cn(
                                "h-8 rounded-md flex items-center justify-center font-mono tabular-nums text-[11px] transition-all duration-150 cursor-default relative",
                                "hover:scale-[1.08] hover:shadow-soft hover:z-10",
                                cls,
                              )}
                            >
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend strip */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-ink-soft">
                <span className="font-semibold uppercase tracking-[0.14em] text-[10px] text-ink-mute">
                  Scale
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-soft" />
                  <span>&lt;15%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-peach-soft" />
                  <span>15–25%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-sand-soft" />
                  <span>25–40%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-mint-soft" />
                  <span>&gt;40%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-bg-subtle/60 border border-line" />
                  <span>inactive</span>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                <li className="flex gap-2">
                  <Dot tone="rose" className="mt-1.5 shrink-0" />
                  <span>
                    Legacy campaigns decay within their lifetimes (India_45583:
                    49% → 28% over 9 months).
                  </span>
                </li>
                <li className="flex gap-2">
                  <Dot tone="rose" className="mt-1.5 shrink-0" />
                  <span>
                    Each new generation starts at a lower Click-to-Install than
                    the prior generation finished at — Tier1/Tier2 launches in
                    Mar 26 begin at 20–22% (legacy started at 49–55%).
                  </span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* D. Falsification verdict                                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.15}>
          <Callout variant="primary" title="Falsification verdict">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                  Rule:
                </span>
                <span className="italic text-ink-soft">
                  {phase3Falsification.rule}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                  Result:
                </span>
                <span className="font-semibold text-ink">
                  {phase3Falsification.result}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                  Verdict:
                </span>
                <span className="text-ink">
                  {phase3Falsification.verdict}
                </span>
              </div>
            </div>
          </Callout>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* E. Surprising secondary finding                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.2}>
          <Card className="border-peach-soft/60 bg-peach-tint/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-peach-soft/70 text-peach-deep flex items-center justify-center shrink-0">
                  <CalendarX className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>A costly pause: GE_UAC_Statics</CardTitle>
                  <CardSubtitle>
                    Surprising secondary finding
                  </CardSubtitle>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink leading-relaxed">
                Google's most efficient campaign in the dataset,
                {" "}
                <span className="font-mono text-[12px] text-ink">
                  GE_UAC_Statics
                </span>
                , was paused on 29 September 2025 — exactly when the cliff
                started. At pause, its Click-to-Install was still healthy at
                42% and CPT was ₹170. The pause appears to have been triggered
                by rising CPM (which had crept from ₹84 in May to ₹188 in
                August), not by performance. Killing the most efficient
                creative archetype right before the funnel broke was, in
                retrospect, a costly decision — though the team could not have
                known what was coming.
              </p>
            </CardBody>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
