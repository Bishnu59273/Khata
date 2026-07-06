import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { EmojiPicker } from '../ui/emoji-picker';
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
  const [emoji, setEmoji] = useState(service?.emoji ?? '🧰');
  const [showTranslations, setShowTranslations] = useState(
    !!(service && (service.name_hi !== service.name_en || service.name_bn !== service.name_en)),
  );
  const [charge, setCharge] = useState(String(service?.default_charge ?? ''));
  const [cost, setCost] = useState(String(service?.default_cost ?? ''));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['services'] });

  const saveMutation = useMutation({
    mutationFn: () => {
      const input = {
        name_en: nameEn.trim(),
        name_hi: nameHi.trim() || nameEn.trim(),
        name_bn: nameBn.trim() || nameEn.trim(),
        emoji,
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

  const canSave = !!nameEn.trim() && charge !== '' && !saveMutation.isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? t('editService') : t('addService')}</DialogTitle>
        </DialogHeader>

        <div className="mb-3 flex items-end gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('icon')}</label>
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('serviceName')}</label>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
              autoFocus
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTranslations((v) => !v)}
          className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          <ChevronDown size={16} className={showTranslations ? 'rotate-180 transition-transform' : 'transition-transform'} />
          {t('addTranslations')}
        </button>

        {showTranslations && (
          <div className="mb-1 flex flex-col gap-3 rounded-xl border border-border-soft bg-cream/50 p-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('nameHi')}</label>
              <input
                value={nameHi}
                onChange={(e) => setNameHi(e.target.value)}
                placeholder={nameEn}
                className="w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('nameBn')}</label>
              <input
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder={nameEn}
                className="w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
              />
            </div>
          </div>
        )}

        <div className="mt-4 mb-4 grid grid-cols-2 gap-3">
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

        <DialogFooter>
          {service && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-none"
              onClick={() => toggleActiveMutation.mutate()}
              disabled={toggleActiveMutation.isPending}
            >
              {service.is_active ? t('deactivate') : t('reactivate')}
            </Button>
          )}
          <Button type="button" size="lg" onClick={() => saveMutation.mutate()} disabled={!canSave}>
            {t('actions.save', { ns: 'common' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
