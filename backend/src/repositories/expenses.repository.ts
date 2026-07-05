import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { resolveDateRangeQuery } from '../utils/dateRange.js';
import type { CreateExpenseInput, UpdateExpenseInput } from '../schemas/expenses.schema.js';
import type { Expense } from '../types/models.js';

export async function listExpenses(filters: { from?: string; to?: string }): Promise<Expense[]> {
  const { fromISO, toISO } = resolveDateRangeQuery(filters.from, filters.to);
  let query = supabase.from('expenses').select('*').order('created_at', { ascending: false });
  if (fromISO) query = query.gte('created_at', fromISO);
  if (toISO) query = query.lt('created_at', toISO);
  const { data, error } = await query;
  if (error) throw new AppError(500, error.message);
  return data as Expense[];
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const { data, error } = await supabase.from('expenses').select('*').eq('id', id).maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Expense | null;
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const { data, error } = await supabase.from('expenses').insert(input).select('*').single();
  if (error) throw new AppError(500, error.message);
  return data as Expense;
}

export async function updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as Expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw new AppError(500, error.message);
}
