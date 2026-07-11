const ARCHIVE_KEY = 'mindex_archived_ids';

function readIds(): number[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => Number.isInteger(id) && id > 0);
  } catch {
    return [];
  }
}

function writeIds(ids: number[]): void {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify([...new Set(ids)]));
}

export function getArchivedIds(): number[] {
  return readIds();
}

export function isArchived(id: number): boolean {
  return readIds().includes(id);
}

export function archiveEntries(ids: number[]): void {
  writeIds([...readIds(), ...ids]);
}

export function restoreEntries(ids: number[]): void {
  const remove = new Set(ids);
  writeIds(readIds().filter((id) => !remove.has(id)));
}

export function removeArchivedIds(ids: number[]): void {
  restoreEntries(ids);
}
