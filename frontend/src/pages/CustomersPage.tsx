import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { getCustomers } from '../api/customers';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { TableSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { StatCard } from '../components/dashboard/StatCard';
import { formatINR } from '../utils/currency';

export function CustomersPage() {
  const { t } = useTranslation('customers');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const { data, status, error } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
  });

  const query = search.trim().toLowerCase();
  const filtered = (data ?? []).filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query) ||
      (c.phone ?? '').toLowerCase().includes(query)
  );
  const totalDues = (data ?? []).reduce((sum, c) => sum + Math.max(0, c.balance), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StatCard label={t('totalDues')} value={formatINR(totalDues)} tone="cost" />
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2.5 rounded-xl bg-brand-500 px-5 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-600"
        >
          <Plus size={20} />
          {t('addCustomer')}
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-border-soft bg-surface py-2.5 pl-10 pr-3.5 text-sm font-medium text-ink-900 outline-none"
        />
      </div>

      {status === 'pending' && <TableSkeleton />}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' &&
        (filtered.length === 0 ? (
          <EmptyState icon="👥" message={t('empty')} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface">
            {filtered.map((customer, index) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => navigate(`/customers/${customer.id}`)}
                className={`flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-brand-50/40 ${
                  index > 0 ? 'border-t border-border-row' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-ink-900">
                    {customer.name}
                  </span>
                  {customer.phone && (
                    <span className="block truncate text-sm text-ink-600">{customer.phone}</span>
                  )}
                </span>
                {customer.balance > 0 ? (
                  <span className="shrink-0 rounded-full bg-[#fbeeee] px-3 py-1 text-sm font-bold text-[#b4443f]">
                    {formatINR(customer.balance)}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-success-bg px-3 py-1 text-sm font-semibold text-success-600">
                    {t('settled')}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

      {showAdd && <CustomerFormModal customer={null} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
