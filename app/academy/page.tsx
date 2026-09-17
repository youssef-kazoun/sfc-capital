import { BookOpen } from "lucide-react";

export const metadata = { title: "الأكاديمية — SFC Capital" };

const upcoming = [
  "أساسيات التداول",
  "التحليل الفني",
  "التحليل الأساسي",
  "السوق السعودي",
  "السوق الأمريكي",
  "إدارة المخاطر",
];

export default function AcademyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <BookOpen className="h-10 w-10 text-gold mx-auto mb-4" strokeWidth={1.5} />
      <h1 className="font-display text-3xl text-ink">الأكاديمية</h1>
      <p className="text-slate mt-3 max-w-lg mx-auto leading-relaxed">
        نعمل حاليًا على إطلاق دورات تدريبية متخصصة. لا توجد دورات متاحة حاليًا،
        تابعنا قريبًا للإعلان عن باقة الدورات الكاملة.
      </p>
      <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-xl mx-auto">
        {upcoming.map((c) => (
          <div key={c} className="rounded-sm border border-dashed border-line p-4 text-sm text-slate">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
