import { createSnippet, getAllSnippets } from '@/lib/services/snippetsService';

export async function GET() {
  const snippets = await getAllSnippets();
  return Response.json(snippets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const snippet = await createSnippet(body);

  return Response.json(snippet, { status: 201 });
}
