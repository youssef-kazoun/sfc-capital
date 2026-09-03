import { cn } from "@/lib/utils";
import { formatPct } from "@/lib/utils";

export function PriceChange({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "font-mono text-sm font-medium",
        positive ? "text-gain" : "text-loss",
        className
      )}
    >
      {formatPct(value)}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gain" | "loss" | "gold";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-dim text-ink/70",
    gain: "bg-gain/10 text-gain",
    loss: "bg-loss/10 text-loss",
    gold: "bg-gold/15 text-gold",
  };
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-slate mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants: Record<string, string> = {
    primary: "bg-ink text-paper hover:bg-gold hover:text-ink",
    secondary: "bg-transparent border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: "bg-transparent text-ink/70 hover:text-ink",
    danger: "bg-loss text-paper hover:bg-loss/90",
  };
  return (
    <button
      className={cn(
        "rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-gold",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-gold",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-gold",
        props.className
      )}
    />
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-sm border border-line bg-white p-5", className)}>
      {children}
    </div>
  );
}
