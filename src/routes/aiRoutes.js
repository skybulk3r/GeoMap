const express = require('express');
const router = express.Router();
const multer = require('multer');
const damageDetector = require('../services/ai/damageDetector');
const modelLoader = require('../services/ai/modelLoader');

const upload = multer({ storage: multer.memoryStorage() });

// Initialize AI model
router.post('/init', async (req, res) => {
  try {
    const { modelPath, labelsPath } = req.body;
    await modelLoader.loadModel(modelPath);
    await modelLoader.loadLabels(labelsPath);
    res.json({ message: 'AI model initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detect damage in image
router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const results = await damageDetector.detect(req.file.buffer);
    res.json({
      detections: results,
      processingTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;