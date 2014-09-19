describe('Unit: Cube Services:', function() {

  var Scrambles;
  var $localStorageMock;

  beforeEach(module('cube.services'));

  beforeEach(function() {
    module(function($provide) {
      $localStorageMock = function() {
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
            store = {};
          }
        }
      }();
      $provide.value('$localStorage', $localStorageMock);
    });
  });

  beforeEach(function() {
    inject(function(_Scrambles_) {
      Scrambles = _Scrambles_;
    });
  });

  describe('Scrambles Service:', function() {
    it('should return save a solve to $localStorage', function() {
      var scramble = {
        key: 'testValue'
      }
      Scrambles.save(scramble);
      var solves = JSON.parse($localStorageMock.getItem('solves'));
      expect(solves[0].key).toBe('testValue');
    });

    describe('Average calculations:', function() {

      beforeEach(function() {
        Scrambles.save({time: 1000});
        Scrambles.save({time: 2000});
        Scrambles.save({time: 3000});
        Scrambles.save({time: 4000});
        Scrambles.save({time: 5000});
        Scrambles.save({time: 6000});
        Scrambles.save({time: 7000});
        Scrambles.save({time: 8000});
        Scrambles.save({time: 9000});
        Scrambles.save({time: 10000});
        Scrambles.save({time: 11000});
        Scrambles.save({time: 12000});
        Scrambles.save({time: 13000});
        Scrambles.save({time: 14000});
      });

      it('should calculate the average time over 5 solves', function() {
        expect(Scrambles.averages().ao5.time).toEqual(12000);
      });

      it('should calculate the average time over 10 solves', function() {
        expect(Scrambles.averages().ao10.time).toEqual(9500);
      });

      it('should calculate the average time over all solves', function() {
        expect(Scrambles.averages().all.time).toEqual(7500);
      });

      it('should calculate the best time over 5 solves', function() {
        expect(Scrambles.averages().ao5.best.time).toEqual(10000);
      });

      it('should calculate the best time over 10 solves', function() {
        expect(Scrambles.averages().ao10.best.time).toEqual(5000);
      });

      it('should calculate the best time over all solves', function() {
        expect(Scrambles.averages().all.best.time).toEqual(1000);
      });

    });
  });
});
