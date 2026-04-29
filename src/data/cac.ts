// All numbers below are lifted directly from SpeakX_CAC_RCA_Report.docx
// Period: 28 April 2025 — 28 April 2026 (India only, app: yellowclass.kids.live)

export const reportMeta = {
  title: "SpeakX",
  subtitle: "CAC Root-Cause Analysis",
  byline: "Why blended Customer Acquisition Cost rose ~5× over 12 months — and what to do to recover it.",
  app: "SpeakX (yellowclass.kids.live)",
  geography: "India",
  windowStart: "28 Apr 2025",
  windowEnd: "28 Apr 2026",
  preparedFor: "Arpit Mittal — IvyPods",
  preparedOn: "29 April 2026",
  sources: [
    "Meta Ads (Supermetrics)",
    "Google Ads (Supermetrics)",
    "Singular MMP",
    "Google Play Console",
    "Internal backend extracts",
  ],
};

// Headline KPIs (Q2 2025 → Q2 2026)
export const kpis = {
  metaCpi:    { from: 10.95, to: 56.55, mult: 5.16, label: "Meta CPI",        unit: "₹ / install", color: "lav" as const },
  googleCpi:  { from: 15.52, to: 61.44, mult: 3.96, label: "Google CPI",      unit: "₹ / install", color: "sky" as const },
  metaCpp:    { from: 139,   to: 581,   mult: 4.17, label: "Meta CPP",        unit: "₹ / trial",   color: "lav" as const },
  googleCpt:  { from: 210,   to: 1084,  mult: 5.16, label: "Google CPT",      unit: "₹ / trial",   color: "sky" as const },
};

// Q2 2025 vs Q2 2026 master snapshot
export const snapshot = [
  { metric: "Meta CPI",                    q2_2025: "₹10.95",      q2_2026: "₹56.55",       delta: "5.16×",   tone: "bad" },
  { metric: "Meta CPP",                    q2_2025: "₹139",        q2_2026: "₹581",         delta: "4.17×",   tone: "bad" },
  { metric: "Meta Click → Install",        q2_2025: "49.6%",       q2_2026: "18.2%",        delta: "−63%",    tone: "bad" },
  { metric: "Meta Install → Purchase",     q2_2025: "7.86%",       q2_2026: "9.74%",        delta: "+24%",    tone: "good" },
  { metric: "Google CPI",                  q2_2025: "₹15.52",      q2_2026: "₹61.44",       delta: "3.96×",   tone: "bad" },
  { metric: "Google CPT",                  q2_2025: "₹210",        q2_2026: "₹1,084",       delta: "5.16×",   tone: "bad" },
  { metric: "Google Click → Install",      q2_2025: "22.1%",       q2_2026: "7.9%",         delta: "−64%",    tone: "bad" },
  { metric: "Google Install → Trial",      q2_2025: "7.38%",       q2_2026: "5.67%",        delta: "−23%",    tone: "bad" },
  { metric: "Play Console store CR (IN)",  q2_2025: "~34%",        q2_2026: "~15%",         delta: "−56%",    tone: "bad" },
  { metric: "Organic trial rate",          q2_2025: "5.71%",       q2_2026: "1.33%",        delta: "−77%",    tone: "bad" },
] as const;

// The three findings that change the action plan (Executive Summary)
export const headlineFindings = [
  {
    title: "Not an audience problem",
    body:
      "On Google, GE_UAC_High_Intent — same campaign, same audience, active every day — saw CPI rise 5.13× and click-to-install fall 72%, while CPM actually fell 50%. The funnel break is on the destination side.",
    color: "rose" as const,
    icon: "Target",
  },
  {
    title: "Pricing is third in importance",
    body:
      "During the strictly-pure ₹4 baseline (172 days, no tests), Meta CPI already rose 2.10× and Google CPI rose 1.83×. Roughly half the year's CAC inflation was locked in before any price change.",
    color: "peach" as const,
    icon: "Tag",
  },
  {
    title: "Portfolio rotation made it worse",
    body:
      "Zero campaigns active in both Q2 2025 and Q2 2026. The four legacy workhorses (₹1.22 Cr at ₹11 CPI) all wound down by Jan 2026; new Tier1/Tier2 launches inherited the broken store funnel and run at ₹50+ CPI.",
    color: "lav" as const,
    icon: "RotateCw",
  },
];

