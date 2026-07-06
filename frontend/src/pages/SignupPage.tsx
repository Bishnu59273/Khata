import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { PasswordInput } from '../components/common/PasswordInput';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function SignupPage() {
  const { t } = useTranslation('auth');
  const { signupMutation } = useAuth();

  const [shopName, setShopName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedShopName = shopName.trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedShopName || !trimmedName || !trimmedEmail || !password) {
      setFormError(t('validation.required'));
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setFormError(t('validation.emailInvalid'));
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(t('validation.passwordTooShort'));
      return;
    }

    signupMutation.mutate({ shopName: trimmedShopName, name: trimmedName, email: trimmedEmail, password });
  }

  const errorMessage =
    formError ??
    (signupMutation.isError
      ? signupMutation.error instanceof ApiError
        ? signupMutation.error.message
        : t('signup.error')
      : null);

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-1 text-xl font-bold text-ink-900">{t('signup.title')}</h1>
      <p className="mb-6 text-sm text-ink-600">{t('signup.subtitle')}</p>

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('signup.shopName')}</label>
      <input
        autoComplete="organization"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('signup.name')}</label>
      <input
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('signup.email')}</label>
      <input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 w-full rounded-xl border border-border-soft bg-white px-3.5 py-2.5 text-base font-medium text-ink-900"
      />

      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t('signup.password')}</label>
      <PasswordInput autoComplete="new-password" value={password} onChange={setPassword} />

      {errorMessage && <p className="mb-4 text-sm font-medium text-danger-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={signupMutation.isPending}
        className="w-full rounded-xl bg-brand-500 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signupMutation.isPending ? t('signup.submitting') : t('signup.submit')}
      </button>

      <p className="mt-4 text-center text-sm text-ink-600">
        {t('signup.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          {t('signup.loginLink')}
        </Link>
      </p>
    </form>
  );
}
