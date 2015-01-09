/* global window:false */
'use strict';
(function (angular) {
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

    .factory('insomnia', function($window, $log) {
      var stub = {
        keepAwake: function() {
          $log.debug('keepawake stub called');
        },
        allowSleepAgain: function() {
          $log.debug('allowSleepAgain stub called');
        }
      };

      var getInsomnia = function() {
        if ($window.plugins && $window.plugins.insomnia) {
          $log.debug('Retrieving cordova insomnia plugin');
          return $window.plugins.insomnia;
        } else {
          return stub;
        }
      };

      return getInsomnia();
    })

    .controller('ScrambleCtrl', function ($scope, $stateParams, $location, $ionicModal, scrambles, solveManager, insomnia) {
      if (scrambles.length === 0) {
        $location.path('/tab/scrambles');
      }
      insomnia.keepAwake();
      $scope.scramble = scrambles.get($stateParams.scrambleId);

      $scope.startTimer = function() {
        $scope.$broadcast('timer-start');
        if (window.StatusBar) {
          window.StatusBar.hide();
        }
        $scope.modal.show();
      };

      $scope.stopTimer = function() {
        $scope.modal.hide();
      };

       $scope.$on('timer-stopped', function (event, data){
         insomnia.allowSleepAgain();
         if (! $scope.scramble.solveTime) {
           $scope.scramble.solveTime = data.millis;
           solveManager.save($scope.scramble).then(function() {
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

      $scope.$on('modal.hidden', function() {
        $scope.$broadcast('timer-stop');
        if (window.StatusBar) {
          window.StatusBar.show();
        }
      });

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
    })
  ;
})(angular);
