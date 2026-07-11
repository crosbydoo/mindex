import type {
  ApiEnvelope,
  CategoriesResponse,
  Entry,
  EntryInput,
  FetchEntriesParams,
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

  return body.data;
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return { Authorization: `Bearer ${token}` };
}

export async function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>('/health');
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

  return request<PaginatedEntries>(`/api/entries?${search.toString()}`);
}

export async function fetchCategories(params: {
  page?: number;
  limit?: number;
} = {}): Promise<CategoriesResponse> {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? 10));

  return request<CategoriesResponse>(`/api/categories?${search.toString()}`);
}

export async function loginAdmin(password: string): Promise<string> {
  const data = await request<{ token: string }>('/api/login', {
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
