import { apiFetch } from './client';
import type { PaymentMode, Transaction } from '../types/models';

export interface TransactionFilters {
  from?: string;
  to?: string;
  serviceId?: string;
  paymentMode?: PaymentMode;
  customerName?: string;
}

export interface CreateTransactionInput {
  service_id: string;
  customer_id?: string | null;
  customer_name?: string;
  customer_charge: number;
  cost_paid: number;
  quantity?: number;
  payment_mode: PaymentMode;
}

export interface PagedTransactions {
  data: Transaction[];
  total: number;
}

export function getTodayTransactions(): Promise<Transaction[]> {
  return apiFetch<Transaction[]>('/transactions/today');
}

export function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.serviceId) params.set('serviceId', filters.serviceId);
  if (filters.paymentMode) params.set('paymentMode', filters.paymentMode);
  if (filters.customerName) params.set('customerName', filters.customerName);
  const query = params.toString();
  return apiFetch<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
}

export function getTransactionsPaged(
  filters: TransactionFilters & { page: number; limit?: number }
): Promise<PagedTransactions> {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.serviceId) params.set('serviceId', filters.serviceId);
  if (filters.paymentMode) params.set('paymentMode', filters.paymentMode);
  if (filters.customerName) params.set('customerName', filters.customerName);
  params.set('page', String(filters.page));
  params.set('limit', String(filters.limit ?? 50));
  return apiFetch<PagedTransactions>(`/transactions?${params.toString()}`);
}

export function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  return apiFetch<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTransaction(
  id: string,
  input: Partial<CreateTransactionInput>
): Promise<Transaction> {
  return apiFetch<Transaction>(`/transactions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTransaction(id: string): Promise<void> {
  return apiFetch<void>(`/transactions/${id}`, { method: 'DELETE' });
}
