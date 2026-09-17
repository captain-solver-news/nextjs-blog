import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';
import {
  convertLexicalToMarkdown,
  convertMarkdownToLexical,
  editorConfigFactory,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical';

const TARGETS = [
  { table: 'posts', column: 'body' },
  { table: 'static_contents', column: 'body' },
  { table: 'authors', column: 'bio' },
] as const;

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const editorConfig = await editorConfigFactory.default({ config: payload.config });

  for (const { table, column } of TARGETS) {
    const tableRef = sql.raw(`"${table}"`);
    const columnRef = sql.raw(`"${column}"`);
    const tempRef = sql.raw(`"${column}_lexical"`);

    await db.execute(sql`ALTER TABLE ${tableRef} ADD COLUMN ${tempRef} jsonb`);

    const { rows } = await db.execute<{ id: string; value: null | string }>(
      sql`SELECT "id" AS id, ${columnRef} AS value FROM ${tableRef}`
    );

    for (const row of rows) {
      const state = convertMarkdownToLexical({ editorConfig, markdown: row.value ?? '' });

      await db.execute(sql`UPDATE ${tableRef} SET ${tempRef} = ${JSON.stringify(state)}::jsonb WHERE "id" = ${row.id}`);
    }

    await db.execute(sql`ALTER TABLE ${tableRef} DROP COLUMN ${columnRef}`);
    await db.execute(sql`ALTER TABLE ${tableRef} RENAME COLUMN ${tempRef} TO ${columnRef}`);
    await db.execute(sql`ALTER TABLE ${tableRef} ALTER COLUMN ${columnRef} SET NOT NULL`);
  }
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  const editorConfig = await editorConfigFactory.default({ config: payload.config });

  for (const { table, column } of TARGETS) {
    const tableRef = sql.raw(`"${table}"`);
    const columnRef = sql.raw(`"${column}"`);
    const tempRef = sql.raw(`"${column}_markdown"`);

    await db.execute(sql`ALTER TABLE ${tableRef} ADD COLUMN ${tempRef} varchar`);

    const { rows } = await db.execute<{ id: string; value: null | DefaultTypedEditorState }>(
      sql`SELECT "id" AS id, ${columnRef} AS value FROM ${tableRef}`
    );

    for (const row of rows) {
      const markdown = row.value ? convertLexicalToMarkdown({ data: row.value, editorConfig }) : '';

      await db.execute(sql`UPDATE ${tableRef} SET ${tempRef} = ${markdown} WHERE "id" = ${row.id}`);
    }

    await db.execute(sql`ALTER TABLE ${tableRef} DROP COLUMN ${columnRef}`);
    await db.execute(sql`ALTER TABLE ${tableRef} RENAME COLUMN ${tempRef} TO ${columnRef}`);
    await db.execute(sql`ALTER TABLE ${tableRef} ALTER COLUMN ${columnRef} SET NOT NULL`);
  }
}
