import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Megaphone,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardBody,
} from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import {
  validationMeta,
  confidenceClaims,
  bandLabel,
  bandTone,
  methodology,
  issues,
  spotChecks,
  improvements,
  caveats,
  tellNotTell,
  type ScoreBand,
} from "@/data/validation";
import { cn } from "@/lib/utils";

type BandTone = "mint" | "sky" | "peach" | "rose";

const toneToTrack: Record<BandTone, string> = {
  mint: "bg-mint-soft",
  sky: "bg-sky2-soft",
  peach: "bg-peach-soft",
  rose: "bg-rose-soft",
};

const toneToText: Record<BandTone, string> = {
  mint: "text-mint-deep",
  sky: "text-sky2-deep",
  peach: "text-peach-deep",
  rose: "text-rose-deep",
};

type Severity = "high" | "medium" | "low";

const severityMeta: Record<
  Severity,
  {
    badgeTone: "rose" | "peach" | "sand";
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    stripe: string;
    dot: string;
  }
> = {
  high: {
    badgeTone: "rose",
    icon: AlertOctagon,
    label: "High",
    stripe: "border-rose-soft",
    dot: "bg-rose-deep",
  },
  medium: {
    badgeTone: "peach",
    icon: AlertTriangle,
    label: "Medium",
    stripe: "border-peach-soft",
    dot: "bg-peach-deep",
  },
  low: {
    badgeTone: "sand",
    icon: AlertCircle,
    label: "Low",
    stripe: "border-sand-soft",
    dot: "bg-sand-deep",
  },
};

const methodologyToneMap: Record<
  "mint" | "peach",
  { stripe: string; badgeTone: "mint" | "peach" }
> = {
  mint: { stripe: "bg-mint-soft", badgeTone: "mint" },
  peach: { stripe: "bg-peach-soft", badgeTone: "peach" },
};

const caveatToneMap: Record<
  "rose" | "peach" | "sky" | "lav" | "sand",
  { gradient: string; tile: string; tileText: string }
> = {
  rose: { gradient: "pastel-rose", tile: "bg-rose-tint", tileText: "text-rose-deep" },
  peach: { gradient: "pastel-peach", tile: "bg-peach-tint", tileText: "text-peach-deep" },
  sky: { gradient: "pastel-sky", tile: "bg-sky2-tint", tileText: "text-sky2-deep" },
  lav: { gradient: "pastel-lav", tile: "bg-lav-tint", tileText: "text-lav-deep" },
  sand: { gradient: "pastel-sand", tile: "bg-sand-tint", tileText: "text-sand-deep" },
};

