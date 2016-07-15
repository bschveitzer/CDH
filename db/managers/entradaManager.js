/**
 * Created by labtic on 25/05/2016.
 */
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/entrada.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function entradamanager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

utility.inherits(entradamanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
entradamanager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    try {
        me[method](msg);
    }catch (e){
        me.emitManager(msg, 'error.manager', {err: e});
    }
};

entradamanager.prototype.registraentrada = function (registro) {
    var me = this;
    var mes = registro.mes;

    var entrada = {
        horaEntrada: registro.entrada,
        dia: registro.day
    };

    // this.model.find({dia: registro.day._id}, function (err, res) {
    //      if (res.length > 0) {
    //          var dado = {
    //              reg: registro,
    //              res: res[res.length - 1],
    //          };
    //          hub.emit('verificasaidaexistente', dado);
    //      } else {
             me.model.create(entrada, function (err, res) {
                 if (res) {
                     registro.cb(res, mes);
                 } else {
                     console.log('deu erro no cria entrada', err);
                 }
             });
    //      }
    // // });
    // // /**
    //  * todo: aqui tem que verificar se ele já tem uma entrada nesse mesmo dia,
    //  * todo: se sim, tem que verificar se ele tem uma saida no mesmo dia, se ele tiver uma saida no mesmo dia, poderá ser criada uma nova entrada
    //  * todo: caso contrario mantem-se a entrada antiga.
    //  */

};

entradamanager.prototype.getentradabydia = function (msg) {
    var me = this;
    var dado = msg.getRes();
    this.model.find({ dia: { "$in" : dado} }, function (err, res) {
        if(res){
            msg.setRes(res);
            msg.setEvento('relatorio.getsaida');
            hub.emit(msg.getEvento(), msg);
        } else {
            me.emitManager(msg, '.erro.getentradabydia', {err: err});
        }
    });
};

entradamanager.prototype.naoachousaida = function () {
    console.log('CHEGOU CARAI');
};

entradamanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.entrada.*'] = me.executaCrud.bind(me);
    me.listeners['entrada'] = me.registraentrada.bind(me);
    me.listeners['relatorio.getentrada'] = me.getentradabydia.bind(me);
    me.listeners['naoachouhorasaida'] = me.naoachousaida.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new entradamanager();
