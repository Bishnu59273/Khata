import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Transaction } from '../../types/models';
import { trendBuckets, trendBucketKey, type TrendGranularity } from '../../utils/dateRanges';
import { localeForLang } from '../../utils/formatDate';
import { formatINRWhole } from '../../utils/currency';

const PLOT_HEIGHT = 170;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Round up to a clean axis maximum (1/2/2.5/5 × 10ⁿ). */
function niceCeil(value: number): number {
  if (value <= 0) return 0;
  const pow = 10 ** Math.floor(Math.log10(value));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (value <= m * pow) return m * pow;
  }
  return 10 * pow;
}

function bucketLabel(start: Date, granularity: TrendGranularity, locale: string): string {
  if (granularity === 'day') return start.toLocaleDateString(locale, { weekday: 'short' });
  if (granularity === 'week') {
    return start.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }
  return start.toLocaleDateString(locale, { month: 'short' });
}

export function ProfitTrendChart({
  transactions,
  granularity,
}: {
  transactions: Transaction[];
  granularity: TrendGranularity;
}) {
  const { t, i18n } = useTranslation('reports');
  const locale = localeForLang(i18n.language);

  // Bars grow from the baseline on mount: first paint at zero height, then
  // flip `ready` so the CSS transition carries them up.
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const totals = new Map<string, number>();
  for (const tx of transactions) {
    const key = trendBucketKey(tx.created_at, granularity);
    totals.set(key, (totals.get(key) ?? 0) + tx.profit);
  }

  const bars = trendBuckets(granularity).map(({ key, start }) => ({
    key,
    label: bucketLabel(start, granularity, locale),
    value: totals.get(key) ?? 0,
  }));

  const values = bars.map((bar) => bar.value);
  const posMax = niceCeil(Math.max(0, ...values)) || 1;
  const negMax = niceCeil(Math.max(0, ...values.map((v) => -v)));
  const scale = PLOT_HEIGHT / (posMax + negMax);
  const baseline = negMax * scale; // px from the bottom of the plot

  // Direct-label only the extreme and the current bucket; hover carries the rest.
  const extremeIndex = values.reduce(
    (best, v, i) => (Math.abs(v) > Math.abs(values[best]) ? i : best),
    0
  );
  const labelled = new Set([extremeIndex, bars.length - 1]);

  const ticks = [
    { value: posMax, y: baseline + posMax * scale },
    { value: posMax / 2, y: baseline + (posMax * scale) / 2 },
    { value: 0, y: baseline },
    ...(negMax > 0 ? [{ value: -negMax, y: 0 }] : []),
  ];

  // Stagger only the growth, never the hover response.
  const barTransition = (index: number) =>
    reduceMotion
      ? 'filter 150ms ease'
      : `height 600ms ${EASE} ${index * 55}ms, bottom 600ms ${EASE} ${index * 55}ms, filter 150ms ease`;

  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-6">
      <h3 className="mb-5 text-sm font-bold text-ink-900">{t(`trend.${granularity}`)}</h3>

      <div className="flex gap-3">
        {/* Y-axis ticks */}
        <div className="relative w-12 shrink-0" style={{ height: PLOT_HEIGHT }}>
          {ticks.map((tick) => (
            <span
              key={tick.value}
              className="absolute right-0 translate-y-1/2 text-[11px] font-medium tabular-nums text-ink-600"
              style={{ bottom: tick.y }}
            >
              {formatINRWhole(tick.value)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height: PLOT_HEIGHT }}>
            {/* Hairline gridlines; the zero baseline is one step stronger. */}
            {ticks.map((tick) => (
              <div
                key={tick.value}
                className={`absolute left-0 right-0 h-px ${
                  tick.value === 0 ? 'bg-border' : 'bg-border-row'
                }`}
                style={{ bottom: tick.y }}
              />
            ))}

            <div className="absolute inset-0 grid grid-cols-7">
              {bars.map((bar, i) => {
                const height = ready ? Math.abs(bar.value) * scale : 0;
                const visibleHeight = bar.value !== 0 ? Math.max(height, ready ? 2 : 0) : 0;
                const negative = bar.value < 0;
                const tipY = baseline + (negative ? 0 : visibleHeight);
                return (
                  <div
                    key={bar.key}
                    tabIndex={0}
                    onPointerEnter={() => setHovered(i)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className="relative outline-none"
                  >
                    {/* bar */}
                    <div
                      className={`absolute left-1/2 w-full max-w-6 -translate-x-1/2 ${
                        negative
                          ? 'rounded-b bg-cost-600'
                          : 'rounded-t bg-gradient-to-b from-brand-500 to-brand-600'
                      }`}
                      style={{
                        height: visibleHeight,
                        bottom: negative ? baseline - visibleHeight : baseline,
                        transition: barTransition(i),
                        filter: hovered === i ? 'brightness(1.12)' : undefined,
                      }}
                    />

                    {/* selective direct label */}
                    {labelled.has(i) && bar.value !== 0 && hovered !== i && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-ink-700"
                        style={{
                          bottom: negative ? undefined : tipY + 5,
                          top: negative ? PLOT_HEIGHT - baseline + visibleHeight + 5 : undefined,
                          opacity: ready ? 1 : 0,
                          transition: reduceMotion ? 'none' : `opacity 300ms ease ${600 + i * 55}ms`,
                        }}
                      >
                        {formatINRWhole(bar.value)}
                      </span>
                    )}

                    {/* tooltip */}
                    {hovered === i && (
                      <div
                        className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-border-soft bg-white px-2.5 py-1.5 shadow-md ${
                          i === 0 ? 'left-0' : i === bars.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                        }`}
                        style={{ bottom: Math.max(tipY, baseline) + 8 }}
                      >
                        <div className="text-sm font-bold text-ink-900">
                          {formatINRWhole(bar.value)}
                        </div>
                        <div className="text-[11px] font-medium text-ink-600">{bar.label}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="mt-2 grid grid-cols-7">
            {bars.map((bar) => (
              <div key={bar.key} className="truncate text-center text-xs text-ink-600">
                {bar.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screen-reader table twin so no value is hover-gated. */}
      <table className="sr-only">
        <tbody>
          {bars.map((bar) => (
            <tr key={bar.key}>
              <th scope="row">{bar.label}</th>
              <td>{formatINRWhole(bar.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
