import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from './lib/auth';
import { parseJsonBody } from './lib/body';
import {
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry,
  type DbEntryInput,
} from './lib/db';

function parseId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseEntryBody(req: VercelRequest): DbEntryInput | null {
  const body = parseJsonBody<Partial<DbEntryInput>>(req);
  if (!body.title || !body.abstract || !body.category || !body.author || !body.source || !body.type) {
    return null;
  }

  return {
    title: String(body.title).trim(),
    abstract: String(body.abstract).trim(),
    category: String(body.category).trim(),
    year: Number(body.year),
    author: String(body.author).trim(),
    source: String(body.source).trim(),
    type: String(body.type).trim(),
    url: String(body.url ?? '#').trim() || '#',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const entries = await listEntries();
      return res.status(200).json(entries);
    }

    if (!requireAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const input = parseEntryBody(req);
      if (!input || !Number.isInteger(input.year)) {
        return res.status(400).json({ error: 'Invalid entry payload' });
      }

      const entry = await createEntry(input);
      return res.status(201).json(entry);
    }

    if (req.method === 'PUT') {
      const id = parseId(req.query.id);
      const input = parseEntryBody(req);
      if (!id || !input || !Number.isInteger(input.year)) {
        return res.status(400).json({ error: 'Invalid entry payload' });
      }

      const entry = await updateEntry(id, input);
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      return res.status(200).json(entry);
    }

    if (req.method === 'DELETE') {
      const id = parseId(req.query.id);
      if (!id) {
        return res.status(400).json({ error: 'Invalid entry id' });
      }

      const deleted = await deleteEntry(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('entries api error', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
