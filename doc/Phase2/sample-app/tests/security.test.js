const request = require('supertest');
const app = require('../src/app');

describe('Security Tests', () => {
  describe('XSS Protection', () => {
    it('should sanitize script tags in comments', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: '<script>alert("XSS")</script>Hello',
          author: 'TestUser',
        });

      expect(response.status).toBe(201);
      expect(response.body.comment.comment).not.toContain('<script>');
    });

    it('should remove event handlers from input', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: '<img src=x onerror="alert(1)">',
          author: 'TestUser',
        });

      expect(response.status).toBe(201);
      expect(response.body.comment.comment).not.toMatch(/onerror=/i);
    });

    it('should remove iframe tags', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: '<iframe src="evil.com"></iframe>Test',
          author: 'TestUser',
        });

      expect(response.status).toBe(201);
      expect(response.body.comment.comment).not.toContain('<iframe>');
    });
  });

  describe('Input Validation', () => {
    it('should reject empty comments', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: '',
          author: 'TestUser',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject comments exceeding max length', async () => {
      const longComment = 'a'.repeat(501);
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: longComment,
          author: 'TestUser',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid author names', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: 'Valid comment',
          author: 'a', // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication & Authorization', () => {
    it('should reject login with invalid username format', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: "'; DROP TABLE users; --",
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with short password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'short',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'wronguser',
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for protected endpoint without auth', async () => {
      const response = await request(app).get('/api/admin/dashboard');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', 'Bearer demo_token_12345');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Security Headers', () => {
    it('should set X-Frame-Options header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should set X-Content-Type-Options header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set X-XSS-Protection header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-xss-protection']).toBeDefined();
    });

    it('should set Content-Security-Policy header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests under the limit', async () => {
      const requests = [];

      // Send 5 requests (well under the 100 limit)
      for (let i = 0; i < 5; i += 1) {
        requests.push(request(app).get('/api/status'));
      }

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    // Note: Testing actual rate limiting requires many requests
    // and may be slow. This is a simplified test.
    it('should have rate limit headers', async () => {
      const response = await request(app).get('/api/status');

      // Check for rate limit headers
      expect(response.headers['ratelimit-limit']).toBeDefined();
    });
  });

  describe('SQL Injection Protection', () => {
    it('should handle SQL injection attempt in user ID', async () => {
      const response = await request(app).get("/api/users/1' OR '1'='1");

      // Should return 400 for invalid input, not execute SQL
      expect(response.status).toBe(400);
    });

    it('should validate numeric parameters', async () => {
      const response = await request(app).get('/api/users/1 UNION SELECT * FROM passwords');

      expect(response.status).toBe(400);
    });
  });
});
