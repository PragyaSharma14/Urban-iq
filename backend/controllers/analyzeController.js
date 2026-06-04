const { analyzeWithGemini } = require('../utils/geminiClient');
const Report = require('../models/Report');

exports.analyzeImages = async (req, res) => {
  try {
    const { context, city, lat, lng } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Convert buffers to base64
    const imagesBase64 = req.files.map(file => {
      const b64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${b64}`;
    });

    const analysisResult = await analyzeWithGemini(imagesBase64, context, lat, lng);
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(analysisResult);
    } catch (e) {
      // Sometimes LLMs wrap JSON in markdown blocks
      const jsonMatch = analysisResult.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedResult = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse Groq response as JSON');
      }
    }

    // Save report to DB if connected
    let savedReport = null;
    if (require('mongoose').connection.readyState === 1) {
      savedReport = await Report.create({
        city: city || 'Unknown',
        context,
        lat,
        lng,
        analysis: parsedResult,
        images: imagesBase64
      });
    }

    res.json({
      success: true,
      report: parsedResult,
      savedReportId: savedReport ? savedReport._id : null
    });
  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
};
