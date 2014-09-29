(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.scramble', ['ui.router', 'cube.scramble.services'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.scramble', {
        url: '/scrambles',
        templateUrl: 'app/scramble/list/scramble-list.tpl.html',
        controller: 'ScrambleListCtrl'
      });
  })

  .controller('ScrambleListCtrl', ['$scope', 'scrambles', function ($scope, scrambles) {
    $scope.solves = [];

    $scope.scrambles = scrambles.all();

    $scope.scramble = function() {
      scrambles.regenerate().then(function() {
        $scope.scrambles = scrambles.all();
      }, function(e) {
        throw e;
      });
    };
  }]);

})(angular);
