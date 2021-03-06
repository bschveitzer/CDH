/**
 * Created by Osvaldo/Gustavo on 22/10/15.
 */

function ConfigRotas($routeProvider) {
    var me = this;
    me.route = $routeProvider;

    me.rotas = {};

    me.incluiRota = function(){
        me.route.when('/home', {templateUrl: '../views/home.html', controller: 'homeController'});
        me.route.when('/entidades', {templateUrl: '../views/entidades.html', controller: 'entidadesController'});
        me.route.when('/relatorio', {templateUrl: '../views/relatorio.html', controller: 'relatorioController'});
    };
    me.incluiRotaRelat = function(){
        me.route.when('/home', {templateUrl: '../views/relatorio.html', controller: 'relatorioController'});
    };

    me.setaRota = function(tipoUser){
        if(tipoUser != undefined){
            me.incluiRota();
        }

        for(var name in me.rotas){
            me.route.when(name, me.rotas[name]);
        }
        
        SIOM.emit('rotasetada');
    };

    me.setaRotaRelat = function(tipoUser){
        if(tipoUser != undefined){
            me.incluiRotaRelat();
        }

        for(var name in me.rotas){
            me.route.when(name, me.rotas[name]);
        }

        SIOM.emit('rotasetada');
    };

    me.wiring = function(){

        me.route.when('/', {templateUrl: '../views/login.html', controller: 'loginController'});
        SIOM.on('setarota', me.setaRota.bind(me));
        SIOM.on('setarotaRelat', me.setaRotaRelat.bind(me));

    };

    me.wiring();
}

app.config(ConfigRotas);