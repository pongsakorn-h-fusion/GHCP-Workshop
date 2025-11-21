# Phase 3: Security, Branch Protection & Vulnerability Fixes

## General Information

**Duration**: November 24-28, 2025 (5 days)
**Hands-On Workshop**: November 24-28, 2025
**Prerequisites**: Completion of Phase 1 and Phase 2

## Objectives

Enhance codebase security, define security policies, configure branch protection rules, and fix discovered vulnerabilities

---

## Quick Links to Detailed Guides

### Role-Based Workshop Guides
- [Project Manager (PM) Guide](./Role/03-PHASE3-PM.md) - Security policies, branch protection, vulnerability management
- [Developer Guide](./Role/03-PHASE3-DEV.md) - Dependabot, secret scanning, Codespaces setup
- [QA Guide](./Role/03-PHASE3-QA.md) - Security testing, branch protection validation, alerting tests

### Detailed Task Guides
- [Task 1: Branch Protection Policies](./tasks/Task-01-PM-Branch-Protection.md) (PM)
- [Task 2: Dependabot & Secret Scanning](./tasks/Task-02-DEV-Dependabot-SecretScanning.md) (Developer)
- [Task 3: Security Testing](./tasks/Task-03-QA-Security-Tests.md) (QA)
- [Task 4: GitHub Enterprise Features](./tasks/Task-04-GitHub-Enterprise-Features.md) (All Roles)

### GitHub Enterprise Features Covered
- **GitHub Codespaces** - Secure cloud development environment
- **GitHub Advanced Security (GHAS)** - Code scanning, secret scanning, dependency review
- **Audit Log** - Compliance and security monitoring
- **Security Overview** - Organization-wide security dashboard

---

## Tasks to be Performed

### 🛡️ Define Security and Branch Protection Policies
**Responsible**: PM
**Feature**: General Copilot Usage

#### Details
- Design branch protection rules
- Define code review policy
- Plan security compliance

#### Preparation
- [ ] Study GitHub branch protection features
- [ ] Define code review requirements
- [ ] Plan compliance requirements
- [ ] Prepare security policy document

#### Branch Protection Rules

**Main Branch Protection**
```
Branch: main
✅ Require pull request before merging
  ✅ Require approvals (2)
  ✅ Dismiss stale reviews
  ✅ Require review from Code Owners
✅ Require status checks to pass
  ✅ Require branches to be up to date
  ✅ Status checks: CI, Security Scan, Tests
✅ Require conversation resolution
✅ Require signed commits
✅ Require linear history
✅ Include administrators
✅ Restrict who can push (Admins only)
✅ Allow force pushes: No
✅ Allow deletions: No
```

**Develop Branch Protection**
```
Branch: develop
✅ Require pull request before merging
  ✅ Require approvals (1)
  ✅ Dismiss stale reviews
✅ Require status checks to pass
  ✅ CI, Tests (no need to be up to date)
✅ Require conversation resolution
✅ Allow force pushes: No
✅ Allow deletions: No
```

**Feature Branches**
```
Pattern: feature/*
✅ Require pull request before merging
  ✅ Require approvals (1)
✅ Require status checks to pass
✅ Delete branch on merge
```

#### Code Review Policy

**Mandatory Reviews**
- All PRs require at least 1 approval
- PRs to main require 2 approvals
- At least one reviewer must be from CODEOWNERS
- Reviews must be from team members (not PR author)

**Review Guidelines**
- Check code quality and standards
- Verify tests coverage
- Review security implications
- Check for hardcoded secrets
- Validate documentation updates

**CODEOWNERS File Example**
```
# Default owners
*       @team-leads

# Frontend
/src/frontend/     @frontend-team
/src/components/   @frontend-team

# Backend
/src/backend/      @backend-team
/src/api/          @backend-team

# DevOps
/.github/          @devops-team
/terraform/        @devops-team

# Documentation
/docs/             @tech-writers

# Critical files
/package.json      @tech-leads @devops-team
/Dockerfile        @devops-team
```

#### Security Policy Elements

**1. Access Control**
- Least privilege principle
- Regular access reviews
- MFA required for all accounts
- Service account management

**2. Code Security**
- No secrets in code
- Security scanning enabled
- Dependency updates automated
- Regular security audits

**3. Compliance**
- License compliance checks
- Data privacy requirements
- Industry-specific regulations
- Audit trail maintenance

**4. Incident Response**
- Security incident procedures
- Escalation paths
- Communication protocols
- Post-mortem requirements

#### Deliverables
- Branch protection rules configured
- CODEOWNERS file created
- Security policy document
- Code review guidelines
- Compliance checklist

---

### 🔍 Review Impact and Vulnerability Remediation Plan
**Responsible**: PM
**Feature**: GitHub Projects / Organization Setup

#### Details
- Assess severity of discovered vulnerabilities
- Prioritize remediation efforts
- Plan remediation timeline

#### Preparation
- [ ] Compile vulnerability list
- [ ] Study impact assessment methods
- [ ] Define severity matrix
- [ ] Plan remediation strategy

#### Vulnerability Assessment Framework

**Severity Levels**

**Critical (CVSS 9.0-10.0)**
- Remote code execution
- Authentication bypass
- Data breach potential
- **Timeline**: Fix immediately (< 24 hours)

**High (CVSS 7.0-8.9)**
- Privilege escalation
- SQL injection
- XSS vulnerabilities
- **Timeline**: Fix within 7 days

**Medium (CVSS 4.0-6.9)**
- Information disclosure
- CSRF vulnerabilities
- Weak cryptography
- **Timeline**: Fix within 30 days

**Low (CVSS 0.1-3.9)**
- Minor information leaks
- Non-critical issues
- **Timeline**: Fix in next release

#### Vulnerability Review Process

```
[Scan] → [Triage] → [Assess] → [Prioritize] → [Plan] → [Fix] → [Verify]
```

**1. Triage**
- Review all detected vulnerabilities
- Filter false positives
- Categorize by type and severity

