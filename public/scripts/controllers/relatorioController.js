app.controller("relatorioController",['$scope','$location', '$window', 'utilvalues','getUserLogado', function ($scope,$location,$window, utilvalues,getUserLogado) {

    var me = this;
    me.listeners = [];

    $scope.usuarios = [];
    $scope.relatorioretornado = [];

    $scope.relatorio = null;

    $scope.saidaregistrada = utilvalues.saidaregistrada;
    $scope.horasaida = utilvalues.horasaida;
    $scope.saidaInvalida = false;
    $scope.dataEscrita = '';
    
    $scope.ehroot = false;

    $scope.classes = utilvalues.rotaatual;
    $scope.logado = getUserLogado.getLogado();

    $scope.novaprevisao = '';
    $scope.possuinovaprevisao = false;
    $scope.novaprevisaoshow = '';
    $scope.saidashow = utilvalues.saidamostra;
    $scope.hora = '';
    $scope.saida = '';
    $scope.mostrausuario = '';

    $scope.naotemrelatorio = true;

    var entrada = utilvalues.entrada;
    var data = new Date(utilvalues.entrada.horaEntrada);

    $scope.meses = [
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

    var verificatipo = function () {
        if ($scope.logado.tipo == 0) {
            $scope.ehroot = true;
        }

    };


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


        var msg = new Mensagem(me, 'regsaida.update', utilvalues.saida, 'saida');
        SIOM.emitirServer(msg);

    };

    $scope.buscarrelatorio = function () {

        if ($scope.logado.tipo != 0) {
            $scope.relatorio.usuario = JSON.stringify($scope.logado);
            var msg = new Mensagem(me, 'relatorio.read', $scope.relatorio, 'relatorio');
            SIOM.emitirServer(msg);
            $scope.mostrausuario = $scope.logado.nome + ' ' + $scope.logado.sobrenome;
            $scope.naotemrelatorio = false;
        } else {
            var relatorio = new Mensagem(me, 'relatorio.read', $scope.relatorio, 'relatorio');
            SIOM.emitirServer(relatorio);
            var user = JSON.parse($scope.relatorio.usuario);
            $scope.mostrausuario = user.nome + ' ' + user.sobrenome;
            $scope.naotemrelatorio = false;
        }

    };

    // TRATAMENTO SAIDA
    $scope.atualizaprevisao = function () {
        if($scope.novaprevisao == undefined || $scope.novaprevisao == ''){
            $('#horaInvalida').modal();
            $('#confirmacao').modal();
            return;
        }else if ($scope.novaprevisao.getHours() <= $scope.hora.slice(0,2) && $scope.novaprevisao.getMinutes() <= $scope.hora.slice(3,5)){
            $('#horaInvalida').modal();
            $('#confirmacao').modal();
            return;
        }
        data.setHours($scope.novaprevisao.getHours());
        data.setMinutes($scope.novaprevisao.getMinutes());
        var dado = {
            antiga: utilvalues.saida,
            saida: data,
            entrada: entrada
        };

        colocazero($scope.novaprevisao.getHours(), function(hora){
            colocazero($scope.novaprevisao.getMinutes(), function(minuto){
                $scope.novaprevisaoshow = hora + ':' + minuto;
                $scope.$apply();
            });
        });

        var msg = new Mensagem(me, 'previsao.update', dado, 'previsao');
        SIOM.emitirServer(msg);

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

    $scope.sair = function () {

        utilvalues.saida.hora = new Date();
        var entrada1 = new Date(utilvalues.entrada.horaEntrada);
        utilvalues.tempotrabalhado = utilvalues.saida.hora.getTime() - entrada1.getTime();

        var msg = new Mensagem(me, 'regsaida.update', utilvalues.saida, 'saida');
        SIOM.emitirServer(msg);

    };
    var saidaatualizada = function () {
        $scope.trocaRota('');
        location.reload();
        $scope.$apply();

    };

    var colocazero = function (n, callback) {
        if (n <= 9) {
            callback('0' + n);
        }else{
            callback(n);
        }
    };
    var tratacomparacao = function () {
        $scope.possuinovaprevisao = true;
        $('#confirmacao').modal();
    };




// ENVIOS
    var ready = function () {
        var msg = new Mensagem(me, 'usuario.read', {}, 'usuario');
        SIOM.emitirServer(msg);
    };

    $scope.mandarelatorio = function () {
        var msg = new Mensagem(me, 'enviarelatorio', $scope.relatorioretornado, 'relatoriopronto');
        SIOM.emitirServer(msg);
    };


// RETORNOS
    var retusers = function (msg) {
        $scope.usuarios = msg.getDado();
        $scope.$apply();
    };

    var minhaPrimeiraBitoca = function (registros, quantidade) {
        if(quantidade > 0){
            var rel = {};
            var reg = registros[quantidade - 1];
            var dataentrada = new Date(reg.entrada.horaEntrada);
            var datasaida = new Date(reg.hora);

            var dif = datasaida.getTime()- dataentrada.getTime();
            var difhora = parseInt(((dif/1000)/60)/60);
            var difmin = parseInt(((dif/1000)/60)%60);

            colocazero(difhora, function (retHora) {
                colocazero(difmin, function (retMinutos) {
                    rel.horatrabalhada = retHora+":"+retMinutos;
                })
            });
            

            colocazero(dataentrada.getHours(), function (retHours) {
                colocazero(dataentrada.getMinutes(), function (retMin) {
                    rel.horaentrada = retHours+':'+retMin;
                })
            });
            if (reg.hora){
                colocazero(datasaida.getHours(),function (retHoursSaida) {
                    colocazero(datasaida.getMinutes(), function (retMinSaida) {
                        rel.horasaida = retHoursSaida+':'+ retMinSaida;
                    })
                });
            }else{
                rel.horasaida = '';
            }
            rel.dia = reg.entrada.dia.data;
            $scope.relatorioretornado.push(rel);
            minhaPrimeiraBitoca(registros, quantidade-1);
            utilvalues.relatorioJSON = rel;
        } else {
            $scope.$apply();
        }
    };
    var colocazero = function (n, callback) {
        if (n <= 9) {
            callback('0' + n);
        }else{
            callback(n);
        }
    };

    var retrelatorios = function (msg) {

        $scope.relatorioretornado = [];


        var dado = msg.getDado();

        minhaPrimeiraBitoca(dado, dado.length);

    };

    me.wiring = function() {
        me.listeners['saida.updated'] = saidaatualizada.bind(me);
        me.listeners['usuario.readed'] = retusers.bind(me);
        me.listeners['relatorio.readed'] = retrelatorios.bind(me);
        me.listeners['comparou'] = tratacomparacao.bind(me);
        me.listeners['previsao.updated'] = saidaregistrada.bind(me);

        for (var name in me.listeners) {

            SIOM.on(name, me.listeners[name]);

        }
        ready();
        verificatipo();
    };

    me.wiring();
}]);