import { useTranslation } from 'react-i18next';

const LANGUAGES: { code: 'en' | 'hi' | 'bn'; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'bn', label: 'বাং' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          className={`min-h-12 flex-1 rounded-xl text-lg font-semibold transition-colors ${
            i18n.language === code
              ? 'bg-brand-500 text-white'
              : 'bg-brand-50 text-ink-900 hover:bg-brand-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
