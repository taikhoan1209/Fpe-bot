const { Schema, model } = require('mongoose');

const PlanSchema = new Schema({
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Plan', PlanSchema);
