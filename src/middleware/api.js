import { Router } from 'express';
import Bottleneck from 'bottleneck';

import client from '@/api/client';
import presets from '@/config/presets';

import { api } from '@/util/express-helper';

const router = new Router();
const limiter = new Bottleneck({
  maxConcurrent: 1
});

router.get('/status', api(async() =>
{
  return limiter.schedule(() => client.get([
    '-p.?',
    '-v.?',
    '-m.?',
    '-i.?',
    '-r.?'
  ]));
}));

router.get('/presets', (req, res) => res.json({ data: presets }));

router.get('/preset/:preset', api(async req =>
{
  if (!presets[req.params['preset']])
  {
    throw {
      status: 500,
      message: 'Invalid preset'
    };
  }

  return limiter.schedule(() =>
  {
    const codes = presets[req.params['preset']]['codes'];
    const data = [];

    Object.keys(codes).forEach(code =>
    {
      data.push(`-${code}.${codes[code]}`);
    });

    return client.get(data);
  });
}));

router.get('/code/:code/:value?', api(async req =>
{
  return limiter.schedule(() =>
  {
    const code = req.params['code'];
    const value = req.params['value'] || '?';

    return client.get([
      `-${code}.${value}`
    ]);
  });
}));

router.use((req, res) =>
{
  res.status(500).json({
    status: 500,
    message: 'Server error'
  });
});

export default router;
