import type { Request, Response } from 'express';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from '../schemas/transactions.schema.js';
import * as transactionsRepo from '../repositories/transactions.repository.js';
import { AppError } from '../utils/AppError.js';
import { idParam } from '../utils/params.js';

export async function today(_req: Request, res: Response) {
  const transactions = await transactionsRepo.listTodayTransactions();
  res.json(transactions);
}

export async function list(req: Request, res: Response) {
  const filters = listTransactionsQuerySchema.parse(req.query);
  const transactions = await transactionsRepo.listTransactions(filters);
  res.json(transactions);
}

export async function getOne(req: Request, res: Response) {
  const transaction = await transactionsRepo.getTransactionById(idParam(req));
  if (!transaction) throw new AppError(404, 'Transaction not found');
  res.json(transaction);
}

export async function create(req: Request, res: Response) {
  const input = createTransactionSchema.parse(req.body);
  const transaction = await transactionsRepo.createTransaction(input);
  res.status(201).json(transaction);
}

export async function update(req: Request, res: Response) {
  const input = updateTransactionSchema.parse(req.body);
  const transaction = await transactionsRepo.updateTransaction(idParam(req), input);
  res.json(transaction);
}

export async function remove(req: Request, res: Response) {
  await transactionsRepo.deleteTransaction(idParam(req));
  res.status(204).send();
}
