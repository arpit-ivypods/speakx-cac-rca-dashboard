// Vertical timeline events — derived from SpeakX_CAC_RCA_Report.docx
// Each event: a date, narrative, the metric it impacted, and a mini-chart spec.

export type EventCategory =
  | "pricing"
  | "portfolio"
  | "aso"
  | "data"
  | "release"
  | "config"
  | "milestone"
  | "diagnosis";

export type ChartSpec =
  | { kind: "asoCr" }                      // Play Console store CR daily with event marker
  | { kind: "cliffCi" }                    // GE_UAC_High_Intent C→I monthly
  | { kind: "cliffCpi" }                   // GE_UAC_High_Intent CPI monthly
  | { kind: "trialRegime"; highlight: string }      // grouped bars across regimes, highlight one
  | { kind: "googleReconcile" }            // first_open vs backend
  | { kind: "metaPortfolio" }              // legacy vs new at column level
  | { kind: "uacZeroTrials" }              // bar showing spend vs trials
  | { kind: "constantPriceCpi" }           // CPI rising in flat-price window
  | { kind: "windowSummary" };             // start/end CPI bars

export interface TimelineEvent {
  id: string;
  date: string;             // YYYY-MM-DD
  dateLabel: string;        // "24 Oct 2025"
  category: EventCategory;
  title: string;
  short: string;            // 1-2 sentence card summary
  detail: string;           // longer narrative on expand
  rationale: string;        // why did this happen / mechanism behind the event
  bullets?: string[];       // optional list of impact details
  metric?: { label: string; before: string; after: string; delta: string };
  severity: "critical" | "high" | "medium" | "low" | "info";
  phase: string;            // "Phase 3" etc.
  chart?: ChartSpec;
}

const cat: Record<EventCategory, { label: string; tone: "rose" | "mint" | "sky" | "lav" | "peach" | "sand" | "ink" }> = {
  pricing:   { label: "Pricing",        tone: "peach" },
  portfolio: { label: "Portfolio",      tone: "lav" },
  aso:       { label: "ASO / Listing",  tone: "rose" },
  data:      { label: "Data integrity", tone: "sky" },
  release:   { label: "App release",    tone: "sand" },
  config:    { label: "Config error",   tone: "rose" },
  milestone: { label: "Milestone",      tone: "ink" },
  diagnosis: { label: "Diagnosis",      tone: "mint" },
};

export const categoryMeta = cat;

