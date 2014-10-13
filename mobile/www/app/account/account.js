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

    .controller('AccountCtrl', ['$scope', 'googleapi', function ($scope, googleapi) {
      $scope.authorize = function() {
        googleapi.authorize().then(function(data) {
          var string = JSON.stringify(data, undefined, 2);
          $scope.message = string;
        }, function(error) {
          $scope.message = '** Error **: ' + error.message;
          console.log(error);
        });
      };
    }])
  ;
})(angular);
