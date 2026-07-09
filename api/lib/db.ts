import { createRequire } from 'module';
import { neon } from '@neondatabase/serverless';
import type { DbEntryInput } from './types';

const require = createRequire(import.meta.url);
const seedData = require('../../data/seed-entries.json') as DbEntryInput[];

export type { DbEntry, DbEntryInput } from './types';

let schemaReady: Promise<void> | null = null;

function getSql() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('POSTGRES_URL is not configured');
  }
  return neon(url);
}

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();

      await sql`
        CREATE TABLE IF NOT EXISTS entries (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          abstract TEXT NOT NULL,
          category TEXT NOT NULL,
          year INTEGER NOT NULL,
          author TEXT NOT NULL,
          source TEXT NOT NULL,
          type TEXT NOT NULL,
          url TEXT NOT NULL DEFAULT '#',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      const rows = (await sql`
        SELECT COUNT(*)::text AS count FROM entries
      `) as Array<{ count: string }>;

      if (Number(rows[0]?.count ?? 0) === 0) {
        for (const entry of seedData) {
          await sql`
            INSERT INTO entries (title, abstract, category, year, author, source, type, url)
            VALUES (
              ${entry.title},
              ${entry.abstract},
              ${entry.category},
              ${entry.year},
              ${entry.author},
              ${entry.source},
              ${entry.type},
              ${entry.url || '#'}
            )
          `;
        }
      }
    })();
  }

  await schemaReady;
}

export async function listEntries() {
  await ensureSchema();
  const sql = getSql();
  return sql`
    SELECT id, title, abstract, category, year, author, source, type, url
    FROM entries
    ORDER BY year DESC, id DESC
  `;
}

export async function createEntry(input: DbEntryInput) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO entries (title, abstract, category, year, author, source, type, url)
    VALUES (
      ${input.title},
      ${input.abstract},
      ${input.category},
      ${input.year},
      ${input.author},
      ${input.source},
      ${input.type},
      ${input.url || '#'}
    )
    RETURNING id, title, abstract, category, year, author, source, type, url
  `;
  return rows[0];
}

export async function updateEntry(id: number, input: DbEntryInput) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE entries
    SET
      title = ${input.title},
      abstract = ${input.abstract},
      category = ${input.category},
      year = ${input.year},
      author = ${input.author},
      source = ${input.source},
      type = ${input.type},
      url = ${input.url || '#'}
    WHERE id = ${id}
    RETURNING id, title, abstract, category, year, author, source, type, url
  `;
  return rows[0] ?? null;
}

export async function deleteEntry(id: number) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM entries WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}
