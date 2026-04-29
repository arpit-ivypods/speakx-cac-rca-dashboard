import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceArea,
} from "recharts";

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
  metaFunnel,
  googleFunnel,
  logAdditive,
  clickInstallCohort,
  phase2Falsifications,
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

// Parse a "+130%" / "-63%" / "5.16×" change string into an absolute percentage magnitude
function parseChangeMagnitude(change: string): number {
  const cleaned = change.replace(/[+,]/g, "").replace("−", "-").trim();
  if (cleaned.endsWith("×")) {
    const mult = parseFloat(cleaned.slice(0, -1));
    if (Number.isNaN(mult)) return 0;
    // convert multiplier to a relative %, e.g. 5.16× -> 416%
    return Math.abs((mult - 1) * 100);
  }
  if (cleaned.endsWith("%")) {
    const v = parseFloat(cleaned.slice(0, -1));
    return Number.isNaN(v) ? 0 : Math.abs(v);
  }
  const v = parseFloat(cleaned);
  return Number.isNaN(v) ? 0 : Math.abs(v);
}

function isCpiOrCpt(lever: string) {
  return /^(CPI|CPT)/i.test(lever.trim());
}

function formatFunnelValue(lever: string, v: number) {
  // CPM and CPI/CPT are rupee values; CTR / Click→Install / Install→Trial are percentages
  if (lever.startsWith("CPM")) return `₹${v.toFixed(2)}`;
  if (isCpiOrCpt(lever)) return `₹${v.toFixed(2)}`;
  return `${v.toFixed(2)}%`;
}

type Tone = "good" | "bad";

const toneToBadge: Record<Tone, "mint" | "rose"> = {
  good: "mint",
  bad: "rose",
};

const toneToBarFill: Record<Tone, string> = {
  good: COLORS.mintDeep,
  bad: COLORS.roseDeep,
};

function FunnelRow({
  lever,
  q2_2025,
  q2_2026,
  change,
  tone,
}: {
  lever: string;
  q2_2025: number;
  q2_2026: number;
  change: string;
  tone: string;
}) {
  const t = (tone === "good" ? "good" : "bad") as Tone;
  const isFinal = isCpiOrCpt(lever);
  const magnitude = Math.min(parseChangeMagnitude(change), 100);

  return (
    <div
      className={cn(
        "py-3 first:pt-0 last:pb-0",
        isFinal &&
          "bg-bg-subtle rounded-xl px-4 py-4 mt-2 first:mt-0 border border-line/60",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex-1 min-w-0 text-sm font-medium text-ink",
            isFinal && "text-base font-semibold",
          )}
        >
          {lever}
        </div>
        <div
          className={cn(
            "shrink-0 flex items-center gap-2 font-mono",
            isFinal ? "text-sm" : "text-xs",
            "text-ink-soft",
          )}
        >
          <span className="tabular-nums">
            {formatFunnelValue(lever, q2_2025)}
          </span>
          <span className="text-ink-ghost">→</span>
          <span className="tabular-nums text-ink">
            {formatFunnelValue(lever, q2_2026)}
          </span>
        </div>
        <div className="shrink-0">
          {isFinal ? (
            <Badge
              tone={toneToBadge[t]}
              className={cn("px-3", "text-[11px] font-semibold")}
            >
              {change}
            </Badge>
          ) : (
            <Badge tone={toneToBadge[t]} className="text-[11px]">
              {change}
            </Badge>
          )}
        </div>
      </div>
      {/* mini bar showing magnitude of change */}
      <div className="mt-2 h-1 w-full rounded-full bg-bg-subtle overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${magnitude}%`,
            background: toneToBarFill[t],
            opacity: isFinal ? 1 : 0.85,
          }}
        />
      </div>
    </div>
  );
}

// Reshape logAdditive (one row per lever) into one row per metric for the chart
function buildContributionChartData() {
  return [
    { metric: "Meta CPI", ...mapByLever("metaCpi") },
    { metric: "Meta CPP", ...mapByLever("metaCpp") },
    { metric: "Google CPI", ...mapByLever("googleCpi") },
    { metric: "Google CPT", ...mapByLever("googleCpt") },
  ];

  function mapByLever(key: "metaCpi" | "metaCpp" | "googleCpi" | "googleCpt") {
    const out: Record<string, number> = {};
    for (const row of logAdditive) {
      out[row.lever] = row[key];
    }
    return out;
  }
}

