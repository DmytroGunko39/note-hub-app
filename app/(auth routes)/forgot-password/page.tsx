'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { sendForgotPassword } from '@/lib/api/clientApi';
import css from './ForgotPasswordPage.module.css';

export default function ForgotPasswordPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get('email') as string;
      try {
        await sendForgotPassword({ email });
        setStatusMessage(
          "If an account exists for that email, we've sent a reset link.",
        );
      } catch (error: unknown) {
        console.error('Failed to request password reset', error);
        // Extract error message from backend response if available
        const axiosError = error as {
          response?: {
            data?: { response?: { message?: string }; error?: string };
          };
        };
        const backendMessage =
          axiosError?.response?.data?.response?.message ||
          axiosError?.response?.data?.error ||
          'Could not send reset link. Please try again later.';
        setStatusMessage(backendMessage);
      }
    });
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Reset your password</h1>
        <p className={css.description}>
          Enter the email address associated with your account. We will send you
          a link to reset your password.
        </p>

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

        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? 'Sending…' : 'Send reset link'}
        </button>

        {statusMessage && <p className={css.status}>{statusMessage}</p>}

        <p className={css.backLink}>
          <Link href="/sign-in">Back to sign in</Link>
        </p>
      </form>
    </main>
  );
}
