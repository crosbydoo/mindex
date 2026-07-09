import { createHmac, timingSafeEqual } from 'crypto';
import type { VercelRequest } from '@vercel/node';

const SESSION_LABEL = 'mindex-admin-session';

export function createAdminToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }

  return createHmac('sha256', secret).update(SESSION_LABEL).digest('hex');
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }

  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_PASSWORD) {
    return false;
  }

  try {
    const expected = createAdminToken();
    const a = Buffer.from(token, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getBearerToken(req: VercelRequest): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return undefined;
  }
  return header.slice(7);
}

export function requireAdmin(req: VercelRequest): boolean {
  return verifyAdminToken(getBearerToken(req));
}
