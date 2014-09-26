angular.module('cube.scrambles', ['cube.scramble.services'])

  .controller('ScramblesCtrl', ["$scope", "$ionicLoading", "Scrambles", function ($scope, $ionicLoading, scrambles) {
    $scope.scrambles = scrambles.all();

    $scope.scramble = function() {
      $ionicLoading.show();
      scrambles.regenerate().then(function() {
        $scope.scrambles = scrambles.all();
        $ionicLoading.hide();
      }, function(e) {
        $ionicLoading.hide();
        throw e;
      });
    }
  }])
;
