import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role?: string;
  quote: string;
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="font-display text-2xl text-ink mb-6">آراء عملائنا</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-sm border border-line bg-white p-5">
            <Quote className="h-5 w-5 text-gold mb-3" />
            <p className="text-sm text-ink/80 leading-relaxed">{t.quote}</p>
            <div className="mt-4">
              <div className="text-sm font-medium text-ink">{t.name}</div>
              {t.role && <div className="text-xs text-slate">{t.role}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
