import { useEntries } from '@/hooks/useEntries';
import { AdminPage } from '@/app/admin/AdminPage';

export default function AdminApp() {
  const {
    entries,
    loading,
    usingLocalFallback,
    addEntry,
    updateEntry,
    deleteEntry,
    deleteEntries,
    archiveEntry,
    archiveEntries,
    unarchiveEntry,
    unarchiveEntries,
    refresh,
  } = useEntries();

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <AdminPage
        entries={entries}
        loading={loading}
        usingLocalFallback={usingLocalFallback}
        onAdd={addEntry}
        onUpdate={updateEntry}
        onDelete={deleteEntry}
        onDeleteMany={deleteEntries}
        onArchive={archiveEntry}
        onArchiveMany={archiveEntries}
        onUnarchive={unarchiveEntry}
        onUnarchiveMany={unarchiveEntries}
        onRefresh={refresh}
      />
    </div>
  );
}
