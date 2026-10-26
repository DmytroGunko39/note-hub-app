import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Note Page',
  description: 'Page where you create a new note',
  openGraph: {
    title: 'Adding a new Note Page',
    description: 'Page for creating a new note on NoteHub',
    url: 'https://08-zustand-theta-two.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub logo',
      },
    ],
    type: 'article',
  },
};

const CreateNote = () => {
  return (
    <div className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm cancelHref="/notes/filter/All" />
      </div>
    </div>
  );
};

export default CreateNote;