const verdictPillTone: Record<string, "mint" | "rose"> = {
  confirmed: "mint",
  falsified: "rose",
};

export function Phase2() {
  const contributionData = buildContributionChartData();

  return (
    <Section
      id="phase2"
      eyebrow="Phase 02"
      number="P2"
      title="Funnel decomposition — which lever moved?"
      lede="CPI = (CPM ÷ 1000) × (1 ÷ CTR) × (1 ÷ Click-to-Install). CPP and CPT add a final × (1 ÷ Install-to-Trial). Each lever is tracked separately, and contributions are computed via log-additive decomposition that sums to exactly 100%."
    >
      <div className="space-y-10">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* A. Funnel-identity formula card                                 */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>The CAC identity</CardTitle>
              <CardSubtitle>
                log-additive decomposition that sums to 100%
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div className="py-6 md:py-8 px-2 md:px-6 text-center space-y-5">
                <div className="display text-2xl md:text-3xl text-ink leading-relaxed tracking-tight">
                  <span className="text-ink-soft">CPI</span>
                  <span className="mx-3 text-ink-ghost">=</span>
                  <span>(</span>
                  <span
                    className="text-peach-deep"
                    style={{
                      borderBottom: `1px dotted ${COLORS.peachDeep}`,
                    }}
                  >
                    CPM
                  </span>
                  <span className="text-ink-ghost"> ÷ 1000</span>
                  <span>)</span>
                  <span className="mx-2 text-ink-ghost">×</span>
                  <span>(1 ÷ </span>
                  <span
                    className="text-sky2-deep"
                    style={{ borderBottom: `1px dotted ${COLORS.skyDeep}` }}
                  >
                    CTR
                  </span>
                  <span>)</span>
                  <span className="mx-2 text-ink-ghost">×</span>
                  <span>(1 ÷ </span>
                  <span
                    className="text-rose-deep"
                    style={{ borderBottom: `1px dotted ${COLORS.roseDeep}` }}
                  >
                    Click→Install
                  </span>
                  <span>)</span>
                </div>
                <div className="display text-lg md:text-xl text-ink-soft leading-relaxed">
                  <span>CPP / CPT</span>
                  <span className="mx-3 text-ink-ghost">=</span>
                  <span>CPI</span>
                  <span className="mx-2 text-ink-ghost">×</span>
                  <span>(1 ÷ </span>
                  <span
                    className="text-lav-deep"
                    style={{ borderBottom: `1px dotted ${COLORS.lavDeep}` }}
                  >
                    Install→Trial
                  </span>
                  <span> or Purchase)</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* B. Two side-by-side funnel cards                                */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Meta — Q2 2025 → Q2 2026</CardTitle>
                <CardSubtitle>
                  Lever-by-lever movement on the install funnel
                </CardSubtitle>
              </CardHeader>
              <CardBody>
                <div className="divide-y divide-line/50">
                  {metaFunnel.map((row) => (
                    <FunnelRow key={row.lever} {...row} />
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google — Q2 2025 → Q2 2026</CardTitle>
                <CardSubtitle>
                  Lever-by-lever movement on the install + trial funnel
                </CardSubtitle>
              </CardHeader>
              <CardBody>
                <div className="divide-y divide-line/50">
                  {googleFunnel.map((row) => (
                    <FunnelRow key={row.lever} {...row} />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Reveal>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* C. Log-additive contribution chart                              */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Where each lever shows up</CardTitle>
              <CardSubtitle>
                Contributions sum to 100% per platform-metric. Falsifies the
                audience-dilution narrative on Google.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contributionData}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                    barCategoryGap="22%"
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[-30, 100]}
                      tickFormatter={(v: number) => `${v}%`}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#475569" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="metric"
                      tickLine={false}
                      axisLine={false}
                      width={110}
                      tick={{ fontSize: 11, fill: "#475569" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(215, 204, 177, 0.18)" }}
                      formatter={(value: any, name: any) => {
                        const num =
                          typeof value === "number"
                            ? value
                            : parseFloat(String(value));
                        return [
                          Number.isNaN(num) ? value : `${num.toFixed(1)}%`,
                          name,
                        ];
                      }}
                      wrapperStyle={{ outline: "none" }}
                      contentStyle={{
                        background: "#FFFFFF",
                        border: `1px solid ${COLORS.grid}`,
                        borderRadius: 12,
                        fontSize: 12,
                        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      verticalAlign="top"
                      align="right"
                      height={36}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="Click → Install"
                      name="Click → Install"
                      fill={COLORS.rose}
                      radius={[4, 4, 4, 4]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="CPM"
                      name="CPM"
                      fill={COLORS.peach}
                      radius={[4, 4, 4, 4]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="CTR"
                      name="CTR"
                      fill={COLORS.sky}
                      radius={[4, 4, 4, 4]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="Install → Trial"
                      name="Install → Trial"
                      fill={COLORS.lav}
                      radius={[4, 4, 4, 4]}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Callout variant="primary" title="Dominant lever">
                  Click-to-Install collapsed by ~63% on Meta and ~64% on Google.
                  It is the largest single contributor on every CAC metric on
                  every platform — accounting for 61.0%, 70.1%, 74.3%, and
                  62.4% of ΔCPI/CPP/CPI/CPT respectively.
                </Callout>
                <Callout
                  variant="good"
                  title="Meta install→purchase improved"
                >
                  Meta install-to-purchase rate rose 24% (7.86% → 9.74%).
                  Surviving installs are higher-intent: the bid algorithm is
                  doing its job — but it cannot save the CPI side.
                </Callout>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* D. Click-to-Install vs Play Console store CR                    */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle>
                Three independent measurements lose ~the same fraction
              </CardTitle>
              <CardSubtitle>
                Quarterly Click-to-Install (Meta and Google) plotted against
                Play Console India ads_referrals visitor-to-install rate. All
                three move together — biggest drop is Q3→Q4 2025.
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={clickInstallCohort}
                    margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="quarter"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#475569" }}
                    />
                    <YAxis
                      domain={[0, 60]}
                      unit="%"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#475569" }}
                    />
                    <Tooltip
                      cursor={{ stroke: COLORS.grid, strokeWidth: 1 }}
                      formatter={(value: any, name: any) => {
                        const num =
                          typeof value === "number"
                            ? value
                            : parseFloat(String(value));
                        return [
                          Number.isNaN(num) ? value : `${num.toFixed(1)}%`,
                          name,
                        ];
                      }}
                      wrapperStyle={{ outline: "none" }}
                      contentStyle={{
                        background: "#FFFFFF",
                        border: `1px solid ${COLORS.grid}`,
                        borderRadius: 12,
                        fontSize: 12,
                        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      verticalAlign="top"
                      align="right"
                      height={32}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <ReferenceArea
                      x1="Q3 2025"
                      x2="Q4 2025"
                      fill="#FCEBD7"
                      fillOpacity={0.5}
                      label={{
                        value: "Late-Oct ASO listing blitz",
                        fontSize: 10,
                        fill: COLORS.peachDeep,
                        position: "insideTop",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="meta"
                      name="Meta C→I"
                      stroke={COLORS.lavDeep}
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        stroke: COLORS.lavDeep,
                        fill: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                      animationDuration={1200}
                    />
                    <Line
                      type="monotone"
                      dataKey="google"
                      name="Google C→I"
                      stroke={COLORS.skyDeep}
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        stroke: COLORS.skyDeep,
                        fill: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                      animationDuration={1200}
                    />
                    <Line
                      type="monotone"
                      dataKey="pc"
                      name="Play Console store CR"
                      stroke={COLORS.peachDeep}
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        stroke: COLORS.peachDeep,
                        fill: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                      animationDuration={1200}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* E. Falsification verdicts                                       */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase2Falsifications.map((f) => {
              const variant: "good" | "bad" =
                f.verdict === "confirmed" ? "good" : "bad";
              const pillTone = verdictPillTone[f.verdict] ?? "rose";
              return (
                <Callout key={f.name} variant={variant} title={f.name}>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                        Rule:
                      </span>
                      <span className="italic text-ink-soft">{f.rule}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft mr-2">
                        Actual:
                      </span>
                      <span className="font-semibold text-ink">{f.actual}</span>
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-soft">
                        Verdict:
                      </span>
                      <Badge
                        tone={pillTone}
                        className="px-3 capitalize font-semibold"
                      >
                        {f.verdict}
                      </Badge>
                    </div>
                    <div className="text-xs text-ink-mute leading-relaxed pt-1">
                      {f.note}
                    </div>
                  </div>
                </Callout>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
