const express = require('express');

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    checks: {
      database: 'OK', // Simulated - replace with actual DB check
      cache: 'OK', // Simulated - replace with actual cache check
      api: 'OK',
    },
  };

  res.status(200).json(health);
});

// Readiness probe
router.get('/ready', (req, res) => {
  // Check if app is ready to receive traffic
  res.status(200).json({
    status: 'ready',
    timestamp: Date.now(),
  });
});

// Liveness probe
router.get('/live', (req, res) => {
  // Check if app is alive
  res.status(200).json({
    status: 'alive',
    timestamp: Date.now(),
  });
});

module.exports = router;
