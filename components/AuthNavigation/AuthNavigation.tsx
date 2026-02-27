'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { logOutUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

const AuthNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await logOutUser();
    clearAuth();
    router.replace('/sign-in');
  };
  return (
    <ul className={css.navigationList}>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default AuthNavigation;
