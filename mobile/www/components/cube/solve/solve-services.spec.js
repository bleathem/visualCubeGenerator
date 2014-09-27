/* global describe:false */
/* global beforeEach:false */
/* global it:false */
/* global inject:false */
/* global expect:false */
'use strict';
describe('Cube: solve: services:', function() {
  describe('solves factory:', function() {

    var solves;
    var $localStorageMock;
    var $rootScope;
    var $timeout;

    beforeEach(module('cube.solve.services'));

    beforeEach(function() {
      module(function($provide) {
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
      inject(function(_solves_, _$rootScope_, _$timeout_) {
        solves = _solves_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
      });
    });

    describe('solves service:', function() {
      it('should return save a solve to $localStorage', function() {
        var scramble = {
          key: 'testValue'
        };
        solves.save(scramble).then(function() {
          var solves = JSON.parse($localStorageMock.getItem('solves'));
          expect(solves[0].key).toBe('testValue');
        });
      });

      describe('Average calculations:', function() {

        beforeEach(function() {
          $localStorageMock.clear();
          for (var i = 1; i <= 14; i++) {
            solves.save({time: i * 1000});
            $timeout.flush();
          }
        });

        it('should calculate the average time over 5 solves', function() {
          expect(solves.averages().ao5.time).toEqual(12000);
        });

        it('should calculate the average time over 10 solves', function() {
          expect(solves.averages().ao10.time).toEqual(9500);
        });

        it('should calculate the average time over all solves', function() {
          expect(solves.averages().all.time).toEqual(7500);
        });

        it('should calculate the best time over 5 solves', function() {
          expect(solves.averages().ao5.best.time).toEqual(10000);
        });

        it('should calculate the best time over 10 solves', function() {
          expect(solves.averages().ao10.best.time).toEqual(5000);
        });

        it('should calculate the best time over all solves', function() {
          expect(solves.averages().all.best.time).toEqual(1000);
        });

      });
    });
  });

  describe('filters:', function() {

    beforeEach(module('cube.solve.services'));

    describe('solve time filter: ', function() {

      it('should convert time in milliseconds to a human readble format',
        inject(function(solveTimeFilter) {
          expect(solveTimeFilter(0)).toBe('0:00.000');
          expect(solveTimeFilter(2123)).toBe('0:02.123');
          expect(solveTimeFilter(2123.2376)).toBe('0:02.123');
          expect(solveTimeFilter(30000)).toBe('0:30.000');
          expect(solveTimeFilter(60000)).toBe('1:00.000');
        })
      );

      it('should convert time a time to milliseconds',
        inject(function(solveTimeFilter) {
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
