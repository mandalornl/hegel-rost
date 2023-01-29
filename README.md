# Hegel Röst

Web application to access IP-control features of the Hegel Röst.

## Installation

Clone the project or [download](https://github.com/mandalornl/hegel-rost/archive/master.zip) and extract the `zip` file.

```bash
$ git clone https://github.com/mandalornl/hegel-rost.git /opt/hegel-rost
```

## Usage

For development run:

```bash
$ DEVICE_URL=http://[HOSTNAME]:50001 bin/app.js
```

A "dummy" device can be started to mimic the Röst, so you can keep listening to your favorite music undisturbed. Just leave out the `DEVICE_URL` part when you start the app. 

```bash
$ bin/device.js
```

The device can also be accessed using:

```bash
$ telnet localhost 50001
```

To start the web app:

```bash
$ yarn dev
```

Defaults to `http://localhost:3000`.

## Presets

Presets can be defined to store your preferred settings i.e. for listening to music or watching movies. Just create a `presets.json` file and place it under the `bin/` folder.

**Example:**

```json
[
  {
    "label": "Music",
    "value": {
      "i": 4,
      "v": 50
    }
  }
]
```

Available `commands` are:

* `p` : `0` or `1` for `power`
* `i` : `1` - `9` for `input`
* `v` : `0` - `100` for `volume`
* `m` : `0` or `1` for `mute`
* `r` : `~`, `0` - `255` for `reset`

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
Environment="DEVICE_URL=http://localhost:50001"
ExecStart=/usr/bin/node /opt/hegel-rost/bin/app.js
KillMode=process
Restart=on-failure
WorkingDirectory=/opt/hegel-rost

[Install]
WantedBy=multi-user.target
```

Be sure to configure the `DEVICE_URL` environment variable used by your Hegel device.

```ini
Environment="DEVICE_HOST=http://192.168.178.86:50001"
```

After startup the app can be located at port `43931`, usually in the same local network as your Hegel device.

---

Enable at boot:

```bash
$ sudo systemctl enable hegel-rost
```

Start manually:

```bash
$ sudo systemctl start hegel-rost
```

Stop manually:

```bash
$ sudo systemctl stop hegel-rost
```

Restart manually:

```bash
$ sudo systemctl restart hegel-rost
```

## Disclaimer

This app is in no way affiliated with, authorized, maintained, sponsored or endorsed by Hegel Music Systems or any of its affiliates or subsidiaries.
