'use client';

import css from '@/components/NotesPage/NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { useDebouncedCallback } from 'use-debounce';
import { NoteTag } from '@/types/note';
import { FetchNotesResponse } from '@/types/types';

export interface NoteClientProps {
  initialData: FetchNotesResponse;
  tag?: NoteTag | undefined | 'All';
}

export default function NotesClient({ initialData, tag }: NoteClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTopic, setSearchTopic] = useState('');
  const perPage = 9;

  const updateSearchTopic = useDebouncedCallback((newSearchTopic: string) => {
    setSearchTopic(newSearchTopic);
    setCurrentPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchTopic, currentPage, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: searchTopic,
        ...(tag && tag !== 'All' ? { tag } : {}),
      }),
    placeholderData: keepPreviousData,
    initialData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <h2>Failed to load notes</h2>;

  const notesToDisplay = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <main>
        <section>
          <header className={css.toolbar}>
            <SearchBox value={searchTopic} onSearch={updateSearchTopic} />
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            )}
            <Link href={'/notes/action/create'} className={css.button}>
              Create note +
            </Link>
          </header>
          {data && !isLoading && <NoteList notes={notesToDisplay} />}
        </section>
      </main>
    </div>
  );
}