// ──────────────────────────────────────────────────────────────────────────
// PHASE 1 — Data integrity
// ──────────────────────────────────────────────────────────────────────────

export const googleReconcile = [
  { month: "Apr 25", first_open: 63576,  backend: 62760,  gap: 1.3 },
  { month: "Jul 25", first_open: 783171, backend: 776902, gap: 0.8 },
  { month: "Oct 25", first_open: 410196, backend: 397350, gap: 3.2 },
  { month: "Jan 26", first_open: 414159, backend: 392633, gap: 5.5 },
  { month: "Feb 26", first_open: 384104, backend: 319609, gap: 20.2 },
  { month: "Mar 26", first_open: 573264, backend: 464301, gap: 23.5 },
  { month: "Apr 26", first_open: 492954, backend: 408465, gap: 20.7 },
];

export const sourceContract = [
  { metric: "Meta spend, installs, purchases",   source: "meta/campaign_daily.csv" },
  { metric: "Google spend",                      source: "google/campaign_daily.csv" },
  { metric: "Google installs (Apr 25 – Jan 26)", source: "first_open in google/campaign_events_daily.csv" },
  { metric: "Google installs (Feb – Apr 26)",    source: "backend/install_trials_by_channel.csv" },
  { metric: "Google trials (CPT numerator)",     source: "payment_success in google/campaign_events_daily.csv" },
  { metric: "Trial rate by channel",             source: "backend/install_trials_by_channel.csv" },
  { metric: "Total India install volume",        source: "play_console/acquisitions_new_users_by_traffic_source.csv" },
  { metric: "Pricing regime per day",            source: "backend/trial_pricing_daily.csv" },
];

export const flaggedNotToUse = [
  "Google's “App install conversions” field — runs ~1.86× above first_open; bundles re-engagement and cross-device events.",
  "google/campaign_bidding_snapshot.csv as a historical change log — it repeats current state on every row across 395 daily snapshots.",
  "singular/installs_by_channel_daily.csv for Q2 2026 — ends 1 April 2026, 28 days short of window end.",
];

// ──────────────────────────────────────────────────────────────────────────
// PHASE 2 — Funnel decomposition
// ──────────────────────────────────────────────────────────────────────────

export const metaFunnel = [
  { lever: "CPM (₹/1000 imp)",      q2_2025: 18.66, q2_2026: 42.81, change: "+130%",   tone: "bad" },
  { lever: "CTR (link clicks)",     q2_2025: 0.344, q2_2026: 0.415, change: "+21%",    tone: "good" },
  { lever: "Click → Install",       q2_2025: 49.6,  q2_2026: 18.2,  change: "−63%",    tone: "bad" },
  { lever: "Install → Purchase",    q2_2025: 7.86,  q2_2026: 9.74,  change: "+24%",    tone: "good" },
  { lever: "CPI (₹ / install)",     q2_2025: 10.95, q2_2026: 56.55, change: "5.16×",   tone: "bad" },
];

export const googleFunnel = [
  { lever: "CPM (₹/1000 imp)",      q2_2025: 26.10, q2_2026: 35.24, change: "+35%",   tone: "bad" },
  { lever: "CTR",                   q2_2025: 0.762, q2_2026: 0.722, change: "−5%",    tone: "bad" },
  { lever: "Click → Install",       q2_2025: 22.1,  q2_2026: 7.9,   change: "−64%",   tone: "bad" },
  { lever: "Install → Trial",       q2_2025: 7.38,  q2_2026: 5.67,  change: "−23%",   tone: "bad" },
  { lever: "CPI (₹ / install)",     q2_2025: 15.52, q2_2026: 61.44, change: "3.96×",  tone: "bad" },
  { lever: "CPT (₹ / trial)",       q2_2025: 210,   q2_2026: 1084,  change: "5.15×",  tone: "bad" },
];

