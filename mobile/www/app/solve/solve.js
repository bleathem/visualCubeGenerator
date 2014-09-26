angular.module('cube.solve', ['cube.solve.services'])

.config(function($stateProvider) {
  $stateProvider
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'app/solve/solve.tpl.html',
          controller: 'SolvesCtrl'
        }
      }
    });
  })

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
