import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, HandCoins, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/alert-dialog';
import { deleteCustomer, deleteCustomerPayment, getCustomerStatement } from '../api/customers';
import { ApiError } from '../api/client';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { RecordPaymentModal } from '../components/customers/RecordPaymentModal';
import { TableSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { paymentModePillStyle } from '../utils/paymentMode';
import { localeForLang } from '../utils/formatDate';
import { formatINR } from '../utils/currency';
import type { ServiceSummary, StatementEntry } from '../types/models';

function serviceLabel(service: ServiceSummary | null, lang: string): string {
  if (!service) return '—';
  if (lang === 'hi') return service.name_hi;
  if (lang === 'bn') return service.name_bn;
  return service.name_en;
}

function formatEntryDate(isoString: string, lang: string): string {
  return new Date(isoString).toLocaleDateString(localeForLang(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function CustomerDetailPage() {
  const { t, i18n } = useTranslation('customers');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showEdit, setShowEdit] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<StatementEntry | null>(null);

  const { data, status, error } = useQuery({
    queryKey: ['customers', id, 'statement'],
    queryFn: () => getCustomerStatement(id!),
    enabled: !!id,
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => deleteCustomerPayment(id!, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(t('toast.paymentDeleted'));
      setDeletingPayment(null);
    },
    onError: () => {
      toast.error(t('toast.paymentDeleteError'));
      setDeletingPayment(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCustomer(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(t('toast.deleted'));
      navigate('/customers');
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(t('toast.hasBalance'));
      } else {
        toast.error(t('toast.error'));
      }
      setConfirmDelete(false);
    },
  });

  if (status === 'pending') return <TableSkeleton />;
  if (status === 'error') {
    return <ErrorState message={error instanceof Error ? error.message : undefined} />;
  }

  const { customer, entries } = data;
  // Statement arrives oldest-first (running balance is computed that way);
  // show newest entries at the top.
  const displayEntries: StatementEntry[] = [...entries].reverse();

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/customers"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
      >
        <ArrowLeft size={16} />
        {t('title')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border-soft bg-surface p-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-ink-900">{customer.name}</h2>
          {customer.phone && <p className="mt-0.5 text-sm text-ink-600">{customer.phone}</p>}
          {customer.notes && <p className="mt-1 text-sm text-ink-600">{customer.notes}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              aria-label={t('actions.edit', { ns: 'common' })}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft text-ink-700 hover:bg-brand-50"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              aria-label={t('actions.delete', { ns: 'common' })}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft text-danger-600 hover:bg-danger-600/[8%]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-ink-600">{t('table.balance')}</p>
          <p
            className={`text-3xl font-bold ${
              customer.balance > 0 ? 'text-[#b4443f]' : 'text-success-600'
            }`}
          >
            {formatINR(customer.balance)}
          </p>
          <p className="mt-1 text-xs text-ink-600">
            {t('totalUdhaar')}: {formatINR(customer.total_udhaar)} · {t('totalPaid')}:{' '}
            {formatINR(customer.total_paid)}
          </p>
          <button
            type="button"
            onClick={() => setShowPayment(true)}
            className="mt-3 flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-600"
          >
            <HandCoins size={18} />
            {t('recordPayment')}
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-bold text-ink-900">{t('statement')}</h2>
        {displayEntries.length === 0 ? (
          <EmptyState icon="🗒️" message={t('statementEmpty')} />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface">
            <table className="w-full text-left text-[14.5px]">
              <thead>
                <tr className="bg-tablehead">
                  <th className="px-5 py-3 font-semibold text-ink-700">{t('ledger.date')}</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">{t('ledger.detail')}</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-700">
                    {t('ledger.udhaar')}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-700">
                    {t('ledger.paid')}
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-ink-700">
                    {t('ledger.balance')}
                  </th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {displayEntries.map((entry) => (
                  <tr key={`${entry.type}-${entry.id}`} className="border-t border-border-row">
                    <td className="px-5 py-3 text-ink-600">
                      {formatEntryDate(entry.created_at, i18n.language)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.type === 'udhaar' ? (
                        <span className="font-semibold text-ink-900">
                          {serviceLabel(entry.service, i18n.language)}
                          {entry.quantity != null && entry.quantity > 1 && (
                            <span className="ml-1 text-sm font-medium text-ink-600">
                              ×{entry.quantity}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-success-600">
                            {t('paymentReceived')}
                          </span>
                          {entry.payment_mode && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                              style={paymentModePillStyle(entry.payment_mode)}
                            >
                              {t(`paymentMode.${entry.payment_mode}`, { ns: 'transactions' })}
                            </span>
                          )}
                          {entry.note && <span className="text-xs text-ink-600">{entry.note}</span>}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#b4443f]">
                      {entry.type === 'udhaar' ? formatINR(entry.amount) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-success-600">
                      {entry.type === 'payment' ? formatINR(entry.amount) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-ink-900">
                      {formatINR(entry.running_balance)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {entry.type === 'payment' && (
                        <button
                          type="button"
                          onClick={() => setDeletingPayment(entry)}
                          aria-label={t('deletePayment')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-danger-600 hover:bg-danger-600/[8%]"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEdit && <CustomerFormModal customer={customer} onClose={() => setShowEdit(false)} />}
      {showPayment && (
        <RecordPaymentModal customer={customer} onClose={() => setShowPayment(false)} />
      )}

      <AlertDialog
        open={!!deletingPayment}
        onOpenChange={(open) => !open && setDeletingPayment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deletePayment')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deletePaymentConfirm', {
                amount: deletingPayment ? formatINR(deletingPayment.amount) : '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel', { ns: 'common' })}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deletePaymentMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deletingPayment) deletePaymentMutation.mutate(deletingPayment.id);
              }}
            >
              {t('actions.delete', { ns: 'common' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCustomer')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmMessage', { name: customer.name })}
            </AlertDialogDescription>
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
    </div>
  );
}
