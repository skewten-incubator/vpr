var player,
    socket,
    isPlaying = false;

$(function(){
    attach_handlers();
    attach_socket();    
    load_player();
    setInterval(update_metadata, 5000);
    update_metadata();
});

function attach_handlers(){
    var player = $("#main-audio");

    player.on("play", function(){
        toggle_play_icon(true);
    });
    player.on("pause", function(){
        toggle_play_icon(false);
    });
    player.on("error", function(){
        isPlaying = false;
        toggle_play_icon(false);
        handle_player_error();
    });
    player.on("playing", function(){
        isPlaying = true;
        $(".vpr-player .artist").text("Loading info...");
        update_metadata();
    });

    $("#volume-control").on("input", function(){
        player[0].volume = this.value/100;
    });

    $(".vpr-player .play").on("click", function(){
        toggle_play(true);
    });
    $(".vpr-player .pause").on("click", function(){
        toggle_play(false);
    });
    $(".vpr-player .mute").on("click", function(){
        toggle_mute(true);
    });
    $(".vpr-player .unmute").on("click", function(){
        toggle_mute(false);
    });
}

function attach_socket(){
    socket = new WebSocket("ws://"+window.location.host+"/ws");
    socket.onopen = function(evt){
        console.log("socket open");
        ws.send("hi");
    };
    socket.onmessage = function(evt){
        console.log(evt.data);
    };
    socket.onerror = function(evt){
        console.log("an error occured");
        console.log(evt);
    };
    socket.onclose = function(evt){
        console.log("socket closed");
    };
}

function load_player(){
    player = $("#main-audio")[0];
    player.volume = $("#volume-control").val()/100;
    toggle_play(true);
}

function toggle_play_icon(playing){
    if (playing){
        $(".vpr-player .pause").show();
        $(".vpr-player .play").hide();
    }
    else{
        $(".vpr-player .pause").hide();
        $(".vpr-player .play").show();
    }
}

function toggle_play(play){
    if (play){
        $(".vpr-player .error").removeClass("error");
        $(".vpr-player .title").text("");
        $(".vpr-player .artist").text("Loading stream...");
        player.src = "http://radio.virtualplaza.tk/icecast/vpr-playlist?"+Date.now();
        player.play();
    }
    else{
        player.pause();
    }
}

function toggle_mute(mute){
    if (mute){
        $(".vpr-player .mute").hide();
        $(".vpr-player .unmute").show();
    }
    else{
        $(".vpr-player .mute").show();
        $(".vpr-player .unmute").hide();
    }
    player.muted = mute;
}

function update_metadata(){
    if (!isPlaying){
        return;
    }
    $(".vpr-player .artist.error").removeClass("error").text("Loading info...");
    $.ajax({
        type: "GET",
        url: "/_/info"
    }).done(function(data){
        $(".vpr-status .kbps").text(data.mpd.bitrate+"kbps");
        
        $(".vpr-player .artist").text(data.song.artist);
        $(".vpr-player .title").text(data.song.title);
    }).fail(function(a, b, error){
        $(
            ".vpr-status .listeners,"+
            ".vpr-status .kbps,"+
            ".vpr-status .dj"
        ).text("???");
        $(".vpr-player .artist").addClass("error").text("Could not fetch info!");
        console.error(error);
    });
}

function handle_player_error(){
    if (player.src == window.location.href){
        return;
    }
    var errors = {
        1: "User aborted playback.",
        2: "A network error occured.",
        3: "Could not decode stream.",
        4: "Could not connect to stream.",
        5: "Unknown error."
    };
    $(".vpr-player .artist").addClass("error").text("An error occured!");
    $(".vpr-player .title").addClass("error").text(errors[player.error.code]);
}