/**
 * Created by Osvaldo on 06/10/15.
 */
var Mongoosemodels = {
    usuario: require('./UsuarioManager.js'),
    dia: require('./diaManager.js'),
    entrada: require('./entradaManager.js'),
    mes: require('./mesManager.js'),
    saida: require('./saidaManager.js'),
    semana: require('./semanaManager.js')
    
};

module.exports = Mongoosemodels;