import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { getTodayTransactions } from '../api/transactions';
import { aggregateTransactions } from '../utils/aggregateTransactions';
import { ProfitHighlight } from '../components/dashboard/ProfitHighlight';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'today'],
    queryFn: getTodayTransactions,
  });

  const aggregates = aggregateTransactions(data ?? []);

  return (
    <div className="flex flex-col gap-6">
      {status === 'pending' && <LoadingState />}
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
            <StatCard label={t('totalCollected')} value={`₹${aggregates.totalCollected.toFixed(2)}`} />
            <StatCard
              label={t('totalCost')}
              value={`₹${aggregates.totalCost.toFixed(2)}`}
              tone="cost"
            />
            <StatCard label={t('transactionCount')} value={String(aggregates.count)} />
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-ink-900">{t('todaysTransactions')}</h2>
            {data.length === 0 ? (
              <EmptyState
                icon="🗒️"
                message={t('empty.noTransactionsToday')}
                action={{ label: t('addTransactionCta'), to: '/transactions/new' }}
              />
            ) : (
              <TransactionsTable transactions={data} onRowClick={() => navigate('/transactions')} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
