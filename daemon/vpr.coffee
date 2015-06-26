console.log "cwd -> "+process.cwd()

server = require "./lib/api"
daemon = require "./lib/daemon"
socket = require "./lib/socket"
Status = require "./lib/status"

GLOBAL.async = require "async"
GLOBAL.util = require "util"
GLOBAL.status = new Status()

server 10420
socket 10421
daemon 6600, "localhost"