**2. Assess Impact**
- Evaluate affected components
- Check if exploitable in current setup
- Determine business impact
- Review affected users/data

**3. Prioritize**
```
Priority = (Severity × Exploitability × Business Impact)

High Priority:
  - Critical vulnerabilities in production
  - High severity with known exploits
  - Affecting customer data

Medium Priority:
  - High severity without known exploits
  - Medium severity in production
  - Requires specific conditions

Low Priority:
  - Low severity issues
  - Requires local access
  - Theoretical vulnerabilities
```

**4. Create Remediation Plan**
```markdown
## Vulnerability: CVE-XXXX-XXXXX

### Description
Brief description of the vulnerability

### Severity: Critical
CVSS Score: 9.8

### Affected Components
- package-name@1.2.3
- /src/auth/login.js

### Impact Assessment
- Allows authentication bypass
- Affects all users
- Production environment affected

### Remediation Plan
1. Update package-name to version 1.2.4
2. Review and update authentication logic
3. Add additional validation
4. Deploy emergency patch

### Timeline
- Fix development: 4 hours
- Testing: 2 hours
- Deploy to production: Immediate

### Assignee
@security-team, @backend-lead

### Verification
- [ ] Unit tests pass
- [ ] Security scan passes
- [ ] Manual penetration test
- [ ] Deployed to production
```

#### Vulnerability Tracking

**GitHub Project Board**
```
Columns:
- New (Unreviewed vulnerabilities)
- Triaged (Assessed and categorized)
- In Progress (Being fixed)
- Testing (Under verification)
- Resolved (Fixed and verified)
- False Positive (Not applicable)
```

**Metrics to Track**
- Time to triage (target: < 24 hours)
- Time to fix (by severity)
- Number of open vulnerabilities
- Remediation rate
- False positive rate

#### Deliverables
- Vulnerability assessment report
- Prioritized remediation backlog
- Remediation timeline
- Resource allocation plan
- Progress tracking dashboard

---

### 🔒 Enable Dependabot and Fix Vulnerabilities
**Responsible**: Developer
**Feature**: General Copilot Usage

#### Details
- Enable Dependabot alerts
- Review and merge security updates
- Test after updating dependencies

#### Preparation
- [ ] Study Dependabot features
- [ ] Define update strategy
- [ ] Prepare test suite
- [ ] Plan rollback procedure

#### Enabling Dependabot

**1. Dependabot Alerts**
```
Settings → Security & analysis
✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
```

**2. Dependabot Version Updates**

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  # NPM dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "backend-team"
    assignees:
      - "tech-lead"
    labels:
      - "dependencies"
      - "automated"
    commit-message:
      prefix: "chore"
      include: "scope"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "github-actions"

  # Docker
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "docker"
```

**3. Dependabot Configuration Options**

```yaml
# Ignore specific dependencies
ignore:
  - dependency-name: "express"
    versions: ["5.x"]  # Don't update to v5

# Group updates
groups:
  production-dependencies:
    patterns:
      - "*"
    exclude-patterns:
      - "dev-*"

# Allow specific updates only
allow:
  - dependency-type: "direct"  # Only direct dependencies
  - dependency-type: "production"  # Only production deps
```

#### Handling Dependabot PRs

**Review Checklist**
- [ ] Check CHANGELOG for breaking changes
- [ ] Review dependency's security advisory
- [ ] Check CI/CD pipeline status
- [ ] Run tests locally if needed
- [ ] Check for peer dependency conflicts
- [ ] Review impact on bundle size

**Automated Dependabot PR Workflow**
```yaml
name: Auto-merge Dependabot

on: pull_request

permissions:
  pull-requests: write
  contents: write

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
    - name: Dependabot metadata
      id: metadata
      uses: dependabot/fetch-metadata@v1

    - name: Auto-merge minor and patch updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-minor' || steps.metadata.outputs.update-type == 'version-update:semver-patch'
      run: gh pr merge --auto --squash "$PR_URL"
      env:
        PR_URL: ${{github.event.pull_request.html_url}}
        GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

    - name: Label major updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-major'
      run: gh pr edit "$PR_URL" --add-label "major-update"
      env:
        PR_URL: ${{github.event.pull_request.html_url}}
        GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

#### Fixing Vulnerabilities

**Process**
1. Review Dependabot alert
2. Understand the vulnerability
3. Check for updates
4. Update dependency
5. Run tests
6. Deploy and verify

**Manual Update Process**
```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update to latest major version
npm install package-name@latest

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may include breaking changes)
npm audit fix --force
```

**Testing After Updates**
```bash
# Run full test suite
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Check for regressions
npm run test:regression

# Build application
npm run build

# Run in development
npm run dev
```

#### Vulnerability Fix Documentation

```markdown
## Vulnerability Fix: CVE-XXXX-XXXXX

### Package
package-name@1.2.3 → 1.2.5

### Vulnerability Details
- **Severity**: High
- **Type**: Cross-Site Scripting (XSS)
- **Description**: Allows arbitrary code execution

### Changes Made
1. Updated package-name from 1.2.3 to 1.2.5
2. Updated related dependencies
3. Modified code to use new API (if applicable)

### Testing
- [x] Unit tests passed
- [x] Integration tests passed
- [x] Security scan passed
- [x] Manual testing completed

### Deployment
- Dev: ✅ Deployed 2025-11-24 10:00
- Staging: ✅ Deployed 2025-11-24 14:00
- Production: ✅ Deployed 2025-11-25 09:00

### Verification
- [x] No new vulnerabilities introduced
- [x] Application functioning normally
- [x] Performance not degraded
```

#### Deliverables
- Dependabot enabled and configured
- Security updates auto-merged (where safe)
- Vulnerability fixes documented
- Testing procedures established
- Monitoring alerts configured

---

### 🔐 Configure Secret Scanning and Alerting
**Responsible**: Developer
**Feature**: General Copilot Usage

#### Details
- Enable secret scanning
- Configure notification channels
- Test alert system

