export type PaymentMode = 'cash' | 'upi' | 'udhaar';

/** Modes accepted for khata settlements — real money in hand, never udhaar. */
export type SettlementMode = 'cash' | 'upi';

export interface Service {
  id: string;
  shop_id: string;
  name_en: string;
  name_hi: string;
  name_bn: string;
  emoji: string;
  default_charge: number;
  default_cost: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceSummary {
  id: string;
  name_en: string;
  name_hi: string;
  name_bn: string;
}

export interface Transaction {
  id: string;
  shop_id: string;
  service_id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_charge: number;
  discount: number;
  cost_paid: number;
  quantity: number;
  profit: number;
  payment_mode: PaymentMode;
  created_at: string;
  service?: ServiceSummary;
}

export interface Expense {
  id: string;
  shop_id: string;
  description: string;
  category: string;
  amount: number;
  created_at: string;
}

export interface Customer {
  id: string;
  shop_id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface CustomerBalance {
  customer_id: string;
  shop_id: string;
  total_udhaar: number;
  total_paid: number;
  balance: number;
}

export interface CustomerWithBalance extends Customer {
  total_udhaar: number;
  total_paid: number;
  balance: number;
}

export interface CustomerPayment {
  id: string;
  shop_id: string;
  customer_id: string;
  amount: number;
  payment_mode: SettlementMode;
  note: string | null;
  created_at: string;
}

export interface StatementEntry {
  type: 'udhaar' | 'payment';
  id: string;
  amount: number;
  quantity: number | null;
  service: ServiceSummary | null;
  payment_mode: SettlementMode | null;
  note: string | null;
  created_at: string;
  running_balance?: number;
}
