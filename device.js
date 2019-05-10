import 'dotenv/config';

const debug = require('debug')('hr:device');

import net from 'net';
import url from 'url';

import device from '@/api/device';
import normalize from '@/util/normalize';

const sockets = [];

const server = net.createServer(socket => {
  debug(`${socket.remotePort} connected`);

  sockets.push(socket);

  socket.on('data', buffer => {
    const data = normalize(buffer);

    debug(`Data: ${data}`);

    switch (data)
    {
      case '-p.1':
        device.volume.set(20);
        device.input.set(4);
        device.mute.off();
        device.reset.set(2);

        return socket.write(`-p.${device.power.on()}\r`);

      case '-p.0':
        return socket.write(`-p.${device.power.off()}\r`);

      case '-p.t': {
        const value = device.power.toggle();

        if (value)
        {
          device.volume.set(20);
          device.input.set(4);
          device.mute.off();
          device.reset.set(2);
        }

        return socket.write(`-p.${value}\r`);
      }

      case '-p.?':
        return socket.write(`-p.${device.power.status()}\r`);

      case '-v.u':
        device.mute.off();
        return socket.write(`-v.${device.volume.up()}\r`);

      case '-v.d':
        device.mute.off();
        return socket.write(`-v.${device.volume.down()}\r`);

      case '-v.?':
        return socket.write(`-v.${device.volume.status()}\r`);

      case '-m.1':
        return socket.write(`-m.${device.mute.on()}\r`);

      case '-m.0':
        return socket.write(`-m.${device.mute.off()}\r`);

      case '-m.t':
        return socket.write(`-m.${device.mute.toggle()}\r`);

      case '-m.?':
        return socket.write(`-m.${device.mute.status()}\r`);

      case '-i.?':
        return socket.write(`-i.${device.input.status()}\r`);

      case '-r.~':
        return socket.write(`-r.${device.reset.stop()}\r`);

      case '-r.?':
        return socket.write(`-r.${device.reset.status()}\r`);
    }

    switch (true) {
      case /^-v\.\d+$/.test(data):
        device.mute.off();
        return socket.write(`-v.${device.volume.set(data.replace(/[^\d]+/, ''))}\r`);

      case /^-i\.\d+$/.test(data):
        return socket.write(`-i.${device.input.set(data.replace(/[^\d]+/, ''))}\r`);

      case /^-r\.\d+$/.test(data):
        return socket.write(`-r.${device.reset.set(data.replace(/[^\d]+/, ''))}\r`);
    }

    socket.write('-e.1\r');
  });

  socket.on('error', error => {
    console.error(error.toString());
  });

  socket.on('end', () => {
    debug(`${socket.remotePort} disconnected`);

    sockets.splice(sockets.indexOf(socket), 1);
  });
});

// mimic max connections behavior of the Röst
server.maxConnections = 1;

const deviceUrl = url.parse(process.env.DEVICE_URL);

server.listen({
  host: deviceUrl.hostname,
  port: deviceUrl.port
}, () => debug(`Listening on: ${deviceUrl.port}`));
