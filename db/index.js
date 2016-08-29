/**
 * Created by Osvaldo on 13/03/15.
 */
  //require('./bdteste.js');
var hub = require('../hub/hub.js');
var Managers = null;

/**
 * se escutar 'banco.status.ready' no hub, carrega os managers que seraão usados e da um emit informando que o banco está
 * pronto.
 */
hub.on('banco.status.ready', function(){

    Managers = require('./managers/');

    process.nextTick(function(){
        hub.emit('banco.ready');
    });
});

var banco = require('./Banco.js');