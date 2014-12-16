'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.solve.detail', ['ui.router'
    , 'ui.bootstrap'
    , 'cube.scramble.services'
    , 'cube.solve.services'
    , 'timer'
    , 'html.helpers'
  ])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.solve-detail', {
        url: '/solve/:solveId',
        templateUrl: 'app/solve/detail/solve-detail.tpl.html',
        controller: 'SolveCtrl'
      });
  })

  .controller('SolveCtrl', function ($scope, $state, $stateParams, solveModel, solveManager, confirm, auth) {
    $scope.solve = solveModel.get($stateParams.solveId);
    $scope.deleteSolve = function(solve) {
      confirm('Are you sure you want to delete this solve?')
        .then(solveManager.deleteSolve(solve))
        .then(function() {
          $state.go('visualCubeGenerator.main.solve-list');
        });
    };
    $scope.getSolveUrl = function() {
      return $state.href('visualCubeGenerator.main.profile-solve', {userId: auth.user._id, solveId: $scope.solve._id}, {absolute: true});
    }
  })
  ;
})(angular);
