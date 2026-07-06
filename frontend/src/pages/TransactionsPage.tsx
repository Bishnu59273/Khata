import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTransactionsPaged } from '../api/transactions';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import { EditTransactionModal } from '../components/transactions/EditTransactionModal';
import { DeleteTransactionModal } from '../components/transactions/DeleteTransactionModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';
import type { Transaction } from '../types/models';

const PAGE_SIZE = 50;

export function TransactionsPage() {
  const { t } = useTranslation('transactions');
  const [page, setPage] = useState(1);
  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'paged', page],
    queryFn: () => getTransactionsPaged({ page, limit: PAGE_SIZE }),
  });
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-6">
      {status === 'pending' && <LoadingState />}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' &&
        (data.data.length === 0 ? (
          <EmptyState
            icon="🗒️"
            message={t('empty')}
            action={{ label: t('addTransactionCta', { ns: 'dashboard' }), to: '/transactions/new' }}
          />
        ) : (
          <>
            <TransactionsTable
              transactions={data.data}
              showDate
              onEdit={setEditingTx}
              onDelete={setDeletingTx}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ))}

      {editingTx && (
        <EditTransactionModal transaction={editingTx} onClose={() => setEditingTx(null)} />
      )}

      {deletingTx && (
        <DeleteTransactionModal transaction={deletingTx} onClose={() => setDeletingTx(null)} />
      )}
    </div>
  );
}
