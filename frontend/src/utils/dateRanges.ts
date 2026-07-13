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

export type TrendGranularity = 'day' | 'week' | 'month';

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back to Monday
  return d;
}

/** Fetch window covering the 7 trend buckets ending in the current period. */
export function getTrendRange(granularity: TrendGranularity): { from: string; to: string } {
  const today = new Date();
  if (granularity === 'day') return getLast7DaysRange();
  if (granularity === 'week') {
    const start = startOfWeek(today);
    start.setDate(start.getDate() - 6 * 7);
    return { from: toDateStr(start), to: toDateStr(today) };
  }
  const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
  return { from: toDateStr(start), to: toDateStr(today) };
}

export interface TrendBucket {
  key: string;
  start: Date;
}

/** The 7 bucket starts (oldest first) for a granularity, ending in the current period. */
export function trendBuckets(granularity: TrendGranularity): TrendBucket[] {
  const today = new Date();
  if (granularity === 'day') {
    return last7DayKeys().map((key) => ({ key, start: new Date(`${key}T12:00:00`) }));
  }
  if (granularity === 'week') {
    const current = startOfWeek(today);
    return Array.from({ length: 7 }, (_, i) => {
      const start = new Date(current);
      start.setDate(start.getDate() - (6 - i) * 7);
      return { key: toDateStr(start), start };
    });
  }
  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(today.getFullYear(), today.getMonth() - (6 - i), 1);
    return { key: toDateStr(start).slice(0, 7), start };
  });
}

/** Bucket key for a transaction timestamp under a granularity (IST calendar). */
export function trendBucketKey(isoString: string, granularity: TrendGranularity): string {
  const dayKey = istDateKey(isoString);
  if (granularity === 'day') return dayKey;
  if (granularity === 'month') return dayKey.slice(0, 7);
  return toDateStr(startOfWeek(new Date(`${dayKey}T12:00:00`)));
}
