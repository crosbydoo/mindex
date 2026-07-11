import seedEntries from '../../data/seed-entries.json';
import {
  archiveEntries as apiArchiveEntries,
  archiveEntry as apiArchiveEntry,
  createEntry as apiCreateEntry,
  deleteEntries as apiDeleteEntries,
  deleteEntry as apiDeleteEntry,
  fetchEntries,
  unarchiveEntries as apiUnarchiveEntries,
  unarchiveEntry as apiUnarchiveEntry,
  updateEntry as apiUpdateEntry,
} from '@/lib/api';
import type { BulkActionResult, Entry, EntryInput } from '@/lib/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FALLBACK_ENTRIES: Entry[] = seedEntries.map((entry, index) => ({
  ...entry,
  category: entry.category as Entry['category'],
  type: entry.type as Entry['type'],
  id: index + 1,
  is_archived: false,
}));

/** Max page size allowed by the API. */
const LIST_LIMIT = 100;

async function fetchAll(archived: 'all' | 'false' | 'true' = 'all'): Promise<Entry[]> {
  const all: Entry[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await fetchEntries({ page, limit: LIST_LIMIT, archived });
    all.push(
      ...result.items.map((item) => ({
        ...item,
        is_archived: Boolean(item.is_archived),
      })),
    );
    const pagination = result.pagination;
    totalPages = pagination.total_pages || 1;
    if (pagination.has_next === false) break;
    page += 1;
  } while (page <= totalPages);

  return all;
}

function toEntryInput(entry: Entry | EntryInput): EntryInput {
  return {
    title: entry.title,
    abstract: entry.abstract,
    category: entry.category,
    year: entry.year,
    author: entry.author,
    source: entry.source,
    type: entry.type,
    url: entry.url || '#',
  };
}

function bulkAffected(result: BulkActionResult | Entry, fallbackIds: number[]): number {
  if (result && typeof result === 'object' && 'affected' in result) {
    return result.affected;
  }
  return fallbackIds.length > 0 ? 1 : 0;
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    // Only show full-page loading on the first fetch. Later refreshes
    // (after mutate) must stay silent so admin section state is preserved.
    if (!hasLoadedRef.current) {
      setLoading(true);
    }
    setError(null);

    try {
      const all = await fetchAll('all');
      setEntries(all);
      setUsingLocalFallback(false);
    } catch (err) {
      setEntries(FALLBACK_ENTRIES);
      setUsingLocalFallback(true);
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      hasLoadedRef.current = true;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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

  const activeEntries = useMemo(
    () => entries.filter((e) => !e.is_archived),
    [entries],
  );

  const archivedEntries = useMemo(
    () => entries.filter((e) => e.is_archived),
    [entries],
  );

  const addEntry = useCallback(
    async (input: EntryInput) => {
      const entry = await apiCreateEntry(toEntryInput(input));
      await refresh();
      bumpRevision();
      return entry;
    },
    [refresh],
  );

  const updateEntry = useCallback(
    async (updated: Entry) => {
      const entry = await apiUpdateEntry(updated.id, toEntryInput(updated));
      await refresh();
      bumpRevision();
      return entry;
    },
    [refresh],
  );

  const removeEntry = useCallback(
    async (id: number) => {
      await apiDeleteEntry(id);
      await refresh();
      bumpRevision();
    },
    [refresh],
  );

  const removeEntries = useCallback(
    async (ids: number[]) => {
      const result = await apiDeleteEntries(ids);
      await refresh();
      bumpRevision();
      return result;
    },
    [refresh],
  );

  const archiveEntry = useCallback(
    async (id: number) => {
      const entry = await apiArchiveEntry(id);
      await refresh();
      bumpRevision();
      return entry;
    },
    [refresh],
  );

  const archiveEntries = useCallback(
    async (ids: number[]) => {
      const result = await apiArchiveEntries(ids);
      await refresh();
      bumpRevision();
      return bulkAffected(result, ids);
    },
    [refresh],
  );

  const unarchiveEntry = useCallback(
    async (id: number) => {
      const entry = await apiUnarchiveEntry(id);
      await refresh();
      bumpRevision();
      return entry;
    },
    [refresh],
  );

  const unarchiveEntries = useCallback(
    async (ids: number[]) => {
      const result = await apiUnarchiveEntries(ids);
      await refresh();
      bumpRevision();
      return bulkAffected(result, ids);
    },
    [refresh],
  );

  return {
    entries,
    activeEntries,
    archivedEntries,
    loading,
    error,
    usingLocalFallback,
    refresh,
    addEntry,
    updateEntry,
    deleteEntry: removeEntry,
    deleteEntries: removeEntries,
    archiveEntry,
    archiveEntries,
    unarchiveEntry,
    unarchiveEntries,
  };
}
