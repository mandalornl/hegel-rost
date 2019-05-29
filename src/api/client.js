import 'dotenv/config';

const debug = require('debug')('hr:client');

import net from 'net';
import url from 'url';

import normalize from '@/util/normalize';

const deviceUrl = url.parse(process.env.DEVICE_URL);

let client;

/**
 * Get
 *
 * @param {String[]|String} data
 *
 * @returns {Promise<Object>}
 */
const get = data => new Promise((resolve, reject) => {
  const queue = Array.isArray(data) ? data : [data];

  const result = {};

  const handle = buffer => {
    const data = normalize(buffer);

    debug(`Data: ${data}`);

    if (!/^-\w\.(\d+|~)$/.test(data)) {
      return reject({
        status: 500,
        message: 'Invalid response',
        data: data
      });
    }

    const type = data.replace(/[^a-z]+/g, '');
    const value = data.split('.').pop();

    result[type] = Number(value) != value ? value : Number(value);

    const code = queue.shift();

    if (code) {
      client.once('data', handle);

      client.write(`${code}\r`);

      return;
    }

    resolve({ data: result });
  };

  const process = () => {
    client.once('data', handle);

    const code = queue.shift();

    client.write(`${code}\r`);
  };

  if (!client) {
    client = net.createConnection({
      host: deviceUrl.hostname,
      port: deviceUrl.port,
      timeout: 3000
    }, () => {
      client.setNoDelay(true);

      process();
    });

    client.on('connect', () => {
      debug('Connection start');
    });

    client.on('timeout', () => {
      debug('Connection timeout');

      client.end();

      reject({
        status: 408,
        message: 'Connection timeout'
      });
    });

    client.on('error', error => {
      console.error(error.toString());

      reject({
        status: 500,
        message: 'Connection error'
      });
    });

    client.on('close', () => {
      debug('Connection close');

      client.removeAllListeners();
      client = null;
    });

    return;
  }

  process();
});

export default { get };
