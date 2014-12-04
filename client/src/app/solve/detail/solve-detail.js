'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.solve.detail', ['ui.router', 'ui.bootstrap', 'cube.scramble.services', 'cube.solve.services', 'timer'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.solve-detail', {
        url: '/solve/:solveId',
        templateUrl: 'app/solve/detail/solve-detail.tpl.html',
        controller: 'SolveCtrl'
      });
  })

  .factory('confirm', function($window, $q) {
    var prompt = function(message) {
      var deferred = $q.defer();
      if ($window.confirm(message)) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
      return deferred.promise;
    }
    return prompt;
  })

  .controller('SolveCtrl', function ($scope, $state, $stateParams, solveModel, solveManager, confirm) {
    $scope.solve = solveModel.get($stateParams.solveId);
    $scope.deleteSolve = function(solve) {
      confirm('Are you sure you want to delete this solve?')
        .then(solveManager.deleteSolve(solve))
        .then(function() {
          $state.go('visualCubeGenerator.main.solve-list');
        });
    };
  })
  ;
})(angular);
