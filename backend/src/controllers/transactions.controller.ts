import type { Request, Response } from 'express';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from '../schemas/transactions.schema.js';
import * as transactionsRepo from '../repositories/transactions.repository.js';
import * as servicesRepo from '../repositories/services.repository.js';
import { AppError } from '../utils/AppError.js';
import { authUser, idParam } from '../utils/params.js';

async function assertServiceInShop(shopId: string, serviceId: string) {
  const service = await servicesRepo.getServiceById(shopId, serviceId);
  if (!service) throw new AppError(400, 'Invalid service', 'INVALID_SERVICE');
}

export async function today(req: Request, res: Response) {
  const transactions = await transactionsRepo.listTodayTransactions(authUser(req).shopId);
  res.json(transactions);
}

export async function list(req: Request, res: Response) {
  const filters = listTransactionsQuerySchema.parse(req.query);
  const transactions = await transactionsRepo.listTransactions(authUser(req).shopId, filters);
  res.json(transactions);
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
  const transaction = await transactionsRepo.createTransaction(shopId, input);
  res.status(201).json(transaction);
}

export async function update(req: Request, res: Response) {
  const input = updateTransactionSchema.parse(req.body);
  const shopId = authUser(req).shopId;
  if (input.service_id) await assertServiceInShop(shopId, input.service_id);
  const transaction = await transactionsRepo.updateTransaction(shopId, idParam(req), input);
  if (!transaction) throw new AppError(404, 'Transaction not found');
  res.json(transaction);
}

export async function remove(req: Request, res: Response) {
  await transactionsRepo.deleteTransaction(authUser(req).shopId, idParam(req));
  res.status(204).send();
}
