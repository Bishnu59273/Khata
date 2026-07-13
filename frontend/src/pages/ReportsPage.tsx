import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTransactions } from '../api/transactions';
import { aggregateTransactions } from '../utils/aggregateTransactions';
import { getPresetRange, getTrendRange, getTodayDateStr } from '../utils/dateRanges';
import type { ReportRangePreset, TrendGranularity } from '../utils/dateRanges';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import { EditTransactionModal } from '../components/transactions/EditTransactionModal';
import { DeleteTransactionModal } from '../components/transactions/DeleteTransactionModal';
import { ProfitTrendChart } from '../components/reports/ProfitTrendChart';
import { StatCardsSkeleton, TableSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { formatINR } from '../utils/currency';
import type { Transaction } from '../types/models';

const RANGE_KEYS: ReportRangePreset[] = ['today', 'week', 'month', 'custom'];

export function ReportsPage() {
  const { t } = useTranslation('reports');
  const [preset, setPreset] = useState<ReportRangePreset>('today');
  const [customFrom, setCustomFrom] = useState(getTodayDateStr());
  const [customTo, setCustomTo] = useState(getTodayDateStr());
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  const range = preset === 'custom' ? { from: customFrom, to: customTo } : getPresetRange(preset);

  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'range', range.from, range.to],
    queryFn: () => getTransactions(range),
  });

  // The trend chart's granularity follows the preset: today → last 7 days,
  // this week → last 7 weeks, this month → last 7 months.
  const granularity: TrendGranularity =
    preset === 'week' ? 'week' : preset === 'month' ? 'month' : 'day';
  const trendRange = getTrendRange(granularity);
  const { data: trendData } = useQuery({
    queryKey: ['transactions', 'range', trendRange.from, trendRange.to],
    queryFn: () => getTransactions(trendRange),
  });

  const aggregates = aggregateTransactions(data ?? []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit flex-wrap gap-1.5 rounded-xl border border-border bg-brand-50 p-1.5">
        {RANGE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPreset(key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              preset === key ? 'bg-surface text-brand-600 shadow-sm' : 'text-ink-700'
            }`}
          >
            {t(`range.${key}`)}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            {t('customFrom')}
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-border-soft bg-surface px-3 py-1.5"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            {t('customTo')}
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-border-soft bg-surface px-3 py-1.5"
            />
          </label>
        </div>
      )}

      {status === 'pending' && (
        <>
          <StatCardsSkeleton />
          <TableSkeleton />
        </>
      )}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label={t('totalCollected', { ns: 'dashboard' })}
              value={formatINR(aggregates.totalCollected)}
            />
            <StatCard
              label={t('totalCost', { ns: 'dashboard' })}
              value={formatINR(aggregates.totalCost)}
              tone="cost"
            />
            <StatCard
              label={t('table.profit', { ns: 'dashboard' })}
              value={formatINR(aggregates.totalProfit)}
            />
          </div>

          {trendData && <ProfitTrendChart transactions={trendData} granularity={granularity} />}

          <div>
            <h2 className="mb-3 text-base font-bold text-ink-900">{t('detail')}</h2>
            {data.length === 0 ? (
              <EmptyState message={t('empty')} />
            ) : (
              <TransactionsTable
                transactions={data}
                showDate
                onEdit={setEditingTx}
                onDelete={setDeletingTx}
              />
            )}
          </div>
        </>
      )}

      {editingTx && (
        <EditTransactionModal transaction={editingTx} onClose={() => setEditingTx(null)} />
      )}

      {deletingTx && (
        <DeleteTransactionModal transaction={deletingTx} onClose={() => setDeletingTx(null)} />
      )}
    </div>
  );
}
