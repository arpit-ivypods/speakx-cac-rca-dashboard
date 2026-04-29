import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";

import { Section } from "@/components/ui/Section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
} from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { cn, clamp, formatINR } from "@/lib/utils";
import { outcome, whatIfBaseline } from "@/data/cac";

type Tone = "rose" | "mint" | "sky" | "lav" | "peach" | "sand";

const stripeMap: Record<Tone, string> = {
  rose: "from-rose-soft to-rose-tint",
  mint: "from-mint-soft to-mint-tint",
  sky: "from-sky2-soft to-sky2-tint",
  lav: "from-lav-soft to-lav-tint",
  peach: "from-peach-soft to-peach-tint",
  sand: "from-sand-soft to-sand-tint",
};

const dotBgMap: Record<Tone, string> = {
  rose: "bg-rose-deep",
  mint: "bg-mint-deep",
  sky: "bg-sky2-deep",
  lav: "bg-lav-deep",
  peach: "bg-peach-deep",
  sand: "bg-sand-deep",
};

const pillToneMap: Record<Tone, string> = {
  rose: "bg-rose-tint text-rose-deep border-rose-soft/60",
  mint: "bg-mint-tint text-mint-deep border-mint-soft/60",
  sky: "bg-sky2-tint text-sky2-deep border-sky2-soft/60",
  lav: "bg-lav-tint text-lav-deep border-lav-soft/60",
  peach: "bg-peach-tint text-peach-deep border-peach-soft/60",
  sand: "bg-sand-tint text-sand-deep border-sand-soft/60",
};

