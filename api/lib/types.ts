export interface DbEntry {
  id: number;
  title: string;
  abstract: string;
  category: string;
  year: number;
  author: string;
  source: string;
  type: string;
  url: string;
}

export interface DbEntryInput {
  title: string;
  abstract: string;
  category: string;
  year: number;
  author: string;
  source: string;
  type: string;
  url: string;
}
