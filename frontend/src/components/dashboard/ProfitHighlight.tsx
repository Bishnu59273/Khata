import { useTranslation } from 'react-i18next';

export function ProfitHighlight({ amount }: { amount: number }) {
  const { t } = useTranslation('dashboard');
  return (
    <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-ink-600">{t('todayProfit')}</p>
      <p className="text-display font-bold text-success-600">₹{amount.toFixed(2)}</p>
    </div>
  );
}
