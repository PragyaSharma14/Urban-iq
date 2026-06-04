const Pin = require('../models/Pin');
const mongoose = require('mongoose');

exports.createPin = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const { city, lat, lng, problem_type, description } = req.body;
    
    const newPin = await Pin.create({
      city,
      lat,
      lng,
      problem_type,
      description
    });
    
    res.status(201).json(newPin);
  } catch (error) {
    console.error('Create Pin Error:', error);
    res.status(500).json({ error: 'Failed to create pin' });
  }
};

exports.getPins = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const pins = await Pin.find().sort({ created_at: -1 });
    res.json(pins);
  } catch (error) {
    console.error('Get Pins Error:', error);
    res.status(500).json({ error: 'Failed to fetch pins' });
  }
};
