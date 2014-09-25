angular.module('cube', [])

  .controller('ScramblesCtrl', ["$scope", "Scrambles", "$ionicLoading", function ($scope, scrambles, $ionicLoading) {
    $scope.scrambles = scrambles.all();

    $scope.scramble = function() {
      $ionicLoading.show();
      scrambles.regenerate().then(function() {
        $scope.scrambles = scrambles.all();
        $ionicLoading.hide();
      }, function(e) {
        $ionicLoading.hide();
        throw e;
      });
    }
  }])

  .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
  })

  .controller('ScrambleCtrl', ["$scope", "$stateParams", "$location", "$ionicModal", "Scrambles", function ($scope, $stateParams, $location, $ionicModal, scrambles) {
    if (scrambles.length === 0) {
      $location.path("/tab/scrambles")
    }
    $scope.scramble = scrambles.get($stateParams.scrambleId);

    $scope.startTimer = function() {
      $scope.$broadcast('timer-start');
      if (window.StatusBar) {
        window.StatusBar.hide();
      }
      $scope.modal.show();
    }

    $scope.stopTimer = function() {
      $scope.$broadcast('timer-stop');
      if (window.StatusBar) {
        window.StatusBar.show();
      }
      $scope.modal.hide();
    }

     $scope.$on('timer-stopped', function (event, data){
       if (! $scope.scramble.time) {
         $scope.scramble.time = data.millis;
         scrambles.save($scope.scramble).then(function() {
           $scope.scrambles = scrambles.all();
         }, function(error) {
           throw e;
         });
       }
     });

    $ionicModal.fromTemplateUrl('templates/timer-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  }]);
