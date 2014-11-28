'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.account', [
    'ui.router',
    'oauth',
    'oauth.google'])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.account', {
        url: '/account',
        templateUrl: 'app/account/account.tpl.html',
        controller: 'AccountController'
      });
  })

  .service('bewit', function($http, $q, appConfig, auth) {
    return {
      getBewitCode: function() {
        var deferred = $q.defer();
        if (!auth.user) {
          deferred.reject(new Error('User not logged in'));
          return deferred.promise;
        }
        var url = appConfig.backend + '/bewit/code';
        $http({
          method: 'get',
          url: url
        }).then(function(response) {
            deferred.resolve(response.data);
          }, function(response) {
            var message = '#' + response.status + ' - ' + response.statusText;
            deferred.reject(new Error(message));
          });
        return deferred.promise;
      }
    };
  })

  .controller('AccountController', function ($scope, $window, $timeout, googleapi, auth, synchSolves, bewit) {
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
    $scope.getFile = function() {
      var popup = $window.open();
      bewit.getBewitCode().then(function(url) {
        popup.location = url;
        $timeout(function() {
          popup.close();
        });
      }, function(err) {
        angular.element(popup.body).append(err);
      });
    };
  });
})(angular);
