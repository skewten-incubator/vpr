module.exports = (port) ->
    console.log "[socket] starting up"
    WebSocketServer = require 'ws'
        .Server
    GLOBAL.wss = new WebSocketServer
        port: port

    wss.broadcast = (data) ->
        for client in clients
            @clients[client]
                .send data

    wss.on 'connection', (ws) ->
        ws.on 'message', (msg, flags) ->
            parse_message msg, flags, ws

    console.log "[socket] listening on port #{port}"
    status.mod_ready "socket"

parse_message = (msg, flags, ws) ->
    return null if msg is "u"
