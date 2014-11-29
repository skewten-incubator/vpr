Virtual Plaza Radio
===

a vaporwave radio project


* [structure](#structure)
* [our setup](#setup)
* [authors](#authors)
* [license](#license)
* [contributing](#contributing)

<a name='structure'></a>

structure
---

This repository is broken down into three folders:

* `icecast` - The Icecast XSL files and sample config
* `daemon` - Node.js app for monitoring the radio
* `web` - The static HTML files for the website
* `update-vpr-data` - A shell script that wget's the API's /_/icecheck route

<a name='setup'></a>

our setup
---

Our setup is as follows:

#####Web server

Icecast, running on port 420. See the (modified) config in `icecast/icecast.xml`

nginx, with the `web` folder files as root.
The `/icecast/` directory is a proxy to the Icecast web daemon.
The `/_/` directory is a proxy to the Node.js web daemon.

Node.js for the daemon, that monitors the radio and provides accurate
information about the current song, DJ, and whatnot.

mpd, that plays a shuffled playlist to the `/vpr-playlist` mountpoint.

ncmpcpp, to control mpd.

<a name='authors'></a>

made by Ivan K <ivan@ivan.moe>

favicon made by ??? (will have the name soon)


<a name='license'></a>

license
---

MIT

<a name='contributing'></a>

contributing
---

If you want to contribute to the repo, feel free to write up a cool new feature
and open up a pull request for it!