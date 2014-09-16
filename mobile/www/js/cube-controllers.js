angular.module('cube', [])

  .controller('ScramblesCtrl', ["$scope", "Scrambles", function ($scope, scrambles) {
    $scope.scrambles = scrambles.all();

    $scope.scramble = function() {
      scrambles.regenerate();
      $scope.scrambles = scrambles.all();
    }
  }])

  .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
  })

  .controller('ScrambleCtrl', ["$scope", "$stateParams", "$location", "Scrambles", function ($scope, $stateParams, $location, scrambles) {
    if (scrambles.length === 0) {
      $location.path("/tab/scrambles")
    }
    $scope.scramble = scrambles.get($stateParams.scrambleId);
  }])
;
