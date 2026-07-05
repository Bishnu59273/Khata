import { Router } from 'express';
import { servicesRouter } from './services.routes.js';
import { transactionsRouter } from './transactions.routes.js';
import { expensesRouter } from './expenses.routes.js';

export const apiRouter = Router();

apiRouter.use('/services', servicesRouter);
apiRouter.use('/transactions', transactionsRouter);
apiRouter.use('/expenses', expensesRouter);
