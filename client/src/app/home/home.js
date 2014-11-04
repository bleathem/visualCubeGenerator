'use strict';
var angular = require('angular');
require('angular-ui-router');

angular.module('visualCubeGenerator.main.home', ['ui.router'])

.config(function ($stateProvider) {

  $stateProvider
    .state('visualCubeGenerator.main.home', {
      url: '/home',
      templateUrl: 'app/home/home.tpl.html',
      controller: 'HomeController'
    });
})
.controller('HomeController', function ($scope) {
  $scope.solves = [];
});
