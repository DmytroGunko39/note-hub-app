'use client';

import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';
import { getMe, updateMe } from '@/lib/api/clientApi';

export default function EditUser() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUserName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    getMe().then((user: User) => {
      setUser(user);
      setUserName(user.name ?? '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (user && username !== user.name) {
        const updated = await updateMe({ name: username });
        setUser(updated);
        setSaveMessage('Data saved successfully!');
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      }
    } catch (error) {
      console.error('Profile updated failed', error);
    }
  };

  const handleCancel = () => {
    setUserName(user?.name ?? '');
    router.push('/profile');
  };

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
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || '/default-avatar.jpg'}
          alt={`${user.name}'s Avatar`}
          width={120}
          height={120}
          className={css.avatar}
          priority
        />

        <form className={css.profileInfo} onSubmit={handleSaveUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={handleChange}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
            {saveMessage && <p className={css.successMessage}>{saveMessage}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
