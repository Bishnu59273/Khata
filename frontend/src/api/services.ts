import { apiFetch } from './client';
import type { Service } from '../types/models';

export interface ServiceInput {
  name_en: string;
  name_hi: string;
  name_bn: string;
  emoji: string;
  default_charge: number;
  default_cost: number;
}

export function getActiveServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services');
}

export function getAllServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services?all=true');
}

export function createService(input: ServiceInput): Promise<Service> {
  return apiFetch<Service>('/services', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateService(id: string, input: Partial<ServiceInput & { is_active: boolean }>): Promise<Service> {
  return apiFetch<Service>(`/services/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
