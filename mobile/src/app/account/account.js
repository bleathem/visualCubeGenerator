'use strict';
(function (angular) {
  angular.module('account', [
    'ui.router',
    'oauth',
    'oauth.google'
  ])

  .config(function($stateProvider) {
    $stateProvider
      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'app/account/account.tpl.html',
            controller: 'AccountCtrl'
          }
        }
      });
  })

  .controller('AccountCtrl', function ($scope, googleapi, auth, synchSolves) {
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
  })
  ;
})(angular);
