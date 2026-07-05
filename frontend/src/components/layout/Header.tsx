import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { LanguageSwitcher } from './LanguageSwitcher';
import { formatDateLine } from '../../utils/formatDate';

const TITLE_NS_BY_PATH: { test: (path: string) => boolean; ns: string }[] = [
  { test: (p) => p.startsWith('/transactions'), ns: 'transactions' },
  { test: (p) => p.startsWith('/reports'), ns: 'reports' },
  { test: (p) => p.startsWith('/expenses'), ns: 'expenses' },
  { test: (p) => p.startsWith('/services'), ns: 'services' },
  { test: () => true, ns: 'dashboard' },
];

export function Header() {
  const location = useLocation();
  const ns = TITLE_NS_BY_PATH.find((entry) => entry.test(location.pathname))!.ns;
  const { t, i18n } = useTranslation(ns);

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border bg-surface px-8">
      <div>
        <div className="text-lg font-bold leading-tight text-ink-900">{t('title')}</div>
        <div className="mt-0.5 text-sm text-ink-600">{formatDateLine(i18n.language)}</div>
      </div>
      <LanguageSwitcher />
    </header>
  );
}
