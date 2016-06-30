/**
 * Created by labtic on 30/06/2016.
 */
app.directive('modalalterarsenha', ['getUserLogado', function(getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalAlterarSenha.html',

        link: function (scope) {
            var me = this;
            scope.logado = getUserLogado.getLogado();

            scope.trocasenha = function () {
                if (scope.logado.senha != scope.logado.senhaantiga) {
                    $('#erroUm').modal();
                    return;
                }
                else if (scope.logado.novasenha != scope.logado.novasenha1) {
                    $('#erroDois').modal();
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
