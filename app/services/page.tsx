import Link from "next/link";
import { SectionHeading, Button } from "@/components/ui/primitives";
import {
  TrendingUp, Newspaper, Package, Calculator, ShieldCheck, Percent,
  BookOpen, FileText, Gift,
} from "lucide-react";

const services = [
  {
    icon: TrendingUp,
    title: "توصيات السوق السعودي",
    body: "توصيات شراء وبيع بمستويات دخول وهدف ووقف خسارة واضحة لأسهم تداول.",
    href: "/recommendations?market=SAUDI",
    cta: "استعرض التوصيات",
  },
  {
    icon: TrendingUp,
    title: "توصيات السوق الأمريكي",
    body: "توصيات لأسهم ناسداك ونيويورك مع تحليل الأساس وراء كل صفقة.",
    href: "/recommendations?market=US",
    cta: "استعرض التوصيات",
  },
  {
    icon: Package,
    title: "الباقات الخاصة",
    body: "باقات اشتراك مرنة تناسب حجم استثمارك وأسلوبك في التداول.",
    href: "/packages",
    cta: "عرض الباقات",
  },
  {
    icon: Gift,
    title: "العروض الخاصة",
    body: "خصومات وعروض محدودة على باقات الاشتراك.",
    href: "/offers",
    cta: "شاهد العروض",
  },
  {
    icon: Newspaper,
    title: "أخبار السوق السعودي",
    body: "آخر الأخبار المؤثرة على تداول والاقتصاد السعودي.",
    href: "/news?market=SAUDI",
    cta: "اقرأ الأخبار",
  },
  {
    icon: Newspaper,
    title: "أخبار السوق الأمريكي",
    body: "آخر الأخبار المؤثرة على الأسواق الأمريكية والاحتياطي الفيدرالي.",
    href: "/news?market=US",
    cta: "اقرأ الأخبار",
  },
  {
    icon: Calculator,
    title: "الحاسبات المالية",
    body: "حاسبات الربح والخسارة، متوسط السعر، حجم الصفقة، والعمولة.",
    href: "/calculators",
    cta: "استخدم الحاسبة",
  },
  {
    icon: ShieldCheck,
    title: "فحص شرعية السهم",
    body: "فحص تقريبي لمدى توافق السهم مع الضوابط الشرعية بناءً على نسبه المالية.",
    href: "/shariah-checker",
    cta: "فحص سهم",
  },
  {
    icon: BookOpen,
    title: "الدورات التدريبية",
    body: "دورات في أساسيات التداول والتحليل الفني والأساسي.",
    href: "/academy",
    cta: "تعرّف على الأكاديمية",
  },
  {
    icon: FileText,
    title: "المقالات والنصائح",
    body: "تحليلات ومقالات تعليمية تساعدك على اتخاذ قرارات استثمارية أفضل.",
    href: "/news",
    cta: "اقرأ المقالات",
  },
  {
    icon: Percent,
    title: "الفترة التجريبية المجانية",
    body: "جرّب خدماتنا مجانًا لفترة محدودة قبل الاشتراك في أي باقة.",
    href: "/trial",
    cta: "سجّل الآن",
  },
];

export const metadata = { title: "خدماتنا — SFC Capital" };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="خدماتنا"
        subtitle="كل ما تحتاجه للاستثمار في السوق السعودي والأمريكي في مكان واحد"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.title} className="rounded-sm border border-line bg-white p-5 flex flex-col">
            <s.icon className="h-6 w-6 text-gold mb-3" strokeWidth={1.75} />
            <h3 className="font-display text-lg text-ink">{s.title}</h3>
            <p className="text-sm text-slate mt-1.5 leading-relaxed flex-1">{s.body}</p>
            <Link href={s.href} className="mt-4">
              <Button variant="secondary" className="w-full">{s.cta}</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
