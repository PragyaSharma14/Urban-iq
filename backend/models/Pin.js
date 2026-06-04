const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
  city: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  problem_type: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pin', PinSchema);
