# Phase 3: Security Workshop - QA Role

**Role**: Quality Assurance (QA)
**Phase Duration**: November 24-28, 2025 (5 days)
**Prerequisites**: Completion of Phase 1 and Phase 2

---

## Overview

ในฐานะ QA คุณจะรับผิดชอบในการออกแบบ Security Test Cases, Negative Tests, ตรวจสอบ Branch Protection Rules, และทดสอบระบบ Alerting รวมถึงการใช้ GitHub Copilot เพื่อช่วยสร้าง Test Cases และ GitHub Enterprise Features สำหรับการทดสอบ

---

## Tasks Overview

| Task | Description | Duration | Priority |
|------|-------------|----------|----------|
| Task 1 | Design Security Test Cases and Negative Tests | 3-4 hours | High |
| Task 2 | Verify Branch Protection Rules | 2-3 hours | High |
| Task 3 | Test Alerting System and Security Monitoring | 2-3 hours | Medium |
| Task 4 | Automated Security Testing with GitHub Actions | 2-3 hours | Medium |

---

## Task 1: Design Security Test Cases and Negative Tests

### Objectives
- สร้าง Security Test Scenarios
- ออกแบบ Negative Test Cases
- เตรียม Penetration Test Plan

### Preparation Checklist
- [ ] ศึกษา OWASP Top 10
- [ ] รวบรวม Attack Vectors
- [ ] เตรียม Test Data สำหรับ Security Testing
- [ ] วางแผน Automated Security Tests

### OWASP Top 10 Security Test Cases

#### 1. Injection Attacks

```javascript
// tests/security/injection.test.js
const { login, search, executeQuery } = require('../../src/auth');

describe('SQL Injection Tests', () => {
  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "admin'--",
    "1' OR '1'='1' /*",
    "' UNION SELECT * FROM users--",
    "'; INSERT INTO users VALUES('hacker', 'password'); --"
  ];

  sqlInjectionPayloads.forEach(payload => {
    it(`should reject SQL injection payload: ${payload.substring(0, 20)}...`, async () => {
      const response = await login(payload, 'password');
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });
  });

  it('should reject SQL injection in search query', async () => {
    const maliciousInput = "'; DELETE FROM products; --";
    const response = await search(maliciousInput);
    expect(response.success).toBe(false);
    // Verify data is not deleted
    const products = await executeQuery('SELECT COUNT(*) FROM products');
    expect(products.count).toBeGreaterThan(0);
  });
});

describe('NoSQL Injection Tests', () => {
  const noSqlPayloads = [
    { "$gt": "" },
    { "$ne": null },
    { "$where": "sleep(1000)" }
  ];

  noSqlPayloads.forEach(payload => {
    it(`should reject NoSQL injection payload`, async () => {
      const response = await login(JSON.stringify(payload), 'password');
      expect(response.success).toBe(false);
    });
  });
});
```

#### 2. Broken Authentication

