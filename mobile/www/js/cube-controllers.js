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

  .controller('ScrambleCtrl', ["$scope", "$stateParams", "$location", "$ionicModal", "Scrambles", function ($scope, $stateParams, $location, $ionicModal, scrambles) {
    if (scrambles.length === 0) {
      $location.path("/tab/scrambles")
    }
    $scope.scramble = scrambles.get($stateParams.scrambleId);

    $scope.startTimer = function() {
      $scope.$broadcast('timer-start');
      $scope.openModal();
    }

    $scope.stopTimer = function() {
      $scope.$broadcast('timer-stop');
      $scope.closeModal();
    }

     $scope.$on('timer-stopped', function (event, data){
       $scope.scramble.time = data.millis;
     });

    $ionicModal.fromTemplateUrl('templates/timer-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    }]);
