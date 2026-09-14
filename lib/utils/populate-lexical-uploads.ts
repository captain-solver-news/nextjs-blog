import { inArray } from 'drizzle-orm';
import { getPayload } from 'payload';
import config from '@payload-config';
import { media } from '@/lib/payload/generated-schema';
import type { Media } from '@/lib/actions/types/media';
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

type LexicalNode = {
  type?: string;
  relationTo?: string;
  value?: unknown;
  children?: LexicalNode[];
};

function walk(nodes: LexicalNode[], visit: (node: LexicalNode) => void): void {
  for (const node of nodes) {
    visit(node);

    if (Array.isArray(node.children)) {
      walk(node.children, visit);
    }
  }
}

function mediaUploadId(node: LexicalNode): string | null {
  if (node.type !== 'upload' || node.relationTo !== 'media') return null;

  return typeof node.value === 'string' ? node.value : null;
}

function rootChildren(state: DefaultTypedEditorState): LexicalNode[] {
  return (state as unknown as { root?: { children?: LexicalNode[] } }).root?.children ?? [];
}

export default async function populateLexicalUploads<T extends DefaultTypedEditorState | null | undefined>(
  state: T
): Promise<T> {
  if (!state) return state;

  const ids = new Set<string>();

  walk(rootChildren(state), (node) => {
    const id = mediaUploadId(node);

    if (id) ids.add(id);
  });

  if (ids.size === 0) return state;

  const db = (await getPayload({ config })).db.drizzle;
  const rows = (await db
    .select()
    .from(media)
    .where(inArray(media.id, [...ids]))) as Media[];

  const byId = new Map(rows.map((row) => [row.id, row]));
  const populated = structuredClone(state);

  walk(rootChildren(populated), (node) => {
    const id = mediaUploadId(node);

    if (!id) return;

    const doc = byId.get(id);

    if (doc?.url && doc.mimeType) {
      node.value = doc;
    }
  });

  return populated;
}