```javascript
// tests/security/authentication.test.js
describe('Authentication Security', () => {
  describe('Account Lockout', () => {
    it('should lockout after 5 failed attempts', async () => {
      const email = 'test@example.com';

      // Attempt login 5 times with wrong password
      for (let i = 0; i < 5; i++) {
        await login(email, 'wrongpassword');
      }

      // 6th attempt should be blocked
      const response = await login(email, 'correctpassword');
      expect(response.success).toBe(false);
      expect(response.error).toContain('Account locked');
    });

    it('should unlock account after cooldown period', async () => {
      // Wait for cooldown
      await sleep(15 * 60 * 1000); // 15 minutes

      const response = await login('test@example.com', 'correctpassword');
      expect(response.success).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('should invalidate old sessions after password change', async () => {
      const session1 = await login('user@example.com', 'password');
      expect(session1.token).toBeDefined();

      // Change password
      await changePassword('user@example.com', 'newpassword');

      // Old session should be invalid
      const response = await authenticatedRequest(session1.token);
      expect(response.status).toBe(401);
    });

    it('should enforce session timeout', async () => {
      const session = await login('user@example.com', 'password');

      // Wait for session timeout
      await sleep(30 * 60 * 1000); // 30 minutes

      const response = await authenticatedRequest(session.token);
      expect(response.status).toBe(401);
      expect(response.error).toContain('Session expired');
    });
  });

  describe('Password Policy', () => {
    const weakPasswords = [
      '123456',
      'password',
      'abc123',
      'qwerty',
      'admin',
      '12345678',
      'user123'
    ];

    weakPasswords.forEach(pwd => {
      it(`should reject weak password: ${pwd}`, async () => {
        const response = await register('new@example.com', pwd);
        expect(response.success).toBe(false);
        expect(response.error).toContain('Password too weak');
      });
    });

    it('should require minimum password length', async () => {
      const response = await register('new@example.com', 'Ab1!xyz');
      expect(response.success).toBe(false);
      expect(response.error).toContain('at least 8 characters');
    });

    it('should require password complexity', async () => {
      const response = await register('new@example.com', 'abcdefgh');
      expect(response.success).toBe(false);
      expect(response.error).toContain('uppercase, lowercase, number');
    });
  });
});
```

#### 3. Sensitive Data Exposure

```javascript
// tests/security/data-exposure.test.js
describe('Data Protection', () => {
  describe('API Response Security', () => {
    it('should not expose passwords in user response', async () => {
      const user = await getUser('user@example.com');

      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('passwordHash');
      expect(user).not.toHaveProperty('salt');
    });

    it('should not expose internal IDs', async () => {
      const user = await getUser('user@example.com');

      expect(user).not.toHaveProperty('_id');
      expect(user).not.toHaveProperty('internalId');
    });

    it('should mask sensitive data', async () => {
      const payment = await getPaymentDetails('user@example.com');

      expect(payment.cardNumber).toMatch(/\*{12}\d{4}/); // ************1234
      expect(payment.cvv).toBeUndefined();
    });
  });

  describe('Transport Security', () => {
    it('should enforce HTTPS', async () => {
      const response = await fetch('http://api.example.com/data');
      expect(response.status).toBe(301); // Redirect to HTTPS
    });

    it('should have secure headers', async () => {
      const response = await fetch('https://api.example.com');

      expect(response.headers.get('Strict-Transport-Security')).toBeTruthy();
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });
  });

  describe('Credit Card Data', () => {
    it('should mask credit card numbers correctly', () => {
      expect(maskCreditCard('1234567890123456')).toBe('************3456');
      expect(maskCreditCard('4111111111111111')).toBe('************1111');
    });

    it('should not log credit card numbers', async () => {
      await processPayment({
        cardNumber: '4111111111111111',
        amount: 100
      });

      const logs = await getLogs();
      logs.forEach(log => {
        expect(log).not.toContain('4111111111111111');
      });
    });
  });
});
```

#### 4. Broken Access Control