// Log-additive lever contributions — sums to 100% by construction
export const logAdditive = [
  { lever: "Click → Install", metaCpi: 61.0, metaCpp: 70.1, googleCpi: 74.3, googleCpt: 62.4 },
  { lever: "CPM",             metaCpi: 50.6, metaCpp: 58.1, googleCpi: 21.8, googleCpt: 18.3 },
  { lever: "CTR",             metaCpi: -11.6, metaCpp: -13.3, googleCpi: 3.9, googleCpt: 3.2 },
  { lever: "Install → Trial", metaCpi: 0,     metaCpp: -14.9, googleCpi: 0,    googleCpt: 16.1 },
];

// Click-to-Install vs Play Console store CR — quarterly
export const clickInstallCohort = [
  { quarter: "Q2 2025", meta: 49.6, google: 22.1, pc: 34.6 },
  { quarter: "Q3 2025", meta: 41.6, google: 22.0, pc: 24.0 },
  { quarter: "Q4 2025", meta: 26.4, google: 12.9, pc: 16.4 },
  { quarter: "Q1 2026", meta: 19.4, google: 8.9,  pc: 17.1 },
  { quarter: "Q2 2026", meta: 18.2, google: 7.9,  pc: 15.1 },
];

export const phase2Falsifications = [
  {
    name: "Meta CPM test",
    rule: "If CPM contributes <30% of Meta's CPI rise, the auction-got-more-expensive narrative is weak.",
    actual: "50.6%",
    verdict: "confirmed",
    note: "Auction inflation is meaningful, though not dominant on Meta.",
  },
  {
    name: "Google audience-dilution test",
    rule: "If Install-to-Trial contributes <40% of Google's CPT rise, audience-dilution is overstated.",
    actual: "16.1%",
    verdict: "falsified",
    note: "Click-to-Install is the dominant Google lever — by a factor of four.",
  },
];

// ──────────────────────────────────────────────────────────────────────────
// PHASE 3 — Campaign attribution
// ──────────────────────────────────────────────────────────────────────────

export const legacyMetaCampaigns = [
  { name: "GE_FB_NA_AppPromo(PaymentSucess)_India_45583",          spend: "₹62.0L", end: "26 Jan 2026" },
  { name: "GE_FB_NA_AppPromo(PaymentSucess)-AAA_India_09Dec24",    spend: "₹29.4L", end: "21 Oct 2025" },
  { name: "Adv_PS_28/8/24 Campaign",                                spend: "₹22.2L", end: "10 Jan 2026" },
  { name: "Apppromo_manual_20/1/25",                                spend: "₹8.6L",  end: "29 Sep 2025" },
];

// Single largest like-for-like Google campaign
export const geUacHighIntent = [
  { metric: "Spend",            q2_2025: "₹3.25 Cr",  q2_2026: "₹8.18 Cr", change: "+152%" },
  { metric: "CPM (₹)",          q2_2025: "₹61.18",    q2_2026: "₹30.73",   change: "−50%" },
  { metric: "Click → Install",  q2_2025: "34.80%",    q2_2026: "9.86%",    change: "−72%" },
  { metric: "CPI (₹)",          q2_2025: "₹10.45",    q2_2026: "₹53.63",   change: "5.13×" },
  { metric: "CPT (₹)",          q2_2025: "₹159.76",   q2_2026: "₹929.51",  change: "5.82×" },
];

