import { Router } from 'express';
import * as expensesController from '../controllers/expenses.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const expensesRouter = Router();

expensesRouter.use(requireAuth);

expensesRouter.get('/', expensesController.list);
expensesRouter.get('/:id', expensesController.getOne);
expensesRouter.post('/', expensesController.create);
expensesRouter.patch('/:id', expensesController.update);
expensesRouter.delete('/:id', expensesController.remove);
