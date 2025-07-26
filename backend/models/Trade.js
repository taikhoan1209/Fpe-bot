const { Schema, model } = require('mongoose');

const TradeSchema = new Schema({
  symbol: String,
  entry: Number,
  sl: Number,
  tp: Number,
  size: Number,
  riskPercent: Number,
  hedge: Boolean,
  correlation: Number,
  result: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Trade', TradeSchema);
