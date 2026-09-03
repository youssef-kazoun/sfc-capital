import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper/80">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg text-paper mb-3">SFC Capital</div>
          <p className="text-sm leading-relaxed text-paper/60">
            Market data, research, and portfolio tools for investors in the
            Egyptian Exchange.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">Platform</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/markets" className="hover:text-gold">Markets</Link></li>
            <li><Link href="/recommendations" className="hover:text-gold">Recommendations</Link></li>
            <li><Link href="/analysis" className="hover:text-gold">Analysis</Link></li>
            <li><Link href="/calculators" className="hover:text-gold">Calculators</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">Company</div>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/packages" className="hover:text-gold">Packages</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-paper mb-3">Legal</div>
          <p className="text-sm text-paper/50 leading-relaxed">
            Content on this platform is for informational purposes only and
            does not constitute financial advice. Invest responsibly.
          </p>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} SFC Capital. All rights reserved.
      </div>
    </footer>
  );
}
