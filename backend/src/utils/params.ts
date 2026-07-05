import type { Request } from 'express';
import { z } from 'zod';
import { AppError } from './AppError.js';
import type { AuthUser } from '../types/auth.js';

const idParamSchema = z.uuid();

export function idParam(req: Request): string {
  return idParamSchema.parse(req.params.id);
}

export function authUser(req: Request): AuthUser {
  if (!req.user) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
  return req.user;
}
