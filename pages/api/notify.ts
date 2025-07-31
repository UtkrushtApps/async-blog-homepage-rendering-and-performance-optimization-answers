// pages/api/notify.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean } | { error: string }>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  // Simulate slow push notification
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Could log event here
  res.status(200).json({ ok: true });
}
