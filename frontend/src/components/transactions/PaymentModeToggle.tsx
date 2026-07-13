import { useTranslation } from 'react-i18next';
import type { PaymentMode } from '../../types/models';

const DEFAULT_MODES: PaymentMode[] = ['cash', 'upi', 'udhaar'];

const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

export function PaymentModeToggle<M extends PaymentMode>({
  value,
  onChange,
  modes = DEFAULT_MODES as M[],
}: {
  value: M;
  onChange: (mode: M) => void;
  modes?: M[];
}) {
  const { t } = useTranslation('transactions');

  return (
    <div className={`grid gap-2.5 ${GRID_COLS[modes.length] ?? 'grid-cols-3'}`}>
      {modes.map((mode) => (
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
