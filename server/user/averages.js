'use strict';

var sumSolveTimes = function(sum, solve) {
  if (solve.solveTime < sum.best.solveTime) {
    sum.best = solve;
  }
  sum.n++;
  sum.delta = solve.solveTime - sum.mean;
  sum.mean = sum.mean + sum.delta / sum.n;
  sum.m2 = sum.m2 + sum.delta*(solve.solveTime - sum.mean);
  if (sum.n === 5) {
    snapshotAverages(sum, 'ao5');
  }
  if (sum.n === 10) {
    snapshotAverages(sum, 'ao10');
  }
  if (sum.n === 100) {
    snapshotAverages(sum, 'ao100');
  }
  return sum;
};

var snapshotAverages= function(sum, name) {
  sum.averages[name] = {
    n: sum.n,
    best: sum.best,
    mean: sum.mean,
    standardDeviation: Math.sqrt(sum.m2 / (sum.n - 1))
  };
};

module.exports = exports = {
  sumSolveTimes: sumSolveTimes,
  snapshotAverages: snapshotAverages,
  Seed: function() {
    this.n = 0;
    this.delta = 0;
    this.best = {solveTime: Number.MAX_VALUE};
    this.mean = 0;
    this.m2 = 0;
    this.averages = {};
  }
}
