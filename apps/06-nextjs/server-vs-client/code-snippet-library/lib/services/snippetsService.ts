import { prisma } from '@/lib/prisma';
import { ProgrammingLanguage as DbProgrammingLanguage } from '@/lib/generated/prisma/client';
import type { Snippet as DbSnippet } from '@/lib/generated/prisma/client';

export type Snippet = {
  id: string;
  title: string;
  language: 'CSS' | 'JavaScript' | 'TypeScript';
  description: string;
  code: string;
};

const languageFromDb: Record<DbProgrammingLanguage, Snippet['language']> = {
  [DbProgrammingLanguage.CSS]: 'CSS',
  [DbProgrammingLanguage.JAVASCRIPT]: 'JavaScript',
  [DbProgrammingLanguage.TYPESCRIPT]: 'TypeScript',
};

const toSnippet = (snippet: DbSnippet): Snippet => ({
  id: snippet.id,
  title: snippet.title,
  language: languageFromDb[snippet.language],
  description: snippet.description,
  code: snippet.code,
});

export const getAllSnippets = async (): Promise<Snippet[]> => {
  const snippets = await prisma.snippet.findMany();
  return snippets.map(toSnippet);
};

export const getSnippetById = async (
  id: string,
): Promise<Snippet | undefined> => {
  const snippet = await prisma.snippet.findUnique({ where: { id } });
  return snippet ? toSnippet(snippet) : undefined;
};

export const createSnippet = async (input: {
  title: string;
  language: DbProgrammingLanguage;
  description: string;
  code: string;
}): Promise<Snippet> => {
  const created = await prisma.snippet.create({
    data: {
      title: input.title,
      language: input.language,
      description: input.description,
      code: input.code,
    },
  });

  return toSnippet(created);
};
