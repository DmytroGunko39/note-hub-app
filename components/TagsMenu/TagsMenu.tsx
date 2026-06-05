'use client';
import css from '@/components/TagsMenu/TagsMenu.module.css';
import { NoteTag } from '@/types/note';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const TagsMenu = () => {
  const tags: NoteTag[] = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div className={css.menuContainer} ref={containerRef}>
      <button onClick={() => setIsOpen((v) => !v)} className={css.menuButton}>
        Notes {isOpen ? '▴' : '▾'}
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem}>
            <Link href="/notes/filter/All" className={css.menuLink} onClick={close}>
              All notes
            </Link>
          </li>
          {tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag}`}
                className={css.menuLink}
                onClick={close}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
