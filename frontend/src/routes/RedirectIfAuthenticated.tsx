import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/common/LoadingState';

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center bg-cream">
        <LoadingState />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
