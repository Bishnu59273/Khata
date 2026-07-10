import { apiFetch } from './client';
import type {
  Customer,
  CustomerPayment,
  CustomerStatement,
  CustomerWithBalance,
  SettlementMode,
} from '../types/models';

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  notes?: string;
}

export interface CreatePaymentInput {
  amount: number;
  payment_mode: SettlementMode;
  note?: string;
}

export function getCustomers(search?: string): Promise<CustomerWithBalance[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiFetch<CustomerWithBalance[]>(`/customers${query}`);
}

export function getCustomer(id: string): Promise<CustomerWithBalance> {
  return apiFetch<CustomerWithBalance>(`/customers/${id}`);
}

export function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  return apiFetch<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateCustomer(
  id: string,
  input: Partial<CreateCustomerInput>
): Promise<Customer> {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteCustomer(id: string): Promise<void> {
  return apiFetch<void>(`/customers/${id}`, { method: 'DELETE' });
}

export function getCustomerStatement(id: string): Promise<CustomerStatement> {
  return apiFetch<CustomerStatement>(`/customers/${id}/statement`);
}

export function createCustomerPayment(
  customerId: string,
  input: CreatePaymentInput
): Promise<CustomerPayment> {
  return apiFetch<CustomerPayment>(`/customers/${customerId}/payments`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteCustomerPayment(customerId: string, paymentId: string): Promise<void> {
  return apiFetch<void>(`/customers/${customerId}/payments/${paymentId}`, { method: 'DELETE' });
}
