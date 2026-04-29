import { motion } from "framer-motion";
import { ChevronDown, RotateCw, Tag, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { StatCard } from "@/components/ui/Stat";
import { kpis, headlineFindings, reportMeta } from "@/data/cac";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Tag,
  RotateCw,
};

const findingTone: Record<
  "rose" | "mint" | "sky" | "lav" | "peach" | "sand",
  { stripe: string; tile: string; iconColor: string; eyebrow: string }
> = {
  rose:  { stripe: "pastel-rose",  tile: "bg-rose-tint",  iconColor: "text-rose-deep",  eyebrow: "text-rose-deep" },
  mint:  { stripe: "pastel-mint",  tile: "bg-mint-tint",  iconColor: "text-mint-deep",  eyebrow: "text-mint-deep" },
  sky:   { stripe: "pastel-sky",   tile: "bg-sky2-tint",  iconColor: "text-sky2-deep",  eyebrow: "text-sky2-deep" },
  lav:   { stripe: "pastel-lav",   tile: "bg-lav-tint",   iconColor: "text-lav-deep",   eyebrow: "text-lav-deep" },
  peach: { stripe: "pastel-peach", tile: "bg-peach-tint", iconColor: "text-peach-deep", eyebrow: "text-peach-deep" },
  sand:  { stripe: "pastel-sand",  tile: "bg-sand-tint",  iconColor: "text-sand-deep",  eyebrow: "text-sand-deep" },
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden"
    >
      {/* Background flourishes */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          aria-hidden
          className="absolute top-[-12%] right-[-10%] w-[42rem] h-[42rem] rounded-full pastel-lav blur-3xl opacity-40"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-[-18%] left-[-12%] w-[36rem] h-[36rem] rounded-full pastel-rose blur-3xl opacity-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-[35%] left-[40%] w-[26rem] h-[26rem] rounded-full pastel-peach blur-3xl opacity-20"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 grid-paper opacity-[0.35]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Top metadata strip */}
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <Badge tone="ink">{reportMeta.geography.toUpperCase()}</Badge>
          <Badge tone="sand">
            {reportMeta.windowStart} → {reportMeta.windowEnd}
          </Badge>
          <Badge tone="neutral">{reportMeta.app}</Badge>
          <Badge tone="lav">Prepared for {reportMeta.preparedFor}</Badge>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          className="mt-6 section-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
        >
          Root-Cause Analysis · Apr 2025 → Apr 2026
        </motion.div>

        {/* Display H1 */}
        <motion.h1
          className="display mt-3 text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-ink max-w-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
        >
          {reportMeta.subtitle.split(" ").map((word, i) => (
            <span key={i} className={i === 1 ? "text-lav-deep" : ""}>
              {word}
              {i < reportMeta.subtitle.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </motion.h1>

        {/* Sub-lede */}
        <motion.p
          className="mt-4 text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
        >
          {reportMeta.byline}
        </motion.p>

        {/* Big 5x panel + supporting copy */}
        <motion.div
          className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.32 }}
        >
          <Card className="lg:col-span-3 relative overflow-hidden">
            <div className="absolute inset-0 pastel-rose opacity-25" aria-hidden />
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pastel-rose opacity-50 blur-3xl" aria-hidden />
            <div className="relative p-8 md:p-10">
              <div className="flex items-center gap-2">
                <span className="chip bg-rose-tint text-rose-deep border-rose-soft/60">
                  Headline
                </span>
                <span className="text-xs text-ink-mute font-mono tracking-wide">
                  Q2 2025 → Q2 2026 · blended Meta CPI
                </span>
              </div>
              <div className="mt-4 display text-7xl md:text-8xl text-ink leading-none tracking-tight">
                <CountUp
                  to={5.16}
                  decimals={2}
                  suffix="×"
                  duration={1.6}
                />
              </div>
              <p className="mt-4 text-ink-soft text-base md:text-lg max-w-md leading-relaxed">
                blended Meta CPI rose this much over 12 months — from
                {" "}
                <span className="font-mono text-ink">₹10.95</span>
                {" "}to{" "}
                <span className="font-mono text-ink">₹56.55</span>
                {" "}per install. Google CPT followed at the same multiple.
              </p>
            </div>
          </Card>

          <Card className="lg:col-span-2 relative overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="section-eyebrow">What this report is</div>
              <p className="mt-3 text-ink-soft text-sm md:text-base leading-relaxed">
                A falsifiable decomposition of every rupee of CAC inflation —
                CPM, CTR, click-to-install, install-to-purchase, and store
                conversion — measured on the strict ₹4 baseline so pricing
                is held constant.
              </p>
              <div className="mt-auto pt-6 border-t border-line/70 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-ink-ghost uppercase tracking-wider">
                    Prepared on
                  </div>
                  <div className="mt-1 font-mono text-ink-soft">
                    {reportMeta.preparedOn}
                  </div>
                </div>
                <div>
                  <div className="text-ink-ghost uppercase tracking-wider">
                    Sources
                  </div>
                  <div className="mt-1 text-ink-soft">
                    {reportMeta.sources.length} feeds reconciled
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* KPI grid */}
        <StaggerGroup
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4"
          delay={0.45}
        >
          <StaggerItem>
            <StatCard
              label={kpis.metaCpi.label}
              unit={kpis.metaCpi.unit}
              from={kpis.metaCpi.from}
              to={kpis.metaCpi.to}
              multiplier={kpis.metaCpi.mult}
              decimals={2}
              color={kpis.metaCpi.color}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label={kpis.googleCpi.label}
              unit={kpis.googleCpi.unit}
              from={kpis.googleCpi.from}
              to={kpis.googleCpi.to}
              multiplier={kpis.googleCpi.mult}
              decimals={2}
              color={kpis.googleCpi.color}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label={kpis.metaCpp.label}
              unit={kpis.metaCpp.unit}
              from={kpis.metaCpp.from}
              to={kpis.metaCpp.to}
              multiplier={kpis.metaCpp.mult}
              decimals={0}
              color={kpis.metaCpp.color}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label={kpis.googleCpt.label}
              unit={kpis.googleCpt.unit}
              from={kpis.googleCpt.from}
              to={kpis.googleCpt.to}
              multiplier={kpis.googleCpt.mult}
              decimals={0}
              color={kpis.googleCpt.color}
            />
          </StaggerItem>
        </StaggerGroup>

        {/* Headline findings */}
        <div className="mt-14">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h3 className="display text-2xl md:text-3xl text-ink tracking-tight">
              Three findings that change the action plan
            </h3>
            <span className="text-xs font-mono text-ink-ghost tracking-wider hidden md:inline">
              01 · 02 · 03
            </span>
          </div>
          <StaggerGroup
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            delay={0.1}
          >
            {headlineFindings.map((f, idx) => {
              const tone = findingTone[f.color];
              const Icon = iconMap[f.icon] ?? Target;
              return (
                <StaggerItem key={f.title}>
                  <Card interactive className="overflow-hidden h-full">
                    <div
                      className={cn(
                        "h-1.5 w-full",
                        tone.stripe,
                      )}
                      aria-hidden
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            tone.tile,
                          )}
                        >
                          <Icon className={cn("w-5 h-5", tone.iconColor)} />
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-semibold uppercase tracking-[0.18em]",
                            tone.eyebrow,
                          )}
                        >
                          Finding 0{idx + 1}
                        </span>
                      </div>
                      <h4 className="mt-4 font-semibold text-ink text-lg leading-snug">
                        {f.title}
                      </h4>
                      <p className="mt-2 text-ink-soft text-sm leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2 text-ink-ghost"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 1.0 }}
        >
          <span className="text-xs uppercase tracking-[0.22em]">
            Scroll for the full story
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
