import type { CollectionBeforeChangeHook } from 'payload';

type MediaReference =
  | null
  | number
  | string
  | undefined
  | {
      id?: number | string;
      url?: null | string;
      value?: number | string;
    };

async function resolveMediaURL(value: MediaReference, req: Parameters<CollectionBeforeChangeHook>[0]['req']) {
  if (value === null) return null;

  if (typeof value === 'object' && typeof value.url === 'string') {
    return value.url;
  }

  const id = typeof value === 'object' ? (value.id ?? value.value) : value;
  if (id === undefined) return null;

  const media = await req.payload.findByID({
    collection: 'media',
    id,
    depth: 0,
    req,
  });

  return media.url ?? null;
}

export const syncMediaURLs = (fields: Record<string, string>): CollectionBeforeChangeHook => {
  return async ({ data, originalDoc, req }) => {
    if (!data) return data;

    await Promise.all(
      Object.entries(fields).map(async ([uploadField, urlField]) => {
        if (!Object.prototype.hasOwnProperty.call(data, uploadField)) return;

        const mediaReference = data[uploadField] as MediaReference;

        // An existing document can have only a legacy URL. Saving another field
        // must not erase that URL merely because the new upload field is empty.
        if (mediaReference == null && !originalDoc?.[uploadField]) return;

        data[urlField] = await resolveMediaURL(mediaReference, req);
      })
    );

    return data;
  };
};
