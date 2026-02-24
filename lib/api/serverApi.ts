import { api } from './api';
import { cookies } from 'next/headers';
import type { Note } from '../../types/note';
import type {
  ApiResponse,
  FetchNotesResponse,
  FetchNotesParams,
} from '@/types/types';
import { AxiosResponse } from 'axios';
import { User } from '@/types/user';
import { LoginResponse } from './clientApi';

// Helper to get auth header from cookies (for server-side requests)
const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  // For refresh, we still need to send cookies (refreshToken is in httpOnly cookie)
  return { Cookie: cookieStore.toString() };
};

export const fetchNotesServer = async (
  { page = 1, perPage = 9, search = '', tag }: FetchNotesParams = {},
  accessToken?: string,
): Promise<FetchNotesResponse> => {
  const res = await api.get<ApiResponse<FetchNotesResponse>>('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : await getAuthHeaders(),
  });

  return res.data.data;
};

export const fetchNoteByIdServer = async (
  id: string,
  accessToken?: string,
): Promise<Note> => {
  const res = await api.get<ApiResponse<Note>>(`/notes/${id}`, {
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : await getAuthHeaders(),
  });
  return res.data.data;
};

export const refreshServerSession = async (): Promise<
  AxiosResponse<ApiResponse<LoginResponse>>
> => {
  const cookieStore = await cookies();
  const res = await api.get<ApiResponse<LoginResponse>>('/auth/session', {
    headers: { Cookie: cookieStore.toString() },
  });
  return res;
};

export const getMeServer = async (
  accessToken?: string,
): Promise<User | null> => {
  try {
    const res = await api.get<ApiResponse<User>>('/users/me', {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : await getAuthHeaders(),
    });
    return res.data.data;
  } catch (error) {
    console.error('Failed to fetch user on server:', error);
    return null;
  }
};
