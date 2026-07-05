const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface DateRange {
  fromISO: string;
  toISO: string;
}

/**
 * Postgres stores created_at in UTC, but the shop operates in IST (UTC+5:30).
 * "Today" must mean the IST calendar day, not the UTC one — so date boundaries
 * are computed by shifting into IST, reading the calendar date, then shifting
 * the resulting midnight back to the true UTC instant it corresponds to.
 */
function startOfISTDayUTC(date: Date): Date {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();
  const istMidnightMislabeledAsUTC = Date.UTC(y, m, d, 0, 0, 0, 0);
  return new Date(istMidnightMislabeledAsUTC - IST_OFFSET_MS);
}

export function getTodayRangeUTC(): DateRange {
  const from = startOfISTDayUTC(new Date());
  const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);
  return { fromISO: from.toISOString(), toISO: to.toISOString() };
}

/** Interprets `dateStr` (YYYY-MM-DD) as an IST calendar date and returns its UTC bounds. */
export function getISTDayRangeUTC(dateStr: string): DateRange {
  const [year, month, day] = dateStr.split('-').map(Number);
  const asUTCNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  const from = startOfISTDayUTC(asUTCNoon);
  const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);
  return { fromISO: from.toISOString(), toISO: to.toISOString() };
}

/** Builds an inclusive [from, to] UTC range from optional YYYY-MM-DD query params, both interpreted as IST calendar dates. */
export function resolveDateRangeQuery(from?: string, to?: string): Partial<DateRange> {
  const range: Partial<DateRange> = {};
  if (from) range.fromISO = getISTDayRangeUTC(from).fromISO;
  if (to) range.toISO = getISTDayRangeUTC(to).toISO;
  return range;
}
