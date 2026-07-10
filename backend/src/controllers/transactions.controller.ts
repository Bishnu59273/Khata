import type { Request, Response } from 'express';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from '../schemas/transactions.schema.js';
import * as transactionsRepo from '../repositories/transactions.repository.js';
import * as servicesRepo from '../repositories/services.repository.js';
import * as customersRepo from '../repositories/customers.repository.js';
import { AppError } from '../utils/AppError.js';
import { authUser, idParam } from '../utils/params.js';

async function assertServiceInShop(shopId: string, serviceId: string) {
  const service = await servicesRepo.getServiceById(shopId, serviceId);
  if (!service) throw new AppError(400, 'Invalid service', 'INVALID_SERVICE');
}

async function assertCustomerInShop(shopId: string, customerId: string) {
  const customer = await customersRepo.getCustomerById(shopId, customerId);
  if (!customer) throw new AppError(400, 'Invalid customer', 'INVALID_CUSTOMER');
}

export async function today(req: Request, res: Response) {
  const transactions = await transactionsRepo.listTodayTransactions(authUser(req).shopId);
  res.json(transactions);
}

export async function list(req: Request, res: Response) {
  const filters = listTransactionsQuerySchema.parse(req.query);
  const { data, total } = await transactionsRepo.listTransactions(authUser(req).shopId, filters);
  if (filters.page) {
    res.json({ data, total: total ?? data.length });
  } else {
    res.json(data);
  }
}

export async function getOne(req: Request, res: Response) {
  const transaction = await transactionsRepo.getTransactionById(authUser(req).shopId, idParam(req));
  if (!transaction) throw new AppError(404, 'Transaction not found');
  res.json(transaction);
}

export async function create(req: Request, res: Response) {
  const input = createTransactionSchema.parse(req.body);
  const shopId = authUser(req).shopId;
  await assertServiceInShop(shopId, input.service_id);
  if (input.customer_id) await assertCustomerInShop(shopId, input.customer_id);
  const transaction = await transactionsRepo.createTransaction(shopId, input);
  res.status(201).json(transaction);
}

export async function update(req: Request, res: Response) {
  const input = updateTransactionSchema.parse(req.body);
  const shopId = authUser(req).shopId;
  if (input.service_id) await assertServiceInShop(shopId, input.service_id);
  if (input.customer_id) await assertCustomerInShop(shopId, input.customer_id);

  // The zod refine can't run on a partial payload, so re-check udhaar⇒customer
  // against the merged (existing + patch) values here.
  if (input.payment_mode === 'udhaar' || input.customer_id === null) {
    const existing = await transactionsRepo.getTransactionById(shopId, idParam(req));
    if (!existing) throw new AppError(404, 'Transaction not found');
    const mode = input.payment_mode ?? existing.payment_mode;
    const customerId = input.customer_id === undefined ? existing.customer_id : input.customer_id;
    if (mode === 'udhaar' && !customerId) {
      throw new AppError(400, 'Udhaar transactions require a customer', 'UDHAAR_REQUIRES_CUSTOMER');
    }
  }

  const transaction = await transactionsRepo.updateTransaction(shopId, idParam(req), input);
  if (!transaction) throw new AppError(404, 'Transaction not found');
  res.json(transaction);
}

export async function remove(req: Request, res: Response) {
  await transactionsRepo.deleteTransaction(authUser(req).shopId, idParam(req));
  res.status(204).send();
}
