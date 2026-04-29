import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import {
  pureWindowCpi,
  pureRs4Window,
  trialRateRegime,
  phase4Falsification,
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

function classifyMult(mult: string): "lav" | "sky" | "rose" | "mint" {
  // Negative percentages (Click-to-Install drops) → rose
  if (mult.trim().startsWith("-") || mult.trim().startsWith("−")) return "rose";
  const numericMatch = mult.match(/([\d.]+)/);
  const n = numericMatch ? parseFloat(numericMatch[1]) : 0;
  if (mult.includes("×")) {
    return n >= 2 ? "lav" : "sky";
  }
  return "mint";
}

function PureWindowTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl border bg-white text-xs shadow-soft px-3 py-2"
      style={{ borderColor: COLORS.grid }}
    >
      <div className="font-semibold text-ink mb-1">{label}</div>
      <div className="space-y-0.5 font-mono tabular-nums">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span style={{ color: p.color }} className="capitalize">
              {p.dataKey === "meta" ? "Meta CPI" : "Google CPI"}
            </span>
            <span className="text-ink">₹{Number(p.value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegimeTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl border bg-white text-xs shadow-soft px-3 py-2"
      style={{ borderColor: COLORS.grid }}
    >
      <div className="font-semibold text-ink mb-1">{label}</div>
      <div className="space-y-0.5 font-mono tabular-nums">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span style={{ color: p.color }} className="capitalize">
              {p.name}
            </span>
            <span className="text-ink">{Number(p.value).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Phase4() {
  return (
    <Section
      id="phase4"
      eyebrow="Phase 04"
      number="P4"
      title="Pricing isolation — was it the price hike?"
      lede="Trial price changed seven times during the window: ₹4 baseline, brief tests at ₹2, ₹9, then ₹19, ₹29, and a ₹49 test. A natural hypothesis is that the trial price hike caused CAC to rise. Phase 4 tests this directly — and falsifies it."
    >
      <div className="space-y-12">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* A. The strictly-pure ₹4 baseline                              */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Inside the constant-₹4 window (28 Apr → 16 Oct 2025)
                </CardTitle>
                <CardSubtitle>
                  172 days. No tests of any other price. If pricing were the
                  dominant cause, CAC inside this window should have been
                  roughly flat. It was not.
                </CardSubtitle>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
                  {/* LEFT — Area chart */}
                  <div className="relative">
                    <div className="absolute right-2 top-1 z-10 text-[11px] text-ink-mute font-medium">
                      Price held flat ₹4 entire window
                    </div>
                    <div style={{ width: "100%", height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={pureWindowCpi}
                          margin={{ top: 28, right: 18, left: 4, bottom: 4 }}
                        >
                          <defs>
                            <linearGradient
                              id="phase4-meta"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={COLORS.lav}
                                stopOpacity={0.55}
                              />
                              <stop
                                offset="100%"
                                stopColor={COLORS.lav}
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="phase4-google"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={COLORS.sky}
                                stopOpacity={0.55}
                              />
                              <stop
                                offset="100%"
                                stopColor={COLORS.sky}
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            stroke={COLORS.grid}
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 10, fill: COLORS.inkSoft }}
                          />
                          <YAxis
                            unit="₹"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 10, fill: COLORS.inkSoft }}
                          />
                          <Tooltip
                            content={<PureWindowTooltip />}
                            cursor={{ stroke: COLORS.grid, strokeWidth: 1 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="meta"
                            name="Meta CPI"
                            stroke={COLORS.lavDeep}
                            strokeWidth={2.5}
                            fill="url(#phase4-meta)"
                            animationDuration={1200}
                          />
                          <Area
                            type="monotone"
                            dataKey="google"
                            name="Google CPI"
                            stroke={COLORS.skyDeep}
                            strokeWidth={2.5}
                            fill="url(#phase4-google)"
                            animationDuration={1200}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* RIGHT — 2x2 mini-stat tiles */}
                  <div className="grid grid-cols-2 gap-3 content-start">
                    {pureRs4Window.map((tile) => {
                      const tone = classifyMult(tile.mult);
                      return (
                        <div
                          key={tile.platform}
                          className="rounded-xl border border-line/60 bg-bg-subtle/40 p-3 flex flex-col"
                        >
                          <div className="text-[10px] uppercase tracking-[0.14em] text-ink-mute font-semibold leading-tight">
                            {tile.platform}
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 font-mono tabular-nums">
                            <span className="text-sm text-ink-soft">
                              {tile.first30}
                            </span>
                            <ArrowRight className="w-3 h-3 text-ink-ghost shrink-0" />
                            <span className="text-sm font-semibold text-ink">
                              {tile.last30}
                            </span>
                          </div>
                          <div className="mt-2">
                            <Badge
                              tone={tone}
                              className="text-[10px] font-semibold"
                            >
                              {tile.mult}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Callout
              variant="warn"
              title="Roughly half the year's CAC inflation was already locked in"
            >
              Meta CPI rose 2.10× and Google CPI rose 1.83× before any pricing
              test happened.
            </Callout>
          </div>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* B. Paid trial rate is robust; organic is highly elastic       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle>Trial rate by channel × pricing regime</CardTitle>
              <CardSubtitle>
                Paid trial rate moves &lt;2pp across all ₹2–₹29 changes. Only
                ₹49 broke the algorithm's elasticity buffer. Organic crashes
                with each step.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trialRateRegime}
                    margin={{ top: 24, right: 18, left: 4, bottom: 16 }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="regime"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: COLORS.inkSoft }}
                      angle={-10}
                      textAnchor="end"
                      height={48}
                    />
                    <YAxis
                      unit="%"
                      domain={[0, 16]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: COLORS.inkSoft }}
                    />
                    <Tooltip
                      content={<RegimeTooltip />}
                      cursor={{ fill: COLORS.grid, fillOpacity: 0.25 }}
                    />
                    <Legend
                      iconType="circle"
                      verticalAlign="top"
                      align="right"
                      height={32}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="meta"
                      name="Meta"
                      fill={COLORS.lav}
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="google"
                      name="Google"
                      fill={COLORS.sky}
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="organic"
                      name="Organic"
                      fill={COLORS.rose}
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="affiliate"
                      name="Affiliate"
                      fill={COLORS.peach}
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Callout
                  variant="info"
                  title="Bid algorithms absorb price elasticity"
                >
                  Meta and Google fully absorbed the price elasticity from ₹4
                  up to ₹29 by bidding for higher-intent users. Only the ₹49
                  test broke this buffer (Meta paid trial rate dropped 3pp
                  around it — the only meaningful paid hit all year).
                </Callout>
                <Callout variant="bad" title="Organic has no algorithm">
                  Organic trial rate cratered 5.71% → 1.33% — a 77% drop.
                  Organic users have no bid algorithm working for them.
                </Callout>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* C. Pricing events barely move Click-to-Install                */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <Card className={cn("border-mint-soft/60 bg-mint-tint/30")}>
            <CardHeader>
              <CardTitle>Difference-in-differences test (DiD)</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink leading-relaxed">
                Click-to-Install moved by 0–3 percentage points around any
                single pricing event — nowhere near the 30+ point full-year
                collapse. The Click-to-Install collapse and pricing changes
                are essentially decoupled.
              </p>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* D. The puzzling sub-finding                                   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.15}>
          <Card className={cn("border-sand-soft/60 bg-sand-tint/30")}>
            <CardHeader>
              <CardTitle>
                Why didn't organic recover when ₹19 returned?
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink leading-relaxed">
                Organic trial rate during the original ₹19 era (Dec 2025 –
                early Jan 2026) was 3.98%. During the '₹19 returns' regime
                (March–April 2026) it was 1.33% — at the same price. Organic
                install volume actually grew 2.4× across the same window — the
                channel was attracting more, lower-intent users from the
                keyword listing wave. Destination-side, not pricing.
              </p>
            </CardBody>
          </Card>
        </Reveal>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* E. Falsification verdict                                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <Reveal delay={0.2}>
          <Callout variant="bad" title="Falsification verdict">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                  Rule:
                </span>
                <span className="italic text-ink-soft">
                  {phase4Falsification.rule}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                  Result:
                </span>
                <span className="font-semibold text-ink">
                  {phase4Falsification.result}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                  Verdict:
                </span>
                <span className="text-ink">
                  {phase4Falsification.verdict}
                </span>
              </div>
            </div>
          </Callout>
        </Reveal>
      </div>
    </Section>
  );
}
