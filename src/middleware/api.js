import { Router } from 'express';

import client from '@/api/client';
import presets from '@/config/presets';

import { api } from '@/util/express-helper';

const router = new Router();

router.get('/status', api(async () => {
  return client.get([
    '-p.?',
    '-v.?',
    '-m.?',
    '-i.?',
    '-r.?'
  ]);
}));

router.get('/presets', (req, res) => res.json({ data: presets }));

router.get('/preset/:preset', api(async req => {
  if (!presets[req.params['preset']]) {
    throw {
      status: 500,
      message: 'Invalid preset'
    };
  }

  const codes = presets[req.params['preset']]['codes'];
  const data = [];

  Object.keys(codes).forEach(code => {
    data.push(`-${code}.${codes[code]}`);
  });

  return client.get(data);
}));

router.get('/code/:code/:value?', api(async req => {
  const code = req.params['code'];
  const value = req.params['value'] || '?';

  return client.get(`-${code}.${value}`);
}));

router.use((req, res) => {
  res.status(500).json({
    status: 500,
    message: 'Server error'
  });
});

export default router;
