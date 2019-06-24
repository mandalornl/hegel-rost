# Hegel Röst

Web application to access IP-control features of the Hegel Röst.

## Installation

Clone the project or [download](https://github.com/mandalornl/hegel-rost/archive/master.zip) and extract the `zip` file.

```bash
$ git clone https://github.com/mandalornl/hegel-rost.git /opt/hegel-rost
$ cd /opt/hegel-rost
$ yarn install
```

## Configuration

Be sure to configure the `DEVICE_URL` used by your Hegel device, in the `.env` file.

```dotenv
DEVICE_URL=<protocol>://<host>:<port>
``` 

**Example:**

```dotenv
DEVICE_URL=http://192.168.178.86:50001
```

## Usage

Build the app with:

```bash
$ yarn build
```

Start the app with:

```bash
$ yarn start
```

For development run:

```bash
$ yarn dev:api
$ yarn dev:app
```

A 'dummy' device can be started to mimic the Röst, so you can keep listening to your favorite music undisturbed. **Note** Be sure to change the `DEVICE_URL` to `http://localhost:50001` in the `.env` file. 

```bash
$ yarn dev:device
```

The device can also be accessed using:

```bash
$ telnet localhost 50001
```

## Presets

Presets can be defined to store your preferred settings i.e. for listening to music or watching movies. Just create a `presets.json` file and place it under the `config/` folder.

**Example:**

```json
[{
  "label": "Music",
  "codes": {
    "i": 4,
    "v": 50
  }
}]
```

Available control `codes` are:

* `p` : `1` or `0` for `power`
* `i` : `1` - `9` for `input`
* `v` : `0` - `100` for `volume`
* `m` : `1` or `0` for `mute`
* `r` : `~`, `1` - `255` for `reset`

## Unix - Daemon

Create a file `/etc/systemd/system/hegel-rost.service` with the following content:

```ini
[Unit]
Description=Hegel Rost Daemon
After=network.target

[Service]
#User=<user>
#Group=<group>
Type=simple
ExecStart=/usr/bin/node /opt/hegel-rost/node_modules/.bin/babel-node /opt/hegel-rost/app.js
KillMode=process
Restart=on-failure
WorkingDirectory=/opt/hegel-rost

[Install]
WantedBy=multi-user.target
```

Enable at boot with:

```bash
$ sudo systemctl enable hegel-rost
```

Start manually with:

```bash
$ sudo systemctl start hegel-rost
```

Stop manually with:

```bash
$ sudo systemctl stop hegel-rost
```

## Disclaimer

This app is in no way affiliated with, authorized, maintained, sponsored or endorsed by Hegel Music Systems or any of its affiliates or subsidiaries.
