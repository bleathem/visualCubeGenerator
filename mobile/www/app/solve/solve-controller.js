angular.module('cube.solve', ['cube.solve.services'])

  .controller('SolvesCtrl', ["$scope", "Solves", function ($scope, solves) {
      $scope.solves = solves.solves();
      $scope.averages = solves.averages();

      $scope.delete = function(solve) {
        solves.delete(solve).then(function() {
          $scope.$broadcast("solve-deleed", solve);
        });

      }
  }])
;
