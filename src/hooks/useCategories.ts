import {
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
  fetchCategoryList,
  updateCategory as apiUpdateCategory,
} from '@/lib/api';
import type { CategoryItem } from '@/lib/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Clinical Psychology', entry_count: 0 },
  { id: 2, name: 'Cognitive Psychology', entry_count: 0 },
  { id: 3, name: 'Developmental Psychology', entry_count: 0 },
  { id: 4, name: 'Educational Psychology', entry_count: 0 },
  { id: 5, name: 'Mental Health', entry_count: 0 },
  { id: 6, name: 'Research Methods', entry_count: 0 },
  { id: 7, name: 'Social Psychology', entry_count: 0 },
];

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setLoading(true);
    }
    setError(null);

    try {
      const items = await fetchCategoryList();
      setCategories(items);
      setUsingLocalFallback(false);
    } catch (err) {
      setCategories(FALLBACK_CATEGORIES);
      setUsingLocalFallback(true);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      hasLoadedRef.current = true;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const names = useMemo(
    () => categories.map((c) => c.name),
    [categories],
  );

  const addCategory = useCallback(
    async (name: string) => {
      const item = await apiCreateCategory({ name });
      await refresh();
      return item;
    },
    [refresh],
  );

  const renameCategory = useCallback(
    async (id: number, name: string) => {
      const item = await apiUpdateCategory(id, { name });
      await refresh();
      return item;
    },
    [refresh],
  );

  const removeCategory = useCallback(
    async (id: number) => {
      await apiDeleteCategory(id);
      await refresh();
    },
    [refresh],
  );

  return {
    categories,
    names,
    loading,
    error,
    usingLocalFallback,
    refresh,
    addCategory,
    renameCategory,
    removeCategory,
  };
}
