/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope','$location', 'utilvalues', 'getUserLogado', function ($scope,$location, utilvalues, getUserLogado) {
    var me = this;
    me.listeners = [];

    $scope.logado = getUserLogado.getLogado();
    var data = new Date(utilvalues.entrada.horaEntrada);
    $scope.dataEscrita = '';
    $scope.hora = '';
    // $scope.saida =
    var mes = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];

    $scope.classes = utilvalues.rotaatual;

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

    $scope.registrasaida = function () {
        data.setHours($scope.saida.getHours());
        data.setMinutes($scope.saida.getUTCMinutes());
        console.log("vou mandar isso", data);
    };

    var setData = function () {
        $scope.dataEscrita = data.getDate()+' de '+ mes[data.getMonth()]+' de '+ data.getFullYear();
        $scope.hora = data.getHours()+':'+ data.getMinutes();
    };

    me.wiring = function(){
        console.log($scope.logado);

        for(var name in me.listeners){

            SIOM.on(name, me.listeners[name]);

        }

        setData();
    };

    me.wiring();

}]);