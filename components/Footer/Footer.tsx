import css from './Footer.module.css';
import Link from 'next/link';
import Logo from '../Logo/Logo';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <Link href="/" className={css.logo} aria-label="NoteHub home">
          <Logo size={28} />
          <span className={css.logoName}>NoteHub</span>
        </Link>
        <div className={css.text}>
          <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
          <div className={css.wrap}>
            <p>Developer: Dmytro Gunko</p>
            <p>
              Contact us:
              <a href="mailto:student@notehub.app">student@notehub.app</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
