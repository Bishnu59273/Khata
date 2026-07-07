import { apiFetch } from './client';
import type { Shop } from '../types/auth';

export interface UpdateShopInput {
  name?: string;
  address?: string;
  phone?: string;
  gstin?: string;
}

export function getShop(): Promise<Shop> {
  return apiFetch<Shop>('/shops/me');
}

export function updateShop(input: UpdateShopInput): Promise<Shop> {
  return apiFetch<Shop>('/shops/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
