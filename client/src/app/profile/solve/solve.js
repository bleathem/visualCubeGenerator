'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.profile.solve', [
    'ui.router',
    'cube.scramble.services',
    'user'
    ])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.profile-solve', {
        url: '/profile/:userId/solve/:solveId',
        templateUrl: 'app/profile/solve/solve.tpl.html',
        controller: 'ProfileSolveController'
      });
  })

  .controller('ProfileSolveController', function ($scope, $stateParams, userManager, solveModel) {
    userManager.getSolve($stateParams.userId, $stateParams.solveId)
      .then(function(response) {
        $scope.profile = response.user;
        $scope.solve = response.solve;
      }, function(error) {
        $scope.profileMessage = error.message;
      });
  })
  ;
})(angular);
