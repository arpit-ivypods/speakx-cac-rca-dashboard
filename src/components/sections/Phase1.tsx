import { AlertOctagon } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ReferenceLine,
} from "recharts";

import { Section } from "@/components/ui/Section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
} from "@/components/ui/Card";
import { Dot } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { googleReconcile, sourceContract, flaggedNotToUse } from "@/data/cac";

const COLORS = {
  sky: "#9DC5E8",
  skyDeep: "#5C95C4",
  lav: "#C5B4E3",
  lavDeep: "#8E76C4",
  rose: "#F4A6A6",
  roseDeep: "#D88080",
  grid: "#EAE3D2",
};

export function Phase1() {
  return (
    <Section
      id="phase1"
      eyebrow="Phase 01"
      number="P1"
      title="Data integrity & reconciliation"
      lede="Before any CAC calculation, we have to agree on denominators. If our sources disagree by more than a few percent on 'how many installs happened on a given day', every downstream number is suspect. This phase pins down a contract for which file is the source of truth for which metric."
    >
      <div className="space-y-12">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* A. Google reconcile chart */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Google first_open vs backend installs</CardTitle>
              <CardSubtitle>
                Reconciliation breaks at Feb 2026 (+20%)
              </CardSubtitle>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={googleReconcile}
                    margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
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
                      fontSize={11}
                    />
                    <YAxis
                      yAxisId="counts"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      yAxisId="gap"
                      orientation="right"
                      domain={[0, 30]}
                      unit="%"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <Tooltip
                      wrapperStyle={{ outline: "none" }}
                      contentStyle={{
                        background: "#FFFFFF",
                        border: `1px solid ${COLORS.grid}`,
                        borderRadius: 12,
                        fontSize: 12,
                        boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                      }}
                      labelStyle={{ fontWeight: 600, color: "#3F3A2F" }}
                    />
                    <Legend
                      iconType="circle"
                      verticalAlign="top"
                      align="right"
                      height={32}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <ReferenceLine
                      yAxisId="gap"
                      y={20}
                      stroke={COLORS.roseDeep}
                      strokeDasharray="4 4"
                      label={{
                        value: "Falsification threshold (20%)",
                        fontSize: 10,
                        fill: COLORS.roseDeep,
                        position: "right",
                      }}
                    />
                    <Bar
                      yAxisId="counts"
                      dataKey="first_open"
                      name="first_open"
                      fill={COLORS.sky}
                      radius={[6, 6, 0, 0]}
                      isAnimationActive
                      animationDuration={1100}
                    />
                    <Bar
                      yAxisId="counts"
                      dataKey="backend"
                      name="backend"
                      fill={COLORS.lav}
                      radius={[6, 6, 0, 0]}
                      isAnimationActive
                      animationDuration={1100}
                    />
                    <Line
                      yAxisId="gap"
                      type="monotone"
                      dataKey="gap"
                      name="gap (%)"
                      stroke={COLORS.roseDeep}
                      strokeWidth={2}
                      dot={{ r: 4, stroke: COLORS.roseDeep, fill: "#FFFFFF", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive
                      animationDuration={1100}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Callout variant="good" title="Through Jan 2026">
                  Google first_open agrees with backend within ~7%. Within
                  tolerance — first_open is canonical.
                </Callout>
                <Callout variant="bad" title="From Feb 2026">
                  Gap opens to +20–25% and stays there. Backend Google installs
                  become canonical from Feb 2026 onward.
                </Callout>
                <Callout variant="warn" title="Meta non-monotonic">
                  Meta over-counted backend by 23–35% in Apr–Jul 25,
                  under-counted 7–19% in Aug 25 – Jan 26, then over-counted
                  10–19% from Feb 26. Likely backend attribution-methodology
                  changes.
                </Callout>
              </div>
            </CardBody>
          </Card>
        </Reveal>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* B. Source-of-truth contract */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT: Canonical sources */}
            <Card>
              <CardHeader>
                <CardTitle>Canonical sources</CardTitle>
                <CardSubtitle>
                  One file per metric — these are the denominators we trust.
                </CardSubtitle>
              </CardHeader>
              <CardBody>
                <StaggerGroup className="divide-y divide-line/60">
                  {sourceContract.map((row, i) => (
                    <StaggerItem key={row.metric}>
                      <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="mt-2 shrink-0">
                          <Dot tone={i % 2 === 0 ? "sand" : "sky"} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-ink leading-snug">
                            {row.metric}
                          </div>
                          <div className="font-mono text-xs text-ink-mute mt-1 break-all">
                            {row.source}
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </CardBody>
            </Card>

            {/* RIGHT: Flagged not to use */}
            <Card className="bg-rose-tint/40 border-rose-soft/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-rose-soft text-rose-deep flex items-center justify-center">
                    <AlertOctagon className="w-4 h-4" />
                  </span>
                  <CardTitle className="text-rose-deep">
                    Flagged not to use
                  </CardTitle>
                </div>
                <CardSubtitle>
                  These look authoritative but mislead — exclude from CAC math.
                </CardSubtitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3">
                  {flaggedNotToUse.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-ink-soft leading-relaxed"
                    >
                      <span className="mt-2 shrink-0">
                        <Dot tone="rose" />
                      </span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </Reveal>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* C. Trial counts + Play Console scope */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Callout variant="good" title="Trials reconcile cleanly">
              Across both platforms, monthly trial-count differences between
              platform and backend are within ±15%. High confidence in all
              trial-rate work in Phases 2–5.
            </Callout>
            <Callout variant="info" title="Play Console is a different scope">
              Play Console under-reports backend by 25–77% by quarter — not an
              error. Play Console only sees Google Play Store traffic; backend
              sees all installer sources (Xiaomi, OPPO HeyTap, Xender,
              side-loads). Use Play Console for store-funnel work and backend
              for channel + trial truth.
            </Callout>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
