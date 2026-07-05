import type { Request } from 'express';
import { z } from 'zod';

const idParamSchema = z.uuid();

export function idParam(req: Request): string {
  return idParamSchema.parse(req.params.id);
}
