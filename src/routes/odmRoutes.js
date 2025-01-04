const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processImagery, checkProcessingStatus } = require('../services/odm/processor');

const upload = multer({ storage: multer.memoryStorage() });

// Start processing imagery
router.post('/process/:flightId', upload.array('images'), async (req, res) => {
  try {
    const { flightId } = req.params;
    const { images } = req.files;
    const options = req.body.options ? JSON.parse(req.body.options) : {};

    const task = await processImagery(flightId, images, options);
    res.status(200).json({
      message: 'Processing started successfully',
      ...task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check processing status
router.get('/status/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const status = await checkProcessingStatus(projectId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;