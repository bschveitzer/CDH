/**
 * Created by labtic on 25/05/2016.
 */
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
            hub.emit('entrada', novaentrada);
        }
    });
};

diamanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.dia.*'] = me.executaCrud.bind(me);
    me.listeners['pontosemana'] = me.entrada.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new diamanager();
