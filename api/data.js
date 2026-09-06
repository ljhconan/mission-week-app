import { kv } from '@vercel/kv';

const KEY = 'mission-week-data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await kv.get(KEY);
      res.status(200).json({ data: data || null });
    } catch (e) {
      res.status(500).json({ error: 'read failed' });
    }
    return;
  }
  if (req.method === 'POST') {
    try {
      await kv.set(KEY, req.body);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'write failed' });
    }
    return;
  }
  res.status(405).json({ error: 'method not allowed' });
}
