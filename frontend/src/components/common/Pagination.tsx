import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation('common');

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 items-center gap-1 rounded-lg border border-border-soft bg-surface px-3 text-sm font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        {t('pagination.prev')}
      </button>
      <span className="text-sm font-medium text-ink-600">
        {t('pagination.pageOf', { page, total: totalPages })}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-9 items-center gap-1 rounded-lg border border-border-soft bg-surface px-3 text-sm font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('pagination.next')}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
