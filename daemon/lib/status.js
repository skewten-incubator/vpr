var Status = module.exports = function(){
    this.ready = false;
    this.components = {
        web: false,
        daemon: false,
        socket: false
    };
    this.song = {};
    this.mpd = {};
    this.dj = {};
};


Status.prototype.mod_ready = function(type){
    if (typeof this.components[type] != "boolean"){
        throw "ready called for unknown type";
    }
    this.components[type] = true;
    for (var i in this.components){
        if (!this.components[i]){
            return;
        }
    }
    //if there are no components not ready, then we're ready
    console.log("[status] ready");
    this.ready = true;
    update_status();
};
