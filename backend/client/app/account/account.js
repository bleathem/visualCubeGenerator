(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.account', [
    'ui.router',
    'oauth.google'
  ])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.account', {
        url: '/account',
        templateUrl: 'app/account/account.tpl.html',
        controller: 'AccountController'
      });
  })
  .controller('AccountController', ['$scope', 'googleapiJsClient', function ($scope, googleapiJsClient) {
    $scope.authorize = function() {
      googleapiJsClient.authorize().then(function(data) {
        $scope.message = data;
        console.log(data);
      });
    };
  }]);

})(angular);
