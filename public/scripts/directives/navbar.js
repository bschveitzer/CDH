/**
 * Created by udesc on 21/05/2016.
 */
app.directive("navbar", ['$location', 'utilvalues', function($location, utilvalues) {
    return {
        restrict : 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/navbar.html',

        link: function(scope, element){
            
            scope.classes = utilvalues.rotaatual;

            var limpanav = function (ponde, cb) {
                for(var id in scope.classes){
                    utilvalues.rotaatual[id] = '';
                }
                cb();
            };

            scope.navega = function (ponde) {
                limpanav(ponde, function () {
                    utilvalues.rotaatual[ponde] = 'active';
                    $location.path('/'+ponde);
                });
            }
        }
    };
}]);
