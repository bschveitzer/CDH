(function(){
    var instance;
    var socket = io();


    var SIOM = function() {
        var me = this;

        me.logar = function(msg){
            socket.emit('logar', msg.toServer());
        };

        me.emitirServer = function(mensagem){
            console.log('pedindo', mensagem.getEvento());
            socket.emit(mensagem.getEvento(), mensagem.toServer());
        };

        me.trataEventoRecebido = function(ms){
            console.log('escutei evento', ms.evento);
            var mensagem  = new Mensagem(me);
            mensagem.fromServer(ms);
            me.emit(mensagem.getEvento(), mensagem);
        };

        me.wiring = function(){
            var me = this;
            socket.on('retorno', me.trataEventoRecebido.bind(me));

        };
        me.wiring();
    };

    SIOM.prototype=  new EventEmitter2({
        wildcard: true,
        newListener: true,
        maxListeners:200
    });

    SIOM.prototype.constructor = SIOM;

    window.SIOM = new SIOM();

})();