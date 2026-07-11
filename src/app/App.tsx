import {
  ArrowRight,
  BookMarked,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ExternalLink,
  FileText,
  GitPullRequest,
  Layers,
  Mail,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  TYPES,
  YEARS,
  categoryColor,
  categoryMeta,
} from "@/app/catalog";
import { useCategories } from "@/hooks/useCategories";
import { useEntries } from "@/hooks/useEntries";
import type { Category, Entry, EntryType } from "@/lib/types";

function PsiIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M12 3v18M6 3C6 9.627 8.686 14 12 14c3.314 0 6-4.373 6-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}


// ─── Types & Data ─────────────────────────────────────────────────────────────

type Page = "home" | "categories" | "about";

const PER_PAGE = 6;

// ─── Shared Header ────────────────────────────────────────────────────────────

function Header({ activePage, onNav }: { activePage: Page; onNav: (p: Page) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between gap-6">
        <button
          onClick={() => onNav("home")}
          className="flex items-center gap-2.5 group text-left"
        >
           <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
            <PsiIcon size={14} className="text-primary-foreground" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span
              className="font-semibold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Mindex
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Psychology Research Index
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {(["home", "categories", "about"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => onNav(p)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                activePage === p
                  ? "text-foreground bg-muted font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {p === "home" ? "Home" : p === "categories" ? "Categories" : "About"}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={18} /> : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect y="3" width="18" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="8.25" width="18" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="13.5" width="18" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-card px-5 py-3 flex flex-col gap-1">
          {(["home", "categories", "about"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => { onNav(p); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-md text-sm capitalize transition-colors ${
                activePage === p
                  ? "text-foreground bg-muted font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "home" ? "Home" : p === "categories" ? "Categories" : "About"}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
            <PsiIcon size={10} className="text-primary-foreground" />
          </div>
          <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Lora', serif" }}>
            Mindex
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Built for psychology students</p>
        <p className="text-xs text-muted-foreground">
          © {year} Mindex. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-4 bg-muted rounded w-10" />
      </div>
      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
      <div className="h-5 bg-muted rounded w-1/2 mb-4" />
      <div className="space-y-2 mb-5">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="h-3 bg-muted rounded w-4/6" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="h-3 bg-muted rounded w-32" />
        <div className="h-8 bg-muted rounded w-28" />
      </div>
    </div>
  );
}

// ─── Literature Detail Modal ──────────────────────────────────────────────────

function LiteratureModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative bg-card w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-xl shadow-2xl border border-border flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium font-mono ${categoryColor(entry.category)}`}>
                {entry.category}
              </span>
              <span className="text-xs text-muted-foreground font-mono border border-border px-2 py-1 rounded">{entry.type}</span>
              <span className="text-xs text-muted-foreground font-mono">{entry.year}</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-snug" style={{ fontFamily: "'Lora', serif" }}>
              {entry.title}
            </h2>
          </div>
          <button onClick={onClose} className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors mt-0.5">
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Author(s)</p>
              <p className="text-sm text-foreground">{entry.author}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Publication</p>
              <p className="text-sm text-foreground italic" style={{ fontFamily: "'Lora', serif" }}>{entry.source}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Abstract</p>
            <p className="text-sm text-foreground leading-relaxed">{entry.abstract}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-mono">{entry.type} · {entry.year}</p>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 transition-colors"
          >
            Open Literature <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────
const ABSTRACT_LIMIT = 160;

function ResultCard({ entry }: { entry: Entry }) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isTruncated = entry.abstract.length > ABSTRACT_LIMIT;
  const displayAbstract = expanded || !isTruncated ? entry.abstract : entry.abstract.slice(0, ABSTRACT_LIMIT).trimEnd() + "…";
  return (
    <>
    <article className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 hover:shadow-md hover:border-[#2e4057]/25 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium tracking-wide font-mono ${categoryColor(entry.category)}`}>
          {entry.category}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground font-mono">{entry.type}</span>
          <span className="w-1 h-1 rounded-full bg-border inline-block" />
          <span className="text-xs text-muted-foreground font-mono">{entry.year}</span>
        </div>
      </div>
      <div>
        <h3
          className="text-base font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {entry.title}
        </h3>
        <p className="text-sm text-muted-foreground">{entry.author}</p>
      </div>
     <div className="text-sm text-foreground/75 leading-relaxed">
          {displayAbstract}
          {isTruncated && (
            <button
              onClick={() => expanded ? setExpanded(false) : setShowModal(true)}
              className="ml-1 text-primary hover:underline font-medium text-xs whitespace-nowrap"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground italic truncate" style={{ fontFamily: "'Lora', serif" }}>{entry.source}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded hover:bg-muted hover:text-foreground transition-colors"
            >
              Details
            </button>
            <a href={entry.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/85 transition-colors">
              Open <ExternalLink size={11} />
            </a>
          </div>
        </div>
    </article>
          {showModal && <LiteratureModal entry={entry} onClose={() => setShowModal(false)} />}
          </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onNav, entries, entriesLoading, categories }: { onNav: (p: Page, cat?: Category) => void; entries: Entry[]; entriesLoading: boolean; categories: string[] }) {
  const categoryOptions = categories.length ? categories : CATEGORIES;
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [selectedType, setSelectedType] = useState<EntryType | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "az" | "relevant">("relevant");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setPage(1);
    setTimeout(() => { setQuery(inputValue); setLoading(false); }, 700);
  };

  const clearFilters = () => {
    setSelectedCategory(""); setSelectedYear(""); setSelectedType(""); setSortBy("relevant"); setPage(1);
  };

  const activeFilterCount = [selectedCategory, selectedYear, selectedType].filter(Boolean).length;

  const filtered = useMemo(() => {
    let results = entries.filter((e) => {
      const q = query.toLowerCase();
      const matchQ = !q || [e.title, e.author, e.category, e.abstract, e.source].some((f) => f.toLowerCase().includes(q));
      return matchQ && (!selectedCategory || e.category === selectedCategory) && (!selectedYear || e.year === selectedYear) && (!selectedType || e.type === selectedType);
    });
    if (sortBy === "newest") results = [...results].sort((a, b) => b.year - a.year);
    else if (sortBy === "az") results = [...results].sort((a, b) => a.title.localeCompare(b.title));
    return results;
  }, [entries, query, selectedCategory, selectedYear, selectedType, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [selectedCategory, selectedYear, selectedType, sortBy]);

  return (
    <>
      {/* Hero */}
      <section className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-14 md:py-20">
          <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">Psychology Literature Database</p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-3 leading-tight max-w-2xl"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Find psychology journals and literature faster
          </h1>
          <p className="text-muted-foreground text-base mb-10 max-w-xl leading-relaxed">
            Search across thousands of peer-reviewed journals, research articles, theses, and literature reviews from leading psychology publications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search journals, topics, authors, or keywords…"
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 active:scale-[0.98] transition-all"
            >
              Search
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Search by topic, title, author, category, or abstract keywords</p>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        {/* Filters */}
        <div className="mb-8">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden flex items-center gap-2 text-sm font-medium text-foreground mb-4 px-3 py-2 border border-border rounded-lg bg-card"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-mono">{activeFilterCount}</span>
            )}
          </button>

          <div className={`${filtersOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap`}>
            {[
              { label: "All Categories", value: selectedCategory, setter: (v: string) => setSelectedCategory(v as Category | ""), options: categoryOptions.map((c) => ({ label: c, value: c })) },
              { label: "Any Year", value: selectedYear, setter: (v: string) => setSelectedYear(v ? Number(v) : ""), options: YEARS.map((y) => ({ label: String(y), value: String(y) })) },
              { label: "All Types", value: selectedType, setter: (v: string) => setSelectedType(v as EntryType | ""), options: TYPES.map((t) => ({ label: t, value: t })) },
            ].map(({ label, value, setter, options }) => (
              <select
                key={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer"
              >
                <option value="">{label}</option>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "az" | "relevant")}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer"
            >
              <option value="relevant">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="az">A–Z</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
              >
                <X size={12} /> Clear filters
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground font-mono hidden sm:block">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Category chips */}
          <div className="hidden md:flex flex-wrap gap-2 mt-4">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                className={`px-3 py-1 text-xs rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading || entriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search size={22} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2" style={{ fontFamily: "'Lora', serif" }}>No results found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Try adjusting your search terms or removing some filters to broaden your results.</p>
            {(query || activeFilterCount > 0) && (
              <button
                onClick={() => { setQuery(""); setInputValue(""); clearFilters(); }}
                className="mt-5 text-sm text-primary hover:underline"
              >
                Clear search and filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginated.map((entry: Entry) => <ResultCard key={entry.id} entry={entry} />)}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 text-sm rounded-lg font-mono transition-colors ${n === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground mt-4 font-mono">
              Page {page} of {totalPages} · {filtered.length} results
            </p>
          </>
        )}
      </main>
    </>
  );
}

// ─── Categories Page ──────────────────────────────────────────────────────────

function CategoriesPage({ onNav, entries, entriesLoading, categories }: { onNav: (p: Page, cat?: Category) => void; entries: Entry[]; entriesLoading: boolean; categories: string[] }) {
  const categoryList = categories.length ? categories : CATEGORIES;
  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-3">Browse by Discipline</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-3" style={{ fontFamily: "'Lora', serif" }}>
          Psychology Categories
        </h1>
        <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
          Explore literature organized by psychological discipline. Each category links to curated journals, articles, theses, and reviews in that field.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryList.map((cat) => {
          const meta = categoryMeta(cat);
          const count = entriesLoading ? "…" : entries.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => onNav("home", cat)}
              className="bg-card border border-border rounded-lg p-6 text-left group hover:shadow-md hover:border-primary/25 transition-all duration-200 flex flex-col gap-4"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.bg} ${meta.color}`}>
                {meta.icon}
              </div>
              <div>
                <h2
                  className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {cat}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{meta.description}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-mono mb-2">{count} entries in database</p>
                {meta.journals.length > 0 && (
                  <p className="text-xs text-muted-foreground italic" style={{ fontFamily: "'Lora', serif" }}>
                    Key journals: {meta.journals.slice(0, 2).join(", ")}
                    {meta.journals.length > 2 && " & more"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                Browse {cat.split(" ")[0]} literature
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats strip */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {[
          { label: "Total Entries", value: entriesLoading ? "…" : entries.length },
          { label: "Disciplines", value: categoryList.length },
          { label: "Publication Types", value: TYPES.length },
          { label: "Year Range", value: "2020–2023" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card px-6 py-5">
            <p className="text-2xl font-semibold text-foreground font-mono mb-1">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────

interface Contributor {
  initials: string;
  name: string;
  role: string;
  bio: string;
}

const CONTRIBUTORS: Contributor[] = [
  {
    initials: "B.P.H.",
    name: "Bunga Putri Heriniansyah",
    role: "Content Curator",
    bio: "Curated the journal database and category taxonomy to help psychology students find relevant research faster.",
  },
  {
    initials: "R.A.W.",
    name: "Ristu Aji Wijayanto",
    role: "Full-stack Developer & UX Design",
    bio: "Built the platform and designed the interface for a clean, focused research experience.",
  },
];

function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      {/* Mission */}
      <div className="max-w-2xl mb-14">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-3">About This Project</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-4" style={{ fontFamily: "'Lora', serif" }}>
          Built for psychology students, by psychology students
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-4">
          Mindex started as a small side project during a graduate research methods course. Finding the right journal or paper was always slower than it needed to be — scattered across different databases with inconsistent search tools.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed">
          This tool aggregates literature across seven core psychology disciplines into a single, clean interface. No paywalls, no clutter — just fast, focused search for students and early-career researchers.
        </p>
      </div>

      {/* Team */}
      <div className="mb-14">
        <h2 className="text-xl font-medium text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
          Contributors
        </h2>
        <p className="text-sm text-muted-foreground mb-7">
          The people behind Mindex. Reach out via GitHub if you would like to collaborate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CONTRIBUTORS.map((c) => (
            <div
              key={c.name}
              className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-base font-semibold text-foreground font-mono">
                {c.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to contribute */}
      <div className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <GitPullRequest size={18} className="text-foreground" />
            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>
              Contribute on GitHub
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Found an error, missing a journal, or want to improve the interface? We welcome pull requests and issues. The database and codebase are both open.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
          >
            View repository <ArrowRight size={13} />
          </a>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <Mail size={18} className="text-foreground" />
            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>
              Get in Touch
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Have suggestions, feedback, or want to report a broken link? We read every message. Contact is handled through GitHub issues to keep things transparent.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
          >
            Open an issue <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* Support / Buy Me a Coffee */}
      <div className="bg-[#fffbf2] border border-[#f0e4c0] rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-14 h-14 bg-[#f9d86e] rounded-xl flex items-center justify-center shrink-0">
          <Coffee size={26} className="text-[#7a5a10]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
            Support this project
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mindex is free and always will be. If it has helped your research or saved you time, a small contribution helps cover hosting and keeps the project active. No pressure — every cup counts.
          </p>
        </div>
        <a
          href="https://www.buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f9d86e] hover:bg-[#f5cc4a] text-[#7a5a10] text-sm font-semibold rounded-lg transition-colors shrink-0 whitespace-nowrap"
        >
          <Coffee size={15} />
          Buy me a coffee
        </a>
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-xs text-muted-foreground text-center leading-relaxed max-w-xl mx-auto">
        Mindex is an independent student project and is not affiliated with any university, publisher, or professional psychological association. All journal names are used for identification purposes only.
      </p>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [preselectedCategory, setPreselectedCategory] = useState<Category | undefined>();
  const { activeEntries, loading } = useEntries();
  const { names: categoryNames } = useCategories();

  const handleNav = (p: Page, cat?: Category) => {
    setActivePage(p);
    if (cat) setPreselectedCategory(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Header activePage={activePage} onNav={handleNav} />

      {activePage === "home" && (
        <HomePage
          key={preselectedCategory}
          onNav={handleNav}
          entries={activeEntries}
          entriesLoading={loading}
          categories={categoryNames}
        />
      )}
      {activePage === "categories" && (
        <CategoriesPage
          onNav={handleNav}
          entries={activeEntries}
          entriesLoading={loading}
          categories={categoryNames}
        />
      )}
      {activePage === "about" && <AboutPage />}

      <Footer />
    </div>
  );
}
