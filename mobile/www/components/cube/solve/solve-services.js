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

  .run(function(synchSolves) {
    synchSolves();
  })

  .factory('synchSolves', ['$rootScope', '$http', '$q', '$log', 'auth', 'cubeConfig', 'solves', function($rootScope, $http, $q, $log, auth, cubeConfig, solves) {
    var uploadSolves = function() {
      var deferred = $q.defer();
      var solvesToUpload = solves.solves().filter(function(solve) {
        return !('_id' in solve);
      });
      if (solvesToUpload.length === 0) {
        $log.debug('No solves to upload');
        deferred.resolve([]);
      } else {
        solvesToUpload.forEach(function(solve) {
          solve._user = auth.getUser()._id;
        });
        $log.debug(solvesToUpload.length + ' solves to upload:');
        var url = cubeConfig.backend + '/solve/create_all';
        $http.post(url, {solves: solvesToUpload})
          .then(function(response) {
            var result = response.data;
            $log.debug(result.created.length + ' solves uploaded');
            $log.debug(result.failed.length + ' solves not uploaded');
            deferred.resolve(result.created);
          }, function(response) {
            var message = '#' + response.status + ' - ' + response.statusText;
            deferred.reject(new Error(message));
          });
      }
      return deferred.promise;
    };

    var updateLocalSolves = function(createdSolves) {
      var deferred = $q.defer();
      if (createdSolves.length === 0) {
        $log.debug('No uploaded solves to update');
        deferred.resolve([]);
      } else {
        $log.debug('Updating localStorage with uploaded solves');
        var localSolves = solves.readSolves();
        var map = solves.createSolvesMap(createdSolves);
        localSolves.forEach(function(solve) {
          var savedSolve = map[solve.state]
          if (savedSolve) {
            solve._id = savedSolve._id;
            solve._user = savedSolve._user;
          }
        });
        solves.writeSolves(localSolves);
        deferred.resolve(createdSolves);
      }
      return deferred.promise;
    };

    var retrieveLatestTimes = function() {
      var deferred = $q.defer();
      $log.debug('Retrieving latest solves');
      var url = cubeConfig.backend + '/solve';
      $http.get(
        url
      ).then(function(response) {
        var latestSolves = response.data;
        deferred.resolve(latestSolves);
      }, function(response) {
        var message = '#' + response.status + ' - ' + response.statusText;
        deferred.reject(new Error(message));
      });
      return deferred.promise;
    };

    var replaceLocalSolves = function(latestSolves) {
      var deferred = $q.defer();
      if (latestSolves.length === 0) {
        deferred.resolve();
        return deferred.promise;
      }
      var unSavedSolves = solves.solves().filter(function(solve) {
        return !('_id' in solve);
      });
      if (unSavedSolves.length > 0) {
        var unSavedSolvesMap = solves.createSolvesMap(unSavedSolves);
        latestSolves.forEach(function(solve) {
          var latestSolve = unSavedSolvesMap[solve.state];
          if (latestSolve) {
            delete unSavedSolvesMap[solve.state];
          }
        });
        unSavedSolvesMap.keys().forEach(function(unSavedSolve) {
          latestSolves.push(unSavedSolve)
        });
        solves.sortSolves(latestSolves);
      }
      solves.writeSolves(latestSolves);
      var averages = solves.calculateAverages(latestSolves);
      solves.writeAverages(averages);
      deferred.resolve();
      return deferred.promise;
    };

    return function() {
      if (! auth.getUser()) {
        $log.debug('Not logged in: Synch disabled');
        return;
      }

      if (solves.solves().length === 0) {
        retrieveLatestTimes().then(replaceLocalSolves);
      } else {
        uploadSolves()
          .then(updateLocalSolves)
          .then(retrieveLatestTimes)
          .then(replaceLocalSolves);
      }
    };
  }])

  .factory('solves', ['$rootScope', '$localStorage', '$q', '$timeout', '$http', 'cubeConfig', 'auth', function($rootScope, $localStorage, $q, $timeout, $http, cubeConfig, auth) {
    var save = function(solve) {
      solve.date = new Date().getTime();
      solves = readSolves();
      solves.shift(solve);
      sortSolves(solves);
      writeSolves(solves);
      averages = calculateAverages(solves);
      writeAverages(averages);
      if (auth.getUser()) {
        solve._user = auth.getUser()._id;
        createOnRemote(solve).then(function(created) {
          solves = readSolves();
          solves.forEach(function(solveLoop) {
            if (solveLoop.state === created.state) {
              solveLoop._id = created._id;
            }
          });
          writeSolves(solves);
        });
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
      return deferred.promise;
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

    var writeSolves = function(solves) {
      $localStorage.setItem('solves', JSON.stringify(solves));
    };

    var readAverages = function() {
      return JSON.parse($localStorage.getItem('averages')) || [];
    };

    var writeAverages = function(averages) {
      $localStorage.setItem('averages', JSON.stringify(averages));
    };

    var createSolvesMap = function(solves) {
      var solvesMap = {};
      solves.forEach(function(solve) {
        solveMap[solve.state] = solve;
      });
      return solvesMap
    };

    var sortSolves = function(solves) {
      solves.sort(function(a, b) {
        return a.date - b.date;
      });
    };

    var solves = readSolves();
    var averages = readAverages();

    return {
      solves: function() {
        return solves;
      },
      readSolves: readSolves,
      writeSolves: writeSolves,
      createSolvesMap: createSolvesMap,
      sortSolves: sortSolves,
      calculateAverages: calculateAverages,
      writeAverages: writeAverages,
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
      if (!auth.getUser()) {
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
