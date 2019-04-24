import 'dotenv/config';

const debug = require('debug')('hr:client');

import net from 'net';
import url from 'url';

import normalize from '@/util/normalize';

const deviceUrl = url.parse(process.env.DEVICE_URL);

/**
 * Get
 *
 * @param {String[]|String} data
 *
 * @returns {Promise<Object>}
 */
const get = data => new Promise((resolve, reject) =>
{
	const queue = Array.isArray(data) ? data : [data];

	const result = {};

	const client = net.createConnection({
		host: deviceUrl.hostname,
		port: deviceUrl.port,
		timeout: 3000
	}, () =>
	{
	  debug('Connection start');

	  const code = queue.shift();

		client.write(code);

		debug(`Request '${code}'`);
	});

	client.on('data', buffer =>
	{
		// normalize data
		const data = normalize(buffer);

		if (!/^-\w\.(\d+|~)$/.test(data))
		{
			return reject({
				status: 500,
				message: 'Invalid response',
				data: data
			});
		}

		debug(`Response '${data}'`);

		const type = data.replace(/[^a-z]+/g, '');
		const value = data.split('.').pop();

		result[type] = Number(value) != value ? value : Number(value);

		const code = queue.shift();

		if (code)
		{
			client.write(code);

			debug(`Request '${code}'`);

			return;
		}

		client.end();

		resolve({ data: result });
	});

	client.on('timeout', () =>
	{
		debug('Connection timeout');

		client.end();

		reject({
			status: 408,
			message: 'Connection timeout'
		});
	});

	client.on('error', error =>
	{
		console.error(error.toString());

		client.end();

		reject({
			status: 500,
			message: 'Connection error'
		});
	});

	client.on('end', () => debug('Connection end'));
});

export default { get };
