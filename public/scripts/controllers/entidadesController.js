/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope','$location', 'utilvalues','getUserLogado', function ($scope,$location, utilvalues,getUserLogado) {
    var me = this;

    $scope.classes = utilvalues.rotaatual;
    $scope.usuarios = [];
    $scope.logado = getUserLogado.getLogado();

    var listeners = {};

    $scope.trocaRota=function (local) {
        limpanav(local, function () {
            utilvalues.rotaatual[local] = 'active';
            $location.path('/'+local);
        });
    };

    $scope.sair = function () {
        $scope.trocaRota('');
        location.reload();
    };

    var limpanav = function (local, cb) {
        for(var id in $scope.classes){
            utilvalues.rotaatual[id] = '';
        }
        cb();
    };

    var ready = function () {
        var msg = new Mensagem(me, 'usuario.read', {}, 'usuario');
        SIOM.emitirServer(msg);
    };

    var retusers = function (msg) {
        $scope.usuarios = msg.getDado();
        $scope.$apply();
    };

    var wiring = function () {

        listeners['usuario.readed'] = retusers.bind(me);
        listeners['usuario.created'] = ready.bind(me);

        for(var name in listeners){
            SIOM.on(name, listeners[name]);
        }

        ready();
    };

    wiring();

}]);