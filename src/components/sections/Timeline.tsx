import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertOctagon,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Flag,
  Info,
  TrendingDown,
} from "lucide-react";
import { Badge, Dot } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { categoryMeta, timelineEvents, type TimelineEvent } from "@/data/timeline";
import { EventChart } from "@/components/timeline/EventChart";
import { cn } from "@/lib/utils";

const sevColor: Record<TimelineEvent["severity"], { ring: string; bg: string; text: string; label: string; icon: any }> = {
  critical: { ring: "ring-rose-deep/40",   bg: "bg-rose-deep",   text: "text-rose-deep",   label: "Critical",  icon: AlertOctagon },
  high:     { ring: "ring-rose-soft/50",   bg: "bg-rose-soft",   text: "text-rose-deep",   label: "High",      icon: AlertCircle },
  medium:   { ring: "ring-peach-soft/60",  bg: "bg-peach-deep",  text: "text-peach-deep",  label: "Medium",    icon: Flag },
  low:      { ring: "ring-sand-soft/60",   bg: "bg-sand-deep",   text: "text-sand-deep",   label: "Low",       icon: Info },
  info:     { ring: "ring-mint-soft/60",   bg: "bg-mint-deep",   text: "text-mint-deep",   label: "Info",      icon: Info },
};

const toneToClasses: Record<string, { dot: string; tile: string; tileText: string }> = {
  rose:  { dot: "bg-rose-deep",  tile: "bg-rose-tint",  tileText: "text-rose-deep" },
  mint:  { dot: "bg-mint-deep",  tile: "bg-mint-tint",  tileText: "text-mint-deep" },
  sky:   { dot: "bg-sky2-deep",  tile: "bg-sky2-tint",  tileText: "text-sky2-deep" },
  lav:   { dot: "bg-lav-deep",   tile: "bg-lav-tint",   tileText: "text-lav-deep" },
  peach: { dot: "bg-peach-deep", tile: "bg-peach-tint", tileText: "text-peach-deep" },
  sand:  { dot: "bg-sand-deep",  tile: "bg-sand-tint",  tileText: "text-sand-deep" },
  ink:   { dot: "bg-ink",        tile: "bg-ink/5",      tileText: "text-ink" },
};

