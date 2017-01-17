
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
                var entrada = {
                    horaentrada: new Date(),
                    usuario: res,
                    cb: function (entrada, mes) {
                        var logado = {
                            entrada: entrada,
                            logado: res,
                            mes: mes
                        };
                        me.emitManager(msg, '.login', {res: logado});
                    }
                };
                hub.emit('bateuponto', entrada);
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

usuariomanager.prototype.trataLoginRelat = function(msg){
    var me = this;
    var dado = msg.getRes();

    this.model.findOne({'email': dado.email}, function(err, res){
        if(res){
            if(dado.senha == res.senha){
                var logado = {
                    logado: res
                };
                me.emitManager(msg, '.loginRelat', {res: logado});

                }else{
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

usuariomanager.prototype.init = function() {

    var array = [];

    var objRoot = {
        nome: 'root',
        sobrenome: 'root',
        email: 'root',
        senha: '63a9f0ea7bb98050796b649e85481845',
        numerocelular: '',
        foto: '',
        tipo: 0
    };

    var objAdmin = {
        nome: 'admin',
        sobrenome: 'admin',
        email: 'admin',
        senha: '21232f297a57a5a743894a0e4a801fc3',
        numerocelular: '',
        foto: '',
        tipo: 1
    };

    var objComum = {
        nome: 'comum',
        sobrenome: 'comum',
        email: 'comum',
        senha: '6d769ecb25444b49111b669de9ec6104',
        numerocelular: '',
        foto: '',
        tipo: 2
    };

    array.push(objAdmin);
    array.push(objComum);
    array.push(objRoot);

    this.model.create(array, function(err, res){
        if(res){
            console.log('deu boa create user', res);
        } else{
            console.log('erro no create', err);
        }
    })
};

usuariomanager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.usuario.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.logar'] = me.trataLogin.bind(me);
    me.listeners['rtc.loginrelatorio'] = me.trataLoginRelat.bind(me);
    me.listeners['rtc.cadastrados'] = me.getAllRootLess.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }

    //me.init();
};

module.exports = new usuariomanager();