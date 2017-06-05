var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/mes.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function mesmanager() {
  var me = this;
  Manager.call(me);
  me.model = Model;
  me.listeners = {};
  me.mes = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ];

  me.diasemana = [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sabado'
  ];

  me.wiring();
}

utility.inherits(mesmanager, Manager);

/**
 * Calcula o numero de horas que devem ser trabalhadas no mes e retorna o valor em milisegundos
 *
 * @param ano
 * @param mes
 * @returns {number}
 */
mesmanager.prototype.calc_total_horas = function (ano, mes) {

  let me = this;
  let num_mes;
  for(let index_mes in me.mes) {//Encontra mes
    if (me.mes.hasOwnProperty(index_mes)) {
        if (me.mes[index_mes] === mes) num_mes = parseInt(index_mes);
    }
  }

  let total_horas = 0;
  let total_dias =  new Date(ano, num_mes+1, 0).getDate();

  for(let dia = 1; dia <= total_dias; dia++) {
      let novo_dia = new Date(ano, num_mes, dia);
      if (novo_dia.getDay() != 0 && novo_dia.getDay() != 6) total_horas+=4;
  }

  return total_horas*3600000;
};


/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
mesmanager.prototype.executaCrud = function (msg) {
  var me = this;
  var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.') + 1);
  try {
    me[method](msg);
  } catch (e) {
    me.emitManager(msg, 'error.manager', {err: e});
  }
};

mesmanager.prototype.entrada = function (ponto) {
  var me = this;
  var entrada = ponto.horaentrada;
  var mes = me.mes[entrada.getMonth()];
  var ano = entrada.getFullYear();
  var usuario = ponto.usuario;
  var dia = {cb: ponto.cb};

  this.model.findOne({
    'nome': mes,
    'ano': ano,
    'usuario': usuario
  }, function (err, res) {
    if (!res) {

      // let mes_antigo = (entrada.getMonth()-1 >= 0) ? entrada.getMonth()-1 : 11;
      // let ano_antigo = (entrada.getMonth()-1 >= 0) ?
      //   entrada.getFullYear() : entrada.getFullYear()-1;
      //
      // me.model.findOne({
      //   'nome': me.mes[mes_antigo],
      //   'ano': ano_antigo,
      //   'usuario': usuario
      // }, (err, res) => {
      //   console.log('retorno mes antigo', err, res);
      // });


      var novomes = {
        nome: mes,
        ano: ano,
        fechado: false,
        usuario: usuario,
        bancodehoras: me.calc_total_horas(ano, mes),
        horasjuros: 0
      };
      me.model.create(novomes, function (err, res) {
        if (res) {

          dia.entrada = entrada;
          dia.mes = res;

          hub.emit('pontosemana', dia);
        } else {
          console.log('deu erro no cria dia', err);
        }
      })

    } else if (err) {
      console.log('deu merda aqui', err);
    } else {
      dia.entrada = entrada;
      dia.mes = res;
      hub.emit('pontosemana', dia);
    }

  });
};

mesmanager.prototype.findMesEscolhido = function (msg) {
  var me = this;
  var dado = msg.getRes();
  var user = JSON.parse(dado.usuario);
  var ano = parseInt(dado.ano);
  var mes = dado.mes.toLowerCase();

  this.model.findOne({nome: mes, ano: ano, usuario: user}, function (err, res) {
    if (res) {
      msg.setRes(res);
      msg.setEvento('relatorio.getdias');
      hub.emit(msg.getEvento(), msg);
      me.emitManager(msg, '.bancomensal', {res: res});
    } else {
      me.emitManager(msg, '.error.readed', {err: err});
    }
  });
};

mesmanager.prototype.updatebancodehoras = function (msg) {
  var me = this;
  var dados = msg.getRes();
  this.model.findByIdAndUpdate(dados._id, {$set: {bancodehoras: dados.bancodehoras}}, function (err, res) {
    if (res) {
      me.model.findById(dados._id, function (err, res) {
        if (res) {
          me.emitManager(msg, '.updated', {res: res});
        } else {
          me.emitManager(msg, '.error.readedupdatedbancohoras', {err: err});
        }
      });
    } else {
      me.emitManager(msg, '.error.updatedbancohoras', {err: err});
    }
  })
};

/**
 * Calcula o total de horas justificadas e salva
 *
 * @param dados
 * @param mes
 * @param msg
 * @param dia
 */
mesmanager.prototype.meshorajusti = function (dados, mes, msg, dia) {

  var me = this;

  var novosdados = {};
  novosdados.bancodehorasjusti = (mes.bancodehorasjusti) ?
  mes.bancodehorasjusti + dados.valor : dados.valor;
  if (dia.minutojusti > 0 || dia.minutojusti  < 0)  novosdados.bancodehorasjusti -= dia.minutojusti;

  me.model.findByIdAndUpdate(mes._id, {$set: novosdados}, function (err, res) {
    if (err) {
      console.log('erro ao atualizar bancodehorasjusti do mes', err);
      me.emitManager(msg, '.error.ajustada', {err: err});
    } else {
      me.emitManager(msg, '.ajustada', {res: res});
    }
  });
};

