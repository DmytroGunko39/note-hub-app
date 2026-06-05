'use client';
import css from './Header.module.css';
import Link from 'next/link';
import TagsMenu from '../TagsMenu/TagsMenu';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import { useState, useEffect } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 769) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <header className={`${css.header} ${scrolled ? css.scrolled : ''}`}>
      <div className={css.inner}>
        <Link href="/" className={css.logo} aria-label="NoteHub home">
          <span className={css.logoMark} aria-hidden="true">N</span>
          <span className={css.logoName}>NoteHub</span>
        </Link>

        <nav className={css.desktopNav} aria-label="Main navigation">
          <Link href="/" className={css.navLink}>Home</Link>
          <TagsMenu />
        </nav>

        <div className={css.right}>
          <AuthNavigation />

          <button
            className={`${css.hamburger} ${menuOpen ? css.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className={css.backdrop}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav"
            className={css.mobileDrawer}
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              className={css.mobileNavLink}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <div className={css.mobileNavItem}>
              <TagsMenu />
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
