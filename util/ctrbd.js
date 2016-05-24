/**
 * Created by udesc on 21/05/2016.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('./mensagem.js');

function controlemodelbd(model, quem) {
    var me = this;
    me.modelo = {};
    me.sou = quem;

    me.criamodel(model);
}

controlemodelbd.prototype.montaarray = function (model, cb) {
    var me = this;
    var ret = {};

    for(var atributo in model){
        var tipo = model[atributo].instance;
        if(tipo == 'Array'){
            me.montaarray(model[atributo].schema.paths, function (res) {
                ret[atributo] = res;
            });
        } else {
            ret[atributo] = tipo;
        }
    }

    cb(ret);

};

controlemodelbd.prototype.criamodel = function (model) {
    var me = this;
    var ozmodel = model.paths;

    for(var atributo in ozmodel){
        var tipo = ozmodel[atributo].instance;
        if(tipo == 'Array'){
            me.montaarray(ozmodel[atributo].schema.paths, function (res) {
                me.modelo[atributo] = [res];
            });
        }
        else if(atributo != '_id' && tipo == 'ObjectID'){
            me.modelo[atributo] = {referencia: ozmodel[atributo].options.ref}
        }else {
            me.modelo[atributo] = tipo;
        }
    }
    var msg = new Mensagem(me, 'modelo', {nome: me.sou, modelo: me.modelo}, 'modelo');
    hub.emit(msg.getEvento(), msg);

};

module.exports = controlemodelbd;