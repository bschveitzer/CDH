/**
 * Created by labtic on 14/06/2016.
 */
app.directive('modalperfilusuario', ['getUserLogado', function(getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalPerfilUsuario.html',

        link: function (scope) {
            var me = this;
            scope.logado = getUserLogado.getLogado();
        }
    };
}]);