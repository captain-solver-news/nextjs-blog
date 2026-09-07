import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { Users } from '@/lib/payload/collections/users';
import { Authors } from '@/lib/payload/collections/authors';
import { Categories } from '@/lib/payload/collections/categories';
import { Posts } from '@/lib/payload/collections/posts';
import { StaticContents } from '@/lib/payload/collections/static-contents';
import { Configs } from '@/lib/payload/collections/configs';

// This directory (lib/payload); `projectRoot` is two levels up.
const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, '../..');

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      // Resolves custom admin components, and is the anchor `payload generate:importmap` writes
      // relative specifiers against — it tracks the project root, not this config's directory.
      baseDir: projectRoot,
    },
  },
  collections: [Posts, Categories, Authors, StaticContents, Configs, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'generated-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // Existing content rows are keyed by uuid; keep Payload generating the same id type.
    idType: 'uuid',
    // Migrations are the only source of DDL for this database. Dev-mode auto-push would
    // silently diff the config against live tables that hold real content, and it marks the
    // database as dev-pushed — which makes `payload migrate` stop and ask for confirmation.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    generateSchemaOutputFile: path.resolve(dirname, 'generated-schema.ts'),
  }),
});
