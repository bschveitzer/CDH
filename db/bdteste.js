/**
 * Created by Osvaldo/Gustavo on 06/05/16.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');

//inicia o bdteste, protótipo do banco
var bdteste = function(){
    var me = this;
    console.log("Iniciei o bdteste");

    me.listeners = {};

        me.usuario = [];
        me.mes = [];
        me.semana = [];
        me.dia = [];
        me.entrada = [];
        me.saida = [];


    me.wiring();
};

bdteste.prototype.criaUser = function () {
    var me = this;
    var users = [];
    var userRoot = {
        nome: 'O',
        sobrenome: 'Criador',
        email: 'root',
        senha: 'root',
        numerocelular: '(48) 96198272',
        foto: 'caminhodafoto',
        tipo: 0
    };
    users.push(userRoot);

    var userAdmin = {
        nome: 'admin',
        sobrenome: 'admin',
        email: 'admin',
        senha: 'admin',
        numerocelular: '(48) 99476823',
        foto: 'caminhodafoto',
        tipo: 1
    };
    users.push(userAdmin);

    var userComum = {
        nome: 'comum',
        sobrenome: 'comum',
        email: 'comum',
        senha: 'comum',
        numerocelular: '(48) 99476823',
        foto: 'caminhodafoto',
        tipo: 2
    };
    users.push(userComum);

    var msg = new Mensagem(me, 'banco.usuario.create', {res: users}, 'usuario');
    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retCriaUser = function(msg){
    var me = this;
    me.usuario = msg.getRes();
    me.criaMes();
};

bdteste.prototype.criaMes = function() {
    var me = this;
    var meses = [];

    var janeiro = {
        nome: 'Janeiro',
        ano: 2016,
        fechado: true,
        usuario: me.usuario[0]
    };
    meses.push(janeiro);

    var fevereiro = {
        nome: 'Fevereiro',
        ano: 2016,
        fechado: true,
        usuario: me.usuario[0]
    };
    meses.push(fevereiro);

    var marco = {
        nome: 'Março',
        ano: 2016,
        fechado: true,
        usuario: me.usuario[0]
    };
    meses.push(marco);

    var abril = {
        nome: 'Abril',
        ano: 2016,
        fechado: true,
        usuario: me.usuario[0]
    };
    meses.push(abril);

    var maio = {
        nome: 'Maio',
        ano: 2016,
        fechado: true,
        usuario: me.usuario[0]
    };
    meses.push(maio);

    var junho = {
        nome: 'Junho',
        ano: 2016,
        fechado: false,
        usuario: me.usuario[0]
    };
    meses.push(junho);

    var msg = new Mensagem(me, 'banco.mes.create', {res:meses}, 'mes');
    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retCriaMes = function(msg) {
    var me = this;
    me.mes = msg.getRes();
    me.criaSemana();
};

bdteste.prototype.criaSemana = function (){
    var me = this;
    var semanas = [];

    var semana1 = {
        nome: 1,
        mes: me.mes[0]
    };
    semanas.push(semana1);

    var semana2 = {
        nome: 2,
        mes: me.mes[0]
    };
    semanas.push(semana2);

    var semana3 = {
        nome: 3,
        mes: me.mes[0]
    };
    semanas.push(semana3);

    var semana4 = {
        nome: 4,
        mes: me.mes[0]
    };
    semanas.push(semana4);

    var semana5 = {
        nome: 5,
        mes: me.mes[0]
    };
    semanas.push(semana5);

    var semana6 = {
        nome: 6,
        mes: me.mes[0]
    };
    semanas.push(semana6);

    var msg = new Mensagem(me, 'banco.semana.create', {res:semanas}, 'semana');
    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retCriaSemana = function(msg) {
    var me = this;
    me.semana = msg.getRes();
    me.criaDia();
};

bdteste.prototype.criaDia = function () {
    var me = this;
    var dias = [];

    var dia1 = {
        nome: 'Sexta-Feira',
        data: new Date(),
        semana: me.semana[0]
    };
    dias.push(dia1);

    var dia2 = {
        nome: 'Sábado',
        data: new Date(),
        semana: me.semana[0]
    };
    dias.push(dia2);

    var msg = new Mensagem(me, 'banco.dia.create', {res:dias}, 'dia');
    hub.emit(msg.getEvento(), msg);

};

bdteste.prototype.retCriaDia = function(msg) {
    var me = this;
    me.dia = msg.getRes();
    me.criaEntrada();
    me.criaSaida();
};

bdteste.prototype.criaEntrada = function () {
    var me = this;
    var entradas = [];

    var entrada1 = {
        horaEntrada: new Date(),
        dia: me.dia[0]
    };
    entradas.push(entrada1);

    var entrada2 = {
        horaEntrada: new Date(),
        dia: me.dia[1]
    };
    entradas.push(entrada2);

    var msg = new Mensagem(me, 'banco.entrada.create', {res:entradas}, 'entrada');
    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retCriaEntrada = function(msg) {
    var me = this;
    me.entrada = msg.getRes();
};

bdteste.prototype.criaSaida = function() {
    var me = this;
    var saidas = [];

    var saida1 = {
        hora: new Date(),
        resposta: true,
        dia: me.dia[0]
    };
    saidas.push(saida1);

    var saida2 = {
        hora: new Date(),
        resposta: false,
        dia: me.dia[1]
    };
    saidas.push(saida2);

    var saida3 = {
        hora: new Date(),
        resposta: true,
        dia: me.dia[1]
    };
    saidas.push(saida3);

    var msg = new Mensagem(me, 'banco.saida.create', {res:saidas}, 'saida');
    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retCriaSaida = function(msg) {
    var me = this;
    me.saida = msg.getRes();
};



bdteste.prototype.fimdetudo = function (msg) {
    console.log('fim');
    console.log(msg.getRes());
};

//o método wiring chama todos os métodos de retorno das funções criar
bdteste.prototype.wiring = function(){

    var me = this;

    me.listeners['banco.ready'] = me.criaUser.bind(me);
    me.listeners['fim'] = me.fimdetudo.bind(me);
    me.listeners['usuario.created'] = me.retCriaUser.bind(me);
    me.listeners['mes.created'] = me.retCriaMes.bind(me);
    me.listeners['semana.created'] = me.retCriaSemana.bind(me);
    me.listeners['dia.created'] = me.retCriaDia.bind(me);
    me.listeners['entrada.created'] = me.retCriaEntrada.bind(me);
    me.listeners['saida.created'] = me.retCriaSaida.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new bdteste();