#### Preparation
- [ ] Study GitHub secret scanning features
- [ ] Define alert recipients
- [ ] Plan response procedures
- [ ] Prepare remediation workflow

#### Enabling Secret Scanning

**1. Enable in Repository Settings**
```
Settings → Code security and analysis
✅ Secret scanning
✅ Push protection (prevent commits with secrets)
```

**2. Supported Secret Types**
- AWS credentials
- Azure credentials
- Google Cloud credentials
- Database connection strings
- API keys (various providers)
- Private keys
- OAuth tokens
- Payment provider tokens
- And many more...

#### Push Protection

**How it works:**
```
Developer tries to push → GitHub scans → Secret detected → Push blocked

Notification:
❌ Push blocked: Secret detected in commit

   File: config/database.js
   Line: 12
   Type: AWS Access Key

   To push anyway:
   1. Remove the secret
   2. Use GitHub Secrets instead
```

**Bypass for False Positives**
```bash
# If it's a false positive, you can bypass (use carefully)
git push --push-option="allow-secret-scanning=true"
```

#### Secret Scanning Alerts

**Alert Notification Settings**
```
Settings → Code security and analysis → Secret scanning alerts

Notification options:
✅ Email notifications
✅ Web notifications
✅ Security advisories

Recipients:
✅ Repository admins
✅ Security team
✅ Commit author
```

**Webhook Integration**
```yaml
# .github/workflows/secret-alert.yml
name: Secret Scanning Alert

on:
  secret_scanning_alert:
    types: [created, reopened]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Notify Security Team
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "🚨 Secret Detected!",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Secret Type:* ${{ github.event.alert.secret_type }}\n*Location:* ${{ github.event.alert.html_url }}"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}

    - name: Create Incident Ticket
      run: |
        curl -X POST "${{ secrets.JIRA_API }}" \
          -H "Content-Type: application/json" \
          -d '{
            "fields": {
              "project": {"key": "SEC"},
              "summary": "Secret exposed in repository",
              "description": "Secret detected: ${{ github.event.alert.secret_type }}",
              "issuetype": {"name": "Security Incident"},
              "priority": {"name": "Critical"}
            }
          }'
```

#### Secret Remediation Process

**When a secret is detected:**

1. **Immediate Actions**
   ```bash
   # 1. Revoke the exposed secret immediately
   #    (AWS, Azure, API provider console)

   # 2. Generate new secret

   # 3. Update GitHub Secrets
   #    Settings → Secrets and variables → Actions
   ```

2. **Remove from Git History**
   ```bash
   # Option 1: BFG Repo-Cleaner (recommended)
   java -jar bfg.jar --delete-files secret-file.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive

   # Option 2: git filter-repo
   git filter-repo --path secret-file.txt --invert-paths

   # Option 3: filter-branch (legacy)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/secret" \
     --prune-empty --tag-name-filter cat -- --all

   # Force push
   git push origin --force --all
   ```

3. **Verify Removal**
   ```bash
   # Search entire history
   git log -S "secret-string" --all

   # Check if truly removed
   git grep "secret-string" $(git rev-list --all)
   ```

4. **Document Incident**
   ```markdown
   ## Security Incident Report

   **Date**: 2025-11-24
   **Type**: Secret Exposure
   **Severity**: High

   ### Details
   - Secret Type: AWS Access Key
   - Location: config/aws.js
   - Exposure Duration: 2 hours
   - Commits Affected: abc123f, def456g

   ### Actions Taken
   1. Secret revoked at 10:30 AM
   2. New secret generated at 10:35 AM
   3. Git history cleaned at 11:00 AM
   4. All team members notified

   ### Prevention Measures
   - Added pre-commit hook for secret scanning
   - Conducted team training on secret management
   - Updated documentation
   ```

#### Custom Secret Patterns

**For organization-specific secrets:**
```yaml
# .github/secret_scanning.yml
custom_patterns:
  - name: "Internal API Key"
    regex: "internal_key_[a-zA-Z0-9]{32}"

  - name: "Database Password"
    regex: "DB_PASS=[a-zA-Z0-9@$!%*?&]{16,}"

  - name: "Custom Token"
    regex: "COMPANY_TOKEN_[0-9]{10}_[a-z]{20}"
```

#### Prevention Measures

**1. Pre-commit Hook**
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Use git-secrets or similar tool
git secrets --scan

# Or use custom script
if git diff --cached | grep -E "(api_key|password|secret)"; then
    echo "❌ Potential secret detected in commit!"
    echo "Please review your changes."
    exit 1
fi
```

**2. Environment Variables Template**
```bash
# .env.example (commit this)
DATABASE_URL=your_database_url_here
API_KEY=your_api_key_here
AWS_ACCESS_KEY_ID=your_aws_key_here

# .env (DO NOT commit this)
# Add to .gitignore
```

**3. .gitignore**
```
# Environment files
.env
.env.local
.env.*.local

# Configuration files
config/secrets.js
config/credentials.json

# Keys
*.pem
*.key
*.p12

# Cloud provider
.aws/
.gcloud/
.azure/
```

#### Deliverables
- Secret scanning enabled
- Push protection activated
- Alert notifications configured
- Remediation procedures documented
- Prevention measures implemented
- Team training completed

---

### 🤝 Improve Pair Programming Flow with Copilot
**Responsible**: Developer
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Experiment with Copilot in pair programming
- Test integration with AI Agents
- Share best practices

#### Preparation
- [ ] Study Copilot advanced features
- [ ] Prepare coding scenarios
- [ ] Plan pair programming sessions
- [ ] Compile best practices

#### Pair Programming with Copilot

**Traditional Pair Programming**
```
Driver (writes code) ↔ Navigator (reviews and guides)
```

**AI-Enhanced Pair Programming**
```
Driver ↔ Copilot (suggests code) ↔ Navigator
```

#### Copilot Advanced Features

**1. Copilot Chat**
```
# In IDE chat:

