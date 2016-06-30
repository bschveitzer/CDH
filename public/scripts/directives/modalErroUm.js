/**
 * Created by labtic on 30/06/2016.
 */
app.directive('modalerroum', ['getUserLogado', function(getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalErroUm.html',

        link: function (scope) {
            scope.logado = getUserLogado.getLogado();
        }
    };
}]);
