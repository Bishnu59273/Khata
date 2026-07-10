import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Check, Plus, Search } from 'lucide-react';
import { getActiveServices } from '../api/services';
import { createTransaction } from '../api/transactions';
import { ServicePresetCard } from '../components/transactions/ServicePresetCard';
import { PaymentModeToggle } from '../components/transactions/PaymentModeToggle';
import { ServiceFormModal } from '../components/services/ServiceFormModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import type { PaymentMode, Service } from '../types/models';

function serviceName(service: Service, lang: string): string {
  if (lang === 'hi') return service.name_hi;
  if (lang === 'bn') return service.name_bn;
  return service.name_en;
}

export function AddTransactionPage() {
  const { t, i18n } = useTranslation('transactions');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: services, status } = useQuery({
    queryKey: ['services'],
    queryFn: getActiveServices,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [serviceQuery, setServiceQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [charge, setCharge] = useState('');
  const [cost, setCost] = useState('');
  const [mode, setMode] = useState<PaymentMode>('cash');
  const [showAddService, setShowAddService] = useState(false);

  const selectedService = services?.find((s) => s.id === selectedId) ?? null;
  const filteredServices = (services ?? []).filter((service) =>
    serviceName(service, i18n.language).toLowerCase().includes(serviceQuery.trim().toLowerCase())
  );

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      navigate('/dashboard');
    },
  });

  function pickService(service: Service) {
    setSelectedId(service.id);
    setQuantity('1');
    setCharge(String(service.default_charge));
    setCost(String(service.default_cost));
  }

  function applyQuantity(nextQuantity: number) {
    const qty = Math.max(1, nextQuantity);
    setQuantity(String(qty));
    if (selectedService) {
      setCharge(String(selectedService.default_charge * qty));
      setCost(String(selectedService.default_cost * qty));
    }
  }

  function handleSave() {
    if (!selectedService) return;
    mutation.mutate({
      service_id: selectedService.id,
      customer_name: customerName.trim() || undefined,
      customer_charge: Number(charge || 0),
      cost_paid: Number(cost || 0),
      quantity: Number(quantity || 1),
      payment_mode: mode,
    });
  }

  if (status === 'pending') return <LoadingState />;
  if (status === 'error') return <ErrorState />;

  const liveProfit = Number(charge || 0) - Number(cost || 0);
  const canSave = !!selectedService && !mutation.isPending;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink-900">{t('selectService')}</h2>
          <button
            type="button"
            onClick={() => setShowAddService(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border-soft bg-white px-3 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50"
          >
            <Plus size={16} />
            {t('addService', { ns: 'services' })}
          </button>
        </div>
        <div className="relative mb-3.5">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600" />
          <input
            type="text"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            placeholder={t('searchServicePlaceholder')}
            className="w-full rounded-xl border border-border-soft bg-white py-3 pl-10 pr-3.5 text-base font-medium text-ink-900 outline-none"
          />
        </div>
        {filteredServices.length === 0 ? (
          <p className="text-sm text-ink-600">{t('noServicesFound')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {filteredServices.map((service) => (
              <ServicePresetCard
                key={service.id}
                service={service}
                name={serviceName(service, i18n.language)}
                selected={service.id === selectedId}
                onClick={() => pickService(service)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border-soft bg-surface p-6">
        <h2 className="text-base font-bold text-ink-900">{t('entryDetails')}</h2>
        <p className="mb-4 text-xs text-ink-600">
          {selectedService ? serviceName(selectedService, i18n.language) : t('selectPrompt')}
        </p>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t('customerName')}
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder={t('customerNamePlaceholder')}
          className="mb-4 w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-base font-medium text-ink-900 outline-none"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('quantity')}</label>
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => applyQuantity(Number(quantity || 1) - 1)}
            disabled={!selectedService}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-soft bg-white text-lg font-bold text-ink-700 disabled:opacity-50"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            disabled={!selectedService}
            onChange={(e) => applyQuantity(Number(e.target.value || 1))}
            className="w-full rounded-xl border border-border-soft bg-white px-3.5 py-3 text-center text-xl font-bold text-ink-900 outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => applyQuantity(Number(quantity || 1) + 1)}
            disabled={!selectedService}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-soft bg-white text-lg font-bold text-ink-700 disabled:opacity-50"
          >
            +
          </button>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
          {t('customerCharge')}
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
            placeholder="0"
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
            placeholder="0"
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-success-border bg-success-bg px-4 py-3">
          <span className="text-sm font-semibold text-[#4d7a5e]">{t('table.profit', { ns: 'dashboard' })}</span>
          <span className="text-2xl font-bold text-success-600">₹{liveProfit.toFixed(2)}</span>
        </div>

        <label className="mb-2 block text-sm font-semibold text-ink-700">
          {t('paymentModeLabel')}
        </label>
        <div className="mb-5">
          <PaymentModeToggle value={mode} onChange={setMode} />
        </div>

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-base font-bold transition-colors ${
            canSave
              ? 'bg-brand-500 text-white shadow-sm hover:bg-brand-600'
              : 'cursor-not-allowed bg-[#e6ddce] text-[#b3a894]'
          }`}
        >
          <Check size={20} />
          {t('save')}
        </button>
      </div>

      {showAddService && (
        <ServiceFormModal service={null} onClose={() => setShowAddService(false)} />
      )}
    </div>
  );
}
