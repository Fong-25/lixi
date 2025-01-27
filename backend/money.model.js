const mongoose = require('mongoose');
const moneySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    lucky: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });
const Money = mongoose.model('Money', moneySchema);

module.exports = Money;