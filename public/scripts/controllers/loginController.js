/**
 * Created by Osvaldo on 05/10/15.
 */

app.controller("loginController",['$scope', '$location', 'setUserLogado', '$route', 'utilvalues', 'md5',function ($scope, $location, setUserLogado, $route, utilvalues, md5) {
    var me = this;
    me.listeners = {};

    me.wind = "/home";
    $scope.usuario = {};

    $scope.logar = function(){
        var msg = new Mensagem(me, 'logar', $scope.usuario, 'usuario');
        msg._dado.senha = md5.createHash(msg._dado.senha);
        SIOM.logar(msg);

    };

    me.logou = function(msg){
        var dado = msg.getDado();
        setUserLogado.setLogado(dado.logado);
        if(dado.entrada.saida){
            utilvalues.entrada = dado.entrada.entrada;
            utilvalues.saida = dado.entrada.saida;
            utilvalues.saidaregistrada = true;
        } else {
            utilvalues.entrada = dado.entrada;
        }
        utilvalues.mes = dado.mes;
        SIOM.emit('setarota', dado.logado.tipo);
    };

    me.nextView = function(){
        $location.path(me.wind);
        $route.reload();
    };

    me.serverError = function(msg){
        //todo criar um box de aviso que informa erros e sucessos
        console.log('error', msg);
    };

    me.invalidUser = function(msg){
        //todo criar um box de aviso que informa erros e sucessos
        console.log('email não cadastrado', msg);
    };

    me.senhaincorreta = function (msg) {
        //todo criar um mensagem pra avisar que a senha está incorreta
        console.log('senha incorreta', msg)
    };

    me.wiring = function(){
        me.listeners['usuario.login'] = me.logou.bind(me);
        me.listeners['usuario.error.logar'] = me.serverError.bind(me);
        me.listeners['usuario.emailnaocadastrado'] = me.invalidUser.bind(me);
        me.listeners['usuario.senhaincorreta'] = me.senhaincorreta.bind(me);
        me.listeners['rotasetada'] = me.nextView.bind(me);

        for(var name in me.listeners){

            SIOM.on(name, me.listeners[name]);

        }

    };

    me.wiring();

}]);