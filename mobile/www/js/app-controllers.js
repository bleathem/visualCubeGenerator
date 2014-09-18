angular.module('starter.controllers', [])

.controller('DashCtrl', ["$scope", "Scrambles", function ($scope, scrambles) {
    $scope.solves = scrambles.solves();
}])

.controller('AccountCtrl', function($scope) {
});
