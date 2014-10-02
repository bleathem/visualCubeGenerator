(function (angular) {
  'use strict';
  angular.module('account', [
    'oauth.google'
  ])

    .config(function($stateProvider) {
      $stateProvider
        .state('tab.account', {
          url: '/account',
          views: {
            'tab-account': {
              templateUrl: 'app/account/account.tpl.html',
              controller: 'AccountCtrl'
            }
          }
        });
    })

    .controller('AccountCtrl', ['$scope', 'googleapiJsClient', 'googleapiInstalledClient', function ($scope, googleapiJsClient, googleapiInstalledClient) {
      $scope.authorize = function() {
        var googleapi = window.cordova ? googleapiInstalledClient :googleapiJsClient;
        googleapi.authorize().then(function(data) {
          var string = JSON.stringify(data, undefined, 2);
          $scope.message = string;
          console.log(string);
        });
      };
    }])
  ;
})(angular);
