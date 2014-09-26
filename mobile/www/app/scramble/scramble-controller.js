angular.module('cube.scramble', ['cube.scramble.services', 'cube.solve.services', 'timer'])

  .controller('ScramblesCtrl', ["$scope", "$ionicLoading", "Scrambles", "Solves", function ($scope, $ionicLoading, scrambles, solves) {
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

  .controller('ScrambleCtrl', ["$scope", "$stateParams", "$location", "$ionicModal", "Scrambles", "Solves", function ($scope, $stateParams, $location, $ionicModal, scrambles, solves) {
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
         solves.save($scope.scramble).then(function() {
          $scope.$broadcast("solve-saved", $scope.scramble);
         }, function(error) {
           throw e;
         });
       }
     });

    $ionicModal.fromTemplateUrl('app/scramble/timer-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  }])
;
