const express = require('express');
const router = express.Router();
const droneMessaging = require('../services/messaging/droneMessaging');

// Send command to drone
router.post('/:droneId/command', async (req, res) => {
  try {
    const { droneId } = req.params;
    const { command } = req.body;
    
    await droneMessaging.sendDroneCommand(droneId, command);
    res.status(200).json({ message: 'Command sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;