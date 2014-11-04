'use strict';
var angular = require('angular');
require('angular-ui-router');
require('../../components/cube/solve/solve-services.js');

angular.module('visualCubeGenerator.main.solve', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('visualCubeGenerator.main.solve', {
      url: '/solve',
      templateUrl: 'app/solve/solve.tpl.html',
      controller: 'SolveController'
    });
})

.controller('SolveController', function ($scope, solveModel, solveManager) {
  $scope.solveModel = solveModel;
  $scope.delete = solveManager.delete;
});
