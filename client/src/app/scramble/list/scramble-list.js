'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.scramble.list', ['ui.router', 'cube.scramble.services'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.scramble-list', {
        url: '/scrambles',
        templateUrl: 'app/scramble/list/scramble-list.tpl.html',
        controller: 'ScrambleListCtrl'
      });
  })

  .controller('ScrambleListCtrl', function ($scope, scrambles, $timeout) {
    $scope.solves = [];

    $timeout(function() {
      $scope.scrambles = scrambles.all();
    })

    $scope.scramble = function() {
      scrambles.regenerate().then(function() {
        $scope.scrambles = scrambles.all();
      }, function(e) {
        throw e;
      });
    };
  })

  .directive('selectScramble', function($state) {
    return {
      restrict: 'A',
      scope: {
        index: '&selectIndex'
      },
      link: function($scope, el) {
        var selectScramble = function(index) {
          $state.go('visualCubeGenerator.main.scramble-detail', {
            scrambleId: index
          });
        };

        var onKey = function(event) {
          if (event.keyCode === 32) {
            event.stopPropagation();
            selectScramble($scope.index());
          }
        };

        el.on('keyup', onKey);
      }
    };
  })

  .directive('focusScramble', function($document, $timeout) {
    return {
      restrict: 'E',
      link: function() {
        $timeout(function() {
          var tabbables = $document[0].querySelectorAll('.tabbable');
          if (tabbables && tabbables[0]) {
            tabbables[0].focus();
          }
        });
      }
    };
  });
})(angular);
