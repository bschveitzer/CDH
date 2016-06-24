/**
 * Created by labtic on 23/06/2016.
 */
app.directive('modalsenhaatualizada', ['getUserLogado', function(getUserLogado) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/modalSenhaAtualizada.html',

        link: function (scope) {
            scope.logado = getUserLogado.getLogado();
        }
    };
}]);
