import { apiFetch, ApiError } from './client';
import type { LoginInput, Me, SignupInput } from '../types/auth';

export function signup(input: SignupInput): Promise<Me> {
  return apiFetch<Me>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<Me> {
  return apiFetch<Me>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<void> {
  return apiFetch<void>('/auth/logout', { method: 'POST' });
}

export async function getMe(): Promise<Me | null> {
  try {
    return await apiFetch<Me>('/auth/me');
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}