User: "Create a function to validate email addresses"
Copilot: [Generates function with regex validation]

User: "Add unit tests for this function"
Copilot: [Generates comprehensive test cases]

User: "What are the security implications?"
Copilot: [Explains potential security issues]
```

**2. Inline Chat**
```javascript
// Select code block, then Ctrl+I

function login(username, password) {
  // TODO: implement login
}

// Type: "Implement secure login with JWT"
// Copilot generates implementation
```

**3. Copilot Commands**

```
/explain - Explain selected code
/fix - Fix bugs in code
/tests - Generate unit tests
/doc - Generate documentation
/optimize - Optimize performance
```

**Usage Example:**
```javascript
// Select complex function
// Type: /explain

// Copilot response:
/*
 * This function implements a binary search algorithm
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 * ...
 */
```

**4. Context-Aware Suggestions**

Copilot learns from:
- Open files in workspace
- Recently viewed files
- Git history
- Comments and docstrings
- Function signatures

```javascript
// Given context from user.model.js
class User {
  constructor(email, password) {}
}

// In user.service.js
// Copilot suggests:
function createUser(email, password) {
  // Validates based on User model
  const user = new User(email, password);
  // Appropriate error handling
  return user.save();
}
```

#### Pair Programming Workflows

**Workflow 1: Code Generation**
```
Navigator: "We need a function to process payment"
Driver: Types function signature
Copilot: Suggests implementation
Navigator: Reviews suggestion
Driver: Accepts or modifies
```

**Workflow 2: Test-Driven Development**
```
Navigator: "Let's write tests first"
Driver: Types test structure
Copilot: Suggests test cases
Navigator: Reviews coverage
Driver: Implements actual function
Copilot: Suggests implementation matching tests
```

**Workflow 3: Code Review**
```
Navigator: Highlights code section
Driver: Uses /explain command
Copilot: Explains the code
Navigator: Asks for improvements
Driver: Uses /optimize command
Copilot: Suggests optimizations
```

**Workflow 4: Debugging**
```
Driver: Encounters bug
Navigator: Suggests using /fix
Driver: Selects buggy code
Copilot: Analyzes and suggests fix
Navigator: Reviews solution
```

#### Best Practices

**✅ Do's**
- Review Copilot suggestions carefully
- Use Copilot to generate boilerplate
- Ask Copilot to explain unfamiliar code
- Use Copilot for test generation
- Leverage Copilot for documentation
- Provide clear context through comments

**❌ Don'ts**
- Blindly accept all suggestions
- Rely on Copilot for security-critical code without review
- Ignore edge cases
- Skip testing generated code
- Forget about code quality
- Share sensitive data in prompts

#### Example Session

```javascript
// 1. Start with clear intent
// Function to calculate shipping cost based on weight and distance

// 2. Copilot generates
function calculateShippingCost(weightKg, distanceKm) {
  const baseRate = 5;
  const weightRate = 0.5;
  const distanceRate = 0.1;

  return baseRate + (weightKg * weightRate) + (distanceKm * distanceRate);
}

// 3. Navigator asks: "What about validation?"
// Driver types comment:
// Add input validation for weight and distance

// 4. Copilot suggests
function calculateShippingCost(weightKg, distanceKm) {
  if (weightKg <= 0 || distanceKm <= 0) {
    throw new Error('Weight and distance must be positive');
  }

  if (typeof weightKg !== 'number' || typeof distanceKm !== 'number') {
    throw new Error('Weight and distance must be numbers');
  }

  // ... rest of function
}

// 5. Navigator asks: "Add tests"
// Driver types: /tests

// 6. Copilot generates
describe('calculateShippingCost', () => {
  it('should calculate cost correctly', () => {
    expect(calculateShippingCost(10, 100)).toBe(20);
  });

  it('should throw error for negative weight', () => {
    expect(() => calculateShippingCost(-5, 100)).toThrow();
  });

  it('should throw error for non-number inputs', () => {
    expect(() => calculateShippingCost('10', 100)).toThrow();
  });
});
```

#### Measuring Effectiveness

**Metrics to Track**
- Time to complete features
- Code quality scores
- Bug rate
- Test coverage
- Developer satisfaction

**Feedback Collection**
```markdown
## Copilot Pair Programming Feedback

**Session Date**: 2025-11-24
**Duration**: 2 hours
**Feature**: Payment processing module

### What Worked Well
- Fast boilerplate generation
- Good test case suggestions
- Helpful code explanations

### Challenges
- Some suggestions not following our coding standards
- Needed manual adjustment for edge cases

### Improvements
- Add more context in comments
- Create custom code snippets for team standards

### Would you use Copilot again?
Yes ✅ / No ❌

### Rating: 4/5
```

#### Team Guidelines

```markdown
# Copilot Usage Guidelines

## When to Use Copilot
✅ Generating boilerplate code
✅ Writing unit tests
✅ Creating documentation
✅ Learning new APIs
✅ Refactoring code

## When to be Cautious
⚠️ Security-sensitive code
⚠️ Complex business logic
⚠️ Performance-critical sections
⚠️ Regulatory compliance code

