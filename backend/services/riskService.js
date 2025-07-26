function calculatePositionSize(balance, riskPercent, stopLossPips, pipValue) {
  const riskAmount = balance * (riskPercent / 100);
  return riskAmount / (stopLossPips * pipValue);
}

function dynamicSLTP(atr, invalidation, rr) {
  const sl = invalidation;
  const tp = sl * rr;
  return { sl, tp };
}

module.exports = { calculatePositionSize, dynamicSLTP };
