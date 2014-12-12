'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.profile', [
    'ui.router',
    'user'
    ])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.profile', {
        url: '/profile/:userId',
        templateUrl: 'app/profile/profile.tpl.html',
        controller: 'ProfileController'
      });
  })

  .controller('ProfileController', function ($scope, $stateParams, userManager) {
    userManager.getProfile($stateParams.userId)
      .then(function(response) {
        $scope.profile = response.user;
        $scope.averages = response.averages;
      }, function(error) {
        $scope.profileMessage = error.message;
      });
  })
  ;
})(angular);
