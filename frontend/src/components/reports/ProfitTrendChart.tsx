import { useTranslation } from 'react-i18next';
import type { Transaction } from '../../types/models';
import { istDateKey, last7DayKeys } from '../../utils/dateRanges';
import { localeForLang } from '../../utils/formatDate';

export function ProfitTrendChart({ transactions }: { transactions: Transaction[] }) {
  const { t, i18n } = useTranslation('reports');

  const totals = new Map<string, number>();
  for (const tx of transactions) {
    const key = istDateKey(tx.created_at);
    totals.set(key, (totals.get(key) ?? 0) + tx.profit);
  }

  const bars = last7DayKeys().map((key) => ({
    key,
    day: new Date(`${key}T12:00:00`).toLocaleDateString(localeForLang(i18n.language), {
      weekday: 'short',
    }),
    value: totals.get(key) ?? 0,
  }));
  const maxValue = Math.max(1, ...bars.map((bar) => bar.value));

  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-6">
      <h3 className="mb-4 text-sm font-bold text-ink-900">{t('trend')}</h3>
      <div className="flex h-[150px] items-end gap-3.5">
        {bars.map((bar) => (
          <div key={bar.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="text-xs font-semibold text-[#4d7a5e]">₹{bar.value.toFixed(0)}</div>
            <div
              className="w-full max-w-[38px] rounded-t-md bg-gradient-to-b from-brand-500 to-brand-600"
              style={{ height: `${Math.max(0, Math.round((bar.value / maxValue) * 110))}px` }}
            />
            <div className="text-xs text-ink-600">{bar.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
