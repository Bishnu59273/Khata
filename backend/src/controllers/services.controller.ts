import type { Request, Response } from 'express';
import {
  createServiceSchema,
  listServicesQuerySchema,
  updateServiceSchema,
} from '../schemas/services.schema.js';
import * as servicesRepo from '../repositories/services.repository.js';
import { AppError } from '../utils/AppError.js';
import { authUser, idParam } from '../utils/params.js';

export async function list(req: Request, res: Response) {
  const { all } = listServicesQuerySchema.parse(req.query);
  const services = await servicesRepo.listServices(authUser(req).shopId, all ?? false);
  res.json(services);
}

export async function getOne(req: Request, res: Response) {
  const service = await servicesRepo.getServiceById(authUser(req).shopId, idParam(req));
  if (!service) throw new AppError(404, 'Service not found');
  res.json(service);
}

export async function create(req: Request, res: Response) {
  const input = createServiceSchema.parse(req.body);
  const service = await servicesRepo.createService(authUser(req).shopId, input);
  res.status(201).json(service);
}

export async function update(req: Request, res: Response) {
  const input = updateServiceSchema.parse(req.body);
  const service = await servicesRepo.updateService(authUser(req).shopId, idParam(req), input);
  if (!service) throw new AppError(404, 'Service not found');
  res.json(service);
}

export async function remove(req: Request, res: Response) {
  const service = await servicesRepo.softDeleteService(authUser(req).shopId, idParam(req));
  if (!service) throw new AppError(404, 'Service not found');
  res.json(service);
}
