import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionSlug,
  type FlattenedField,
  type Where,
} from 'payload';

type DocumentID = number | string;

function buildReferenceConditions(
  fields: FlattenedField[],
  target: CollectionSlug,
  id: DocumentID,
  prefix = ''
): Where[] {
  return fields.flatMap((field): Where[] => {
    const path = `${prefix}${field.name}`;

    if (field.type === 'upload' || field.type === 'relationship') {
      if (field.relationTo === target) {
        return [{ [path]: { equals: id } }];
      }

      if (Array.isArray(field.relationTo) && field.relationTo.includes(target)) {
        return [{ and: [{ [`${path}.relationTo`]: { equals: target } }, { [`${path}.value`]: { equals: id } }] }];
      }

      return [];
    }

    if (field.type === 'group' || field.type === 'tab' || field.type === 'array') {
      return buildReferenceConditions(field.flattenedFields, target, id, `${path}.`);
    }

    return [];
  });
}

export const preventDeleteIfReferenced: CollectionBeforeDeleteHook = async ({ collection, id, req }) => {
  const usages: string[] = [];

  for (const { config } of Object.values(req.payload.collections)) {
    if (config.slug.startsWith('payload-')) continue;

    const conditions = buildReferenceConditions(config.flattenedFields, collection.slug, id);
    if (!conditions.length) continue;

    const { totalDocs } = await req.payload.count({
      collection: config.slug,
      where: { or: conditions },
      req,
    });

    if (totalDocs > 0) usages.push(`${config.slug} (${totalDocs})`);
  }

  if (usages.length) {
    throw new APIError(
      `This document is used in: ${usages.join(', ')}. Remove it from there before deleting.`,
      409,
      null,
      true
    );
  }
};
