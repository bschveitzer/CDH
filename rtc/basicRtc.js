/**
 * Created by Osvaldo on 18/10/15.
 */

/**
 * Created by Osvaldo on 16/10/15.
 */

//var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var hub = require('../hub/hub.js');

function BasicRtc(){
    var me = this;
}

BasicRtc.prototype.emitePraInterface = function(msg){
    var me = this;
    if(msg.getRtc() == me){
        var msgToBrowser = me.convertMessageFromServerToBrowser(msg);
        me.config.socket.emit('retorno',msgToBrowser);
    }
};

BasicRtc.prototype.convertMessageFromBrowserToServer = function(msgDoBrowser){
    var me = this;
    var mensagem = new Mensagem(me); //source == this
    mensagem.fromBrowser(msgDoBrowser, me); //rtc == this
    return mensagem;

};

BasicRtc.prototype.convertMessageFromServerToBrowser = function(mensagem){
    var msgb = mensagem.toBrowser();
    return msgb;
};

BasicRtc.prototype.daInterface = function(msgDoBrowser){
    var me = this;
    hub.emit('rtc.'+msgDoBrowser.evento, me.convertMessageFromBrowserToServer(msgDoBrowser));
};

module.exports = BasicRtc;