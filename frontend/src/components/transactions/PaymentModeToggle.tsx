import { useTranslation } from 'react-i18next';
import type { PaymentMode } from '../../types/models';

const MODES: PaymentMode[] = ['cash', 'upi', 'online'];

export function PaymentModeToggle({
  value,
  onChange,
}: {
  value: PaymentMode;
  onChange: (mode: PaymentMode) => void;
}) {
  const { t } = useTranslation('transactions');

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-xl border-2 py-3.5 text-base font-bold transition-colors ${
            value === mode
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-border-soft bg-surface text-ink-900'
          }`}
        >
          {t(`paymentMode.${mode}`)}
        </button>
      ))}
    </div>
  );
}
