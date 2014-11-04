'use strict';
var angular = require('angular');
require('angular-ui-router');
require('../account/account.js');
require('../scramble/detail/scramble-detail.js');
require('../scramble/list/scramble-list.js');
require('../home/home.js');
require('../solve/solve.js');

angular.module('visualCubeGenerator.main', [
  'ui.router',
  'visualCubeGenerator.main.home',
  'visualCubeGenerator.main.solve',
  'visualCubeGenerator.main.scrambles',
  'visualCubeGenerator.main.scramble.detail',
  'visualCubeGenerator.main.account'
])
.config(function ($stateProvider) {
  $stateProvider
    .state('visualCubeGenerator.main', {
      abstract: true,
      templateUrl: 'app/main/main.tpl.html'
    });
});
