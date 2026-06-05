'use client';
import Link from 'next/link';
import Image from 'next/image';
import css from './AuthNavigation.module.css';
import { logOutUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

const getInitials = (user: User): string => {
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
};

const AuthNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await logOutUser();
    clearAuth();
    router.replace('/sign-in');
  };

  if (isAuthenticated && user) {
    return (
      <div className={css.group}>
        <Link
          href="/profile"
          className={css.profileLink}
          prefetch={false}
          aria-label="Go to profile"
        >
          <span className={css.avatar}>
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name ?? user.email}
                width={28}
                height={28}
                className={css.avatarImg}
              />
            ) : (
              <span className={css.avatarInitials}>{getInitials(user)}</span>
            )}
          </span>
          <span className={css.email}>{user.name ?? user.email}</span>
        </Link>

        <button className={css.logoutButton} onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className={css.group}>
      <Link href="/sign-in" prefetch={false} className={css.loginLink}>
        Log in
      </Link>
      <Link href="/sign-up" prefetch={false} className={css.signUpLink}>
        Sign up
      </Link>
    </div>
  );
};

export default AuthNavigation;
