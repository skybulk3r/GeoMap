const express = require('express');
const router = express.Router();
const { validateLidarData } = require('../validators/lidarValidator');
const { processLidarData } = require('../services/lidar/processor');
const { saveLidarData } = require('../services/lidar/storage');

// Upload and process LiDAR data
router.post('/process', validateLidarData, async (req, res) => {
  try {
    const { flightId, data } = req.body;
    const processedData = await processLidarData(data);
    await saveLidarData(flightId, processedData);
    
    res.status(200).json({
      message: 'LiDAR data processed successfully',
      result: processedData.summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get processed LiDAR data for a flight
router.get('/flight/:flightId', async (req, res) => {
  try {
    const { flightId } = req.params;
    const data = await getLidarData(flightId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;