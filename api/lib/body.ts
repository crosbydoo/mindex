import type { VercelRequest } from '@vercel/node';

export function parseJsonBody<T extends Record<string, unknown>>(req: VercelRequest): T {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body as T;
  }

  if (typeof req.body === 'string' && req.body.length > 0) {
    return JSON.parse(req.body) as T;
  }

  return {} as T;
}
