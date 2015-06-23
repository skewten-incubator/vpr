isPlaying = false;

$ ->
    attach_handers()
    attach_socket()
    load_player()
    setInterval update_metadata, 5000
    update_metadata()

attach_handers = ->
    player = $ "#main-audio"

    player.on "play", () ->
        toggle_play_icon true

    player.on "pause", () ->
        toggle_play_icon false

    player.on "error", () ->
        isPlaying = false
        toggle_play_icon false
        handle_player_error()

    player.on "playing", () ->
        isPlaying = true
        $ ".vpr-player .artist"
            .text "Loading info..."
        update_metadata()

    $ "#volume-control"
        .on "input", () ->
            player[0].volume = @.value/100

    $ ".vpr-player .play"
        .on "click", () ->
            toggle_play true

    $ ".vpr-player .pause"
        .on "click", () ->
            toggle_play false

    $ ".vpr-player .mute"
        .on "click", () ->
            toggle_mute true

    $ ".vpr-player .unmute"
        .on "click", () ->
            toggle_mute false

attach_socket = ->
    socket = new WebSocket "ws://#{window.location.host}/ws"

    socket.onopen = (evt) ->
        console.log "socket open"
        socket.send "hi"

    socket.onmessage = (evt) ->
        return socket.send "u" if evt.data == "u"
        console.log evt.data

    socket.onerror = (evt) ->
        console.log "an error occured"
        console.log evt

    socket.onclose = (evt) ->
        console.log "socket closed"

load_player = ->
    player = $("#main-audio")[0]
    player.volume = $("#volume-control").val() / 100
    toggle_play true

toggle_play_icon = (playing) ->
    if playing
        $ ".vpr-player .pause"
            .show()
        $ ".vpr-player .play"
            .hide()
    else
        $ ".vpr-player .pause"
            .hide()
        $ ".vpr-player .play"
            .show()

toggle_play = (play) ->
    if play
        $ ".vpr-player .error"
            .removeClass "error"
        $ ".vpr-player .title"
            .text ""
        $ ".vpr-player .artist"
            .text "Loading stream..."

        player.src = "http://radio.virtualplaza.tk/icecast/vpr-playlist?#{Date.now()}"
        player.play()
    else
        player.pause()

toggle_mute = (mute) ->
    if mute
        $ ".vpr-player .mute"
            .hide()
        $ ".vpr-player .unmute"
            .show()
    else
        $ ".vpr-player .mute"
            .show()
        $ ".vpr-player .unmute"
            .hide()
    player.muted = mute

update_metadata = ->
    return null if not isPlaying

    $ ".vpr-player .artist.error"
        .removeClass "error"
        .text "Loading info..."

    $.ajax
        type: "GET"
        url: "/_/info"
    .done (data) ->
        $ ".vpr-status .kbps"
            .text "#{data.mpd.bitrate}kbps"
        $ ".vpr-player .artist"
            .text data.song.artist
        $ ".vpr-player .title"
            .text data.song.title
    .fail (a, b, error) ->
        $ ".vpr-status .listeners, .vpr-status .kbps, .vpr-status .dj"
            .text "???"
        $ ".vpr-player .artist"
            .addClass "error"
            .text "Could not fetch info!"
        console.error error

handle_player_error = ->
    return null if player.src == window.location.href
    errors =
        1: "User aborted playback."
        2: "A network error occured."
        3: "Could not decode stream."
        4: "Could not connect to stream."
        5: "Unknown error."
    $ ".vpr-player .artist"
        .addClass "error"
        .text "An error occured!"
    $ ".vpr-player .title"
        .addClass "error"
        .text errors[player.error.code]