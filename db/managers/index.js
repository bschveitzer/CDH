var Mongoosemodels = {
    usuario: require('./UsuarioManager.js'),
    dia: require('./diaManager.js'),
    entrada: require('./entradaManager.js'),
    mes: require('./mesManager.js'),
    saida: require('./saidaManager.js')
    
};

module.exports = Mongoosemodels;