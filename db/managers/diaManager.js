var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/dia.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function diamanager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.nomedia = [
        'domingo',
        'segunda',
        'terça',
        'quarta',
        'quinta',
        'sexta',
        'sabado'
    ];

    me.wiring();
}

utility.inherits(diamanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
diamanager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    try {
        me[method](msg);
    }catch (e){
        me.emitManager(msg, 'error.manager', {err: e});
    }
};

diamanager.prototype.entrada = function (ponto) {
    var me = this;
    var entrada = ponto.entrada;
    var dia = entrada.getDate();
    var mes = ponto.mes;
    var novaentrada = {cb : ponto.cb};

    this.model.findOne({'data': dia, 'mes': mes}, function(err, res){
        if(!res){
            var novodia = {
                nome: me.nomedia[entrada.getDay()],
                data: dia,
                mes: mes
            };
            me.model.create(novodia, function(err, res){
                if(res){
                    novaentrada.day = res;
                    novaentrada.entrada = entrada;
                    novaentrada.mes = mes;
                    hub.emit('entrada', novaentrada);
                } else {
                    console.log('deu erro no cria dia', err);
                }
            })
        } else if (err){
            console.log('deu merda aqui', err);
        } else {
            novaentrada.day = res;
            novaentrada.entrada = entrada;
            novaentrada.mes = mes;
            hub.emit('entrada', novaentrada);
        }
    });
};

diamanager.prototype.diabymes = function (msg) {
    var me = this;
    var dado = msg.getRes();
    this.model.find({mes: dado}, function (err, res) {
        if(res){
            msg.setRes(res);
            msg.setEvento('relatorio.getentrada');
            hub.emit(msg.getEvento(), msg);
        } else {
            me.emitManager(msg, '.error.getdiasbymes', {err: err});
        }
    });
};

diamanager.prototype.diminuirHoras = function (msg) {
    var me = this;
    var dado = msg.getRes();

    var horatrabalhada = dado.hora.getTime() - dado.entrada.horaEntrada.getTime();

    this.model.findById(dado.entrada.dia)
        .populate('mes')
        .exec(function (err, ret) {
            if(ret){
                ret.mes.bancodehoras = ret.mes.bancodehoras - horatrabalhada;
                msg.setRes(ret.mes);
                hub.emit('bancodehoras.update', msg);
            }else {
                console.log('faz algo aqui viado.', err)
            }
        })


};

/**
 * Zera hora justificada
 * @param msg
 */
diamanager.prototype.zeraHoraJusti = function (msg) {

    var me = this;
    var dado = msg.getRes();

    var horazero = {
        minutojusti: null,
        comentariojusti: null
    };

    me.model.findByIdAndUpdate(dado._id, {$set: horazero}, function(err, res) {
        if (err) {
            console.log('erro ao zerar minutojusti do dia', err);
            me.emitManager(msg, '.error.removed', {err: err});
        } else {

            me.modelmes = require('../model/mes.js');
            var querymes = {_id: dado.mes};
            me.modelmes.findOne(querymes).exec(function (err_find_mes, res_find_mes) {
                if (err_find_mes) {
                    console.log('erro ao pegar mes', err_find_mes);
                    me.emitManager(msg, '.error.removed', {err: err_find_mes});
                } else {
                    var novomes = {
                        bancodehorasjusti: res_find_mes.bancodehorasjusti - dado.minutojusti
                    };

                    me.modelmes.findByIdAndUpdate(dado.mes, {$set: novomes}, function(err_mes, res_mes) {
                        if (err_mes) {
                            console.log('erro ao zerar bancodehorasjusti do mes', err_mes);
                            me.emitManager(msg, '.error.removed', {err: err_mes});
                        } else {
                            me.emitManager(msg, '.removed', {res: res_mes});
                        }
                    });
                }
            });

        }
    });


};

diamanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.dia.*'] = me.executaCrud.bind(me);
    me.listeners['pontosemana'] = me.entrada.bind(me);
    me.listeners['relatorio.getdias'] = me.diabymes.bind(me);
    me.listeners['entradamaissaida'] = me.diminuirHoras.bind(me);
    me.listeners['rtc.horadia.remove'] = me.zeraHoraJusti.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new diamanager();
