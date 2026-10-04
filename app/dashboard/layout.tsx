import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { LayoutDashboard, Star, Briefcase, Bell, CreditCard, LifeBuoy } from "lucide-react";

const links = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/watchlist", label: "قائمة المتابعة", icon: Star },
  { href: "/dashboard/portfolio", label: "المحفظة", icon: Briefcase },
  { href: "/dashboard/alerts", label: "التنبيهات", icon: Bell },
  { href: "/dashboard/subscription", label: "الاشتراك", icon: CreditCard },
  { href: "/dashboard/support", label: "الدعم الفني", icon: LifeBuoy },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-[220px_1fr] gap-8">
      <aside>
        <div className="mb-6">
          <div className="text-xs text-slate">أهلاً بعودتك</div>
          <div className="font-display text-lg text-ink">{user.name}</div>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-ink/70 hover:bg-paper-dim hover:text-ink whitespace-nowrap"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
