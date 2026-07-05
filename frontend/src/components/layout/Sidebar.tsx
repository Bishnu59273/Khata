import { Home, PlusCircle, Receipt, BarChart3, Wallet, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavItem } from './NavItem';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { t } = useTranslation('common');
  const { shop, user } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-5 border-r border-border bg-sidebar p-4">
      <div className="flex items-center gap-3 px-2 pb-3 pt-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500">
          <Home size={20} className="text-white" />
        </div>
        <div>
          <div className="text-base font-bold leading-tight text-ink-900">{t('appName')}</div>
          <div className="text-xs text-ink-600">{t('appSub')}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem to="/" label={t('nav.home')} icon={Home} end />
        <NavItem to="/transactions" label={t('nav.transactions')} icon={Receipt} end />
        <NavItem to="/transactions/new" label={t('nav.addTransaction')} icon={PlusCircle} />
        <NavItem to="/reports" label={t('nav.reports')} icon={BarChart3} />
        <NavItem to="/expenses" label={t('nav.expenses')} icon={Wallet} />
        <NavItem to="/services" label={t('nav.services')} icon={Layers} />
      </nav>

      {shop && (
        <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-border-soft bg-brand-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3d6c2] text-sm font-bold text-[#8a6a42]">
            {shop.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-ink-900">{shop.name}</div>
            <div className="truncate text-xs text-ink-600">{user?.name}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
