/**
 * Created by labtic on 01/06/2016.
 */
app.controller("relatorioController",['$scope','$location', 'utilvalues','getUserLogado', function ($scope,$location, utilvalues,getUserLogado) {
    
    var me = this;
    me.listeners = [];

    $scope.classes = utilvalues.rotaatual;
    $scope.logado = getUserLogado.getLogado();

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

    me.wiring = function() {
        me.listeners['saida.updated'] = saidaatualizada.bind(me);

        for (var name in me.listeners) {

            SIOM.on(name, me.listeners[name]);

        }
    };

    me.wiring();
}]);