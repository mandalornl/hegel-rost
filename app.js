import 'dotenv/config';

const debug = require('debug')('hr:app');

import path from 'path';

import express, { json } from 'express';
import compression from 'compression';

import api from '@/middleware/api';

const app = express();
app.use(compression());
app.use('/api', json(), api);
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use((req, res) => res.status(500).send('500 - Server error'));

const port = process.env.PORT || 3000;

app.listen({
  host: '0.0.0.0',
  port: port
}, () => debug(`Listening on: ${port}`));
