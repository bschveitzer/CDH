/**
 * Created by Osvaldo on 23/07/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
var fs = require('fs');
utility.inherits(RtcRoot, basico);

function RtcRoot(conf) {
    var me = this;
    me.config = conf;
    me.listeners = {};
    me.browserlisteners = {};

    console.log('rtcRoottttt', me.config.socket.id);

    hub.emit('rtcLogin.destroy');

    me.wiring();
    me.interfaceWiring();
}

RtcRoot.prototype.verificacao = function (timeprevisao) {
    var me = this;
    console.log('previsao', timeprevisao);
    var data = new Date();
    var compara = data.getTime();

    if (timeprevisao <= compara) {
        console.log('deu boa');
        var msg = new Mensagem(me, 'comparou', {}, 'verificado', me);
        me.emitePraInterface(msg);
    } else {
        console.log('vou chamar de novo');
        setTimeout(function () {
            me.verificacao(timeprevisao);
        }, 60000);
    }

};

RtcRoot.prototype.setaPrevisao = function (msg) {
    var me = this;
    var dado = msg.getRes();
    me.emitePraInterface(msg);
    var timeprevisao = dado.previsao.getTime() - 60000;
    me.verificacao(timeprevisao);
};

RtcRoot.prototype.wiring = function () {
    var me = this;

    me.listeners['usuario.created'] = me.emitePraInterface.bind(me);
    me.listeners['allmodels'] = me.emitePraInterface.bind(me);
    me.listeners['saida.registrada'] = me.setaPrevisao.bind(me);
    me.listeners['usuario.readed'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.updated'] = me.emitePraInterface.bind(me);
    me.listeners['saida.updated'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.destroied'] = me.emitePraInterface.bind(me);
    me.listeners['relatorio.readed'] = me.emitePraInterface.bind(me);
    me.listeners['previsao.updated'] = me.setaPrevisao.bind(me);

    for (var name in me.listeners) {
        hub.on(name, me.listeners[name]);
    }
};

RtcRoot.prototype.interfaceWiring = function () {
    var me = this;

    me.browserlisteners['getallmodels'] = me.daInterface.bind(me);
    me.browserlisteners['registrasaida'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.create'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.read'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.update'] = me.daInterface.bind(me);
    me.browserlisteners['regsaida.update'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.destroy'] = me.daInterface.bind(me);
    me.browserlisteners['relatorio.read'] = me.daInterface.bind(me);
    me.browserlisteners['enviarelatorio'] = me.daInterface.bind(me);
    me.browserlisteners['previsao.update'] = me.daInterface.bind(me);

    for (var name in me.browserlisteners) {
        me.config.socket.on(name, me.browserlisteners[name]);
    }
};

module.exports = RtcRoot;