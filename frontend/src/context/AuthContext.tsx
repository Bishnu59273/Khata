import { createContext, useContext, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getMe, login, logout, signup } from '../api/auth';
import type { LoginInput, Me, Shop, SignupInput, User } from '../types/auth';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

interface AuthContextValue {
  user: User | null;
  shop: Shop | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginMutation: UseMutationResult<Me, Error, LoginInput>;
  signupMutation: UseMutationResult<Me, Error, SignupInput>;
  logoutMutation: UseMutationResult<void, Error, void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (me) => {
      queryClient.clear();
      queryClient.setQueryData(AUTH_QUERY_KEY, me);
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (me) => {
      queryClient.clear();
      queryClient.setQueryData(AUTH_QUERY_KEY, me);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  const me = meQuery.data ?? null;

  return (
    <AuthContext.Provider
      value={{
        user: me?.user ?? null,
        shop: me?.shop ?? null,
        isAuthenticated: !!me,
        isLoading: meQuery.isLoading,
        loginMutation,
        signupMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
