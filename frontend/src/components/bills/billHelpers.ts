import type { Transaction } from '../../types/models';
import { localeForLang } from '../../utils/formatDate';

export function serviceName(tx: Transaction, lang: string): string {
  const service = tx.service;
  if (!service) return '—';
  if (lang === 'hi') return service.name_hi;
  if (lang === 'bn') return service.name_bn;
  return service.name_en;
}

export function formatBillDate(isoString: string, lang: string): string {
  return new Date(isoString).toLocaleDateString(localeForLang(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
