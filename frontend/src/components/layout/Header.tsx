import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { LanguageSwitcher } from './LanguageSwitcher';
import { formatDateLine } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

const TITLE_NS_BY_PATH: { test: (path: string) => boolean; ns: string; titleKey?: string }[] = [
  { test: (p) => p === '/transactions', ns: 'transactions', titleKey: 'listTitle' },
  { test: (p) => p.startsWith('/transactions'), ns: 'transactions' },
  { test: (p) => p.startsWith('/reports'), ns: 'reports' },
  { test: (p) => p.startsWith('/expenses'), ns: 'expenses' },
  { test: (p) => p.startsWith('/services'), ns: 'services' },
  { test: () => true, ns: 'dashboard' },
];

export function Header() {
  const location = useLocation();
  const entry = TITLE_NS_BY_PATH.find((e) => e.test(location.pathname))!;
  const { t, i18n } = useTranslation(entry.ns);
  const { t: tAuth } = useTranslation('auth');
  const { logoutMutation } = useAuth();

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-surface px-8">
      <div>
        <div className="text-lg font-bold leading-tight text-ink-900">{t(entry.titleKey ?? 'title')}</div>
        <div className="mt-0.5 text-sm text-ink-600">{formatDateLine(i18n.language)}</div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label={tAuth('logout.label')}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-soft text-ink-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
