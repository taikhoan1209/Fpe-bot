const { Schema, model } = require('mongoose');

const JournalSchema = new Schema({
  trade: { type: Schema.Types.ObjectId, ref: 'Trade' },
  notes: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Journal', JournalSchema);
