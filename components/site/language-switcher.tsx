"use client";

import { useI18n } from "@/lib/i18n/context";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="text-sm font-medium text-ink/70 hover:text-gold transition-colors px-2 py-1"
      aria-label="Switch language"
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}