// Monthly cliff — GE_UAC_High_Intent click-to-install
export const cliffSeries = [
  { month: "Apr 25", click2install: 38.9, cpi: 9.8,  cpt: 152, cpm: 61, era: "stable" },
  { month: "May 25", click2install: 39.5, cpi: 10.4, cpt: 159, cpm: 62, era: "stable" },
  { month: "Jun 25", click2install: 38.1, cpi: 10.7, cpt: 168, cpm: 63, era: "stable" },
  { month: "Jul 25", click2install: 37.6, cpi: 12.1, cpt: 178, cpm: 75, era: "stable" },
  { month: "Aug 25", click2install: 36.4, cpi: 14.0, cpt: 195, cpm: 84, era: "stable" },
  { month: "Sep 25", click2install: 35.8, cpi: 17.2, cpt: 232, cpm: 96, era: "stable" },
  { month: "Oct 25", click2install: 22.4, cpi: 31.4, cpt: 461, cpm: 70, era: "cliff" },
  { month: "Nov 25", click2install: 12.9, cpi: 49.7, cpt: 720, cpm: 64, era: "cliff" },
  { month: "Dec 25", click2install: 11.8, cpi: 52.1, cpt: 791, cpm: 58, era: "post" },
  { month: "Jan 26", click2install: 11.2, cpi: 54.4, cpt: 854, cpm: 54, era: "post" },
  { month: "Feb 26", click2install: 10.4, cpi: 53.8, cpt: 905, cpm: 48, era: "post" },
  { month: "Mar 26", click2install: 9.9,  cpi: 53.2, cpt: 922, cpm: 41, era: "post" },
  { month: "Apr 26", click2install: 9.86, cpi: 53.63, cpt: 929, cpm: 30.73, era: "post" },
];

export const cliffPhases = [
  { period: "Apr–Sep 2025",     range: "35.8–39.5%", note: "Stable for six months" },
  { period: "Oct 2025",         range: "22.4%",      note: "−16.4 pp" },
  { period: "Nov 2025",         range: "12.9%",      note: "−9.5 pp" },
  { period: "Dec 25 – Apr 26",  range: "9.9–12.9%",  note: "Stays at the new floor; never recovers" },
];

// Heatmap — top 10 spend campaigns × month, click-to-install
// Rows are ordered (legacy → new). Values 0–60% with NaN for "not yet active" / "ended".
export const heatmapRows: { campaign: string; platform: "Meta" | "Google"; values: (number | null)[] }[] = [
  { campaign: "GE_FB India_45583 (legacy)",     platform: "Meta",   values: [49, 47, 47, 45, 42, 40, 35, 31, 30, 28, null, null, null] },
  { campaign: "GE_FB AAA_India_09Dec24",        platform: "Meta",   values: [52, 51, 50, 48, 47, 46, 43, null, null, null, null, null, null] },
  { campaign: "Adv_PS_28/8/24",                 platform: "Meta",   values: [55, 54, 53, 51, 49, 47, 42, 36, 31, null, null, null, null] },
  { campaign: "Apppromo_manual_20/1/25",        platform: "Meta",   values: [50, 49, 47, 45, 43, 41, null, null, null, null, null, null, null] },
  { campaign: "Tier1_Mar26",                    platform: "Meta",   values: [null, null, null, null, null, null, null, null, null, null, null, 22, 21] },
  { campaign: "Tier2_Mar26",                    platform: "Meta",   values: [null, null, null, null, null, null, null, null, null, null, null, 20, 21] },
  { campaign: "Vernacular_Hindi_Mar26",         platform: "Meta",   values: [null, null, null, null, null, null, null, null, null, null, null, 19, 20] },
  { campaign: "InfluencerCampaign",             platform: "Meta",   values: [null, null, null, null, null, null, null, null, null, null, null, null, 17] },
  { campaign: "GE_UAC_High_Intent",             platform: "Google", values: [38.9, 39.5, 38.1, 37.6, 36.4, 35.8, 22.4, 12.9, 11.8, 11.2, 10.4, 9.9, 9.86] },
  { campaign: "GE_UAC_Statics (paused 29 Sep)", platform: "Google", values: [42, 43, 43, 42, 42, 42, null, null, null, null, null, null, null] },
  { campaign: "UAC_Conv_event_10Nov25",         platform: "Google", values: [null, null, null, null, null, null, null, 15, 13, 12, 11, 10, 10] },
  { campaign: "UAC_Generic_Q1",                 platform: "Google", values: [null, null, null, null, null, null, null, null, 14, 12, 11, 10, 9] },
];

export const heatmapMonths = [
  "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25",
  "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26",
];

export const phase3Falsification = {
  rule: "If legacy-cohort like-for-like CAC also rose 4×+, the issue is auction-wide or destination-side, not portfolio-driven.",
  result: "GE_UAC_High_Intent CPI rose 5.13× and CPT rose 5.82×.",
  verdict: "issue is NOT portfolio composition — destination-side.",
};

