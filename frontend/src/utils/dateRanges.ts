export type ReportRangePreset = 'today' | 'week' | 'month' | 'custom';

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function getPresetRange(preset: Exclude<ReportRangePreset, 'custom'>): {
  from: string;
  to: string;
} {
  const today = toDateStr(new Date());
  if (preset === 'today') return { from: today, to: today };
  if (preset === 'week') return { from: toDateStr(daysAgo(6)), to: today };
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  return { from: toDateStr(firstOfMonth), to: today };
}

export function getLast7DaysRange(): { from: string; to: string } {
  return getPresetRange('week');
}

export function getTodayDateStr(): string {
  return toDateStr(new Date());
}

/** YYYY-MM-DD bucket key for a UTC timestamp, using the IST calendar day. */
export function istDateKey(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/** The 7 IST calendar-day keys ending today, oldest first. */
export function last7DayKeys(): string[] {
  return Array.from({ length: 7 }, (_, i) => toDateStr(daysAgo(6 - i)));
}
