import { Router } from 'express';
import * as customersController from '../controllers/customers.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const customersRouter = Router();

customersRouter.use(requireAuth);

customersRouter.get('/', customersController.list);
customersRouter.get('/:id', customersController.getOne);
customersRouter.post('/', customersController.create);
customersRouter.patch('/:id', customersController.update);
customersRouter.delete('/:id', customersController.remove);
customersRouter.get('/:id/statement', customersController.statement);
customersRouter.post('/:id/payments', customersController.createPayment);
customersRouter.delete('/:id/payments/:paymentId', customersController.removePayment);