## Review Checklist
- [ ] Code follows team standards
- [ ] All edge cases handled
- [ ] Security reviewed
- [ ] Tests added
- [ ] Documentation updated
```

#### Deliverables
- Pair programming guidelines
- Copilot best practices document
- Team training sessions completed
- Feedback mechanism established
- Usage metrics dashboard

---

### 🧪 Design Security Test Cases and Negative Tests
**Responsible**: QA
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Create security test scenarios
- Design negative test cases
- Prepare penetration test plan

#### Preparation
- [ ] Study common security vulnerabilities (OWASP Top 10)
- [ ] Compile attack vectors
- [ ] Prepare test data for security testing
- [ ] Plan automated security tests

#### OWASP Top 10 Test Cases

**1. Injection Attacks**
```javascript
describe('SQL Injection Tests', () => {
  it('should reject SQL injection in login', async () => {
    const maliciousInput = "admin' OR '1'='1";
    const response = await login(maliciousInput, 'password');
    expect(response.success).toBe(false);
    expect(response.error).toContain('Invalid input');
  });

  it('should sanitize user input in search', async () => {
    const xssPayload = "<script>alert('XSS')</script>";
    const results = await search(xssPayload);
    expect(results.query).not.toContain('<script>');
  });
});
```

**2. Broken Authentication**
```javascript
describe('Authentication Security', () => {
  it('should lockout after failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await login('user@example.com', 'wrongpassword');
    }
    const response = await login('user@example.com', 'correctpassword');
    expect(response.error).toContain('Account locked');
  });

  it('should invalidate old sessions', async () => {
    const session1 = await login('user@example.com', 'password');
    await changePassword('user@example.com', 'newpassword');
    const response = await authenticatedRequest(session1.token);
    expect(response.status).toBe(401);
  });

  it('should enforce password complexity', async () => {
    const weakPasswords = ['123456', 'password', 'abc'];
    for (const pwd of weakPasswords) {
      const response = await register('user@example.com', pwd);
      expect(response.success).toBe(false);
    }
  });
});
```

**3. Sensitive Data Exposure**
```javascript
describe('Data Protection', () => {
  it('should not expose passwords in API responses', async () => {
    const user = await getUser('user@example.com');
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('should encrypt sensitive data in transit', async () => {
    const request = await fetch('/api/payment');
    expect(request.protocol).toBe('https:');
  });

  it('should mask credit card numbers', () => {
    const ccNumber = '1234567890123456';
    const masked = maskCreditCard(ccNumber);
    expect(masked).toBe('************3456');
  });
});
```

**4. XML External Entities (XXE)**
```javascript
describe('XXE Protection', () => {
  it('should reject malicious XML', async () => {
    const xxePayload = `
      <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
      <root>&xxe;</root>
    `;
    const response = await uploadXML(xxePayload);
    expect(response.success).toBe(false);
  });
});
```

**5. Broken Access Control**
```javascript
describe('Authorization Tests', () => {
  it('should prevent unauthorized access', async () => {
    const userToken = await login('user@example.com', 'password');
    const response = await fetch('/admin/dashboard', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    expect(response.status).toBe(403);
  });

  it('should prevent IDOR attacks', async () => {
    const user1Token = await login('user1@example.com', 'password');
    // Try to access user2's data
    const response = await fetch('/api/users/user2/profile', {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    expect(response.status).toBe(403);
  });
});
```

**6. Security Misconfiguration**
```javascript
describe('Security Configuration', () => {
  it('should have security headers', async () => {
    const response = await fetch('/');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Strict-Transport-Security')).toBeTruthy();
  });

  it('should not expose server information', async () => {
    const response = await fetch('/');
    expect(response.headers.get('Server')).toBeFalsy();
    expect(response.headers.get('X-Powered-By')).toBeFalsy();
  });
});
```

**7. Cross-Site Scripting (XSS)**
```javascript
describe('XSS Protection', () => {
  it('should sanitize HTML input', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const sanitized = sanitizeHTML(malicious);
    expect(sanitized).not.toContain('onerror');
  });

  it('should escape output', async () => {
    const comment = await createComment('<script>alert("XSS")</script>');
    const page = await renderPage();
    expect(page).toContain('&lt;script&gt;');
  });
});
```

**8. Insecure Deserialization**
```javascript
describe('Deserialization Security', () => {
  it('should reject malicious serialized data', () => {
    const maliciousData = '{"__proto__":{"isAdmin":true}}';
    expect(() => deserialize(maliciousData)).toThrow();
  });
});
```

**9. Using Components with Known Vulnerabilities**
```javascript
describe('Dependency Security', () => {
  it('should not have high severity vulnerabilities', async () => {
    const auditResult = await runNPMAudit();
    expect(auditResult.high).toBe(0);
    expect(auditResult.critical).toBe(0);
  });
});
```

**10. Insufficient Logging & Monitoring**
```javascript
describe('Security Logging', () => {
  it('should log failed login attempts', async () => {
    await login('user@example.com', 'wrongpassword');
    const logs = await getSecurityLogs();
    expect(logs).toContainEqual(
      expect.objectContaining({
        event: 'LOGIN_FAILED',
        user: 'user@example.com'
      })
    );
  });

  it('should not log sensitive data', async () => {
    await login('user@example.com', 'password123');
    const logs = await getSecurityLogs();
    logs.forEach(log => {
      expect(JSON.stringify(log)).not.toContain('password123');
    });
  });
});
```

#### Negative Test Cases

**Input Validation**
```javascript
describe('Negative Input Tests', () => {
  const invalidInputs = [
    null,
    undefined,
    '',
    ' ',
    'a'.repeat(10000), // Very long string
    '<script>alert(1)</script>',
    '../../../etc/passwd',
    '${7*7}', // Template injection
    '\0', // Null byte
    '💩', // Unicode
  ];

  invalidInputs.forEach(input => {
    it(`should handle invalid input: ${input}`, async () => {
      const response = await processInput(input);
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });
  });
});
```

**Boundary Tests**
```javascript
describe('Boundary Tests', () => {
  it('should reject negative amounts', async () => {
    const response = await transfer(-100);
    expect(response.success).toBe(false);
  });

  it('should reject zero amounts', async () => {
    const response = await transfer(0);
    expect(response.success).toBe(false);
  });

  it('should reject amounts exceeding maximum', async () => {
    const response = await transfer(Number.MAX_SAFE_INTEGER + 1);
    expect(response.success).toBe(false);
  });
});
```

**Rate Limiting Tests**
```javascript
describe('Rate Limiting', () => {
  it('should block after too many requests', async () => {
    const requests = Array(1000).fill().map(() =>
      fetch('/api/endpoint')
    );
    const responses = await Promise.all(requests);
    const blockedRequests = responses.filter(r => r.status === 429);
    expect(blockedRequests.length).toBeGreaterThan(0);
  });
});
```

#### Automated Security Testing

```yaml
# .github/workflows/security-tests.yml
name: Security Tests

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    # SAST (Static Application Security Testing)
    - name: Run Semgrep
      uses: returntocorp/semgrep-action@v1

    # Dependency scanning
    - name: Run npm audit
      run: npm audit --audit-level=moderate

    # Secret scanning
    - name: Run TruffleHog
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD

    # Container scanning (if using Docker)
    - name: Run Trivy
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'

    # Run security tests
    - name: Run security test suite
      run: npm run test:security

    # DAST (Dynamic Application Security Testing)
    - name: Start application
      run: npm start &

    - name: Wait for app
      run: sleep 10

    - name: Run ZAP scan
      uses: zaproxy/action-baseline@v0.7.0
      with:
        target: 'http://localhost:3000'
```

#### Penetration Testing Plan

```markdown
## Penetration Test Plan

### Scope
- Application: [Name]
- Version: [Version]
- Environment: Staging
- Timeline: 1 week

### Test Areas
1. Authentication & Authorization
2. Input Validation
3. Session Management
4. API Security
5. Database Security

### Methodology
- Reconnaissance
- Vulnerability Scanning
- Exploitation
- Post-Exploitation
- Reporting

### Tools
- Burp Suite
- OWASP ZAP
- SQLMap
- Metasploit
- Nmap

### Success Criteria
- No critical vulnerabilities
- All high vulnerabilities addressed
- Medium vulnerabilities documented
- Penetration test report completed
```

#### Deliverables
- Security test suite
- Negative test cases
- Automated security testing workflow
- Penetration testing plan
- Security testing documentation
- Vulnerability reports

---

### ✔️ Verify Branch Rules
**Responsible**: QA
**Feature**: General Copilot Usage

#### Details
- Test required reviews
- Verify status checks
- Validate protection rules

#### Preparation
- [ ] Create test scenarios for each rule
- [ ] Prepare test branches
- [ ] Plan validation tests
- [ ] Compile test results

#### Branch Protection Validation Tests

**Test Scenario 1: Required Reviews**
```markdown
## Test: Required Approvals

### Steps
1. Create feature branch from develop
2. Make changes and commit
3. Create PR to main
4. Try to merge without approval
5. Get required number of approvals
6. Try to merge

### Expected Results
- Step 4: Merge blocked ❌
- Step 6: Merge allowed ✅

### Actual Results
- [Record results here]

### Status: Pass ✅ / Fail ❌
```

**Test Scenario 2: Status Checks**
```markdown
## Test: Required Status Checks

### Steps
1. Create PR to main
2. Wait for CI/CD pipeline
3. One test fails
4. Try to merge
5. Fix tests
6. All tests pass
7. Try to merge

### Expected Results
- Step 4: Merge blocked (failing tests) ❌
- Step 7: Merge allowed ✅

### Actual Results
- [Record results here]

### Status: Pass ✅ / Fail ❌
```

**Test Scenario 3: Conversation Resolution**
```markdown
## Test: Require Conversation Resolution

### Steps
1. Create PR
2. Reviewer adds comment with suggestion
3. Try to merge
4. Resolve conversation
5. Try to merge

### Expected Results
- Step 3: Merge blocked (unresolved conversation) ❌
- Step 5: Merge allowed ✅

### Actual Results
- [Record results here]

### Status: Pass ✅ / Fail ❌
```

**Test Scenario 4: Up-to-date Branch**
```markdown
## Test: Require Branch to be Up to Date

### Steps
1. Create feature branch from main
2. Another PR merged to main
3. Create PR from feature branch
4. All checks pass
5. Try to merge
6. Update branch with main
7. Try to merge

### Expected Results
- Step 5: Merge blocked (branch not up to date) ❌
- Step 7: Merge allowed ✅

### Actual Results
- [Record results here]

### Status: Pass ✅ / Fail ❌
```

**Test Scenario 5: Force Push Protection**
```markdown
## Test: Block Force Push

### Steps
1. Clone protected branch (main)
2. Make some commits
3. Amend commit history
4. Try to force push
5. Try normal push

### Expected Results
- Step 4: Force push rejected ❌
- Step 5: Normal push (if authorized) ✅

### Command
```bash
git push --force origin main
```

### Actual Results
- [Record results here]

### Status: Pass ✅ / Fail ❌
```

**Test Scenario 6: Delete Branch Protection**
```markdown
## Test: Prevent Branch Deletion

### Steps
1. Try to delete main branch via GitHub UI
2. Try to delete main branch via git command

### Expected Results
- Step 1: Deletion prevented ❌
- Step 2: Deletion prevented ❌

### Command
```bash
git push origin --delete main
```

### Actual Results
- [Record results here]

### Status: Pass ✅ / Fail ❌
```

#### Automated Branch Rule Validation

```javascript
// test/branch-protection.test.js
const { Octokit } = require('@octokit/rest');

describe('Branch Protection Rules', () => {
  let octokit;
  const owner = 'your-org';
  const repo = 'your-repo';

  beforeAll(() => {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  });

  it('should require pull request reviews on main', async () => {
    const { data } = await octokit.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main'
    });

    expect(data.required_pull_request_reviews).toBeDefined();
    expect(data.required_pull_request_reviews.required_approving_review_count).toBeGreaterThanOrEqual(2);
  });

  it('should require status checks', async () => {
    const { data } = await octokit.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main'
    });

    expect(data.required_status_checks).toBeDefined();
    expect(data.required_status_checks.contexts).toContain('CI');
    expect(data.required_status_checks.contexts).toContain('Tests');
  });

  it('should enforce for administrators', async () => {
    const { data } = await octokit.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main'
    });

    expect(data.enforce_admins.enabled).toBe(true);
  });

  it('should block force pushes', async () => {
    const { data } = await octokit.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main'
    });

    expect(data.allow_force_pushes.enabled).toBe(false);
  });

  it('should block deletions', async () => {
    const { data } = await octokit.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main'
    });

    expect(data.allow_deletions.enabled).toBe(false);
  });
});
```

#### Test Report Template

```markdown
# Branch Protection Validation Report

