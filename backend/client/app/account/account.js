(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.account', [
    'ui.router',
    'oauth',
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

  .controller('AccountController', ['$scope', 'googleapi', 'auth', 'synchSolves', function ($scope, googleapi, auth, synchSolves) {
    $scope.auth = auth;
    $scope.authorize = function() {
      googleapi.authorize().then(function(user) {
        auth.setUser(user);
        synchSolves();
      }, function(error) {
        $scope.message = '** Error **: ' + error.message;
        console.log(error);
      });
    };
    $scope.logout = function() {
      auth.logout();
    };
  }]);
})(angular);
