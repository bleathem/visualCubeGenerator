'use strict';
(function (angular) {
  angular.module('account', [
    'ui.router',
    'oauth',
    'oauth.google',
    'html.helpers',
    'http.helpers'
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

  .controller('AccountCtrl', function ($scope, $timeout, $window, googleapi, auth, bewit, synchSolves, confirm, solveManager) {
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
      synchSolves().then(function() {
        auth.logout()
      });
    };
    $scope.getFile = function() {
      var popup;
      if (!$window.cordova) {
        popup = $window.open();
      }
      bewit.getBewitCode().then(function(url) {
        if ($window.cordova) {
          popup = $window.open(url, '_system');
        } else {
          popup.location = url;
          $timeout(function() {
            popup.close();
          });
        }
      }, function(err) {
        // angular.element(popup.body).append(err);
      });
    };
    $scope.deleteStatus = {
      message: null
    };
    $scope.deleteAll = function() {
      confirm('Are you sure you want to delete all your saved solves?')
        .then(solveManager.deleteAllSolves)
        .then(function(message) {
          $scope.deleteStatus.message = message;
          $timeout(function() {
            $scope.deleteStatus = {
              message: null,
              class: null
            };
          }, 5000)
        }, function(message) {
          $scope.deleteStatus.message = message;
          $timeout(function() {
            $scope.deleteStatus = {
              message: null,
              class: null
            };
          }, 5000)
        });
    };
  })
  ;
})(angular);
