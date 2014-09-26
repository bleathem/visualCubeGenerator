angular.module('cube.scramble.services', [])

.factory("$localStorage", function() {
  return window.localStorage;
})

.factory("Scrambler333", function() {
  scramblers["333"].initialize(null, Math);
  return scramblers["333"];
})

.factory("Scrambles", ['Scrambler333', '$localStorage', '$q', '$timeout', function(scrambler, $localStorage, $q, $timeout) {
  var generateScrambles = function(max) {
    var scrambles = [];
    for (var count = 0; count < max; count++) {
      // Generate a random scramble
      var randomScramble = {
        id: count,
        moves: scrambler.getRandomScramble().scramble_string.trim(),
        state: scrambler.getRandomScramble().state,
      }
      scrambles.push(randomScramble);
    }
    return scrambles;
  }

  var scrambles = generateScrambles(5);

  return {
    all: function() {
      return scrambles;
    },
    get: function(id) {
      return scrambles[id];
    },
    regenerate: function() {
      var deferred = $q.defer();
      $timeout(function() {
        try {
          scrambles = generateScrambles(5);
          deferred.resolve('Scrambles generated');
        } catch(error) {
          deferred.reject(e);
        }
      }, 10);
      return deferred.promise;
    }
  };
}])

.directive("scrambleView", ["Scrambler333", "Scrambles", function(scrambler, scrambles) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      scramble: '=scramble'
    },
    templateUrl: "templates/directives/cube/scramble-view.html",
    link: function (scope, element, attrs) {
      scope.width = attrs.width;
    }
  }
}])

.directive("scrambleGraphic", ["Scrambler333", function(scrambler) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      state: '=state'
    },
    link: function (scope, element, attrs) {
      var div = angular.element("<div class='graphic'/>");
      element.append(div);
      var width = div[0].offsetWidth,
         height = Math.round(width * 2.0 / 3.0);
      scrambler.drawScramble(div[0], scope.state, width, height);
    }
  }
}])

.directive("scrambleMoves", function() {
  return {
    restrict: 'E',
    scope: {
      moves: '=moves'
    },
    link: function (scope, element, attrs) {
      var outer = angular.element("<div class='moves'/>");
      var newString = "";
      var chunkLength = 4;
      var chunks = scope.moves.split(/\s+/);
      var inner;
      for (var i = 0; i < chunks.length; i++) {
        if ((i) % chunkLength == 0) {
          inner = angular.element("<span class='chunk'/>");
          outer.append(inner);
          outer.append(document.createTextNode(' '));
        }
        inner.text(inner.text() + " " + chunks[i]);
      }
      element.append(outer);
    }
  }
})
;
