/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope','$location', 'utilvalues','getUserLogado', function ($scope,$location, utilvalues,getUserLogado) {
    var me = this;
    me.listeners = [];

    $scope.classes = utilvalues.rotaatual;
    $scope.usuarios = [];
    $scope.logado = getUserLogado.getLogado();
    me.userremover = null;

    $scope.trocaRota=function (local) {
        limpanav(local, function () {
            utilvalues.rotaatual[local] = 'active';
            $location.path('/'+local);
        });
    };

    var limpanav = function (local, cb) {
        for(var id in $scope.classes){
            utilvalues.rotaatual[id] = '';
        }
        cb();
    };

    $scope.sair = function () {

        utilvalues.saida.hora = new Date();
        var entrada1 = new Date(utilvalues.entrada.horaEntrada);
        utilvalues.tempotrabalhado = utilvalues.saida.hora.getTime() - entrada1.getTime();
        
        console.log('BIRL',utilvalues.tempotrabalhado);

        var msg = new Mensagem(me, 'regsaida.update', utilvalues.saida, 'saida');
        SIOM.emitirServer(msg);

    };
    var saidaatualizada = function () {

        $scope.trocaRota('');
        location.reload();
        $scope.$apply();

    };

    var ready = function () {
        var msg = new Mensagem(me, 'usuario.read', {}, 'usuario');
        SIOM.emitirServer(msg);
    };

    var retusers = function (msg) {
        $scope.usuarios = msg.getDado();
        $scope.$apply();
    };
// REMOVER USUARIO
    $scope.removerusuario = function () {
        console.log('destruindo usuario',me.userremover);

        var user = new Mensagem(me, 'usuario.destroy', me.userremover, 'usuario');
        SIOM.emitirServer(user);
    };

    var usuarioremovido = function () {
        $('#certeza').modal();
        $scope.$apply();
        ready();
    };

    $scope.setremover = function (usuario) {
        me.userremover = usuario;
        $('#usuarioRemovido').modal('toggle');
    };
// EDITAR USUARIO
    $scope.usereditar = {};
    
    $scope.seteditar = function (usuario) {
        $scope.usereditar = usuario;
        $('#usuarioEditado').modal('toggle');
    };
    
// TRATAMENTO EDITAR USUARIO
    $scope.validonomeusuario = false;
    $scope.validosobrenome= false;
    $scope.validoemail= false;
    $scope.validotelefone= false;
    $scope.validotipo= false;
    
    $scope.nomevalido = function () {
        if($scope.formEditarUsuario.nomevar.$valid){
            $scope.validonomeusuario = true;
        } else {
            $scope.validonomeusuario = false;
        }
    };
    $scope.sobrenomevalido = function () {
        if($scope.formEditarUsuario.sobrenomevar.$valid) {
            $scope.validosobrenome = true;
        }else{
            $scope.validosobrenome = false;
        }
    };
    $scope.emailvalido = function () {
        if($scope.formEditarUsuario.emailvar.$valid) {
            $scope.validoemail = true;
        }else{
            $scope.validoemail = false;
        }
    };
    $scope.telefonevalido = function () {
        if($scope.formEditarUsuario.numerocelularvar.$valid) {
            $scope.validotelefone = true;
        }else{
            $scope.validotelefone = false;
        }
    };
    $scope.tipovalido = function () {
        if($scope.formEditarUsuario.tipovar.$valid) {
            $scope.validotipo = true;
        }else{
            $scope.validotipo = false;
        }
    };

    $scope.editarusuario = function () {
        if(!$scope.formEditarUsuario.nomevar.$valid || !$scope.formEditarUsuario.sobrenomevar.$valid || !$scope.formEditarUsuario.emailvar.$valid || !$scope.formEditarUsuario.numerocelularvar.$valid || !$scope.formEditarUsuario.tipovar.$valid){
            $('#erroeditar').modal();
            ready();
            return;
        }else {
            var user = new Mensagem(me, 'usuario.update', $scope.usereditar, 'usuario');
            SIOM.emitirServer(user);
        }
    };
    var usuarioeditado = function () {
        console.log('editou aqui');
        $('#confirmacao').modal();
        $scope.$apply();
        ready();
    };

// WIRING

    me.wiring = function () {

        me.listeners['usuario.readed'] = retusers.bind(me);
        me.listeners['usuario.created'] = ready.bind(me);
        me.listeners['saida.updated'] = saidaatualizada.bind(me);
        me.listeners['usuario.destroied'] = usuarioremovido.bind(me);
        me.listeners['usuario.updated'] = usuarioeditado.bind(me);

        for(var name in  me.listeners){
            SIOM.on(name, me.listeners[name]);
        }

        ready();
    };

    me.wiring();

}]);