/**
 * Created by Osvaldo on 06/10/15.
 */
var Mongoose = require('mongoose');
var hub = require('../hub/hub.js');

function Banco() {
    var me = this;
    var db;
    me.listeners = {};
    me.models = {};
    Mongoose.connect('mongodb://localhost/CDH');
    this.mongoose = Mongoose;
    this.conectado = false;
    db = Mongoose.connection;
    db.on('error', function(err, val) {
        return console.log("error", err, val);
    });
    db.once('open', function() {
        me.wiring();
        this.conectado = true;
        hub.emit('banco.status.ready');
    });
}

Banco.prototype.wiring = function(){
    var me = this;

    me.listeners['rtc.usuario.*'] = me.repassaComando.bind(me);
    me.listeners['modelo'] = me.entidademodelo.bind(me);
    me.listeners['rtc.getallmodels'] = me.enviamodelscompletos.bind(me);
    me.listeners['rtc.dia.*'] = me.repassaComando.bind(me);
    me.listeners['rtc.entrada.*'] = me.repassaComando.bind(me);
    me.listeners['rtc.saida.*'] = me.repassaComando.bind(me);
    me.listeners['rtc.mes.*'] = me.repassaComando.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
    hub.emit('banco.status.wired');
};

Banco.prototype.enviamodelscompletos = function (msg) {
    var me = this;
    console.log(me.models, 'enviando');
    var retorno = msg.next(me, 'allmodels', {res: me.models}, msg.getFlag);
    hub.emit(retorno.getEvento(), retorno);
};

Banco.prototype.entidademodelo = function (msg) {
    var me = this;
    var model = msg.getDado();
    console.log(model.nome);
    me.models[model.nome] = model;
};

Banco.prototype.repassaComando = function (msg) {
    var me = this;
    var novoEvento = 'banco.' + msg.getEvento();
    msg.setEvento(novoEvento);
    hub.emit(novoEvento, msg);
};

module.exports = new Banco();