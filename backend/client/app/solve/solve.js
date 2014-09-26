(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.solve', ['ui.router'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.solve', {
        url: '/solve',
        templateUrl: 'app/solve/solve.tpl.html',
        controller: 'SolveController'
      });
  })
  .controller('SolveController', function ($scope) {
    $scope.solves = [];
  });

})(angular);
