import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!redis) {
    return res.status(503).json({
      error: 'Storage not configured',
      fallback: 'Use localStorage on the client',
    });
  }

  try {
    const [good, neutral, bad] = await Promise.all([
      redis.get('feedback:good').then((v) => Number(v) || 0),
      redis.get('feedback:neutral').then((v) => Number(v) || 0),
      redis.get('feedback:bad').then((v) => Number(v) || 0),
    ]);
    const total = good + neutral + bad;
    return res.status(200).json({ good, neutral, bad, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load stats' });
  }
}
