import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminToken, verifyPassword } from '../lib/auth';
import { parseJsonBody } from '../lib/body';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD is not configured on the server' });
  }

  try {
    const { password } = parseJsonBody<{ password?: string }>(req);
    if (!password || !verifyPassword(password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = createAdminToken();
    return res.status(200).json({ token });
  } catch (error) {
    console.error('auth login error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
