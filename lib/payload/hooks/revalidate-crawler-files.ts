import { revalidatePath } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload';

const CRAWLER_FILE_PATHS = ['/sitemap.xml', '/llms.txt', '/llms-full.txt'] as const;

function revalidate(req: PayloadRequest): void {
  for (const path of CRAWLER_FILE_PATHS) {
    try {
      revalidatePath(path);
    } catch (error) {
      req.payload.logger.warn(`Skipped ${path} revalidation: ${error instanceof Error ? error.message : error}`);
    }
  }
}

export const revalidateCrawlerFilesAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidate(req);

  return doc;
};

export const revalidateCrawlerFilesAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidate(req);

  return doc;
};
