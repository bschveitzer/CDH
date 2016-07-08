app.controller("homeController",['$scope','$location', 'utilvalues', 'getUserLogado', function ($scope,$location, utilvalues, getUserLogado) {
    var me = this;
    me.listeners = [];

    $scope.classes = utilvalues.rotaatual;
    $scope.logado = getUserLogado.getLogado();
    var data = new Date(utilvalues.entrada.horaEntrada);
    var entrada = utilvalues.entrada;
    var mes = utilvalues.mes;
    $scope.saidaregistrada = utilvalues.saidaregistrada;
    $scope.horasaida = utilvalues.horasaida;
    $scope.saidaInvalida = false;
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

    var saidaatualizada = function () {

        $scope.trocaRota('');
        location.reload();

        $scope.$apply();
        
    };

    $scope.sair = function () {

        utilvalues.saida.hora = new Date();
        var entrada1 = new Date(utilvalues.entrada.horaEntrada);
        utilvalues.tempotrabalhado = utilvalues.saida.hora.getTime() - entrada1.getTime();

        var enviarhorastrabalhadas = new Mensagem(me, 'bancodehoras.update', utilvalues.tempotrabalhado, 'mes');
        SIOM.emitirServer(enviarhorastrabalhadas);
        console.log('BIRL',enviarhorastrabalhadas);

        var msg = new Mensagem(me, 'saida.update', utilvalues.saida, 'saida');
        SIOM.emitirServer(msg);

    };




    /** criado/modificado por: Gustavo, Bernardo
    /** criado/modificado por: Gustavo, Bernardo
     *  se hora invalida impede
     *  registra hora escolhida
     */
    $scope.registrasaida = function () {
        
        if ($scope.saida.getHours() <= $scope.hora.slice(0,2) && $scope.saida.getMinutes() <= $scope.hora.slice(3,5)){
            $scope.saidaInvalida = true;
            $('#horaInvalida').modal();
            return;
        };
        console.log($scope.saida);
        data.setHours($scope.saida.getHours());
        data.setMinutes($scope.saida.getMinutes());
        var registro = {
            saida: data,
            entrada: entrada
        };

        var msg = new Mensagem(me, 'registrasaida', registro, 'saida');
        SIOM.emitirServer(msg);

    };

    var setData = function () {
        colocazero(data.getDate(), function (retData) {
            colocazero(data.getHours() , function (retHora) {
                colocazero(data.getMinutes(), function (retMin) {
                    $scope.dataEscrita = retData +' de '+ mes[data.getMonth()]+' de '+ data.getFullYear();
                    $scope.hora = retHora +':'+ retMin;
                });
            });
        });
    };

    var saidaregistrada = function (msg) {
       var dado = msg.getDado();
        utilvalues.saida = dado;
        var s = new Date(dado.previsao);

        colocazero(s.getMinutes(), function (retMinutos) {
            colocazero(s.getHours(), function (retHoras) {

                utilvalues.horasaida = retHoras+ ":" + retMinutos;
                utilvalues.saidaregistrada = true;
                $scope.saidaregistrada = utilvalues.saidaregistrada;
                $scope.horasaida = utilvalues.horasaida;
                $scope.$apply();

            });
        });

    };
    var colocazero = function (n, callback) {
        if (n <= 9) {
            callback('0' + n);
        }else{
            callback(n);
        }
    };

    me.wiring = function(){
        me.listeners['saida.registrada'] = saidaregistrada.bind(me);
        me.listeners['saida.updated'] = saidaatualizada.bind(me);

        for(var name in me.listeners){

            SIOM.on(name, me.listeners[name]);

        }

        setData();
    };

    me.wiring();

}]);