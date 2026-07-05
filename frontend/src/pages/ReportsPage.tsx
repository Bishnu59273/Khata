import { useTranslation } from 'react-i18next';

// Future: DateRangePicker (Today/Week/Month/Custom) driving GET /api/transactions?from&to,
// reusing StatCard + utils/aggregateTransactions.ts, plus a sortable table.
export function ReportsPage() {
  const { t } = useTranslation('reports');
  return (
    <div className="rounded-2xl bg-surface p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-ink-900">{t('title')}</h1>
      <p className="mt-2 text-lg text-ink-600">{t('comingSoon')}</p>
    </div>
  );
}
