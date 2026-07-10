import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { getCustomers } from '../../api/customers';
import { formatINR } from '../../utils/currency';

export interface CustomerSelection {
  customerId: string | null;
  name: string;
}

/**
 * Combobox over saved customers. Free text keeps name-only (walk-in);
 * picking a suggestion links the transaction to that customer record.
 */
export function CustomerPicker({
  value,
  onChange,
}: {
  value: CustomerSelection;
  onChange: (selection: CustomerSelection) => void;
}) {
  const { t } = useTranslation('customers');
  const [open, setOpen] = useState(false);

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
  });

  const query = value.name.trim().toLowerCase();
  const suggestions = (customers ?? []).filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query) ||
      (c.phone ?? '').toLowerCase().includes(query)
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5">
        <input
          type="text"
          value={value.name}
          onChange={(e) => {
            onChange({ customerId: null, name: e.target.value });
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          placeholder={t('customerNamePlaceholder', { ns: 'transactions' })}
          className="w-full bg-transparent py-3 text-base font-medium text-ink-900 outline-none"
        />
        {value.customerId && <Check size={18} className="shrink-0 text-success-600" />}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border-soft bg-white shadow-md">
          {suggestions.map((customer) => (
            <button
              key={customer.id}
              type="button"
              // onMouseDown so the click lands before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault();
                onChange({ customerId: customer.id, name: customer.name });
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-brand-50"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {customer.name}
                </span>
                {customer.phone && (
                  <span className="block truncate text-xs text-ink-600">{customer.phone}</span>
                )}
              </span>
              {customer.balance > 0 && (
                <span className="shrink-0 rounded-full bg-[#fbeeee] px-2.5 py-0.5 text-xs font-semibold text-[#b4443f]">
                  {formatINR(customer.balance)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
