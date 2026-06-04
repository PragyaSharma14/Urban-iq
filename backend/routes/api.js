const express = require('express');
const router = express.Router();
const multer = require('multer');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const analyzeController = require('../controllers/analyzeController');
const pinController = require('../controllers/pinController');
const reportController = require('../controllers/reportController');

// Analyze route
router.post('/analyze', upload.array('images', 5), analyzeController.analyzeImages);

// Pins routes
router.post('/pins', pinController.createPin);
router.get('/pins', pinController.getPins);

// Reports routes
router.get('/reports', reportController.getReports);

module.exports = router;
