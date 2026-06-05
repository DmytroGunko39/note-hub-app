import css from './page.module.css';
import Link from 'next/link';

const features = [
  {
    title: 'Smart Organization',
    description:
      'Categorize every note with tags — Work, Personal, Meeting and more. Browse exactly what you need, instantly.',
    icon: (
      <svg
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Quick Search',
    description:
      'Find any note in milliseconds with full-text search. Never lose a thought no matter how many notes you have.',
    icon: (
      <svg
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: 'Secure & Private',
    description:
      'Your notes are protected behind authenticated access. Only you can read, edit, and delete your data.',
    icon: (
      <svg
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const Home = () => {
  return (
    <main className={css.main}>
      <section className={css.hero}>
        <div className={css.heroBg} aria-hidden="true" />
        <div className={css.heroContent}>
          <h1 className={css.heroTitle}>Welcome to NoteHub</h1>
          <p className={css.heroSubtitle}>Your thoughts, organized.</p>
          <div className={css.heroActions}>
            <Link href="/sign-up" className={css.btnPrimary}>
              Get Started
            </Link>
            <Link href="/notes/filter/All" className={css.btnSecondary}>
              View Notes
            </Link>
          </div>
        </div>
      </section>

      <section className={css.features}>
        <div className={css.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={css.featureCard}>
              <div className={css.featureIconWrap}>{feature.icon}</div>
              <h3 className={css.featureTitle}>{feature.title}</h3>
              <p className={css.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
