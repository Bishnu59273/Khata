import { Router } from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const transactionsRouter = Router();

transactionsRouter.use(requireAuth);

transactionsRouter.get('/today', transactionsController.today);
transactionsRouter.get('/', transactionsController.list);
transactionsRouter.get('/:id', transactionsController.getOne);
transactionsRouter.post('/', transactionsController.create);
transactionsRouter.patch('/:id', transactionsController.update);
transactionsRouter.delete('/:id', transactionsController.remove);
