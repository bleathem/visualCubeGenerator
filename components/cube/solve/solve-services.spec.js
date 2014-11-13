/* global describe:false */
/* global beforeEach:false */
/* global it:false */
/* global expect:false */
'use strict';

describe('Cube: solve: services:', function() {
  describe('solves factory:', function() {

    var solveModel;
    var solveManager;
    var $localStorageMock;
    var $rootScope;
    var $timeout;
    var $httpBackend;
    var appConfig;

    beforeEach(function() {
      angular.mock.module('visualCubeGenerator.config');
      angular.mock.module('cube.solve.services');
      angular.mock.module(function($provide) {
        $localStorageMock = (function() {
          var store = {
            solves: null,
            averages: null
          };
          return  {
            getItem: function(key) {
              return store[key];
            },
            setItem: function(key, value)  {
              store[key] = value;
            },
            clear: function() {
              store = {
                solves: null,
                averages: null
              };
            }
          };
        })();
        $provide.value('$localStorage', $localStorageMock);
      });
    });

    beforeEach(function() {
      angular.mock.inject(function(_solveModel_, _solveManager_,  _$rootScope_, _$timeout_, _$httpBackend_, _appConfig_) {
        solveModel = _solveModel_;
        solveManager = _solveManager_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        appConfig = _appConfig_;
      });
    });

    describe('solves service:', function() {
      var solvePostUrl;

      beforeEach(function() {
        solvePostUrl = appConfig.backend + '/solve';
      });

      it('should return save a solve to $localStorage', function() {
        var scramble = {
          key: 'testValue'
        };
        $httpBackend.expectPOST(solvePostUrl, {solve: scramble}).respond(201, '');
        solveManager.save(scramble).then(function() {
          var solves = JSON.parse($localStorageMock.getItem('solves'));
          expect(solves[0].key).toBe('testValue');
        });
        $timeout.flush();
      });

      describe('Average calculations:', function() {

        beforeEach(function() {
          $localStorageMock.clear();
          var now = new Date().getTime();
          var solves = [];
          for (var i = 1; i <= 14; i++) {
            var solve = {
              solveTime: 15000 - i * 1000,
              date: now + i
              };
            solves.push(solve);
          }
          solves.forEach(function(solve) {
            $httpBackend.expectPOST(solvePostUrl, {solve: solve}).respond(201, '');
            solveManager.save(solve);
            $timeout.flush();
          });
        });

        it('should calculate the average time over 5 solves', function() {
          expect(solveModel.averages.ao5.solveTime).toEqual(12000);
        });

        it('should calculate the average time over 10 solves', function() {
          expect(solveModel.averages.ao10.solveTime).toEqual(9500);
        });

        it('should calculate the average time over all solves', function() {
          expect(solveModel.averages.all.solveTime).toEqual(7500);
        });

        it('should calculate the best time over 5 solves', function() {
          expect(solveModel.averages.ao5.best.solveTime).toEqual(10000);
        });

        it('should calculate the best time over 10 solves', function() {
          expect(solveModel.averages.ao10.best.solveTime).toEqual(5000);
        });

        it('should calculate the best time over all solves', function() {
          expect(solveModel.averages.all.best.solveTime).toEqual(1000);
        });

      });
    });
  });

  describe('filters:', function() {

    beforeEach(angular.mock.module('cube.solve.services'));

    describe('solve time filter: ', function() {

      it('should convert time in milliseconds to a human readble format',
        angular.mock.inject(function(solveTimeFilter) {
          expect(solveTimeFilter(0)).toBe('0:00.000');
          expect(solveTimeFilter(2123)).toBe('0:02.123');
          expect(solveTimeFilter(2123.2376)).toBe('0:02.123');
          expect(solveTimeFilter(30000)).toBe('0:30.000');
          expect(solveTimeFilter(60000)).toBe('1:00.000');
        })
      );

      it('should convert time a time to milliseconds',
        angular.mock.inject(function(solveTimeFilter) {
          var data = {
            minutes: 2,
            seconds: 34,
            millis: 153
          };
          var time = (data.minutes*60 + data.seconds) * 1000 + data.millis;
          expect(time).toBe(154153);
          expect(solveTimeFilter(time)).toBe('2:34.153');
        })
      );
    });
  });
});
