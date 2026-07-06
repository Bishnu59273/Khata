import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PasswordInput({
  value,
  onChange,
  autoComplete,
  className = 'mb-4',
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
}) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 pr-11 text-base font-medium text-ink-900"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={t(visible ? 'actions.hidePassword' : 'actions.showPassword')}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-600 hover:text-ink-900"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
