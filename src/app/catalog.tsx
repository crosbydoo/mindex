import type { ReactNode } from 'react';
import {
  Baby,
  Brain,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Layers,
  Users,
} from 'lucide-react';
import type { EntryType } from '@/lib/types';

/** Seed / default names — UI styling fallbacks. Live list comes from the API. */
export const DEFAULT_CATEGORIES = [
  'Clinical Psychology',
  'Cognitive Psychology',
  'Developmental Psychology',
  'Educational Psychology',
  'Mental Health',
  'Research Methods',
  'Social Psychology',
] as const;

/** @deprecated Prefer live names from useCategories(). Kept for fallback UI. */
export const CATEGORIES: string[] = [...DEFAULT_CATEGORIES];

export const TYPES: EntryType[] = [
  'Journal',
  'Article',
  'Thesis',
  'Literature Review',
];

export const YEARS = [2020, 2021, 2022, 2023];

const KNOWN_COLORS: Record<string, string> = {
  'Clinical Psychology': 'bg-[#dce8f0] text-[#2e4057]',
  'Cognitive Psychology': 'bg-[#ddf0e5] text-[#2a5c3a]',
  'Developmental Psychology': 'bg-[#f0e8dc] text-[#5c3a2a]',
  'Educational Psychology': 'bg-[#e8dcf0] text-[#4a2a5c]',
  'Mental Health': 'bg-[#f0dcdc] text-[#5c2a2a]',
  'Research Methods': 'bg-[#e8f0dc] text-[#3a5c2a]',
  'Social Psychology': 'bg-[#dcf0ee] text-[#2a5c58]',
};

const FALLBACK_COLOR = 'bg-muted text-muted-foreground';

export const CATEGORY_COLORS: Record<string, string> = { ...KNOWN_COLORS };

type CategoryMeta = {
  color: string;
  bg: string;
  icon: ReactNode;
  description: string;
  journals: string[];
};

const KNOWN_META: Record<string, CategoryMeta> = {
  'Clinical Psychology': {
    color: 'text-[#2e4057]',
    bg: 'bg-[#dce8f0]',
    icon: <HeartPulse size={20} />,
    description:
      'Study of psychological disorders, assessment, and evidence-based therapeutic interventions across clinical populations.',
    journals: [
      'Journal of Clinical Psychology',
      'Behaviour Research and Therapy',
      'Clinical Psychology Review',
    ],
  },
  'Cognitive Psychology': {
    color: 'text-[#2a5c3a]',
    bg: 'bg-[#ddf0e5]',
    icon: <Brain size={20} />,
    description:
      'Exploration of mental processes including perception, memory, attention, language, reasoning, and decision-making.',
    journals: [
      'Cognition',
      'Psychological Review',
      'Journal of Experimental Psychology: General',
    ],
  },
  'Developmental Psychology': {
    color: 'text-[#5c3a2a]',
    bg: 'bg-[#f0e8dc]',
    icon: <Baby size={20} />,
    description:
      'Lifespan study of psychological change — from prenatal development through childhood, adolescence, and aging.',
    journals: [
      'Child Development',
      'Developmental Psychopathology',
      'Journal of Child Psychology and Psychiatry',
    ],
  },
  'Educational Psychology': {
    color: 'text-[#4a2a5c]',
    bg: 'bg-[#e8dcf0]',
    icon: <GraduationCap size={20} />,
    description:
      'How people learn and develop in educational contexts, covering motivation, instruction, assessment, and learning differences.',
    journals: [
      'Educational Psychologist',
      'Journal of Educational Psychology',
      'Learning and Instruction',
    ],
  },
  'Mental Health': {
    color: 'text-[#5c2a2a]',
    bg: 'bg-[#f0dcdc]',
    icon: <Layers size={20} />,
    description:
      'Psychological well-being, mental illness prevalence, prevention strategies, and community mental health systems.',
    journals: [
      'JAMA Psychiatry',
      'Clinical Psychology Review',
      'Professional Psychology: Research and Practice',
    ],
  },
  'Research Methods': {
    color: 'text-[#3a5c2a]',
    bg: 'bg-[#e8f0dc]',
    icon: <FlaskConical size={20} />,
    description:
      'Quantitative, qualitative, and mixed-methods approaches to designing and conducting psychological research.',
    journals: [
      'Psychological Methods',
      'Psychological Science Methods',
      'Behavior Research Methods',
    ],
  },
  'Social Psychology': {
    color: 'text-[#2a5c58]',
    bg: 'bg-[#dcf0ee]',
    icon: <Users size={20} />,
    description:
      'How individuals think, feel, and behave in social contexts — including identity, influence, prejudice, and group dynamics.',
    journals: [
      'Journal of Personality and Social Psychology',
      'Social Psychological and Personality Science',
      'Group Processes & Intergroup Relations',
    ],
  },
};

const FALLBACK_META: CategoryMeta = {
  color: 'text-muted-foreground',
  bg: 'bg-muted',
  icon: <Layers size={20} />,
  description: 'Psychology literature in this discipline.',
  journals: [],
};

export const CATEGORY_META: Record<string, CategoryMeta> = { ...KNOWN_META };

export function categoryColor(name: string): string {
  return KNOWN_COLORS[name] ?? FALLBACK_COLOR;
}

export function categoryMeta(name: string): CategoryMeta {
  return KNOWN_META[name] ?? FALLBACK_META;
}
