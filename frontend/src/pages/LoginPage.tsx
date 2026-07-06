import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { PasswordInput } from '../components/common/PasswordInput';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { t } = useTranslation('auth');
  const { loginMutation } = useAuth();
  const location = useLocation();
  const sessionExpired = (location.state as { reason?: string } | null)?.reason === 'expired';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setFormError(t('validation.required'));
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setFormError(t('validation.emailInvalid'));
      return;
    }

    loginMutation.mutate({ email: trimmedEmail, password });
  }

  const errorMessage =
    formError ??
    (loginMutation.isError
      ? loginMutation.error instanceof ApiError
        ? loginMutation.error.message
        : t('login.error')
      : null);

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-1 text-xl font-bold text-ink-900">{t('login.title')}</h1>
      <p className="mb-6 text-sm text-ink-600">{t('login.subtitle')}</p>

      {sessionExpired && (
        <p className="mb-4 rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-medium text-ink-700">
          {t('session.expired')}
        </p>
      )}

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('login.email')}</label>
      <input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('login.password')}</label>
      <PasswordInput autoComplete="current-password" value={password} onChange={setPassword} />

      {errorMessage && <p className="mb-4 text-sm font-medium text-danger-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-xl bg-brand-500 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? t('login.submitting') : t('login.submit')}
      </button>

      <p className="mt-4 text-center text-sm text-ink-600">
        {t('login.noAccount')}{' '}
        <Link to="/signup" className="font-semibold text-brand-600 hover:underline">
          {t('login.signupLink')}
        </Link>
      </p>
    </form>
  );
}
