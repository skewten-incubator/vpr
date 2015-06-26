class Status
    ready: false
    components:
        web: false
        daemon: false
        socket: false
    song: {}
    mpd: {}
    dj: {}

    mod_ready: (type) ->
        throw "ready called for unknown type" if typeof @components[type] is not "boolean"
        @components[type] = true
        for component of @components
            return null if not @components[component]
        #if there are no components not ready, then we're ready
        console.log "[status] ready"
        @ready = true
        update_status()

module.exports = Status
