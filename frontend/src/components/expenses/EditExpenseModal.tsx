import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);

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
      toast.success(t('toast.updated'));
      onClose();
    },
    onError: () => {
      toast.error(t('toast.error'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteExpense(expense.id),
    onSuccess: () => {
      invalidate();
      toast.success(t('toast.deleted'));
      onClose();
    },
    onError: () => {
      toast.error(t('toast.error'));
    },
  });

  const descriptionMissing = !description.trim();
  const amountInvalid = !(Number(amount) > 0);
  const showDescriptionError = attempted && descriptionMissing;
  const showAmountError = attempted && amountInvalid;

  function handleSave() {
    setAttempted(true);
    if (descriptionMissing || amountInvalid) return;
    saveMutation.mutate();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editExpense')}</DialogTitle>
        </DialogHeader>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('form.description')}</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-base font-medium text-ink-900 ${
            showDescriptionError ? 'mb-1.5 border-danger-600' : 'mb-3 border-border-soft'
          }`}
        />
        {showDescriptionError && (
          <p className="mb-3 text-sm font-semibold text-danger-600">
            {t('validation.descriptionRequired', { ns: 'common' })}
          </p>
        )}

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
        <div
          className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 ${
            showAmountError ? 'mb-1.5 border-danger-600' : 'mb-5 border-border-soft'
          }`}
        >
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>
        {showAmountError && (
          <p className="mb-5 text-sm font-semibold text-danger-600">
            {t('validation.amountPositive', { ns: 'common' })}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="flex-none"
            onClick={() => setConfirmDeleteOpen(true)}
            disabled={deleteMutation.isPending}
          >
            {t('actions.delete', { ns: 'common' })}
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {t('actions.save', { ns: 'common' })}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('actions.delete', { ns: 'common' })}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirmDelete', { ns: 'common' })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel', { ns: 'common' })}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate();
              }}
            >
              {t('actions.delete', { ns: 'common' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
