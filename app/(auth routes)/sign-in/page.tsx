'use client';

import Link from 'next/link';
import { useState } from 'react';
import css from './SignInPage.module.css';
import { LoginRequestData } from '@/types/types';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api/clientApi';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const passwordResetSuccess = searchParams.get('reset') === 'success';

  const handleSignIn = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData) as LoginRequestData;
      const response = await loginUser(data);

      if (response) {
        // Store accessToken in Zustand (used by Axios interceptor)
        setAccessToken(response.accessToken);
        // Store user data
        setUser(response.user);
        router.push('/profile');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Sign in failed');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSignIn}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
          <Link href="/forgot-password" className={css.forgotLink}>
            Forgot password?
          </Link>
        </div>

        {passwordResetSuccess && (
          <p className={css.success}>Password updated. Please sign in.</p>
        )}
        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
