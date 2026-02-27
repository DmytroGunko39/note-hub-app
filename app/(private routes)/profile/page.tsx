import Image from 'next/image';
import css from './ProfilePage.module.css';
import type { Metadata } from 'next';
import { getMeServer } from '@/lib/api/serverApi';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Profile Rage - NoteHub',
  description: 'User profile page with account details.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Profile Page',
    description: 'View and manage your NoteHub profile.',
    url: '/profile',
    type: 'profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'User Profile - NoteHub',
      },
    ],
  },
};

const Profile = async () => {
  const user = await getMeServer();

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
            src={user.avatar || '/default-avatar.png'}
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
};

export default Profile;
