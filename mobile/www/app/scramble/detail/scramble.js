/* global window:false */
(function (angular) {
  'use strict';
  angular.module('cube.scramble', ['cube.scramble.services', 'cube.solve.services', 'timer'])

    .config(function($stateProvider) {
      $stateProvider
        .state('tab.scramble-detail', {
          url: '/scramble/:scrambleId',
          views: {
            'tab-scrambles': {
              templateUrl: 'app/scramble/detail/scramble.tpl.html',
              controller: 'ScrambleCtrl'
            }
          }
        });
    })

    .controller('ScrambleCtrl', ['$scope', '$stateParams', '$location', '$ionicModal', 'scrambles', 'solves', function ($scope, $stateParams, $location, $ionicModal, scrambles, solves) {
      if (scrambles.length === 0) {
        $location.path('/tab/scrambles');
      }
      $scope.scramble = scrambles.get($stateParams.scrambleId);

      $scope.startTimer = function() {
        $scope.$broadcast('timer-start');
        if (window.StatusBar) {
          window.StatusBar.hide();
        }
        $scope.modal.show();
      };

      $scope.stopTimer = function() {
        $scope.$broadcast('timer-stop');
        if (window.StatusBar) {
          window.StatusBar.show();
        }
        $scope.modal.hide();
      };

       $scope.$on('timer-stopped', function (event, data){
         if (! $scope.scramble.solveTime) {
           $scope.scramble.solveTime = data.millis;
           solves.save($scope.scramble).then(function() {
            $scope.$broadcast('solve-saved', $scope.scramble);
           }, function(error) {
             throw error;
           });
         }
       });

      $ionicModal.fromTemplateUrl('app/scramble/detail/timer-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
    }])
  ;
})(angular);
