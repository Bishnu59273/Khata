import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { servicesRouter } from './services.routes.js';
import { transactionsRouter } from './transactions.routes.js';
import { expensesRouter } from './expenses.routes.js';
import { shopsRouter } from './shops.routes.js';
import { customersRouter } from './customers.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/transactions', transactionsRouter);
apiRouter.use('/expenses', expensesRouter);
apiRouter.use('/shops', shopsRouter);
apiRouter.use('/customers', customersRouter);
