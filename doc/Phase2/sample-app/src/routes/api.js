const express = require('express');
const { body, validationResult } = require('express-validator');
const { sanitizeInput } = require('../middleware/security');

const router = express.Router();

// In-memory data store (for demo purposes)
const users = [
  { id: 1, username: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'user', email: 'user@example.com' },
];

const comments = [];

// Get API status
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    timestamp: Date.now(),
  });
});

// Get all users (public endpoint)
router.get('/users', (req, res) => {
  // Return users without sensitive data
  const publicUsers = users.map(({ id, username, email }) => ({
    id,
    username,
    email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
  }));

  res.json({
    users: publicUsers,
    count: publicUsers.length,
  });
});

// Get user by ID
router.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Input validation
  if (Number.isNaN(userId) || userId < 1) {
    return res.status(400).json({
      error: 'Invalid user ID',
      message: 'User ID must be a positive integer',
    });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${userId} does not exist`,
    });
  }

  return res.json(user);
});

// Create comment (with XSS protection)
router.post(
  '/comments',
  sanitizeInput,
  [
    body('comment')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Comment must be between 1 and 500 characters'),
    body('author')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Author name must be between 2 and 50 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        details: errors.array(),
      });
    }

    const { comment, author } = req.body;

    const newComment = {
      id: comments.length + 1,
      comment,
      author,
      timestamp: Date.now(),
    };

    comments.push(newComment);

    return res.status(201).json({
      message: 'Comment created successfully',
      comment: newComment,
    });
  },
);

// Get all comments
router.get('/comments', (req, res) => {
  res.json({
    comments,
    count: comments.length,
  });
});

// Simulated login endpoint (for security testing)
router.post(
  '/login',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain alphanumeric characters and underscores'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array(),
      });
    }

    const { username, password } = req.body;

    // Simulated authentication (do not use in production!)
    if (username === 'admin' && password === 'Admin123!') {
      return res.json({
        message: 'Login successful',
        token: 'demo_token_12345',
        user: { username: 'admin' },
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid username or password',
    });
  },
);

// Protected endpoint example
router.get('/admin/dashboard', (req, res) => {
  // Simulate authentication check
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  return res.json({
    message: 'Welcome to admin dashboard',
    data: {
      totalUsers: users.length,
      totalComments: comments.length,
    },
  });
});

module.exports = router;
