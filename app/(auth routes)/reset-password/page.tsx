'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import css from './ResetPasswordPage.module.css';
import { resetPassword } from '@/lib/api/clientApi';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <main className={css.mainContent}>
        <div className={css.errorCard}>
          <h1>Invalid reset link</h1>
          <p>The password reset link is missing or invalid.</p>
          <Link href="/forgot-password">Request a new link</Link>
        </div>
      </main>
    );
  }

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      // Validate passwords match on frontend (don't send confirmPassword to backend)
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      try {
        // Only send token and password to backend
        await resetPassword({ token, password });
        router.push('/sign-in?reset=success');
      } catch (err) {
        console.error('Password reset failed', err);
        setError((err as Error).message ?? 'Password reset failed.');
      }
    });
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Choose a new password</h1>
        <p className={css.description}>
          Your new password must be at least 12 characters and include a mix of
          letters, numbers, and symbols.
        </p>

        <div className={css.formGroup}>
          <label htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={12}
            autoComplete="new-password"
            required
            className={css.input}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={12}
            autoComplete="new-password"
            required
            className={css.input}
          />
        </div>

        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? 'Updating…' : 'Update password'}
        </button>

        {error && <p className={css.error}>{error}</p>}

        <p className={css.backLink}>
          <Link href="/sign-in">Back to sign in</Link>
        </p>
      </form>
    </main>
  );
}
