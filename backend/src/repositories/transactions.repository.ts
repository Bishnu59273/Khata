import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { getTodayRangeUTC, resolveDateRangeQuery } from '../utils/dateRange.js';
import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from '../schemas/transactions.schema.js';
import type { Transaction } from '../types/models.js';

const SELECT_WITH_SERVICE = '*, service:services(id,name_en,name_hi,name_bn)';

export async function listTodayTransactions(): Promise<Transaction[]> {
  const { fromISO, toISO } = getTodayRangeUTC();
  const { data, error } = await supabase
    .from('transactions')
    .select(SELECT_WITH_SERVICE)
    .gte('created_at', fromISO)
    .lt('created_at', toISO)
    .order('created_at', { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction[];
}

export async function listTransactions(filters: ListTransactionsQuery): Promise<Transaction[]> {
  const { fromISO, toISO } = resolveDateRangeQuery(filters.from, filters.to);
  let query = supabase
    .from('transactions')
    .select(SELECT_WITH_SERVICE)
    .order('created_at', { ascending: false });

  if (fromISO) query = query.gte('created_at', fromISO);
  if (toISO) query = query.lt('created_at', toISO);
  if (filters.serviceId) query = query.eq('service_id', filters.serviceId);
  if (filters.paymentMode) query = query.eq('payment_mode', filters.paymentMode);

  const { data, error } = await query;
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction[];
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select(SELECT_WITH_SERVICE)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction | null;
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert(input)
    .select(SELECT_WITH_SERVICE)
    .single();
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction;
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update(input)
    .eq('id', id)
    .select(SELECT_WITH_SERVICE)
    .single();
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw new AppError(500, error.message);
}
