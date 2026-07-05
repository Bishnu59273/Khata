import { apiFetch } from './client';
import type { Service } from '../types/models';

export function getActiveServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/services');
}
