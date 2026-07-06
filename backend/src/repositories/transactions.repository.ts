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

export async function listTodayTransactions(shopId: string): Promise<Transaction[]> {
  const { fromISO, toISO } = getTodayRangeUTC();
  const { data, error } = await supabase
    .from('transactions')
    .select(SELECT_WITH_SERVICE)
    .eq('shop_id', shopId)
    .gte('created_at', fromISO)
    .lt('created_at', toISO)
    .order('created_at', { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction[];
}

export async function listTransactions(
  shopId: string,
  filters: ListTransactionsQuery
): Promise<{ data: Transaction[]; total: number | null }> {
  const { fromISO, toISO } = resolveDateRangeQuery(filters.from, filters.to);
  let query = supabase
    .from('transactions')
    .select(SELECT_WITH_SERVICE, filters.page ? { count: 'exact' } : {})
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (fromISO) query = query.gte('created_at', fromISO);
  if (toISO) query = query.lt('created_at', toISO);
  if (filters.serviceId) query = query.eq('service_id', filters.serviceId);
  if (filters.paymentMode) query = query.eq('payment_mode', filters.paymentMode);

  if (filters.page) {
    const limit = filters.limit ?? 50;
    const start = (filters.page - 1) * limit;
    query = query.range(start, start + limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw new AppError(500, error.message);
  return { data: data as unknown as Transaction[], total: count };
}

export async function getTransactionById(
  shopId: string,
  id: string
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select(SELECT_WITH_SERVICE)
    .eq('id', id)
    .eq('shop_id', shopId)
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction | null;
}

export async function createTransaction(
  shopId: string,
  input: CreateTransactionInput
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...input, shop_id: shopId })
    .select(SELECT_WITH_SERVICE)
    .single();
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction;
}

export async function updateTransaction(
  shopId: string,
  id: string,
  input: UpdateTransactionInput
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .update(input)
    .eq('id', id)
    .eq('shop_id', shopId)
    .select(SELECT_WITH_SERVICE)
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as unknown as Transaction | null;
}

export async function deleteTransaction(shopId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('shop_id', shopId);
  if (error) throw new AppError(500, error.message);
}
