'use strict';
(function (angular) {
  angular.module('user', ['oauth', 'visualCubeGenerator.config'])

  .factory('userManager', function($http, $q, auth, appConfig) {
    var userManager = {};

    userManager.getProfile = function(userId) {
      var deferred = $q.defer();
      var url = appConfig.backend + '/api/user/' + userId + '/profile';
      $http({
        method: 'get',
        url: url
      }).then(function(response) {
          deferred.resolve(response.data);
        }, function(response) {
          var message = response.data || '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    }

    userManager.getSolve = function(userId, solveId) {
      var deferred = $q.defer();
      var url = appConfig.backend + '/api/user/' + userId + '/solve/' + solveId;
      $http({
        method: 'get',
        url: url
      }).then(function(response) {
          deferred.resolve(response.data);
        }, function(response) {
          var message = response.data || '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    }

    userManager.createCategory = function(newCategory) {
      var deferred = $q.defer();
      if (!auth.user) {
        deferred.reject(new Error('User not logged in'));
        return deferred.promise;
      }
      var url = appConfig.backend + '/api/category/' + newCategory;
      $http({
        method: 'post',
        url: url
      }).then(function(response) {
          auth.setUser(response.data);
          deferred.resolve(auth.user);
        }, function(response) {
          var message = response.data || '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    }

    userManager.deleteCategory = function(deleteCategory) {
      var deferred = $q.defer();
      if (!auth.user) {
        deferred.reject(new Error('User not logged in'));
        return deferred.promise;
      }
      var url = appConfig.backend + '/api/category/' + deleteCategory;
      $http({
        method: 'delete',
        url: url
      }).then(function(response) {
          auth.setUser(response.data);
          deferred.resolve(auth.user);
        }, function(response) {
          var message = response.data || '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    }

    return userManager;
  })
})(angular);
