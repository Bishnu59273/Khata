const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN' };

export function localeForLang(lang: string): string {
  return LOCALE_MAP[lang] ?? 'en-IN';
}

export function formatDateLine(lang: string): string {
  return new Date().toLocaleDateString(localeForLang(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
