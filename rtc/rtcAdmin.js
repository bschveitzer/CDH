/**
 * Created by Osvaldo on 19/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
var fs = require('fs');
utility.inherits(RtcAdmin, basico);

function RtcAdmin(conf){
    var me = this;
    me.config = conf;
    me.listeners = {};
    me.browserlisteners = {};
    hub.emit('rtcLogin.destroy');

    me.wiring();
    me.interfaceWiring();
}

RtcAdmin.prototype.wiring = function(){
    var me = this;

    me.listeners['usuario.created'] = me.emitePraInterface.bind(me);
    me.listeners['allmodels'] = me.emitePraInterface.bind(me);
    me.listeners['saida.registrada'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.readed'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.updated'] = me.emitePraInterface.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

RtcAdmin.prototype.interfaceWiring = function(){
    var me = this;

    me.browserlisteners['getallmodels'] = me.daInterface.bind(me);
    me.browserlisteners['registrasaida'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.create'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.read'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.update'] = me.daInterface.bind(me);
    me.browserlisteners['saida.update'] = me.daInterface.bind(me);

    for(var name in me.browserlisteners){
        me.config.socket.on(name, me.browserlisteners[name]);
    }
};

module.exports = RtcAdmin;