$(function(){
    $("#main-audio").on("play", function(){
        toggle_play_icon(true);
    });
    $("#main-audio").on("abort", function(){
        toggle_play_icon(false);
    });
    $("#player .controls .play").on("click", function(){
        toggle_play(true);
    });
    $("#player .controls .pause").on("click", function(){
        toggle_play(false);
    });
    $("#volume-control").on("input", function(){
        $("#main-audio")[0].volume = this.value/100;
    });
    $("#player .controls .mute").on("click", function(){
        toggle_mute(true);
    });
    $("#player .controls .unmute").on("click", function(){
        toggle_mute(false);
    });
    setInterval(updateMetadata, 5000);
    updateMetadata();
    loadPlayer();
});

function loadPlayer(){
    $("#main-audio")[0].volume = $("#volume-control").val()/100;
    $("#main-audio")[0].play();
}

function toggle_play_icon(playing){
    if (playing){
        $("#player .controls .pause").show();
        $("#player .controls .play").hide();
    }
    else{
        $("#player .controls .pause").hide();
        $("#player .controls .play").show();
    }
}

function toggle_play(play){
    if (play){
        $("#main-audio")[0].src = "/icecast/vaporwave-main?"+Date.now();
        $("#main-audio")[0].play();
    }
    else{
        $("#main-audio")[0].pause();
        $("#main-audio")[0].src = "";
    }
}

function toggle_mute(mute){
    if (mute){
        $("#player .controls .mute").hide();
        $("#player .controls .unmute").show();
    }
    else{
        $("#player .controls .mute").show();
        $("#player .controls .unmute").hide();
    }
    $("#main-audio")[0].muted = mute;
}

function updateMetadata(){
    $.get("/icecast/status-json.xsl", function(data){
        var song = data.icestats.source.title.split(" - ");
        $("#player .artist").text(song.shift());
        $("#player .title").text(song.join(" - "));
    });
}