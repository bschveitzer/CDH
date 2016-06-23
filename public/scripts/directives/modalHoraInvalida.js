/**
 * Created by labtic on 23/06/2016.
 */
app.directive('modalhorainvalida', ['getUserLogado', function(getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalHoraInvalida.html',

        link: function (scope) {
            var me = this;
            scope.logado = getUserLogado.getLogado();
        }
    };
}]);