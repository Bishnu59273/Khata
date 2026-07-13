import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { PaymentModeToggle } from '../transactions/PaymentModeToggle';
import { createCustomerPayment } from '../../api/customers';
import { formatINR } from '../../utils/currency';
import type { CustomerWithBalance, SettlementMode } from '../../types/models';

const SETTLEMENT_MODES: SettlementMode[] = ['cash', 'upi'];

export function RecordPaymentModal({
  customer,
  onClose,
}: {
  customer: CustomerWithBalance;
  onClose: () => void;
}) {
  const { t } = useTranslation('customers');
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<SettlementMode>('cash');
  const [note, setNote] = useState('');
  const [attempted, setAttempted] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      createCustomerPayment(customer.id, {
        amount: Number(amount),
        payment_mode: mode,
        note: note.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(t('toast.paymentRecorded'));
      onClose();
    },
    onError: () => {
      toast.error(t('toast.paymentError'));
    },
  });

  const amountInvalid = !(Number(amount) > 0);
  // A khata payment settles dues; more than the outstanding balance would
  // push the customer into advance credit, which is almost always a typo.
  const exceedsDue = !amountInvalid && Number(amount) > customer.balance;
  const showAmountError = attempted && amountInvalid;
  const showExceedsError = attempted && exceedsDue;

  function handleSave() {
    setAttempted(true);
    if (amountInvalid || exceedsDue) return;
    mutation.mutate();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('recordPayment')}</DialogTitle>
        </DialogHeader>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-border-soft bg-cream/50 px-4 py-3">
          <span className="text-sm font-semibold text-ink-700">{customer.name}</span>
          <span className="text-sm font-bold text-danger-600">
            {t('due')}: {formatINR(customer.balance)}
          </span>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t('paymentAmount')}
        </label>
        <div
          className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 ${
            showAmountError || showExceedsError ? 'mb-1.5 border-danger-600' : 'mb-4 border-border-soft'
          }`}
        >
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            autoFocus
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>
        {showAmountError && (
          <p className="mb-4 text-sm font-semibold text-danger-600">
            {t('validation.amountPositive', { ns: 'common' })}
          </p>
        )}
        {showExceedsError && (
          <p className="mb-4 text-sm font-semibold text-danger-600">
            {t('paymentExceedsDue', { amount: formatINR(Math.max(0, customer.balance)) })}
          </p>
        )}

        <label className="mb-2 block text-sm font-semibold text-ink-700">
          {t('paymentModeLabel', { ns: 'transactions' })}
        </label>
        <div className="mb-4">
          <PaymentModeToggle value={mode} onChange={setMode} modes={SETTLEMENT_MODES} />
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('paymentNote')}</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('optional')}
          className="mb-5 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
        />

        <DialogFooter>
          <Button type="button" variant="success" size="lg" className="w-full" onClick={handleSave} disabled={mutation.isPending}>
            {t('recordPayment')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
