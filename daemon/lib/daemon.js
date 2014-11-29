var mpd;

module.exports = function(port, server){
    console.log("[daemon] starting up");
    /////
    var komponist = require('komponist')
    
    komponist.createConnection(port, server, handle_connect);
};

function handle_connect(err, client){
    if (err) throw err;
    mpd = client;
    
    attach_handlers();
        
    /////
    console.log("[daemon] ready");
    status.mod_ready("daemon");
};

function attach_handlers(){
    mpd.on('changed', function(sys){
        if (sys != "player"){
            return;
        }
        update_status();        
    });
}

GLOBAL.update_status = function(){
    step(
        function(){
            mpd.status(this);
        },
        function(e, s){
            if (e) throw e;
            var next = this;
            query_song(function(i){
                next(s, i);
            });
        },
        function(s, i){
            update_mpd_status(s);
            update_song_info(i); 
            wss.broadcast("u");
        }
    );
};

function query_song(cb){
    mpd.currentsong(function(e, i) {
        if (e) throw e;
        cb(i);
    });
}

function update_song_info(i){
    if (!status.mpd.playing){
        status.song = {};
        return;
    }
    status.song = {
        dl: "http://files.sq10.net/music/vaporwave/list/"+
            i.file,
        artist: i.Artist,
        title: i.Title,
        album: i.Album,
        date: i.Date,
        time: i.Time
    };
}

function update_mpd_status(s){    
    status.mpd = {
        playing: (s.state == "play")?true:false,
        bitrate: s.bitrate
    };
    if (status.mpd.playing)
        status.song.elapsed = s.time.split(":")[1];
}
