/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope','$location', 'utilvalues','getUserLogado', function ($scope,$location, utilvalues,getUserLogado) {
    var me = this;
    me.listeners = [];

    $scope.classes = utilvalues.rotaatual;
    $scope.usuarios = [];
    $scope.logado = getUserLogado.getLogado();
    var entrada = utilvalues.entrada;

    

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

        console.log('vou mandar', utilvalues.saida);

        var msg = new Mensagem(me, 'saida.update', utilvalues.saida, 'saida');
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

    me.wiring = function () {

        me.listeners['usuario.readed'] = retusers.bind(me);
        me.listeners['usuario.created'] = ready.bind(me);
        me.listeners['saida.updated'] = saidaatualizada.bind(me);

        for(var name in  me.listeners){
            SIOM.on(name, me.listeners[name]);
        }

        ready();
    };

    me.wiring();

}]);