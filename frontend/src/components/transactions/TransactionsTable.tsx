import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Transaction } from '../../types/models';
import { paymentModePillStyle } from '../../utils/paymentMode';
import { localeForLang } from '../../utils/formatDate';

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

function formatDate(isoString: string, lang: string): string {
  return new Date(isoString).toLocaleDateString(localeForLang(lang), {
    day: 'numeric',
    month: 'short',
  });
}

function formatDateTime(isoString: string, lang: string): string {
  return `${formatDate(isoString, lang)}, ${formatTime(isoString)}`;
}

export function TransactionsTable({
  transactions,
  showDate = false,
  onRowClick,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  showDate?: boolean;
  onRowClick?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}) {
  const { t, i18n } = useTranslation('dashboard');
  const showActions = !!onEdit || !!onDelete;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface">
      <table className="w-full text-left text-[14.5px]">
        <thead>
          <tr className="bg-tablehead">
            <th className="px-5 py-3 font-semibold text-ink-700">{t('table.service')}</th>
            <th className="px-4 py-3 font-semibold text-ink-700">{t('table.customer')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.qty')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.charge')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.cost')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.profit')}</th>
            <th className="px-4 py-3 font-semibold text-ink-700">{t('table.paymentMode')}</th>
            <th className="px-5 py-3 text-right font-semibold text-ink-700">
              {showDate ? t('table.dateTime') : t('table.time')}
            </th>
            {showActions && (
              <th className="px-5 py-3 text-right font-semibold text-ink-700">{t('table.actions')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              onClick={onRowClick ? () => onRowClick(tx) : undefined}
              className={`border-t border-border-row ${onRowClick ? 'cursor-pointer hover:bg-brand-50/40' : ''}`}
            >
              <td className="px-5 py-3 font-semibold text-ink-900">{serviceName(tx, i18n.language)}</td>
              <td className="px-4 py-3 text-ink-600">{tx.customer_name || '—'}</td>
              <td className="px-4 py-3 text-right text-ink-600">×{tx.quantity}</td>
              <td className="px-4 py-3 text-right text-ink-900">₹{tx.customer_charge.toFixed(2)}</td>
              <td className="px-4 py-3 text-right text-cost-600">₹{tx.cost_paid.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-bold text-success-600">₹{tx.profit.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={paymentModePillStyle(tx.payment_mode)}
                >
                  {t(`paymentMode.${tx.payment_mode}`, { ns: 'transactions' })}
                </span>
              </td>
              <td className="px-5 py-3 text-right text-ink-600">
                {showDate ? formatDateTime(tx.created_at, i18n.language) : formatTime(tx.created_at)}
              </td>
              {showActions && (
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(tx);
                        }}
                        aria-label={t('actions.edit', { ns: 'common' })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-700 hover:bg-brand-50"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(tx);
                        }}
                        aria-label={t('actions.delete', { ns: 'common' })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-danger-600 hover:bg-danger-600/[8%]"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
