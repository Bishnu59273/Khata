import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { PaymentModeToggle } from './PaymentModeToggle';
import { getAllServices } from '../../api/services';
import { updateTransaction, deleteTransaction } from '../../api/transactions';
import type { PaymentMode, Service, Transaction } from '../../types/models';

function serviceName(service: Service, lang: string): string {
  if (lang === 'hi') return service.name_hi;
  if (lang === 'bn') return service.name_bn;
  return service.name_en;
}

export function EditTransactionModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation('transactions');
  const queryClient = useQueryClient();

  const { data: services } = useQuery({ queryKey: ['services', 'all'], queryFn: getAllServices });

  const [serviceId, setServiceId] = useState(transaction.service_id);
  const [charge, setCharge] = useState(String(transaction.customer_charge));
  const [cost, setCost] = useState(String(transaction.cost_paid));
  const [mode, setMode] = useState<PaymentMode>(transaction.payment_mode);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['transactions'] });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateTransaction(transaction.id, {
        service_id: serviceId,
        customer_charge: Number(charge || 0),
        cost_paid: Number(cost || 0),
        payment_mode: mode,
      }),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTransaction(transaction.id),
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

  const liveProfit = Number(charge || 0) - Number(cost || 0);

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-ink-900">{t('entryDetails')}</h2>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('selectService')}</label>
      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      >
        {(services ?? []).map((service) => (
          <option key={service.id} value={service.id}>
            {serviceName(service, i18n.language)}
          </option>
        ))}
      </select>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('customerCharge')}</label>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
        <span className="text-lg font-bold text-ink-600">₹</span>
        <input
          type="number"
          value={charge}
          onChange={(e) => setCharge(e.target.value)}
          className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
        />
      </div>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('costPaid')}</label>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
        <span className="text-lg font-bold text-ink-600">₹</span>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
        />
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-success-border bg-success-bg px-4 py-3">
        <span className="text-sm font-semibold text-[#4d7a5e]">{t('table.profit', { ns: 'dashboard' })}</span>
        <span className="text-2xl font-bold text-success-600">₹{liveProfit.toFixed(2)}</span>
      </div>

      <label className="mb-2 block text-sm font-semibold text-ink-700">{t('paymentModeLabel')}</label>
      <div className="mb-5">
        <PaymentModeToggle value={mode} onChange={setMode} />
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
          disabled={saveMutation.isPending}
          className="flex-1 rounded-xl bg-brand-500 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-600"
        >
          {t('actions.save', { ns: 'common' })}
        </button>
      </div>
    </Modal>
  );
}
