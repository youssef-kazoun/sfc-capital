import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/primitives";

export const metadata = { title: "المساعد الذكي — SFC Capital" };

const capabilities = [
  "شرح مفاهيم التحليل الفني والأساسي",
  "الإجابة عن أسئلة حول أسهم السوق السعودي والأمريكي",
  "توضيح كيفية استخدام الحاسبات وفحص التوافق الشرعي",
  "مساعدتك في فهم تقارير المحفظة والتنبيهات",
];

export default function AiAssistantPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <Sparkles className="h-10 w-10 text-gold mx-auto mb-4" strokeWidth={1.5} />
      <h1 className="font-display text-3xl text-ink">المساعد الذكي</h1>
      <p className="text-slate mt-3 max-w-lg mx-auto leading-relaxed">
        نعمل حاليًا على تفعيل مساعد ذكي يجيب على أسئلتك حول التداول والتحليل
        داخل المنصة. الميزة غير متاحة بعد، إليك ما ستتيحه عند إطلاقها:
      </p>
      <ul className="mt-8 space-y-3 max-w-md mx-auto text-right">
        {capabilities.map((c) => (
          <li key={c} className="flex items-start gap-2 text-sm text-ink/80 rounded-sm border border-line bg-white p-3">
            <span className="text-gold mt-0.5">•</span>
            {c}
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate mt-8 leading-relaxed max-w-md mx-auto">
        عند إطلاقه، سيقدّم المساعد معلومات تعليمية عامة فقط، ولن يقدّم نصيحة
        استثمارية مخصصة لحالتك المالية.
      </p>
      <div className="mt-6">
        <Link href="/faq">
          <Button variant="secondary">تصفّح الأسئلة الشائعة بدلًا من ذلك</Button>
        </Link>
      </div>
    </div>
  );
}
