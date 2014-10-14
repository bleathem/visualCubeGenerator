(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.account', [
    'ui.router',
    'oauth.google'
  ])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.account', {
        url: '/account',
        templateUrl: 'app/account/account.tpl.html',
        controller: 'AccountController'
      });
  })
  .controller('AccountController', ['$scope', 'googleapi', 'auth', function ($scope, googleapi, auth) {
    $scope.user = auth.user;
    $scope.authorize = function() {
      googleapi.authorize().then(function(user) {
        auth.setUser(user);
        $scope.user = user;
      }, function(error) {
        $scope.message = '** Error **: ' + error.message;
        console.log(error);
      });
    };
    $scope.logout = function() {
      auth.logout();
      $scope.user = null;
    }
  }])
})(angular);
