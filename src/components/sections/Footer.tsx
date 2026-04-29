import { ChevronUp } from "lucide-react";

import { Dot } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { reportMeta } from "@/data/cac";

const sourceTones = ["lav", "sky", "mint", "peach", "rose", "sand"] as const;
type Tone = (typeof sourceTones)[number];

const methodologyItems = [
  "All ratios are volume-weighted (Σ numerator / Σ denominator), not means of daily ratios.",
  "Log-additive lever decomposition uses natural logarithms; shares sum to 100% by construction.",
  "Google installs use a dual-denominator rule: first_open canonical Apr 25 – Jan 26, backend canonical Feb – Apr 26.",
  "Each phase's headline numbers were independently verified through a second computation path.",
  "All seven phase verification scripts passed. Raw outputs and intermediate CSVs preserved.",
];

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-bg-subtle/60 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: brand */}
          <Reveal>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lav-soft text-lav-deep flex items-center justify-center font-display text-lg font-semibold shadow-soft">
                  S
                </div>
                <div>
                  <div className="font-display text-base text-ink leading-tight">
                    SpeakX · CAC RCA
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5">
                    Prepared for {reportMeta.preparedFor}
                  </div>
                </div>
              </div>
              <div className="text-xs text-ink-mute mt-4">
                Report date {reportMeta.preparedOn}
              </div>
            </div>
          </Reveal>

          {/* MIDDLE: methodology */}
          <Reveal delay={0.05}>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-ink-mute font-semibold mb-3">
                Methodology
              </h3>
              <ul className="space-y-2.5">
                {methodologyItems.map((item, i) => (
                  <li
                    key={i}
                    className="text-xs text-ink-soft leading-relaxed flex gap-2"
                  >
                    <span className="text-ink-ghost shrink-0 mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* RIGHT: sources */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-ink-mute font-semibold mb-3">
                Sources
              </h3>
              <ul className="space-y-2">
                {reportMeta.sources.map((src, i) => {
                  const tone: Tone = sourceTones[i % sourceTones.length];
                  return (
                    <li key={src} className="flex items-center gap-2">
                      <Dot tone={tone} />
                      <span className="font-mono text-xs text-ink-soft">
                        {src}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-line/40 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-ink-mute">
          <span>
            Built from 34 daily-grain CSV files (Meta, Google, Singular, Play Console, backend extracts).
          </span>
          <a
            href="#hero"
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
