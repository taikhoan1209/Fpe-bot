const express = require('express');
const Trade = require('../models/Trade');
const { calculatePositionSize, dynamicSLTP } = require('../services/riskService');

const router = express.Router();

router.get('/risk/dashboard', async (req, res) => {
  const trades = await Trade.find();
  const winTrades = trades.filter(t => t.result > 0).length;
  const winRate = trades.length ? winTrades / trades.length : 0;
  res.json({ totalTrades: trades.length, winRate });
});

router.post('/risk/position-size', (req, res) => {
  const { balance, riskPercent, stopLossPips, pipValue } = req.body;
  const size = calculatePositionSize(balance, riskPercent, stopLossPips, pipValue);
  res.json({ size });
});

router.post('/risk/dynamic-sl-tp', (req, res) => {
  const { atr, invalidation, rr } = req.body;
  const result = dynamicSLTP(atr, invalidation, rr);
  res.json(result);
});

module.exports = router;
