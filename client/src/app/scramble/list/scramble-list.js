'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.scramble.list', ['ui.router', 'cube.scramble.services', 'rx'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.scramble-list', {
        url: '/scrambles',
        templateUrl: 'app/scramble/list/scramble-list.tpl.html',
        controller: 'ScrambleListCtrl'
      });
  })

  .controller('ScrambleListCtrl', function ($scope, scrambles, $timeout, auth) {
    $scope.solves = [];
    $scope.auth = auth;

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

  .directive('selectScramble', function($state, rx, $timeout) {
    return {
      restrict: 'A',
      scope: {
        index: '&selectIndex'
      },
      link: function($scope, el) {
        var observable = rx.Observable.fromEvent(el, 'keyup')
          .filter(function(event) {
            return event.keyCode === 32;
          })
          .take(1)
          .map(function(event) {
            return $scope.index();
          });

        observable.subscribe(function(index) {
          $timeout(function() {
          $state.go('visualCubeGenerator.main.scramble-detail', {
            scrambleId: index
          });
        })
        });
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
