export type EntryType = 'Journal' | 'Article' | 'Thesis' | 'Literature Review';

export type Category =
  | 'Clinical Psychology'
  | 'Developmental Psychology'
  | 'Cognitive Psychology'
  | 'Social Psychology'
  | 'Educational Psychology'
  | 'Mental Health'
  | 'Research Methods';

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
}

export type EntryInput = Omit<Entry, 'id'>;

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

export interface FetchEntriesParams {
  page?: number;
  limit?: number;
  category?: string;
}
