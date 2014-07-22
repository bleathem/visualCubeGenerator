angular.module('cube', [])

  .controller('ScramblesCtrl', ["$scope", "Scrambles", function ($scope, scrambles) {
    $scope.scrambles = scrambles.all();
  }])

  .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
  })

  .controller('ScrambleCtrl', ["$scope", "$stateParams", "Scrambles", function ($scope, $stateParams, scrambles) {
    $scope.scramble = scrambles.get($stateParams.scrambleId);
  }])

  .factory("Scrambler333", function() {
    scramblers["333"].initialize(null, Math);
    return scramblers["333"];
  })

  .factory("Scrambles", ['Scrambler333', function(scrambler) {
    var generateScrambles = function(max) {
      var scrambles = [];
      for (var count = 0; count < max; count++) {
        // Generate a random scramble
        var randomScramble = {
          id: count,
          moves: scrambler.getRandomScramble().scramble_string,
          state: scrambler.getRandomScramble().state
        };
        scrambles.push(randomScramble);
      }
      return {
        all: function() {
          return scrambles;
        },
        get: function(id) {
          return scrambles[id];
        }
      };
    }

    var scrambles = generateScrambles(5);

    return scrambles;
  }])

  .directive("scramble", ["Scrambler333", "Scrambles", function(scrambler, scrambles) {
    return {
      restrict: 'E',
      replace: true,
      require: '^scrambleModel',
      scope: {
        scrambleModel: '='
      },
      templateUrl: "templates/scramble.html"
    }
  }])

  .directive("scrambleGraphic", ["Scrambler333", function(scrambler) {
    return {
      restrict: 'E',
      replace: true,
      require: '^scrambleState',
      scope: {
        scrambleState: '='
      },
      link: function (scope, element, attrs) {
        scrambler.drawScramble(element[0], scope.scrambleState, 200, 160);
      }
    }
  }])

  .directive("scrambleModel", function() {
    return {
      restrict: 'A',
      controller: function($scope) {

      }
    }
  })

  .directive("scrambleState", function() {
    return {
      restrict: 'A',
      controller: function($scope) {

      }
    }
  })
;