import { generateLlmsTxt } from '@/lib/seo/llms';

export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  return new Response(await generateLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
