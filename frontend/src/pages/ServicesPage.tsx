import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { getAllServices } from '../api/services';
import { ServiceFormModal } from '../components/services/ServiceFormModal';
import { CardGridSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { formatINRWhole } from '../utils/currency';
import type { Service } from '../types/models';

export function ServicesPage() {
  const { t, i18n } = useTranslation('services');
  const { data, status, error } = useQuery({
    queryKey: ['services', 'all'],
    queryFn: getAllServices,
  });
  // undefined = modal closed, null = create mode, Service = edit mode
  const [editing, setEditing] = useState<Service | null | undefined>(undefined);

  function serviceName(service: Service) {
    if (i18n.language === 'hi') return service.name_hi;
    if (i18n.language === 'bn') return service.name_bn;
    return service.name_en;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink-900">{t('title')}</h2>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex items-center gap-2.5 rounded-xl bg-brand-500 px-5 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-600"
        >
          <Plus size={20} />
          {t('addService')}
        </button>
      </div>

      {status === 'pending' && <CardGridSkeleton />}
      {status === 'error' && (
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      )}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState message={t('empty')} />
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((service) => {
              const profit = service.default_charge - service.default_cost;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setEditing(service)}
                  className={`flex items-start gap-3.5 rounded-2xl border-2 border-border-soft p-4 text-left transition-colors ${
                    service.is_active ? 'bg-surface' : 'bg-brand-50/40 opacity-60'
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                    {service.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[15px] font-bold text-ink-900">
                        {serviceName(service)}
                      </div>
                      {!service.is_active && (
                        <span className="shrink-0 rounded-full bg-[#f4ede1] px-2 py-0.5 text-xs font-semibold text-ink-600">
                          {t('inactive')}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-600">
                      {formatINRWhole(service.default_charge)} · +{formatINRWhole(profit)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}

      {editing !== undefined && (
        <ServiceFormModal service={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
