import { Link } from 'react-router';

interface EmptyStateProps {
  message: string;
  icon?: string;
  action?: { label: string; to: string };
}

export function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
      {icon && <div className="mb-2 text-4xl">{icon}</div>}
      <p className="mb-3 text-base font-semibold text-ink-900">{message}</p>
      {action && (
        <Link
          to={action.to}
          className="inline-block rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
