(function (angular) {
  'use strict';

  angular.module('visualCubeGenerator', [
    'ngFx',
    'ui.router',
    'http.helpers',
    'visualCubeGenerator.main'
  ])

  .constant('appConfig', {
    backend: '' // REST calls will be made using relative URLs
    //backend: 'https://vcgnode-bleathemredhat.rhcloud.com'
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('visualCubeGenerator', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });

}(angular));
