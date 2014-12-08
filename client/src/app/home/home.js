'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.home', ['ui.router'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.home', {
        url: '/home',
        templateUrl: 'app/home/home.tpl.html',
        controller: 'HomeController'
      });
  })

  .controller('HomeController', function ($scope) {
    $scope.solves = [];
  })

  .directive('scrambleShortcutKey', function($state, $document) {
    return {
      restrict: 'E',
      link: function($scope, $el) {
        var onKey = function(event) {
          if (event.keyCode === 32) {
            $state.go('visualCubeGenerator.main.scramble-list');
          }
        };

        angular.element($document[0].body).on('keyup', onKey);
        $scope.$on('$destroy', function() {
          angular.element($document[0].body).off('keyup', onKey);
        });
      }
    };
  })
  ;
})(angular);
