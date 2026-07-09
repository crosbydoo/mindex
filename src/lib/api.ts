import type { Entry, EntryInput } from './types';
import { getAdminToken } from './auth';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = typeof body.error === 'string' ? body.error : response.statusText;
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return { Authorization: `Bearer ${token}` };
}

export async function fetchEntries(): Promise<Entry[]> {
  return request<Entry[]>('/api/entries');
}

export async function loginAdmin(password: string): Promise<string> {
  const { token } = await request<{ token: string }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return token;
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
  await request<void>(`/api/entries?id=${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}
