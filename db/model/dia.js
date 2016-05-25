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
    data: {type: types.Date, required: true},
    semana: {type: types.ObjectId, ref:'semana', require: true}
});

new ctrbd(obj, 'dia');

module.exports = Mongoose.model('dia', obj);