import { Router } from 'express';
import * as shopsController from '../controllers/shops.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const shopsRouter = Router();

shopsRouter.use(requireAuth);

shopsRouter.get('/me', shopsController.getMe);
shopsRouter.patch('/me', shopsController.updateMe);
