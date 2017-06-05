app.controller("relatorioController", ['$scope', '$location', '$window', 'utilvalues', 'getUserLogado', function ($scope, $location, $window, utilvalues, getUserLogado) {

  var me = this;
  me.listeners = [];

  $scope.usuarios = [];
  $scope.relatorioretornado = [];

  $scope.relatorio = {
    usuario: null,
    mes: null,
    ano: null
  };

  $scope.saidaregistrada = utilvalues.saidaregistrada;
  $scope.horasaida = utilvalues.horasaida;
  $scope.saidaInvalida = false;
  $scope.dataEscrita = '';

  $scope.ehroot = false;

  $scope.bancomes = '';

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
  $scope.sohrelat = false;

  var entrada = utilvalues.entrada;

  if (entrada != null) {
    var data = new Date(utilvalues.entrada.horaEntrada);
  } else {
    $scope.sohrelat = true;
  }


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

  $scope.addhora = {
    idusuario: null,
    data: null,
    valor: null,
    justi: null
  };
  $scope.msgBanco = {
    result: '',
    msg: '',
    voltar: false
  };
  $scope.totalHorasJusti = {
    positividade: null,
    horas: null,
    minutos: null
  };
  $scope.totalHorasDivida = {
    positividade: null,
    horas: null,
    minutos: null
  };
  $scope.diasJustificados = [];
  $scope.diaSelecionado = {};

  var verificatipo = function () {
    if ($scope.logado.tipo == 0) {
      $scope.ehroot = true;
    }

  };

  $scope.minutoHora = function(minutos) {
    var valor = Math.abs(minutos);
    var positividade = (minutos > 0) ? null : '-';
    return {
      horas: positividade + parseInt(valor/60),
      minutos: (valor%60 < 10) ? '0'+valor%60 : valor%60
    };
  };

  /**
   * Salva em uma variavel dados do dia
   */
  $scope.selecionaHoraJusti = function(dia, index) {
    $scope.diaSelecionado = angular.copy(dia);
    $scope.diaSelecionado.index = index;
  };

  /**
   * Manda msg para zerar hora jusatificada
   */
  $scope.removeHoraJusti = function() {
    $('#modalConfirmaDel').modal('hide');
    var msg = new Mensagem(me, 'horadia.remove', $scope.diaSelecionado, 'horadia');
    SIOM.emitirServer(msg);
  };

  /**
   * Adiciona horas justificadas a um usuario
   */
  $scope.addHoraUser = function () {
    if ( $scope.addhora.idusuario === 'todos') {

      var dado = angular.copy($scope.addhora);
      dado.data = {
        dia: dado.data.getDate(),
        mes: dado.data.getMonth(),
        ano: dado.data.getFullYear(),
        diasemana: dado.data.getDay(),
      };

      for(var indexuser in $scope.usuarios) {

        dado.idusuario = $scope.usuarios[indexuser]._id;
        var msg = new Mensagem(me, 'horadia.ajuste', dado, 'horadia');
        SIOM.emitirServer(msg);

      }

    } else {

      var dado = angular.copy($scope.addhora);
      dado.data = {
        dia: dado.data.getDate(),
        mes: dado.data.getMonth(),
        ano: dado.data.getFullYear(),
        diasemana: dado.data.getDay(),
      };

      var msg = new Mensagem(me, 'horadia.ajuste', dado, 'horadia');
      SIOM.emitirServer(msg);

    }
  };


  $scope.trocaRota = function (local) {
    limpanav(local, function () {
      utilvalues.rotaatual[local] = 'active';
      $location.path('/' + local);
    });
  };

  var limpanav = function (local, cb) {
    for (var id in $scope.classes) {
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

    $scope.relatorioretornado = [];
    $scope.diasJustificados = [];
    $scope.totalHorasJusti = {};

    if ($scope.relatorio == null) {
      $('#Relatoriovazio').modal();
      return;
    } else {
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




    }

    buscaRelatorioJusti();

  };

  /**
   * Manda msg para pegar dias com horas justificadas
   */
  var buscaRelatorioJusti = function() {

    var i = null;

    for(var index in $scope.meses) {
      if ($scope.meses[index] === $scope.relatorio.mes) i = index;
    }

    var dado = angular.copy($scope.relatorio);
    dado.mes = i;
    dado.usuario = JSON.parse(dado.usuario);

    var msg = new Mensagem(me, 'relatoriojusti.read', dado, 'relatoriojusti');
    SIOM.emitirServer(msg);

  };

  $scope.minimizar = function () {
    $scope.trocaRota('');
    location.reload();
    $scope.$apply();
  };

  // TRATAMENTO SAIDA
  $scope.atualizaprevisao = function () {
    if ($scope.novaprevisao == undefined || $scope.novaprevisao == '') {
      $('#horaInvalida').modal();
      $('#confirmacao').modal();
      return;
    } else if ($scope.novaprevisao.getHours() <= $scope.hora.slice(0, 2) && $scope.novaprevisao.getMinutes() <= $scope.hora.slice(3, 5)) {
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

    colocazero($scope.novaprevisao.getHours(), function (hora) {
      colocazero($scope.novaprevisao.getMinutes(), function (minuto) {
        $scope.novaprevisaoshow = hora + ':' + minuto;
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

        utilvalues.horasaida = retHoras + ":" + retMinutos;
        utilvalues.saidaregistrada = true;
        $scope.saidaregistrada = utilvalues.saidaregistrada;
        $scope.horasaida = utilvalues.horasaida;
        $scope.$apply();

      });
    });

  };

  $scope.sair = function () {
    utilvalues.saida.hora = '';
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
    } else {
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

    if (quantidade > 0) {
      var rel = {};
      var reg = registros[quantidade - 1];
      var dataentrada = new Date(reg.entrada.horaEntrada);
      var datasaida = new Date(reg.hora);

      var dif = datasaida.getTime() - dataentrada.getTime();
      var difhora = parseInt(((dif / 1000) / 60) / 60);
      var difmin = parseInt(((dif / 1000) / 60) % 60);

      colocazero(difhora, function (retHora) {
        colocazero(difmin, function (retMinutos) {
          rel.horatrabalhada = retHora + ":" + retMinutos;
        })
      });


      colocazero(dataentrada.getHours(), function (retHours) {
        colocazero(dataentrada.getMinutes(), function (retMin) {
          rel.horaentrada = retHours + ':' + retMin;
        })
      });
      if (reg.hora) {
        colocazero(datasaida.getHours(), function (retHoursSaida) {
          colocazero(datasaida.getMinutes(), function (retMinSaida) {
            rel.horasaida = retHoursSaida + ':' + retMinSaida;
          })
        });
      } else {
        rel.horasaida = '';
      }
      rel.dia = reg.entrada.dia.data;
      rel.bancohorames = $scope.bancomes;
      $scope.relatorioretornado.push(rel);
      minhaPrimeiraBitoca(registros, quantidade - 1);
      utilvalues.relatorioJSON = rel;
    } else {
      $scope.$apply();
    }
  };
  var colocazero = function (n, callback) {
    if (n <= 9) {
      callback('0' + n);
    } else {
      callback(n);
    }
  };

  var retrelatorios = function (msg) {

    $scope.relatorioretornado = [];


    var dado = msg.getDado();

    minhaPrimeiraBitoca(dado, dado.length);

  };

  var setabancomensal = function (msg) {
    var dado = msg.getDado();

    var bdhhora = parseInt(((dado.bancodehoras / 1000) / 60) / 60);
    var bdhmin = parseInt(((dado.bancodehoras / 1000) / 60) % 60);

    colocazero(bdhhora, function (retBdHora) {
      colocazero(bdhmin, function (retBdhMin) {
        $scope.bancomes = retBdHora + ':' + retBdhMin;
      });
    });

    if (dado.bancodehorasjusti > 0 || dado.bancodehorasjusti < 0) {

        //Ajuste para valores negativos
        $scope.totalHorasJusti.positividade = (dado.bancodehorasjusti < 0) ? '-' : null;
        var horas_justi = Math.abs(dado.bancodehorasjusti);

        //Calculo de horas
        $scope.totalHorasJusti.horas = parseInt(horas_justi/60);
        $scope.totalHorasJusti.minutos = (horas_justi%60 < 10) ? '0'+horas_justi%60 : horas_justi%60;
    } else {
        $scope.totalHorasJusti.positividade = null;
        $scope.totalHorasJusti.horas = '00';
        $scope.totalHorasJusti.minutos = '00';
    }

    let user = JSON.parse($scope.relatorio.usuario);
    if (user.horasdividas > 0 || user.horasdividas < 0) {

      //Ajuste para valores negativos
      $scope.totalHorasDivida.positividade = (user.horasdividas < 0) ? '-' : null;
      let horas_justi = Math.abs(user.horasdividas);

      //Calculo de horas
      $scope.totalHorasDivida.horas = parseInt(horas_justi/60);
      $scope.totalHorasDivida.minutos = (horas_justi%60 < 10) ? '0'+horas_justi%60 : horas_justi%60;
    } else {
      $scope.totalHorasDivida.positividade = null;
      $scope.totalHorasDivida.horas = '00';
      $scope.totalHorasDivida.minutos = '00';
    }

    console.log('dadoooooooooo', dado, user);


  };

  /**
   * Abre o modal desejado
   *
   * @param modal
   */
  $scope.voltarmodal = function (modal) {
    $('#' + modal).modal();
  };

  /**
   * Retorno do banco ao adicionar/remover horas justificadas
   *
   * @param msg
   */
  var retMsgBanco = function (msg) {

    $scope.msgBanco.result = (msg.isSuccess()) ? 'Sucesso' : 'Erro';
    if (msg.getEvento() === 'horadia.ajustada') {
      $scope.msgBanco.voltar = true;
      $scope.msgBanco.msg = 'ao adicionar horas.';
    } else {
      $scope.diasJustificados.splice($scope.diaSelecionado.index, 1);
      $scope.msgBanco.voltar = false;
      $scope.msgBanco.msg = 'ao remover horas.';
    }

    $('#addHoras').modal('hide');
    $('#retMsgBanco').modal();

    if ($scope.relatorio.mes != null && $scope.relatorio.mes != null && $scope.relatorio.usuario != null) {
        $scope.buscarrelatorio();
    } else {
      $scope.$apply();
    }
  };

  /**
   * Retorno com dias justificados
   * @param msg
   */
  var retRelatoriosJusti = function(msg) {

    $scope.diasJustificados = msg.getDado();
    $scope.$apply();

  };

  me.wiring = function () {
    me.listeners['saida.updated'] = saidaatualizada.bind(me);
    me.listeners['usuario.readed'] = retusers.bind(me);
    me.listeners['relatorio.readed'] = retrelatorios.bind(me);
    me.listeners['relatoriojusti.readed'] = retRelatoriosJusti.bind(me);
    me.listeners['comparou'] = tratacomparacao.bind(me);
    me.listeners['previsao.updated'] = saidaregistrada.bind(me);
    me.listeners['relatorio.bancomensal'] = setabancomensal.bind(me);
    me.listeners['horadia.ajustada'] = retMsgBanco.bind(me);
    me.listeners['horadia.removed'] = retMsgBanco.bind(me);

    for (var name in me.listeners) {

      SIOM.on(name, me.listeners[name]);

    }
    ready();
    verificatipo();
  };

  me.wiring();
}]);