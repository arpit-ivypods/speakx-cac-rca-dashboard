import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  asoSeries,
  cliffSeries,
  googleReconcile,
  pureWindowCpi,
  trialRateRegime,
  kpis,
} from "@/data/cac";
import type { ChartSpec } from "@/data/timeline";

const COL = {
  rose: "#F4A6A6",
  roseDeep: "#D88080",
  mint: "#9FD8B6",
  mintDeep: "#5FB286",
  sky: "#9DC5E8",
  skyDeep: "#5C95C4",
  lav: "#C5B4E3",
  lavDeep: "#8E76C4",
  peach: "#F8C896",
  peachDeep: "#D69653",
  sand: "#E8DCC4",
  sandDeep: "#B59B6A",
  grid: "#EAE3D2",
  ink: "#475569",
};

const tickFont = { fill: COL.ink, fontSize: 10 };

export function EventChart({ spec }: { spec: ChartSpec }) {
  switch (spec.kind) {
    case "asoCr": {
      const sliced = asoSeries.filter((_, i) => i % 2 === 0); // less density
      return (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={sliced} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={tickFont} interval={5} axisLine={false} tickLine={false} />
            <YAxis tick={tickFont} unit="%" domain={[10, 40]} axisLine={false} tickLine={false} />
            <Tooltip />
            <ReferenceArea x1="10-24" fill={COL.rose} fillOpacity={0.12} />
            <ReferenceLine x="10-24" stroke={COL.roseDeep} strokeWidth={2} label={{ value: "27-keyword listing", fontSize: 10, fill: COL.roseDeep, position: "top" }} />
            <Line type="monotone" dataKey="rolling" stroke={COL.roseDeep} strokeWidth={2.5} dot={false} name="14-day rolling" isAnimationActive />
            <Line type="monotone" dataKey="cr" stroke={COL.rose} strokeWidth={0} dot={{ r: 1.5, fill: COL.rose }} name="Daily" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    case "cliffCi":
      return (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={cliffSeries} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="ci-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COL.skyDeep} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COL.sky} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={tickFont} axisLine={false} tickLine={false} />
            <YAxis tick={tickFont} unit="%" axisLine={false} tickLine={false} domain={[0, 50]} />
            <Tooltip />
            <ReferenceArea x1="Oct 25" x2="Dec 25" fill={COL.peach} fillOpacity={0.18} />
            <Area type="monotone" dataKey="click2install" stroke={COL.skyDeep} strokeWidth={2.5} fill="url(#ci-grad)" name="Click→Install" />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "cliffCpi":
      return (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={cliffSeries} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="cpi-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COL.roseDeep} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COL.rose} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={tickFont} axisLine={false} tickLine={false} />
            <YAxis tick={tickFont} unit="₹" axisLine={false} tickLine={false} />
            <Tooltip />
            <ReferenceArea x1="Oct 25" x2="Dec 25" fill={COL.peach} fillOpacity={0.18} />
            <Area type="monotone" dataKey="cpi" stroke={COL.roseDeep} strokeWidth={2.5} fill="url(#cpi-grad)" name="CPI" />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "trialRegime":
      return (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trialRateRegime} margin={{ top: 8, right: 12, left: 0, bottom: 8 }} barSize={14}>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="regime" tick={tickFont} axisLine={false} tickLine={false} />
            <YAxis tick={tickFont} unit="%" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
            <ReferenceArea x1={spec.highlight} x2={spec.highlight} fill={COL.lav} fillOpacity={0.18} />
            <Bar dataKey="meta" fill={COL.lav} name="Meta" radius={[4, 4, 0, 0]} />
            <Bar dataKey="google" fill={COL.sky} name="Google" radius={[4, 4, 0, 0]} />
            <Bar dataKey="organic" fill={COL.rose} name="Organic" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "googleReconcile":
      return (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={googleReconcile} margin={{ top: 8, right: 36, left: 0, bottom: 8 }}>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={tickFont} axisLine={false} tickLine={false} />
            <YAxis yAxisId="counts" tick={tickFont} axisLine={false} tickLine={false} />
            <YAxis yAxisId="gap" orientation="right" tick={tickFont} unit="%" domain={[0, 30]} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
            <Bar yAxisId="counts" dataKey="first_open" fill={COL.sky} name="first_open" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="counts" dataKey="backend" fill={COL.lav} name="backend" radius={[3, 3, 0, 0]} />
            <ReferenceLine yAxisId="gap" y={20} stroke={COL.roseDeep} strokeDasharray="4 4" label={{ value: "20% threshold", fontSize: 9, fill: COL.roseDeep, position: "right" }} />
            <Line yAxisId="gap" type="monotone" dataKey="gap" stroke={COL.roseDeep} strokeWidth={2.5} dot={{ r: 3 }} name="Gap (%)" />
          </ComposedChart>
        </ResponsiveContainer>
      );

    case "metaPortfolio": {
      const data = [
        { cohort: "Q2 2025\nlegacy", cpi: 11, fill: COL.mint },
        { cohort: "Q2 2026\nnew launches", cpi: 56, fill: COL.rose },
      ];
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 24 }} barSize={56}>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="cohort" tick={{ fill: COL.ink, fontSize: 11 }} axisLine={false} tickLine={false} interval={0} height={36} />
            <YAxis tick={tickFont} unit="₹" axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="cpi" name="CPI" radius={[8, 8, 0, 0]}>
              {data.map((d, i) => (
                <text key={i} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    case "uacZeroTrials": {
      // Funnel: spend → first_open → conversion_event (activated trialer); payment_success is owned by other campaigns
      const data = [
        { metric: "Spend",                  value: 100, label: "₹3.26 Cr",  fill: COL.rose },
        { metric: "first_open (installs)",  value: 100, label: "816,510",  fill: COL.peach },
        { metric: "conversion_event",       value: 5.86, label: "47,860 activated trialers · ₹680 each", fill: COL.mint },
        { metric: "payment_success",        value: 0,   label: "0 (owned by other campaigns)", fill: COL.sand },
      ];
      return (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 90, left: 110, bottom: 8 }} barSize={26}>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={tickFont} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
            <YAxis dataKey="metric" type="category" tick={{ fill: COL.ink, fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip formatter={(_v: any, _n: any, p: any) => [p.payload.label, p.payload.metric]} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} label={{ position: "right", fill: COL.ink, fontSize: 10, formatter: (v: any) => `${v}%` }} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    case "constantPriceCpi":
      return (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={pureWindowCpi} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="meta-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COL.lavDeep} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COL.lav} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="goog-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COL.skyDeep} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COL.sky} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={tickFont} axisLine={false} tickLine={false} />
            <YAxis tick={tickFont} unit="₹" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
            <Area type="monotone" dataKey="meta" stroke={COL.lavDeep} strokeWidth={2.5} fill="url(#meta-grad)" name="Meta CPI" />
            <Area type="monotone" dataKey="google" stroke={COL.skyDeep} strokeWidth={2.5} fill="url(#goog-grad)" name="Google CPI" />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "windowSummary": {
      const data = [
        { metric: "Meta CPI",   start: kpis.metaCpi.from,   end: kpis.metaCpi.to },
        { metric: "Google CPI", start: kpis.googleCpi.from, end: kpis.googleCpi.to },
        { metric: "Meta CPP",   start: kpis.metaCpp.from,   end: kpis.metaCpp.to },
        { metric: "Google CPT", start: kpis.googleCpt.from, end: kpis.googleCpt.to },
      ];
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }} barSize={18}>
            <CartesianGrid stroke={COL.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="metric" tick={{ fill: COL.ink, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={tickFont} unit="₹" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
            <Bar dataKey="start" fill={COL.mint} name="Q2 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="end"   fill={COL.rose} name="Q2 2026" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    default:
      return null;
  }
}
