module.exports = function(port){
    console.log("[socket] starting up");
    /////
    var WebSocketServer = require('ws').Server;
    GLOBAL.wss = new WebSocketServer({port: port});

    wss.broadcast = function(data){
        for(var i in this.clients)
            this.clients[i].send(data);
    };
    
    wss.on('connection', function(ws){
        ws.on('message', function(msg, flgs){
            parse_message(msg, flgs, ws);
        });
    });
    /////
    console.log("[socket] listening on port "+port);
    status.mod_ready("socket");
}

function parse_message(msg, flgs, ws){
    if (msg == "u")
        return;
}
