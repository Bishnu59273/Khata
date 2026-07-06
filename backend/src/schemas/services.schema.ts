import { z } from 'zod';

export const createServiceSchema = z.object({
  name_en: z.string().min(1),
  name_hi: z.string().min(1).optional(),
  name_bn: z.string().min(1).optional(),
  emoji: z.string().trim().min(1).max(32).default('🧰'),
  default_charge: z.number().nonnegative().default(0),
  default_cost: z.number().nonnegative().default(0),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const listServicesQuerySchema = z.object({
  all: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
