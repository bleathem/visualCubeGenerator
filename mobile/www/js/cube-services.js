angular.module('cube.services', [])

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

  var save = function(solve) {
    solve.date = new Date().getTime();
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
    if (solve.time < sum.best.time) {
      sum.best = solve;
    }
    sum.time += solve.time;
    return sum;
  }

  var calculateAverages = function(allSolves) {
    var averages = {};
    var seed = {
      best: allSolves[allSolves.length - 1],
      time: 0
    }
    averages.ao5 = allSolves.slice(-5).reduce(sumSolveTimes, angular.extend({}, seed));
    averages.ao5.time = averages.ao5.time / 5;
    averages.ao10 = allSolves.slice(-10).reduce(sumSolveTimes, angular.extend({}, seed));
    averages.ao10.time = averages.ao10.time / 10;
    averages.all = allSolves.reduce(sumSolveTimes, angular.extend({}, seed));
    averages.all.time = averages.all.time / allSolves.length;
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
    save: function(solve) {
      var deferred = $q.defer();
      $timeout(function() {
        try {
          save(solve);
          deferred.resolve('Solve saved');
        } catch(error) {
          deferred.reject(e);
        }
      }, 0);
      return deferred.promise;
    },
    delete: function(solve) {
      var deferred = $q.defer();
      $timeout(function() {
        try {
          deleteSolve(solve);
          deferred.resolve('Solve deleted');
        } catch(error) {
          deferred.reject(e);
        }
      }, 0);
      return deferred.promise;
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
    templateUrl: "templates/scramble-view.html",
    link: function (scope, element, attrs) {
      scope.width = attrs.width;
    }
  }
}])

.directive("time", function() {
  return {
    restrict: 'E',
    template: "<span class='time'> <span class='my-clock-icon'> </span> {{time | time}} </span>",
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

// Takes a time in millisecons and diplays it as m:ss.mils
.filter('time', function () {
  var lpad = function pad(num, size) {
    var s = "000" + num;
    return s.slice(-size);
  }

  var rpad = function pad(num, size) {
    var s = num + "000";
    return s.slice(0, size);
  }

  return function (input) {
    if (isNaN(input)) {
      return "";
    }
    var minutes = Math.floor(input/60000);
    var seconds = Math.floor((input % 60000)/1000);
    var millis = Math.floor(input % 60000 - seconds*1000);
    return minutes + ":" + lpad(seconds, 2) + "." + rpad(millis, 3);
  }
})
;
