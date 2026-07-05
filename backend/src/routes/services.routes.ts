import { Router } from 'express';
import * as servicesController from '../controllers/services.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const servicesRouter = Router();

servicesRouter.use(requireAuth);

servicesRouter.get('/', servicesController.list);
servicesRouter.get('/:id', servicesController.getOne);
servicesRouter.post('/', servicesController.create);
servicesRouter.patch('/:id', servicesController.update);
servicesRouter.delete('/:id', servicesController.remove);
