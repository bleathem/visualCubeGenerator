'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.scramble.detail', ['ui.router', 'cube.scramble.services', 'cube.solve.services', 'timer'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.scramble-detail', {
        url: '/scramble/:scrambleId',
        templateUrl: 'app/scramble/detail/scramble-detail.tpl.html',
        controller: 'ScrambleCtrl'
      });
  })

  .controller('ScrambleCtrl', function ($scope, $stateParams, scrambles, solveManager, auth) {
    $scope.scramble = scrambles.get($stateParams.scrambleId);
    $scope.timerStatus = {
      running: false
    };

    $scope.$on('timer-start', function() {
      $scope.timerStatus.running = true;
    });

    $scope.$on('timer-stopped', function(event, data) {
      $scope.timerStatus.running = false;
      if (! $scope.scramble.solveTime) {
        $scope.scramble.solveTime = data.millis;
        if (auth.category) {
          $scope.scramble.category = auth.category;
        }
        solveManager.save($scope.scramble);
      }
    });
  })

  .directive('timerControl', function($document, $state, rx) {
    return {
      restrict: 'E',
      scope: {
        scramble: '=timerScramble'
      },
      link: function($scope, el) {
        var startButton = el[0].querySelector('.timerStart')
          , stopButton = el[0].querySelector('.timerStop');
        var startClicks = rx.Observable.fromEvent(startButton, 'mouseup')
          , stopClicks = rx.Observable.fromEvent(stopButton, 'mousedown');
        var keyups = rx.Observable.fromEvent(document, 'keyup')
                       .filter(function(event) {
                         return event.keyCode === 32
                       })
          , keydowns = rx.Observable.fromEvent(document, 'keydown')
                         .filter(function(event) {
                           return event.keyCode === 32
                         });

        rx.Observable.merge(startClicks, keyups).take(1)
          .flatMap(function(event) {
            $scope.$apply(function() {
              $scope.$parent.$broadcast('timer-start');
            });
            return rx.Observable.merge(stopClicks, keydowns).take(1)
              .flatMap(function() {
                $scope.$apply(function() {
                  $scope.$parent.$broadcast('timer-stop');
                });
                return keyups.skip(1).take(1);
              });
          }).subscribe(undefined, undefined, function() {
            $state.go('visualCubeGenerator.main.scramble-list');
          });
      }
    };
  })
  ;
})(angular);
