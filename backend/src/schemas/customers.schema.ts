import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5).optional(),
  notes: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const listCustomersQuerySchema = z.object({
  search: z.string().min(1).optional(),
});

// Settlements against the khata are always real money in hand — never udhaar.
export const settlementModeSchema = z.enum(['cash', 'upi', 'online']);

export const createCustomerPaymentSchema = z.object({
  amount: z.number().positive(),
  payment_mode: settlementModeSchema.default('cash'),
  note: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
export type CreateCustomerPaymentInput = z.infer<typeof createCustomerPaymentSchema>;
