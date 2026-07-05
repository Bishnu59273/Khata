import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { resolveDateRangeQuery } from '../utils/dateRange.js';
import type { CreateExpenseInput, UpdateExpenseInput } from '../schemas/expenses.schema.js';
import type { Expense } from '../types/models.js';

export async function listExpenses(
  shopId: string,
  filters: { from?: string; to?: string }
): Promise<Expense[]> {
  const { fromISO, toISO } = resolveDateRangeQuery(filters.from, filters.to);
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
  if (fromISO) query = query.gte('created_at', fromISO);
  if (toISO) query = query.lt('created_at', toISO);
  const { data, error } = await query;
  if (error) throw new AppError(500, error.message);
  return data as Expense[];
}

export async function getExpenseById(shopId: string, id: string): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .eq('shop_id', shopId)
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Expense | null;
}

export async function createExpense(shopId: string, input: CreateExpenseInput): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...input, shop_id: shopId })
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as Expense;
}

export async function updateExpense(
  shopId: string,
  id: string,
  input: UpdateExpenseInput
): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .update(input)
    .eq('id', id)
    .eq('shop_id', shopId)
    .select('*')
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Expense | null;
}

export async function deleteExpense(shopId: string, id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id).eq('shop_id', shopId);
  if (error) throw new AppError(500, error.message);
}