**Date**: 2025-11-24
**Tester**: QA Team
**Repository**: your-repo

## Summary
- Total Tests: 15
- Passed: 14 ✅
- Failed: 1 ❌
- Skipped: 0

## Test Results

### Main Branch Protection
| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Required reviews (2) | ✅ Block merge | ✅ Blocked | ✅ Pass |
| Status checks required | ✅ Block merge | ✅ Blocked | ✅ Pass |
| Conversation resolution | ✅ Block merge | ✅ Blocked | ✅ Pass |
| Up-to-date branch | ✅ Block merge | ❌ Not blocked | ❌ Fail |
| Force push | ✅ Prevent | ✅ Prevented | ✅ Pass |
| Branch deletion | ✅ Prevent | ✅ Prevented | ✅ Pass |

### Develop Branch Protection
| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Required reviews (1) | ✅ Block merge | ✅ Blocked | ✅ Pass |
| Status checks required | ✅ Block merge | ✅ Blocked | ✅ Pass |

## Issues Found

### Issue 1: Up-to-date Branch Not Enforced
**Severity**: Medium
**Description**: PRs can be merged without updating to latest main
**Impact**: Potential merge conflicts
**Recommendation**: Enable "Require branches to be up to date"

## Recommendations
1. Enable all recommended protection rules
2. Regular validation tests (monthly)
3. Document any exceptions
```

#### Deliverables
- Branch protection validation test suite
- Test execution report
- Issues and recommendations document
- Automated validation script
- Compliance checklist

---

### 🔔 Test Alerting System and Security Monitoring
**Responsible**: QA
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Test alerts when vulnerabilities are detected
- Verify monitoring systems
- Validate incident response process

#### Preparation
- [ ] Compile list of alert types
- [ ] Define test scenarios
- [ ] Prepare test environment
- [ ] Plan validation criteria

#### Alert Testing Scenarios

**1. Vulnerability Alert**
```markdown
## Test: Dependabot Vulnerability Alert

