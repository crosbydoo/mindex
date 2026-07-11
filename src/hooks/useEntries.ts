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

  const addEntry = useCallback(async (input: EntryInput) => {
    const entry = await apiCreateEntry(input);
    setEntries((prev) => [entry, ...prev]);
    setUsingLocalFallback(false);
    return entry;
  }, []);

  const updateEntry = useCallback(async (updated: Entry) => {
    const { id, ...input } = updated;
    const entry = await apiUpdateEntry(id, input);
    setEntries((prev) => prev.map((item) => (item.id === id ? entry : item)));
    setUsingLocalFallback(false);
    return entry;
  }, []);

  const removeEntry = useCallback(async (id: number) => {
    await apiDeleteEntry(id);
    setEntries((prev) => prev.filter((item) => item.id !== id));
    setUsingLocalFallback(false);
  }, []);

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
