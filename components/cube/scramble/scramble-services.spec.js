/* global describe:false */
/* global beforeEach:false */
/* global it:false */
/* global expect:false */
'use strict';

describe('Cube: scramble: services:', function() {
  describe('scrambles factory:', function() {

    beforeEach(angular.mock.module('cube.scramble.services'));

    it('should generate 5 scrambles',
      angular.mock.inject(function(scrambles, $timeout) {
        expect(scrambles.all().length).toBe(5);
        scrambles.regenerate(5);
        $timeout.flush();
        expect(scrambles.all().length).toBe(5);
      })
    );
  });
});