### Setup
1. Temporarily add vulnerable dependency
   ```bash
   npm install lodash@4.17.0  # Known vulnerability
   ```

### Expected Alert
- Dependabot creates alert
- Email notification sent
- Slack notification sent
- Security dashboard updated

### Validation Steps
1. [ ] Check GitHub security tab
2. [ ] Verify email received
3. [ ] Verify Slack message
4. [ ] Check response time

### Acceptance Criteria
- Alert visible within 5 minutes
- Notifications sent to correct channels
- Alert includes remediation steps

### Results
- Alert created: ✅ Yes / ❌ No
- Email sent: ✅ Yes / ❌ No
- Slack notified: ✅ Yes / ❌ No
- Response time: [X] minutes
```

**2. Secret Scanning Alert**
```markdown
## Test: Secret Detected in Commit

### Setup
1. Create test file with fake secret
   ```javascript
   const apiKey = "sk_test_51abcdefghijklmnop";
   ```
2. Commit and push

### Expected Alert
- Push blocked (if push protection enabled)
- Or alert created after push
- Security team notified
- Incident ticket created

### Validation
- [ ] Push blocked or alert created
- [ ] Security team email
- [ ] Incident ticket created
- [ ] Correct severity assigned

### Results
- [Document results]
```

**3. Failed Login Attempts Alert**
```markdown
## Test: Multiple Failed Login Attempts

### Setup
1. Attempt login with wrong password 5 times
   ```bash
   for i in {1..5}; do
     curl -X POST /api/login \
       -d '{"email":"test@example.com","password":"wrong"}'
   done
   ```

### Expected Alert
- Rate limiting triggered
- Alert sent after threshold
- Account temporarily locked
- Security log entry created

### Validation
- [ ] Rate limit response (429)
- [ ] Alert notification sent
- [ ] Account locked
- [ ] Log entry exists

### Results
- [Document results]
```

**4. Deployment Failure Alert**
```markdown
## Test: Production Deployment Failure

### Setup
1. Trigger deployment with failing test
2. Let deployment fail

### Expected Alert
- Deployment failure notification
- Rollback initiated
- Team notified via Slack/Email
- Incident created

### Validation
- [ ] Failure detected immediately
- [ ] Rollback executed
- [ ] Team notified
- [ ] Service availability maintained

### Results
- [Document results]
```

**5. Unusual Activity Alert**
```markdown
## Test: Suspicious API Activity

### Setup
1. Generate unusual number of API requests
   ```bash
   for i in {1..1000}; do
     curl -X GET /api/endpoint
   done
   ```

### Expected Alert
- Rate limiting applied
- Security alert triggered
- Admin notification
- Request logs captured

### Validation
- [ ] Requests blocked
- [ ] Alert generated
- [ ] Admin notified
- [ ] Logs available for analysis

### Results
- [Document results]
```

#### Alert Configuration Validation

```yaml
# test-alerts.yml
name: Test Alert System

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
          - deployment
          - security

jobs:
  test-vulnerability-alert:
    if: github.event.inputs.test_type == 'vulnerability'
    runs-on: ubuntu-latest
    steps:
    - name: Install vulnerable package
      run: npm install lodash@4.17.0

    - name: Run security audit
      run: npm audit
      continue-on-error: true

    - name: Verify alert created
      run: |
        # Check if Dependabot created alert
        gh api repos/${{ github.repository }}/dependabot/alerts \
          | jq '.[] | select(.dependency.package.name == "lodash")'

  test-secret-alert:
    if: github.event.inputs.test_type == 'secret'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Create file with test secret
      run: |
        echo 'const key = "sk_test_51abcdefghijklmnop";' > test-secret.js
        git add test-secret.js
        git commit -m "Test secret detection"
        git push

    - name: Wait for secret scanning
      run: sleep 60

    - name: Verify alert created
      run: |
        gh api repos/${{ github.repository }}/secret-scanning/alerts \
          | jq '.[] | select(.state == "open")'

  test-notification-channels:
    runs-on: ubuntu-latest
    steps:
    - name: Test Slack notification
      run: |
        curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
          -H 'Content-Type: application/json' \
          -d '{"text":"Test alert from GitHub Actions"}'

    - name: Test Email notification
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 465
        username: ${{ secrets.EMAIL_USERNAME }}
        password: ${{ secrets.EMAIL_PASSWORD }}
        subject: Test Alert
        body: This is a test alert from automated testing
        to: security-team@example.com

    - name: Verify notifications received
      run: |
        # Manual verification required
        echo "Please verify notifications were received"
