import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { Snippet } from '@/lib/services/snippetsService';

const languageBadge = cva('rounded-full px-2 py-1 text-xs font-medium', {
  variants: {
    language: {
      CSS: 'bg-blue-100 text-blue-800',
      JavaScript: 'bg-yellow-100 text-yellow-800',
      TypeScript: 'bg-indigo-100 text-indigo-800',
    },
  },
});

export const LanguageBadge = ({
  language,
  className,
}: {
  language: Snippet['language'];
  className?: string;
}) => (
  <span className={cn(languageBadge({ language }), className)}>{language}</span>
);
