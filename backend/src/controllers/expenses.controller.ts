import type { Request, Response } from 'express';
import {
  createExpenseSchema,
  listExpensesQuerySchema,
  updateExpenseSchema,
} from '../schemas/expenses.schema.js';
import * as expensesRepo from '../repositories/expenses.repository.js';
import { AppError } from '../utils/AppError.js';
import { idParam } from '../utils/params.js';

export async function list(req: Request, res: Response) {
  const filters = listExpensesQuerySchema.parse(req.query);
  const expenses = await expensesRepo.listExpenses(filters);
  res.json(expenses);
}

export async function getOne(req: Request, res: Response) {
  const expense = await expensesRepo.getExpenseById(idParam(req));
  if (!expense) throw new AppError(404, 'Expense not found');
  res.json(expense);
}

export async function create(req: Request, res: Response) {
  const input = createExpenseSchema.parse(req.body);
  const expense = await expensesRepo.createExpense(input);
  res.status(201).json(expense);
}

export async function update(req: Request, res: Response) {
  const input = updateExpenseSchema.parse(req.body);
  const expense = await expensesRepo.updateExpense(idParam(req), input);
  res.json(expense);
}

export async function remove(req: Request, res: Response) {
  await expensesRepo.deleteExpense(idParam(req));
  res.status(204).send();
}
