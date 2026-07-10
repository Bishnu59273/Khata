import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  createCustomerPaymentSchema,
  createCustomerSchema,
  listCustomersQuerySchema,
  updateCustomerSchema,
} from '../schemas/customers.schema.js';
import * as customersRepo from '../repositories/customers.repository.js';
import { AppError } from '../utils/AppError.js';
import { authUser, idParam } from '../utils/params.js';

const paymentIdSchema = z.uuid();

export async function list(req: Request, res: Response) {
  const { search } = listCustomersQuerySchema.parse(req.query);
  const customers = await customersRepo.listCustomers(authUser(req).shopId, search);
  res.json(customers);
}

export async function getOne(req: Request, res: Response) {
  const customer = await customersRepo.getCustomerById(authUser(req).shopId, idParam(req));
  if (!customer) throw new AppError(404, 'Customer not found');
  res.json(customer);
}

export async function create(req: Request, res: Response) {
  const input = createCustomerSchema.parse(req.body);
  const customer = await customersRepo.createCustomer(authUser(req).shopId, input);
  res.status(201).json(customer);
}

export async function update(req: Request, res: Response) {
  const input = updateCustomerSchema.parse(req.body);
  const customer = await customersRepo.updateCustomer(authUser(req).shopId, idParam(req), input);
  if (!customer) throw new AppError(404, 'Customer not found');
  res.json(customer);
}

export async function remove(req: Request, res: Response) {
  const shopId = authUser(req).shopId;
  const customer = await customersRepo.getCustomerById(shopId, idParam(req));
  if (!customer) throw new AppError(404, 'Customer not found');
  if (customer.balance !== 0) {
    throw new AppError(409, 'Customer has outstanding balance', 'HAS_BALANCE');
  }
  await customersRepo.deleteCustomer(shopId, customer.id);
  res.status(204).send();
}

export async function statement(req: Request, res: Response) {
  const shopId = authUser(req).shopId;
  const customer = await customersRepo.getCustomerById(shopId, idParam(req));
  if (!customer) throw new AppError(404, 'Customer not found');
  const entries = await customersRepo.getCustomerStatement(shopId, customer.id);
  res.json({ customer, entries });
}

export async function createPayment(req: Request, res: Response) {
  const input = createCustomerPaymentSchema.parse(req.body);
  const shopId = authUser(req).shopId;
  const customer = await customersRepo.getCustomerById(shopId, idParam(req));
  if (!customer) throw new AppError(404, 'Customer not found');
  const payment = await customersRepo.createPayment(shopId, customer.id, input);
  res.status(201).json(payment);
}

export async function removePayment(req: Request, res: Response) {
  const paymentId = paymentIdSchema.parse(req.params.paymentId);
  await customersRepo.deletePayment(authUser(req).shopId, idParam(req), paymentId);
  res.status(204).send();
}
