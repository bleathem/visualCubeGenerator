angular.module('cube.services', [])

.factory("$localStorage", function() {
  return window.localStorage;
})

.factory("Scrambler333", function() {
  scramblers["333"].initialize(null, Math);
  return scramblers["333"];
})

.factory("Scrambles", ['Scrambler333', '$localStorage', function(scrambler, $localStorage) {
  var formatScramble = function(scrambleString) {
    var newString = "";
    var chunkLength = 4;
    var chunks = scrambleString.split(/\s+/);
    for (var i = 0; i < chunks.length; i++) {
      if (i === 0) {
        newString = newString.concat("<span class='chunk'>");
      } else if (i === chunks.length -1) {
        newString = newString.concat("</span>");
      } else {
        if ((i) % chunkLength == 0) {
          newString = newString.concat("</span> <span class='chunk'>");
        } else {
          newString = newString.concat(" ");
        }
      }
      newString = newString.concat(chunks[i]);
    }
    return newString;
  };

  var generateScrambles = function(max) {
    var scrambles = [];
    for (var count = 0; count < max; count++) {
      // Generate a random scramble
      var randomScramble = {
        id: count,
        moves: scrambler.getRandomScramble().scramble_string,
        state: scrambler.getRandomScramble().state,
        movesFormatted: formatScramble(scrambler.getRandomScramble().scramble_string)
      }
      scrambles.push(randomScramble);
    }
    return scrambles;
  }

  var save = function(solve) {
    solve.date = new Date();
    solves = readSolves();
    solves.push(solve);
    $localStorage.setItem("solves", JSON.stringify(solves));
    averages = calculateAverages(solves);
    $localStorage.setItem("averages", JSON.stringify(averages));
  }

  var deleteSolve = function(remove) {
    solves = readSolves();
    solves = solves.filter(function(solve) {
      return solve.state !== remove.state;
    });
    $localStorage.setItem("solves", JSON.stringify(solves));
    averages = calculateAverages(solves);
    $localStorage.setItem("averages", JSON.stringify(averages));
  }

  var sumSolveTimes = function(sum, solve, index, array) {
    return sum + solve.time;
  }

  var calculateAverages = function(allSolves) {
    var averages = {};
    averages.ao5 = allSolves.slice(-5).reduce(sumSolveTimes, 0);
    averages.ao10 = allSolves.slice(-10).reduce(sumSolveTimes, 0);
    averages.all = allSolves.reduce(sumSolveTimes, 0);
    return averages;
  }

  var readSolves = function() {
    return JSON.parse($localStorage.getItem("solves")) || [];
  }

  var readAverages = function() {
    return JSON.parse($localStorage.getItem("averages")) || [];
  }

  var scrambles = generateScrambles(5);
  var solves = readSolves();
  var averages = readAverages();

  return {
    save: function(solve) {
      save(solve);
    },
    delete: function(solve) {
      deleteSolve(solve);
    },
    solves: function() {
      return solves;
    },
    averages: function() {
      return averages;
    },
    all: function() {
      return scrambles;
    },
    get: function(id) {
      return scrambles[id];
    },
    regenerate: function() {
      scrambles = generateScrambles(5);
    }
  };
}])

.directive("scramble", ["Scrambler333", "Scrambles", function(scrambler, scrambles) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      scrambleModel: '=scrambleModel'
    },
    templateUrl: "templates/scramble.html",
    link: function (scope, element, attrs) {
      scope.width = attrs.width;
    }
  }
}])

.directive("time", function() {
  return {
    restrict: 'E',
    templateUrl: "templates/time.html",
    scope: {
      time : "=time"
    }
  }
})

.directive("scrambleGraphic", ["Scrambler333", function(scrambler) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      scrambleState: '=scrambleState'
    },
    link: function (scope, element, attrs) {
      var div = angular.element("<div class='graphic'/>");
      element.append(div);
      var width = div[0].offsetWidth,
         height = Math.round(width * 2.0 / 3.0);
      scrambler.drawScramble(div[0], scope.scrambleState, width, height);
    }
  }
}])

// Takes a time in millisecons and diplays it as m:ss.mils
.filter('time', function () {
  var pad = function(input) {
    var n = input;
    return (n < 10) ? '0' + n : n;
  };

  return function (input) {
    var minutes = Math.floor(input/60000);
    var seconds = Math.floor((input % 60000)/1000);
    var millis = input % 60000 - seconds*1000;
    return minutes + ":" + pad(seconds) + "." + millis;
  }
})
;
