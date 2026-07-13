import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Check, ChevronsUpDown, Plus, Search, X } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/animate-ui/primitives/radix/popover';
import { getCustomers } from '../../api/customers';
import { formatINR } from '../../utils/currency';

export interface CustomerSelection {
  customerId: string | null;
  name: string;
}

/**
 * Searchable select over saved customers. Picking a row links the transaction
 * to that customer record; the "use typed name" row keeps walk-ins possible
 * (customerId stays null, only the name is stored).
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
  const [search, setSearch] = useState('');

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
  });

  const query = search.trim().toLowerCase();
  const filtered = (customers ?? []).filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query) ||
      (c.phone ?? '').toLowerCase().includes(query)
  );

  function pick(selection: CustomerSelection) {
    onChange(selection);
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setSearch('');
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-xl border border-border-soft bg-white px-3.5 py-3 text-left"
        >
          {value.name ? (
            <span className="min-w-0 flex-1 truncate text-base font-medium text-ink-900">
              {value.name}
            </span>
          ) : (
            <span className="min-w-0 flex-1 truncate text-base font-medium text-ink-600">
              {t('customerNamePlaceholder', { ns: 'transactions' })}
            </span>
          )}
          {value.customerId && <Check size={18} className="shrink-0 text-success-600" />}
          {value.name && (
            <span
              role="button"
              tabIndex={-1}
              aria-label={t('actions.delete', { ns: 'common' })}
              onClick={(e) => {
                e.stopPropagation();
                onChange({ customerId: null, name: '' });
              }}
              className="shrink-0 rounded-full p-0.5 text-ink-600 hover:bg-brand-50"
            >
              <X size={16} />
            </span>
          )}
          <ChevronsUpDown size={16} className="shrink-0 text-ink-600" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="z-50 overflow-hidden rounded-xl border border-border-soft bg-white p-0 shadow-lg"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <div className="flex items-center gap-2 border-b border-border-row px-3.5">
          <Search size={16} className="shrink-0 text-ink-600" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('pickerSearchPlaceholder')}
            className="w-full bg-transparent py-2.5 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-600"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="shrink-0 rounded-full p-0.5 text-ink-600 hover:bg-brand-50"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto overscroll-contain p-1">
          {/* Walk-in: keep the typed name without linking a customer record. */}
          {search.trim() && (
            <button
              type="button"
              onClick={() => pick({ customerId: null, name: search.trim() })}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm font-semibold text-brand-600 hover:bg-brand-50"
            >
              <Plus size={14} className="shrink-0" />
              <span className="truncate">{t('pickerWalkIn', { name: search.trim() })}</span>
            </button>
          )}

          {filtered.length === 0 && !search.trim() ? (
            <p className="px-2.5 py-5 text-center text-sm text-ink-600">{t('pickerNoResults')}</p>
          ) : (
            filtered.map((customer) => {
              const selected = customer.id === value.customerId;
              return (
                <button
                  key={customer.id}
                  type="button"
                  aria-selected={selected}
                  onClick={() => pick({ customerId: customer.id, name: customer.name })}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-brand-50 ${
                    selected ? 'bg-brand-50' : ''
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Check
                      size={16}
                      className={`shrink-0 text-brand-600 ${selected ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {customer.name}
                      </span>
                      {customer.phone && (
                        <span className="block truncate text-xs text-ink-600">
                          {customer.phone}
                        </span>
                      )}
                    </span>
                  </span>
                  {customer.balance > 0 && (
                    <span className="shrink-0 rounded-full bg-[#fbeeee] px-2.5 py-0.5 text-xs font-semibold text-[#b4443f]">
                      {formatINR(customer.balance)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
