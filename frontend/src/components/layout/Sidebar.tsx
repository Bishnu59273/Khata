import { Home, PlusCircle, BarChart3, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavItem } from './NavItem';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Sidebar() {
  const { t } = useTranslation('common');

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-6 bg-surface p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-600">{t('appName')}</h1>

      <nav className="flex flex-col gap-2">
        <NavItem to="/" label={t('nav.home')} icon={Home} end />
        <NavItem to="/transactions/new" label={t('nav.addTransaction')} icon={PlusCircle} />
        <NavItem to="/reports" label={t('nav.reports')} icon={BarChart3} />
        <NavItem to="/expenses" label={t('nav.expenses')} icon={Wallet} />
      </nav>

      <div className="mt-auto">
        <LanguageSwitcher />
      </div>
    </aside>
  );
}
