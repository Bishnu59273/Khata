import { z } from 'zod';

export const updateShopSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  address: z.string().min(1).max(500).optional(),
  phone: z.string().min(1).max(30).optional(),
  gstin: z.string().min(1).max(20).optional(),
});

export type UpdateShopInput = z.infer<typeof updateShopSchema>;