```javascript
// tests/security/access-control.test.js
describe('Authorization Tests', () => {
  describe('Role-Based Access Control', () => {
    it('should prevent regular user from accessing admin endpoints', async () => {
      const userToken = await login('user@example.com', 'password');

      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${userToken.token}` }
      });

      expect(response.status).toBe(403);
    });

    it('should allow admin to access admin endpoints', async () => {
      const adminToken = await login('admin@example.com', 'adminpassword');

      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken.token}` }
      });

      expect(response.status).toBe(200);
    });
  });

  describe('IDOR (Insecure Direct Object Reference)', () => {
    it('should prevent user from accessing other user data', async () => {
      const user1Token = await login('user1@example.com', 'password');

      // Try to access user2's profile
      const response = await fetch('/api/users/user2/profile', {
        headers: { Authorization: `Bearer ${user1Token.token}` }
      });

      expect(response.status).toBe(403);
    });

    it('should prevent user from modifying other user orders', async () => {
      const user1Token = await login('user1@example.com', 'password');

      const response = await fetch('/api/orders/user2-order-123', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user1Token.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Privilege Escalation', () => {
    it('should prevent role modification by regular user', async () => {
      const userToken = await login('user@example.com', 'password');

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'admin' })
      });

      // Should either reject or ignore the role field
      expect([403, 200].includes(response.status)).toBe(true);

      // Verify role wasn't changed
      const user = await getUser('user@example.com');
      expect(user.role).toBe('user');
    });
  });
});
```

#### 5. Cross-Site Scripting (XSS)

```javascript
// tests/security/xss.test.js
describe('XSS Protection', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    'javascript:alert(1)',
    '<body onload=alert(1)>',
    '<iframe src="javascript:alert(1)">',
    '<input onfocus=alert(1) autofocus>',
    '<marquee onstart=alert(1)>',
    '"><script>alert(1)</script>',
    "'-alert(1)-'"
  ];

  describe('Input Sanitization', () => {
    xssPayloads.forEach(payload => {
      it(`should sanitize XSS payload: ${payload.substring(0, 30)}...`, () => {
        const sanitized = sanitizeHTML(payload);

        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('javascript:');
      });
    });
  });

  describe('Output Encoding', () => {
    it('should encode HTML entities in user content', async () => {
      await createComment('<script>alert("XSS")</script>');
      const page = await renderPage();

      expect(page).toContain('&lt;script&gt;');
      expect(page).not.toContain('<script>');
    });

    it('should encode special characters in JSON response', async () => {
      const user = await createUser({ name: '<b>Test</b>' });
      const response = await getUser(user.id);

      expect(response.name).toBe('&lt;b&gt;Test&lt;/b&gt;');
    });
  });

  describe('Content Security Policy', () => {
    it('should have CSP header', async () => {
      const response = await fetch('/');

      const csp = response.headers.get('Content-Security-Policy');
      expect(csp).toBeTruthy();
      expect(csp).toContain("default-src 'self'");
    });
  });
});
```

#### 6. Security Misconfiguration

```javascript
// tests/security/configuration.test.js
describe('Security Configuration', () => {
  describe('Security Headers', () => {
    it('should have all required security headers', async () => {
      const response = await fetch('/');

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
      expect(response.headers.get('Strict-Transport-Security')).toBeTruthy();
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy();
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });
  });

  describe('Information Disclosure', () => {
    it('should not expose server information', async () => {
      const response = await fetch('/');

      expect(response.headers.get('Server')).toBeFalsy();
      expect(response.headers.get('X-Powered-By')).toBeFalsy();
    });

    it('should not expose stack traces in production', async () => {
      const response = await fetch('/api/error-endpoint');

      expect(response.body).not.toContain('at Function');
      expect(response.body).not.toContain('node_modules');
      expect(response.body).not.toContain('.js:');
    });

    it('should return generic error messages', async () => {
      const response = await login('user@example.com', 'wrongpassword');

      expect(response.error).toBe('Invalid credentials');
      expect(response.error).not.toContain('User not found');
      expect(response.error).not.toContain('Password incorrect');
    });
  });

  describe('Debug Mode', () => {
    it('should not have debug endpoints in production', async () => {
      const debugEndpoints = ['/debug', '/phpinfo', '/.env', '/config'];

      for (const endpoint of debugEndpoints) {
        const response = await fetch(endpoint);
        expect(response.status).toBe(404);
      }
    });
  });
});
```

### Negative Test Cases

#### Input Validation Tests

```javascript
// tests/security/negative-tests.test.js
describe('Negative Input Tests', () => {
  const invalidInputs = [
    { input: null, description: 'null value' },
    { input: undefined, description: 'undefined value' },
    { input: '', description: 'empty string' },
    { input: ' ', description: 'whitespace only' },
    { input: 'a'.repeat(10000), description: 'very long string' },
    { input: '<script>alert(1)</script>', description: 'XSS payload' },
    { input: '../../../etc/passwd', description: 'path traversal' },
    { input: '${7*7}', description: 'template injection' },
    { input: '\0', description: 'null byte' },
    { input: '\u0000', description: 'unicode null' },
    { input: '${__proto__}', description: 'prototype pollution' },
    { input: '{{7*7}}', description: 'SSTI payload' }
  ];

  invalidInputs.forEach(({ input, description }) => {
    it(`should handle ${description}`, async () => {
      const response = await processInput(input);

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });
  });
});

describe('Boundary Tests', () => {
  describe('Numeric Boundaries', () => {
    it('should reject negative amounts', async () => {
      const response = await transfer(-100);
      expect(response.success).toBe(false);
    });

    it('should reject zero amount', async () => {
      const response = await transfer(0);
      expect(response.success).toBe(false);
    });

    it('should reject amounts exceeding maximum', async () => {
      const response = await transfer(Number.MAX_SAFE_INTEGER + 1);
      expect(response.success).toBe(false);
    });

    it('should reject floating point amounts with too many decimals', async () => {
      const response = await transfer(100.123456789);
      expect(response.success).toBe(false);
    });
  });

  describe('String Length Boundaries', () => {
    it('should reject username exceeding max length', async () => {
      const response = await register('a'.repeat(256) + '@example.com', 'password');
      expect(response.success).toBe(false);
    });

    it('should reject empty username', async () => {
      const response = await register('', 'password');
      expect(response.success).toBe(false);
    });
  });
});

describe('Rate Limiting Tests', () => {
  it('should block after too many requests', async () => {
    const requests = Array(1000).fill().map(() =>
      fetch('/api/endpoint')
    );

    const responses = await Promise.all(requests);
    const blockedRequests = responses.filter(r => r.status === 429);

    expect(blockedRequests.length).toBeGreaterThan(0);
  });

  it('should include retry-after header when rate limited', async () => {
    // Trigger rate limit
    for (let i = 0; i < 100; i++) {
      await fetch('/api/endpoint');
    }

    const response = await fetch('/api/endpoint');
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeTruthy();
  });
});
```

### Penetration Testing Plan

```markdown
## Penetration Test Plan

### Scope
- **Application**: [Application Name]
- **Version**: [Version]
- **Environment**: Staging
- **Timeline**: 1 week
- **Test Window**: Monday-Friday, 9 AM - 6 PM

### Excluded from Scope
- Production environment
- Third-party services
- Physical security
- Social engineering

### Test Areas

#### 1. Authentication & Authorization (Priority: Critical)
- [ ] Password brute force protection
- [ ] Session management
- [ ] MFA bypass attempts
- [ ] OAuth implementation
- [ ] JWT token security

#### 2. Input Validation (Priority: High)
- [ ] SQL injection
- [ ] NoSQL injection
- [ ] XSS (Stored, Reflected, DOM)
- [ ] Command injection
- [ ] LDAP injection

#### 3. Access Control (Priority: High)
- [ ] IDOR vulnerabilities
- [ ] Privilege escalation
- [ ] Forced browsing
- [ ] Missing function level access control

#### 4. Business Logic (Priority: Medium)
- [ ] Race conditions
- [ ] Business flow bypass
- [ ] Price manipulation
- [ ] Workflow bypass

#### 5. API Security (Priority: High)
- [ ] API authentication
- [ ] Rate limiting
- [ ] Mass assignment
- [ ] API versioning issues

### Tools
- **Manual Testing**: Burp Suite Professional
- **Automated Scanning**: OWASP ZAP
- **SQL Injection**: SQLMap
- **Fuzzing**: ffuf, wfuzz
- **Reconnaissance**: Nmap, dirsearch

### Reporting
- Executive summary for management
- Technical report with details
- Remediation recommendations
- Re-test verification

### Success Criteria
- [ ] No critical vulnerabilities remain
- [ ] All high vulnerabilities have remediation plan
- [ ] Medium vulnerabilities documented
- [ ] Penetration test report completed
```

### Deliverables
- [ ] Security test suite completed
- [ ] Negative test cases documented
- [ ] Automated security testing workflow
- [ ] Penetration testing plan
- [ ] Vulnerability reports

---

## Task 2: Verify Branch Protection Rules

### Objectives
- ทดสอบ Required Reviews
- ตรวจสอบ Status Checks
- ยืนยัน Protection Rules ทำงานถูกต้อง

### Preparation Checklist
- [ ] สร้าง Test Scenarios สำหรับแต่ละ Rule
- [ ] เตรียม Test Branches
- [ ] วางแผน Validation Tests
- [ ] เตรียม Test Report Template

### Test Scenarios

#### Test Scenario 1: Required Reviews

```markdown
## Test Case: Required Approvals

### Preconditions
- Branch protection enabled on main
- Required approvals set to 2

### Test Steps
1. Create feature branch from develop
2. Make changes and commit
3. Create PR to main
4. Try to merge without approval
5. Get 1 approval
6. Try to merge
7. Get 2nd approval
8. Try to merge

### Expected Results
| Step | Expected Result |
|------|-----------------|
| 4    | Merge blocked - "Review required" |
| 6    | Merge blocked - "2 reviews required" |
| 8    | Merge allowed |

### Actual Results
[Record during testing]

### Status
- [ ] Pass
- [ ] Fail
```

#### Test Scenario 2: Status Checks

```markdown
## Test Case: Required Status Checks

### Preconditions
- Branch protection enabled
- CI workflow configured
- Required status checks: CI, Tests, Security Scan

### Test Steps
1. Create PR to main
2. CI fails intentionally (syntax error)
3. Try to merge
4. Fix CI issue
5. Wait for all checks to pass
6. Try to merge

### Expected Results
| Step | Expected Result |
|------|-----------------|
| 3    | Merge blocked - "Required checks failing" |
| 6    | Merge allowed (if reviews approved) |

### Actual Results
[Record during testing]
```

#### Test Scenario 3: Force Push Protection

```markdown
## Test Case: Block Force Push

### Test Steps
1. Clone protected branch (main)
2. Make some commits
3. Amend commit history
4. Try to force push

### Commands
```bash
git checkout main
git commit --allow-empty -m "Test commit"
git commit --amend -m "Amended commit"
git push --force origin main
```

### Expected Result
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Cannot force-push to a protected branch
```

### Status
- [ ] Force push rejected as expected
- [ ] Error message clear and helpful
```

### Automated Branch Rule Validation

```javascript
// tests/branch-protection.test.js
const { Octokit } = require('@octokit/rest');

describe('Branch Protection Rules Validation', () => {
  let octokit;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  beforeAll(() => {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  });

  describe('Main Branch Protection', () => {
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

    it('should require at least 2 approvals', () => {
      expect(protection.required_pull_request_reviews.required_approving_review_count)
        .toBeGreaterThanOrEqual(2);
    });

    it('should dismiss stale reviews', () => {
      expect(protection.required_pull_request_reviews.dismiss_stale_reviews)
        .toBe(true);
    });

    it('should require CODEOWNERS review', () => {
      expect(protection.required_pull_request_reviews.require_code_owner_reviews)
        .toBe(true);
    });

    it('should require status checks', () => {
      expect(protection.required_status_checks).toBeDefined();
    });

    it('should require specific status checks', () => {
      const contexts = protection.required_status_checks.contexts;
      expect(contexts).toContain('CI');
      expect(contexts).toContain('Tests');
      expect(contexts).toContain('Security Scan');
    });

    it('should require branches to be up to date', () => {
      expect(protection.required_status_checks.strict).toBe(true);
    });

    it('should enforce for administrators', () => {
      expect(protection.enforce_admins.enabled).toBe(true);
    });

    it('should block force pushes', () => {
      expect(protection.allow_force_pushes.enabled).toBe(false);
    });

    it('should block deletions', () => {
      expect(protection.allow_deletions.enabled).toBe(false);
    });

    it('should require conversation resolution', () => {
      expect(protection.required_conversation_resolution.enabled).toBe(true);
    });
  });

  describe('Develop Branch Protection', () => {
    let protection;

    beforeAll(async () => {
      const { data } = await octokit.repos.getBranchProtection({
        owner,
        repo,
        branch: 'develop'
      });
      protection = data;
    });

    it('should require at least 1 approval', () => {
      expect(protection.required_pull_request_reviews.required_approving_review_count)
        .toBeGreaterThanOrEqual(1);
    });

    it('should block force pushes', () => {
      expect(protection.allow_force_pushes.enabled).toBe(false);
    });
  });
});
```

### Test Report Template

```markdown
# Branch Protection Validation Report

**Date**: [Test Date]
**Tester**: [QA Name]
**Repository**: [Repository Name]

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 15 |
| Passed | 14 |
| Failed | 1 |
| Skipped | 0 |

## Test Results

### Main Branch Protection

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Required reviews (2) | Block merge | Blocked | Pass |
| Status checks required | Block merge | Blocked | Pass |
| CODEOWNERS required | Block merge | Blocked | Pass |
| Conversation resolution | Block merge | Blocked | Pass |
| Up-to-date branch | Block merge | Not blocked | **FAIL** |
| Force push | Prevent | Prevented | Pass |
| Branch deletion | Prevent | Prevented | Pass |

### Develop Branch Protection

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Required reviews (1) | Block merge | Blocked | Pass |
| Status checks | Block merge | Blocked | Pass |

## Issues Found

### Issue 1: Up-to-date Branch Not Enforced
- **Severity**: Medium
- **Description**: PRs can be merged without updating to latest main
- **Impact**: Potential merge conflicts and integration issues
- **Recommendation**: Enable "Require branches to be up to date before merging"

## Recommendations

1. Enable all recommended protection rules
2. Schedule monthly validation tests
3. Document any approved exceptions
4. Add alerting for rule changes

## Sign-off

- [ ] QA Lead reviewed
- [ ] DevOps Lead reviewed
- [ ] PM acknowledged
```

### Deliverables
- [ ] Branch protection validation test suite
- [ ] Test execution report
- [ ] Issues and recommendations document
- [ ] Automated validation script

---

## Task 3: Test Alerting System and Security Monitoring

### Objectives
- ทดสอบ Alerts เมื่อตรวจพบ Vulnerabilities
- ตรวจสอบ Monitoring Systems
- ยืนยัน Incident Response Process

### Alert Testing Scenarios

#### 3.1 Vulnerability Alert Test

```markdown
## Test: Dependabot Vulnerability Alert

### Setup
1. Create a test branch
2. Add vulnerable dependency:
   ```json
   {
     "dependencies": {
       "lodash": "4.17.0"  // Known vulnerability
     }
   }
   ```
3. Push and wait for alert

### Expected Behavior
- [ ] Dependabot creates alert within 5 minutes
- [ ] Alert shows correct severity
- [ ] Email notification sent
- [ ] Slack notification sent (if configured)
- [ ] GitHub Security tab updated

### Validation Steps
1. Check GitHub Security tab
2. Verify email received
3. Check Slack channel
4. Verify alert details are correct

### Cleanup
- Delete test branch
- Mark alert as dismissed (test)
```

#### 3.2 Secret Scanning Alert Test

```markdown
## Test: Secret Detected in Commit

### Setup
1. Create test file with fake (test) secret:
   ```javascript
   // This is a TEST secret - not real
   const TEST_API_KEY = "sk_test_51abcdefghijklmnop_FAKE";
   ```
2. Commit and push

### Expected Behavior
- [ ] Push blocked (if push protection enabled)
- [ ] Or alert created after push
- [ ] Security team notified
- [ ] Incident ticket created (if automated)

### Validation
1. Verify push was blocked OR alert created
2. Check notification channels
3. Verify alert details

### Cleanup
- Revert commit
- Mark alert as resolved
```

#### 3.3 Failed Security Scan Test

```yaml
# .github/workflows/test-security-alert.yml
name: Test Security Alerting

on:
  workflow_dispatch:
    inputs:
      test_type:
        description: 'Type of alert to test'
        required: true
        type: choice
        options:
          - vulnerability
          - secret
          - scan-failure

jobs:
  test-vulnerability-alert:
    if: github.event.inputs.test_type == 'vulnerability'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Create test package.json
      run: |
        echo '{"dependencies":{"lodash":"4.17.0"}}' > package.json

    - name: Run npm audit
      run: npm audit
      continue-on-error: true

    - name: Verify alert behavior
      run: |
        echo "Vulnerability alert test completed"
        echo "Check GitHub Security tab for alert"

  test-notification:
    runs-on: ubuntu-latest
    steps:
    - name: Send test notification to Slack
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": ":test_tube: Test Alert",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*This is a test alert*\nTesting notification system"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}

    - name: Verify notification sent
      run: echo "Check Slack channel for test message"
