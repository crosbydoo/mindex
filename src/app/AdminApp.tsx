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
    archiveEntry,
    unarchiveEntry,
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
        onArchive={archiveEntry}
        onUnarchive={unarchiveEntry}
        onRefresh={refresh}
      />
    </div>
  );
}
