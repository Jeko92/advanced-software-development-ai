import { ProgrammingLanguage } from '../lib/generated/prisma/client';
import type { Prisma } from '../lib/generated/prisma/client';

export const snippets: Prisma.SnippetCreateInput[] = [
  {
    title: 'CSS Grid Areas',
    language: ProgrammingLanguage.CSS,
    description: 'Create a grid with named areas.',
    code: ".grid-container {\n  display: grid;\n  grid-template-areas:\n    'header header header'\n    'sidebar content content'\n    'footer footer footer'; \n  grid-gap: 10px;\n  background-color: #2196F3;\n  padding: 10px;\n}",
  },
  {
    title: 'Range of numbers',
    language: ProgrammingLanguage.JAVASCRIPT,
    description: 'Build an array from a start value up to an end value.',
    code: 'const range = (start, end) =>\n  Array.from({ length: end - start }, (_, i) => start + i);',
  },
  {
    title: 'Group by key',
    language: ProgrammingLanguage.TYPESCRIPT,
    description: 'Turn a list into buckets keyed by one of its fields.',
    code: 'function groupBy(items, key) {\n  return items.reduce((acc, item) => {\n    (acc[item[key]] ??= []).push(item);\n    return acc;\n  }, {});\n}',
  },
];
