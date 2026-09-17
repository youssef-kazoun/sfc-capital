import Link from "next/link";
import { db, schema } from "@/db";
import { MessageCircle, Send, Music2, ExternalLink } from "lucide-react";

const SOCIAL_LINKS = [
  { key: "whatsapp_number", label: "واتساب", icon: MessageCircle, isPhone: true },
  { key: "telegram_url", label: "تيليجرام", icon: Send },
  { key: "facebook_url", label: "فيسبوك", icon: ExternalLink },
  { key: "youtube_url", label: "يوتيوب", icon: ExternalLink },
  { key: "x_url", label: "إكس", icon: ExternalLink },
  { key: "instagram_url", label: "إنستجرام", icon: ExternalLink },
  { key: "tiktok_url", label: "تيك توك", icon: Music2 },
  { key: "snapchat_url", label: "سناب شات", icon: ExternalLink },
  { key: "linkedin_url", label: "لينكدإن", icon: ExternalLink },
];

export default async function Footer() {
  const settingsRows = await db.select().from(schema.siteSettings);
  const settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));

  const activeSocial = SOCIAL_LINKS.filter((s) => settings[s.key]);

  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper/80">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg text-paper mb-3">SFC Capital</div>
          <p className="text-sm leading-relaxed text-paper/60">
            بيانات السوق، البحث، وأدوات إدارة المحفظة للمستثمرين في السوق
            السعودي والأسواق الأمريكية.
          </p>
          {activeSocial.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {activeSocial.map((s) => {
                const href = s.isPhone
                  ? `https://wa.me/${settings[s.key].replace(/[^0-9]/g, "")}`
                  : settings[s.key];
                return (
                  <a
                    key={s.key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-paper/60 hover:text-gold"
                  >
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">المنصة</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/services" className="hover:text-gold">خدماتنا</Link></li>
            <li><Link href="/markets" className="hover:text-gold">الأسواق</Link></li>
            <li><Link href="/recommendations" className="hover:text-gold">التوصيات</Link></li>
            <li><Link href="/analysis" className="hover:text-gold">التحليلات</Link></li>
            <li><Link href="/calculators" className="hover:text-gold">الحاسبات</Link></li>
            <li><Link href="/shariah-checker" className="hover:text-gold">فحص شرعية السهم</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">الشركة</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/about" className="hover:text-gold">من نحن</Link></li>
            <li><Link href="/packages" className="hover:text-gold">الباقات</Link></li>
            <li><Link href="/offers" className="hover:text-gold">العروض الخاصة</Link></li>
            <li><Link href="/trial" className="hover:text-gold">الفترة التجريبية</Link></li>
            <li><Link href="/contact" className="hover:text-gold">تواصل معنا</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">قانوني</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/terms" className="hover:text-gold">الشروط والأحكام</Link></li>
            <li><Link href="/policy" className="hover:text-gold">سياسة الموقع</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold">سياسة استرداد الأموال</Link></li>
            <li><Link href="/disclaimer" className="hover:text-gold">إخلاء المسؤولية</Link></li>
          </ul>
          <p className="text-xs text-paper/50 leading-relaxed mt-3">
            المحتوى على هذه المنصة لأغراض معلوماتية فقط ولا يُعد نصيحة مالية.
            استثمر بمسؤولية.
          </p>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} SFC Capital. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