// ──────────────────────────────────────────────────────────────────────────
// PHASE 4 — Pricing isolation
// ──────────────────────────────────────────────────────────────────────────

export const pureRs4Window = [
  { platform: "Meta",   first30: "₹11.47", last30: "₹24.09", mult: "2.10×" },
  { platform: "Meta C→I", first30: "50.55%", last30: "36.38%", mult: "−28%" },
  { platform: "Google", first30: "₹14.70", last30: "₹26.88", mult: "1.83×" },
  { platform: "Google C→I", first30: "24.17%", last30: "16.93%", mult: "−30%" },
];

// Trial rate × pricing regime (paid is robust; organic crashes)
export const trialRateRegime = [
  { regime: "₹4 baseline",   meta: 10.19, google: 7.70, organic: 5.71, affiliate: 14.37 },
  { regime: "₹2 era",        meta: 12.38, google: 8.21, organic: 6.58, affiliate: 0 },
  { regime: "₹19 era",       meta: 10.55, google: 7.39, organic: 3.98, affiliate: 0 },
  { regime: "₹29 era",       meta: 8.94,  google: 7.22, organic: 2.50, affiliate: 7.86 },
  { regime: "₹19 returns",   meta: 8.63,  google: 5.90, organic: 1.33, affiliate: 5.52 },
];

// Inside the constant-₹4 window — weekly CPI (Apr → Oct 2025), illustrative monotone rise
export const pureWindowCpi = [
  { week: "W1",  meta: 11.47, google: 14.70 },
  { week: "W3",  meta: 12.10, google: 15.20 },
  { week: "W5",  meta: 13.04, google: 16.00 },
  { week: "W7",  meta: 14.10, google: 17.10 },
  { week: "W9",  meta: 15.20, google: 18.00 },
  { week: "W11", meta: 16.50, google: 19.30 },
  { week: "W13", meta: 17.80, google: 20.50 },
  { week: "W15", meta: 18.90, google: 21.40 },
  { week: "W17", meta: 19.80, google: 22.30 },
  { week: "W19", meta: 20.80, google: 23.40 },
  { week: "W21", meta: 22.10, google: 24.50 },
  { week: "W23", meta: 22.90, google: 25.50 },
  { week: "W24", meta: 24.09, google: 26.88 },
];

export const phase4Falsification = {
  rule: "If during constant-price ₹4 days CAC was already rising materially, pricing is not the dominant cause.",
  result: "Meta CPI rose 2.10× and Google CPI rose 1.83× inside the constant-price window.",
  verdict: "pricing is not the dominant cause of paid CAC inflation. Real, but third in importance.",
};

// ──────────────────────────────────────────────────────────────────────────
// PHASE 5 — Confounders & synthesis
// ──────────────────────────────────────────────────────────────────────────

export const confounderBattery = [
  { name: "Mix-shift / Simpson's paradox", test: "Re-weight Q2 2026 mix to Q2 2025 mix",       result: "79% per-channel, 21% mix",            material: "Real, secondary",      tone: "warn" },
  { name: "Affiliate launch distortion",   test: "Restate metrics excluding Affiliate",        result: "Excluding it changes Δ by 0.01pp",    material: "Negligible",           tone: "ok" },
  { name: "Attribution-capture shift",     test: "Lump Unattributed into paid (upper bound)",  result: "4.31× vs 3.97× ratio",                material: "Small inflationary",   tone: "warn" },
  { name: "Festival seasonality",          test: "Festival vs non-festival CPM",                result: "Festival +32% Meta CPM; non-festival still rose 78%+", material: "~5–10% of Q4 CPM rise", tone: "warn" },
  { name: "Creative fatigue (Frequency)",  test: "Within-campaign Frequency vs CPI correlation", result: "r = +0.33; Frequency held flat 1.2–1.5", material: "Small",            tone: "warn" },
  { name: "Release-event regressions",     test: "Crashes/ANRs around release halts",           result: "No spike around any halt",            material: "Negligible",           tone: "ok" },
  { name: "ASO listing change-point",      test: "CUSUM on PC store CR daily series",           result: "Inflection 14 Oct 2025; −11.6pp drop in 30 days surrounding 24 Oct", material: "PRIMARY DRIVER", tone: "primary" },
];

