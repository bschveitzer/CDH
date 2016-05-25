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
    horaEntrada: {type: types.Date, required: true},
    dia: {type: types.ObjectId, ref:'dia', require: true}
});

new ctrbd(obj, 'entrada');

module.exports = Mongoose.model('entrada', obj);