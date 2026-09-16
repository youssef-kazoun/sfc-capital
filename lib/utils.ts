import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arabic currency symbols — Intl outputs the ISO code ("SAR") in some
// environments, so we format the number and append the symbol ourselves
// to keep the UI fully Arabic.
const CURRENCY_SYMBOLS: Record<string, string> = {
  SAR: "ر.س",
  USD: "$",
  EGP: "ج.م",
  AED: "د.إ",
};

export function formatCurrency(value: number, currency = "USD", locale = "ar") {
  if (locale === "ar") {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const num = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return `${num} ${symbol}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function formatDate(value: string | Date, locale = "ar") {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  if (locale === "ar") {
    return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}
