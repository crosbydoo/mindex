import { useCategories } from '@/hooks/useCategories';
import { useEntries } from '@/hooks/useEntries';
import { AdminPage } from '@/app/admin/AdminPage';

export default function AdminApp() {
  const {
    entries,
    loading: entriesLoading,
    usingLocalFallback: entriesFallback,
    addEntry,
    updateEntry,
    deleteEntry,
    deleteEntries,
    archiveEntry,
    archiveEntries,
    unarchiveEntry,
    unarchiveEntries,
    refresh: refreshEntries,
  } = useEntries();

  const {
    categories,
    loading: categoriesLoading,
    usingLocalFallback: categoriesFallback,
    addCategory,
    renameCategory,
    removeCategory,
  } = useCategories();

  const handleRenameCategory = async (id: number, name: string) => {
    const item = await renameCategory(id, name);
    // Rename also updates entry.category strings on the server.
    await refreshEntries();
    return item;
  };

  const handleDeleteCategory = async (id: number) => {
    await removeCategory(id);
    await refreshEntries();
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <AdminPage
        entries={entries}
        categories={categories}
        loading={entriesLoading || categoriesLoading}
        usingLocalFallback={entriesFallback || categoriesFallback}
        onAdd={addEntry}
        onUpdate={updateEntry}
        onDelete={deleteEntry}
        onDeleteMany={deleteEntries}
        onArchive={archiveEntry}
        onArchiveMany={archiveEntries}
        onUnarchive={unarchiveEntry}
        onUnarchiveMany={unarchiveEntries}
        onAddCategory={addCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onRefresh={refreshEntries}
      />
    </div>
  );
}
