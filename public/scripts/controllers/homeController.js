/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope','$location', 'utilvalues', 'getUserLogado', function ($scope,$location, utilvalues, getUserLogado) {
    var me = this;
    me.listeners = [];

    $scope.logado = getUserLogado.getLogado();
    var data = new Date(utilvalues.entrada.horaEntrada);
    var entrada = utilvalues.entrada;
    $scope.dataEscrita = '';
    $scope.hora = '';
    $scope.saida = '';
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

    $scope.saidaregistrada = false;
    $scope.horasaida = null;


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
        console.log($scope.saida);
        data.setHours($scope.saida.getHours());
        data.setMinutes($scope.saida.getMinutes());
        var registro = {
            saida: data,
            entrada: entrada
        };

        console.log('vou mandar', registro);

        var msg = new Mensagem(me, 'registrasaida', registro, 'saida');
        SIOM.emitirServer(msg);
        
    };

    var setData = function () {
        $scope.dataEscrita = data.getDate()+' de '+ mes[data.getMonth()]+' de '+ data.getFullYear();
        $scope.hora = data.getHours()+':'+ data.getMinutes();
    };

    var saidaregistrada = function (msg) {
       var dado = msg.getDado();
        var s = new Date(dado.previsao);
        $scope.horasaida = s.getHours()+ ":" + s.getMinutes();
        $scope.saidaregistrada = true;

        console.log($scope.horasaida, $scope.saidaregistrada);

        $scope.$apply();
        
    };

    me.wiring = function(){
        me.listeners['saida.registrada'] = saidaregistrada.bind(me);

        for(var name in me.listeners){

            SIOM.on(name, me.listeners[name]);

        }

        setData();
    };

    me.wiring();

}]);