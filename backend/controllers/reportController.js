const Report = require('../models/Report');
const mongoose = require('mongoose');

exports.getReports = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    // Don't fetch full images for list view to save bandwidth
    const reports = await Report.find().select('-images').sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};
