export const metadata = { title: "من نحن — SFC Capital" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-ink">من نحن — SFC Capital</h1>
      <p className="text-ink/80 leading-relaxed mt-6">
        تجمع SFC Capital بين بيانات السوق اللحظية، البحث المستقل، وأدوات
        إدارة المحفظة العملية للمستثمرين في البورصة المصرية. يقوم فريقنا من
        المحللين بنشر توصيات بمستويات دخول وهدف ووقف خسارة واضحة، مع الأسباب
        الكاملة وراء كل توصية.
      </p>
      <p className="text-ink/80 leading-relaxed mt-4">
        سواء كنت تنفّذ أول صفقة لك أو تدير محفظة نشطة، صُممت SFC Capital
        لمساعدتك على اتخاذ قرارات مدروسة بثقة.
      </p>
    </div>
  );
}
