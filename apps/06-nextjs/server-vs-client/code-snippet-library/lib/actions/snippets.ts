'use server';

import { createSnippet } from '@/lib/services/snippetsService';
import { revalidatePath } from 'next/cache';
import type { ProgrammingLanguage } from '@/lib/generated/prisma/enums';

export async function addSnippet(formData: FormData) {
  const title = formData.get('title') as string;
  const language = formData.get('language') as ProgrammingLanguage;
  const description = formData.get('description') as string;
  const code = formData.get('code') as string;

  await createSnippet({ title, language, description, code });
  revalidatePath('/snippets');
}

export async function addSnippetFromObject(input: {
  title: string;
  language: ProgrammingLanguage;
  description: string;
  code: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const snippet = await createSnippet(input);
    revalidatePath('/snippets');
    return { ok: true, id: snippet.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
