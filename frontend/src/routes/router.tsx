import { createBrowserRouter } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { AddTransactionPage } from "../pages/AddTransactionPage";
import { ReportsPage } from "../pages/ReportsPage";
import { ExpensesPage } from "../pages/ExpensesPage";
import { ServicesPage } from "../pages/ServicesPage";
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
      { path: "reports", element: <ReportsPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
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
