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

  .controller('AccountController', function ($scope, $state, $window, $timeout, $q, googleapi, auth, synchSolves, bewit, solveManager, confirm, userManager) {
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
      setActiveCategory('');
      synchSolves().then(function() {
        auth.logout()
      });
    };
    $scope.getProfileUrl = function() {
      return $state.href('visualCubeGenerator.main.profile', {userId: auth.user._id}, {absolute: true});
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

    $scope.selectedCategory = auth.category;

    var setActiveCategory = function(category) {
      auth.category = category;
      $scope.selectedCategory = category;
      auth.setUser(auth.user);
      synchSolves();
    }

    $scope.addNewCategory = function() {
      userManager.createCategory($scope.newCategory).then(function() {
        setActiveCategory($scope.newCategory);
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
      var activeCategory = (auth.category === deleteCategory) ? '' : auth.category;

      confirm('Are you sure you want to delete the selected category and all it\'s associated solves?')
        .then(userManager.deleteCategory(deleteCategory))
        .then(function() {
          setActiveCategory(activeCategory);
        })
        ;
    }
    $scope.selectCategory = function() {
      setActiveCategory($scope.selectedCategory);
    }
  });
})(angular);
