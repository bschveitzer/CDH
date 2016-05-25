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
    nome: {type: types.String, required: true},
    ano: {type: types.Number, required: true},
    fechado: {type: types.Boolean},
    usuario: {type: types.ObjectId, ref:'usuario', require: true}
});

new ctrbd(obj, 'mes');

module.exports = Mongoose.model('mes', obj);