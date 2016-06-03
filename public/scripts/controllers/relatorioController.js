/**
 * Created by labtic on 01/06/2016.
 */
app.controller("relatorioController",['$scope','$location', 'utilvalues', function ($scope,$location, utilvalues) {

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