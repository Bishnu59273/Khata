import { useTranslation } from "react-i18next";

const LANGUAGES: { code: "en" | "hi" | "bn"; label: string }[] = [
  { code: "en", label: "ENG" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-brand-50 p-1">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          className={`min-w-12 rounded-lg px-3 py-1.5 text-base font-bold transition-colors ${
            i18n.language === code
              ? "bg-surface text-brand-600 shadow-sm"
              : "text-ink-600 hover:text-ink-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
