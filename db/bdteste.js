/**
 * Created by Osvaldo/Gustavo on 06/05/16.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');

//inicia o bdteste, protótipo do banco
var bdteste = function(){
    var me = this;
    me.listeners = {};

    me.wiring();
};

bdteste.prototype.criaUser = function () {
    var me = this;

    var root = {
        nome: 'admin',
        sobrenome: 'admin',
        email: 'admin',
        senha: 'admin',
        datanascimento: new Date(1988, 01, 02),
        sexo: 'masculino',
        numerocelular: '99476823',
        foto: 'caminhodafoto',
        tipo: 0
    };

    var msg = new Mensagem(me, 'banco.usuario.create', {res: root}, 'usuario');
    hub.emit(msg.getEvento(), msg);

};

bdteste.prototype.fimdetudo = function (msg) {
    console.log('fim');
    console.log(msg.getRes());
};

//o método wiring chama todos os métodos de retorno das funções criar
bdteste.prototype.wiring = function(){

    var me = this;

    me.listeners['banco.ready'] = me.criaUser.bind(me);
    me.listeners['usuario.criated'] = me.fimdetudo.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new bdteste();
