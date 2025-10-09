import { embedContent } from '@/lib/vectorStore';

// Use Node runtime so server-only modules (fs, path, Pinecone, jsdom) are available.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT() {
  try {
    await embedContent();
    return Response.json({ success: true });
  } catch (error) {
    console.error('Embedding error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
