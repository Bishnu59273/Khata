import { useTranslation } from 'react-i18next';

export function ErrorState({ message }: { message?: string }) {
  const { t } = useTranslation('common');
  return (
    <div className="rounded-2xl bg-surface p-8 text-lg text-danger-600 shadow-sm">
      {message ?? t('state.error')}
    </div>
  );
}
