import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";
import { LayoutDashboard, Newspaper, TrendingUp, Users, Settings, LifeBuoy } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/recommendations", label: "Recommendations", icon: TrendingUp },
  { href: "/admin/tickets", label: "Support tickets", icon: LifeBuoy },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ADMIN", "ANALYST", "SUPPORT"]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-[220px_1fr] gap-8">
      <aside>
        <div className="font-display text-lg text-ink mb-6">Admin</div>
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
