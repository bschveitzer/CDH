/**
 * Created by labtic on 14/06/2016.
 */
app.directive('modalperfilusuario',['$location', 'utilvalues', 'getUserLogado', function ($location, utilvalues, getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalPerfilUsuario.html',

        link: function (scope) {
            var me = this;
            me.listeners = [];
            scope.logado = getUserLogado.getLogado();

            scope.validaantigasenha = false;
            scope.validosenha2 = false;

            scope.validasenhaantiga = function () {
                if(scope.logado.senha == scope.logado.senhaantiga){
                    scope.validaantigasenha = true;
                }else{
                    scope.validaantigasenha = false;
                }
            };

            scope.validasenhadois = function () {
                if(scope.logado.novasenha == scope.logado.novasenha1){
                    scope.logado.validosenha2 = true;
                }else{
                    scope.logado.validosenha2 = false;
                }
            };

            scope.trocasenha = function () {
                if (scope.logado.senha != scope.logado.senhaantiga) {
                    console.log('deu erro 1');
                    return;
                }
                else if (scope.logado.novasenha != scope.logado.novasenha1) {
                    console.log('deu erro 2');
                    return;
                }
                scope.logado.senha = scope.logado.novasenha;
                var user = new Mensagem(me, 'usuario.update', scope.logado, 'usuario');
                console.log('entrou aqui');
                SIOM.emitirServer(user);
            };

             var usuarioatualizado = function () {
                 $('#senhaAtualizada').modal();
            };

            me.wiring = function(){
                    me.listeners['usuario.updated'] = usuarioatualizado.bind(me);

                    for(var name in me.listeners){
                        SIOM.on(name, me.listeners[name]);

                    }
            };
            me.wiring();
        }
    };

}]);