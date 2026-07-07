import type { Request, Response } from 'express';
import { updateShopSchema } from '../schemas/shops.schema.js';
import * as shopsRepo from '../repositories/shops.repository.js';
import { AppError } from '../utils/AppError.js';
import { authUser } from '../utils/params.js';

export async function getMe(req: Request, res: Response) {
  const shop = await shopsRepo.getShopById(authUser(req).shopId);
  if (!shop) throw new AppError(404, 'Shop not found');
  res.json(shop);
}

export async function updateMe(req: Request, res: Response) {
  const input = updateShopSchema.parse(req.body);
  const shop = await shopsRepo.updateShop(authUser(req).shopId, input);
  res.json(shop);
}
