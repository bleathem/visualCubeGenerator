'use strict';
var angular = require('angular');
require('angular-timer');
require('vcg-scramble-services');
require('vcg-solve-services');


angular.module('visualCubeGenerator.main.scramble.detail', ['ui.router', 'cube.scramble.services', 'cube.solve.services', 'timer'])

.config(function ($stateProvider) {

  $stateProvider
    .state('visualCubeGenerator.main.scramble', {
      url: '/scramble/:scrambleId',
      templateUrl: 'app/scramble/detail/scramble-detail.tpl.html',
      controller: 'ScrambleCtrl'
    });
})

.controller('ScrambleCtrl', function ($scope, $stateParams, $document, scrambles, solveManager) {
  $scope.scramble = scrambles.get($stateParams.scrambleId);
  $scope.timer = {running: false};

  var onKeyup = function(event) {
    if (event.keyCode === 32) {
      $scope.$apply(function() {
        $scope.startTimer();
      });
    }
  };

  var onKeydown = function(event) {
    if (event.keyCode === 32) {
      $scope.$apply(function() {
        $scope.stopTimer();
      });
    }
  };

  angular.element($document[0].body).on('keyup', onKeyup);

  $scope.startTimer = function() {
    $scope.$broadcast('timer-start');
    $scope.timer.running = true;
    angular.element($document[0].body).off('keyup', onKeyup);
    angular.element($document[0].body).on('keydown', onKeydown);
  };

  $scope.stopTimer = function() {
    $scope.$broadcast('timer-stop');
    $scope.timer.running = false;
    angular.element($document[0].body).off('keydown', onKeydown);
  };

  $scope.$on('timer-stopped', function(event, data){
   if (! $scope.scramble.solveTime) {
     $scope.scramble.solveTime = data.millis;
     solveManager.save($scope.scramble);
   }
  });
})
;
