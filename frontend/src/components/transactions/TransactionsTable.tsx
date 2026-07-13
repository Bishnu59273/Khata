import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Transaction } from '../../types/models';
import { paymentModePillStyle } from '../../utils/paymentMode';
import { localeForLang } from '../../utils/formatDate';
import { formatINR } from '../../utils/currency';

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

interface TransactionsTableProps {
  transactions: Transaction[];
  showDate?: boolean;
  onRowClick?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export function TransactionsTable(props: TransactionsTableProps) {
  return (
    <>
      <div className="hidden md:block">
        <DesktopTable {...props} />
      </div>
      <div className="md:hidden">
        <MobileCards {...props} />
      </div>
    </>
  );
}

function DesktopTable({
  transactions,
  showDate = false,
  onRowClick,
  onEdit,
  onDelete,
  selectable = false,
  selectedIds,
  onToggleSelect,
}: TransactionsTableProps) {
  const { t, i18n } = useTranslation('dashboard');
  const showActions = !!onEdit || !!onDelete;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface">
      <table className="w-full text-left text-[14.5px]">
        <thead>
          <tr className="bg-tablehead">
            {selectable && <th className="w-10 px-5 py-3" />}
            <th className="px-5 py-3 font-semibold text-ink-700">{t('table.service')}</th>
            <th className="px-4 py-3 font-semibold text-ink-700">{t('table.customer')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.qty')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.charge')}</th>
            <th className="px-4 py-3 text-right font-semibold text-ink-700">{t('table.discount')}</th>
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
              {selectable && (
                <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds?.has(tx.id) ?? false}
                    onChange={() => onToggleSelect?.(tx.id)}
                    className="h-4 w-4 accent-brand-500"
                  />
                </td>
              )}
              <td className="px-5 py-3 font-semibold text-ink-900">{serviceName(tx, i18n.language)}</td>
              <td className="px-4 py-3 text-ink-600">{tx.customer_name || '—'}</td>
              <td className="px-4 py-3 text-right text-ink-600">×{tx.quantity}</td>
              <td className="px-4 py-3 text-right text-ink-900">{formatINR(tx.customer_charge)}</td>
              <td className="px-4 py-3 text-right text-ink-600">
                {tx.discount ? formatINR(tx.discount) : '—'}
              </td>
              <td className="px-4 py-3 text-right text-cost-600">{formatINR(tx.cost_paid)}</td>
              <td className="px-4 py-3 text-right font-bold text-success-600">{formatINR(tx.profit)}</td>
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

function MobileCards({
  transactions,
  showDate = false,
  onRowClick,
  onEdit,
  onDelete,
  selectable = false,
  selectedIds,
  onToggleSelect,
}: TransactionsTableProps) {
  const { t, i18n } = useTranslation('dashboard');
  const showActions = !!onEdit || !!onDelete;

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          onClick={onRowClick ? () => onRowClick(tx) : undefined}
          className={`rounded-2xl border border-border-soft bg-surface p-4 ${
            onRowClick ? 'cursor-pointer hover:bg-brand-50/40' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              {selectable && (
                <input
                  type="checkbox"
                  checked={selectedIds?.has(tx.id) ?? false}
                  onChange={() => onToggleSelect?.(tx.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-500"
                />
              )}
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold text-ink-900">
                  {serviceName(tx, i18n.language)}
                  <span className="ml-1.5 text-sm font-medium text-ink-600">×{tx.quantity}</span>
                </div>
                <div className="mt-0.5 truncate text-sm text-ink-600">
                  {tx.customer_name || '—'} ·{' '}
                  {showDate ? formatDateTime(tx.created_at, i18n.language) : formatTime(tx.created_at)}
                </div>
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
              style={paymentModePillStyle(tx.payment_mode)}
            >
              {t(`paymentMode.${tx.payment_mode}`, { ns: 'transactions' })}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3 border-t border-border-row pt-3">
            <div className="flex gap-4">
              <div>
                <div className="text-xs font-semibold text-ink-600">{t('table.charge')}</div>
                <div className="text-sm font-semibold text-ink-900">{formatINR(tx.customer_charge)}</div>
              </div>
              {tx.discount > 0 && (
                <div>
                  <div className="text-xs font-semibold text-ink-600">{t('table.discount')}</div>
                  <div className="text-sm font-semibold text-ink-600">{formatINR(tx.discount)}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-ink-600">{t('table.cost')}</div>
                <div className="text-sm font-semibold text-cost-600">{formatINR(tx.cost_paid)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-ink-600">{t('table.profit')}</div>
                <div className="text-sm font-bold text-success-600">{formatINR(tx.profit)}</div>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center gap-1.5">
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(tx);
                    }}
                    aria-label={t('actions.edit', { ns: 'common' })}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft text-ink-700 hover:bg-brand-50"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft text-danger-600 hover:bg-danger-600/[8%]"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
