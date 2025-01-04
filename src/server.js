const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./config/database');
const droneMessaging = require('./services/messaging/droneMessaging');
const { apiLimiter } = require('./middleware/rateLimiter');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Protected routes
app.use('/api/flights', authenticate, require('./routes/flightRoutes'));
app.use('/api/drones', authenticate, authorize('admin', 'pilot'), require('./routes/droneRoutes'));
app.use('/api/lidar', authenticate, authorize('admin', 'pilot'), require('./routes/lidarRoutes'));
app.use('/api/data', authenticate, require('./routes/dataRoutes'));
app.use('/api/mapping', authenticate, require('./routes/mappingRoutes'));
app.use('/api/ai', authenticate, authorize('admin'), require('./routes/aiRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Initialize services and start server
Promise.all([
  setupDatabase(),
  droneMessaging.initialize()
])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });