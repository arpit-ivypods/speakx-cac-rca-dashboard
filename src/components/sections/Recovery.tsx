import * as React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

import { Section } from "@/components/ui/Section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
} from "@/components/ui/Card";
import { Dot } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { actions, notDoing, timeline } from "@/data/cac";

type Tone = "rose" | "mint" | "sky" | "lav" | "peach" | "sand";

const stripeMap: Record<Tone, string> = {
  rose: "from-rose-soft to-rose-tint",
  mint: "from-mint-soft to-mint-tint",
  sky: "from-sky2-soft to-sky2-tint",
  lav: "from-lav-soft to-lav-tint",
  peach: "from-peach-soft to-peach-tint",
  sand: "from-sand-soft to-sand-tint",
};

const numberBadgeMap: Record<Tone, string> = {
  rose: "bg-rose-tint text-rose-deep border-rose-soft/60",
  mint: "bg-mint-tint text-mint-deep border-mint-soft/60",
  sky: "bg-sky2-tint text-sky2-deep border-sky2-soft/60",
  lav: "bg-lav-tint text-lav-deep border-lav-soft/60",
  peach: "bg-peach-tint text-peach-deep border-peach-soft/60",
  sand: "bg-sand-tint text-sand-deep border-sand-soft/60",
};

const pillToneMap: Record<Tone, string> = {
  rose: "bg-rose-tint text-rose-deep border-rose-soft/60",
  mint: "bg-mint-tint text-mint-deep border-mint-soft/60",
  sky: "bg-sky2-tint text-sky2-deep border-sky2-soft/60",
  lav: "bg-lav-tint text-lav-deep border-lav-soft/60",
  peach: "bg-peach-tint text-peach-deep border-peach-soft/60",
  sand: "bg-sand-tint text-sand-deep border-sand-soft/60",
};

const timelinePillMap: Record<Tone, string> = {
  rose: "bg-rose-tint text-rose-deep border-rose-soft",
  mint: "bg-mint-tint text-mint-deep border-mint-soft",
  sky: "bg-sky2-tint text-sky2-deep border-sky2-soft",
  lav: "bg-lav-tint text-lav-deep border-lav-soft",
  peach: "bg-peach-tint text-peach-deep border-peach-soft",
  sand: "bg-sand-tint text-sand-deep border-sand-soft",
};

function impactToTone(impact: string): Tone {
  const map: Record<string, Tone> = {
    largest: "rose",
    medium: "peach",
    moderate: "peach",
    small: "sand",
    "small but pure protection": "mint",
    "diagnostic, not corrective": "sky",
    "small as a pilot": "sand",
    "small but improves confidence": "mint",
    "meaningful for organic only": "sky",
  };
  return map[impact] ?? "sand";
}

function confidenceToTone(c: string): Tone {
  if (c === "high") return "mint";
  if (c === "medium") return "peach";
  return "sand";
}

function riskToTone(r: string): Tone {
  const lower = r.toLowerCase();
  if (lower === "none" || lower === "very low" || lower === "low") return "mint";
  if (lower === "medium") return "peach";
  if (lower === "high") return "rose";
  // fallback for things like "revenue cut on confirmed payers"
  return "peach";
}

function MiniPill({
  tone,
  children,
  withDot = false,
}: {
  tone: Tone;
  children: React.ReactNode;
  withDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        pillToneMap[tone],
      )}
    >
      {withDot && <Dot tone={tone} />}
      {children}
    </span>
  );
}

function ActionCard({
  action,
  index,
}: {
  action: (typeof actions)[number];
  index: number;
}) {
  const color = action.color as Tone;
  const numberStr = String(action.n).padStart(2, "0");
  const impactTone = impactToTone(action.impact);
  const confTone = confidenceToTone(action.confidence);
  const riskTone = riskToTone(action.risk);

  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <Card interactive className="overflow-hidden h-full flex flex-col">
          <div className={cn("h-1.5 w-full bg-gradient-to-r", stripeMap[color])} />
          <CardHeader>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm font-semibold",
                  numberBadgeMap[color],
                )}
              >
                {numberStr}
              </div>
              <div className="min-w-0">
                <CardTitle className="font-display text-xl text-ink leading-snug">
                  {action.title}
                </CardTitle>
                <CardSubtitle className="text-sm text-ink-soft mt-1">
                  {action.sub}
                </CardSubtitle>
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex-1 flex flex-col gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-mute mb-1.5">
                Evidence
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                {action.evidence}
              </p>
            </div>
            <div className="border-t border-line/60 pt-4">
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-mute mb-1.5">
                Action
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                {action.action}
              </p>
            </div>
            <div className="border-t border-line/60 pt-4 flex flex-wrap gap-1.5">
              <MiniPill tone={impactTone}>Impact: {action.impact}</MiniPill>
              <MiniPill tone={confTone} withDot>
                Confidence: {action.confidence}
              </MiniPill>
              <MiniPill tone={riskTone} withDot>
                Risk: {action.risk}
              </MiniPill>
            </div>
            <div className="border-t border-line/60 pt-3">
              <p className="text-xs text-ink-mute italic leading-relaxed">
                {action.impactNote}
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </Reveal>
  );
}