export function Timeline() {
  const [openId, setOpenId] = useState<string | null>("kw-csl-listing-live");
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? timelineEvents
    : timelineEvents.filter((e) => e.category === filter);

  return (
    <section
      id="timeline-view"
      className="relative pt-10 pb-24 md:pt-14 md:pb-28 overflow-hidden"
    >
      {/* Background flourish */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          aria-hidden
          className="absolute top-[-12%] right-[-8%] w-[30rem] h-[30rem] rounded-full pastel-lav blur-3xl opacity-30"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-[10%] left-[-10%] w-[28rem] h-[28rem] rounded-full pastel-mint blur-3xl opacity-25"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">Timeline</span>
            <span className="text-[11px] font-mono text-ink-ghost tracking-wider">
              {timelineEvents.length} events
            </span>
          </div>
          <h1 className="section-title text-4xl md:text-5xl">
            How CAC broke — month by month
          </h1>
          <p className="mt-3 max-w-2xl text-ink-soft text-base md:text-[17px] leading-relaxed">
            Every event that mattered, in the order it happened. Click any event to open
            full evidence and the chart that diagnoses it.
          </p>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={0.05}>
          <div className="mt-6 flex flex-wrap gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`All · ${timelineEvents.length}`} tone="ink" />
            {(Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>).map((k) => {
              const c = categoryMeta[k];
              const count = timelineEvents.filter((e) => e.category === k).length;
              if (count === 0) return null;
              return (
                <FilterChip
                  key={k}
                  active={filter === k}
                  onClick={() => setFilter(k)}
                  label={`${c.label} · ${count}`}
                  tone={c.tone}
                />
              );
            })}
          </div>
        </Reveal>

        {/* Timeline spine + events */}
        <div className="relative mt-10">
          {/* Vertical spine */}
          <div className="absolute left-[28px] md:left-[140px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-line via-line-strong to-line/40" aria-hidden />

          <ol className="space-y-3">
            {filtered.map((ev, idx) => (
              <TimelineEventRow
                key={ev.id}
                event={ev}
                isOpen={openId === ev.id}
                onToggle={() => setOpenId(openId === ev.id ? null : ev.id)}
                index={idx}
              />
            ))}
          </ol>
        </div>

        {/* Footer note */}
        <Reveal delay={0.1}>
          <div className="mt-16 text-center text-xs text-ink-mute">
            Events sourced from Phase 1–5 of <span className="font-mono">SpeakX_CAC_RCA_Report.docx</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: keyof typeof toneToClasses;
}) {
  const t = toneToClasses[tone];
  return (
    <button
      onClick={onClick}
      className={cn(
        "chip transition-all duration-200 cursor-pointer focus-ring",
        active
          ? cn("border-transparent shadow-soft", t.tile, t.tileText)
          : "bg-bg-surface border-line text-ink-soft hover:border-line-strong hover:text-ink",
      )}
    >
      <span className={cn("inline-block w-1.5 h-1.5 rounded-full", t.dot)} />
      {label}
    </button>
  );
}

function TimelineEventRow({
  event,
  isOpen,
  onToggle,
  index,
}: {
  event: TimelineEvent;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const cm = categoryMeta[event.category];
  const sev = sevColor[event.severity];
  const t = toneToClasses[cm.tone];
  const SevIcon = sev.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="flex gap-5 md:gap-6">
        {/* Date column (desktop) */}
        <div className="hidden md:flex w-[120px] shrink-0 justify-end">
          <div className="text-right pt-3">
            <div className="text-xs text-ink-mute tracking-wider uppercase">{event.dateLabel}</div>
            <div className="mt-1 text-[10px] font-mono text-ink-ghost">{event.phase}</div>
          </div>
        </div>

        {/* Spine dot */}
        <div className="relative shrink-0 w-[24px] flex justify-center">
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "relative z-10 mt-3 w-5 h-5 rounded-full ring-4 ring-bg-base transition-all",
              t.dot,
              isOpen && "ring-bg-surface shadow-lift",
            )}
            aria-label={`Toggle ${event.title}`}
          >
            {event.severity === "critical" && (
              <span
                className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-50",
                  t.dot,
                )}
                aria-hidden
              />
            )}
          </motion.button>
        </div>

        {/* Card column */}
        <div className="flex-1 min-w-0 pb-2">
          <button
            onClick={onToggle}
            className={cn(
              "w-full text-left card overflow-hidden transition-all duration-300 cursor-pointer",
              "hover:-translate-y-0.5 hover:shadow-lift",
              isOpen && "ring-1 ring-line-strong shadow-lift",
            )}
            aria-expanded={isOpen}
          >
            {/* Top stripe */}
            <div className={cn("h-1 w-full", t.dot)} aria-hidden />

            <div className="p-5 md:p-6">
              {/* Mobile date + meta */}
              <div className="md:hidden flex items-center gap-2 mb-3">
                <Badge tone={cm.tone}>{event.dateLabel}</Badge>
                <span className="text-[10px] font-mono text-ink-ghost">{event.phase}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={cn("chip border-transparent", t.tile, t.tileText)}>
                      <Dot tone={cm.tone} />
                      {cm.label}
                    </span>
                    <span className={cn("chip bg-bg-subtle border-line text-[10px] font-medium", sev.text)}>
                      <SevIcon className="w-3 h-3" />
                      {sev.label}
                    </span>
                  </div>
                  <h3 className="display text-xl md:text-2xl text-ink leading-snug tracking-tight">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-[15px] text-ink-soft leading-relaxed">
                    {event.short}
                  </p>

                  {event.metric && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] uppercase tracking-wider text-ink-mute">
                        {event.metric.label}:
                      </span>
                      <span className="font-mono text-xs text-ink-soft">{event.metric.before}</span>
                      <ArrowRight className="w-3 h-3 text-ink-ghost" />
                      <span className="font-mono text-xs font-medium text-ink">{event.metric.after}</span>
                      <span className={cn("chip border-transparent text-[10px] font-semibold", t.tile, t.tileText)}>
                        <TrendingDown className="w-3 h-3" />
                        {event.metric.delta}
                      </span>
                    </div>
                  )}
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0 mt-1 text-ink-mute"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-line/70 grid grid-cols-1 lg:grid-cols-5 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-mute">
                            What happened
                          </div>
                          <p className="mt-2 text-sm text-ink leading-relaxed">{event.detail}</p>
                        </div>
                        <div className={cn("rounded-xl border border-line/70 p-4", t.tile, "bg-opacity-40")}>
                          <div className={cn("text-[10px] uppercase tracking-[0.16em] font-semibold flex items-center gap-1.5", t.tileText)}>
                            <span className={cn("inline-block w-1 h-3 rounded-full", t.dot)} />
                            Why it happened
                          </div>
                          <p className="mt-2 text-sm text-ink leading-relaxed">{event.rationale}</p>
                        </div>
                        {event.bullets && event.bullets.length > 0 && (
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-mute">
                              Impact details
                            </div>
                            <ul className="mt-2 space-y-1.5">
                              {event.bullets.map((b, i) => (
                                <li key={i} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                                  <span className={cn("mt-1.5 inline-block w-1.5 h-1.5 rounded-full shrink-0", t.dot)} />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-mute mb-2">
                          {event.chart ? "Diagnostic chart" : "No chart for this event"}
                        </div>
                        {event.chart ? (
                          <div className="rounded-xl border border-line bg-bg-base/40 p-3">
                            <EventChart spec={event.chart} />
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-line p-6 text-xs text-ink-mute italic">
                            This event is contextual — see related events above and below for chart impact.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>
      </div>
    </motion.li>
  );
}
