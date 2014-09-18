angular.module('starter.controllers', [])

.controller('DashCtrl', ["$scope", "Scrambles", function ($scope, scrambles) {
    $scope.solves = scrambles.solves();
    $scope.averages = scrambles.averages();

    $scope.delete = function(solve) {
      scrambles.delete(solve);
      $scope.solves = scrambles.solves();
    }
}])

.controller('AccountCtrl', function($scope) {
});
