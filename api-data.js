import { kv } from '@vercel/kv';

const KEYS = {
  shared: 'mission-week-shared',
  leyna: 'mission-week-leyna',
  lea: 'mission-week-lea'
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [shared, leyna, lea] = await Promise.all([
        kv.get(KEYS.shared),
        kv.get(KEYS.leyna),
        kv.get(KEYS.lea)
      ]);
      res.status(200).json({ shared: shared || null, leyna: leyna || null, lea: lea || null });
    } catch (e) {
      res.status(500).json({ error: 'read failed' });
    }
    return;
  }
  if (req.method === 'POST') {
    const part = req.query.part;
    if (!KEYS[part]) { res.status(400).json({ error: 'invalid part, must be shared, leyna, or lea' }); return; }
    try {
      await kv.set(KEYS[part], req.body);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'write failed' });
    }
    return;
  }
  res.status(405).json({ error: 'method not allowed' });
}
