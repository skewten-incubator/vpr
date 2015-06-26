mpd = null

module.exports = (port, server) ->
    console.log "[daemon] starting up"
    komponist = require "komponist"
    komponist.createConnection port, server, handle_connect

handle_connect = (err, client) ->
    throw err if err
    mpd = client
    attach_handlers()
    console.log "[daemon] ready"
    status.mod_ready "daemon"

attach_handlers = ->
    mpd.on "changed", (sys) ->
        return null if sys is not "player"
        update_status()

GLOBAL.update_status = ->
    async.waterfall [
        (next) ->
            mpd.status next
        (status, next) ->
            query_song (song) ->
                next status, song
        (status, song, next) ->
            update_mpd_status status
            update_song_info song
            wss.broadcast "u"
    ]

query_song = (callback) ->
    mpd.currentsong (err, info) ->
        throw err if err
        callback(info)

update_song_info = (info) ->
    return status.song = {} if not status.mpd.playing
    status.song =
        dl: "http://files.sq10.net/music/vaporwave/list/#{info.file}"
        artist: info.Artist
        title: info.Title
        album: info.Album
        date: info.Date
        time: info.Time

update_mpd_status = (sts) ->
    status.mpd =
        playing: if sts.state = "play" then true else false
        bitrate: sts.bitrate
    status.song.elapsed = sts.time.split(":")[1] if status.mpd.playing
