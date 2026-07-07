import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import type { Shop, User } from '../types/auth.js';

interface CreateShopWithOwnerInput {
  shopName: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface CreateShopWithOwnerRow {
  shop_id: string;
  shop_name: string;
  shop_created_at: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_created_at: string;
}

export async function createShopWithOwner(
  input: CreateShopWithOwnerInput
): Promise<{ shop: Shop; user: Omit<User, 'password_hash'> }> {
  const { data, error } = await supabase.rpc('create_shop_with_owner', {
    p_shop_name: input.shopName,
    p_user_name: input.name,
    p_user_email: input.email,
    p_password_hash: input.passwordHash,
  });

  if (error) {
    if (error.code === '23505') {
      throw new AppError(409, 'Email already in use', 'EMAIL_TAKEN');
    }
    throw new AppError(500, error.message);
  }

  const row = (data as CreateShopWithOwnerRow[])[0];
  return {
    shop: {
      id: row.shop_id,
      name: row.shop_name,
      address: null,
      phone: null,
      gstin: null,
      created_at: row.shop_created_at,
    },
    user: {
      id: row.user_id,
      shop_id: row.shop_id,
      name: row.user_name,
      email: row.user_email,
      created_at: row.user_created_at,
    },
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as User | null;
}

export async function getShopById(id: string): Promise<Shop | null> {
  const { data, error } = await supabase.from('shops').select('*').eq('id', id).maybeSingle();
  if (error) throw new AppError(500, error.message);
  return data as Shop | null;
}

export async function updateShop(
  id: string,
  patch: Partial<Pick<Shop, 'name' | 'address' | 'phone' | 'gstin'>>
): Promise<Shop> {
  const { data, error } = await supabase
    .from('shops')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new AppError(500, error.message);
  return data as Shop;
}
