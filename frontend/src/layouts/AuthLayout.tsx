import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

export function AuthLayout() {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <Home size={20} className="text-white" />
          </div>
          <div className="text-lg font-bold text-ink-900">{t('appName')}</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-surface p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