export const timelineEvents: TimelineEvent[] = [
  {
    id: "window-start",
    date: "2025-04-28",
    dateLabel: "28 Apr 2025",
    category: "milestone",
    title: "Analysis window opens",
    short: "Trial price ₹4. Meta CPI ₹10.95, Google CPI ₹15.52. Funnel healthy at ~50% click-to-install on Meta.",
    detail:
      "The 12-month root-cause analysis window begins. SpeakX is on the strict ₹4 trial price, the four legacy Meta workhorses are running at ₹10–11 CPI, and Play Console India store conversion sits around 34%. This is the baseline from which everything is measured.",
    rationale:
      "This is the t=0 of the analysis — the state of the system before any of the changes that caused CAC to inflate. It exists as a milestone because every later metric in the report is expressed relative to these numbers. Establishing a clean baseline is what allows us to attribute later movements to specific causes (pricing, listing wave, portfolio rotation) rather than to background drift, and it is the reason the 12-month window starts here rather than at a fiscal boundary.",
    severity: "info",
    phase: "Window setup",
    metric: { label: "Meta CPI", before: "—", after: "₹10.95", delta: "baseline" },
    chart: { kind: "windowSummary" },
  },
  {
    id: "constant-price-drift",
    date: "2025-05-01",
    dateLabel: "May – Sep 2025",
    category: "diagnosis",
    title: "CPI silently doubles on a flat ₹4 price",
    short: "Inside the strictly-pure ₹4 window, Meta CPI rose 2.10× and Google CPI rose 1.83× — before any price change.",
    detail:
      "From 28 Apr to 16 Oct 2025 (172 days), the trial price was constant at ₹4 every day — no tests of any other price. If pricing were the dominant cause, CAC inside this window should have been roughly flat. It was not. Roughly half the year's CAC inflation was already locked in before any pricing test happened. This single fact falsifies the 'price hike caused CAC to rise' narrative.",
    rationale:
      "Two slow-burning destination-side mechanisms were already at work even though the price was frozen. The Play Store listing experience was gradually decaying — click-to-install was bleeding out from the high-30s toward the low-30s — so the bid algorithm had to pay progressively more per install just to hold install volume. The algorithm doesn't see store CR; it only sees that more spend is needed to clear the same number of conversions, so CPI rises silently. Pricing didn't cause this drift; it was masked by the eventual price test and only visible once we isolated the strictly-pure ₹4 window.",
    bullets: [
      "Meta CPI: ₹11.47 → ₹24.09 (2.10×)",
      "Meta Click-to-Install: 50.55% → 36.38% (-28%)",
      "Google CPI: ₹14.70 → ₹26.88 (1.83×)",
      "Google Click-to-Install: 24.17% → 16.93% (-30%)",
    ],
    metric: { label: "Meta CPI in ₹4 window", before: "₹11.47", after: "₹24.09", delta: "+110%" },
    severity: "high",
    phase: "Phase 4",
    chart: { kind: "constantPriceCpi" },
  },
  {
    id: "meta-attribution-flip",
    date: "2025-08-01",
    dateLabel: "Aug 2025",
    category: "data",
    title: "Meta attribution methodology changes",
    short: "Meta platform-attributed installs flip from over-counting backend (+23–35%) to under-counting (-7–19%).",
    detail:
      "Meta's platform-attributed installs over-counted backend by 23–35% in Apr–Jul 2025, then flipped to under-counting by 7–19% from Aug 2025 to Jan 2026. The flip is likely caused by changes in backend attribution methodology rather than platform-side noise. We therefore report Meta CAC trends from the platform side (which is what the bid algorithm optimises against) but cross-check trend direction against backend.",
    rationale:
      "The flip is too clean and too sustained to be platform-side noise — Meta's attribution didn't suddenly start lying. The most plausible mechanism is that SpeakX's backend attribution rules changed around August (deduplication windows, last-click logic, or how organic vs paid is split). Once the backend's definition of a paid install shifts, the platform-vs-backend gap shifts with it. We keep the platform side as canonical for trend analysis because that is what the bid algorithm actually optimises against, and we treat backend as a directional cross-check rather than ground truth.",
    severity: "low",
    phase: "Phase 1",
  },
  {
    id: "ge-uac-statics-paused",
    date: "2025-09-29",
    dateLabel: "29 Sep 2025",
    category: "portfolio",
    title: "GE_UAC_Statics paused — most efficient campaign killed",
    short: "Google's most efficient archetype paused at ₹11.98 lifetime CPI and 42% click-to-install — exactly when the cliff began.",
    detail:
      "GE_UAC_Statics had the lowest CPI of any meaningful Google segment (₹11.98 lifetime, ₹155 CPT) and was paused on 29 September 2025 — exactly when the cliff started. At pause, its Click-to-Install was still healthy at 42%. The pause appears to have been triggered by rising CPM (which had crept from ₹84 in May to ₹188 in August), not by performance. Killing the most efficient creative archetype right before the funnel broke was, in retrospect, a costly decision — though the team could not have known what was coming.",
    rationale:
      "The pause decision was driven by an upstream auction signal, not a downstream performance signal. CPM had more than doubled from ₹84 to ₹188 over four months, which is a textbook trigger for pausing — high CPM looks like an auction running away from you. But CPM is a cost-of-impressions metric; it says nothing about whether those impressions still convert. At pause time, click-to-install was actually still 42%. The team killed the most efficient archetype on a leading-cost signal exactly as the destination-side funnel was about to break, which is why this decision is costly only in hindsight.",
    bullets: [
      "Lifetime CPI ₹11.98 — the lowest in the dataset",
      "Click-to-Install at pause: 42% (still healthy)",
      "CPM trajectory: ₹84 → ₹188 (May → Aug)",
      "Recovery action: re-launch as a small spend pilot once listing repair lands (Step 6)",
    ],
    metric: { label: "Click-to-Install at pause", before: "—", after: "42%", delta: "still healthy" },
    severity: "medium",
    phase: "Phase 3",
  },
  {
    id: "release-halt-530",
    date: "2025-10-13",
    dateLabel: "13 Oct 2025",
    category: "release",
    title: "Release halt — v5.3.0",
    short: "Precautionary release halt. Crash/ANR data was actually declining (119 → 53 by 20 Oct).",
    detail:
      "Two release halts (v5.3.0 and v5.3.2) happened on 13 and 14 October 2025, exactly at the CUSUM change-point. However, crash and ANR data over those days actually declined steadily (119 crashes on 8 October down to 53 by 20 October), so the release halts appear to have been precautionary, not crisis-driven. The magnitude of the 11.6pp store CR drop in a single month is also far too large to be explained by typical release regressions.",
    rationale:
      "Release halts at SpeakX are gated by a precautionary policy — the team prefers to halt a rollout on any uncertainty rather than wait for crashes to spike. The crash/ANR series actually trended down across the halt window, which means the halt was triggered by review caution, not by an observed regression. We include it on the timeline because it is the most obvious co-occurring event with the CUSUM inflection, but the direction of the crash data and the magnitude of the store-CR drop together rule it out as the dominant cause.",
    severity: "low",
    phase: "Phase 5",
  },
  {
    id: "cusum-changepoint",
    date: "2025-10-14",
    dateLabel: "14 Oct 2025",
    category: "diagnosis",
    title: "CUSUM detects the inflection",
    short: "Change-point detection on Play Console India store CR daily series identifies 14 Oct as the inflection point.",
    detail:
      "CUSUM change-point detection on the Play Console India store conversion-rate daily series identifies 14 October 2025 as the inflection. The mean store conversion rate for the 30 days before 24 October 2025 was 30.16%; the mean for the 30 days after was 18.52% — a drop of 11.64 percentage points in a single thirty-day window. Three independent measurements (Meta C→I, Google C→I, Play Console store CR) all dropped together — not coincidence.",
    rationale:
      "CUSUM is a regime-shift detector: it looks for the point at which the cumulative deviation from a stable mean breaks. The fact that the algorithm landed on 14 October — and that three independent series (Meta C→I, Google C→I, store CR) all show the break in the same window — means the cause must be something that simultaneously affected the store experience for all paid traffic. The release halts are too small to bend the curve this far, so the inflection points at a destination-side change. The first major _KW_CSL_ keyword listing going live ten days later is the most plausible candidate.",
    metric: { label: "Store CR shift", before: "30.16%", after: "18.52%", delta: "-11.64 pp" },
    severity: "critical",
    phase: "Phase 5",
    chart: { kind: "asoCr" },
  },
  {
    id: "rs4-window-end",
    date: "2025-10-16",
    dateLabel: "16 Oct 2025",
    category: "milestone",
    title: "End of strictly-pure ₹4 baseline",
    short: "172 consecutive days at ₹4. Pricing tests begin shortly after — but the damage is already locked in.",
    detail:
      "The strictly-pure ₹4 baseline window ends after 172 days. Roughly half the year's CAC inflation is already locked in before any pricing change happens. The bid algorithms on Meta and Google fully absorb price elasticity from ₹4 up to ₹29; only the ₹49 test (months later) breaks that buffer.",
    rationale:
      "This date marks the start of the planned price-elasticity test campaign. Up to here, the team had deliberately held trial price flat for nearly six months precisely so that any movement in CAC could be attributed to non-pricing factors. Closing the window opens the door to the ₹19 / ₹29 / ₹49 series of tests that follow. The reason this milestone matters is methodological: any clean attribution claim about pricing depends on having a frozen-price reference window, and 16 October is its last day.",
    severity: "info",
    phase: "Phase 4",
  },
  {
    id: "kw-csl-listing-live",
    date: "2025-10-24",
    dateLabel: "24 Oct 2025",
    category: "aso",
    title: "Nikita's 27-keyword listing goes live (PRIMARY DRIVER)",
    short: "The single biggest driver of the entire CAC rise. Store CR drops 30% → 18% in 30 days. _KW_CSL_ wave begins.",
    detail:
      "The 27-keyword 'English Speaking App CSL 24 Oct 25' listing goes live, ten days after the CUSUM-detected inflection. The mean store conversion rate for the 30 days before this date was 30.16%; for the 30 days after, 18.52%. This single event explains roughly 47% of Meta's CPI rise and 74% of Google's CPI rise. Every subsequent _KW_CSL_ listing introduced from this date onward is a candidate for rollback in Recovery Step 1.",
    rationale:
      "The ASO team launched keyword-targeted custom store listings (CSLs) to grow addressable audience by ranking for more search terms. Mechanically, this works — Google Play serves the keyword listing to anyone whose search broadly matches, expanding install volume. But the new audience is dilutive: a user typing a generic English-learning keyword has lower intent than one typing a branded SpeakX query. Same ad creative, same audience targeting on the campaign side, but a different store experience for a different mix of incoming users — so conversion rate falls even as reach grows.",
    bullets: [
      "Store CR: 30.16% → 18.52% in 30 days (-11.64pp)",
      "GE_UAC_High_Intent Click-to-Install: 39% → 13% in same window",
      "Listing portfolio expanded the addressable audience but at the cost of conversion rate",
      "Recovery action: roll back to single tested high-converting default listing (Step 1)",
    ],
    metric: { label: "Play Console store CR", before: "30.16%", after: "18.52%", delta: "-11.64 pp" },
    severity: "critical",
    phase: "Phase 5",
    chart: { kind: "asoCr" },
  },
  {
    id: "october-cliff",
    date: "2025-10-30",
    dateLabel: "Oct 2025",
    category: "diagnosis",
    title: "October cliff — 16.4pp drop in one month",
    short: "GE_UAC_High_Intent click-to-install drops from 35.8% to 22.4% in October — the steepest single-month decline.",
    detail:
      "Looking at GE_UAC_High_Intent's month-by-month Click-to-Install trajectory makes the timing of the break visible to the day. April–September 2025: stable at 35.8–39.5% for six months. October 2025: 22.4% (-16.4pp). November 2025: 12.9% (-9.5pp). December 2025 – April 2026: 9.9–12.9%, the new floor — never recovers. This is a single campaign with a single audience targeting setting. It cannot be a portfolio-composition story.",
    rationale:
      "The store listing the campaign was routing to lost the ability to convert clicks into installs. Audience targeting was unchanged, CPM had actually fallen 50%, and the campaign continued running every day. The only mechanism left to explain a 16-point drop in 30 days is destination-side: the new keyword-targeted Play Store listings activated in late October pulled in lower-intent traffic that bounced before installing. Same ad, same bid algorithm, same audience — different storefront experience, and the conversion math collapsed.",
    metric: { label: "GE_UAC_High_Intent Click→Install", before: "35.8%", after: "22.4%", delta: "-16.4 pp" },
    severity: "critical",
    phase: "Phase 3",
    chart: { kind: "cliffCi" },
  },
  {
    id: "uac-conv-event-launched",
    date: "2025-11-10",
    dateLabel: "10 Nov 2025",
    category: "diagnosis",
    title: "UAC_Conv_event_10Nov25 launched — deeper-funnel optimization",
    short:
      "Not a misconfiguration. Deliberately bidding against `conversion_event` — a stronger quality signal than `payment_success`. ₹680 per activated trialer over 170 days.",
    detail:
      "This Google campaign accounts for 15% of total Google spend in the window (₹3.26 Cr) and shows zero `payment_success` events but 47,860 `conversion_event` events. Initially this looked like a configuration error. It is not — the campaign was deliberately set up on 10 November 2025 to bid against a deeper-funnel signal: the `conversion_event` action fires only when a user has paid for the trial, has started one exercise after payment, AND still has an active subscription at the moment the exercise begins. It is a strictly stronger quality signal than `payment_success`. All 47,860 `conversion_event` records in the entire dataset come from this single campaign — no other campaign subscribes to that action.",
    rationale:
      "Google Ads attributes per conversion-action, not per user. The same paid-trial users do trigger `payment_success` in GA4, but those events are credited to whichever campaign or source is the subscribed owner of `payment_success`. UAC_Conv_event_10Nov25 only subscribes to `conversion_event`, so that is the only event it records. The campaign was set up this way intentionally to optimize bidding against a quality-gated signal — paid + activated + still subscribed — rather than the standard payment event. Effective economics work out to ₹680 per activated trialer and ₹40 per install, both in line with the rest of the Google portfolio.",
    bullets: [
      "Spend: ₹3.26 Cr (15% of Google spend in window; 23% from 10 Nov onwards)",
      "Activated trialers (paid + started exercise + still subscribed): 47,860 over 170 days",
      "Effective CPT: ~₹680 per activated trialer — in line with portfolio (₹400–₹1,000 typical)",
      "Effective CPI: ~₹40 per install — in line with portfolio",
      "Recovery action: validate the deeper-funnel signal and consider extending it to top campaigns (Step 2)",
    ],
    metric: { label: "Cost per activated trialer", before: "—", after: "₹680", delta: "in-line, higher quality" },
    severity: "info",
    phase: "Phase 5",
    chart: { kind: "uacZeroTrials" },
  },
  {
    id: "november-floor",
    date: "2025-11-30",
    dateLabel: "Nov 2025",
    category: "diagnosis",
    title: "Click-to-Install hits the new floor",
    short: "GE_UAC_High_Intent drops from 22.4% to 12.9% (-9.5pp). The floor has been set; CPI has rerated.",
    detail:
      "In just October and November 2025 alone, GE_UAC_High_Intent's Click-to-Install drops 26 percentage points (out of an original 39) and never recovers. From December 2025 through April 2026 it stays in a 9.9–12.9% range. The campaign's CPM actually fell 50% across the window — the auction did not get more expensive. The mechanism cannot be 'we scaled into a worse audience' (audience targeting was unchanged). The only mechanism left is destination-side: the Play Store listing the campaign was routing to lost the ability to convert clicks into installs.",
    rationale:
      "The keyword-listing damage compounds. Once store CR sits at the new lower regime, the bid algorithm doesn't know why fewer clicks turn into installs — it only knows it has to pay more per install to clear the same volume. Over a few weeks the algorithm rerates its bids upward and treats the new CPI level as the steady state. That is how a 'floor' gets set: not because anything new broke in November, but because the algorithm finished adapting to the destination-side break that happened in October. From here forward, recovery requires fixing the listings; cheaper bids alone won't pull the floor back up.",
    metric: { label: "GE_UAC_High_Intent Click→Install", before: "22.4%", after: "12.9%", delta: "-9.5 pp" },
    severity: "critical",
    phase: "Phase 3",
    chart: { kind: "cliffCi" },
  },
  {
    id: "rs19-era",
    date: "2025-12-01",
    dateLabel: "Dec 2025",
    category: "pricing",
    title: "₹19 era begins",
    short: "Trial price moves to ₹19. Paid trial rate barely moves; organic falls to 3.98% (from 5.71%).",
    detail:
      "The ₹19 era begins. Paid trial rate on Meta and Google moves by less than 2 percentage points across all price changes from ₹2 up to ₹29. Only the ₹49 test (later) breaks the bid algorithm's elasticity buffer. Organic users, who have no bid algorithm working for them, see trial rate fall to 3.98% — a 30% drop from the ₹4 baseline.",
    rationale:
      "Trial price was increased to test the upper bound of bid-algorithm elasticity. The hypothesis was that paid acquisition would absorb the price hike (it did — paid trial rate barely moved) while organic users, who have no bid algorithm working for them, would feel it. The hypothesis confirmed: organic dropped from 5.71% to 3.98%, paid stayed within 2pp of baseline. That asymmetry is the central lesson — paid CAC is buffered against pricing changes by the auction layer, but organic conversion is not, so any decision to lift price has to budget explicitly for the organic hit.",
    bullets: [
      "Meta paid trial rate: 10.55% (vs 10.19% baseline)",
      "Google paid trial rate: 7.39% (vs 7.70% baseline)",
      "Organic trial rate: 3.98% (vs 5.71% baseline)",
      "Bid algorithms are doing their job — organic isn't",
    ],
    metric: { label: "Organic trial rate", before: "5.71%", after: "3.98%", delta: "-30%" },
    severity: "medium",
    phase: "Phase 4",
    chart: { kind: "trialRegime", highlight: "₹19 era" },
  },
  {
    id: "legacy-meta-ends",
    date: "2026-01-26",
    dateLabel: "26 Jan 2026",
    category: "portfolio",
    title: "Last legacy Meta workhorse winds down",
    short: "GE_FB_NA_AppPromo(PaymentSucess)_India_45583 ends. The 4-campaign cohort that drove ₹1.22 Cr at ₹11 CPI is gone.",
    detail:
      "Of all 88 Meta campaigns active in the window, exactly zero were active in both Q2 2025 and Q2 2026. The portfolio turned over completely. The four legacy workhorses — GE_FB_NA_AppPromo(PaymentSucess)_India_45583 (₹62.0L), GE_FB_NA_AppPromo(PaymentSucess)-AAA_India_09Dec24 (₹29.4L), Adv_PS_28/8/24 Campaign (₹22.2L), Apppromo_manual_20/1/25 (₹8.6L) — that drove Q2 2025 spend at ₹10–11 CPI all wound down by January 2026. The team killed the workhorses and replaced them with structurally higher-cost campaigns.",
    rationale:
      "The Meta team had been rolling out a new portfolio strategy organised around vernacular-language, Tier1, and Tier2 campaign archetypes. The wind-down of the legacy templates is the natural endpoint of that transition — once the new structure is fully populated, the old generic AppPromo campaigns get retired. The decision was strategic, not performance-driven; from inside the team's frame the legacy templates had been replaced by the better-segmented portfolio. From the CAC perspective, though, the new portfolio inherits the broken store funnel and starts at much higher CPI, so the rotation amplifies the destination-side damage rather than offsetting it.",
    metric: { label: "Legacy CPI cohort", before: "₹10–11", after: "ended", delta: "all gone" },
    severity: "high",
    phase: "Phase 3",
    chart: { kind: "metaPortfolio" },
  },
  {
    id: "google-canonical-flip",
    date: "2026-02-01",
    dateLabel: "Feb 2026",
    category: "data",
    title: "Google reconcile breaks — falsification trigger",
    short: "Google first_open over-counts backend by +20.2%. Crosses the 20% falsification threshold; canonical flips to backend.",
    detail:
      "From May 2025 through January 2026, the Google platform's 'first_open' count agreed with the backend Google install count to within ~7% every month — well within tolerance. Starting February 2026, the gap suddenly opens to +20% to +25% and stays there. This crosses the 20% threshold our analysis plan set as a falsification trigger. The implication is straightforward: for analyses covering the period through January 2026, Google's first_open is the canonical install count. From February 2026 onwards, we use the backend Google install count as canonical and treat first_open as a secondary cross-check.",
    rationale:
      "Same shape as the Meta attribution flip in August 2025: a backend attribution methodology change opened a sustained gap with the platform's count. Without an independent third-party MMP feed (Singular cuts off two months later), there is no tie-breaker to tell us which side is closer to ground truth. The conservative response is to switch the canonical install count to the backend for any window after the break, and explicitly flag any analysis that crosses February 2026 as having reduced attribution confidence. This is a measurement event, not a marketing-performance event.",
    metric: { label: "Google reconcile gap", before: "+5.5%", after: "+20.2%", delta: "crosses threshold" },
    severity: "medium",
    phase: "Phase 1",
    chart: { kind: "googleReconcile" },
  },
  {
    id: "rs49-test",
    date: "2026-02-25",
    dateLabel: "Late Feb 2026",
    category: "pricing",
    title: "₹49 test breaks the bid-algorithm buffer",
    short: "First and only price level to break paid trial-rate elasticity. Meta dropped 3pp around the test.",
    detail:
      "The ₹49 test in late February 2026 is the only price level that breaks the bid-algorithm elasticity buffer. Meta paid trial rate drops 3 percentage points around the test — the only meaningful paid trial-rate hit all year. This sets the upper bound: do not test trial prices above ₹29. If a higher price is desired strategically, plan for a paid trial-rate hit and budget for it.",
    rationale:
      "₹49 is roughly 12× the original ₹4 baseline — a deliberate stress test to find the elastic limit of paid acquisition. Up to ₹29 the bid algorithm could still find willing buyers at a tolerable cost without sacrificing trial rate, because the paid funnel is mostly insulated by smart bidding. At ₹49 the population of users willing to convert at that price-point shrinks past what the algorithm can compensate for, and trial rate finally cracks. This is the experimental confirmation of where the paid-side elasticity buffer ends.",
    bullets: [
      "All ₹2–₹29 changes: paid trial rate moves <2pp",
      "₹49 test: Meta paid trial rate drops 3pp",
      "Recovery action: lock the trial price at ≤ ₹29 (Step 4)",
    ],
    metric: { label: "Meta paid trial rate", before: "~10%", after: "~7%", delta: "-3 pp" },
    severity: "medium",
    phase: "Phase 4",
    chart: { kind: "trialRegime", highlight: "₹29 era" },
  },
  {
    id: "tier-launches",
    date: "2026-03-01",
    dateLabel: "Mar 2026",
    category: "portfolio",
    title: "New Meta portfolio launches at ₹50+ CPI",
    short: "Tier1, Tier2, Vernacular, InfluencerCampaign launches. They inherit the broken store funnel.",
    detail:
      "In Q2 2026 the Meta portfolio is twenty new campaigns, mostly Tier1/Tier2 launches and vernacular language campaigns introduced in March 2026, plus one InfluencerCampaign. They run at ₹50 to ₹62 CPI — roughly five times the legacy CAC. Each new generation of campaigns starts at a lower Click-to-Install than the prior generation finished at. New Tier1 and Tier2 campaigns launching in March 2026 launch at 20–22% Click-to-Install. The legacy starting points were 49–55%.",
    rationale:
      "These campaigns are not inherently worse — they inherited a broken store funnel. By the time the Meta team launched the new portfolio, the keyword-listing wave had already pulled store CR down by half, and any new campaign routing traffic to the same Play Store now starts at the post-cliff conversion floor. The high CPI is therefore the destination-side problem expressed through new creative, not a creative-quality regression. This is why the recovery plan has the listing repair (Step 1) gating the legacy-template re-launch (Step 3): you can't tell whether new campaigns are good or bad until the storefront isn't suppressing them.",
    bullets: [
      "Tier1_Mar26 launches at 22% Click-to-Install",
      "Tier2_Mar26 launches at 21% Click-to-Install",
      "Vernacular_Hindi_Mar26 launches at 20% Click-to-Install",
      "Recovery action: re-launch legacy templates against fixed listing (Step 3)",
    ],
    metric: { label: "New cohort CPI", before: "~₹11 (legacy)", after: "₹50–62", delta: "5×" },
    severity: "high",
    phase: "Phase 3",
    chart: { kind: "metaPortfolio" },
  },
  {
    id: "rs19-returns",
    date: "2026-03-15",
    dateLabel: "Mar – Apr 2026",
    category: "diagnosis",
    title: "Organic doesn't recover when ₹19 returns",
    short: "Same price as Dec 2025 (₹19), but organic trial rate is 1.33% — a third of what it was. Destination-side, not pricing.",
    detail:
      "Organic trial rate during the original ₹19 era (December 2025) was 3.98%. Organic trial rate during the '₹19 returns' regime in March-April 2026 was 1.33% — at the same price. Something other than price was damaging organic users over time. We resolved this in Phase 5: organic install volume actually grew 2.4× across the same window (2,737/day → 6,693/day), so the channel was attracting more, lower-intent users from the keyword listing wave — a destination-side mechanism, not a pricing one. Returning to a lower trial price will not on its own fix this; the listing portfolio has to be repaired first.",
    rationale:
      "Same price, same product, but the composition of the organic channel changed. The keyword-listing wave that started in October pulled in 2.4× the organic install volume, but the new arrivals are searching on broad English-learning keywords rather than branded SpeakX terms — a fundamentally lower-intent population. Trial rate falls because the denominator is now full of users who would never have shown up under the old, narrower listing strategy. This is the cleanest single proof point that the CAC story is destination-side: hold price constant, vary only the storefront, and watch the funnel collapse.",
    metric: { label: "Organic trial rate at ₹19", before: "3.98%", after: "1.33%", delta: "-67% (same price)" },
    severity: "high",
    phase: "Phase 5",
    chart: { kind: "trialRegime", highlight: "₹19 returns" },
  },
  {
    id: "singular-cutoff",
    date: "2026-04-01",
    dateLabel: "1 Apr 2026",
    category: "data",
    title: "Singular MMP data cuts off",
    short: "28 days of Q2 2026 lack independent attribution validation. Re-pull is on the recovery list (Step 8).",
    detail:
      "Singular cuts off 1 April 2026, which leaves 28 days of Q2 2026 without independent attribution validation. Phase 1 also flagged that platform Google first_open over-counts vs backend by 20–25% in February-April 2026 — a divergence we cannot fully diagnose without Singular as a tie-breaker. Recovery Step 8: re-pull Singular for 1 April – 28 April 2026, run the Phase 1 reconciliation again, and either confirm the dual-denominator rule or reverse it.",
    rationale:
      "Singular is SpeakX's third-party MMP, which serves as the independent referee whenever Meta and Google disagree with the backend. The data feed contract reached its term and the export was not extended in time, so the last 28 days of the analysis window have no MMP cross-check. This is purely a contractual / data-pipeline event with no underlying marketing cause, but it constrains how confidently we can read the final month of numbers — which is exactly when the Google reconcile gap is widest.",
    severity: "low",
    phase: "Phase 1",
  },
  {
    id: "window-end",
    date: "2026-04-28",
    dateLabel: "28 Apr 2026",
    category: "milestone",
    title: "Analysis window closes — the bill",
    short: "Meta CPI ₹56.55 (5.16×). Google CPI ₹61.44 (3.96×). Google CPT ₹1,084 (5.16×). Recovery clock starts.",
    detail:
      "The 12-month window closes. Blended Customer Acquisition Cost on Meta and Google has risen roughly five-fold. Three independent measurements (Meta Click-to-Install, Google Click-to-Install, Play Console store CR) lost roughly the same fraction over the same window, and the biggest single-quarter drop is Q3-to-Q4 2025 — the same quarter Phase 5 pinpoints as the start of the cliff. The diagnosis is destination-side: the store-listing portfolio's collapse is the single largest contributor (47% of Meta ΔCPI, 74% of Google ΔCPI). Pricing is third in importance. The Meta portfolio rotation made things worse, not better.",
    rationale:
      "The 12-month analysis window closes here by design — it was scoped to give a full-year view of the CAC trajectory and to bracket every regime change (pricing, listing, portfolio) inside one comparable frame. The five-fold CAC rise is the cumulative effect of three compounding causes (listing collapse, portfolio rotation away from legacy, pricing tests) plus the silent destination-side drift of the constant-price window. Closing the window starts the recovery clock: from this date, Step 1 (listing rollback) is the highest-leverage move and the rest of the recovery plan sequences off of it.",
    bullets: [
      "Meta CPI: ₹10.95 → ₹56.55 (5.16×)",
      "Google CPI: ₹15.52 → ₹61.44 (3.96×)",
      "Meta CPP: ₹139 → ₹581 (4.17×)",
      "Google CPT: ₹210 → ₹1,084 (5.16×)",
      "Theoretical recovery if listing repair lands fully: Meta CPI → ₹22, Google CPI → ₹20",
    ],
    metric: { label: "Meta CPI", before: "₹10.95", after: "₹56.55", delta: "5.16×" },
    severity: "critical",
    phase: "Window close",
    chart: { kind: "windowSummary" },
  },
];
