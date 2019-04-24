import 'dotenv/config';

const debug = require('debug')('hr:api');

import express, {json} from 'express';
import compression from 'compression';
import cors from 'cors';

import api from '@/middleware/api';

const app = express();
app.use(compression());
app.use(cors());
app.use('/api', json(), api);
app.use((req, res) => res.status(500).send('500 - Server error'));

const port = process.env.API_PORT || 3030;

app.listen({
	host: '0.0.0.0',
	port: port
}, () => debug(`Listening on: ${port}`));
