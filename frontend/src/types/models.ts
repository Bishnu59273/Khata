export type PaymentMode = 'cash' | 'upi' | 'online';

export interface ServiceSummary {
  id: string;
  name_en: string;
  name_hi: string;
  name_bn: string;
}

export interface Service extends ServiceSummary {
  default_charge: number;
  default_cost: number;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  service_id: string;
  customer_name: string | null;
  customer_charge: number;
  cost_paid: number;
  profit: number;
  payment_mode: PaymentMode;
  created_at: string;
  service?: ServiceSummary;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  created_at: string;
}
