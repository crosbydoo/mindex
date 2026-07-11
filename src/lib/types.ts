export type EntryType = 'Journal' | 'Article' | 'Thesis' | 'Literature Review';

/** Live category name from GET /api/categories/list */
export type Category = string;

export interface Entry {
  id: number;
  title: string;
  abstract: string;
  category: Category;
  year: number;
  author: string;
  source: string;
  type: EntryType;
  url: string;
  is_archived: boolean;
}

export type EntryInput = Omit<Entry, 'id' | 'is_archived'>;

/** Standard API response envelope from the Go backend. */
export interface ApiEnvelope<T> {
  code: number;
  status: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedEntries {
  items: Entry[];
  pagination: Pagination;
}

export interface CategoryEntries {
  category: string;
  items: Entry[];
  pagination: Pagination;
}

export interface CategoriesResponse {
  categories: CategoryEntries[];
}

export interface CategoryItem {
  id: number;
  name: string;
  entry_count: number;
}

export interface CategoryListResponse {
  items: CategoryItem[];
}

export interface CategoryInput {
  name: string;
}

/** API archived query: active only, archived only, or both. */
export type ArchivedFilter = 'false' | 'true' | 'all' | 'active' | 'archived';

export interface FetchEntriesParams {
  page?: number;
  limit?: number;
  category?: string;
  archived?: ArchivedFilter;
}

export interface LoginRequest {
  password: string;
}

export interface LoginData {
  token: string;
}

export interface HealthData {
  status: 'ok';
}

/** Body for bulk archive / unarchive / delete. */
export interface BulkIdsRequest {
  ids: number[];
}

export interface BulkActionResult {
  affected: number;
  ids: number[];
}
