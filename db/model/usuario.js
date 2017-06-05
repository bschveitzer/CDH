/**
 * Created by Osvaldo on 06/10/15.
 */
var ctrbd = require('../../util/ctrbd.js');
var Mongoose = require('../Banco.js').mongoose;

var types = Mongoose.Schema.Types;

var options = {
    toJSON: {
        getters: true
    },
    toObject: {
        getters: true
    }
};

var obj = Mongoose.Schema({
    nome: {type: types.String, required: true},
    sobrenome: {type: types.String, required: true},
    email: {type: types.String, required: true},
    senha: {type: types.String, required: true},
    numerocelular: {type: types.String},
    foto: {type: types.String},
    tipo: {type: types.Number, required: true},
    horasdividas: {type: types.Number, required: false},
});

new ctrbd(obj, 'usuario');

module.exports = Mongoose.model('usuario', obj);