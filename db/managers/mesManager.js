/**
 * Created by labtic on 25/05/2016.
 */
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/mes.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function mesmanager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};
    me.mes = [
        'janeiro',
        'fevereiro',
        'março',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro'
    ];

    me.wiring();
}

utility.inherits(mesmanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
mesmanager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    try {
        me[method](msg);
    }catch (e){
        me.emitManager(msg, 'error.manager', {err: e});
    }
};

mesmanager.prototype.entrada = function (ponto) {
    var me = this;
    var entrada = ponto.horaentrada;
    var mes = me.mes[entrada.getMonth()];
    var ano = entrada.getFullYear();
    var usuario = ponto.usuario;
    var dia = {cb: ponto.cb};

    this.model.findOne({'nome': mes, 'ano': ano, 'usuario': usuario}, function(err, res){
        if(!res){
            var novomes = {
                nome: mes,
                ano: ano,
                fechado: false,
                usuario: usuario,
                bancodehoras: 288000000
            };
            me.model.create(novomes, function(err, res){
                if(res){

                    dia.entrada = entrada;
                    dia.mes = res;

                    hub.emit('pontosemana', dia);
                } else {
                    console.log('deu erro no cria dia', err);
                }
            })
        } else if (err){
            console.log('deu merda aqui', err);
        } else {
            dia.entrada = entrada;
            dia.mes = res;
            hub.emit('pontosemana', dia);
        }

    });
};

mesmanager.prototype.findMesEscolhido = function (msg) {
    var me = this;
    var dado = msg.getRes();
    var user = JSON.parse(dado.usuario);
    var ano = parseInt(dado.ano);
    var mes = dado.mes.toLowerCase();

    this.model.findOne({nome: mes, ano: ano, usuario: user}, function (err, res) {
        if(res){
            msg.setRes(res);
            msg.setEvento('relatorio.getdias');
            hub.emit(msg.getEvento(), msg);
        } else {
            me.emitManager(msg, '.error.readed', {err: err});
        }
    });
};
mesmanager.prototype.diminuirHoras = function (msg) {
    var me = this;
    var dado = msg.getRes();
    var bancohoras = me.model.bancodehoras;
    var bancoatualizado = bancohoras - dado.dado;


    var mesatualizado = {
        bancodehoras: bancoatualizado
    };
    console.log('BIRL',mesatualizado);
    me.model.update(mesatualizado, function (err, res) {
        if(res){
            console.log('DEU BOA NO BANCO DE HORAS');
        }else{
            console.log('DEU RUIIM NO BANCO DE HORAS');
        }
    });
};

mesmanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.mes.*'] = me.executaCrud.bind(me);
    me.listeners['bateuponto'] = me.entrada.bind(me);
    me.listeners['rtc.relatorio.read'] = me.findMesEscolhido.bind(me);
    me.listeners['rtc.bancodehoras.update'] = me.diminuirHoras.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new mesmanager();