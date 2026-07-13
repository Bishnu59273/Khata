// Tracks how often each service is saved so the Add Transaction picker can
// surface the most-used services first. Purely a UX hint — any storage
// failure (private mode, corrupt JSON) silently degrades to API order.

const STORAGE_KEY = 'khata.serviceUsage';

export function getServiceUsage(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, v]) => typeof v === 'number' && Number.isFinite(v)
      )
    ) as Record<string, number>;
  } catch {
    return {};
  }
}

export function bumpServiceUsage(serviceId: string): void {
  try {
    const usage = getServiceUsage();
    usage[serviceId] = (usage[serviceId] ?? 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore — usage ranking is best-effort
  }
}
