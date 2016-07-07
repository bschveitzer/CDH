/**
 * Created by labtic on 01/06/2016.
 */
app.controller("relatorioController",['$scope','$location', 'utilvalues','getUserLogado', function ($scope,$location, utilvalues,getUserLogado) {

    var me = this;
    me.listeners = [];

    $scope.usuarios = [];
    $scope.relatorioretornado = [];

    $scope.relatorio = null;




    $scope.classes = utilvalues.rotaatual;
    $scope.logado = getUserLogado.getLogado();

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

    $scope.buscarrelatorio = function () {
        var relatorio = new Mensagem(me, 'relatorio.read', $scope.relatorio,'relatorio');
        SIOM.emitirServer(relatorio);
    };
// ENVIOS
    var ready = function () {
        var msg = new Mensagem(me, 'usuario.read', {}, 'usuario');
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

        var dado = msg.getDado();

        minhaPrimeiraBitoca(dado, dado.length);

    };


    me.wiring = function() {
        me.listeners['saida.updated'] = saidaatualizada.bind(me);
        me.listeners['usuario.readed'] = retusers.bind(me);
        me.listeners['relatorio.readed'] = retrelatorios.bind(me);

        for (var name in me.listeners) {

            SIOM.on(name, me.listeners[name]);

        }
        ready()
    };

    me.wiring();
}]);