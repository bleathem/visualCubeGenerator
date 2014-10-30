(function (angular) {
  'use strict';
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

    .controller('SolvesCtrl', ['$scope', 'solveModel', 'solveManager', function ($scope, solveModel, solveManager) {
      $scope.solveModel = solveModel;
      $scope.delete = solveManager.delete;
    }])
  ;
})(angular);
