import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { createCustomer, updateCustomer } from '../../api/customers';
import type { Customer } from '../../types/models';

export function CustomerFormModal({
  customer,
  initialName = '',
  onClose,
  onCreated,
}: {
  customer: Customer | null;
  initialName?: string;
  onClose: () => void;
  onCreated?: (customer: Customer) => void;
}) {
  const { t } = useTranslation('customers');
  const queryClient = useQueryClient();

  const [name, setName] = useState(customer?.name ?? initialName);
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [notes, setNotes] = useState(customer?.notes ?? '');
  const [attempted, setAttempted] = useState(false);

  const saveMutation = useMutation({
    mutationFn: () => {
      const input = {
        name: name.trim(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      return customer ? updateCustomer(customer.id, input) : createCustomer(input);
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(customer ? t('toast.updated') : t('toast.created'));
      onCreated?.(saved);
      onClose();
    },
    onError: () => {
      toast.error(t('toast.error'));
    },
  });

  const nameMissing = !name.trim();
  const showNameError = attempted && nameMissing;

  function handleSave() {
    setAttempted(true);
    if (nameMissing) return;
    saveMutation.mutate();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? t('editCustomer') : t('addCustomer')}</DialogTitle>
        </DialogHeader>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('name')}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-base font-medium text-ink-900 ${
            showNameError ? 'mb-1.5 border-danger-600' : 'mb-3 border-border-soft'
          }`}
          autoFocus
        />
        {showNameError && (
          <p className="mb-3 text-sm font-semibold text-danger-600">
            {t('validation.nameRequired', { ns: 'common' })}
          </p>
        )}

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('phone')}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('optional')}
          className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('notes')}</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('optional')}
          className="mb-5 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
        />

        <DialogFooter>
          <Button type="button" size="lg" onClick={handleSave} disabled={saveMutation.isPending}>
            {t('actions.save', { ns: 'common' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
