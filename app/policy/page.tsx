export const metadata = { title: "سياسة الموقع — SFC Capital" };

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-ink mb-6">سياسة الموقع</h1>
      <div className="text-ink/80 leading-relaxed space-y-4 text-sm">
        <h2 className="font-display text-lg text-ink pt-2">جمع البيانات</h2>
        <p>
          نجمع بيانات الحساب الأساسية (الاسم، البريد الإلكتروني، رقم
          الهاتف) عند التسجيل أو طلب الفترة التجريبية، وذلك بغرض تقديم
          الخدمة والتواصل معك بخصوص طلباتك.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">استخدام البيانات</h2>
        <p>
          تُستخدم بياناتك في تشغيل حسابك، متابعة اشتراكاتك ومحفظتك، والرد
          على طلبات الدعم الفني، ولا تتم مشاركتها مع أطراف ثالثة لأغراض
          تسويقية دون موافقتك.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">ملفات تعريف الارتباط</h2>
        <p>
          نستخدم ملفات تعريف ارتباط أساسية لتشغيل المنصة، مثل حفظ جلسة
          تسجيل الدخول وتفضيل اللغة.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">أمان البيانات</h2>
        <p>
          نتخذ إجراءات معقولة لحماية بياناتك، بما في ذلك تشفير كلمات
          المرور وتقييد الوصول للبيانات الحساسة على فرق العمل المخوّلة فقط.
        </p>
        <h2 className="font-display text-lg text-ink pt-2">حقوقك</h2>
        <p>
          يمكنك التواصل معنا في أي وقت لطلب تعديل أو حذف بياناتك الشخصية
          من خلال صفحة التواصل.
        </p>
      </div>
    </div>
  );
}
