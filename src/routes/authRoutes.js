const express = require('express');
const router = express.Router();
const User = require('../models/User');
const tokenService = require('../services/auth/tokenService');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.create({ email, password, role });
    const token = tokenService.generateToken(user);
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !await user.validatePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = tokenService.generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', authenticate, (req, res) => {
  // Client should discard token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;