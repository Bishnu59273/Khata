import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation('common');
  return (
    <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-ink-900">{t('notFound.title')}</h1>
      <p className="mt-2 text-lg text-ink-600">{t('notFound.message')}</p>
    </div>
  );
}
