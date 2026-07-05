import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { getExpenses, createExpense } from '../api/expenses';
import { getPresetRange } from '../utils/dateRanges';
import { StatCard } from '../components/dashboard/StatCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';
import { expenseCategoryStyle, EXPENSE_CATEGORIES } from '../utils/expenseCategory';
import { localeForLang } from '../utils/formatDate';
import type { Expense } from '../types/models';

const CATEGORY_OPTIONS = [...EXPENSE_CATEGORIES, 'other'];

export function ExpensesPage() {
  const { t, i18n } = useTranslation('expenses');
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('fixed');
  const [amount, setAmount] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const monthRange = getPresetRange('month');
  const { data, status, error } = useQuery({
    queryKey: ['expenses', 'range', monthRange.from, monthRange.to],
    queryFn: () => getExpenses(monthRange),
  });

  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setDescription('');
      setAmount('');
      setCategory('fixed');
      setShowForm(false);
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    mutation.mutate({ description: description.trim(), category, amount: Number(amount) });
  }

  const total = (data ?? []).reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StatCard label={t('totalThisMonth')} value={`₹${total.toFixed(2)}`} tone="cost" />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2.5 rounded-xl bg-brand-500 px-5 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-600"
        >
          <Plus size={20} />
          {t('addExpense')}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-border-soft bg-surface p-6 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-700">
            {t('form.description')}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-700">
            {t('form.category')}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-700">
            {t('form.amount')}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
              required
            />
          </label>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-base font-bold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {t('actions.save', { ns: 'common' })}
          </button>
        </form>
      )}

      {status === 'pending' && <LoadingState />}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState message={t('empty')} />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface">
            <table className="w-full text-left text-[14.5px]">
              <thead>
                <tr className="bg-tablehead">
                  <th className="px-5 py-3 font-semibold text-ink-700">{t('table.description')}</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">{t('table.category')}</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-700">
                    {t('table.amount')}
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-ink-700">
                    {t('table.date')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => setEditingExpense(expense)}
                    className="cursor-pointer border-t border-border-row hover:bg-brand-50/40"
                  >
                    <td className="px-5 py-3 font-semibold text-ink-900">{expense.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                        style={expenseCategoryStyle(expense.category)}
                      >
                        {t(`categories.${expense.category}`, expense.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-ink-900">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right text-ink-600">
                      {new Date(expense.created_at).toLocaleDateString(localeForLang(i18n.language), {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {editingExpense && (
        <EditExpenseModal expense={editingExpense} onClose={() => setEditingExpense(null)} />
      )}
    </div>
  );
}
