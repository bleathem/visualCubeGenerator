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

  .controller('ScrambleCtrl', ['$scope', '$stateParams', '$location', 'scrambles', 'solves', function ($scope, $stateParams, $location, scrambles, solves) {
    $scope.scramble = scrambles.get($stateParams.scrambleId);

    $scope.startTimer = function() {
      $scope.$broadcast('timer-start');
    };

    $scope.stopTimer = function() {
      $scope.$broadcast('timer-stop');
    };

     $scope.$on('timer-stopped', function (event, data){
       if (! $scope.scramble.time) {
         $scope.scramble.time = data.millis;
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