function ProjectionCard({
  data,
  tone,
  delay = 0,
}: {
  data: { current: number; target: number; theoretical: number; label: string };
  tone: Tone;
  delay?: number;
}) {
  const max = Math.max(data.current, data.target, data.theoretical);
  const pct = (v: number) => clamp((v / max) * 100, 4, 100);

  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <Card interactive className="overflow-hidden h-full flex flex-col">
          <div className={cn("h-1.5 w-full bg-gradient-to-r", stripeMap[tone])} />
          <CardHeader>
            <CardTitle className="font-display text-xl text-ink">
              {data.label}
            </CardTitle>
            <CardSubtitle>Projection across three horizons.</CardSubtitle>
          </CardHeader>
          <CardBody className="flex-1 flex flex-col gap-5">
            {/* Mini bar with three markers */}
            <div className="relative h-9 rounded-full bg-bg-subtle border border-line/60">
              {/* theoretical (smallest) — mint */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pct(data.theoretical)}%`, transform: "translate(-50%, -50%)" }}
                title="Theoretical max"
              >
                <span className={cn("block w-2.5 h-2.5 rounded-full ring-2 ring-bg-surface", dotBgMap.mint)} />
              </div>
              {/* realistic — peach */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pct(data.target)}%`, transform: "translate(-50%, -50%)" }}
                title="Realistic 12-week target"
              >
                <span className={cn("block w-3.5 h-3.5 rounded-full ring-2 ring-bg-surface", dotBgMap.peach)} />
              </div>
              {/* current — rose, larger */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pct(data.current)}%`, transform: "translate(-50%, -50%)" }}
                title="Current"
              >
                <span className={cn("block w-5 h-5 rounded-full ring-2 ring-bg-surface", dotBgMap.rose)} />
              </div>
            </div>

            {/* Stacked stats */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className={cn("inline-block w-2 h-2 rounded-full", dotBgMap.rose)} />
                  Current
                </span>
                <span className="font-display text-lg text-ink">
                  <CountUp to={data.current} prefix="₹" decimals={0} />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className={cn("inline-block w-2 h-2 rounded-full", dotBgMap.peach)} />
                  Realistic 12-week
                </span>
                <span className="font-display text-lg text-ink">
                  <CountUp to={data.target} prefix="₹" decimals={0} />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className={cn("inline-block w-2 h-2 rounded-full", dotBgMap.mint)} />
                  Theoretical max
                </span>
                <span className="font-display text-lg text-ink">
                  <CountUp to={data.theoretical} prefix="₹" decimals={0} />
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-mute italic leading-relaxed mt-auto">
              Realistic targets for the first 12 weeks assume listing repair lands in weeks 1–6.
            </p>
          </CardBody>
        </Card>
      </motion.div>
    </Reveal>
  );
}

function WhatIfProjection({
  label,
  baseline,
  recoveryPct,
  tone,
}: {
  label: string;
  baseline: { ci_now: number; ci_pre: number; cpi_now: number };
  recoveryPct: number;
  tone: Tone;
}) {
  const projectedCi =
    baseline.ci_now + (baseline.ci_pre - baseline.ci_now) * (recoveryPct / 100);
  const projectedCpi = baseline.cpi_now * (baseline.ci_now / projectedCi);
  const delta = projectedCpi - baseline.cpi_now;
  const cheaper = delta < 0;

  return (
    <div className={cn("rounded-2xl border p-5", pillToneMap[tone])}>
      <div className="text-[11px] uppercase tracking-[0.16em] font-semibold opacity-80">
        {label}
      </div>
      <div className="mt-2 font-display text-4xl text-ink leading-none">
        {formatINR(projectedCpi, { decimals: 0 })}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="text-ink-mute">vs current {formatINR(baseline.cpi_now, { decimals: 0 })}</span>
        <span
          className={cn(
            "font-medium",
            cheaper ? "text-mint-deep" : "text-rose-deep",
          )}
        >
          {cheaper ? "−" : "+"}
          {formatINR(Math.abs(delta), { decimals: 0 })}
        </span>
      </div>
      <div className="mt-3 text-[11px] text-ink-mute">
        Projected C→I: {projectedCi.toFixed(1)}%
      </div>
    </div>
  );
}

function WhatIfCalculator() {
  const [recovery, setRecovery] = React.useState<number[]>([30]);
  const v = recovery[0] ?? 30;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-ink">
          What-if: if Click-to-Install recovers
        </CardTitle>
        <CardSubtitle>
          Move the slider to project Meta and Google CPI given a Click-to-Install recovery percentage.
        </CardSubtitle>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Slider row */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm text-ink-soft">Click-to-Install recovery</span>
            <span className="font-display text-2xl text-ink">{v}%</span>
          </div>
          <Slider.Root
            value={recovery}
            onValueChange={setRecovery}
            min={0}
            max={100}
            step={1}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <Slider.Track className="bg-bg-subtle border border-line/60 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-gradient-to-r from-lav-soft to-sky2-soft rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-bg-surface border-2 border-lav-deep rounded-full shadow-soft hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-lav-soft focus:ring-offset-2 focus:ring-offset-bg-surface transition-shadow"
              aria-label="Recovery percentage"
            />
          </Slider.Root>
          <div className="flex justify-between mt-2 text-[11px] text-ink-mute">
            <span>0% (today)</span>
            <span>100% (pre-cliff)</span>
          </div>
        </div>

        {/* Projected CPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WhatIfProjection
            label="Meta CPI projected"
            baseline={whatIfBaseline.meta}
            recoveryPct={v}
            tone="lav"
          />
          <WhatIfProjection
            label="Google CPI projected"
            baseline={whatIfBaseline.google}
            recoveryPct={v}
            tone="sky"
          />
        </div>

        <p className="text-xs text-ink-mute italic leading-relaxed">
          All else held equal; assumes CPM, CTR, Install→Trial unchanged. Holds for like-for-like
          campaigns where audience targeting is unchanged.
        </p>
      </CardBody>
    </Card>
  );
}

export function Outcome() {
  return (
    <Section
      id="outcome"
      eyebrow="Expected outcome"
      number="O"
      title="What recovery actually looks like"
      lede="Restoring Click-to-Install on paid traffic from current ~18% (Meta) and ~8% (Google) toward pre-cliff levels of ~50% and ~22% would by itself recover roughly 60% of Meta CPI and 70% of Google CPI."
    >
      {/* A. Three projection cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ProjectionCard data={outcome.metaCpi} tone="lav" delay={0} />
        <ProjectionCard data={outcome.googleCpi} tone="sky" delay={0.05} />
        <ProjectionCard data={outcome.blendedCpt} tone="mint" delay={0.1} />
      </div>

      {/* B. What-if calculator */}
      <Reveal delay={0.15} className="mt-8">
        <WhatIfCalculator />
      </Reveal>

      {/* C. Closing summary */}
      <Reveal delay={0.2} className="mt-8">
        <Card className="overflow-hidden bg-mint-tint/40 border-mint-soft/60 rounded-3xl">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-ink">
              If everything lands
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-base text-ink-soft leading-relaxed">
              Bringing Meta CPI from ₹56 toward ₹22 and Google CPI from ₹61 toward ₹20 is the
              theoretical maximum if listing repair is fully successful.
            </p>
            <p className="text-base text-ink-soft leading-relaxed">
              Realistic targets for the first 12 weeks: Meta CPI ≤₹35, Google CPI ≤₹25,
              blended Meta+Google CPT ≤₹450 (down from current ₹960).
            </p>
            <p className="text-base text-ink-soft leading-relaxed">
              If actual recovery falls materially short, investigate whether listing damage has
              cumulative organic-side effects (negative reviews, search-rank degradation) requiring
              separate remediation.
            </p>

            <StaggerGroup className="flex flex-wrap gap-2 pt-2">
              <StaggerItem>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                    pillToneMap.lav,
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", dotBgMap.lav)} />
                  Meta CPI ≤ ₹35
                </span>
              </StaggerItem>
              <StaggerItem>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                    pillToneMap.sky,
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", dotBgMap.sky)} />
                  Google CPI ≤ ₹25
                </span>
              </StaggerItem>
              <StaggerItem>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                    pillToneMap.mint,
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", dotBgMap.mint)} />
                  Blended CPT ≤ ₹450
                </span>
              </StaggerItem>
            </StaggerGroup>
          </CardBody>
        </Card>
      </Reveal>
    </Section>
  );
}
