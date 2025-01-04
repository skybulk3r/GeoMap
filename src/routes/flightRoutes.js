const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

// Get all flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new flight plan
router.post('/', async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flight status
router.patch('/:id/status', async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    await flight.update({ status: req.body.status });
    res.json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;