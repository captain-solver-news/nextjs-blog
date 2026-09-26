import { revalidatePath } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload';

function revalidate(req: PayloadRequest): void {
  try {
    revalidatePath('/sitemap.xml');
  } catch (error) {
    req.payload.logger.warn(`Skipped sitemap.xml revalidation: ${error instanceof Error ? error.message : error}`);
  }
}

export const revalidateSitemapAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidate(req);

  return doc;
};

export const revalidateSitemapAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidate(req);

  return doc;
};
