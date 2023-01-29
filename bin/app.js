#!/usr/bin/env node

import {
  URL,
  fileURLToPath
} from 'url';
import express, { json, Router } from 'express';
import expressThrottle from 'express-throttle';
import cors from 'cors';

import { doRequest } from '#src/helper/client';
import { handleRequest } from '#src/helper/express';
import { loadPresets } from '#src/helper/preset';

const dist = fileURLToPath(new URL('./public', import.meta.url));
const presets = await loadPresets();

const api = new Router();
api.use(expressThrottle({
  burst: 2,
  rate: '1/100ms'
}));
api.get('/status', handleRequest(() => (
  doRequest(
    '-p.?',
    '-v.?',
    '-m.?',
    '-i.?',
    '-r.?'
  )
)));
api.get('/presets', (req, res) => (
  res.json(presets)
));
api.get('/preset/:index', handleRequest((req) => {
  if (!presets[req.params.index]?.value) {
    throw {
      status: 412,
      message: 'Invalid preset'
    };
  }

  const commands = Object.entries(presets[req.params.index].value).reduce((result, [
    command,
    parameter
  ]) => ([
    ...result,
    `-${command}.${parameter}`
  ]), []);

  return doRequest(...commands);
}));
api.get('/command/:command/:parameter?', handleRequest((req) => {
  const {
    command,
    parameter = '?'
  } = req.params;

  return doRequest(`-${command}.${parameter}`);
}));

const app = express();
app.use(cors({ origin: '*' }));
app.use('/api', json(), api);
app.use(express.static(dist));
app.use((req, res) => {
  res.status(500).send('500 - Server error');
});

const port = process.env.PORT || 43931;

app.listen({
  port,
  host: '0.0.0.0'
}, () => {
  console.debug(`Listening on ${port}`);
});