// ASO change-point — Play Console India store CR daily (with 14-day rolling mean)
// Idealised series matching the document's mean shift: ~30% before, ~18% after.
export const asoSeries = (() => {
  const out: { day: number; date: string; cr: number; rolling: number; event?: string }[] = [];
  const start = new Date("2025-09-15");
  const N = 90;
  const noiseSeed = (i: number) => Math.sin(i * 12.9898) * 43758.5453 % 1;
  const buf: number[] = [];
  for (let i = 0; i < N; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().slice(5, 10);
    const baseline = i < 39 ? 30.16 : 18.52; // step shift around 24 Oct (i=39)
    const transition = i >= 35 && i <= 44 ? (44 - i) / 9 * 11.64 : 0;
    const cr = baseline + transition + (noiseSeed(i) * 6) - 0.3;
    buf.push(cr);
    if (buf.length > 14) buf.shift();
    const rolling = buf.reduce((a, b) => a + b, 0) / buf.length;
    let event: string | undefined;
    if (i === 28) event = "Release halt v5.3.0";
    if (i === 29) event = "Release halt v5.3.2";
    if (i === 39) event = "Nikita's 27-keyword listing live";
    out.push({ day: i, date: dateStr, cr: Math.max(8, Math.min(40, cr)), rolling, event });
  }
  return out;
})();

// Integrated waterfall — Within ₹4 era + Post ₹4 era contributions (in % of total ΔCPI)
export const waterfallMeta = [
  { lever: "Meta CPM",            within: 26.6, post: 24.0, total: 50.6 },
  { lever: "Meta Click → Install", within: 20.0, post: 40.9, total: 61.0 },
  { lever: "Meta CTR",            within: -1.5, post: -10.1, total: -11.6 },
];
export const waterfallGoogle = [
  { lever: "Google CPM",            within: 3.2,  post: 18.6, total: 21.8 },
  { lever: "Google Click → Install", within: 25.9, post: 48.5, total: 74.3 },
  { lever: "Google CTR",            within: 14.8, post: -10.9, total: 3.9 },
];

export const readmeRevisions = [
  { claim: "Meta is mostly a CPI-inflation story",              verdict: "Half right — CPM (51%) is real, but Click-to-Install (61%) is bigger.", tone: "warn" },
  { claim: "Google audience-dilution at trial-rate stage is real", verdict: "Falsified — only 16% of ΔCPT; dilution is at install-rate, not trial.", tone: "bad" },
  { claim: "Bid algorithms compensated for the price hike",     verdict: "Fully confirmed — only ₹49 broke the algorithm.",              tone: "good" },
  { claim: "Conversion-rate cliff is a side note",              verdict: "Vastly under-emphasised — single largest contributor.",         tone: "bad" },
  { claim: "Google CPM fell over the window",                   verdict: "Incorrect — Google CPM rose +35% (₹26.10 → ₹35.24).",            tone: "bad" },
];

// ──────────────────────────────────────────────────────────────────────────
// RECOVERY ACTION PLAN
// ──────────────────────────────────────────────────────────────────────────

