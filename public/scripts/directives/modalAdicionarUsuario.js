/**
 * Created by labtic on 10/06/2016.
 */
app.directive('modaladicionarusuario', ['$location', '$route','md5', function($location, $route, md5){
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalAdicionarUsuario.html',

        link: function(scope){
            var me = this;
            me.listeners = [];
            
            scope.adicionaUsuario = {};
            
            scope.validonomeusuario = false;
            scope.validosobrenome= false;
            scope.validoemail= false;
            scope.validosenha= false;
            scope.validotelefone= false;
            scope.validotipo= false;
            scope.validoimagem= false;
            
            scope.validanomeuser = function () {
                if(scope.formAddUsuario.nome.$valid ){
                    scope.validonomeusuario = true;
                } else {
                    scope.validonomeusuario = false;
                }
            };
            scope.validasobrenomeuser = function () {
             if(scope.formAddUsuario.sobrenome.$valid) {
                 scope.validosobrenome = true;
             }else{
                 scope.validosobrenome = false;
             }
            };
            scope.validaemailuser = function () {
                if(scope.formAddUsuario.email.$valid) {
                    scope.validoemail = true;
                }else{
                    scope.validoemail = false;
                }
            };
            scope.validasenhauser = function () {
                if(scope.formAddUsuario.senha.$valid) {
                    scope.validosenha = true;
                }else{
                    scope.validosenha = false;
                }
            };
            scope.validatelefoneuser = function () {
                if(scope.formAddUsuario.numerocelular.$valid) {
                    scope.validotelefone = true;
                }else{
                    scope.validotelefone = false;
                }
            };
            scope.validatipouser = function () {
                if(scope.formAddUsuario.tipo.$valid) {
                    scope.validotipo = true;
                }else{
                    scope.validotipo = false;
                }
            };

            scope.adicionarusuario = function(){
                var user = new Mensagem(me, 'usuario.create', scope.adicionaUsuario, 'usuario');
                console.log('BIRL', user._dado.senha);
                user._dado.senha = md5.createHash(user._dado.senha);
                console.log('VOU ENVIAR', user);
                SIOM.emitirServer(user);
            };
        }
    };
}]);