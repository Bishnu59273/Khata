import { useTranslation } from 'react-i18next';

// Future: table of shop expenses with an "Add Expense" form/modal hitting
// the expenses CRUD endpoints in api/expenses.ts.
export function ExpensesPage() {
  const { t } = useTranslation('expenses');
  return (
    <div className="rounded-2xl bg-surface p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-ink-900">{t('title')}</h1>
      <p className="mt-2 text-lg text-ink-600">{t('comingSoon')}</p>
    </div>
  );
}
