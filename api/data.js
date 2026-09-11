import { kv } from '@vercel/kv';

const KEYS = {
  schedule: 'mission-week-schedule',
  penalties: 'mission-week-penalties',
  bonuses: 'mission-week-bonuses',
  allowance: 'mission-week-allowance',
  leyna: 'mission-week-leyna',
  lea: 'mission-week-lea'
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    try {
      const keys = Object.keys(KEYS);
      const values = await Promise.all(keys.map(k => kv.get(KEYS[k])));
      const out = {};
      keys.forEach((k, i) => { out[k] = values[i] || null; });
      res.status(200).json(out);
    } catch (e) {
      res.status(500).json({ error: 'read failed' });
    }
    return;
  }
  if (req.method === 'POST') {
    const part = req.query.part;
    if (!KEYS[part]) { res.status(400).json({ error: 'invalid part' }); return; }
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