export function Validation() {
  const highCount = issues.filter((i) => i.severity === "high").length;
  const medCount = issues.filter((i) => i.severity === "medium").length;
  const lowCount = issues.filter((i) => i.severity === "low").length;

  const passCount = spotChecks.filter((c) => c.status === "pass").length;
  const infoCount = spotChecks.filter((c) => c.status === "info").length;
  const failCount = spotChecks.filter((c) => c.status === "fail").length;

  return (
    <section
      id="validation"
      className="relative pt-10 pb-24 md:pt-14 md:pb-28 overflow-hidden"
    >
      {/* Background flourish */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          aria-hidden
          className="absolute top-[-10%] right-[-8%] w-[28rem] h-[28rem] rounded-full pastel-peach blur-3xl opacity-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-[8%] left-[-12%] w-[26rem] h-[26rem] rounded-full pastel-sand blur-3xl opacity-25"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* A. Hero strip */}
        <Reveal>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="section-eyebrow">
              Critical validation · {validationMeta.date}
            </span>
          </div>
          <h1 className="display text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight max-w-4xl">
            How well does this report{" "}
            <span className="text-peach-deep">hold</span> up?
          </h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-peach-soft/60 bg-peach-tint/50 px-4 py-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-peach-soft text-peach-deep flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-peach-deep/80">
                  Verdict
                </div>
                <div className="display text-lg md:text-xl text-ink leading-tight">
                  {validationMeta.verdict}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 max-w-3xl text-ink-soft text-base md:text-[17px] leading-relaxed">
            {validationMeta.oneLine}
          </p>
        </Reveal>

        {/* B. Confidence scoreboard */}
        <Reveal delay={0.15} className="mt-16">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">Confidence by claim</span>
            <span className="text-[11px] font-mono text-ink-ghost tracking-wider">
              {confidenceClaims.length} claims
            </span>
          </div>
          <h2 className="section-title max-w-3xl">
            How much do we believe each claim?
          </h2>
          <p className="mt-3 max-w-3xl text-ink-soft text-base leading-relaxed">
            {confidenceClaims.length} claims, scored 0–100. Rated against the math,
            the methodology, and the strength of evidence.
          </p>
        </Reveal>

        <div className="mt-8 max-w-4xl mx-auto">
          <StaggerGroup className="space-y-2">
            {confidenceClaims.map((c, i) => {
              const tone = bandTone[c.band as ScoreBand] as BandTone;
              return (
                <StaggerItem key={i}>
                  <Card className="px-5 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-12 md:col-span-6">
                        <p className="text-ink font-medium text-sm leading-snug">
                          {c.claim}
                        </p>
                      </div>
                      <div className="col-span-8 md:col-span-4">
                        <div className="relative h-2 w-full rounded-full bg-bg-subtle overflow-hidden">
                          <motion.div
                            className={cn(
                              "absolute inset-y-0 left-0 rounded-full",
                              toneToTrack[tone],
                            )}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${c.score}%` }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                              duration: 0.9,
                              ease: [0.22, 1, 0.36, 1],
                              delay: 0.05,
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-2 flex flex-col items-end">
                        <div
                          className={cn(
                            "display text-3xl leading-none",
                            toneToText[tone],
                          )}
                        >
                          {c.score}
                        </div>
                        <Badge tone={tone} className="mt-1.5 text-[10px]">
                          {bandLabel[c.band as ScoreBand]}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-ink-mute italic max-w-prose leading-relaxed">
                      {c.note}
                    </p>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>

        {/* C. Methodology review */}
        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">Methodology review</span>
          </div>
          <h2 className="section-title max-w-3xl">
            How the report was built — pillar by pillar
          </h2>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {methodology.map((m, i) => {
            const tm = methodologyToneMap[m.tone];
            return (
              <Reveal key={m.pillar} delay={0.05 + i * 0.04}>
                <Card className="overflow-hidden h-full">
                  <div className={cn("h-1 w-full", tm.stripe)} />
                  <CardBody className="pt-5">
                    <h3 className="display text-xl text-ink leading-tight">
                      {m.pillar}
                    </h3>
                    <div className="mt-2">
                      <Badge tone={tm.badgeTone}>{m.verdict}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                      {m.body}
                    </p>
                  </CardBody>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* D. Issues found */}
        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">
              Issues found · {issues.length} total
            </span>
          </div>
          <h2 className="section-title max-w-3xl">
            Where the report could be tighter
          </h2>
          <p className="mt-3 text-ink-soft text-base leading-relaxed">
            {highCount} high · {medCount} medium · {lowCount} low
          </p>
        </Reveal>

        <div className="mt-8 space-y-5">
          {issues.map((iss, i) => {
            const sm = severityMeta[iss.severity];
            const Icon = sm.icon;
            return (
              <Reveal key={iss.n} delay={0.05 + i * 0.03}>
                <Card
                  className={cn(
                    "border-l-4 px-6 py-5",
                    sm.stripe,
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge tone={sm.badgeTone} className="inline-flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {sm.label}
                    </Badge>
                    <span className="font-mono text-[11px] tracking-wider text-ink-ghost uppercase">
                      Issue {String(iss.n).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="display text-xl text-ink leading-snug">
                    {iss.title}
                  </h3>
                  <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-prose">
                    {iss.body}
                  </p>
                  {iss.bullets && iss.bullets.length > 0 && (
                    <div className="mt-4 rounded-xl bg-bg-subtle px-4 py-3">
                      <ul className="space-y-2">
                        {iss.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                "mt-1.5 inline-block w-1.5 h-1.5 rounded-full shrink-0",
                                sm.dot,
                              )}
                            />
                            <span className="text-xs text-ink-soft leading-relaxed">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {iss.impact && (
                    <p className="mt-4 text-xs text-ink-mute italic leading-relaxed">
                      <span className="font-semibold not-italic text-ink-soft">
                        Impact:
                      </span>{" "}
                      {iss.impact}
                    </p>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* E. Calculation spot-checks */}
        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">
              Calculation spot-checks · {spotChecks.length}
            </span>
          </div>
          <h2 className="section-title max-w-3xl">
            Did the math check out?
          </h2>
          <p className="mt-3 text-ink-soft text-base leading-relaxed">
            {passCount} verified, {infoCount} information-only, {failCount} silent
            omission flagged
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="mt-8 px-6 py-5">
            <div className="grid grid-cols-[1fr_1fr_120px] gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-wider font-semibold text-ink-ghost pb-3 border-b border-line/60">
              <div>Check</div>
              <div>Result</div>
              <div className="text-right">Status</div>
            </div>
            <div className="mt-2 grid grid-cols-[1fr_1fr_120px] gap-x-4 gap-y-1.5">
              {spotChecks.map((sc, i) => {
                const isFail = sc.status === "fail";
                const isInfo = sc.status === "info";
                const isPass = sc.status === "pass";
                return (
                  <div
                    key={i}
                    className={cn(
                      "contents",
                    )}
                  >
                    <div
                      className={cn(
                        "col-span-3 grid grid-cols-subgrid items-center px-3 py-2 rounded-lg",
                        isFail && "bg-rose-tint/40 ring-1 ring-rose-soft",
                      )}
                    >
                      <div className="text-sm text-ink leading-snug">
                        {sc.check}
                      </div>
                      <div className="font-mono text-xs text-ink-soft leading-snug">
                        {sc.result}
                      </div>
                      <div className="flex justify-end">
                        {isPass && (
                          <Badge
                            tone="mint"
                            className="inline-flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pass
                          </Badge>
                        )}
                        {isInfo && (
                          <Badge
                            tone="sky"
                            className="inline-flex items-center gap-1.5"
                          >
                            <Info className="w-3.5 h-3.5" />
                            Info
                          </Badge>
                        )}
                        {isFail && (
                          <Badge
                            tone="rose"
                            className="inline-flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Fail
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Reveal>

        {/* F. Suggested improvements */}
        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">
              Suggested improvements · {improvements.length}
            </span>
          </div>
          <h2 className="section-title max-w-3xl">
            What would tighten the report
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="mt-8 px-6 py-5">
            <ul>
              {improvements.map((imp, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[50px_1fr] gap-4 py-4 border-b border-line/40 last:border-b-0 first:pt-1 last:pb-1"
                >
                  <div className="display text-2xl text-lav-deep leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm text-ink leading-relaxed">{imp}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        {/* G. Required caveats */}
        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">
              Required caveats for stakeholders
            </span>
          </div>
          <h2 className="section-title max-w-3xl">
            What to communicate alongside the headline finding
          </h2>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {caveats.map((cv, i) => {
            const tm = caveatToneMap[cv.tone];
            return (
              <Reveal key={i} delay={0.05 + i * 0.03}>
                <Card className="overflow-hidden h-full">
                  <div className={cn("h-1 w-full", tm.gradient)} />
                  <CardBody className="pt-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                          tm.tile,
                          tm.tileText,
                        )}
                      >
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink leading-snug">
                          {cv.title}
                        </h3>
                        <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                          {cv.body}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* H. Tell / Don't tell */}
        <Reveal delay={0.05} className="mt-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">Bottom line</span>
          </div>
          <h2 className="section-title max-w-3xl">
            What to tell — and what to hold back
          </h2>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Reveal delay={0.08}>
            <Card className="px-6 py-5 bg-mint-tint/40 border-mint-soft/50 h-full">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-mint-soft text-mint-deep flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-mint-deep">
                  Tell stakeholders
                </span>
              </div>
              <p className="text-base text-ink leading-relaxed">
                {tellNotTell.tell}
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.12}>
            <Card className="px-6 py-5 bg-rose-tint/40 border-rose-soft/50 h-full">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-rose-soft text-rose-deep flex items-center justify-center">
                  <EyeOff className="w-4 h-4" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-rose-deep">
                  Don't tell them yet
                </span>
              </div>
              <ul className="space-y-2.5">
                {tellNotTell.notYet.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Dot tone="rose" className="mt-2 shrink-0" />
                    <span className="text-sm text-ink leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-8">
          <Callout variant="primary" title="Final word">
            {validationMeta.bottomLine}
          </Callout>
        </Reveal>
      </div>
    </section>
  );
}
