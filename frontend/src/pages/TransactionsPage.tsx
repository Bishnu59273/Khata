import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Receipt } from 'lucide-react';
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
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const { data, status, error } = useQuery({
    queryKey: ['transactions', 'paged', page, customerName],
    queryFn: () => getTransactionsPaged({ page, limit: PAGE_SIZE, customerName: customerName || undefined }),
  });
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleGenerateBill() {
    const selected = (data?.data ?? []).filter((tx) => selectedIds.has(tx.id));
    navigate('/bills/preview', { state: { transactions: selected } });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            setPage(1);
          }}
          placeholder={t('customerSearchPlaceholder')}
          className="w-full max-w-xs rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={handleGenerateBill}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors ${
            selectedIds.size === 0
              ? 'cursor-not-allowed bg-[#e6ddce] text-[#b3a894]'
              : 'bg-brand-500 text-white hover:bg-brand-600'
          }`}
        >
          <Receipt size={16} />
          {t('generateBill')}
        </button>
      </div>

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
              selectable
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
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
