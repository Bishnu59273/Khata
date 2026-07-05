import { useTranslation } from 'react-i18next';

export function LoadingState() {
  const { t } = useTranslation('common');
  return (
    <div className="flex items-center justify-center rounded-2xl bg-surface p-8 text-lg text-ink-600 shadow-sm">
      {t('state.loading')}
    </div>
  );
}
