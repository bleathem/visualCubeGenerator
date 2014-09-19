describe('Unit: Cube Filters:', function() {
  beforeEach(module('cube.services'));
  describe("Time filter", function() {
    it('should convert time in milliseconds to a human readble format',
      inject(function(timeFilter) {
        expect(timeFilter(0)).toBe('0:00.000');
        expect(timeFilter(2123)).toBe('0:02.123');
        expect(timeFilter(2123.2376)).toBe('0:02.123');
        expect(timeFilter(30000)).toBe('0:30.000');
        expect(timeFilter(60000)).toBe('1:00.000');
      })
    );
    it('should convert time a time to milliseconds',
      inject(function(timeFilter) {
        var data = {
          minutes: 2,
          seconds: 34,
          millis: 153
        }
        var time = (data.minutes*60 + data.seconds) * 1000 + data.millis;
        expect(time).toBe(154153);
        expect(timeFilter(time)).toBe('2:34.153');
      })
    );
  });
});
