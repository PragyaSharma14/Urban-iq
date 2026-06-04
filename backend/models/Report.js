const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  city: { type: String },
  context: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  analysis: { type: Object, required: true },
  images: [{ type: String }], // base64 strings
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
