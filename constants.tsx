
import React from 'react';
import { Calculator, Ruler, LineChart, Table, BookOpen, FlaskConical, Atom, ListChecks, Settings } from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  { id: 'calc', name: 'Smart Calculator', category: 'math', description: 'Basic + Scientific WAEC mode', icon: 'Calculator' },
  { id: 'mathset', name: 'Digital Math Set', category: 'math', description: 'Ruler, Protractor & Compass', icon: 'Ruler' },
  { id: 'graph', name: 'Graph Book', category: 'math', description: 'Interactive X-Y Plotter', icon: 'LineChart' },
  { id: 'logtables', name: 'Log Tables', category: 'exam', description: 'Standard 4-figure tables', icon: 'Table' },
  { id: 'periodic', name: 'Periodic Table', category: 'science', description: 'Interactive element list', icon: 'Atom' },
  { id: 'vlab', name: 'Virtual Lab', category: 'science', description: 'Theory simulations', icon: 'FlaskConical' },
  { id: 'syllabus', name: 'Syllabus Checker', category: 'exam', description: 'WAEC/JAMB status', icon: 'ListChecks' },
  { id: 'notes', name: 'Notebook', category: 'study', description: 'Offline notes storage', icon: 'BookOpen' }
];

export const CATEGORY_COLORS: Record<string, string> = {
  math: 'bg-blue-600',
  science: 'bg-emerald-600',
  study: 'bg-purple-600',
  exam: 'bg-orange-600',
  settings: 'bg-slate-600'
};

export const CATEGORY_LIGHT: Record<string, string> = {
  math: 'bg-blue-50 text-blue-700',
  science: 'bg-emerald-50 text-emerald-700',
  study: 'bg-purple-50 text-purple-700',
  exam: 'bg-orange-50 text-orange-700',
  settings: 'bg-slate-50 text-slate-700'
};
