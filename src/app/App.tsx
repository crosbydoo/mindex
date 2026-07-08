import {
  ArrowRight,
  Baby,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ExternalLink,
  FlaskConical,
  GitPullRequest,
  GraduationCap,
  HeartPulse,
  Layers,
  Mail,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type EntryType = "Journal" | "Article" | "Thesis" | "Literature Review";
type Category =
  | "Clinical Psychology"
  | "Developmental Psychology"
  | "Cognitive Psychology"
  | "Social Psychology"
  | "Educational Psychology"
  | "Mental Health"
  | "Research Methods";

type Page = "home" | "categories" | "about";

interface Entry {
  id: number;
  title: string;
  abstract: string;
  category: Category;
  year: number;
  author: string;
  source: string;
  type: EntryType;
  url: string;
}

const ALL_ENTRIES: Entry[] = [
  {
    id: 1,
    title: "Attachment Theory and Its Implications for Psychotherapy",
    abstract:
      "This paper examines Bowlby's attachment theory and its contemporary applications in therapeutic contexts, exploring how early relational patterns shape adult psychological functioning and treatment outcomes.",
    category: "Clinical Psychology",
    year: 2023,
    author: "Sarah Chen, Marcus Webb",
    source: "Journal of Clinical Psychology",
    type: "Journal",
    url: "#",
  },
  {
    id: 2,
    title: "Cognitive Biases in Decision-Making Under Uncertainty",
    abstract:
      "A systematic review of heuristics and cognitive biases affecting judgment under uncertainty, with implications for behavioral economics and clinical decision-making frameworks.",
    category: "Cognitive Psychology",
    year: 2022,
    author: "Daniel Kahneman Jr., Elena Sorokina",
    source: "Psychological Review",
    type: "Literature Review",
    url: "#",
  },
  {
    id: 3,
    title: "Social Identity and Intergroup Conflict: A Meta-Analysis",
    abstract:
      "Meta-analytic synthesis of 147 studies examining the relationship between social identity salience and intergroup hostility, covering data from 1980–2022.",
    category: "Social Psychology",
    year: 2023,
    author: "Priya Nair, James Okonkwo",
    source: "Journal of Personality and Social Psychology",
    type: "Journal",
    url: "#",
  },
  {
    id: 4,
    title: "Childhood Adversity and Neuroplasticity in Adolescence",
    abstract:
      "Longitudinal study tracking structural brain changes in adolescents with documented early adversity, using MRI data from 312 participants over six years.",
    category: "Developmental Psychology",
    year: 2021,
    author: "Amara Diallo, Kenji Murakami",
    source: "Developmental Psychopathology",
    type: "Article",
    url: "#",
  },
  {
    id: 5,
    title: "Mindfulness-Based Cognitive Therapy for Recurrent Depression",
    abstract:
      "Randomized controlled trial evaluating MBCT efficacy in reducing relapse rates among adults with three or more prior major depressive episodes over a 24-month follow-up.",
    category: "Mental Health",
    year: 2022,
    author: "Lucia Ferretti, Aaron Moss",
    source: "JAMA Psychiatry",
    type: "Article",
    url: "#",
  },
  {
    id: 6,
    title: "Self-Determination Theory in Educational Settings",
    abstract:
      "An investigation of intrinsic vs. extrinsic motivation frameworks in K-12 and higher education contexts, with recommendations for pedagogical practice.",
    category: "Educational Psychology",
    year: 2020,
    author: "Richard Ryan Jr., Isabel Monteiro",
    source: "Educational Psychologist",
    type: "Journal",
    url: "#",
  },
  {
    id: 7,
    title: "Mixed-Methods Research Design in Clinical Psychology",
    abstract:
      "Guidelines for integrating qualitative and quantitative methodologies in psychological research, with worked examples from anxiety disorder treatment studies.",
    category: "Research Methods",
    year: 2023,
    author: "Oliver Strauss, Naomi Adeyemi",
    source: "Psychological Methods",
    type: "Literature Review",
    url: "#",
  },
  {
    id: 8,
    title: "Emotion Regulation Strategies and Borderline Personality Disorder",
    abstract:
      "Comparative analysis of DBT, schema therapy, and transference-focused psychotherapy outcomes across three clinical cohorts, with a focus on emotional dysregulation.",
    category: "Clinical Psychology",
    year: 2021,
    author: "Mariana Costa, Elias Bergmann",
    source: "Behaviour Research and Therapy",
    type: "Journal",
    url: "#",
  },
  {
    id: 9,
    title: "Language Acquisition and Theory of Mind in Early Childhood",
    abstract:
      "Cross-cultural study examining the relationship between vocabulary development and false-belief understanding in children aged 3–6 across five countries.",
    category: "Developmental Psychology",
    year: 2022,
    author: "Hana Petrov, Carlos Mendez",
    source: "Child Development",
    type: "Article",
    url: "#",
  },
  {
    id: 10,
    title: "The Psychology of Misinformation and Belief Updating",
    abstract:
      "Experimental investigation of how corrections and retractions influence persistent belief in misinformation, with analysis across political and health domains.",
    category: "Cognitive Psychology",
    year: 2023,
    author: "Tara Singh, Liam O'Brien",
    source: "Cognition",
    type: "Article",
    url: "#",
  },
  {
    id: 11,
    title: "Social Media Use and Adolescent Mental Health: A Systematic Review",
    abstract:
      "Systematic review of 89 longitudinal studies examining associations between social media engagement patterns and anxiety, depression, and self-esteem in adolescents.",
    category: "Mental Health",
    year: 2023,
    author: "Fatima Al-Hassan, Tom Bergqvist",
    source: "Clinical Psychology Review",
    type: "Literature Review",
    url: "#",
  },
  {
    id: 12,
    title: "Stereotype Threat and Academic Performance in Higher Education",
    abstract:
      "Field experiment and survey study examining how identity-relevant stereotypes suppress test performance and reduce persistence among first-generation university students.",
    category: "Educational Psychology",
    year: 2021,
    author: "Denise Warner, Kwame Boateng",
    source: "Journal of Educational Psychology",
    type: "Article",
    url: "#",
  },
  {
    id: 13,
    title: "Structural Equation Modeling in Psychological Research: A Primer",
    abstract:
      "Introduction to SEM techniques for graduate students, covering path analysis, confirmatory factor analysis, and mediation/moderation testing with annotated R examples.",
    category: "Research Methods",
    year: 2020,
    author: "Yuki Tanaka",
    source: "Psychological Science Methods",
    type: "Thesis",
    url: "#",
  },
  {
    id: 14,
    title: "Conformity and Obedience Revisited: Post-Replication Studies",
    abstract:
      "Replications and extensions of Milgram and Asch paradigms in contemporary samples, assessing generalizability and identifying moderating social contextual factors.",
    category: "Social Psychology",
    year: 2022,
    author: "Nadia Volkov, Samuel Henriksen",
    source: "Social Psychological and Personality Science",
    type: "Journal",
    url: "#",
  },
  {
    id: 15,
    title: "Trauma-Informed Care: Principles and Implementation",
    abstract:
      "Practice-focused review of trauma-informed frameworks in community mental health settings, including staff training models and outcome measurement strategies.",
    category: "Clinical Psychology",
    year: 2020,
    author: "Rosa Figueroa, Ben Okeke",
    source: "Psychological Trauma: Theory, Research, Practice, and Policy",
    type: "Literature Review",
    url: "#",
  },
  {
    id: 16,
    title: "Working Memory Capacity and Reading Comprehension",
    abstract:
      "Investigation of the role of phonological and visuospatial working memory components in text comprehension across reading skill levels in adult readers.",
    category: "Cognitive Psychology",
    year: 2021,
    author: "Claire Beaumont, Ravi Patel",
    source: "Journal of Experimental Psychology: General",
    type: "Article",
    url: "#",
  },
  {
    id: 17,
    title: "Peer Victimization and Internalizing Disorders in Middle School",
    abstract:
      "Two-year cohort study tracking the longitudinal effects of bullying and social exclusion on anxiety and depressive symptoms in 1,240 students aged 11–14.",
    category: "Developmental Psychology",
    year: 2023,
    author: "Ingrid Svensson, Marcus Osei",
    source: "Journal of Child Psychology and Psychiatry",
    type: "Journal",
    url: "#",
  },
  {
    id: 18,
    title: "Burnout Among Frontline Mental Health Workers Post-Pandemic",
    abstract:
      "Cross-sectional survey of 640 mental health clinicians examining prevalence, predictors, and protective factors of professional burnout following the COVID-19 pandemic.",
    category: "Mental Health",
    year: 2023,
    author: "Ayasha Morales, David Lindstrom",
    source: "Professional Psychology: Research and Practice",
    type: "Article",
    url: "#",
  },
];

const CATEGORIES: Category[] = [
  "Clinical Psychology",
  "Cognitive Psychology",
  "Developmental Psychology",
  "Educational Psychology",
  "Mental Health",
  "Research Methods",
  "Social Psychology",
];

const TYPES: EntryType[] = ["Journal", "Article", "Thesis", "Literature Review"];
const YEARS = [2020, 2021, 2022, 2023];
const PER_PAGE = 6;

const CATEGORY_META: Record<
  Category,
  { color: string; bg: string; icon: React.ReactNode; description: string; journals: string[] }
> = {
  "Clinical Psychology": {
    color: "text-[#2e4057]",
    bg: "bg-[#dce8f0]",
    icon: <HeartPulse size={20} />,
    description:
      "Study of psychological disorders, assessment, and evidence-based therapeutic interventions across clinical populations.",
    journals: ["Journal of Clinical Psychology", "Behaviour Research and Therapy", "Clinical Psychology Review"],
  },
  "Cognitive Psychology": {
    color: "text-[#2a5c3a]",
    bg: "bg-[#ddf0e5]",
    icon: <Brain size={20} />,
    description:
      "Exploration of mental processes including perception, memory, attention, language, reasoning, and decision-making.",
    journals: ["Cognition", "Psychological Review", "Journal of Experimental Psychology: General"],
  },
  "Developmental Psychology": {
    color: "text-[#5c3a2a]",
    bg: "bg-[#f0e8dc]",
    icon: <Baby size={20} />,
    description:
      "Lifespan study of psychological change — from prenatal development through childhood, adolescence, and aging.",
    journals: ["Child Development", "Developmental Psychopathology", "Journal of Child Psychology and Psychiatry"],
  },
  "Educational Psychology": {
    color: "text-[#4a2a5c]",
    bg: "bg-[#e8dcf0]",
    icon: <GraduationCap size={20} />,
    description:
      "How people learn and develop in educational contexts, covering motivation, instruction, assessment, and learning differences.",
    journals: ["Educational Psychologist", "Journal of Educational Psychology", "Learning and Instruction"],
  },
  "Mental Health": {
    color: "text-[#5c2a2a]",
    bg: "bg-[#f0dcdc]",
    icon: <Layers size={20} />,
    description:
      "Psychological well-being, mental illness prevalence, prevention strategies, and community mental health systems.",
    journals: ["JAMA Psychiatry", "Clinical Psychology Review", "Professional Psychology: Research and Practice"],
  },
  "Research Methods": {
    color: "text-[#3a5c2a]",
    bg: "bg-[#e8f0dc]",
    icon: <FlaskConical size={20} />,
    description:
      "Quantitative, qualitative, and mixed-methods approaches to designing and conducting psychological research.",
    journals: ["Psychological Methods", "Psychological Science Methods", "Behavior Research Methods"],
  },
  "Social Psychology": {
    color: "text-[#2a5c58]",
    bg: "bg-[#dcf0ee]",
    icon: <Users size={20} />,
    description:
      "How individuals think, feel, and behave in social contexts — including identity, influence, prejudice, and group dynamics.",
    journals: [
      "Journal of Personality and Social Psychology",
      "Social Psychological and Personality Science",
      "Group Processes & Intergroup Relations",
    ],
  },
};

const CATEGORY_COLORS: Record<Category, string> = {
  "Clinical Psychology": "bg-[#dce8f0] text-[#2e4057]",
  "Cognitive Psychology": "bg-[#ddf0e5] text-[#2a5c3a]",
  "Developmental Psychology": "bg-[#f0e8dc] text-[#5c3a2a]",
  "Educational Psychology": "bg-[#e8dcf0] text-[#4a2a5c]",
  "Mental Health": "bg-[#f0dcdc] text-[#5c2a2a]",
  "Research Methods": "bg-[#e8f0dc] text-[#3a5c2a]",
  "Social Psychology": "bg-[#dcf0ee] text-[#2a5c58]",
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
            <BookOpen size={14} className="text-primary-foreground" />
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
            <BookOpen size={10} className="text-primary-foreground" />
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

// ─── Result Card ─────────────────────────────────────────────────────────────

function ResultCard({ entry }: { entry: Entry }) {
  return (
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
      <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3">{entry.abstract}</p>
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground italic truncate" style={{ fontFamily: "'Lora', serif" }}>
          {entry.source}
        </span>
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/85 transition-colors shrink-0"
        >
          Open Literature
          <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onNav }: { onNav: (p: Page, cat?: Category) => void }) {
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
    let results = ALL_ENTRIES.filter((e) => {
      const q = query.toLowerCase();
      const matchQ = !q || [e.title, e.author, e.category, e.abstract, e.source].some((f) => f.toLowerCase().includes(q));
      return matchQ && (!selectedCategory || e.category === selectedCategory) && (!selectedYear || e.year === selectedYear) && (!selectedType || e.type === selectedType);
    });
    if (sortBy === "newest") results = [...results].sort((a, b) => b.year - a.year);
    else if (sortBy === "az") results = [...results].sort((a, b) => a.title.localeCompare(b.title));
    return results;
  }, [query, selectedCategory, selectedYear, selectedType, sortBy]);

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
        {loading ? (
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
              {paginated.map((entry) => <ResultCard key={entry.id} entry={entry} />)}
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

function CategoriesPage({ onNav }: { onNav: (p: Page, cat?: Category) => void }) {
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
          const count = ALL_ENTRIES.filter((e) => e.category === cat).length;
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
          { label: "Total Entries", value: ALL_ENTRIES.length },
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
  role: string;
  handle: string;
  bio: string;
}

const CONTRIBUTORS: Contributor[] = [
  {
    initials: "A.R.",
    role: "Lead Developer",
    handle: "github.com/a-r",
    bio: "Full-stack developer and psychology student passionate about making academic research more accessible to everyone.",
  },
  {
    initials: "M.T.",
    role: "UX & Design",
    handle: "github.com/m-t",
    bio: "Designer focused on clean, readable interfaces for educational tools and student-facing research platforms.",
  },
  {
    initials: "J.L.",
    role: "Content Curator",
    handle: "github.com/j-l",
    bio: "Graduate researcher in clinical psychology who curated the initial journal database and category taxonomy.",
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
          We keep personal details minimal to respect contributor privacy. Reach out via GitHub if you would like to collaborate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CONTRIBUTORS.map((c) => (
            <div
              key={c.initials}
              className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-base font-semibold text-foreground font-mono">
                {c.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.role}</p>
                <p className="text-xs text-muted-foreground font-mono">{c.handle}</p>
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

  const handleNav = (p: Page, cat?: Category) => {
    setActivePage(p);
    if (cat) setPreselectedCategory(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Header activePage={activePage} onNav={handleNav} />

      {activePage === "home" && (
        <HomePage key={preselectedCategory} onNav={handleNav} />
      )}
      {activePage === "categories" && <CategoriesPage onNav={handleNav} />}
      {activePage === "about" && <AboutPage />}

      <Footer />
    </div>
  );
}
