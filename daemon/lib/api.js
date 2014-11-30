module.exports = function(port){
    console.log("[web] starting up");
    /////
    var express = require('express'),
        bodyParser = require('body-parser');
        
    var app = express(),
        router = express.Router();
        
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    
    var routes = [
        "/ping",
        "/info",
        "/icecheck"
    ];
    
    for (var i=0;i<routes.length;i++){
        router.get(routes[i], handlers[routes[i]]);
    }

    router.post("/auth", authenticate_streamer);
    
    app.use('/_/', router);
    app.listen(port);
    /////
    console.log('[web] listening on port '+port);
    status.mod_ready("web");
};

function test_ready(res){
    if (!status.ready){
        res.json({
            status: "not_ready"
        });
        return false;
    }
    return true;
};

/////

var handlers = {};
handlers["/ping"] = function(req, res){
    res.json({  
        status: "ok"
    });
};

handlers["/info"] = function(req, res){
    if (!test_ready(res)) return;
    res.json({
        status: "ok",
        song: status.song,
        mpd: status.mpd,
        dj: status.dj
    });
};

handlers["/icecheck"] = function(req, res){
    res.send("ok");
    setTimeout(update_icecast_data, 1000);
};

function update_icecast_data(){
    var request = require("request");
    request('http://localhost:420/status-json.xsl', function(error, response, body){
        if (error) console.log("[icecast] "+error);
        if (!error && response.statusCode == 200) {
            try{
                console.log(util.inspect(JSON.parse(body)));
            }catch(e){}
        }
    });
}

function authenticate_streamer(req, res){
    console.log("authentication request");
    console.log(req.body);
    res.set("icecast-auth-user", 1);
    res.send("ok");
}