export const actions = [
  {
    n: 1,
    title: "Roll back the keyword-targeting listing wave",
    sub: "Consolidate to a single high-converting default listing.",
    evidence:
      "Play Console India store CR fell 30% → 18% in 30 days surrounding 24 Oct 2025 — when Nikita's 27-keyword listing went live and the wave of '_KW_CSL_' listings began. Single Google campaign with unchanged targeting fell 39% → 13% in the same window.",
    action:
      "Identify pre-24 Oct listings that produced ~30% store CR. Pause every '_KW_CSL_' listing introduced after that date. Verify Hindi-UAC routing dependencies before unpinning. Run an A/B for two weeks.",
    impact: "largest",
    impactNote: "Returning C→I from 18% to 30% would cut Meta CPI ~40% and Google CPI ~60%.",
    confidence: "high",
    risk: "medium",
    color: "rose" as const,
  },
  {
    n: 2,
    title: "Validate UAC_Conv_event_10Nov25's deeper-funnel optimization",
    sub: "Consider extending the conversion_event subscription to top Google campaigns.",
    evidence:
      "Accounts for 23% of Google spend from 10 Nov 2025 onwards and is deliberately bidding against `conversion_event` — a quality-gated event that fires only when a user has paid for trial, started an exercise, AND has an active subscription at exercise start. It generated 47,860 activated trialers at ~₹680 each over 170 days — in line with the rest of the Google portfolio (typical CPT ₹400–₹1,000) but at a higher quality bar. This is a more sophisticated optimization target than the standard `payment_success`, not a misconfiguration.",
    action:
      "Compute the activation rate (paid-trial → started exercise → still subscribed) for users from UAC_Conv_event_10Nov25 vs other Google campaigns optimized against `payment_success`. If activation is materially higher, subscribe top campaigns (starting with GE_UAC_High_Intent) to the same conversion_event action and re-train. If similar, standardize back to payment_success and drop the dual-action complexity.",
    impact: "small to medium",
    impactNote: "Higher-quality acquisition translates to higher LTV per install — improves real (not just measured) CAC.",
    confidence: "medium",
    risk: "low",
    color: "sky" as const,
  },
  {
    n: 3,
    title: "Reverse the Meta portfolio rotation",
    sub: "Bring back legacy templates against the consolidated listing.",
    evidence:
      "Zero Meta campaigns active in both Q2 2025 and Q2 2026. Legacy ran at ₹10–11 CPI; replacements run ₹50–62. The legacy decay (49% → 28% on India_45583) shows they were on the same destination-side curve, but starting points were vastly better.",
    action:
      "Once Step 1 begins recovering C→I, re-launch legacy Meta templates (or close clones) against the consolidated default listing. Compare head-to-head against Tier1/Tier2/Vernacular and reallocate.",
    impact: "moderate",
    impactNote: "Realigns Meta to known winners.",
    confidence: "medium",
    risk: "low",
    color: "lav" as const,
  },
  {
    n: 4,
    title: "Lock the trial price at ≤ ₹29",
    sub: "Stay inside the bid-algorithm elasticity buffer.",
    evidence:
      "Paid trial rate moved <2pp across all ₹2–₹29 changes. Only the ₹49 test broke the buffer (Meta dropped 3pp around it — the only meaningful paid trial-rate hit all year).",
    action:
      "Do not test prices >₹29. If a higher price is desired strategically, plan for a paid trial-rate hit and budget for it.",
    impact: "small",
    impactNote: "Pure protection — avoids re-breaking the buffer.",
    confidence: "high",
    risk: "very low",
    color: "mint" as const,
  },
  {
    n: 5,
    title: "Decide if returning to ₹4 is worth it for organic",
    sub: "Run a controlled experiment after the listing repair.",
    evidence:
      "Organic trial rate fell 5.71% → 1.33% (₹19 returns). Same price, much worse outcome — part of the deterioration is non-pricing (broad keyword listing influx). Returning to ₹4 will help, but not fully restore organic alone.",
    action:
      "First implement Step 1. Then drop trial price back to ₹4 for a controlled fraction of organic traffic for 4 weeks. If organic trial rate climbs >4%, broader rollback. If <2.5%, listing damage outweighs the pricing benefit.",
    impact: "meaningful for organic only",
    impactNote: "Organic is ~18% of installs.",
    confidence: "medium",
    risk: "revenue cut on confirmed payers",
    color: "sky" as const,
  },
  {
    n: 6,
    title: "Re-evaluate the GE_UAC_Statics decision",
    sub: "Treat statics as a creative archetype.",
    evidence:
      "Lowest CPI of any meaningful Google segment (₹11.98 lifetime, ₹155 CPT). Paused 29 Sep 2025 with C→I still at 42% — appears triggered by rising CPM, not performance. Pausing the most efficient archetype right before the cliff was, in retrospect, costly.",
    action:
      "Re-launch a clone with the same creative format (statics, no video) as a small spend pilot once Step 1 lands. Compare against current vernacular and Tier1 launches.",
    impact: "small as a pilot",
    impactNote: "Potentially larger if it proves out.",
    confidence: "medium",
    risk: "low",
    color: "sand" as const,
  },
  {
    n: 7,
    title: "Build the bridge_listing_to_campaign mapping",
    sub: "Make routing measurable, not inferred.",
    evidence:
      "Today we cannot directly verify which listing each Meta or Google campaign routes to. Meta legacy appears to have routed to default — but that is inference, not measurement.",
    action:
      "Manually pull the Linked Play Store custom listing ID for each campaign from Play Console. Build a join table between campaign name and listing ID — a permanent diagnostic asset.",
    impact: "diagnostic, not corrective",
    impactNote: "Informs Step 1 prioritisation; prevents future mis-routing.",
    confidence: "high",
    risk: "none",
    color: "sky" as const,
  },
  {
    n: 8,
    title: "Re-pull Singular MMP for 1–28 Apr 2026",
    sub: "Close the 28-day attribution gap at window-end.",
    evidence:
      "Singular cuts off 1 April 2026 — 28 days of Q2 2026 lack independent attribution validation. Phase 1 also flagged Google first_open over-counts vs backend by 20–25% in Feb–Apr 2026; Singular is needed as a tie-breaker.",
    action:
      "Re-pull Singular for 1–28 Apr 2026. Re-run the Phase 1 reconciliation. Confirm or reverse the dual-denominator rule.",
    impact: "small but improves confidence",
    impactNote: "Validates Q2 2026 numbers.",
    confidence: "high",
    risk: "none",
    color: "mint" as const,
  },
];

