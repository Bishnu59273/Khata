import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import type { CreateServiceInput, UpdateServiceInput } from '../schemas/services.schema.js';
import type { Service } from '../types/models.js';

export async function listServices(all: boolean): Promise<Service[]> {
  let query = supabase.from('services').select('*').order('name_en', { ascending: true });
  if (!all) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) throw new AppError(500, error.message);
  return data as Service[];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Service | null;
}

export async function createService(input: CreateServiceInput): Promise<Service> {
  const { data, error } = await supabase.from('services').insert(input).select('*').single();
  if (error) throw new AppError(500, error.message);
  return data as Service;
}

export async function updateService(id: string, input: UpdateServiceInput): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as Service;
}

export async function softDeleteService(id: string): Promise<Service> {
  return updateService(id, { is_active: false });
}
