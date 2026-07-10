import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { getTodayTransactions } from '../api/transactions';
import { aggregateTransactions } from '../utils/aggregateTransactions';
import { ProfitHighlight } from '../components/dashboard/ProfitHighlight';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import { StatCardsSkeleton, TableSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { formatINR } from '../utils/currency';

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'today'],
    queryFn: getTodayTransactions,
  });

  const aggregates = aggregateTransactions(data ?? []);
  const TODAY_PREVIEW_LIMIT = 25;
  const visibleTransactions = data?.slice(0, TODAY_PREVIEW_LIMIT) ?? [];

  return (
    <div className="flex flex-col gap-6">
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
          <div className="flex flex-wrap items-stretch gap-5">
            <ProfitHighlight amount={aggregates.totalProfit} />
            <Link
              to="/transactions/new"
              className="flex items-center gap-2.5 self-start rounded-xl bg-brand-500 px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-brand-600"
            >
              <Plus size={22} />
              {t('addTransactionCta')}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label={t('totalCollected')} value={formatINR(aggregates.totalCollected)} />
            <StatCard
              label={t('totalCost')}
              value={formatINR(aggregates.totalCost)}
              tone="cost"
            />
            <StatCard label={t('transactionCount')} value={String(aggregates.count)} />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-900">{t('todaysTransactions')}</h2>
              {data.length > TODAY_PREVIEW_LIMIT && (
                <Link to="/transactions" className="text-sm font-semibold text-brand-600 hover:underline">
                  {t('showAll')}
                </Link>
              )}
            </div>
            {data.length === 0 ? (
              <EmptyState
                icon="🗒️"
                message={t('empty.noTransactionsToday')}
                action={{ label: t('addTransactionCta'), to: '/transactions/new' }}
              />
            ) : (
              <TransactionsTable
                transactions={visibleTransactions}
                onRowClick={() => navigate('/transactions')}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
