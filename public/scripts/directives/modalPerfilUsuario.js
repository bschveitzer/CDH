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
        }
    };

}]);