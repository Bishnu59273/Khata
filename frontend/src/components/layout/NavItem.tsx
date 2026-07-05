import type { ComponentType } from 'react';
import { NavLink } from 'react-router';

interface NavItemProps {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
}

export function NavItem({ to, label, icon: Icon, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold transition-colors ${
          isActive ? 'bg-brand-500 text-white' : 'text-ink-900 hover:bg-brand-50'
        }`
      }
    >
      <Icon size={24} />
      <span>{label}</span>
    </NavLink>
  );
}
