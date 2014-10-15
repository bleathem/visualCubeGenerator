/* global window:false */
(function (angular) {
  'use strict';

  angular.module('cube.solve.services', ['oauth'])

  .constant('cubeConfig', {
    backend: 'http://home.bleathem.ca:9000'
  })

  .factory('$localStorage', function() {
    return window.localStorage;
  })

  .factory('solves', ['$localStorage', '$q', '$timeout', '$http', 'cubeConfig', 'auth', function($localStorage, $q, $timeout, $http, cubeConfig, auth) {
    var save = function(solve) {
      solve.date = new Date().getTime();
      solves = readSolves();
      solves.push(solve);
      $localStorage.setItem('solves', JSON.stringify(solves));
      averages = calculateAverages(solves);
      $localStorage.setItem('averages', JSON.stringify(averages));
      if (auth.user) {
        solve._user = auth.user._id;
        createOnRemote(solve);
      }
    };

    var createOnRemote = function(solve) {
      var deferred = $q.defer();
      var url = cubeConfig.backend + '/solve';
      $http.post(
        url,
        {solve: solve}
      ).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        var message = '#' + response.status + ' - ' + response.statusText;
        deferred.reject(new Error(message));
      });

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
      if (solve.solveTime < sum.best.solveTime) {
        sum.best = solve;
      }
      sum.solveTime += solve.solveTime;
      return sum;
    };

    var calculateAverages = function(allSolves) {
      var averages = {};
      var seed = {
        best: allSolves[allSolves.length - 1],
        solveTime: 0
      };
      averages.ao5 = allSolves.slice(-5).reduce(sumSolveTimes, angular.extend({}, seed));
      averages.ao5.solveTime = averages.ao5.solveTime / 5;
      averages.ao10 = allSolves.slice(-10).reduce(sumSolveTimes, angular.extend({}, seed));
      averages.ao10.solveTime = averages.ao10.solveTime / 10;
      averages.all = allSolves.reduce(sumSolveTimes, angular.extend({}, seed));
      averages.all.solveTime = averages.all.solveTime / allSolves.length;
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

  .factory('solveLoader', ['$http', '$q', 'auth', 'cubeConfig', function($http, $q, auth, cubeConfig) {
    var fecthSolves = function() {
      var deferred = $q.defer();
      if (!auth.user) {
        deferred.reject(new Error('User not logged in'));
        return deferred.promise;
      }
      var url = cubeConfig.backend + '/solve';
      $http({
        method: 'get',
        url: url
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        var message = '#' + response.status + ' - ' + response.statusText;
        deferred.reject(new Error(message));
      });
      return deferred.promise;
    };

    return {
      fecthSolves: fecthSolves
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
