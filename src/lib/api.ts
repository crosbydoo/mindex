import type {
  ApiEnvelope,
  BulkActionResult,
  CategoriesResponse,
  Entry,
  EntryInput,
  FetchEntriesParams,
  HealthData,
  LoginData,
  PaginatedEntries,
} from './types';
import { getAdminToken } from './auth';

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : 'https://mindex-api.duckdns.org')
).replace(/\/$/, '');

function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!body || typeof body !== 'object') {
    throw new Error(response.statusText || 'Request failed');
  }

  if (!response.ok || body.status === false) {
    throw new Error(body.message || response.statusText || 'Request failed');
  }

  return body.data as T;
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return { Authorization: `Bearer ${token}` };
}

function normalizeIds(ids: number[]): number[] {
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))];
}

export async function checkHealth(): Promise<HealthData> {
  return request<HealthData>('/health');
}

export async function fetchEntries(
  params: FetchEntriesParams = {},
): Promise<PaginatedEntries> {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? 100));
  if (params.category) {
    search.set('category', params.category);
  }
  if (params.archived) {
    search.set('archived', params.archived);
  }

  return request<PaginatedEntries>(`/api/entries?${search.toString()}`);
}

export async function fetchCategories(params: {
  page?: number;
  limit?: number;
  archived?: FetchEntriesParams['archived'];
} = {}): Promise<CategoriesResponse> {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? 10));
  if (params.archived) {
    search.set('archived', params.archived);
  }

  return request<CategoriesResponse>(`/api/categories?${search.toString()}`);
}

export async function loginAdmin(password: string): Promise<string> {
  const data = await request<LoginData>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return data.token;
}

export async function logoutAdmin(): Promise<void> {
  await request<null>('/api/logout', { method: 'POST' });
}

export async function createEntry(input: EntryInput): Promise<Entry> {
  return request<Entry>('/api/entries', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function updateEntry(id: number, input: EntryInput): Promise<Entry> {
  return request<Entry>(`/api/entries?id=${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export async function deleteEntry(id: number): Promise<void> {
  await request<null>(`/api/entries?id=${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

/** Bulk permanent delete — `DELETE /api/entries` with `{ ids }`. */
export async function deleteEntries(ids: number[]): Promise<BulkActionResult> {
  const normalized = normalizeIds(ids);
  if (normalized.length === 0) {
    return { affected: 0, ids: [] };
  }
  if (normalized.length === 1) {
    await deleteEntry(normalized[0]);
    return { affected: 1, ids: normalized };
  }
  return request<BulkActionResult>('/api/entries', {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ ids: normalized }),
  });
}

export async function archiveEntry(id: number): Promise<Entry> {
  return request<Entry>(`/api/entries/archive?id=${id}`, {
    method: 'POST',
    headers: authHeaders(),
  });
}

/** Bulk archive — `POST /api/entries/archive` with `{ ids }`. */
export async function archiveEntries(ids: number[]): Promise<BulkActionResult | Entry> {
  const normalized = normalizeIds(ids);
  if (normalized.length === 0) {
    return { affected: 0, ids: [] };
  }
  if (normalized.length === 1) {
    return archiveEntry(normalized[0]);
  }
  return request<BulkActionResult>('/api/entries/archive', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ids: normalized }),
  });
}

export async function unarchiveEntry(id: number): Promise<Entry> {
  return request<Entry>(`/api/entries/unarchive?id=${id}`, {
    method: 'POST',
    headers: authHeaders(),
  });
}

/** Bulk unarchive — `POST /api/entries/unarchive` with `{ ids }`. */
export async function unarchiveEntries(ids: number[]): Promise<BulkActionResult | Entry> {
  const normalized = normalizeIds(ids);
  if (normalized.length === 0) {
    return { affected: 0, ids: [] };
  }
  if (normalized.length === 1) {
    return unarchiveEntry(normalized[0]);
  }
  return request<BulkActionResult>('/api/entries/unarchive', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ids: normalized }),
  });
}
