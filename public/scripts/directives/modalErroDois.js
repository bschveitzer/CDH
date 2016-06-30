/**
 * Created by labtic on 30/06/2016.
 */
app.directive('modalerrodois', ['getUserLogado', function(getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalErroDois.html',

        link: function (scope) {
            scope.logado = getUserLogado.getLogado();
        }
    };
}]);