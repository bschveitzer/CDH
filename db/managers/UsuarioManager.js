
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/usuario.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function usuariomanager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

utility.inherits(usuariomanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
usuariomanager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    try {
        me[method](msg);
    }catch (e){
        me.emitManager(msg, 'error.manager', {err: e});
    }
};

usuariomanager.prototype.trataLogin = function(msg){
    var me = this;
    var dado = msg.getRes();

    this.model.findOne({'email': dado.email}, function(err, res){
        if(res){
            if(dado.senha == res.senha){
                me.emitManager(msg, '.login', {res: res});
            } else {
                me.emitManager(msg, '.senhaincorreta', {res: null});
            }
        } else if(err){
            me.emitManager(msg, '.error.logar', {err: err});
        } else{
            me.emitManager(msg, '.emailnaocadastrado', {res: res});
        }
    });
};

usuariomanager.prototype.getAllRootLess = function(msg){
    var me = this;
    var retorno = [];
    this.model.find(function(err, res){
        if(res){
            for(var index in res){
                if(res[index].tipo != 0){
                    retorno.push(res[index]);
                }
            }
            me.emitManager(msg, '.pegacadastrados', {res: retorno});
        } else{
            me.emitManager(msg, '.error.pegacadastrados', {err: err});
        }
    })
};

usuariomanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.usuario.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.logar'] = me.trataLogin.bind(me);
    me.listeners['rtc.cadastrados'] = me.getAllRootLess.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new usuariomanager();