```

#### Monitoring Dashboard Validation

```markdown
## Monitoring Dashboard Checklist

### Metrics Visibility
- [ ] Real-time status indicators
- [ ] Response time graphs
- [ ] Error rate charts
- [ ] Active alerts list
- [ ] Historical data (30 days)

### Alert History
- [ ] All alerts logged
- [ ] Timestamp accurate
- [ ] Severity displayed
- [ ] Resolution status tracked
- [ ] Search/filter functional

### Performance Metrics
- [ ] API response times
- [ ] Database query times
- [ ] Memory usage
- [ ] CPU usage
- [ ] Network traffic

### Security Metrics
- [ ] Failed login attempts
- [ ] Active vulnerabilities
- [ ] Secret scanning results
- [ ] Dependency audit status
- [ ] Security score

### Incident Tracking
- [ ] Open incidents visible
- [ ] Assignment tracking
- [ ] Resolution time tracking
- [ ] Incident timeline
- [ ] Post-mortem links
```

#### Incident Response Validation

```markdown
## Incident Response Test

### Scenario: Critical Security Vulnerability Discovered

### Timeline
**T+0 min**: Vulnerability detected
- [ ] Alert triggered
- [ ] Security team notified
- [ ] Incident ticket created

**T+5 min**: Initial Response
- [ ] On-call engineer acknowledged
- [ ] Severity assessed
- [ ] Stakeholders notified

**T+15 min**: Investigation
- [ ] Scope determined
- [ ] Impact assessed
- [ ] Mitigation plan created

**T+30 min**: Remediation
- [ ] Fix implemented
- [ ] Tests passed
- [ ] Deployed to production

**T+60 min**: Verification
- [ ] Vulnerability resolved
- [ ] Systems monitored
- [ ] Incident closed

**T+24 hours**: Post-Mortem
- [ ] Root cause analyzed
- [ ] Documentation updated
- [ ] Prevention measures implemented

### Validation
- All steps completed within timeline: ✅ / ❌
- All notifications sent: ✅ / ❌
- Documentation complete: ✅ / ❌
```

#### Deliverables
- Alert testing plan
- Test execution results
- Notification channel validation
- Monitoring dashboard validation
- Incident response procedure validation
- Improvement recommendations

---

## Hands-On Workshop (November 24-28, 2025)

### Objectives
Enable the team to practice configuring security features, branch protection, and fixing vulnerabilities

### Schedule (Example)

#### Day 1: Security Policies & Branch Protection
- Morning: Security policies overview
- Afternoon: Configure branch protection rules

#### Day 2: Vulnerability Management
- Morning: Enable and configure Dependabot
- Afternoon: Review and fix vulnerabilities

#### Day 3: Secret Scanning & Detection
- Morning: Enable secret scanning
- Afternoon: Practice secret remediation

#### Day 4: Security Testing
- Morning: Write security test cases
- Afternoon: Run automated security scans

#### Day 5: Monitoring & Response
- Morning: Setup alerting
- Afternoon: Practice incident response

### Workshop Activities

#### Activity 1: Branch Protection Setup
- Configure protection rules for main
- Test PR requirements
- Validate CODEOWNERS

#### Activity 2: Dependabot Configuration
- Enable Dependabot
- Review security PRs
- Practice merging updates

#### Activity 3: Secret Scanning
- Enable secret scanning
- Simulate secret exposure
- Practice remediation

#### Activity 4: Security Testing
- Write OWASP test cases
- Run automated scans
- Review results

#### Activity 5: Incident Response
- Simulate security incident
- Follow response procedures
- Document lessons learned

---

## Preparation Before Workshop

### For Everyone
- [ ] Understanding of security concepts
- [ ] OWASP Top 10 knowledge
- [ ] GitHub security features awareness

### For PM
- [ ] Security policies drafted
- [ ] Compliance requirements documented
- [ ] Incident response plan ready

### For Developer
- [ ] Test application with vulnerabilities
- [ ] Secret scanning tools installed
- [ ] Remediation procedures documented

### For QA
- [ ] Security test cases prepared
- [ ] Testing tools installed (Burp Suite, ZAP)
- [ ] Test data ready

---

## Success Criteria

- [ ] Branch protection rules active and tested
- [ ] Security policies documented and communicated
- [ ] Dependabot enabled and functioning
- [ ] Secret scanning active
- [ ] Known vulnerabilities addressed
- [ ] Security tests automated
- [ ] Alert system functional and tested
- [ ] Team trained on security practices
- [ ] Incident response procedures validated

---

## Common Issues & Troubleshooting

### Issue: Branch protection too strict
**Solution**: Review and adjust rules based on team workflow

### Issue: Too many Dependabot PRs
**Solution**: Configure grouping and scheduling

### Issue: False positive secrets
**Solution**: Add to allow list, but verify first

### Issue: Security tests failing
**Solution**: Review test scenarios, may need env-specific configs

---

## Resources

- [GitHub Security Documentation](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## Next Phase

**[← Phase 2: CI/CD & Environments](./02-PHASE2-CICD.md)** | **[Phase 4: Automation & AI →](./04-PHASE4-AUTOMATION.md)**

---

**Phase Owner**: Pongsakorn H.
**Last Updated**: November 2025
**Version**: 1.0
