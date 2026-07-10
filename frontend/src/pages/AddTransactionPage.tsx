import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Check, Plus, Search, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { getActiveServices } from '../api/services';
import { createTransaction } from '../api/transactions';
import { ServicePresetCard } from '../components/transactions/ServicePresetCard';
import { PaymentModeToggle } from '../components/transactions/PaymentModeToggle';
import { ServiceFormModal } from '../components/services/ServiceFormModal';
import { CustomerPicker, type CustomerSelection } from '../components/customers/CustomerPicker';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { CardGridSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';
import { formatINR } from '../utils/currency';
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
  const [customer, setCustomer] = useState<CustomerSelection>({ customerId: null, name: '' });
  const [quantity, setQuantity] = useState('1');
  const [charge, setCharge] = useState('');
  const [cost, setCost] = useState('');
  const [chargeEdited, setChargeEdited] = useState(false);
  const [costEdited, setCostEdited] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [mode, setMode] = useState<PaymentMode>('cash');
  const [showAddService, setShowAddService] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const selectedService = services?.find((s) => s.id === selectedId) ?? null;
  const filteredServices = (services ?? []).filter((service) =>
    serviceName(service, i18n.language).toLowerCase().includes(serviceQuery.trim().toLowerCase())
  );

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(t('toast.created'));
      navigate('/dashboard');
    },
    onError: () => {
      toast.error(t('toast.saveError'));
    },
  });

  function pickService(service: Service) {
    setSelectedId(service.id);
    setQuantity('1');
    setCharge(String(service.default_charge));
    setCost(String(service.default_cost));
    setChargeEdited(false);
    setCostEdited(false);
    setAttempted(false);
  }

  function applyQuantity(nextQuantity: number) {
    const qty = Math.max(1, nextQuantity);
    setQuantity(String(qty));
    if (selectedService) {
      if (!chargeEdited) setCharge(String(selectedService.default_charge * qty));
      if (!costEdited) setCost(String(selectedService.default_cost * qty));
    }
  }

  const chargeNum = Number(charge || 0);
  const costNum = Number(cost || 0);
  const chargeInvalid = !(chargeNum > 0);
  const showChargeError = attempted && chargeInvalid;
  const showLossWarning = !chargeInvalid && costNum > chargeNum;
  const udhaarNeedsCustomer = mode === 'udhaar' && !customer.customerId;
  const showUdhaarError = attempted && udhaarNeedsCustomer;

  function handleSave() {
    if (!selectedService) return;
    setAttempted(true);
    if (chargeInvalid || udhaarNeedsCustomer) return;
    mutation.mutate({
      service_id: selectedService.id,
      customer_id: customer.customerId ?? undefined,
      customer_name: customer.name.trim() || undefined,
      customer_charge: chargeNum,
      cost_paid: costNum,
      quantity: Number(quantity || 1),
      payment_mode: mode,
    });
  }

  if (status === 'pending') return <CardGridSkeleton count={6} columnsClass="sm:grid-cols-2" />;
  if (status === 'error') return <ErrorState />;

  const liveProfit = chargeNum - costNum;
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
        <div className={showUdhaarError || udhaarNeedsCustomer ? 'mb-1.5' : 'mb-4'}>
          <CustomerPicker value={customer} onChange={setCustomer} />
        </div>
        {showUdhaarError && (
          <p className="mb-1.5 text-sm font-semibold text-danger-600">
            {t('udhaarNeedsCustomer', { ns: 'customers' })}
          </p>
        )}
        {udhaarNeedsCustomer && customer.name.trim() && (
          <button
            type="button"
            onClick={() => setShowAddCustomer(true)}
            className="mb-4 flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
          >
            <Plus size={14} />
            {t('quickCreate', { ns: 'customers', name: customer.name.trim() })}
          </button>
        )}
        {udhaarNeedsCustomer && !customer.name.trim() && <div className="mb-2.5" />}

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
        <div
          className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 ${
            showChargeError ? 'border-danger-600' : 'border-border-soft'
          } ${showChargeError ? 'mb-1.5' : 'mb-4'}`}
        >
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={charge}
            onChange={(e) => {
              setCharge(e.target.value);
              setChargeEdited(true);
            }}
            placeholder="0"
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>
        {showChargeError && (
          <p className="mb-4 text-sm font-semibold text-danger-600">
            {t('validation.chargePositive', { ns: 'common' })}
          </p>
        )}

        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('costPaid')}</label>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
          <span className="text-lg font-bold text-ink-600">₹</span>
          <input
            type="number"
            value={cost}
            onChange={(e) => {
              setCost(e.target.value);
              setCostEdited(true);
            }}
            placeholder="0"
            className="w-full bg-transparent py-3 text-xl font-bold text-ink-900 outline-none"
          />
        </div>

        {showLossWarning && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-cost-600/30 bg-cost-600/[8%] px-3.5 py-2.5 text-sm font-semibold text-cost-600">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            {t('validation.negativeProfitWarning', { ns: 'common' })}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between rounded-xl border border-success-border bg-success-bg px-4 py-3">
          <span className="text-sm font-semibold text-[#4d7a5e]">{t('table.profit', { ns: 'dashboard' })}</span>
          <span className="text-2xl font-bold text-success-600">{formatINR(liveProfit)}</span>
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

      {showAddCustomer && (
        <CustomerFormModal
          customer={null}
          initialName={customer.name.trim()}
          onClose={() => setShowAddCustomer(false)}
          onCreated={(created) => setCustomer({ customerId: created.id, name: created.name })}
        />
      )}
    </div>
  );
}
