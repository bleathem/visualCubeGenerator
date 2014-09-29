(function (angular) {
  'use strict';
  angular.module('account', [])

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

    .controller('AccountCtrl', ['$scope', function ($scope) {
      $scope.message = 'test';
    }])
  ;
})(angular);
