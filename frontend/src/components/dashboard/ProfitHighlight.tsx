import { useTranslation } from 'react-i18next';
import { formatINR } from '../../utils/currency';

export function ProfitHighlight({ amount }: { amount: number }) {
  const { t } = useTranslation('dashboard');
  return (
    <div className="flex-1 rounded-2xl border border-success-border bg-gradient-to-br from-[#f0f6f1] to-[#e4efe7] px-8 py-6">
      <p className="text-sm font-semibold tracking-wide text-[#4d7a5e] uppercase">{t('todayProfit')}</p>
      <p className="mt-1 text-display font-bold leading-none text-success-600">{formatINR(amount)}</p>
      <p className="mt-1 text-sm text-[#6b8a76]">{t('profitSub')}</p>
    </div>
  );
}
