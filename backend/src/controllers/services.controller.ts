import type { Request, Response } from 'express';
import {
  createServiceSchema,
  listServicesQuerySchema,
  updateServiceSchema,
} from '../schemas/services.schema.js';
import * as servicesRepo from '../repositories/services.repository.js';
import { AppError } from '../utils/AppError.js';
import { idParam } from '../utils/params.js';

export async function list(req: Request, res: Response) {
  const { all } = listServicesQuerySchema.parse(req.query);
  const services = await servicesRepo.listServices(all ?? false);
  res.json(services);
}

export async function getOne(req: Request, res: Response) {
  const service = await servicesRepo.getServiceById(idParam(req));
  if (!service) throw new AppError(404, 'Service not found');
  res.json(service);
}

export async function create(req: Request, res: Response) {
  const input = createServiceSchema.parse(req.body);
  const service = await servicesRepo.createService(input);
  res.status(201).json(service);
}

export async function update(req: Request, res: Response) {
  const input = updateServiceSchema.parse(req.body);
  const service = await servicesRepo.updateService(idParam(req), input);
  res.json(service);
}

export async function remove(req: Request, res: Response) {
  const service = await servicesRepo.softDeleteService(idParam(req));
  res.json(service);
}
