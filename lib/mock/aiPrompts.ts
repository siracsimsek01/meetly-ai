import { FileText, Lightbulb, ListTodo, Sparkles } from 'lucide-react';

import type { AiPrompt } from './types';

export const aiPrompts: AiPrompt[] = [
  { id: 'p1', label: 'Summarize last meeting', icon: FileText },
  { id: 'p2', label: 'Draft an agenda for Friday', icon: ListTodo },
  { id: 'p3', label: 'Surface unresolved decisions', icon: Lightbulb },
  { id: 'p4', label: 'Generate follow-up tasks', icon: Sparkles },
];
