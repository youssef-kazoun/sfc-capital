import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper/80">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg text-paper mb-3">SFC Capital</div>
          <p className="text-sm leading-relaxed text-paper/60">
            بيانات السوق، البحث، وأدوات إدارة المحفظة للمستثمرين في البورصة
            المصرية.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">المنصة</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/markets" className="hover:text-gold">الأسواق</Link></li>
            <li><Link href="/recommendations" className="hover:text-gold">التوصيات</Link></li>
            <li><Link href="/analysis" className="hover:text-gold">التحليلات</Link></li>
            <li><Link href="/calculators" className="hover:text-gold">الحاسبات</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">الشركة</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/about" className="hover:text-gold">من نحن</Link></li>
            <li><Link href="/packages" className="hover:text-gold">الباقات</Link></li>
            <li><Link href="/contact" className="hover:text-gold">تواصل معنا</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">قانوني</div>
          <p className="text-sm text-paper/50 leading-relaxed">
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
