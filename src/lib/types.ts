export type EntryType = 'Journal' | 'Article' | 'Thesis' | 'Literature Review';

export type Category =
  | 'Clinical Psychology'
  | 'Developmental Psychology'
  | 'Cognitive Psychology'
  | 'Social Psychology'
  | 'Educational Psychology'
  | 'Mental Health'
  | 'Research Methods';

export interface Entry {
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

export type EntryInput = Omit<Entry, 'id'>;
