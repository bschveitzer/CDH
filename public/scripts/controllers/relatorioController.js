/**
 * Created by labtic on 01/06/2016.
 */
app.controller("relatorioController",['$scope','$location', 'utilvalues','getUserLogado', function ($scope,$location, utilvalues,getUserLogado) {
    
    var me = this;
    $scope.classes = utilvalues.rotaatual;
    $scope.logado = getUserLogado.getLogado();
    var entrada = utilvalues.entrada;

    $scope.trocaRota=function (local) {
        limpanav(local, function () {
            utilvalues.rotaatual[local] = 'active';
            $location.path('/'+local);
        });
    };
    
    $scope.sair = function () {
        $scope.trocaRota('');
        location.reload();
        
        var tei = {
            saida: new Date(),
            entrada: entrada
        };

        console.log('vou mandar', tei);

        var msg = new Mensagem(me, 'registrasaida', tei, 'saida');
        SIOM.emitirServer(msg);
    };

    var limpanav = function (local, cb) {
        for(var id in $scope.classes){
            utilvalues.rotaatual[id] = '';
        }
        cb();
    };

}]);