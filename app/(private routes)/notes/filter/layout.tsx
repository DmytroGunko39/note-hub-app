import React from 'react';
import css from '@/components/LayoutNotes/LayoutNotes.module.css';

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const LayoutNotes = ({ children, sidebar }: Props) => {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
};

export default LayoutNotes;