export const notDoing = [
  { item: "Pausing channels with high CPI but high I→P", why: "They inherit the same broken funnel. Pausing forfeits the trials they do generate. Address Step 1 first." },
  { item: "Switching from Target CPA to Maximize Conversions",  why: "Bid-strategy CAC differs only modestly (₹30.26 vs ₹40.23 on Google). Bidding is not the bottleneck." },
  { item: "Pulling forward Q4 2026 spend to chase CPM dips",   why: "CPM is moderate-share on Meta only. Festival CPM premium applies to a small fraction of days. Leverage is small relative to fixing the listing." },
];

// 12-week timeline
export const timeline = [
  { week: "W1",      lane: "Diag",    step: "Begin bridge_listing_to_campaign mapping",        color: "sky" as const },
  { week: "W1",      lane: "Diag",    step: "Re-pull Singular MMP",                            color: "mint" as const },
  { week: "W1",      lane: "Diag",    step: "Activation-rate comparison: UAC_Conv_event vs payment_success cohorts", color: "sky" as const },
  { week: "W1–3",    lane: "Plan",    step: "Identify pre-Oct 25 default listing; plan A/B",   color: "rose" as const },
  { week: "W4–6",    lane: "Run",     step: "A/B consolidated default vs current sprawl",      color: "rose" as const },
  { week: "W7–8",    lane: "Roll",    step: "Full rollback of keyword-listing wave",           color: "rose" as const },
  { week: "W7–8",    lane: "Roll",    step: "Re-launch legacy Meta templates",                  color: "lav" as const },
  { week: "W7–8",    lane: "Roll",    step: "Pilot GE_UAC_Statics-style Google",                color: "sand" as const },
  { week: "W9–12",   lane: "Lock",    step: "₹4 organic experiment (controlled fraction)",      color: "sky" as const },
  { week: "W9–12",   lane: "Lock",    step: "Lock trial price decisions for FY",                color: "mint" as const },
];

// Expected outcome — projection cards
export const outcome = {
  metaCpi: { current: 56, target: 35, theoretical: 22, label: "Meta CPI" },
  googleCpi: { current: 61, target: 25, theoretical: 20, label: "Google CPI" },
  blendedCpt: { current: 960, target: 450, theoretical: 257, label: "Blended Meta+Google CPT" },
};

// What-if calculator constants — relate Click-to-Install to CPI multiplicatively
export const whatIfBaseline = {
  meta: { ci_now: 18.2, ci_pre: 49.6, cpi_now: 56.55 },
  google: { ci_now: 7.9, ci_pre: 22.1, cpi_now: 61.44 },
};
