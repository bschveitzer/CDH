/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope','$location', 'utilvalues', function ($scope,$location, utilvalues) {

    $scope.classes = utilvalues.rotaatual;

    $scope.trocaRota=function (local) {
        limpanav(local, function () {
            utilvalues.rotaatual[local] = 'active';
            $location.path('/'+local);
        });
    };

    var limpanav = function (local, cb) {
        for(var id in $scope.classes){
            utilvalues.rotaatual[id] = '';
        }
        cb();
    };

}]);