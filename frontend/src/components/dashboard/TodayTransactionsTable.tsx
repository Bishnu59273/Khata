import { useTranslation } from 'react-i18next';
import type { Transaction } from '../../types/models';

function serviceName(transaction: Transaction, lang: string): string {
  const service = transaction.service;
  if (!service) return '—';
  if (lang === 'hi') return service.name_hi;
  if (lang === 'bn') return service.name_bn;
  return service.name_en;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function TodayTransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const { t, i18n } = useTranslation('dashboard');

  return (
    <div className="overflow-x-auto rounded-2xl bg-surface shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-brand-100">
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.time')}</th>
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.service')}</th>
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.customer')}</th>
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.charge')}</th>
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.cost')}</th>
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.profit')}</th>
            <th className="p-4 text-base font-semibold text-ink-600">{t('table.paymentMode')}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-brand-50 last:border-0">
              <td className="p-4 text-base text-ink-900">{formatTime(tx.created_at)}</td>
              <td className="p-4 text-base text-ink-900">{serviceName(tx, i18n.language)}</td>
              <td className="p-4 text-base text-ink-900">{tx.customer_name ?? '—'}</td>
              <td className="p-4 text-base text-ink-900">₹{tx.customer_charge.toFixed(2)}</td>
              <td className="p-4 text-base text-ink-900">₹{tx.cost_paid.toFixed(2)}</td>
              <td className="p-4 text-base font-semibold text-success-600">
                ₹{tx.profit.toFixed(2)}
              </td>
              <td className="p-4 text-base text-ink-900 capitalize">{tx.payment_mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
