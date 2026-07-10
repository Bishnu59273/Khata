const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrNumber = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹1,23,456.00 */
export function formatINR(amount: number): string {
  return inr.format(amount);
}

/** ₹1,23,456 — for compact displays like preset cards and chart labels */
export function formatINRWhole(amount: number): string {
  return inrWhole.format(amount);
}

/** 1,23,456.00 — grouped number without the ₹ symbol (for strings that already include it) */
export function formatINRNumber(amount: number): string {
  return inrNumber.format(amount);
}
