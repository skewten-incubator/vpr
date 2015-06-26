handlers = {}

handlers['/ping'] = (req, res) ->
    res.json
        status: 'ok'

handlers['/info'] = (req, res) ->
    return null if not test_ready(res)
    res.json
        status: 'ok'
        song: status.song
        mpd: status.mpd
        dj: status.dj

handlers["/icecheck"] = (req, res) ->
    res.send 'ok'
    setTimeout update_icecast_data, 1000

module.exports = (port) ->
    console.log "[web] starting up"

    express = require 'express'
    bodyParser = require 'body-parser'

    app = express()
    router = express.Router()

    app.use bodyParser.urlencoded extended: true
    app.use bodyParser.json()

    routes = [
        '/ping',
        '/info',
        '/icecheck'
    ]

    for route in routes
        router.get route, handlers[route]

    router.post '/auth', authenticate_streamer

    app.use '/_/', router
    app.listen port

    console.log "[web] listening on port #{port}"
    status.mod_ready 'web'

test_ready = (res) ->
    if not status.ready
        res.json
            status: 'not_ready'
        return false
    return true

update_icecast_data = ->
    request = require 'request'
    request "http://localhost:420/status-json.xsl", (error, response, body) ->
        console.log "[icecast] #{error}" if error
        if not error and response.statusCode is 200
            try
              console.log util.inspect JSON.parse body
            catch error

authenticate_streamer = (req, res) ->
    console.log "[auth] got request"
    console.log req.body
    res.set "icecast-auth-user", 1
    res.send "ok"
