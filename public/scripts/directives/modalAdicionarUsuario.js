/**
 * Created by labtic on 10/06/2016.
 */
app.directive('modaladicionarusuario', ['$location', '$route', function($location, $route){
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalAdicionarUsuario.html',

        link: function(scope){
            var me = this;
            me.listeners = [];
            
            scope.adicionarUsuario = {};
            
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
            scope.validaimagemuser = function () {
                if(scope.formAddUsuario.imagem.$valid) {
                    scope.validoimagem = true;
                }else{
                    scope.validoimagem = false;
                }
            };
            
            

            scope.adicionarusuario = function(){
                
                console.log('teste aqui', scope.adicionarUsuario);


                return;
                
                var user = new Mensagem(me, 'usuario.create', scope.adicionarUsuario, 'usuario');
                SIOM.emitirServer(user);
            };
        }
    };
}]);