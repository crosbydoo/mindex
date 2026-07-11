import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BookMarked,
  Brain,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  GitPullRequest,
  GraduationCap,
  HeartPulse,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useEntries } from "@/hooks/useEntries";
import { loginAdmin, logoutAdmin } from "@/lib/api";
import { clearAdminToken, setAdminToken } from "@/lib/auth";
import type { Category, Entry, EntryInput, EntryType } from "@/lib/types";

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

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  "Clinical Psychology", "Cognitive Psychology", "Developmental Psychology",
  "Educational Psychology", "Mental Health", "Research Methods", "Social Psychology",
];
const TYPES: EntryType[] = ["Journal", "Article", "Thesis", "Literature Review"];
const YEARS = [2020, 2021, 2022, 2023];
const PER_PAGE = 6;

const CATEGORY_COLORS: Record<Category, string> = {
  "Clinical Psychology": "bg-[#dce8f0] text-[#2e4057]",
  "Cognitive Psychology": "bg-[#ddf0e5] text-[#2a5c3a]",
  "Developmental Psychology": "bg-[#f0e8dc] text-[#5c3a2a]",
  "Educational Psychology": "bg-[#e8dcf0] text-[#4a2a5c]",
  "Mental Health": "bg-[#f0dcdc] text-[#5c2a2a]",
  "Research Methods": "bg-[#e8f0dc] text-[#3a5c2a]",
  "Social Psychology": "bg-[#dcf0ee] text-[#2a5c58]",
};

const CATEGORY_META: Record<Category, { color: string; bg: string; icon: React.ReactNode; description: string; journals: string[] }> = {
  "Clinical Psychology": { color: "text-[#2e4057]", bg: "bg-[#dce8f0]", icon: <HeartPulse size={20} />, description: "Study of psychological disorders, assessment, and evidence-based therapeutic interventions across clinical populations.", journals: ["Journal of Clinical Psychology", "Behaviour Research and Therapy", "Clinical Psychology Review"] },
  "Cognitive Psychology": { color: "text-[#2a5c3a]", bg: "bg-[#ddf0e5]", icon: <Brain size={20} />, description: "Exploration of mental processes including perception, memory, attention, language, reasoning, and decision-making.", journals: ["Cognition", "Psychological Review", "Journal of Experimental Psychology: General"] },
  "Developmental Psychology": { color: "text-[#5c3a2a]", bg: "bg-[#f0e8dc]", icon: <Baby size={20} />, description: "Lifespan study of psychological change — from prenatal development through childhood, adolescence, and aging.", journals: ["Child Development", "Developmental Psychopathology", "Journal of Child Psychology and Psychiatry"] },
  "Educational Psychology": { color: "text-[#4a2a5c]", bg: "bg-[#e8dcf0]", icon: <GraduationCap size={20} />, description: "How people learn and develop in educational contexts, covering motivation, instruction, assessment, and learning differences.", journals: ["Educational Psychologist", "Journal of Educational Psychology", "Learning and Instruction"] },
  "Mental Health": { color: "text-[#5c2a2a]", bg: "bg-[#f0dcdc]", icon: <Layers size={20} />, description: "Psychological well-being, mental illness prevalence, prevention strategies, and community mental health systems.", journals: ["JAMA Psychiatry", "Clinical Psychology Review", "Professional Psychology: Research and Practice"] },
  "Research Methods": { color: "text-[#3a5c2a]", bg: "bg-[#e8f0dc]", icon: <FlaskConical size={20} />, description: "Quantitative, qualitative, and mixed-methods approaches to designing and conducting psychological research.", journals: ["Psychological Methods", "Psychological Science Methods", "Behavior Research Methods"] },
  "Social Psychology": { color: "text-[#2a5c58]", bg: "bg-[#dcf0ee]", icon: <Users size={20} />, description: "How individuals think, feel, and behave in social contexts — including identity, influence, prejudice, and group dynamics.", journals: ["Journal of Personality and Social Psychology", "Social Psychological and Personality Science", "Group Processes & Intergroup Relations"] },
};

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
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium font-mono ${CATEGORY_COLORS[entry.category]}`}>
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
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium tracking-wide font-mono ${CATEGORY_COLORS[entry.category]}`}>
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

// ─── Entry Form Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = { title: "", abstract: "", category: "Clinical Psychology" as Category, year: 2023, author: "", source: "", type: "Journal" as EntryType, url: "" };

