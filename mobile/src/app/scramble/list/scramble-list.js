'use strict';
(function (angular) {
  angular.module('cube.scrambles', ['cube.scramble.services'])

  .config(function($stateProvider) {
    $stateProvider
      .state('tab.scrambles', {
        url: '/scrambles',
        views: {
          'tab-scrambles': {
            templateUrl: 'app/scramble/list/scramble-list.tpl.html',
            controller: 'ScrambleListCtrl'
          }
        }
      });
    })

    .controller('ScrambleListCtrl', function ($scope, $ionicLoading, scrambles) {
      $scope.scrambles = scrambles.all();

      $scope.scramble = function() {
        $ionicLoading.show();
        scrambles.regenerate().then(function() {
          $scope.scrambles = scrambles.all();
          $ionicLoading.hide();
        }, function(e) {
          $ionicLoading.hide();
          throw e;
        });
      };
    })
  ;
})(angular);
