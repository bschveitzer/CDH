/**
 * Created by udesc on 21/05/2016.
 */
app.controller("entidadesController",['$scope', function ($scope) {
    var me = this;

    $scope.entidades = {};
    $scope.entidadeSelecionado = {}

    var listeners = {};

    $scope.selecionaEntidade = function(entidade){
        $scope.entidadeSelecionado = entidade;
    };

    var ready = function () {
        var msg = new Mensagem(me, 'getallmodels', {}, 'entidades');
        SIOM.emitirServer(msg);
    };

    var retallmodels = function (msg) {
        $scope.entidades = msg.getDado();
        $scope.$apply();
    };

    var wiring = function () {

        listeners['allmodels'] = retallmodels.bind(me);

        for(var name in listeners){
            SIOM.on(name, listeners[name]);
        }

        ready();
    };

    wiring();

}]);