function EntryFormModal({ initial, onSave, onClose }: { initial?: Entry; onSave: (data: Omit<Entry, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Entry, "id">>(initial ? { ...initial } : EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Entry, "id">, string>>>({});

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.source.trim()) e.source = "Source is required";
    if (!form.abstract.trim()) e.abstract = "Abstract is required";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const field = (label: string, key: keyof Omit<Entry, "id">, type = "text", multiline = false) => (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
      {multiline ? (
        <textarea value={form[key] as string} onChange={(e) => set(key, e.target.value as never)} rows={3}
          className={`w-full px-3 py-2 text-sm bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${errors[key] ? "border-destructive" : "border-border"}`} />
      ) : (
        <input type={type} value={form[key] as string | number} onChange={(e) => set(key, (type === "number" ? Number(e.target.value) : e.target.value) as never)}
          className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${errors[key] ? "border-destructive" : "border-border"}`} />
      )}
      {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>
            {initial ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {field("Title", "title")}
          {field("Author(s)", "author")}
          {field("Source / Journal Name", "source")}
          {field("Abstract", "abstract", "text", true)}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value as Category)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value as EntryType)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Year</label>
              <input type="number" value={form.year} min={1900} max={2099} onChange={(e) => set("year", Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">URL (optional)</label>
              <input type="text" value={form.url} onChange={(e) => set("url", e.target.value)}
                placeholder="https://…" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/85 transition-colors flex items-center gap-1.5">
              <Check size={14} /> {initial ? "Save Changes" : "Add Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ entry, onConfirm, onClose }: { entry: Entry; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="w-11 h-11 bg-[#fde8e8] rounded-full flex items-center justify-center">
          <AlertTriangle size={20} className="text-destructive" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>Delete entry?</h3>
          <p className="text-sm text-muted-foreground">
            "<span className="font-medium text-foreground">{entry.title.length > 60 ? entry.title.slice(0, 60) + "…" : entry.title}</span>" will be permanently removed.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/85 transition-colors flex items-center gap-1.5">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
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
      <div className={`w-full max-w-sm mt-10 transition-transform ${shake ? "animate-[shake_0.4s_ease]" : ""}`}>
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
          <Lock size={20} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-medium text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>Admin access</h1>
        <p className="text-sm text-muted-foreground mb-8">Enter the admin password to manage the literature database.</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && attempt()}
                placeholder="Enter admin password"
                className={`w-full px-3 py-2.5 pr-10 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 transition ${error ? "border-destructive focus:ring-destructive/20" : "border-border"}`}
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1"><AlertTriangle size={11} /> Incorrect password. Please try again.</p>}
          </div>

          <button onClick={() => void attempt()} disabled={submitting}
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 active:scale-[0.98] transition-all disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </main>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({
  entries, onAdd, onUpdate, onDelete, onLogout, usingLocalFallback,
}: {
  entries: Entry[];
  onAdd: (e: EntryInput) => Promise<void>;
  onUpdate: (e: Entry) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onLogout: () => void;
  usingLocalFallback: boolean;
}) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "">("");
  const [showModal, setShowModal] = useState<"add" | Entry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter((e) =>
      (!q || e.title.toLowerCase().includes(q) || e.author.toLowerCase().includes(q)) &&
      (!filterCat || e.category === filterCat)
    );
  }, [entries, search, filterCat]);

  const stats = useMemo(() => ({
    total: entries.length,
    byType: TYPES.reduce((acc, t) => ({ ...acc, [t]: entries.filter((e) => e.type === t).length }), {} as Record<EntryType, number>),
    recentYear: entries.length ? Math.max(...entries.map((e) => e.year)) : "—",
  }), [entries]);

  const handleSave = async (data: EntryInput, existing?: Entry) => {
    try {
      if (existing) {
        await onUpdate({ ...existing, ...data });
        showToast("Entry updated successfully");
      } else {
        await onAdd(data);
        showToast("Entry added successfully");
      }
      setShowModal(null);
    } catch {
      showToast(usingLocalFallback ? "API unavailable — start the Go server on :8080" : "Failed to save entry", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      setDeleteTarget(null);
      showToast("Entry deleted", "error");
    } catch {
      showToast(usingLocalFallback ? "API unavailable — start the Go server on :8080" : "Failed to delete entry", "error");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-10">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={16} className="text-accent" />
            <p className="text-xs font-mono tracking-widest text-accent uppercase">Admin Panel</p>
          </div>
          <h1 className="text-2xl font-medium text-foreground" style={{ fontFamily: "'Lora', serif" }}>Literature Database</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowModal("add")}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/85 transition-colors">
            <Plus size={15} /> Add Entry
          </button>
          <button
            onClick={() => {
              void logoutAdmin()
                .catch(() => undefined)
                .finally(() => {
                  clearAdminToken();
                  onLogout();
                });
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {usingLocalFallback && (
        <p className="mb-6 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          API is offline. Check the backend at <code className="font-mono">https://mindex-api.duckdns.org</code> or set{" "}
          <code className="font-mono">VITE_API_BASE_URL</code>.
        </p>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Entries", value: stats.total, icon: <BookMarked size={16} /> },
          { label: "Journals", value: stats.byType["Journal"], icon: <FileText size={16} /> },
          { label: "Articles", value: stats.byType["Article"], icon: <FileText size={16} /> },
          { label: "Latest Year", value: stats.recentYear, icon: <FileText size={16} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-5 py-4">
            <div className="text-muted-foreground mb-2">{icon}</div>
            <p className="text-2xl font-semibold text-foreground font-mono">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value as Category | "")}
          className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="self-center text-xs text-muted-foreground font-mono whitespace-nowrap">{filtered.length} entries</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Title / Author</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Year</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No entries match your search.
                  </td>
                </tr>
              ) : filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors align-top">
                    <td className="px-5 py-4">
                      <button onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        className="text-left group flex items-start gap-2 w-full">
                        <ChevronDown size={14} className={`mt-0.5 text-muted-foreground shrink-0 transition-transform ${expandedId === entry.id ? "rotate-180" : ""}`} />
                        <div>
                          <p className="font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">{entry.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.author}</p>
                          {expandedId === entry.id && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground leading-relaxed">{entry.abstract}</p>
                              <p className="text-xs text-muted-foreground italic mt-1" style={{ fontFamily: "'Lora', serif" }}>{entry.source}</p>
                            </div>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${CATEGORY_COLORS[entry.category]}`}>
                        {entry.category.split(" ")[0]}
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
                        <button onClick={() => setShowModal(entry)} title="Edit"
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(entry)} title="Delete"
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-[#fde8e8] rounded transition-colors">
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

      {/* Modals */}
      {showModal === "add" && (
        <EntryFormModal
          onSave={(data) => void handleSave(data)}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal && showModal !== "add" && (
        <EntryFormModal
          initial={showModal as Entry}
          onSave={(data) => void handleSave(data, showModal as Entry)}
          onClose={() => setShowModal(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          entry={deleteTarget}
          onConfirm={() => void handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border ${toast.type === "success" ? "bg-card border-[#5a7a63]/40 text-foreground" : "bg-[#fde8e8] border-destructive/20 text-destructive"}`}>
          {toast.type === "success" ? <Check size={14} className="text-accent" /> : <Trash2 size={14} />}
          {toast.msg}
        </div>
      )}
    </main>
  );
}


// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onNav, entries, entriesLoading }: { onNav: (p: Page, cat?: Category) => void; entries: Entry[]; entriesLoading: boolean }) {
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
              { label: "All Categories", value: selectedCategory, setter: (v: string) => setSelectedCategory(v as Category | ""), options: CATEGORIES.map((c) => ({ label: c, value: c })) },
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
            {CATEGORIES.map((cat) => (
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

function CategoriesPage({ onNav, entries, entriesLoading }: { onNav: (p: Page, cat?: Category) => void; entries: Entry[]; entriesLoading: boolean }) {
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
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
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
                <p className="text-xs text-muted-foreground italic" style={{ fontFamily: "'Lora', serif" }}>
                  Key journals: {meta.journals.slice(0, 2).join(", ")}
                  {meta.journals.length > 2 && " & more"}
                </p>
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
          { label: "Disciplines", value: CATEGORIES.length },
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

// ─── Admin Page (gate + dashboard) ───────────────────────────────────────────

export function AdminPage({
  entries,
  loading,
  usingLocalFallback,
  onAdd,
  onUpdate,
  onDelete,
}: {
  entries: Entry[];
  loading: boolean;
  usingLocalFallback: boolean;
  onAdd: (e: EntryInput) => Promise<Entry | void>;
  onUpdate: (e: Entry) => Promise<Entry | void>;
  onDelete: (id: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
}) {
  const [authed, setAuthed] = useState(false);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <p className="text-sm text-muted-foreground">Loading database…</p>
      </main>
    );
  }

  return authed ? (
    <AdminDashboard
      entries={entries}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      usingLocalFallback={usingLocalFallback}
      onLogout={() => setAuthed(false)}
    />
  ) : (
    <AdminLogin onSuccess={() => setAuthed(true)} />
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [preselectedCategory, setPreselectedCategory] = useState<Category | undefined>();
  const { entries, loading } = useEntries();

  const handleNav = (p: Page, cat?: Category) => {
    setActivePage(p);
    if (cat) setPreselectedCategory(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Header activePage={activePage} onNav={handleNav} />

      {activePage === "home" && (
        <HomePage key={preselectedCategory} onNav={handleNav} entries={entries} entriesLoading={loading} />
      )}
      {activePage === "categories" && <CategoriesPage onNav={handleNav} entries={entries} entriesLoading={loading} />}
      {activePage === "about" && <AboutPage />}

      <Footer />
    </div>
  );
}
