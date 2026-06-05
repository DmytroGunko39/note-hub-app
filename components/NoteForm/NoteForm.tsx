'use client';

import css from './NoteForm.module.css';
import type { NewNoteData, NoteTag } from '../../types/note';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useDraftNote } from '@/lib/store/noteStore';
import { ChangeEvent } from 'react';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

const TAG_OPTIONS = [
  { value: 'Todo',     label: 'Todo'     },
  { value: 'Work',     label: 'Work'     },
  { value: 'Personal', label: 'Personal' },
  { value: 'Meeting',  label: 'Meeting'  },
  { value: 'Shopping', label: 'Shopping' },
];

export interface NoteFormProps {
  initialValues?: {
    title?: string;
    content?: string;
    tag?: NoteTag;
  };
  serverErrors?: Record<string, string>;
  cancelHref?: string;
}

export default function NoteForm({
  initialValues,
  cancelHref = '/notes/filter/All',
  serverErrors,
}: NoteFormProps) {
  const { draft, setDraft, clearDraft } = useDraftNote();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (noteData: NewNoteData) => createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/All');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData) as unknown as NewNoteData;
    mutate(values);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setDraft({
      ...(draft as NewNoteData),
      [e.target.name as keyof NewNoteData]: e.target.value,
    });
  };
  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={initialValues?.title ?? draft.title ?? ''}
          required
          minLength={3}
          maxLength={50}
          onChange={handleChange}
        />
        {serverErrors?.title && (
          <span className={css.error}>{serverErrors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={initialValues?.content ?? draft.content ?? ''}
          maxLength={500}
          onChange={handleChange}
        />
        {serverErrors?.content && (
          <span className={css.error}>{serverErrors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <CustomSelect
          id="tag"
          name="tag"
          defaultValue={initialValues?.tag ?? draft.tag ?? 'Todo'}
          required
          options={TAG_OPTIONS}
          onChange={handleChange}
        />
        {serverErrors?.tag && (
          <span className={css.error}>{serverErrors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button
          className={css.cancelButton}
          onClick={() => router.push(cancelHref)}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          {isPending ? 'Creating note...' : 'Create note'}
        </button>
      </div>
      {error && <p className={css.error}>Failed ot create new note</p>}
    </form>
  );
}
