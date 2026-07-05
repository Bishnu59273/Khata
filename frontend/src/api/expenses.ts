import { apiFetch } from './client';
import type { Expense } from '../types/models';

export interface CreateExpenseInput {
  description: string;
  category: string;
  amount: number;
}

export function getExpenses(filters: { from?: string; to?: string } = {}): Promise<Expense[]> {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  const query = params.toString();
  return apiFetch<Expense[]>(`/expenses${query ? `?${query}` : ''}`);
}

export function createExpense(input: CreateExpenseInput): Promise<Expense> {
  return apiFetch<Expense>('/expenses', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateExpense(id: string, input: Partial<CreateExpenseInput>): Promise<Expense> {
  return apiFetch<Expense>(`/expenses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteExpense(id: string): Promise<void> {
  return apiFetch<void>(`/expenses/${id}`, { method: 'DELETE' });
}
