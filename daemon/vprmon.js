//実存的危機

var server = require("./lib/api");
var daemon = require("./lib/daemon");
var socket = require("./lib/socket");
var Status = require("./lib/status");

GLOBAL.step = require("step");
GLOBAL.util = require("util");
GLOBAL.status = new Status();

server(10420);
socket(10421);
daemon(6600, "localhost");
