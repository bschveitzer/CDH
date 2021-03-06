/**
 * Created by Osvaldo on 19/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
utility.inherits(RtcComum, basico);

function RtcComum(conf){
    var me = this;
    me.config = conf;
    me.listeners = {};
    me.browserlisteners = {};
    hub.emit('rtcLogin.destroy');

    me.wiring();
    me.interfaceWiring();
}

RtcComum.prototype.verificacao = function (timeprevisao) {
    var me = this;
    var data = new Date();
    var compara = data.getTime();
    if (timeprevisao <= compara) {
        var msg = new Mensagem(me, 'comparou', {}, 'verificado', me);
        me.emitePraInterface(msg);
    } else {
        setTimeout(function () {
            me.verificacao(timeprevisao);
        }, 60000);
    }

};

RtcComum.prototype.setaPrevisao = function (msg) {
    var me = this;
    if(msg.getRtc() == me){
        var dado = msg.getRes();
        me.emitePraInterface(msg);
        var timeprevisao = dado.previsao.getTime() - 60000;
        me.verificacao(timeprevisao);
    }
};

RtcComum.prototype.setaSaida = function (msg) {
    var me = this;
    msg.dados.hora = new Date();
    me.daInterface(msg);

};

RtcComum.prototype.wiring = function(){
    var me = this;

    me.listeners['usuario.created'] = me.emitePraInterface.bind(me);
    me.listeners['allmodels'] = me.emitePraInterface.bind(me);
    me.listeners['saida.registrada'] = me.setaPrevisao.bind(me);
    me.listeners['usuario.readed'] = me.emitePraInterface.bind(me);
    me.listeners['usuario.updated'] = me.emitePraInterface.bind(me);
    me.listeners['saida.updated'] = me.emitePraInterface.bind(me);
    me.listeners['relatorio.readed'] = me.emitePraInterface.bind(me);
    me.listeners['previsao.updated'] = me.setaPrevisao.bind(me);
    me.listeners['relatorio.bancomensal'] = me.emitePraInterface.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

RtcComum.prototype.interfaceWiring = function(){
    var me = this;

    me.browserlisteners['getallmodels'] = me.daInterface.bind(me);
    me.browserlisteners['registrasaida'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.create'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.read'] = me.daInterface.bind(me);
    me.browserlisteners['usuario.update'] = me.daInterface.bind(me);
    me.browserlisteners['regsaida.update'] = me.setaSaida.bind(me);
    me.browserlisteners['relatorio.read'] = me.daInterface.bind(me);
    me.browserlisteners['enviarelatorio'] = me.daInterface.bind(me);
    me.browserlisteners['previsao.update'] = me.daInterface.bind(me);
    me.browserlisteners['disconnect'] = me.destruir.bind(me);


    for(var name in me.browserlisteners){
        me.config.socket.on(name, me.browserlisteners[name]);
    }
};
RtcComum.prototype.destruir = function () {
    var me = this;
    for(var name in me.browserlisteners){
        me.config.socket.removeListener(name, me.browserlisteners[name]);
    }
    for(var list in me.listeners){
        hub.removeListener(list, me.listeners[list]);
    }
};

module.exports = RtcComum;