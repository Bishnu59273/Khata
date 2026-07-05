import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { SidebarTrigger } from '@/components/animate-ui/components/radix/sidebar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { formatDateLine } from '../../utils/formatDate';

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

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-surface px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-10 rounded-xl border border-border-soft text-ink-700 hover:bg-brand-50" />
        <div>
          <div className="text-lg font-bold leading-tight text-ink-900">{t(entry.titleKey ?? 'title')}</div>
          <div className="mt-0.5 text-sm text-ink-600">{formatDateLine(i18n.language)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
