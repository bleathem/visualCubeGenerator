'use strict';
var angular = require('angular');
require('../../components/cube/solve/solve-services.js');

angular.module('cube.solve', ['cube.solve.services'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'app/solve/solve.tpl.html',
          controller: 'SolvesCtrl'
        }
      }
    });
  }])

  .controller('SolvesCtrl', ['$scope', 'solveModel', 'solveManager', function ($scope, solveModel, solveManager) {
    $scope.solveModel = solveModel;
    $scope.delete = solveManager.delete;
  }])
;
