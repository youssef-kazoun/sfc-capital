export const metadata = { title: "About — SFC Capital" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-ink">About SFC Capital</h1>
      <p className="text-ink/80 leading-relaxed mt-6">
        SFC Capital brings together live market data, independent research,
        and practical portfolio tools for investors trading on the Egyptian
        Exchange. Our team of analysts publishes recommendations with clear
        entry, target, and stop-loss levels, backed by the reasoning behind
        every call.
      </p>
      <p className="text-ink/80 leading-relaxed mt-4">
        Whether you're placing your first trade or managing an active
        portfolio, SFC Capital is built to help you make informed decisions
        with confidence.
      </p>
    </div>
  );
}
