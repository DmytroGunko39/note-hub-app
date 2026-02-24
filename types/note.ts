export type NoteTag = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

// DELETE /notes/:id returns 204 No Content (no response body)
export type DeleteNoteResponse = void;
