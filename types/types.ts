import { Note } from './note';

// Generic wrapper for all API responses
export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
}

export interface FetchNotesResponse {
  status: number;
  message: string;
  data: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export type LoginRequestData = {
  email: string;
  password: string;
};

export type RegisterRequestData = {
  email: string;
  password: string;
};

export type ForgotPasswordRequestData = {
  email: string;
};

export type ResetPasswordRequestData = {
  token: string;
  password: string;
};
