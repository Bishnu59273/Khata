import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTransactions } from '../api/transactions';
import { aggregateTransactions } from '../utils/aggregateTransactions';
import { getPresetRange, getLast7DaysRange, getTodayDateStr } from '../utils/dateRanges';
import type { ReportRangePreset } from '../utils/dateRanges';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import { EditTransactionModal } from '../components/transactions/EditTransactionModal';
import { ProfitTrendChart } from '../components/reports/ProfitTrendChart';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import type { Transaction } from '../types/models';

const RANGE_KEYS: ReportRangePreset[] = ['today', 'week', 'month', 'custom'];

export function ReportsPage() {
  const { t } = useTranslation('reports');
  const [preset, setPreset] = useState<ReportRangePreset>('today');
  const [customFrom, setCustomFrom] = useState(getTodayDateStr());
  const [customTo, setCustomTo] = useState(getTodayDateStr());
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const range = preset === 'custom' ? { from: customFrom, to: customTo } : getPresetRange(preset);

  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'range', range.from, range.to],
    queryFn: () => getTransactions(range),
  });

  const trendRange = getLast7DaysRange();
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

      {status === 'pending' && <LoadingState />}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label={t('totalCollected', { ns: 'dashboard' })}
              value={`₹${aggregates.totalCollected.toFixed(2)}`}
            />
            <StatCard
              label={t('totalCost', { ns: 'dashboard' })}
              value={`₹${aggregates.totalCost.toFixed(2)}`}
              tone="cost"
            />
            <StatCard
              label={t('table.profit', { ns: 'dashboard' })}
              value={`₹${aggregates.totalProfit.toFixed(2)}`}
            />
          </div>

          {trendData && <ProfitTrendChart transactions={trendData} />}

          <div>
            <h2 className="mb-3 text-base font-bold text-ink-900">{t('detail')}</h2>
            {data.length === 0 ? (
              <EmptyState message={t('empty')} />
            ) : (
              <TransactionsTable transactions={data} showDate onRowClick={setEditingTx} />
            )}
          </div>
        </>
      )}

      {editingTx && (
        <EditTransactionModal transaction={editingTx} onClose={() => setEditingTx(null)} />
      )}
    </div>
  );
}
