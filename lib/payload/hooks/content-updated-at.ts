import type { FieldHook } from 'payload';

const CONTENT_FIELDS = ['title', 'slug', 'teaser', 'body', 'seoTitle', 'seoDescription', 'ogImageMedia'] as const;

function normalize(value: unknown): string {
  if (value && typeof value === 'object' && 'id' in value) return String(value.id);

  return JSON.stringify(value ?? null);
}

export const setContentUpdatedAt: FieldHook = ({ operation, originalDoc, siblingData }) => {
  const now = new Date().toISOString();

  if (operation === 'create' || !originalDoc?.contentUpdatedAt) return now;

  const changed = CONTENT_FIELDS.some(
    (field) => field in siblingData && normalize(siblingData[field]) !== normalize(originalDoc[field])
  );

  return changed ? now : originalDoc.contentUpdatedAt;
};
