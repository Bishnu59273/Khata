export function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'cost';
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5">
      <p className="text-sm font-semibold text-ink-600">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${tone === 'cost' ? 'text-cost-600' : 'text-ink-900'}`}>
        {value}
      </p>
    </div>
  );
}
