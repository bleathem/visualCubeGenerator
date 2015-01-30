/* global window:false */
/* global cordova:false */
'use strict';
(function (angular) {
  angular.module('visualCubeGenerator', [
    'ionic',
    'ngCordova',
    'http.helpers',
    'cube.solve.list',
    'cube.solve.detail',
    'cube.scramble',
    'cube.scrambles',
    'account',
    'visualCubeGenerator.config',
    'visualCubeGenerator.template',
    'angulartics', 'angulartics.google.analytics.cordova'
  ])

  .run(function($ionicPlatform, $cordovaSplashscreen, googleAnalyticsCordova) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
      }
      if (window.navigator && window.navigator.splashscreen) {
        $cordovaSplashscreen.hide();
      }
      googleAnalyticsCordova.init();
    });
  })

  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs
      .style('standard')
      .position('bottom');

    $ionicConfigProvider.views.transition('ios');

    $ionicConfigProvider.navBar
      .alignTitle('center')
      .positionPrimaryButtons('left')
      .positionSecondaryButtons('right');
  })

  .config(function(googleAnalyticsCordovaProvider) {
    googleAnalyticsCordovaProvider.trackingId = 'UA-56918202-2';
    googleAnalyticsCordovaProvider.period = 20; // default: 10 (in seconds)
    googleAnalyticsCordovaProvider.debug = false; // default: false
  })

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

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

    // $locationProvider.html5Mode(false).hashPrefix('!');

  });
})(angular);
