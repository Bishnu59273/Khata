import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { updateExpense, deleteExpense } from '../../api/expenses';
import { EXPENSE_CATEGORIES } from '../../utils/expenseCategory';
import type { Expense } from '../../types/models';

const CATEGORY_OPTIONS = [...EXPENSE_CATEGORIES, 'other'];

export function EditExpenseModal({
  expense,
  onClose,
}: {
  expense: Expense;
  onClose: () => void;
}) {
  const { t } = useTranslation('expenses');
  const queryClient = useQueryClient();

  const [description, setDescription] = useState(expense.description);
  const [category, setCategory] = useState(expense.category);
  const [amount, setAmount] = useState(String(expense.amount));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['expenses'] });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateExpense(expense.id, {
        description: description.trim(),
        category,
        amount: Number(amount || 0),
      }),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteExpense(expense.id),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  function handleDelete() {
    if (window.confirm(t('confirmDelete', { ns: 'common' }))) {
      deleteMutation.mutate();
    }
  }

  const canSave = !!description.trim() && amount !== '' && !saveMutation.isPending;

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-ink-900">{t('editExpense')}</h2>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('form.description')}</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('form.category')}</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      >
        {CATEGORY_OPTIONS.map((cat) => (
          <option key={cat} value={cat}>
            {t(`categories.${cat}`, cat)}
          </option>
        ))}
      </select>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('form.amount')}</label>
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
        <span className="text-lg font-bold text-ink-600">₹</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="rounded-xl border-2 border-danger-600 px-5 py-3 text-base font-bold text-danger-600 transition-colors hover:bg-danger-600/[8%]"
        >
          {t('actions.delete', { ns: 'common' })}
        </button>
        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={!canSave}
          className="flex-1 rounded-xl bg-brand-500 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('actions.save', { ns: 'common' })}
        </button>
      </div>
    </Modal>
  );
}
