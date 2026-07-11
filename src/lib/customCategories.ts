const CUSTOM_CATS_KEY = 'mindex_custom_categories';

export function getCustomCategories(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c): c is string => typeof c === 'string' && c.trim().length > 0);
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories: string[]): void {
  localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify([...new Set(categories)]));
}
