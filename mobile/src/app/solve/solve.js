'use strict';
var angular = require('angular');
require('../../components/cube/solve/solve-services.js');

angular.module('cube.solve', ['cube.solve.services'])

.config(function($stateProvider) {
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
  })

  .controller('SolvesCtrl', function ($scope, solveModel, solveManager) {
    $scope.solveModel = solveModel;
    $scope.delete = solveManager.delete;
  })
;
