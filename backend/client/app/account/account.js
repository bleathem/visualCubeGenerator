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
  .controller('AccountController', ['$scope', 'googleapi', function ($scope, googleapi) {
    $scope.authorize = function() {
      googleapi.authorize().then(function(data) {
        var string = JSON.stringify(data, undefined, 2);
        $scope.message = string;
      }, function(error) {
        $scope.message = 'Error: ' + error.message;
        console.log(error);
      });
    };
  }])

})(angular);
