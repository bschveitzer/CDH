/**
 * Created by labtic on 25/05/2016.
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
    hora: {type: types.Date},
    previsao: {type: types.Date, required: true},
    resposta: {type: types.Boolean, require: true},
    entrada: {type: types.ObjectId, ref:'entrada', require: true}});

new ctrbd(obj, 'saida');

module.exports = Mongoose.model('saida', obj);