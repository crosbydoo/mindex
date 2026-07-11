import {
  AlertTriangle,
  Archive,
  BookMarked,
  Check,
  ChevronDown,
  FileText,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_META,
  TYPES,
} from '@/app/catalog';
import { loginAdmin, logoutAdmin } from '@/lib/api';
import {
  clearAdminToken,
  isAdminAuthenticated,
  setAdminToken,
} from '@/lib/auth';
import {
  getCustomCategories,
  saveCustomCategories,
} from '@/lib/customCategories';
import type { Category, Entry, EntryInput, EntryType } from '@/lib/types';

type AdminSection = 'overview' | 'journals' | 'archive' | 'categories';

function PsiIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3v18M6 3C6 9.627 8.686 14 12 14c3.314 0 6-4.373 6-11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const EMPTY_FORM: EntryInput = {
  title: '',
  abstract: '',
  category: 'Clinical Psychology',
  year: 2023,
  author: '',
  source: '',
  type: 'Journal',
  url: '',
};

function EntryFormModal({
  initial,
  allCategories,
  onSave,
  onClose,
}: {
  initial?: Entry;
  allCategories: string[];
  onSave: (data: EntryInput) => void | Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<EntryInput>(
    initial
      ? {
          title: initial.title,
          abstract: initial.abstract,
          category: initial.category,
          year: initial.year,
          author: initial.author,
          source: initial.source,
          type: initial.type,
          url: initial.url,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof EntryInput, string>>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof EntryInput>(key: K, val: EntryInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Partial<Record<keyof EntryInput, string>> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.author.trim()) e.author = 'Author is required';
    if (!form.source.trim()) e.source = 'Source is required';
    if (!form.abstract.trim()) e.abstract = 'Abstract is required';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>
            {initial ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 flex flex-col gap-4">
          {(
            [
              ['Title', 'title'],
              ['Author(s)', 'author'],
              ['Source / Journal Name', 'source'],
            ] as const
          ).map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
              <input
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${errors[key] ? 'border-destructive' : 'border-border'}`}
              />
              {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Abstract</label>
            <textarea
              value={form.abstract}
              onChange={(e) => set('abstract', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 text-sm bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${errors.abstract ? 'border-destructive' : 'border-border'}`}
            />
            {errors.abstract && <p className="text-xs text-destructive mt-1">{errors.abstract}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as EntryType)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Year</label>
              <input
                type="number"
                value={form.year}
                min={1900}
                max={2099}
                onChange={(e) => set('year', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">URL (optional)</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/85 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check size={14} /> {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  entry,
  onConfirm,
  onClose,
}: {
  entry: Entry;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="w-11 h-11 bg-[#fde8e8] rounded-full flex items-center justify-center">
          <AlertTriangle size={20} className="text-destructive" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
            Delete entry?
          </h3>
          <p className="text-sm text-muted-foreground">
            "
            <span className="font-medium text-foreground">
              {entry.title.length > 60 ? `${entry.title.slice(0, 60)}…` : entry.title}
            </span>
            " will be permanently removed.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/85 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const attempt = async () => {
    setSubmitting(true);
    try {
      const token = await loginAdmin(pw);
      setAdminToken(token);
      onSuccess();
    } catch {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-12 flex items-start justify-center min-h-[60vh]">
      <div className={`w-full max-w-sm mt-10 transition-transform ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
          <Lock size={20} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-medium text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
          Admin access
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter the admin password to manage the literature database.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void attempt()}
                placeholder="Enter admin password"
                className={`w-full px-3 py-2.5 pr-10 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${error ? 'border-destructive focus:ring-destructive/20' : 'border-border'}`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                <AlertTriangle size={11} /> Incorrect password. Please try again.
              </p>
            )}
          </div>
          <button
            onClick={() => void attempt()}
            disabled={submitting}
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </main>
  );
}

function AdminOverview({
  entries,
  archived,
  customCategories,
}: {
  entries: Entry[];
  archived: Entry[];
  customCategories: string[];
}) {
  const byType = TYPES.reduce(
    (acc, t) => ({ ...acc, [t]: entries.filter((e) => e.type === t).length }),
    {} as Record<EntryType, number>,
  );
  const byCat = [...CATEGORIES, ...customCategories]
    .map((c) => ({ cat: c, count: entries.filter((e) => e.category === c).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Lora', serif" }}>
          Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Entries', value: entries.length, icon: <BookMarked size={16} />, color: 'text-primary' },
            { label: 'Archived', value: archived.length, icon: <Archive size={16} />, color: 'text-muted-foreground' },
            {
              label: 'Categories',
              value: CATEGORIES.length + customCategories.length,
              icon: <Layers size={16} />,
              color: 'text-accent',
            },
            {
              label: 'Latest Year',
              value: entries.length ? Math.max(...entries.map((e) => e.year)) : '—',
              icon: <FileText size={16} />,
              color: 'text-muted-foreground',
            },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-lg px-5 py-4">
              <div className={`mb-2 ${color}`}>{icon}</div>
              <p className="text-2xl font-semibold text-foreground font-mono">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">By Publication Type</h3>
          <div className="flex flex-col gap-2.5">
            {TYPES.map((t) => {
              const count = byType[t] ?? 0;
              const pct = entries.length ? Math.round((count / entries.length) * 100) : 0;
              return (
                <div key={t}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t}</span>
                    <span className="font-mono text-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Categories</h3>
          <div className="flex flex-col gap-2">
            {byCat.slice(0, 7).map(({ cat, count }) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">{cat}</span>
                <span className="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminJournals({
  entries,
  allCategories,
  onAdd,
  onUpdate,
  onArchive,
  onArchiveMany,
  onDelete,
  onDeleteMany,
  showToast,
}: {
  entries: Entry[];
  allCategories: string[];
  onAdd: (e: EntryInput) => Promise<void>;
  onUpdate: (e: Entry) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
  onArchiveMany: (ids: number[]) => Promise<number>;
  onDelete: (id: number) => Promise<void>;
  onDeleteMany: (ids: number[]) => Promise<{ affected: number; ids: number[] }>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState<'add' | Entry | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Entry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        (!q ||
          e.title.toLowerCase().includes(q) ||
          e.author.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q)) &&
        (!filterCat || e.category === filterCat),
    );
  }, [entries, search, filterCat]);

  const filteredIds = filtered.map((e) => e.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someSelected = filteredIds.some((id) => selectedIds.has(id)) && !allSelected;

  useEffect(() => {
    setSelectedIds(new Set());
  }, [search, filterCat]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleBulkArchive = async () => {
    const ids = [...selectedIds];
    setBulkBusy(true);
    try {
      const ok = await onArchiveMany(ids);
      setSelectedIds(new Set());
      showToast(`${ok} entr${ok === 1 ? 'y' : 'ies'} archived`, ok ? 'success' : 'error');
    } catch {
      showToast('Failed to archive selected entries', 'error');
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    setBulkBusy(true);
    try {
      const result = await onDeleteMany(ids);
      setSelectedIds(new Set());
      const ok = result.affected;
      showToast(`${ok} entr${ok === 1 ? 'y' : 'ies'} deleted`, ok ? 'success' : 'error');
    } catch {
      showToast('Failed to delete selected entries', 'error');
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>
          All Literature
        </h2>
        <button
          onClick={() => setShowModal('add')}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 transition-colors"
        >
          <Plus size={15} /> Add Entry
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or source…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer"
        >
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="self-center text-xs text-muted-foreground font-mono whitespace-nowrap shrink-0">
          {filtered.length} entries
        </span>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <span className="text-sm font-medium mr-1">{selectedIds.size} selected</span>
          <button
            type="button"
            disabled={bulkBusy}
            onClick={() => void handleBulkArchive()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-50"
          >
            <Archive size={14} /> {bulkBusy ? 'Working…' : 'Archive'}
          </button>
          <button
            type="button"
            disabled={bulkBusy}
            onClick={() => void handleBulkDelete()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-destructive/30 text-destructive rounded-lg bg-card hover:bg-[#fde8e8] disabled:opacity-50"
          >
            <Trash2 size={14} /> {bulkBusy ? 'Deleting…' : 'Delete'}
          </button>
          <button type="button" onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-muted-foreground">
            Clear
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleSelectAll}
                    disabled={filtered.length === 0}
                    className="size-4 accent-primary cursor-pointer"
                  />
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Title / Author
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Year
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No entries match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-muted/30 transition-colors align-top ${selectedIds.has(entry.id) ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(entry.id)}
                        onChange={() => toggleSelect(entry.id)}
                        className="size-4 accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        className="text-left group flex items-start gap-2 w-full"
                      >
                        <ChevronDown
                          size={14}
                          className={`mt-0.5 text-muted-foreground shrink-0 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`}
                        />
                        <div>
                          <p className="font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {entry.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.author}</p>
                          {expandedId === entry.id && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground leading-relaxed">{entry.abstract}</p>
                              <p className="text-xs text-muted-foreground italic mt-1" style={{ fontFamily: "'Lora', serif" }}>
                                {entry.source}
                              </p>
                            </div>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${CATEGORY_COLORS[entry.category] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {entry.category.split(' ')[0]}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground font-mono">{entry.type}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground font-mono">{entry.year}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setShowModal(entry)}
                          title="Edit"
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setArchiveTarget(entry)}
                          title="Archive"
                          className="p-1.5 text-muted-foreground hover:text-[#b45309] hover:bg-[#fef3c7] rounded transition-colors"
                        >
                          <Archive size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(entry)}
                          title="Delete"
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-[#fde8e8] rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal === 'add' && (
        <EntryFormModal
          allCategories={allCategories}
          onSave={async (data) => {
            await onAdd(data);
            setShowModal(null);
            showToast('Entry added successfully');
          }}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal && showModal !== 'add' && (
        <EntryFormModal
          initial={showModal}
          allCategories={allCategories}
          onSave={async (data) => {
            await onUpdate({ ...showModal, ...data });
            setShowModal(null);
            showToast('Entry updated');
          }}
          onClose={() => setShowModal(null)}
        />
      )}
      {archiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setArchiveTarget(null)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="w-11 h-11 bg-[#fef3c7] rounded-full flex items-center justify-center">
              <Archive size={20} className="text-[#b45309]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
                Archive this entry?
              </h3>
              <p className="text-sm text-muted-foreground">
                It will be archived on the server and hidden from the default public list.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setArchiveTarget(null)}
                className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  void onArchive(archiveTarget.id)
                    .then(() => {
                      setArchiveTarget(null);
                      showToast('Entry archived');
                    })
                    .catch(() => showToast('Failed to archive entry', 'error'));
                }}
                className="px-4 py-2 text-sm bg-[#b45309] text-white rounded-lg hover:bg-[#92400e] transition-colors flex items-center gap-1.5"
              >
                <Archive size={13} /> Archive
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          entry={deleteTarget}
          onConfirm={() => {
            void onDelete(deleteTarget.id)
              .then(() => {
                setDeleteTarget(null);
                showToast('Entry deleted', 'error');
              })
              .catch(() => showToast('Failed to delete entry', 'error'));
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function AdminArchive({
  archived,
  onRestore,
  onRestoreMany,
  onDeleteArchived,
  onDeleteMany,
  showToast,
}: {
  archived: Entry[];
  onRestore: (id: number) => Promise<void>;
  onRestoreMany: (ids: number[]) => Promise<number>;
  onDeleteArchived: (id: number) => Promise<void>;
  onDeleteMany: (ids: number[]) => Promise<{ affected: number; ids: number[] }>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const allSelected = archived.length > 0 && archived.every((e) => selectedIds.has(e.id));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>
            Archive
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Archived entries are hidden from the public list. Restore to make them active again.
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {archived.length} archived
        </span>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <span className="text-sm font-medium mr-1">{selectedIds.size} selected</span>
          <button
            type="button"
            onClick={() => {
              void (async () => {
                const ids = [...selectedIds];
                try {
                  const ok = await onRestoreMany(ids);
                  setSelectedIds(new Set());
                  showToast(`${ok} entr${ok === 1 ? 'y' : 'ies'} restored`, ok ? 'success' : 'error');
                } catch {
                  showToast('Failed to restore selected entries', 'error');
                }
              })();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg bg-card hover:bg-muted"
          >
            <RotateCcw size={14} /> Restore
          </button>
          <button
            type="button"
            onClick={() => {
              void (async () => {
                const ids = [...selectedIds];
                try {
                  const result = await onDeleteMany(ids);
                  setSelectedIds(new Set());
                  const ok = result.affected;
                  showToast(`${ok} entr${ok === 1 ? 'y' : 'ies'} deleted`, ok ? 'success' : 'error');
                } catch {
                  showToast('Failed to delete selected entries', 'error');
                }
              })();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-destructive/30 text-destructive rounded-lg bg-card hover:bg-[#fde8e8]"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button type="button" onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-muted-foreground">
            Clear
          </button>
        </div>
      )}

      {archived.length === 0 ? (
        <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Archive size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Archive is empty</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Entries you archive from All Literature will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => {
                        if (allSelected) setSelectedIds(new Set());
                        else setSelectedIds(new Set(archived.map((e) => e.id)));
                      }}
                      className="size-4 accent-primary cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Title / Author
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Year
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {archived.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/20 transition-colors opacity-80">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(entry.id)}
                        onChange={() => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(entry.id)) next.delete(entry.id);
                            else next.add(entry.id);
                            return next;
                          });
                        }}
                        className="size-4 accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-medium text-foreground line-clamp-1">{entry.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{entry.author}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${CATEGORY_COLORS[entry.category] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {entry.category.split(' ')[0]}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground font-mono">{entry.year}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            void onRestore(entry.id)
                              .then(() => showToast('Entry restored'))
                              .catch(() => showToast('Failed to restore entry', 'error'));
                          }}
                          title="Restore"
                          className="p-1.5 text-muted-foreground hover:text-accent hover:bg-[#ddf0e5] rounded transition-colors"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(entry)}
                          title="Delete permanently"
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-[#fde8e8] rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          entry={deleteTarget}
          onConfirm={() => {
            void onDeleteArchived(deleteTarget.id)
              .then(() => {
                setDeleteTarget(null);
                showToast('Entry permanently deleted', 'error');
              })
              .catch(() => showToast('Failed to delete entry', 'error'));
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function AdminCategories({
  allCategories,
  customCategories,
  entries,
  onAddCategory,
  onDeleteCategory,
  showToast,
}: {
  allCategories: string[];
  customCategories: string[];
  entries: Entry[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [newCat, setNewCat] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }
    if (allCategories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError('This category already exists.');
      return;
    }
    onAddCategory(trimmed);
    setNewCat('');
    setError('');
    showToast(`Category "${trimmed}" added`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-0.5" style={{ fontFamily: "'Lora', serif" }}>
          Manage Categories
        </h2>
        <p className="text-sm text-muted-foreground">
          Add custom categories or remove unused ones. Built-in categories cannot be deleted.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Add New Category</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newCat}
              onChange={(e) => {
                setNewCat(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Neuropsychology"
              className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${error ? 'border-destructive' : 'border-border'}`}
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 transition-colors shrink-0"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Built-in Categories</h3>
          <span className="text-xs font-mono text-muted-foreground">{CATEGORIES.length}</span>
        </div>
        <div className="divide-y divide-border">
          {CATEGORIES.map((cat) => {
            const count = entries.filter((e) => e.category === cat).length;
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${meta.bg} ${meta.color} shrink-0`}>
                    <span className="scale-75">{meta.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{cat}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {count} entries
                  </span>
                  <span className="text-xs text-muted-foreground italic">Built-in</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom Categories</h3>
          <span className="text-xs font-mono text-muted-foreground">{customCategories.length}</span>
        </div>
        {customCategories.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No custom categories yet. Add one above.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {customCategories.map((cat) => {
              const count = entries.filter((e) => e.category === cat).length;
              return (
                <div key={cat} className="flex items-center justify-between px-5 py-3.5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-muted flex items-center justify-center shrink-0">
                      <Layers size={13} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{cat}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {count} entries
                    </span>
                    <button
                      onClick={() => {
                        onDeleteCategory(cat);
                        showToast(`Category "${cat}" removed`, 'error');
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-[#fde8e8] rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({
  entries,
  usingLocalFallback,
  onAdd,
  onUpdate,
  onDelete,
  onDeleteMany,
  onArchive,
  onArchiveMany,
  onUnarchive,
  onUnarchiveMany,
  onLogout,
}: {
  entries: Entry[];
  usingLocalFallback: boolean;
  onAdd: (e: EntryInput) => Promise<Entry | void>;
  onUpdate: (e: Entry) => Promise<Entry | void>;
  onDelete: (id: number) => Promise<void>;
  onDeleteMany: (ids: number[]) => Promise<{ affected: number; ids: number[] }>;
  onArchive: (id: number) => Promise<Entry | void>;
  onArchiveMany: (ids: number[]) => Promise<number>;
  onUnarchive: (id: number) => Promise<Entry | void>;
  onUnarchiveMany: (ids: number[]) => Promise<number>;
  onLogout: () => void;
}) {
  const [section, setSection] = useState<AdminSection>('overview');
  const [customCategories, setCustomCategories] = useState<string[]>(() => getCustomCategories());
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const activeEntries = useMemo(
    () => entries.filter((e) => !e.is_archived),
    [entries],
  );
  const archivedEntries = useMemo(
    () => entries.filter((e) => e.is_archived),
    [entries],
  );
  const allCategories = [...CATEGORIES, ...customCategories];

  const handleArchive = async (id: number) => {
    await onArchive(id);
  };

  const handleRestore = async (id: number) => {
    await onUnarchive(id);
  };

  const handleDeleteArchived = async (id: number) => {
    await onDelete(id);
  };

  const handleLogout = () => {
    void logoutAdmin()
      .catch(() => undefined)
      .finally(() => {
        clearAdminToken();
        onLogout();
      });
  };

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { id: 'journals', label: 'All Literature', icon: <BookMarked size={15} />, badge: activeEntries.length },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive size={15} />,
      badge: archivedEntries.length > 0 ? archivedEntries.length : undefined,
    },
    { id: 'categories', label: 'Categories', icon: <Layers size={15} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-56 bg-card border-r border-border flex flex-col shrink-0 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <PsiIcon size={12} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-none">Admin Dashboard</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Mindex</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map(({ id, label, icon, badge }) => (
            <button
              key={id}
              onClick={() => {
                setSection(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                section === id
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {icon}
                {label}
              </span>
              {badge !== undefined && (
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${
                    section === id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="border-b border-border bg-background px-5 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect y="2.5" width="16" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="7.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="12" width="16" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
          <span className="text-sm font-medium text-foreground">
            {navItems.find((n) => n.id === section)?.label}
          </span>
        </div>

        <div className="p-5 md:p-8">
          {usingLocalFallback && (
            <p className="mb-5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              API is offline — showing local fallback data. Mutations may fail until the API is reachable.
            </p>
          )}
          {section === 'overview' && (
            <AdminOverview
              entries={activeEntries}
              archived={archivedEntries}
              customCategories={customCategories}
            />
          )}
          {section === 'journals' && (
            <AdminJournals
              entries={activeEntries}
              allCategories={allCategories}
              onAdd={async (data) => {
                await onAdd(data);
              }}
              onUpdate={async (entry) => {
                await onUpdate(entry);
              }}
              onArchive={async (id) => {
                await handleArchive(id);
              }}
              onArchiveMany={onArchiveMany}
              onDelete={onDelete}
              onDeleteMany={onDeleteMany}
              showToast={showToast}
            />
          )}
          {section === 'archive' && (
            <AdminArchive
              archived={archivedEntries}
              onRestore={async (id) => {
                await handleRestore(id);
              }}
              onRestoreMany={onUnarchiveMany}
              onDeleteArchived={handleDeleteArchived}
              onDeleteMany={onDeleteMany}
              showToast={showToast}
            />
          )}
          {section === 'categories' && (
            <AdminCategories
              allCategories={allCategories}
              customCategories={customCategories}
              entries={activeEntries}
              onAddCategory={(name) => {
                const next = [...customCategories, name];
                setCustomCategories(next);
                saveCustomCategories(next);
              }}
              onDeleteCategory={(name) => {
                const next = customCategories.filter((c) => c !== name);
                setCustomCategories(next);
                saveCustomCategories(next);
              }}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border ${
            toast.type === 'success'
              ? 'bg-card border-[#5a7a63]/40 text-foreground'
              : 'bg-[#fde8e8] border-destructive/20 text-destructive'
          }`}
        >
          {toast.type === 'success' ? <Check size={14} className="text-accent" /> : <Trash2 size={14} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export function AdminPage({
  entries,
  loading,
  usingLocalFallback,
  onAdd,
  onUpdate,
  onDelete,
  onDeleteMany,
  onArchive,
  onArchiveMany,
  onUnarchive,
  onUnarchiveMany,
}: {
  entries: Entry[];
  loading: boolean;
  usingLocalFallback: boolean;
  onAdd: (e: EntryInput) => Promise<Entry | void>;
  onUpdate: (e: Entry) => Promise<Entry | void>;
  onDelete: (id: number) => Promise<void>;
  onDeleteMany: (ids: number[]) => Promise<{ affected: number; ids: number[] }>;
  onArchive: (id: number) => Promise<Entry | void>;
  onArchiveMany: (ids: number[]) => Promise<number>;
  onUnarchive: (id: number) => Promise<Entry | void>;
  onUnarchiveMany: (ids: number[]) => Promise<number>;
  onRefresh?: () => Promise<void>;
}) {
  const [authed, setAuthed] = useState(() => isAdminAuthenticated());

  // Only block on the first load. Remounting AdminDashboard on every refresh
  // resets section back to Overview.
  if (loading && entries.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <p className="text-sm text-muted-foreground">Loading database…</p>
      </main>
    );
  }

  return authed ? (
    <AdminDashboard
      entries={entries}
      usingLocalFallback={usingLocalFallback}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onDeleteMany={onDeleteMany}
      onArchive={onArchive}
      onArchiveMany={onArchiveMany}
      onUnarchive={onUnarchive}
      onUnarchiveMany={onUnarchiveMany}
      onLogout={() => setAuthed(false)}
    />
  ) : (
    <AdminLogin onSuccess={() => setAuthed(true)} />
  );
}
