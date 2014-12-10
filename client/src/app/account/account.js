'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.account', [
    'ui.router',
    'oauth',
    'user',
    'oauth.google',
    'html.helpers'])

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

  .controller('AccountController', function ($scope, $window, $timeout, $q, googleapi, auth, synchSolves, bewit, solveManager, confirm, userManager) {
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
    $scope.deleteStatus = {
      message: null,
      class: null
    };
    $scope.deleteAll = function() {
      confirm('Are you sure you want to delete all your saved solves?')
        .then(solveManager.deleteAllSolves)
        .then(function(message) {
          $scope.deleteStatus.message = message;
          $scope.deleteStatus.class = "info";
          $timeout(function() {
            $scope.deleteStatus = {
              message: null,
              class: null
            };
          }, 5000)
        }, function(message) {
          $scope.deleteStatus.message = message;
          $scope.deleteStatus.class = "danger";
          $timeout(function() {
            $scope.deleteStatus = {
              message: null,
              class: null
            };
          }, 5000)
        });
    };
    $scope.selectedCategory = auth.user ? auth.user.category : '';
    $scope.addNewCategory = function() {
      userManager.createCategory($scope.newCategory).then(function() {
        auth.user.category = $scope.newCategory;
        $scope.selectedCategory = $scope.newCategory;
        $scope.newCategory = '';
      }, function(error) {
        $scope.addNewCategoryMessage = error.message;
        $timeout(function() {
          $scope.addNewCategoryMessage = null;
        }, 5000)

      });
    };
    $scope.deleteCategory = function() {
      var deleteCategory = $scope.selectedCategory;
      if (auth.user.category === deleteCategory) {
        auth.user.category = '';
      }
      var activeCategory = auth.user.category;
      confirm('Are you sure you want to delete the selected category?')
        .then(userManager.deleteCategory(deleteCategory))
        .then(function() {
          auth.user.category = activeCategory;
          $scope.selectedCategory = activeCategory;
        })
        ;
    }
  });
})(angular);
