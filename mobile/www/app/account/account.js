(function (angular) {
  'use strict';
  angular.module('account', ['oauth.google.installedClient'])

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
          $scope.message = data;
          console.log(data);
        });
      };
    }])
  ;
})(angular);
