/* global window:false */
/* global cordova:false */
'use strict';
var angular = require('angular');

require('ionic');
require('raphael');
require('scramble_333');
require('scramble_222');
require('ng-cordova');
require('./config.js');

require('./account/account.js');
require('./scramble/detail/scramble.js');
require('./scramble/list/scramble-list.js');
require('./solve/solve.js');

require('../components/http/http-helpers.js');

angular.module('visualCubeGenerator', [
  'ionic',
  'ngCordova',
  'http.helpers',
  'cube.solve',
  'cube.scramble',
  'cube.scrambles',
  'account'
])

.constant('appConfig', {
  backend: 'http://home.bleathem.ca:9000'
})

.run(function($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
    if (window.navigator && window.navigator.splashscreen) {
      $cordovaSplashscreen.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'app/tabs.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/scrambles');

});
