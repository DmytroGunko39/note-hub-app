'use client';

import Image from 'next/image';
import css from './ProfilePage.module.css';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api/clientApi';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const userData = await getMe();
        // Only update state if component is still mounted
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        // Only log error if component is still mounted (not during logout)
        if (isMounted) {
          console.error('Failed to fetch user:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }

    // Cleanup: prevent state updates after unmount (e.g., during logout)
    return () => {
      isMounted = false;
    };
  }, [user, setUser]);

  if (loading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p>User data could not be loaded.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.jpg'}
            alt={`${user.name}'s Avatar`}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
