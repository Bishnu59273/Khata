import { z } from 'zod';

export const paymentModeSchema = z.enum(['cash', 'upi', 'online']);

export const createTransactionSchema = z.object({
  service_id: z.uuid(),
  customer_name: z.string().min(1).optional(),
  customer_charge: z.number().nonnegative(),
  cost_paid: z.number().nonnegative().default(0),
  quantity: z.number().int().positive().default(1),
  payment_mode: paymentModeSchema,
});

export const updateTransactionSchema = createTransactionSchema.partial();

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const listTransactionsQuerySchema = z.object({
  from: dateStringSchema.optional(),
  to: dateStringSchema.optional(),
  serviceId: z.uuid().optional(),
  paymentMode: paymentModeSchema.optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
