'use client';
import { User } from '@/types/user';
import { api } from './api';
import type { Note, NewNoteData } from '@/types/note';
import type {
  ApiResponse,
  RegisterRequestData,
  FetchNotesResponse,
  FetchNotesParams,
  LoginRequestData,
  ForgotPasswordRequestData,
  ResetPasswordRequestData,
} from '@/types/types';

// Login response includes accessToken
export type LoginResponse = {
  accessToken: string;
  user: User;
};

export const fetchNotes = async ({
  page = 1,
  perPage = 9,
  search = '',
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  // API route returns the full response object directly
  // { status, message, data: [...notes], page, perPage, totalPages, ... }
  return res.data;
};

export const createNote = async (notesData: NewNoteData): Promise<Note> => {
  const res = await api.post<ApiResponse<Note>>('/notes', notesData);
  return res.data.data;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await api.delete(`/notes/${noteId}`);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<ApiResponse<Note>>(`/notes/${id}`);
  return res.data.data;
};

export const loginUser = async (
  credentials: LoginRequestData,
): Promise<LoginResponse> => {
  const res = await api.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    credentials,
  );
  return res.data.data;
};

export const logOutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const registerUser = async (
  credentials: RegisterRequestData,
): Promise<User> => {
  const res = await api.post<ApiResponse<User>>('/auth/register', credentials);
  return res.data.data;
};

export const refreshSession = async (): Promise<LoginResponse | null> => {
  try {
    const res = await api.get<ApiResponse<LoginResponse>>('/auth/session');
    return res.data.data;
  } catch {
    // No session (401) or other error - return null instead of throwing
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>('/users/me');
  return res.data.data;
};

export const updateMe = async (payload: {
  name?: string;
  avatar?: string | null;
  email?: string;
  password?: string;
}): Promise<User> => {
  const res = await api.patch<ApiResponse<User>>('/users/me', payload);
  return res.data.data;
};

export const sendForgotPassword = async (
  payload: ForgotPasswordRequestData,
) => {
  await api.post('/auth/forgot-password', payload);
};

export const resetPassword = async (payload: ResetPasswordRequestData) => {
  await api.post('/auth/reset-password', payload);
};