const LANES = ["Audit", "Diag", "Plan", "Run", "Roll", "Lock"] as const;
type Lane = (typeof LANES)[number];

function parseWeek(w: string): { start: number; end: number } {
  // "W1" or "W1–3" or "W4–6"
  const cleaned = w.replace(/\s/g, "");
  const m = cleaned.match(/^W(\d+)(?:[–-](\d+))?$/);
  if (!m) return { start: 1, end: 1 };
  const start = parseInt(m[1], 10);
  const end = m[2] ? parseInt(m[2], 10) : start;
  return { start, end };
}

function TimelineGantt() {
  const lanes: Record<Lane, typeof timeline> = {
    Audit: [],
    Diag: [],
    Plan: [],
    Run: [],
    Roll: [],
    Lock: [],
  };
  for (const t of timeline) {
    const lane = t.lane as Lane;
    if (lanes[lane]) lanes[lane].push(t);
  }
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  let pillIdx = 0;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        {/* Header row */}
        <div className="grid grid-cols-[140px_repeat(12,minmax(0,1fr))] items-center mb-2">
          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-mute">
            Lane
          </div>
          {weeks.map((w) => (
            <div
              key={w}
              className="text-[10px] uppercase tracking-[0.12em] font-semibold text-ink-mute text-center border-l border-line/40 py-1"
            >
              W{w}
            </div>
          ))}
        </div>

        {/* Lane rows */}
        <div className="space-y-2">
          {LANES.map((lane) => {
            const items = lanes[lane];
            return (
              <div
                key={lane}
                className="grid grid-cols-[140px_repeat(12,minmax(0,1fr))] items-stretch min-h-[44px] py-1"
              >
                <div className="flex items-center pr-3">
                  <span className="text-sm font-medium text-ink">{lane}</span>
                </div>
                {weeks.map((w) => (
                  <div
                    key={w}
                    className="border-l border-line/40 relative"
                  />
                ))}
                {/* Overlay pills as absolute positioned via grid placement */}
                {items.map((it) => {
                  const { start, end } = parseWeek(it.week);
                  const colStart = start + 1; // +1 because col 1 is the lane label
                  const span = end - start + 1;
                  const tone = it.color as Tone;
                  const idx = pillIdx++;
                  return (
                    <div
                      key={`${lane}-${idx}`}
                      className="row-start-1 flex items-center px-1"
                      style={{
                        gridColumn: `${colStart} / span ${span}`,
                      }}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                        transition={{ duration: 0.7, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left" }}
                        className={cn(
                          "h-7 w-full rounded-full border px-3 flex items-center text-[11px] font-medium leading-tight",
                          timelinePillMap[tone],
                        )}
                      >
                        <span className="line-clamp-1" title={it.step}>
                          {it.step}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Recovery() {
  return (
    <Section
      id="recovery"
      eyebrow="Recovery action plan"
      number="R"
      title="Steps to get CAC back, in priority order"
      lede="Pricing-related actions and audience-targeting actions will have limited impact, because pricing was a third-order driver and audience targeting did not change for our worst-affected campaigns. Actions are ranked by expected CAC recovery."
    >
      {/* A. Action steps grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {actions.map((a, i) => (
          <ActionCard key={a.n} action={a} index={i} />
        ))}
      </div>

      {/* B. What's NOT on the recovery list */}
      <Reveal delay={0.1} className="mt-10">
        <Card className="overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-sand-soft to-sand-tint" />
          <CardHeader>
            <CardTitle className="font-display text-xl text-ink">
              What's NOT on the recovery list (and why)
            </CardTitle>
            <CardSubtitle>
              Three plausible-sounding actions that are off the table.
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <ul className="divide-y divide-line/60">
              {notDoing.map((nd, i) => (
                <li key={i} className="py-3 first:pt-0 last:pb-0 flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-rose-deep/80" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink leading-snug">{nd.item}</p>
                    <p className="text-sm text-ink-soft mt-1 leading-relaxed">
                      {nd.why}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </Reveal>

      {/* C. 12-week timeline */}
      <Reveal delay={0.15} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl text-ink">
              Order of operations — 12-week timeline
            </CardTitle>
            <CardSubtitle>
              Sequence the audit/diagnostic, listing repair, A/B, rollback, and lock-in.
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <TimelineGantt />
          </CardBody>
        </Card>
      </Reveal>
    </Section>
  );
}
