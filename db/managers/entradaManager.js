var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/entrada.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function entradamanager() {
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

  me.wiring();
}

utility.inherits(entradamanager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
entradamanager.prototype.executaCrud = function (msg) {
  var me = this;
  var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.') + 1);
  try {
    me[method](msg);
  } catch (e) {
    me.emitManager(msg, 'error.manager', {err: e});
  }
};

entradamanager.prototype.encontra_num_mes = function (nome_mes) {
  let me = this;
  for(let index in me.mes) {
    if (me.mes.hasOwnProperty(index)) {
      if(me.mes[index] === nome_mes) return index;
    }
  }
};

entradamanager.prototype.registraentrada = function (registro) {

  var me = this;
  var mes = registro.mes;
  me.model_mes = require('../model/mes.js');

  var entrada = {
    horaEntrada: registro.entrada,
    dia: registro.day
  };

  this.model.find({dia: registro.day._id}, function (err, res) {
    if (res) {
      // res.length != 0
      if (false) {
        var obj = {
          mes: mes,
          cbjaentrada: registro.cb,
          versaida: res[res.length - 1],
          cb: function () {
            me.model.create(entrada, function (err, res) {
              if (res) {
                registro.cb(res, mes);
              } else {
                console.log('deu erro no cria entrada', err);
              }
            });
          }
        };

        hub.emit('verificasaida', obj);

      } else {

        let querymes = {
          fechado: false,
          usuario: registro.mes.usuario
        };

        me.model_mes.find(querymes)
          .populate('usuario')
          .exec((err_mes, res_mes) => {
          if (err_mes) {
            console.log('deu erro ao pegar todos os meses em aberto', err_mes)
          } else {

            let data_atual = new Date();

            for(let index in res_mes) {
              if (res_mes[index].ano < data_atual.getFullYear()) {

                res_mes[index].fechado = true;
                res_mes[index].save()
                  .then((res_mes_update)=> {

                    let divida = parseInt(res_mes_update.bancodehoras/60000) -
                      res_mes_update.bancodehorasjusti;
                    let divida_atual = res_mes[0].usuario.horasdividas;
                    res_mes[0].usuario.horasdividas = (divida_atual > 0) ?
                      divida_atual + divida : divida;
                    res_mes[0].usuario.save()
                      .then((res_user_update) => {})
                      .catch((err_user_update) => {
                        console.log('erro update user', err_user_update);
                      });

                  })
                  .catch((err_mes_update)=>{
                    console.log('erro update mes fechado', err_mes_update);
                  });

              } else if (res_mes[index].ano === data_atual.getFullYear() &&
                me.encontra_num_mes(res_mes[index].nome) < data_atual.getMonth()) {

                res_mes[index].fechado = true;
                res_mes[index].save()
                  .then((res_mes_update)=> {

                    let horasjusti = (res_mes_update.bancodehorasjusti > 0) ?
                      res_mes_update.bancodehorasjusti : 0;
                    let divida = parseInt(res_mes_update.bancodehoras/60000) -
                      horasjusti;
                    let divida_atual = res_mes[0].usuario.horasdividas;
                    res_mes[0].usuario.horasdividas = (divida_atual > 0) ?
                      divida_atual + divida : divida;
                    res_mes[0].usuario.save()
                      .then((res_user_update) => {})
                      .catch((err_user_update) => {
                        console.log('erro update user', err_user_update);
                      });

                  })
                  .catch((err_mes_update)=>{
                    console.log('erro update mes fechado', err_mes_update);
                  });

              }
            }
          }
        });

        me.model.create(entrada, function (err, res) {
          if (res) {
            registro.cb(res, mes);
          } else {
            console.log('deu erro no cria entrada', err);
          }
        });
      }
    } else {
      console.log('deu erro', err);
    }
  });
};

entradamanager.prototype.getentradabydia = function (msg) {
  var me = this;
  var dado = msg.getRes();
  this.model.find({dia: {"$in": dado}}, function (err, res) {
    if (res) {
      msg.setRes(res);
      msg.setEvento('relatorio.getsaida');
      hub.emit(msg.getEvento(), msg);
    } else {
      me.emitManager(msg, '.erro.getentradabydia', {err: err});
    }
  });
};


entradamanager.prototype.wiring = function () {
  var me = this;
  me.listeners['banco.entrada.*'] = me.executaCrud.bind(me);
  me.listeners['entrada'] = me.registraentrada.bind(me);
  me.listeners['relatorio.getentrada'] = me.getentradabydia.bind(me);

  for (var name in me.listeners) {
    hub.on(name, me.listeners[name]);
  }
};

module.exports = new entradamanager();
