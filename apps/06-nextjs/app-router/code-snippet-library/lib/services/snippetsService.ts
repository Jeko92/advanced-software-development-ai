export type Snippet = {
  id: number;
  title: string;
  language: string;
  description: string;
  code: string;
};

const snippets: Snippet[] = [
  {
    id: 1,
    title: 'CSS Grid Areas',
    language: 'CSS',
    description: 'Create a grid with named areas.',
    code: ".grid-container {\n  display: grid;\n  grid-template-areas:\n    'header header header'\n    'sidebar content content'\n    'footer footer footer'; \n  grid-gap: 10px;\n  background-color: #2196F3;\n  padding: 10px;\n}",
  },
  {
    id: 2,
    title: 'Range of numbers',
    language: 'JavaScript',
    description: 'Build an array from a start value up to an end value.',
    code: 'const range = (start, end) =>\n  Array.from({ length: end - start }, (_, i) => start + i);',
  },
  {
    id: 3,
    title: 'Group by key',
    language: 'TypeScript',
    description: 'Turn a list into buckets keyed by one of its fields.',
    code: 'function groupBy(items, key) {\n  return items.reduce((acc, item) => {\n    (acc[item[key]] ??= []).push(item);\n    return acc;\n  }, {});\n}',
  },
];

export async function getAllSnippets(): Promise<Snippet[]> {
  return snippets;
}

export async function getSnippetById(id: number): Promise<Snippet | null> {
  return snippets.find((snippet) => snippet.id === id) || null;
}
