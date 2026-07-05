import type { CSSProperties } from 'react';
import type { PaymentMode } from '../types/models';

const STYLES: Record<PaymentMode, CSSProperties> = {
  cash: { backgroundColor: '#eef5f0', color: '#3f7d5a' },
  upi: { backgroundColor: '#eef1f6', color: '#4a5f9e' },
  online: { backgroundColor: '#f6efe3', color: '#a9752b' },
};

export function paymentModePillStyle(mode: PaymentMode): CSSProperties {
  return STYLES[mode];
}
