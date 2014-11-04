'use strict';
var angular = require('angular');
require('angular-ui-router');
require('../../../components/cube/scramble/scramble-services.js');

angular.module('visualCubeGenerator.main.scrambles', ['ui.router', 'cube.scramble.services'])

.config(function ($stateProvider) {

  $stateProvider
    .state('visualCubeGenerator.main.scrambles', {
      url: '/scrambles',
      templateUrl: 'app/scramble/list/scramble-list.tpl.html',
      controller: 'ScrambleListCtrl'
    });
})

.controller('ScrambleListCtrl', function ($scope, scrambles) {
  $scope.solves = [];

  $scope.scrambles = scrambles.all();

  $scope.scramble = function() {
    scrambles.regenerate().then(function() {
      $scope.scrambles = scrambles.all();
    }, function(e) {
      throw e;
    });
  };
});
