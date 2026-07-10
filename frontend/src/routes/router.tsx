import { createBrowserRouter } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { AddTransactionPage } from "../pages/AddTransactionPage";
import { CustomersPage } from "../pages/CustomersPage";
import { CustomerDetailPage } from "../pages/CustomerDetailPage";
import { ReportsPage } from "../pages/ReportsPage";
import { ExpensesPage } from "../pages/ExpensesPage";
import { ServicesPage } from "../pages/ServicesPage";
import { SettingsPage } from "../pages/SettingsPage";
import { BillPreviewPage } from "../pages/BillPreviewPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RequireAuth } from "./RequireAuth";
import { RedirectIfAuthenticated } from "./RedirectIfAuthenticated";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "transactions/new", element: <AddTransactionPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "customers/:id", element: <CustomerDetailPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "bills/preview",
    element: (
      <RequireAuth>
        <BillPreviewPage />
      </RequireAuth>
    ),
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: "signup",
        element: (
          <RedirectIfAuthenticated>
            <SignupPage />
          </RedirectIfAuthenticated>
        ),
      },
    ],
  },
]);
