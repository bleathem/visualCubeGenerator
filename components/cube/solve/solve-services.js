/* global window:false */
'use strict';
(function (angular) {
  angular.module('cube.solve.services', ['oauth', 'visualCubeGenerator.config'])

  .factory('$localStorage', function() {
    return window.localStorage;
  })

  .run(function(solveModel, solveLocalLoader, averageLoader, synchSolves) {
    // load locally-cached values prior to asynchronously fetching remote values
    solveModel.solves = solveLocalLoader.readSolves();
    solveModel.averages = averageLoader.readAverages();
    synchSolves();
  })

  .factory('solveModel', function() {
    var solveModel = {
      solves: {},
      averages: {},
      get: function(index) {
        return solveModel.solves[index];
      }
    };

    return solveModel;
  })

  .factory('solveManager', function($q, solveModel, solveLocalLoader, solveRemoteLoader, averageLoader, synchSolves) {
    var solveManager = {};

    solveManager.save = function(solve) {
      var deferred = $q.defer();
      solveLocalLoader.save(solve).then(function(solves) {
        solveModel.solves = solves;
        solveModel.averages = averageLoader.calculateAverages(solveModel.solves);
        averageLoader.writeAverages(solveModel.averages);
        deferred.resolve(solve);
      }).then(function() {
        synchSolves();
      });
      return deferred.promise;
    };

    solveManager.deleteSolve = function(solve) {
      var deferred = $q.defer();
      solveLocalLoader.deleteSolve(solve).then(function(solves) {
        solveModel.solves = solves;
        solveModel.averages = averageLoader.calculateAverages(solveModel.solves);
        averageLoader.writeAverages(solveModel.averages);
        solveRemoteLoader.deleteSolve(solve).then(function() {
          deferred.resolve();
        }, function(error) {
          deferred.reject(error);
        })
      }).then(function() {
        synchSolves();
      });
      return deferred.promise;
    };

    return solveManager;

  })

  .factory('synchSolves', function($rootScope, $q, $log, auth, appConfig, solveModel, solveLocalLoader, solveRemoteLoader, averageLoader) {
    var uploadSolves = function() {
      var deferred = $q.defer();
      var solvesToUpload = solveModel.solves.filter(function(solve) {
        return !('_id' in solve);
      });
      if (solvesToUpload.length === 0) {
        $log.debug('No solves to upload');
        deferred.resolve([]);
      } else {
        solvesToUpload.forEach(function(solve) {
          solve._user = auth.user._id;
        });
        solveRemoteLoader.uploadMany(solvesToUpload)
          .then(function(result) {
            deferred.resolve(result.created);
          }, function(error) {
            deferred.reject(error);
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
        var localSolves = solveLocalLoader.readSolves();
        var map = createSolvesMap(createdSolves);
        localSolves.forEach(function(solve) {
          var savedSolve = map[solve.state];
          if (savedSolve) {
            solve._id = savedSolve._id;
            solve._user = savedSolve._user;
          }
        });
        solveLocalLoader.writeSolves(localSolves);
        deferred.resolve(createdSolves);
      }
      return deferred.promise;
    };

    var retrieveLatestSolves = function() {
      var deferred = $q.defer();
      $log.debug('Retrieving latest solves');
      solveRemoteLoader.fecthRecent().then(function(latestSolves) {
        deferred.resolve(latestSolves);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var replaceLocalSolves = function(latestSolves) {
      var deferred = $q.defer();
      if (latestSolves.length === 0) {
        deferred.resolve('Synch complete: No remote solves returned');
        return deferred.promise;
      }
      var unSavedSolves = solveModel.solves.filter(function(solve) {
        return !('_id' in solve);
      });
      if (unSavedSolves.length > 0) {
        var unSavedSolvesMap = createSolvesMap(unSavedSolves);
        latestSolves.forEach(function(solve) {
          var latestSolve = unSavedSolvesMap[solve.state];
          if (latestSolve) {
            delete unSavedSolvesMap[solve.state];
          }
        });
        for (var state in unSavedSolvesMap) {
          if (unSavedSolvesMap.hasOwnProperty(state)) {
            latestSolves.push(unSavedSolvesMap[state]);
          }
        }
      }
      solveModel.solves = latestSolves;
      solveLocalLoader.writeSolves(latestSolves);
      var averages = averageLoader.calculateAverages(latestSolves);
      solveModel.averages = averages;
      averageLoader.writeAverages(averages);
      deferred.resolve('Synch complete: Local solves merged with latest remote solves');
      return deferred.promise;
    };

    var createSolvesMap = function(solves) {
      var solveMap = {};
      solves.forEach(function(solve) {
        solveMap[solve.state] = solve;
      });
      return solveMap;
    };

    return function() {
      var promise;
      if (! auth.user) {
        var deferred = $q.defer();
        deferred.resolve('Synch disabled: Not logged in');
        promise = deferred.promise;
      } else {
        if (solveModel.solves.length === 0) {
          promise = retrieveLatestSolves().then(replaceLocalSolves);
        } else {
          promise = uploadSolves()
            .then(updateLocalSolves)
            .then(retrieveLatestSolves)
            .then(replaceLocalSolves);
        }
      }
      return promise.then(function(message) {
        $log.debug(message);
        $rootScope.$broadcast('solvesUpdated');
      });
    };
  })

  .factory('averageLoader', function($rootScope, $localStorage, solveSorter) {
    var averageLoader = {};

    var sumSolveTimes = function(sum, solve) {
      if (solve.solveTime < sum.best.solveTime) {
        sum.best = solve;
      }
      sum.n++;
      sum.delta = solve.solveTime - sum.mean;
      sum.mean = sum.mean + sum.delta / sum.n;
      sum.m2 = sum.m2 + sum.delta*(solve.solveTime - sum.mean);
      if (sum.n === 5) {
        snapshotAverages(sum, 'ao5')
      }
      if (sum.n === 10) {
        snapshotAverages(sum, 'ao10')
      }
      if (sum.n === 100) {
        snapshotAverages(sum, 'ao100')
      }
      return sum;
    };

    var snapshotAverages= function(sum, name) {
      sum.averages[name] = {
        n: sum.n,
        best: sum.best,
        mean: sum.mean,
        standardDeviation: calculateStandardDeviation(sum)
      }
    }

    var calculateStandardDeviation = function(sum) {
      return Math.sqrt(sum.m2 / (sum.n - 1));
    }

    averageLoader.calculateAverages = function(solves) {
      solves = solveSorter.sort(solves);
      var averages = {};
      var sum = {
        n: 0,
        delta: 0,
        best: solves[0],
        mean: 0,
        m2: 0,
        averages: {}
      };
      solves.reduce(sumSolveTimes, sum);
      snapshotAverages(sum, 'all');
      return sum.averages;
    };

    averageLoader.readAverages = function() {
      var averages = angular.fromJson($localStorage.getItem('averages')) || [];
      return averages;
    };

    averageLoader.writeAverages = function(averages) {
      $localStorage.setItem('averages', angular.toJson(averages));
      return averages;
    };

    return averageLoader;
  })

  .factory('solveLocalLoader', function($rootScope, $localStorage, $q, $timeout, solveSorter) {
    var solveLocalLoader = {};

    solveLocalLoader.save = function(solve) {
      var deferred = $q.defer();
      var that = this;
      $timeout(function() {
        try {
          var solves = that.readSolves();
          if (!solve.date) {
            solve.date = new Date().getTime();
          }
          solves.unshift(solve);
          that.writeSolves(solves);
          deferred.resolve(solves);
        } catch(error) {
          deferred.reject(error);
        }
      }, 0);
      return deferred.promise;
    };

    solveLocalLoader.deleteSolve = function(remove) {
      var deferred = $q.defer();
      var that = this;
      $timeout(function() {
        try {
          var solves = that.readSolves();
          solves = solves.filter(function(solve) {
            return solve.state !== remove.state;
          });
          that.writeSolves(solves);
          deferred.resolve(solves);
        } catch(error) {
          deferred.reject(error);
        }
      }, 0);
      return deferred.promise;
    };

    solveLocalLoader.readSolves = function() {
      var solves = angular.fromJson($localStorage.getItem('solves')) || [];
      return solves;
    };

    solveLocalLoader.writeSolves = function(solves) {
      solves = solveSorter.sort(solves);
      $localStorage.setItem('solves', angular.toJson(solves));
      return solves;
    };

    return solveLocalLoader;
  })

  .factory('solveSorter', function() {
    var getTime = function(date) {
      if (date instanceof Date) {
        return date.getTime;
      }
      if (isNaN(date)) {
        return new Date(date).getTime();
      }
      return date;
    };

    return {
      sort: function(solves) {
        return solves.sort(function(a, b) {
          var aTime = getTime(a.date)
            , bTime = getTime(b.date);
          return bTime - aTime;
        });
      }
    };
  })

  .factory('solveRemoteLoader', function($http, $q, $log, auth, appConfig) {
    var solveRemoteLoader = {};

    solveRemoteLoader.fecthRecent = function() {
      var deferred = $q.defer();
      if (!auth.user) {
        deferred.reject(new Error('User not logged in'));
        return deferred.promise;
      }
      var url = appConfig.backend + '/solve';
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

    solveRemoteLoader.uploadMany = function(solves) {
      var deferred = $q.defer();
      if (!auth.user) {
        deferred.reject(new Error('User not logged in'));
        return deferred.promise;
      }
      var url = appConfig.backend + '/solve/create_all';
      $log.debug(solves.length + ' solves to upload');
      $http.post(url, {solves: solves})
        .then(function(response) {
          var result = response.data;
          $log.debug(result.created.length + ' solves uploaded');
          $log.debug(result.failed.length + ' solves not uploaded');
          deferred.resolve(result);
        }, function(response) {
          var message = '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    };

    solveRemoteLoader.createOnRemote = function(solve) {
      var deferred = $q.defer();
      var url = appConfig.backend + '/solve';
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

    solveRemoteLoader.deleteSolve = function(solve) {
      var deferred = $q.defer();
      if (!solve._id) {
        deferred.resolve('Local solve, remote deleted unnecessary.')
        return deferred.promise;
      }
      var url = appConfig.backend + '/solve/' + solve._id;
      $http.delete(
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

    return solveRemoteLoader;
  })

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
})(angular);
