'use strict';
var angular = require('angular');
require('angular-ui-router');
require('../../components/oauth/oauth.js');
require('../../components/oauth/oauth-google.js');

angular.module('account', [
  'ui.router',
  'oauth',
  'oauth.google'
])

.config(['$stateProvider', function($stateProvider) {
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
}])

.controller('AccountCtrl', ['$scope', 'googleapi', 'auth', 'synchSolves', function ($scope, googleapi, auth, synchSolves) {
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
}])
;
