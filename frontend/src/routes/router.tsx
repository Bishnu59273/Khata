import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { AddTransactionPage } from '../pages/AddTransactionPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ExpensesPage } from '../pages/ExpensesPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'transactions/new', element: <AddTransactionPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
