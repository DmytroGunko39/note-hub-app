'use client';

import { registerUser } from '@/lib/api/clientApi';
import css from './SignUpPage.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { RegisterRequestData } from '@/types/types';

export default function SignUpPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSignUp = async (formData: FormData) => {
    const data = Object.fromEntries(formData) as RegisterRequestData;

    try {
      setErrorMessage(null);
      await registerUser(data);
      // Registration successful - redirect to sign-in
      // Backend doesn't return tokens on register, user must log in
      router.push('/sign-in');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage('Такий користувач вже існує');
      } else {
        setErrorMessage('Невідома помилка');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSignUp}>
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
            Register
          </button>
        </div>
        {errorMessage && <p className={css.error}>{errorMessage}</p>}
      </form>
    </main>
  );
}
