"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import LanguageSwitcher from "./language-switcher";
import { Menu, X, TrendingUp } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/markets", label: t.nav.markets },
    { href: "/news", label: t.nav.news },
    { href: "/recommendations", label: t.nav.recommendations },
    { href: "/analysis", label: t.nav.analysis },
    { href: "/calculators", label: t.nav.calculators },
    { href: "/packages", label: t.nav.packages },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-tight text-ink">
            <TrendingUp className="h-5 w-5 text-gold" strokeWidth={2.5} />
            SFC Capital
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-ink/70 hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-ink hover:text-gold"
                >
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-ink/60 hover:text-loss"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-ink/80 hover:text-ink">
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-gold hover:text-ink transition-colors"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-line py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-ink/80">
                {l.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-line">
              <LanguageSwitcher />
              {session?.user ? (
                <Link href="/dashboard" className="text-sm font-medium">{t.nav.dashboard}</Link>
              ) : (
                <div className="flex gap-4">
                  <Link href="/login" className="text-sm">{t.nav.login}</Link>
                  <Link href="/register" className="text-sm font-medium text-gold">{t.nav.register}</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
