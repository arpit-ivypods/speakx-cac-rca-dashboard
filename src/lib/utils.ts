import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(value: number, opts: { decimals?: number } = {}) {
  const { decimals = 2 } = opts;
  if (Number.isNaN(value)) return "—";
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPct(value: number, decimals = 1) {
  if (Number.isNaN(value)) return "—";
  return `${value.toFixed(decimals)}%`;
}

export function formatMultiplier(value: number) {
  return `${value.toFixed(2)}×`;
}

export function formatNum(value: number) {
  return value.toLocaleString("en-IN");
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
