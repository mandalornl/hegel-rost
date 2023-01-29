#!/usr/bin/env node

import { createServer } from 'net';

import { device } from '#src/helper/device';
import { normalize } from '#src/helper/buffer';

const sockets = [];

const server = createServer((socket) => {
  console.debug(`${socket.remotePort} connected`);

  sockets.push(socket);

  socket.on('data', (buffer) => {
    const value = normalize(buffer);

    const [
      command,
      parameter
    ] = value.split('.');

    if (/^-[vir]\.\d+$/.test(value)) {
      const fn = {
        '-v': device.volume.set,
        '-i': device.input.set,
        '-r': device.reset.set
      };

      if (fn[command]) {
        return socket.write(`${command}.${fn[command](parameter)}\r`);
      }
    } else {
      const fn = {
        '-p.1': device.power.on,
        '-p.0': device.power.off,
        '-p.t': device.power.toggle,
        '-p.?': device.power.status,
        '-v.u': device.volume.up,
        '-v.d': device.volume.down,
        '-v.?': device.volume.status,
        '-m.1': device.mute.on,
        '-m.0': device.mute.off,
        '-m.t': device.mute.toggle,
        '-m.?': device.mute.status,
        '-i.?': device.input.status,
        '-r.~': device.reset.stop,
        '-r.?': device.reset.status
      };

      if (fn[value]) {
        return socket.write(`${command}.${fn[value]()}\r`);
      }
    }

    socket.write('-e.1\r');
  });

  socket.on('error', (error) => {
    console.error(error.message);
  });

  socket.on('end', () => {
    console.debug(`${socket.remotePort} disconnected`);

    sockets.splice(sockets.indexOf(socket), 1);
  });
});

// Mimic max connections behavior of the Röst.
server.maxConnections = 1;

server.listen({
  host: 'localhost',
  port: 50001
}, () => {
  console.info('Listening on 50001');
});
