import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import type { CreateServiceInput, UpdateServiceInput } from '../schemas/services.schema.js';
import type { Service } from '../types/models.js';

export async function listServices(shopId: string, all: boolean): Promise<Service[]> {
  let query = supabase
    .from('services')
    .select('*')
    .eq('shop_id', shopId)
    .order('name_en', { ascending: true });
  if (!all) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) throw new AppError(500, error.message);
  return data as Service[];
}

export async function getServiceById(shopId: string, id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('shop_id', shopId)
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Service | null;
}

export async function createService(shopId: string, input: CreateServiceInput): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert({ ...input, shop_id: shopId })
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as Service;
}

export async function updateService(
  shopId: string,
  id: string,
  input: UpdateServiceInput
): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .update(input)
    .eq('id', id)
    .eq('shop_id', shopId)
    .select('*')
    .maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Service | null;
}

export async function softDeleteService(shopId: string, id: string): Promise<Service | null> {
  return updateService(shopId, id, { is_active: false });
}
