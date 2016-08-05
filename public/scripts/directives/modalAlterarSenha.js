/**
 * Created by labtic on 30/06/2016.
 */
app.directive('modalalterarsenha', ['getUserLogado','md5', function(getUserLogado, md5) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalAlterarSenha.html',

        link: function (scope) {
            var me = this;
            me.listeners = {};
            scope.logado = getUserLogado.getLogado();


            scope.trocasenha = function () {
                if (scope.logado.senha != md5.createHash(scope.logado.senhaantiga)) {
                    $('#erroUm').modal();
                    return;
                }
                else if (scope.logado.novasenha != scope.logado.novasenha1) {
                    $('#erroDois').modal();
                    return;
                }
                scope.logado.senha = scope.logado.novasenha;
                var user = new Mensagem(me, 'usuario.update', scope.logado, 'usuario');
                user._dado.senha = md5.createHash(user._dado.senha);
                user._dado.senhaantiga = md5.createHash(user._dado.senhaantiga);
                user._dado.novasenha = md5.createHash(user._dado.novasenha);
                user._dado.novasenha1 = md5.createHash(user._dado.novasenha1);
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
