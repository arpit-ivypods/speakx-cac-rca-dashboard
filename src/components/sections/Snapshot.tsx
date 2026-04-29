import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Dot } from "@/components/ui/Badge";
import { MetricRow } from "@/components/ui/Stat";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { snapshot } from "@/data/cac";
import { cn } from "@/lib/utils";

// Manually curated "top 3 worst" by economic impact —
// CPI/CPT multiples and the organic trial collapse drive the bulk of the damage.
const WORST_LABELS = ["Google CPT", "Meta CPI", "Organic trial rate"] as const;

export function Snapshot() {
  const worst = WORST_LABELS
    .map((label) => snapshot.find((row) => row.metric === label))
    .filter((row): row is (typeof snapshot)[number] => Boolean(row));

  return (
    <Section
      id="snapshot"
      eyebrow="The 12-month delta"
      title="Q2 2025 vs Q2 2026 — at a glance"
      number="00"
      lede={
        <>
          Every dimension of the funnel got worse except one. The Meta
          install-to-purchase rate actually improved by 24% — a sign the bid
          algorithms are doing their job on user quality, even as the
          click-to-install collapse swamps the savings.
        </>
      }
    >
      {/* Master comparison table */}
      <Card className="overflow-hidden">
        <div className="px-4 pt-5 pb-2 grid grid-cols-12 gap-4 items-center border-b border-line/70">
          <div className="col-span-5 text-xs font-semibold uppercase tracking-wider text-ink-mute">
            Metric
          </div>
          <div className="col-span-3 text-xs font-semibold uppercase tracking-wider text-ink-mute">
            Q2 2025
          </div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-mute">
            Q2 2026
          </div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-mute text-right">
            Δ
          </div>
        </div>
        <StaggerGroup className="p-2">
          {snapshot.map((row) => (
            <StaggerItem key={row.metric}>
              <MetricRow
                label={row.metric}
                q1={row.q2_2025}
                q2={row.q2_2026}
                delta={row.delta}
                tone={row.tone}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Card>

      {/* What got worse / What got better */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="overflow-hidden relative">
          <div className={cn("h-1.5 w-full", "pastel-rose")} aria-hidden />
          <div className="p-6">
            <div className="flex items-center gap-2">
              <Dot tone="rose" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-deep">
                What got worse
              </span>
            </div>
            <h4 className="mt-3 font-semibold text-ink text-lg leading-snug">
              The three biggest holes in the funnel
            </h4>
            <ul className="mt-4 space-y-3">
              {worst.map((row) => (
                <li
                  key={row.metric}
                  className="flex items-start gap-3 text-sm text-ink-soft"
                >
                  <span className="mt-1.5 shrink-0">
                    <Dot tone="rose" />
                  </span>
                  <span className="flex-1 leading-relaxed">
                    <span className="font-medium text-ink">{row.metric}</span>
                    {" "}went from{" "}
                    <span className="font-mono text-ink">{row.q2_2025}</span>
                    {" "}to{" "}
                    <span className="font-mono text-ink">{row.q2_2026}</span>
                    {" "}
                    <span className="chip text-[11px] font-semibold border-transparent bg-rose-tint text-rose-deep ml-1">
                      {row.delta}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="overflow-hidden relative">
          <div className={cn("h-1.5 w-full", "pastel-mint")} aria-hidden />
          <div className="p-6">
            <div className="flex items-center gap-2">
              <Dot tone="mint" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint-deep">
                What got better
              </span>
            </div>
            <h4 className="mt-3 font-semibold text-ink text-lg leading-snug">
              Meta Install → Purchase
              {" "}
              <span className="chip text-xs font-semibold border-transparent bg-mint-tint text-mint-deep align-middle ml-1">
                +24%
              </span>
            </h4>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Of every metric in the table, this is the only one that moved
              in our favour — from{" "}
              <span className="font-mono text-ink">7.86%</span> to{" "}
              <span className="font-mono text-ink">9.74%</span>. Meta's bid
              algorithm is selecting for higher-intent users, so the installs
              we do get convert better. That's why this isn't an audience
              problem — the people landing in the app are higher quality than
              ever. The damage is upstream, in the click-to-install collapse,
              which swamps the conversion gains many times over.
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}
