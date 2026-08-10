import { db } from '../client';
import { authors, type Author } from '../schema/authors';

export default async function getAuthors(): Promise<Author[]> {
  return db.select().from(authors);
}
