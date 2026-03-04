'use client';

import css from '@/components/NoteDetailsClient/NoteDetailsClient.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';

interface NoteDetailsClientProps {
  id: string;
}

const NoteDetailsClient = ({ id }: NoteDetailsClientProps) => {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    enabled: !!id,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  const formattedDate = note.updatedAt
    ? `Update at:${note.updatedAt}`
    : `Create at:${note.createdAt}`;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2 className={css.header}>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content || 'No content available.'}</p>
        <p className={css.date}>{formattedDate}</p>
      </div>
    </div>
  );
};
export default NoteDetailsClient;
