/**
 * Created by Bernardo on 25/05/2016.
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

saidamanager.prototype.registraprevisao = function (registro) {
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

saidamanager.prototype.registrasaida = function (msg) {
    var me = this;
    var dado = msg.getRes();
    this.model.findByIdAndUpdate(dado._id, {$set: dado}, function (err, res) {
        if(res){
            me.model.findById(res._id)
                .populate('entrada')
                .exec(function (err, ret) {
                    if(ret){
                        msg.setRes(ret);
                        hub.emit('entradamaissaida', msg);
                    }else{
                        me.emitManager(msg, '.error.entradamaissaida', {err:err});
                    }
                })
        }else{
            me.emitManager(msg, '.error.registrasaida', {err: err});
        }
    });
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

saidamanager.prototype.buscasaida = function(obj){
    var me = this;

    this.model.find({entrada: obj.versaida._id}, function (err, res) {
        if(res){
            if(res.length == 0){
                obj.cb();
            }else{
                var saidaverificada = res[res.length -1];
                var previstomilisecond = saidaverificada.previsao.getTime();
                var essahora = new Date();
                var essemilisecond = essahora.getTime();
                if(saidaverificada.hora || essemilisecond > previstomilisecond + 600000){
                    obj.cb();
                } else {
                    var entrada = {
                        entrada: obj.versaida,
                        saida: saidaverificada
                    };
                    obj.cbjaentrada(entrada, obj.mes);
                }
            }

        }else{
            console.log('deu erro', err);
        }
    });

};

saidamanager.prototype.atualizaprevisao = function (msg) {
    var me = this;
    var dados = msg.getRes();
    this.model.findByIdAndUpdate(dados.antiga._id, {$set: {previsao: dados.saida}}, function(err, res){
        if(res){
            me.model.findById(dados.antiga._id, function(err, res){
                if(res){
                    me.emitManager(msg, '.updated', {res: res});
                } else{
                    me.emitManager(msg, '.error.readedupdated', {err: err});
                }
            });
        } else{
            me.emitManager(msg, '.error.updated', {err: err});
        }
    })

};

saidamanager.prototype.wiring = function () {
    var me = this;
    me.listeners['banco.saida.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.registrasaida'] = me.registraprevisao.bind(me);
    me.listeners['relatorio.getsaida'] = me.getsaidabyentrada.bind(me);
    me.listeners['rtc.regsaida.update'] = me.registrasaida.bind(me);
    me.listeners['rtc.previsao.update'] = me.atualizaprevisao.bind(me);
    me.listeners['verificasaida'] = me.buscasaida.bind(me);


    for (var name in me.listeners) {
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new saidamanager();
