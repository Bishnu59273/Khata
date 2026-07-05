import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTransactions } from '../api/transactions';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import { EditTransactionModal } from '../components/transactions/EditTransactionModal';
import { DeleteTransactionModal } from '../components/transactions/DeleteTransactionModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import type { Transaction } from '../types/models';

export function TransactionsPage() {
  const { t } = useTranslation('transactions');
  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => getTransactions(),
  });
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {status === 'pending' && <LoadingState />}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState
            icon="🗒️"
            message={t('empty')}
            action={{ label: t('addTransactionCta', { ns: 'dashboard' }), to: '/transactions/new' }}
          />
        ) : (
          <TransactionsTable
            transactions={data}
            showDate
            onEdit={setEditingTx}
            onDelete={setDeletingTx}
          />
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
