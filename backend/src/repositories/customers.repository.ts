import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import type {
  CreateCustomerInput,
  CreateCustomerPaymentInput,
  UpdateCustomerInput,
} from '../schemas/customers.schema.js';
import type {
  Customer,
  CustomerBalance,
  CustomerPayment,
  CustomerWithBalance,
  StatementEntry,
} from '../types/models.js';

const STATEMENT_TX_SELECT =
  'id, customer_charge, discount, quantity, created_at, service:services(id,name_en,name_hi,name_bn)';

async function getBalances(shopId: string): Promise<Map<string, CustomerBalance>> {
  const { data, error } = await supabase
    .from('customer_balances')
    .select('*')
    .eq('shop_id', shopId);
  if (error) throw new AppError(500, error.message);
  return new Map((data as CustomerBalance[]).map((b) => [b.customer_id, b]));
}

function withBalance(customer: Customer, balance?: CustomerBalance): CustomerWithBalance {
  return {
    ...customer,
    total_udhaar: balance?.total_udhaar ?? 0,
    total_paid: balance?.total_paid ?? 0,
    balance: balance?.balance ?? 0,
  };
}

export async function listCustomers(
  shopId: string,
  search?: string
): Promise<CustomerWithBalance[]> {
  let query = supabase
    .from('customers')
    .select('*')
    .eq('shop_id', shopId)
    .order('name', { ascending: true });
  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  const [{ data, error }, balances] = await Promise.all([query, getBalances(shopId)]);
  if (error) throw new AppError(500, error.message);
  return (data as Customer[]).map((c) => withBalance(c, balances.get(c.id)));
}

export async function getCustomerById(
  shopId: string,
  id: string
): Promise<CustomerWithBalance | null> {
  const [{ data, error }, balances] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).eq('shop_id', shopId).maybeSingle(),
    getBalances(shopId),
  ]);
  if (error) throw new AppError(500, error.message);
  if (!data) return null;
  return withBalance(data as Customer, balances.get((data as Customer).id));
}

export async function createCustomer(
  shopId: string,
  input: CreateCustomerInput
): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert({ ...input, shop_id: shopId })
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as Customer;
}

export async function updateCustomer(
  shopId: string,
  id: string,
  input: UpdateCustomerInput
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .update(input)
    .eq('id', id)
    .eq('shop_id', shopId)
    .select('*')
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Customer | null;
}

export async function deleteCustomer(shopId: string, id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id).eq('shop_id', shopId);
  if (error) throw new AppError(500, error.message);
}

export async function getCustomerStatement(
  shopId: string,
  customerId: string
): Promise<StatementEntry[]> {
  const [txResult, paymentResult] = await Promise.all([
    supabase
      .from('transactions')
      .select(STATEMENT_TX_SELECT)
      .eq('shop_id', shopId)
      .eq('customer_id', customerId)
      .eq('payment_mode', 'udhaar')
      .order('created_at', { ascending: true }),
    supabase
      .from('customer_payments')
      .select('*')
      .eq('shop_id', shopId)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: true }),
  ]);
  if (txResult.error) throw new AppError(500, txResult.error.message);
  if (paymentResult.error) throw new AppError(500, paymentResult.error.message);

  const entries: StatementEntry[] = [
    ...(txResult.data as unknown as Array<{
      id: string;
      customer_charge: number;
      discount: number;
      quantity: number;
      created_at: string;
      service: { id: string; name_en: string; name_hi: string; name_bn: string } | null;
    }>).map((tx) => ({
      type: 'udhaar' as const,
      id: tx.id,
      // What the customer owes: gross charge net of discount, matching customer_balances.
      amount: tx.customer_charge - tx.discount,
      quantity: tx.quantity,
      service: tx.service,
      payment_mode: null,
      note: null,
      created_at: tx.created_at,
    })),
    ...(paymentResult.data as CustomerPayment[]).map((p) => ({
      type: 'payment' as const,
      id: p.id,
      amount: p.amount,
      quantity: null,
      service: null,
      payment_mode: p.payment_mode,
      note: p.note,
      created_at: p.created_at,
    })),
  ].sort((a, b) => a.created_at.localeCompare(b.created_at));

  let running = 0;
  for (const entry of entries) {
    running += entry.type === 'udhaar' ? entry.amount : -entry.amount;
    entry.running_balance = running;
  }
  return entries;
}

export async function createPayment(
  shopId: string,
  customerId: string,
  input: CreateCustomerPaymentInput
): Promise<CustomerPayment> {
  const { data, error } = await supabase
    .from('customer_payments')
    .insert({ ...input, shop_id: shopId, customer_id: customerId })
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as CustomerPayment;
}

export async function deletePayment(
  shopId: string,
  customerId: string,
  paymentId: string
): Promise<void> {
  const { error } = await supabase
    .from('customer_payments')
    .delete()
    .eq('id', paymentId)
    .eq('customer_id', customerId)
    .eq('shop_id', shopId);
  if (error) throw new AppError(500, error.message);
}