/**
 * Encontra/cria dia para adicionar horas justificadas
 *
 * @param dados
 * @param mes
 * @param msg
 */
mesmanager.prototype.addhoradia = function (dados, mes, msg) {

  var me = this;
  me.modeldia = require('../model/dia.js');

  var querydia = {
    data: dados.data.dia,
    mes: mes._id
  };

  me.modeldia.findOne(querydia).exec(function (errDia, resDia) {
    if (errDia) {
      console.log('erro ao buscar dia do mes', errDia);
      me.emitManager(msg, '.error.ajustada', {err: errDia});
    } else {
      if (resDia === null) {//Precisa criar dia

        var novodia = {
          nome: me.diasemana[dados.data.diasemana],
          data: dados.data.dia,
          minutojusti: dados.valor,
          comentariojusti: dados.justi,
          mes: mes._id
        };

        me.modeldia.create(novodia, function (errDiaNovo, resDiaNovo) {
          if (errDiaNovo) {
            console.log('erro ao criar dia novo', errDiaNovo);
            me.emitManager(msg, '.error.ajustada', {err: errDiaNovo});
          } else {
            me.meshorajusti(dados, mes, msg, {});
          }
        });
      } else {//Precisa atualizar dia

        var setDia = {
          minutojusti: dados.valor,
          comentariojusti: dados.justi
        };

        me.modeldia.findByIdAndUpdate(resDia._id, {$set: setDia},
          function (errDiaAtu, resDiaAtu) {
            if (errDiaAtu) {
              console.log('erro ao atualizar dia novo', errDiaAtu);
              me.emitManager(msg, '.error.ajustada', {err: errDiaAtu});
            } else {
              me.meshorajusti(dados, mes, msg, resDiaAtu);
            }
          });
      }
    }
  });
};

/**
 * Encontra/cria mes para adicionar horas justificadas
 *
 * @param msg
 */
mesmanager.prototype.addhorames = function (msg) {

  var me = this;
  var dados = msg.getRes();

  if (dados.idusuario == null || dados.idusuario == undefined ||
    dados.data.mes == null || dados.data.mes == undefined ||
    dados.data.ano == null || dados.data.ano == undefined) return;

  var querymes = {
    nome: me.mes[dados.data.mes],
    ano: dados.data.ano,
    usuario: dados.idusuario
  };

  this.model.findOne(querymes).exec(function (errMes, resMes) {
    if (errMes) {
      console.log('erro ao buscar mes', errMes);
      me.emitManager(msg, '.error.ajustada', {err: errMes});
    } else {
      if (resMes === null) {//Precisa criar mes

        var novomes = {
          nome: me.mes[dados.data.mes],
          ano: dados.data.ano,
          fechado: false,
          usuario: dados.idusuario,
          bancodehoras: me.calc_total_horas(dados.data.ano, me.mes[dados.data.mes]),
          horasjuros: 0,
        };

        me.model.create(novomes, function (errMesNovo, resMesNovo) {
          if (errMesNovo) {
            console.log('erro ao criar mes novo', errMesNovo);
            me.emitManager(msg, '.error.ajustada', {err: errMesNovo});
          } else {
            me.addhoradia(dados, resMesNovo, msg);
          }
        });

      } else {
        console.log('mes????', resMes);
        if (resMes.fechado) {
        //  todo deve atualizar horasdividas do usuario
        } else {
          me.addhoradia(dados, resMes, msg);
        }
      }
    }
  });
};

/**
 * Pega todos os dias com minutos justificados
 * @param msg
 */
mesmanager.prototype.encontraMesJusti = function (msg) {

  var me = this;
  var dados = msg.getRes();
  me.modeldia = require('../model/dia.js');

  var querymes = {
    nome: me.mes[dados.mes],
    ano: dados.ano,
    usuario: dados.usuario._id
  };

  this.model.findOne(querymes).exec(function(err, res) {
    if (err) {
      console.log('erro ao buscar mes', err);
      me.emitManager(msg, '.error.readed', {err: err});
    } else if (res != null) {
      me.modeldia.find( {
        "$query": {
          mes: res._id,
          minutojusti: {$ne:null}
        },
        "$orderby": {
          data: -1
        }
      }, function(errDia, resDia) {
        if (errDia) {
          console.log('erro ao buscar dia', errDia);
          me.emitManager(msg, '.error.readed', {err: errDia});
        } else {
          me.emitManager(msg, '.readed', {res: resDia});
        }
      });
    }
  });
};

mesmanager.prototype.wiring = function () {
  var me = this;
  me.listeners['banco.mes.*'] = me.executaCrud.bind(me);
  me.listeners['bateuponto'] = me.entrada.bind(me);
  me.listeners['rtc.relatorio.read'] = me.findMesEscolhido.bind(me);
  me.listeners['rtc.relatoriojusti.read'] = me.encontraMesJusti.bind(me);
  me.listeners['bancodehoras.update'] = me.updatebancodehoras.bind(me);
  me.listeners['rtc.horadia.ajuste'] = me.addhorames.bind(me);

  for (var name in me.listeners) {
    hub.on(name, me.listeners[name]);
  }
};

module.exports = new mesmanager();