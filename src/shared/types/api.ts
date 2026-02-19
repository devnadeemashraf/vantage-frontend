/**
 * API Response Shapes
 * Layer: Shared
 *
 * Mirrors the backend's response wrappers. Every list endpoint returns
 * PaginatedResponse<T>, every single-item endpoint returns ApiResponse<T>.
 * These types are consumed by RTK Query endpoint definitions.
 */

import type { Business } from './business';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  status: 'success';
  data: T;
}

export type SearchResponse = PaginatedResponse<Business>;
export type BusinessDetailResponse = ApiResponse<Business>;

export interface SearchParams {
  q?: string;
  state?: string;
  postcode?: string;
  entityType?: string;
  abnStatus?: string;
  page?: number;
  limit?: number;
  mode?: 'standard' | 'ai';
}
