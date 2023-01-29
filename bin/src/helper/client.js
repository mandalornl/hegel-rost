import { createConnection } from 'net';

import { normalize } from '#src/helper/buffer';

const {
  hostname,
  port
} = new URL(process.env.DEVICE_URL || 'http://localhost:50001');

/**
 * Do request
 *
 * @param {...string} commands
 *
 * @returns {Promise<Object>}
 */
export const doRequest = async (...commands) => (
  new Promise((resolve, reject) => {
    const data = {};

    const client = createConnection({
      port,
      host: hostname,
      timeout: 3000
    }, () => {
      console.debug('Connected');

      const command = commands.shift();

      client.write(`${command}\r`);
    });

    client.on('data', (buffer) => {
      const [
        command,
        parameter
      ] = normalize(buffer)
        .replace('-', '')
        .split('.');

      data[command] = isNaN(Number(parameter)) ? parameter : Number(parameter);

      const next = commands.shift();

      if (next) {
        client.write(`${next}\r`);

        return;
      }

      client.end();
    });

    client.on('error', (error) => {
      console.error(error.message);

      reject({
        status: 500,
        message: 'Connection error'
      });
    });

    client.on('timeout', () => {
      console.debug('Timed out');

      reject({
        status: 408,
        message: 'Connection timeout'
      });
    });

    client.on('close', () => {
      console.debug('Closed');

      setTimeout(() => {
        resolve(data);
      }, 100);
    });
  })
);
