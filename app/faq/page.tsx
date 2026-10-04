import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { SectionHeading } from "@/components/ui/primitives";
import FaqAccordion from "@/components/site/faq-accordion";

export const metadata = { title: "الأسئلة الشائعة — SFC Capital" };

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "هل التوصيات المنشورة مضمونة الربح؟",
    answer:
      "لا. جميع التوصيات هي رأي فريق التحليل بناءً على المعلومات المتاحة وقت النشر، ولا تضمن أي عائد. الاستثمار في الأسواق المالية ينطوي دائمًا على مخاطر.",
  },
  {
    question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    answer:
      "نعم، يمكنك إلغاء الاشتراك في أي وقت من صفحة الاشتراك في لوحة التحكم. سيستمر وصولك حتى نهاية دورة الفوترة الحالية.",
  },
  {
    question: "ما الفرق بين توصيات السوق السعودي والأمريكي؟",
    answer:
      "توصيات السوق السعودي تغطي أسهم تداول بالريال السعودي، بينما توصيات السوق الأمريكي تغطي أسهم ناسداك ونيويورك بالدولار الأمريكي.",
  },
  {
    question: "كيف يعمل فحص التوافق الشرعي؟",
    answer:
      "الفحص تقريبي وآلي، يعتمد على نسب مالية محدودة (نسبة الدين، النقد، والدخل غير المتوافق) واستبعاد القطاعات المخالفة شرعًا. ليس بديلًا عن فتوى شرعية رسمية.",
  },
  {
    question: "هل يمكنني تجربة الخدمة قبل الاشتراك؟",
    answer: "نعم، يمكنك التسجيل في الفترة التجريبية المجانية من صفحة الفترة التجريبية.",
  },
];

export default async function FaqPage() {
  const rows = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, "faq_items"));

  let faqs: FaqItem[] = [];
  try {
    faqs = JSON.parse(rows[0]?.value || "[]");
  } catch {
    faqs = [];
  }
  if (faqs.length === 0) faqs = DEFAULT_FAQS;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading title="الأسئلة الشائعة" subtitle="إجابات على أكثر الأسئلة تكرارًا" />
      <FaqAccordion items={faqs} />
    </div>
  );
}