```

### Monitoring Dashboard Validation

```markdown
## Monitoring Dashboard Checklist

### GitHub Security Overview
- [ ] Can access Organization → Security
- [ ] Security alerts visible across repos
- [ ] Dependabot alerts summary shows
- [ ] Code scanning alerts visible
- [ ] Secret scanning alerts visible

### Dashboard Metrics
- [ ] Open vulnerabilities by severity
- [ ] Time to resolution tracking
- [ ] Alert trends (week/month)
- [ ] Repository security scores

### Notification Channels
| Channel | Status | Response Time |
|---------|--------|---------------|
| Email | ✅ Working | < 5 min |
| Slack | ✅ Working | < 1 min |
| GitHub Notifications | ✅ Working | Immediate |

### Alert Escalation
- [ ] Critical alerts escalate to on-call
- [ ] High alerts notify security team
- [ ] Medium/Low alerts in daily summary
```

### Incident Response Validation

```markdown
## Incident Response Test

### Scenario: Critical Security Vulnerability Discovered

### Timeline Tracking

**T+0 min**: Vulnerability detected
- [ ] Alert triggered automatically
- [ ] Security team notified
- [ ] Incident ticket created
- Record actual time: ___

**T+5 min**: Initial Response
- [ ] On-call engineer acknowledged
- [ ] Severity assessed
- [ ] Stakeholders notified
- Record actual time: ___

