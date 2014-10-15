(function (angular) {
  'use strict';
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

    .controller('AccountCtrl', ['$scope', 'googleapi', 'auth', function ($scope, googleapi, auth) {
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
  ;
})(angular);
