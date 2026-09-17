export type ShariahStatus = "COMPLIANT" | "REVIEW" | "NOT_COMPLIANT" | "UNKNOWN";

export interface ShariahInput {
  sector?: string | null;
  isConventionalFinance: boolean;
  debtRatio: number | null;
  cashRatio: number | null;
  nonCompliantIncomeRatio: number | null;
}

export interface ShariahResult {
  status: ShariahStatus;
  statusLabel: string;
  reasons: string[];
}

// Approximate thresholds, broadly aligned with common AAOIFI-style
// screening methodologies. This is a simplified, automated estimate —
// not a substitute for a formal fatwa or a licensed Shariah board review.
const DEBT_RATIO_LIMIT = 30; // %
const DEBT_RATIO_REVIEW = 33; // %
const CASH_RATIO_LIMIT = 30; // %
const CASH_RATIO_REVIEW = 33; // %
const INCOME_RATIO_LIMIT = 5; // %
const INCOME_RATIO_REVIEW = 7; // %

const EXCLUDED_SECTOR_KEYWORDS = ["قمار", "كحول", "تبغ", "تأمين تقليدي"];

export function checkShariahCompliance(input: ShariahInput): ShariahResult {
  const reasons: string[] = [];

  if (input.isConventionalFinance) {
    return {
      status: "NOT_COMPLIANT",
      statusLabel: "غير متوافق",
      reasons: ["النشاط الأساسي للشركة قائم على الفائدة (تمويل تقليدي)."],
    };
  }

  if (input.sector && EXCLUDED_SECTOR_KEYWORDS.some((k) => input.sector!.includes(k))) {
    return {
      status: "NOT_COMPLIANT",
      statusLabel: "غير متوافق",
      reasons: [`القطاع (${input.sector}) من الأنشطة المستثناة شرعًا.`],
    };
  }

  if (input.debtRatio == null || input.cashRatio == null || input.nonCompliantIncomeRatio == null) {
    return {
      status: "UNKNOWN",
      statusLabel: "بيانات غير كافية",
      reasons: ["لا تتوفر بيانات مالية كافية لإجراء الفحص."],
    };
  }

  let worst: ShariahStatus = "COMPLIANT";

  const evaluate = (value: number, limit: number, reviewLimit: number, label: string) => {
    if (value > reviewLimit) {
      reasons.push(`${label} (${value.toFixed(1)}%) يتجاوز الحد المسموح (${limit}%).`);
      worst = "NOT_COMPLIANT";
    } else if (value > limit) {
      reasons.push(`${label} (${value.toFixed(1)}%) قريب من الحد المسموح (${limit}%) ويحتاج مراجعة.`);
      if (worst !== "NOT_COMPLIANT") worst = "REVIEW";
    }
  };

  evaluate(input.debtRatio, DEBT_RATIO_LIMIT, DEBT_RATIO_REVIEW, "نسبة الدين إلى القيمة السوقية");
  evaluate(input.cashRatio, CASH_RATIO_LIMIT, CASH_RATIO_REVIEW, "نسبة النقد والأوراق المالية الفائدية");
  evaluate(
    input.nonCompliantIncomeRatio,
    INCOME_RATIO_LIMIT,
    INCOME_RATIO_REVIEW,
    "نسبة الدخل غير المتوافق"
  );

  if (worst === "COMPLIANT") {
    reasons.push("جميع النسب المالية ضمن الحدود المسموح بها في الفحص الشرعي التقريبي.");
  }

  const labels: Record<ShariahStatus, string> = {
    COMPLIANT: "متوافق",
    REVIEW: "يحتاج مراجعة",
    NOT_COMPLIANT: "غير متوافق",
    UNKNOWN: "بيانات غير كافية",
  };

  return { status: worst, statusLabel: labels[worst], reasons };
}
