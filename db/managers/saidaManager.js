/**
 * Created by labtic on 25/05/2016.
 */
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/saida.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function saidamanager() {
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

utility.inherits(saidamanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
saidamanager.prototype.executaCrud = function (msg) {
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.') + 1);
    try {
        me[method](msg);
    } catch (e) {
        me.emitManager(msg, 'error.manager', {err: e});
    }
};

saidamanager.prototype.registrasaida = function (registro) {
    var me = this;
    var dainterface = registro.getRes();
    var dado = {
        previsao: dainterface.saida,
        resposta: false,
        entrada: dainterface.entrada
    };

    this.model.create(dado, function (err, res) {
        if (res) {
            me.emitManager(registro, '.registrada', {res: res});
        } else {
            me.emitManager(registro, '.error.registro', {err: err});
            console.log('erro no create', err);
        }
    })

};

saidamanager.prototype.getsaidabyentrada = function (msg) {
    var me = this;
    var dado = msg.getRes();
    this.model.find({entrada: {"$in": dado}})
        .populate({
            path: 'entrada',
            populate: {
                path: 'dia'
            }
        })
        .exec(function (err, res) {
            if (res) {
                msg.setRes(res);
                me.emitManager(msg, '.readed', {res: res});
            } else {
                me.emitManager(msg, '.erro.getsaidabyentrada', {err: err});
            }
        });
};

saidamanager.prototype.wiring = function () {
    var me = this;
    me.listeners['banco.saida.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.registrasaida'] = me.registrasaida.bind(me);
    me.listeners['relatorio.getsaida'] = me.getsaidabyentrada.bind(me);


    for (var name in me.listeners) {
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new saidamanager();
