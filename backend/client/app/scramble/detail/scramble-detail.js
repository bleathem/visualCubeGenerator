(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.scramble.detail', ['ui.router', 'cube.scramble.services', 'cube.solve.services', 'timer'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.scramble', {
        url: '/scramble/:scrambleId',
        templateUrl: 'app/scramble/detail/scramble-detail.tpl.html',
        controller: 'ScrambleCtrl'
      });
  })

  .controller('ScrambleCtrl', ['$scope', '$stateParams', '$document', 'scrambles', 'solves', function ($scope, $stateParams, $document, scrambles, solves) {
    $scope.scramble = scrambles.get($stateParams.scrambleId);
    $scope.timerRunning = false;

    var onKeyup = function(event) {
      if (event.keyCode === 32) {
        $scope.startTimer();
      }
    };

    var onKeydown = function(event) {
      if (event.keyCode === 32) {
        $scope.stopTimer();
      }
    };

    angular.element($document[0].body).on('keyup', onKeyup);

    $scope.startTimer = function() {
      $scope.$broadcast('timer-start');
      $scope.timerRunning = true;
      angular.element($document[0].body).off('keyup', onKeyup);
      angular.element($document[0].body).on('keydown', onKeydown);
    };

    $scope.stopTimer = function() {
      $scope.$broadcast('timer-stop');
      $scope.timerRunning = false;
      angular.element($document[0].body).off('keydown', onKeydown);
    };

    $scope.$on('timer-stopped', function(event, data){
     if (! $scope.scramble.solveTime) {
       $scope.scramble.solveTime = data.millis;
       solves.save($scope.scramble).then(function() {
        $scope.$broadcast('solve-saved', $scope.scramble);
       }, function(error) {
         throw error;
       });
     }
    });
  }])
;
})(angular);
