import { generateLlmsFullTxt } from '@/lib/seo/llms';

export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  return new Response(await generateLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
