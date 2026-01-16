
export type ToolCategory = 'math' | 'science' | 'study' | 'exam' | 'settings';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
}
