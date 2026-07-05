import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { createService, updateService } from '../../api/services';
import type { Service } from '../../types/models';

export function ServiceFormModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const { t } = useTranslation('services');
  const queryClient = useQueryClient();

  const [nameEn, setNameEn] = useState(service?.name_en ?? '');
  const [nameHi, setNameHi] = useState(service?.name_hi ?? '');
  const [nameBn, setNameBn] = useState(service?.name_bn ?? '');
  const [charge, setCharge] = useState(String(service?.default_charge ?? ''));
  const [cost, setCost] = useState(String(service?.default_cost ?? ''));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['services'] });

  const saveMutation = useMutation({
    mutationFn: () => {
      const input = {
        name_en: nameEn.trim(),
        name_hi: nameHi.trim(),
        name_bn: nameBn.trim(),
        default_charge: Number(charge || 0),
        default_cost: Number(cost || 0),
      };
      return service ? updateService(service.id, input) : createService(input);
    },
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: () => updateService(service!.id, { is_active: !service!.is_active }),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const canSave =
    !!nameEn.trim() && !!nameHi.trim() && !!nameBn.trim() && charge !== '' && !saveMutation.isPending;

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-ink-900">
        {service ? t('editService') : t('addService')}
      </h2>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('nameEn')}</label>
      <input
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('nameHi')}</label>
      <input
        value={nameHi}
        onChange={(e) => setNameHi(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('nameBn')}</label>
      <input
        value={nameBn}
        onChange={(e) => setNameBn(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('defaultCharge')}</label>
          <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
            <span className="text-ink-600">₹</span>
            <input
              type="number"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              className="w-full bg-transparent py-2.5 text-base font-bold text-ink-900 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('defaultCost')}</label>
          <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
            <span className="text-ink-600">₹</span>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full bg-transparent py-2.5 text-base font-bold text-ink-900 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {service && (
          <button
            type="button"
            onClick={() => toggleActiveMutation.mutate()}
            disabled={toggleActiveMutation.isPending}
            className="rounded-xl border-2 border-border-soft px-4 py-3 text-sm font-bold text-ink-700 hover:bg-brand-50"
          >
            {service.is_active ? t('deactivate') : t('reactivate')}
          </button>
        )}
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
