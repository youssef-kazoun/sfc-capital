export const metadata = { title: "سياسة استرداد الأموال — SFC Capital" };

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-ink mb-6">سياسة استرداد الأموال</h1>
      <div className="text-ink/80 leading-relaxed space-y-4 text-sm">
        <p>
          نظرًا لطبيعة الخدمات المالية والمعلوماتية المقدمة عبر المنصة،
          تُطبَّق سياسة الاسترداد التالية على جميع باقات الاشتراك.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">فترة الاسترداد</h2>
        <p>
          يمكن للمشترك الجديد طلب استرداد كامل القيمة خلال ٧ أيام من تاريخ
          الاشتراك الأول، بشرط عدم الاستفادة الفعلية من التوصيات المدفوعة
          خلال هذه الفترة.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">حالات لا يُطبَّق فيها الاسترداد</h2>
        <p>
          لا يُطبَّق الاسترداد على الاشتراكات المجدَّدة تلقائيًا بعد
          الفترة الأولى، أو على الباقات المُستخدمة بالكامل خلال دورة
          الفوترة الحالية.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">طريقة تقديم الطلب</h2>
        <p>
          لتقديم طلب استرداد، تواصل معنا من خلال صفحة الدعم الفني أو
          التواصل مع فريق الدعم مباشرة، وسيتم الرد على طلبك خلال ٣ أيام
          عمل.
        </p>
      </div>
    </div>
  );
}
