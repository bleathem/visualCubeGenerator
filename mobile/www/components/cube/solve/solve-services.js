/* global window:false */
(function (angular) {
  'use strict';

  angular.module('cube.solve.services', [])

  .factory('$localStorage', function() {
    return window.localStorage;
  })

  .factory('solves', ['$localStorage', '$q', '$timeout', function($localStorage, $q, $timeout) {
    var save = function(solve) {
      solve.date = new Date().getTime();
      solves = readSolves();
      solves.push(solve);
      $localStorage.setItem('solves', JSON.stringify(solves));
      averages = calculateAverages(solves);
      $localStorage.setItem('averages', JSON.stringify(averages));
    };

    var deleteSolve = function(remove) {
      solves = readSolves();
      solves = solves.filter(function(solve) {
        return solve.state !== remove.state;
      });
      $localStorage.setItem('solves', JSON.stringify(solves));
      averages = calculateAverages(solves);
      $localStorage.setItem('averages', JSON.stringify(averages));
    };

    var sumSolveTimes = function(sum, solve) {
      if (solve.time < sum.best.time) {
        sum.best = solve;
      }
      sum.time += solve.time;
      return sum;
    };

    var calculateAverages = function(allSolves) {
      var averages = {};
      var seed = {
        best: allSolves[allSolves.length - 1],
        time: 0
      };
      averages.ao5 = allSolves.slice(-5).reduce(sumSolveTimes, angular.extend({}, seed));
      averages.ao5.time = averages.ao5.time / 5;
      averages.ao10 = allSolves.slice(-10).reduce(sumSolveTimes, angular.extend({}, seed));
      averages.ao10.time = averages.ao10.time / 10;
      averages.all = allSolves.reduce(sumSolveTimes, angular.extend({}, seed));
      averages.all.time = averages.all.time / allSolves.length;
      return averages;
    };

    var readSolves = function() {
      return JSON.parse($localStorage.getItem('solves')) || [];
    };

    var readAverages = function() {
      return JSON.parse($localStorage.getItem('averages')) || [];
    };

    var solves = readSolves();
    var averages = readAverages();

    return {
      solves: function() {
        return solves;
      },
      averages: function() {
        return averages;
      },
      save: function(solve) {
        var deferred = $q.defer();
        $timeout(function() {
          try {
            save(solve);
            deferred.resolve('Solve saved');
          } catch(error) {
            deferred.reject(error);
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
            deferred.reject(error);
          }
        }, 0);
        return deferred.promise;
      }
    };
  }])

  .directive('solveTime', function() {
    return {
      restrict: 'E',
      template: '<span class="time"> <span class="my-clock-icon"> </span> {{time | solveTime}} </span>',
      scope: {
        time : '=time'
      }
    };
  })

  // Takes a time in millisecons and diplays it as m:ss.mils
  .filter('solveTime', function () {
    var lpad = function pad(num, size) {
      var s = '000' + num;
      return s.slice(-size);
    };

    var rpad = function pad(num, size) {
      var s = num + '000';
      return s.slice(0, size);
    };

    return function (input) {
      if (isNaN(input)) {
        return '';
      }
      var minutes = Math.floor(input/60000);
      var seconds = Math.floor((input % 60000)/1000);
      var millis = Math.floor(input % 60000 - seconds*1000);
      return minutes + ':' + lpad(seconds, 2) + '.' + rpad(millis, 3);
    };
  });
}(angular));
