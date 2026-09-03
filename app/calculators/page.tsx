"use client";

import { useState } from "react";
import { Card, Input, SectionHeading } from "@/components/ui/primitives";

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading title="Calculators" subtitle="Quick tools to plan and evaluate trades" />
      <div className="grid md:grid-cols-2 gap-6">
        <ProfitLossCalculator />
        <PositionSizeCalculator />
        <CompoundGrowthCalculator />
        <DividendYieldCalculator />
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs text-slate">{label}</label>
      <Input type="number" step="any" {...props} />
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 rounded-sm bg-paper-dim p-3 flex justify-between text-sm">
      <span className="text-slate">{label}</span>
      <span className="font-mono font-medium text-ink">{value}</span>
    </div>
  );
}

function ProfitLossCalculator() {
  const [entry, setEntry] = useState(10);
  const [exit, setExit] = useState(12);
  const [qty, setQty] = useState(100);

  const pnl = (exit - entry) * qty;
  const pctReturn = entry ? ((exit - entry) / entry) * 100 : 0;

  return (
    <Card>
      <h3 className="font-display text-lg text-ink mb-4">Profit / Loss</h3>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Entry price" value={entry} onChange={(e) => setEntry(+e.target.value)} />
        <Field label="Exit price" value={exit} onChange={(e) => setExit(+e.target.value)} />
        <Field label="Quantity" value={qty} onChange={(e) => setQty(+e.target.value)} />
      </div>
      <Result label="Net P&L" value={pnl.toFixed(2)} />
      <Result label="Return" value={`${pctReturn.toFixed(2)}%`} />
    </Card>
  );
}

function PositionSizeCalculator() {
  const [capital, setCapital] = useState(50000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(20);
  const [stop, setStop] = useState(18);

  const riskAmount = capital * (riskPct / 100);
  const perShareRisk = Math.abs(entry - stop);
  const shares = perShareRisk ? Math.floor(riskAmount / perShareRisk) : 0;

  return (
    <Card>
      <h3 className="font-display text-lg text-ink mb-4">Position sizing</h3>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Capital (EGP)" value={capital} onChange={(e) => setCapital(+e.target.value)} />
        <Field label="Risk per trade (%)" value={riskPct} onChange={(e) => setRiskPct(+e.target.value)} />
        <Field label="Entry price" value={entry} onChange={(e) => setEntry(+e.target.value)} />
        <Field label="Stop-loss price" value={stop} onChange={(e) => setStop(+e.target.value)} />
      </div>
      <Result label="Max risk amount" value={riskAmount.toFixed(2)} />
      <Result label="Suggested shares" value={shares.toString()} />
    </Card>
  );
}

function CompoundGrowthCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(15);
  const [years, setYears] = useState(5);

  const future = principal * Math.pow(1 + rate / 100, years);

  return (
    <Card>
      <h3 className="font-display text-lg text-ink mb-4">Compound growth</h3>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Principal (EGP)" value={principal} onChange={(e) => setPrincipal(+e.target.value)} />
        <Field label="Annual return (%)" value={rate} onChange={(e) => setRate(+e.target.value)} />
        <Field label="Years" value={years} onChange={(e) => setYears(+e.target.value)} />
      </div>
      <Result label="Future value" value={future.toFixed(2)} />
      <Result label="Total gain" value={(future - principal).toFixed(2)} />
    </Card>
  );
}

function DividendYieldCalculator() {
  const [price, setPrice] = useState(25);
  const [dividend, setDividend] = useState(1.5);

  const yieldPct = price ? (dividend / price) * 100 : 0;

  return (
    <Card>
      <h3 className="font-display text-lg text-ink mb-4">Dividend yield</h3>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Share price" value={price} onChange={(e) => setPrice(+e.target.value)} />
        <Field label="Annual dividend / share" value={dividend} onChange={(e) => setDividend(+e.target.value)} />
      </div>
      <Result label="Dividend yield" value={`${yieldPct.toFixed(2)}%`} />
    </Card>
  );
}