**T+15 min**: Investigation
- [ ] Scope determined
- [ ] Impact assessed
- [ ] Mitigation plan created
- Record actual time: ___

**T+30 min**: Remediation
- [ ] Fix implemented
- [ ] Tests passed
- [ ] Deployed to staging
- Record actual time: ___

**T+60 min**: Verification
- [ ] Deployed to production
- [ ] Vulnerability resolved
- [ ] Systems monitored
- Record actual time: ___

**T+24 hours**: Post-Mortem
- [ ] Root cause analyzed
- [ ] Documentation updated
- [ ] Prevention measures implemented
- Record completion: ___

### Validation Results
- All steps completed within timeline: ✅ / ❌
- All notifications sent: ✅ / ❌
- Documentation complete: ✅ / ❌
- Team response adequate: ✅ / ❌
```

### Deliverables
- [ ] Alert testing plan executed
- [ ] Test execution results documented
- [ ] Notification channel validation
- [ ] Monitoring dashboard validation
- [ ] Incident response procedure validated

---

## Task 4: Automated Security Testing with GitHub Actions

### Objectives
- สร้าง Automated Security Test Workflow
- รวม SAST, DAST, และ Dependency Scanning
- ตั้งค่า Security Gates

### Complete Security Testing Workflow

```yaml
# .github/workflows/security-tests.yml
name: Security Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  # Static Application Security Testing
  sast:
    name: SAST Scan
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Run Semgrep
      uses: returntocorp/semgrep-action@v1
      with:
        config: >-
          p/security-audit
          p/secrets
          p/owasp-top-ten

    - name: Upload SAST results
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: semgrep.sarif
      if: always()

  # CodeQL Analysis
  codeql:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    steps:
    - uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: javascript, typescript

    - name: Autobuild
      uses: github/codeql-action/autobuild@v3

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3

  # Dependency Scanning
  dependency-scan:
    name: Dependency Scan
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Run npm audit
      run: npm audit --audit-level=moderate
      continue-on-error: true

    - name: Run Snyk scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      continue-on-error: true

    - name: Upload Snyk results
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: snyk.sarif
      if: always()

  # Secret Scanning
  secret-scan:
    name: Secret Scan
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Run TruffleHog
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD
        extra_args: --only-verified

    - name: Run Gitleaks
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Container Scanning
  container-scan:
    name: Container Scan
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
    - uses: actions/checkout@v4

    - name: Build Docker image
      run: docker build -t app:test .

    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'app:test'
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL,HIGH'

    - name: Upload Trivy results
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: 'trivy-results.sarif'

  # Security Tests
  security-tests:
    name: Security Tests
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Run security tests
      run: npm run test:security

    - name: Upload test results
      uses: actions/upload-artifact@v4
      with:
        name: security-test-results
        path: test-results/

  # Dynamic Application Security Testing
  dast:
    name: DAST Scan
    runs-on: ubuntu-latest
    needs: [sast, dependency-scan]
    if: github.event_name == 'push'
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install and start application
      run: |
        npm ci
        npm start &
        sleep 10

    - name: Run ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.12.0
      with:
        target: 'http://localhost:3000'
        rules_file_name: '.zap/rules.tsv'
        allow_issue_writing: false

    - name: Upload ZAP results
      uses: actions/upload-artifact@v4
      with:
        name: zap-results
        path: report_html.html

  # Security Gate
  security-gate:
    name: Security Gate
    runs-on: ubuntu-latest
    needs: [sast, codeql, dependency-scan, secret-scan, security-tests]
    steps:
    - name: Check security status
      run: |
        echo "All security checks passed!"
        echo "Ready for deployment"

    - name: Notify on failure
      if: failure()
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": ":warning: Security Gate Failed",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Security checks failed for*: ${{ github.repository }}\n*Branch*: ${{ github.ref }}\n*Commit*: ${{ github.sha }}"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}
```

### Deliverables
- [ ] Security test workflow created
- [ ] All scanners configured
- [ ] Security gate implemented
- [ ] Results dashboard available

---

## Workshop Activities for QA

### Activity 1: Security Test Case Design (2 hours)
- Write OWASP Top 10 test cases
- Create negative test scenarios
- Design boundary tests

### Activity 2: Branch Protection Validation (1.5 hours)
- Test each protection rule
- Document results
- Create validation report

### Activity 3: Alert Testing (1.5 hours)
- Test vulnerability alerts
- Verify notification channels
- Validate response times

### Activity 4: Automated Testing Setup (1 hour)
- Configure security workflow
- Run security scans
- Review results

---

## Success Criteria for QA

- [ ] Security test suite created (50+ test cases)
- [ ] OWASP Top 10 covered
- [ ] Branch protection validated
- [ ] Alert system tested
- [ ] Automated security workflow running
- [ ] Test reports documented
- [ ] Incident response validated

---

## Resources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [ZAP Documentation](https://www.zaproxy.org/docs/)
- [Semgrep Rules](https://semgrep.dev/explore)

---

**Related Documents**:
- [Phase 3 Main Document](../03-PHASE3-SECURITY.md)
- [PM Role](./03-PHASE3-PM.md)
- [Developer Role](./03-PHASE3-DEV.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
