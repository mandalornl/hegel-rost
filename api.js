import 'dotenv/config';

const debug = require('debug')('hr:api');

import express, { json } from 'express';
import compression from 'compression';

import api from '@/middleware/api';

const app = express();
app.use(compression());
app.use('/api', json(), api);
app.use((req, res) => res.status(500).send('500 - Server error'));

const port = Number(process.env.PORT || 3000) + 1;

app.listen({
  host: 'localhost',
  port: port
}, () => debug(`Listening on: ${port}`));
