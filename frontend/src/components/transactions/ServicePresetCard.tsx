import { useTranslation } from 'react-i18next';
import { serviceEmoji } from '../../utils/serviceEmoji';
import type { Service } from '../../types/models';

interface ServicePresetCardProps {
  service: Service;
  name: string;
  selected: boolean;
  onClick: () => void;
}

export function ServicePresetCard({ service, name, selected, onClick }: ServicePresetCardProps) {
  const { t } = useTranslation('transactions');
  const profit = service.default_charge - service.default_cost;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3.5 rounded-2xl p-4 text-left transition-colors ${
        selected
          ? 'border-2 border-brand-500 bg-brand-500/[8%]'
          : 'border-2 border-border-soft bg-surface'
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
          selected ? 'bg-brand-500/[13%]' : 'bg-brand-50'
        }`}
      >
        {serviceEmoji(service.name_en)}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[15px] font-bold leading-tight text-ink-900">{name}</div>
        <div className="mt-0.5 text-xs text-ink-600">
          ₹{service.default_charge.toFixed(0)} · {t('profitShort')} ₹{profit.toFixed(0)}
        </div>
      </div>
    </button>
  );
}
