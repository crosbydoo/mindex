import seedEntries from '../../data/seed-entries.json';
import {
  createEntry as apiCreateEntry,
  deleteEntry as apiDeleteEntry,
  fetchEntries,
  updateEntry as apiUpdateEntry,
} from '@/lib/api';
import type { Entry, EntryInput } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

const FALLBACK_ENTRIES: Entry[] = seedEntries.map((entry, index) => ({
  ...entry,
  category: entry.category as Entry['category'],
  type: entry.type as Entry['type'],
  id: index + 1,
}));

/** Max page size allowed by the API. */
const LIST_LIMIT = 100;

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const all: Entry[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const result = await fetchEntries({ page, limit: LIST_LIMIT });
        all.push(...result.items);
        totalPages = result.pagination.total_pages || 1;
        page += 1;
      } while (page <= totalPages);

      setEntries(all);
      setUsingLocalFallback(false);
    } catch (err) {
      setEntries(FALLBACK_ENTRIES);
      setUsingLocalFallback(true);
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Keep lists in sync across tabs after admin mutations
  useEffect(() => {
    const onFocus = () => {
      void refresh();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'mindex_entries_revision') {
        void refresh();
      }
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const bumpRevision = () => {
    localStorage.setItem('mindex_entries_revision', String(Date.now()));
  };

  const addEntry = useCallback(async (input: EntryInput) => {
    const entry = await apiCreateEntry(input);
    await refresh();
    bumpRevision();
    return entry;
  }, [refresh]);

  const updateEntry = useCallback(async (updated: Entry) => {
    const { id, ...input } = updated;
    const entry = await apiUpdateEntry(id, input);
    await refresh();
    bumpRevision();
    return entry;
  }, [refresh]);

  const removeEntry = useCallback(async (id: number) => {
    await apiDeleteEntry(id);
    await refresh();
    bumpRevision();
  }, [refresh]);

  return {
    entries,
    loading,
    error,
    usingLocalFallback,
    refresh,
    addEntry,
    updateEntry,
    deleteEntry: removeEntry,
  };
}
