'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.scrambles', ['ui.router', 'cube.scramble.services'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.scrambles', {
        url: '/scrambles',
        templateUrl: 'app/scramble/list/scramble-list.tpl.html',
        controller: 'ScrambleListCtrl'
      });
  })

  .controller('ScrambleListCtrl', function ($scope, scrambles) {
    $scope.solves = [];

    $scope.scrambles = scrambles.all();

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
      scope: {
        index: '&selectIndex'
      },
      link: function($scope, el) {
        var selectScramble = function(index) {
          $state.go('visualCubeGenerator.main.scramble', {
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
