$(function(){
    $("#main-audio").on("play", function(){
        toggle_play_icon(true);
    });
    $("#main-audio").on("abort", function(){
        toggle_play_icon(false);
    });
    $(".vpr-player .play").on("click", function(){
        toggle_play(true);
    });
    $(".vpr-player .pause").on("click", function(){
        toggle_play(false);
    });
    $("#volume-control").on("input", function(){
        $("#main-audio")[0].volume = this.value/100;
    });
    $(".vpr-player .mute").on("click", function(){
        toggle_mute(true);
    });
    $(".vpr-player .unmute").on("click", function(){
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
        $(".vpr-player .mute").hide();
        $(".vpr-player .unmute").show();
    }
    else{
        $(".vpr-player .mute").show();
        $(".vpr-player .unmute").hide();
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