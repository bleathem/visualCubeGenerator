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

  .directive('timerBegin', function() {
    return {
      restrict: 'A',
      link: function($scope, el) {
        angular.element(el).on('click', function() {
          $scope.$apply(function() {
            $scope.$parent.$broadcast('timer-start');
          });
        });
      }
    };
  })

  .directive('timerStop', function() {
    return {
      restrict: 'A',
      link: function($scope, el) {
        el.on('click', function() {
          $scope.$apply(function() {
            $scope.$parent.$broadcast('timer-stop');
          });
        });
      }
    };
  })

  .directive('timerKeyboardControl', function($document, $state) {
    return {
      restrict: 'E',
      scope: {
        timerStatus: '=',
        scramble: '=timerScramble'
      },
      link: function($scope) {
        var stopping = false;

        var getTimerState = function() {
          if ($scope.timerStatus.running) {
            return 'running';
          } else if ($scope.scramble.solveTime) {
            return stopping ? 'stopping' : 'finished';
          } else {
            return 'ready';
          }
        };

        var onKeyup = function(event) {
          if (event.keyCode === 32) {
            switch(getTimerState()) {
              case 'ready':
                $scope.$apply(function() {
                  $scope.$parent.$broadcast('timer-start');
                });
                break;
              case 'stopping':
                stopping = false;
                break;
              case 'finished':
                $state.go('visualCubeGenerator.main.scramble-list');
                break;
            }
          }
        };

        var onKeydown = function(event) {
          if (event.keyCode === 32) {
            switch(getTimerState()) {
              case 'running':
                $scope.$apply(function() {
                  stopping = true;
                  $scope.$parent.$broadcast('timer-stop');
                });
                break;
            }
          }
        };

        angular.element($document[0].body).on('keyup', onKeyup);
        angular.element($document[0].body).on('keydown', onKeydown);

        $scope.$on('$destroy', function() {
          angular.element($document[0].body).off('keyup', onKeyup);
          angular.element($document[0].body).off('keydown', onKeydown);
        });

      }
    };
  })
  ;
})(angular);
