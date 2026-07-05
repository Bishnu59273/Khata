import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { getTodayTransactions } from '../api/transactions';
import { aggregateTransactions } from '../utils/aggregateTransactions';
import { ProfitHighlight } from '../components/dashboard/ProfitHighlight';
import { StatCard } from '../components/dashboard/StatCard';
import { TodayTransactionsTable } from '../components/dashboard/TodayTransactionsTable';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'today'],
    queryFn: getTodayTransactions,
  });

  const aggregates = aggregateTransactions(data ?? []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">{t('title')}</h1>
        <Link
          to="/transactions/new"
          className="min-h-12 rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-brand-600"
        >
          {t('addTransactionCta')}
        </Link>
      </div>

      {status === 'pending' && <LoadingState />}
      {status === 'error' && <ErrorState message={error instanceof Error ? error.message : undefined} />}

      {status === 'success' && (
        <>
          <ProfitHighlight amount={aggregates.totalProfit} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard label={t('totalCollected')} value={`₹${aggregates.totalCollected.toFixed(2)}`} />
            <StatCard label={t('totalCost')} value={`₹${aggregates.totalCost.toFixed(2)}`} />
            <StatCard label={t('transactionCount')} value={String(aggregates.count)} />
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-ink-900">{t('todaysTransactions')}</h2>
            {data.length === 0 ? (
              <EmptyState message={t('empty.noTransactionsToday')} />
            ) : (
              <TodayTransactionsTable transactions={data} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
