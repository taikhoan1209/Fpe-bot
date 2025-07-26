const { calculatePositionSize, dynamicSLTP } = require('../services/riskService');

test('calculatePositionSize returns correct position size', () => {
  const size = calculatePositionSize(10000, 1, 50, 10);
  expect(size).toBeCloseTo(10000 * 0.01 / (50 * 10));
});

test('dynamicSLTP returns sl and tp based on invalidation and rr', () => {
  const result = dynamicSLTP(1, 100, 2);
  expect(result).toEqual({ sl: 100, tp: 200 });
});
