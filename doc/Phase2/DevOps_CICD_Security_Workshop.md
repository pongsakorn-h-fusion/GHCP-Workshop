# DevOps CI/CD & Security Workshop

## Workshop Overview
**Duration**: 4-6 hours (Full Day Workshop)
**Level**: Intermediate to Advanced
**Prerequisites**:
- Basic Git and GitHub knowledge
- Understanding of software development lifecycle
- Familiarity with at least one programming language (Node.js, Python, Java, or Go)
- GitHub account with repository access

**Learning Objectives**:
- Set up complete CI/CD pipelines with security scanning
- Implement environment and secrets management
- Apply branch protection and security best practices
- Write comprehensive security tests
- Configure monitoring and alerting systems

---

## Workshop Structure

### Module 1: CI/CD Pipeline Foundations (60 minutes)

#### 1.1 Introduction & Setup (15 minutes)
**Theory**:
- CI/CD concepts and benefits
- GitHub Actions architecture
- Pipeline stages overview

**Hands-On Activity**:
```markdown
Task: Create your first GitHub Actions workflow
1. Fork the workshop repository
2. Create `.github/workflows/hello-world.yml`
3. Add a simple workflow that prints "Hello CI/CD"
4. Commit and push to trigger the workflow
5. View the workflow run in GitHub Actions tab
```

**Expected Outcome**: Understanding of workflow triggers and basic syntax

---

#### 1.2 Build & Test Pipeline - Node.js (45 minutes)
**Theory**:
- Workflow triggers (push, pull_request)
- Job definitions and steps
- Using actions from marketplace
- Caching strategies

**Hands-On Activity**:
```markdown
Task: Implement a complete Node.js CI pipeline

Step 1: Create a simple Node.js application
- Initialize npm project: `npm init -y`
- Install dependencies: `npm install express jest eslint`
- Create `src/app.js` with a simple Express server
- Create `src/app.test.js` with basic tests
- Add npm scripts to package.json:
  - "test": "jest"
  - "lint": "eslint ."

Step 2: Create CI workflow `.github/workflows/node-ci.yml`
```

```yaml
name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run security audit
        run: npm audit --audit-level=moderate
```

```markdown
Step 3: Test the pipeline
- Create a feature branch
- Make changes to trigger lint errors
- Fix errors and see pipeline pass
- Observe caching behavior in subsequent runs

Discussion Questions:
- Why use `npm ci` instead of `npm install`?
- What is the benefit of caching?
- When should security audit fail the pipeline?
```

**Expected Outcome**: Working CI pipeline with build, test, lint, and audit

---

### Module 2: Multi-Language CI/CD (45 minutes)

#### 2.1 Python, Java, and Go Pipelines (45 minutes)

**Hands-On Activity (Choose Your Language)**:

**Option A: Python**
```markdown
Task: Build Python CI pipeline

Step 1: Create Python application
- Create `requirements.txt` with Flask and pytest
- Create `app.py` with Flask API
- Create `test_app.py` with pytest tests
- Create `.github/workflows/python-ci.yml`
```

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.9', '3.10', '3.11']
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov flake8 bandit

      - name: Lint with flake8
        run: flake8 . --count --select=E9,F63,F7,F82 --show-source

      - name: Security check with Bandit
        run: bandit -r . -f json -o bandit-report.json

      - name: Run tests with coverage
        run: pytest --cov=./ --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

**Option B: Java/Maven**
```yaml
name: Java CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: 'maven'

      - name: Build with Maven
        run: mvn clean install -DskipTests

      - name: Run tests
        run: mvn test

      - name: Run OWASP Dependency Check
        run: mvn org.owasp:dependency-check-maven:check
```

**Option C: Go**
```yaml
name: Go CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
          cache: true

      - name: Install dependencies
        run: go mod download

      - name: Run go vet
        run: go vet ./...

      - name: Run tests
        run: go test -v -race -coverprofile=coverage.txt ./...

      - name: Run gosec security scanner
        run: |
          go install github.com/securego/gosec/v2/cmd/gosec@latest
          gosec -fmt json -out gosec-report.json ./...
```

```markdown
Discussion:
- Compare matrix testing strategies across languages
- Security scanning tools for different languages
- Coverage reporting best practices
```

**Expected Outcome**: Understanding of language-specific CI/CD patterns

---

### Module 3: Security Scanning & Analysis (60 minutes)

#### 3.1 Implementing Security Scans (30 minutes)

**Theory**:
- CodeQL for SAST (Static Application Security Testing)
- Dependency vulnerability scanning
- Container security scanning with Trivy
- OWASP Dependency Check

**Hands-On Activity**:
```markdown
Task: Add comprehensive security scanning to your pipeline

Step 1: Add CodeQL Analysis
Create `.github/workflows/codeql-analysis.yml`
```

```yaml
name: CodeQL Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read

    strategy:
      matrix:
        language: [ 'javascript' ]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

```markdown
Step 2: Add Docker Security Scanning
Create Dockerfile for your application
Create `.github/workflows/docker-security.yml`
```

```yaml
name: Docker Security Scan

on: [push, pull_request]

jobs:
  docker-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: workshop-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: workshop-app:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

```markdown
Step 3: Test Security Scanning
- Introduce a known vulnerable dependency
- Run the pipeline and observe security alerts
- View results in GitHub Security tab
- Fix the vulnerability and verify

Exercise:
1. Add an old version of a package with known CVEs
2. Trigger the security scan
3. Navigate to Security > Dependabot alerts
4. Review the vulnerability details
5. Update the dependency and close the alert
```

**Expected Outcome**: Working security scanning with alerts in GitHub Security tab

---

#### 3.2 Writing Security Tests (30 minutes)

**Theory**:
- OWASP Top 10 vulnerabilities
- Testing for SQL Injection, XSS, CSRF
- Authentication and Authorization testing
- Security headers validation

**Hands-On Activity**:
```markdown
Task: Write comprehensive security tests

Step 1: Install testing dependencies
npm install --save-dev supertest jest express-validator helmet

Step 2: Create security test suite
Create `tests/security.test.js`
```

```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Security Tests', () => {

  describe('SQL Injection Protection', () => {
    test('SQL injection in login should fail', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: "' OR '1'='1",
          password: "' OR '1'='1"
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Union-based SQL injection should fail', async () => {
      const response = await request(app)
        .get('/api/users?id=1 UNION SELECT * FROM passwords');

      expect(response.status).toBe(400);
    });
  });

  describe('XSS Protection', () => {
    test('Script tags should be sanitized', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          comment: '<script>alert("XSS")</script>'
        });

      expect(response.status).toBe(200);
      expect(response.body.comment).not.toContain('<script>');
    });

    test('Event handlers should be sanitized', async () => {
      const response = await request(app)
        .post('/api/profile')
        .send({
          bio: '<img src=x onerror="alert(1)">'
        });

      expect(response.body.bio).not.toMatch(/onerror=/i);
    });
  });

  describe('Authentication & Authorization', () => {
    test('Unauthorized access should return 401', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard');

      expect(response.status).toBe(401);
    });

    test('Expired JWT should be rejected', async () => {
      const expiredToken = 'expired.jwt.token';
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });

    test('User cannot access other user resources', async () => {
      // Login as user1
      const loginRes = await request(app)
        .post('/api/login')
        .send({ username: 'user1', password: 'password1' });

      const token = loginRes.body.token;

      // Try to access user2's data
      const response = await request(app)
        .get('/api/users/2/private')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Security Headers', () => {
    test('Should have proper security headers', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    test('Should rate limit excessive requests', async () => {
      const requests = [];

      // Send 100 requests
      for (let i = 0; i < 100; i++) {
        requests.push(request(app).get('/api/endpoint'));
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter(r => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('CSRF Protection', () => {
    test('POST without CSRF token should fail', async () => {
      const response = await request(app)
        .post('/api/transfer')
        .send({ amount: 1000, to: 'attacker' });

      expect(response.status).toBe(403);
    });
  });

  describe('Input Validation', () => {
    test('Invalid email should be rejected', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'not-an-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    test('Weak password should be rejected', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'user@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('password');
    });
  });
});
```

```markdown
Step 3: Implement security middleware
Create `src/middleware/security.js`
```

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Input validation example
const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
];

// XSS sanitization
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    });
  }
  next();
};

module.exports = {
  securityHeaders,
  limiter,
  validateLogin,
  sanitizeInput
};
```

```markdown
Step 4: Run security tests
npm test tests/security.test.js

Challenge Exercise:
1. Add a test for file upload validation
2. Implement test for session timeout
3. Add test for CORS configuration
4. Write test for JWT token expiration

Discussion:
- Which OWASP Top 10 vulnerabilities are covered?
- What other security tests should be added?
- How to integrate security tests in CI pipeline?
```

**Expected Outcome**: Comprehensive security test suite passing in CI/CD

---

### Module 4: Environments & Secrets Management (45 minutes)

#### 4.1 Setting Up Environments (20 minutes)

**Theory**:
- Environment types (dev, staging, production)
- Environment protection rules
- Deployment gates and approvals

**Hands-On Activity**:
```markdown
Task: Configure environments in GitHub

Step 1: Create environments
1. Go to repository Settings > Environments
2. Create three environments:
   - development (no protection)
   - staging (require 1 reviewer)
   - production (require 2 reviewers + wait timer 5 min)

Step 2: Add environment protection rules
For Production environment:
- Enable "Required reviewers" → Add your username
- Enable "Wait timer" → Set to 5 minutes
- Add environment variables:
  - APP_ENV=production
  - LOG_LEVEL=error

For Staging environment:
- Enable "Required reviewers" → Add team member
- Add environment variables:
  - APP_ENV=staging
  - LOG_LEVEL=debug

Step 3: Create deployment workflow
Create `.github/workflows/deploy.yml`
```

```yaml
name: Deploy Application

on:
  push:
    branches: [ main ]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        run: |
          echo "Deploying to Staging environment"
          echo "Environment: ${{ vars.APP_ENV }}"
          echo "Log Level: ${{ vars.LOG_LEVEL }}"
          # Add actual deployment commands here

      - name: Run smoke tests
        run: |
          echo "Running smoke tests on staging"
          # curl -f https://staging.example.com/health

  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production
        run: |
          echo "Deploying to Production environment"
          echo "Environment: ${{ vars.APP_ENV }}"
          # Add actual deployment commands here

      - name: Health check
        run: |
          echo "Checking production health"
          # curl -f https://production.example.com/health
```

```markdown
Step 4: Test deployment workflow
- Push to main branch
- Observe staging deployment
- Approve production deployment
- Monitor deployment progress

Discussion:
- When to use manual approval gates?
- Difference between environment variables and secrets?
- Best practices for staging vs production?
```

**Expected Outcome**: Multi-environment deployment with approval gates

---

#### 4.2 Secrets Management (25 minutes)

**Theory**:
- Types of secrets (API keys, credentials, certificates)
- Secret rotation strategies
- Secret scanning and prevention

**Hands-On Activity**:
```markdown
Task: Implement comprehensive secrets management

Step 1: Add repository secrets
1. Go to Settings > Secrets and variables > Actions
2. Add repository secrets:
   - DOCKER_USERNAME (for container registry)
   - DOCKER_PASSWORD
   - SLACK_WEBHOOK_URL (for notifications)

Step 2: Add environment-specific secrets
For Staging environment:
- DATABASE_URL=postgresql://staging-db:5432/app
- API_KEY=staging_api_key_xxxxx

For Production environment:
- DATABASE_URL=postgresql://prod-db:5432/app
- API_KEY=prod_api_key_xxxxx
- ENCRYPTION_KEY=prod_encryption_key_xxxxx

Step 3: Create workflow using secrets
Create `.github/workflows/deploy-with-secrets.yml`
```

```yaml
name: Deploy with Secrets

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/workshop-app:${{ github.sha }}

      - name: Deploy application
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
        run: |
          echo "Deploying with environment-specific secrets"
          # Your deployment script here
          # ./deploy.sh ${{ github.event.inputs.environment }}

      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "✅ Deployment to ${{ github.event.inputs.environment }} successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Environment:* ${{ github.event.inputs.environment }}\n*Commit:* ${{ github.sha }}\n*Status:* Success ✅"
                  }
                }
              ]
            }
```

```markdown
Step 4: Enable secret scanning
1. Go to Settings > Code security and analysis
2. Enable "Secret scanning"
3. Enable "Push protection"
4. Test by trying to commit a fake API key

Step 5: Cloud provider secrets example
Add cloud provider credentials workflow
```

```yaml
name: Deploy to AWS

on:
  workflow_dispatch:

jobs:
  deploy-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync ./build s3://${{ secrets.S3_BUCKET_NAME }}

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

```markdown
Challenge Exercise:
1. Set up OIDC authentication for AWS (no long-lived credentials)
2. Implement secret rotation workflow
3. Add secrets validation in CI pipeline
4. Create emergency secret revocation process

Security Best Practices Checklist:
□ Never commit secrets to repository
□ Use environment-specific secrets
□ Enable push protection
□ Rotate secrets regularly (every 90 days)
□ Use least privilege for service accounts
□ Monitor secret access logs
□ Have secret revocation plan
```

**Expected Outcome**: Secure secrets management with environment separation

---

### Module 5: Branch Protection & Security Policies (30 minutes)

#### 5.1 Branch Protection Rules (30 minutes)

**Theory**:
- Protection strategies for critical branches
- Pull request requirements
- Status check enforcement
- Code review policies

**Hands-On Activity**:
```markdown
Task: Implement comprehensive branch protection

Step 1: Configure branch protection for main branch
1. Go to Settings > Branches > Add rule
2. Branch name pattern: main
3. Enable the following protections:

Required Settings:
□ Require a pull request before merging
  □ Require approvals: 2
  □ Dismiss stale pull request approvals when new commits are pushed
  □ Require review from Code Owners
□ Require status checks to pass before merging
  □ Require branches to be up to date before merging
  □ Status checks that are required:
    - build-and-test
    - security-scan
    - CodeQL
□ Require conversation resolution before merging
□ Require signed commits
□ Require linear history
□ Do not allow bypassing the above settings
□ Restrict who can push to matching branches
□ Allow force pushes: Disabled
□ Allow deletions: Disabled

Step 2: Create CODEOWNERS file
Create `.github/CODEOWNERS`
```

```
# Default owners for everything in the repo
*       @your-username @team-lead

# Security-sensitive files
/src/auth/          @security-team
/src/payments/      @security-team @finance-team
*.env.example       @devops-team

# Infrastructure and CI/CD
/.github/           @devops-team
/terraform/         @devops-team @infrastructure-team
/docker/            @devops-team

# Documentation
/docs/              @documentation-team
*.md                @documentation-team
```

```markdown
Step 3: Configure Dependabot
Create `.github/dependabot.yml`
```

```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    assignees:
      - "your-username"
    labels:
      - "dependencies"
      - "security"
    commit-message:
      prefix: "npm"
      include: "scope"

  # Enable security updates
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 5
    labels:
      - "security"
      - "critical"

  # Docker dependencies
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    reviewers:
      - "devops-team"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

```markdown
Step 4: Test branch protection
1. Create a feature branch: git checkout -b feature/test-protection
2. Make changes and commit
3. Try to push directly to main (should fail)
4. Create a pull request
5. Try to merge without approval (should fail)
6. Try to merge with failing checks (should fail)
7. Get required approvals
8. Merge the PR

Step 5: Create pull request template
Create `.github/PULL_REQUEST_TEMPLATE.md`
```

```markdown
## Description
<!-- Provide a brief description of the changes in this PR -->

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Security fix
- [ ] Documentation update

## Testing
<!-- Describe the tests you ran to verify your changes -->

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Security tests pass
- [ ] Manual testing completed

## Security Checklist
- [ ] No secrets or credentials in code
- [ ] Input validation implemented
- [ ] Authentication/authorization properly handled
- [ ] Security scan passed (CodeQL, Trivy, etc.)
- [ ] Dependencies updated and vulnerabilities addressed

## Screenshots (if applicable)
<!-- Add screenshots to help explain your changes -->

## Additional Context
<!-- Add any other context about the PR here -->

## Reviewer Notes
<!-- Specific areas you want reviewers to focus on -->
```

```markdown
Discussion:
- When to require signed commits?
- How many reviewers are appropriate?
- Should you allow force pushes for any branch?
- How to handle emergency hotfixes?

Advanced Exercise:
1. Set up rulesets for different branch patterns
2. Configure different rules for feature/* vs hotfix/* branches
3. Implement automatic PR labeling
4. Create custom status checks
```

**Expected Outcome**: Fully protected branches with enforcement policies

---

### Module 6: Monitoring & Alerting (45 minutes)

#### 6.1 Pipeline Monitoring (25 minutes)

**Theory**:
- Monitoring metrics and KPIs
- Alert channels and notification strategies
- Incident response workflows

**Hands-On Activity**:
```markdown
Task: Implement comprehensive monitoring and alerting

Step 1: Create monitoring workflow
Create `.github/workflows/monitoring.yml`
```

```yaml
name: Pipeline Monitoring

on:
  workflow_run:
    workflows: ["CI Pipeline", "Deploy Application"]
    types:
      - completed

jobs:
  monitor-pipeline:
    runs-on: ubuntu-latest
    steps:
      - name: Check workflow status
        id: check
        run: |
          echo "workflow=${{ github.event.workflow_run.name }}" >> $GITHUB_OUTPUT
          echo "conclusion=${{ github.event.workflow_run.conclusion }}" >> $GITHUB_OUTPUT
          echo "duration=${{ github.event.workflow_run.run_duration_ms }}" >> $GITHUB_OUTPUT

      - name: Send Slack notification on failure
        if: github.event.workflow_run.conclusion == 'failure'
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "🚨 Pipeline Failed!",
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "🚨 Pipeline Failure Alert"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": "*Workflow:*\n${{ steps.check.outputs.workflow }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Status:*\n❌ Failed"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Branch:*\n${{ github.ref_name }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Commit:*\n${{ github.sha }}"
                    }
                  ]
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Author:* ${{ github.actor }}"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Logs"
                      },
                      "url": "${{ github.event.workflow_run.html_url }}"
                    }
                  ]
                }
              ]
            }

      - name: Send success notification
        if: github.event.workflow_run.conclusion == 'success'
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "✅ Pipeline Success - ${{ steps.check.outputs.workflow }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "✅ *${{ steps.check.outputs.workflow }}* completed successfully\n*Branch:* ${{ github.ref_name }}\n*Duration:* ${{ steps.check.outputs.duration }}ms"
                  }
                }
              ]
            }

      - name: Create issue on repeated failures
        if: github.event.workflow_run.conclusion == 'failure'
        uses: actions/github-script@v6
        with:
          script: |
            const { data: runs } = await github.rest.actions.listWorkflowRuns({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: context.payload.workflow_run.workflow_id,
              per_page: 5
            });

            const recentFailures = runs.workflow_runs.filter(
              run => run.conclusion === 'failure'
            ).length;

            if (recentFailures >= 3) {
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: `🚨 Pipeline Repeatedly Failing: ${context.payload.workflow_run.name}`,
                body: `The pipeline has failed ${recentFailures} times in a row.\n\n**Workflow:** ${context.payload.workflow_run.name}\n**Branch:** ${context.ref}\n**Last Run:** ${context.payload.workflow_run.html_url}\n\nPlease investigate and fix the issue.`,
                labels: ['bug', 'ci-failure', 'priority-high']
              });
            }
```

```markdown
Step 2: Set up security alert monitoring
Create `.github/workflows/security-monitoring.yml`
```

```yaml
name: Security Monitoring

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'json'
          output: 'trivy-results.json'
          severity: 'CRITICAL,HIGH'

      - name: Parse results and alert
        id: parse
        run: |
          CRITICAL=$(cat trivy-results.json | jq '[.Results[].Vulnerabilities[]? | select(.Severity=="CRITICAL")] | length')
          HIGH=$(cat trivy-results.json | jq '[.Results[].Vulnerabilities[]? | select(.Severity=="HIGH")] | length')
          echo "critical=$CRITICAL" >> $GITHUB_OUTPUT
          echo "high=$HIGH" >> $GITHUB_OUTPUT

      - name: Send email alert on critical vulnerabilities
        if: steps.parse.outputs.critical > 0
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: '🚨 CRITICAL Security Vulnerabilities Detected'
          body: |
            Critical security vulnerabilities have been detected in ${{ github.repository }}.

            Critical: ${{ steps.parse.outputs.critical }}
            High: ${{ steps.parse.outputs.high }}

            Please review immediately: ${{ github.server_url }}/${{ github.repository }}/security
          to: security-team@example.com
          from: github-actions@example.com

      - name: Upload results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Post to Slack
        if: steps.parse.outputs.critical > 0 || steps.parse.outputs.high > 0
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "⚠️ Security Vulnerabilities Found",
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "⚠️ Security Alert"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": "*Critical:*\n${{ steps.parse.outputs.critical }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*High:*\n${{ steps.parse.outputs.high }}"
                    }
                  ]
                }
              ]
            }
```

```markdown
Step 3: Create metrics collection workflow
Create `.github/workflows/metrics.yml`
```

```yaml
name: Collect Metrics

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Collect deployment metrics
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const owner = context.repo.owner;
            const repo = context.repo.repo;

            // Get deployments in last 7 days
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const { data: deployments } = await github.rest.repos.listDeployments({
              owner,
              repo,
              per_page: 100
            });

            const recentDeployments = deployments.filter(d =>
              new Date(d.created_at) > oneWeekAgo
            );

            // Calculate metrics
            const metrics = {
              deployment_frequency: recentDeployments.length,
              week: new Date().toISOString().split('T')[0],
              repository: `${owner}/${repo}`
            };

            // Get workflow runs
            const { data: runs } = await github.rest.actions.listWorkflowRunsForRepo({
              owner,
              repo,
              created: `>${oneWeekAgo.toISOString()}`,
              per_page: 100
            });

            const failed = runs.workflow_runs.filter(r => r.conclusion === 'failure').length;
            const total = runs.workflow_runs.length;

            metrics.failure_rate = total > 0 ? (failed / total * 100).toFixed(2) + '%' : '0%';
            metrics.total_runs = total;
            metrics.failed_runs = failed;

            // Calculate average duration
            const durations = runs.workflow_runs
              .filter(r => r.run_duration_ms)
              .map(r => r.run_duration_ms);

            metrics.avg_duration_minutes = durations.length > 0
              ? (durations.reduce((a, b) => a + b, 0) / durations.length / 60000).toFixed(2)
              : 0;

            // Save metrics
            fs.writeFileSync('metrics.json', JSON.stringify(metrics, null, 2));

            console.log('Metrics collected:', metrics);

            return metrics;

      - name: Create metrics report
        run: |
          cat > metrics-report.md << 'EOF'
          # CI/CD Metrics Report

          **Week of:** $(date +%Y-%m-%d)

          ## Deployment Metrics
          - **Deployment Frequency:** $(jq -r '.deployment_frequency' metrics.json) deployments
          - **Total Pipeline Runs:** $(jq -r '.total_runs' metrics.json)
          - **Failed Runs:** $(jq -r '.failed_runs' metrics.json)
          - **Failure Rate:** $(jq -r '.failure_rate' metrics.json)
          - **Average Duration:** $(jq -r '.avg_duration_minutes' metrics.json) minutes

          ## Trends
          - Deployment frequency target: 5+ per week ✓/✗
          - Failure rate target: < 10% ✓/✗
          - Average duration target: < 15 minutes ✓/✗
          EOF

      - name: Upload metrics artifact
        uses: actions/upload-artifact@v3
        with:
          name: metrics-report
          path: |
            metrics.json
            metrics-report.md

      - name: Post metrics to Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload-file-path: "./metrics.json"
```

```markdown
Challenge Exercise:
1. Set up PagerDuty integration for critical alerts
2. Create custom dashboard for metrics visualization
3. Implement MTTR (Mean Time To Recovery) tracking
4. Add performance monitoring for deployed applications

Discussion:
- What metrics matter most for your team?
- How to balance alert fatigue vs missing critical issues?
- When to page someone vs send an email?
```

**Expected Outcome**: Comprehensive monitoring with multi-channel alerting

---

#### 6.2 Health Checks & Smoke Tests (20 minutes)

**Hands-On Activity**:
```markdown
Task: Implement health checks and smoke tests

Step 1: Create health check endpoint
Add to your application (example for Node.js/Express):
```

```javascript
// src/routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    checks: {}
  };

  try {
    // Database check
    // await db.query('SELECT 1');
    health.checks.database = 'OK';
  } catch (error) {
    health.checks.database = 'FAILED';
    health.status = 'DEGRADED';
  }

  try {
    // Cache check (Redis, etc.)
    // await cache.ping();
    health.checks.cache = 'OK';
  } catch (error) {
    health.checks.cache = 'FAILED';
    health.status = 'DEGRADED';
  }

  // Check external dependencies
  health.checks.api = 'OK';  // Your API health

  const httpStatus = health.status === 'OK' ? 200 : 503;
  res.status(httpStatus).json(health);
});

router.get('/ready', (req, res) => {
  // Readiness probe - is app ready to serve traffic?
  res.status(200).json({ status: 'ready' });
});

router.get('/live', (req, res) => {
  // Liveness probe - is app alive?
  res.status(200).json({ status: 'live' });
});

module.exports = router;
```

```markdown
Step 2: Create smoke test suite
Create `tests/smoke.test.js`
```

```javascript
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('Smoke Tests', () => {
  test('Health endpoint returns 200', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
  });

  test('Application is responsive', async () => {
    const start = Date.now();
    await axios.get(`${BASE_URL}/`);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);  // < 2 seconds
  });

  test('API endpoints are accessible', async () => {
    const response = await axios.get(`${BASE_URL}/api/status`);
    expect(response.status).toBe(200);
  });

  test('Database connection is working', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    expect(response.data.checks.database).toBe('OK');
  });
});
```

```markdown
Step 3: Add smoke tests to deployment workflow
Update `.github/workflows/deploy.yml`
```

```yaml
  deploy-staging:
    # ... previous steps ...

    - name: Wait for deployment
      run: sleep 30

    - name: Run smoke tests
      env:
        BASE_URL: https://staging.example.com
      run: npm run test:smoke

    - name: Health check
      run: |
        for i in {1..5}; do
          if curl -f https://staging.example.com/health; then
            echo "Health check passed"
            exit 0
          fi
          echo "Attempt $i failed, retrying..."
          sleep 10
        done
        echo "Health check failed after 5 attempts"
        exit 1
```

**Expected Outcome**: Automated health checks in deployment pipeline

---

### Module 7: Hands-On Capstone Project (60 minutes)

#### 7.1 Complete Project Implementation (60 minutes)

**Capstone Challenge**:
```markdown
Task: Build a complete CI/CD pipeline with all learned concepts

Project Requirements:
You will implement a full CI/CD pipeline for a microservices application
with the following components:

1. Application: Simple Node.js/Python API with database
2. CI/CD Pipeline with:
   - Multi-stage build and test
   - Security scanning (CodeQL, Trivy, OWASP)
   - Comprehensive security tests
   - Multi-environment deployment (staging → production)
   - Approval gates
   - Health checks and smoke tests
3. Security:
   - Branch protection
   - Secret management
   - Dependabot
   - CODEOWNERS
4. Monitoring:
   - Slack/Email notifications
   - Metrics collection
   - Automated incident response

Step 1: Set up project structure
workshop-project/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   ├── security.yml
│   │   └── monitoring.yml
│   ├── CODEOWNERS
│   └── dependabot.yml
├── src/
│   ├── app.js
│   ├── routes/
│   └── middleware/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── security/
│   └── smoke/
├── Dockerfile
└── docker-compose.yml

Step 2: Implement CI pipeline (20 minutes)
- Build and test workflow
- Linting and code quality
- Unit and integration tests
- Security scanning
- Docker image build

Step 3: Implement security (15 minutes)
- CodeQL analysis
- Dependency scanning
- Security test suite
- Secret scanning

Step 4: Implement CD pipeline (15 minutes)
- Multi-environment deployment
- Approval gates
- Smoke tests
- Rollback capability

Step 5: Implement monitoring (10 minutes)
- Notifications
- Metrics collection
- Alert on failures

Success Criteria:
□ All CI checks pass
□ Security scans show no critical issues
□ Can deploy to staging automatically
□ Production requires approval
□ Slack notifications working
□ Health checks passing
□ Metrics collected
□ Branch protection enforced

Bonus Challenges:
□ Implement canary deployment
□ Add performance testing
□ Set up log aggregation
□ Implement automatic rollback on health check failure
□ Add chaos engineering tests
```

```markdown
Evaluation Rubric:

CI/CD Implementation (30 points):
- Pipeline runs successfully (10)
- Multi-stage deployment works (10)
- Approval gates function (10)

Security (30 points):
- Security scans integrated (10)
- Security tests comprehensive (10)
- Branch protection configured (10)

Code Quality (20 points):
- Clean, documented code (10)
- Best practices followed (10)

Monitoring (20 points):
- Notifications working (10)
- Metrics collection implemented (10)

Total: 100 points
```

**Expected Outcome**: Fully functional CI/CD pipeline with security and monitoring

---

## Workshop Wrap-Up (30 minutes)

### Review & Discussion
1. **What We've Learned**:
   - CI/CD pipeline design and implementation
   - Security integration at every stage
   - Secrets and environment management
   - Branch protection strategies
   - Monitoring and alerting

2. **Best Practices Summary**:
   - Shift left on security (early detection)
   - Automate everything
   - Fail fast, recover faster
   - Monitor continuously
   - Document thoroughly

3. **Common Pitfalls to Avoid**:
   - Committing secrets
   - Insufficient testing
   - No rollback strategy
   - Ignoring security alerts
   - Poor error handling
   - Alert fatigue

### Next Steps & Resources

**Continue Learning**:
1. Advanced Topics:
   - GitOps with ArgoCD/Flux
   - Kubernetes deployments
   - Infrastructure as Code (Terraform)
   - Service mesh security
   - Zero-trust architecture

2. Certifications:
   - GitHub Actions Certification
   - AWS/Azure/GCP DevOps
   - Certified Kubernetes Administrator (CKA)
   - Certified Information Systems Security Professional (CISSP)

3. Tools to Explore:
   - SonarQube for code quality
   - HashiCorp Vault for secrets
   - Grafana/Prometheus for monitoring
   - Datadog/New Relic for APM
   - PagerDuty for incident management

**Resources**:
- GitHub Actions Documentation: https://docs.github.com/actions
- OWASP Top 10: https://owasp.org/Top10/
- DevSecOps Manifesto: https://www.devsecops.org/
- The Phoenix Project (Book)
- Site Reliability Engineering (Book)

### Q&A Session

**Common Questions**:

Q: How often should we run security scans?
A: Daily scheduled scans + on every PR + on deployment

Q: Should all tests run on every commit?
A: Fast tests (unit) on every commit, slower tests (E2E) on PR to main

Q: How to handle secrets rotation?
A: Use secret management systems with automatic rotation, update secrets without downtime using rolling updates

Q: When to use manual approval vs auto-deploy?
A: Staging: auto-deploy, Production: manual approval (except for hotfixes with proper guardrails)

Q: How many environments do we need?
A: Minimum: dev, staging, production. Ideal: add QA and pre-production

---

## Post-Workshop Assignments

### Assignment 1: Extend Your Pipeline
- Add integration tests
- Implement database migrations in pipeline
- Add performance testing
- Set up blue-green or canary deployment

### Assignment 2: Security Hardening
- Implement SAST and DAST scanning
- Add security.txt file
- Set up security policy (SECURITY.md)
- Implement software bill of materials (SBOM)

### Assignment 3: Advanced Monitoring
- Set up custom metrics collection
- Create grafana dashboard
- Implement distributed tracing
- Set up log aggregation

### Assignment 4: Disaster Recovery
- Document rollback procedures
- Implement automated rollback
- Create incident response playbook
- Set up backup and restore automation

---

## Feedback & Improvement

### Workshop Feedback Form
Please provide feedback on:
1. Content clarity (1-5)
2. Hands-on exercises difficulty (1-5)
3. Pace of the workshop (too slow / just right / too fast)
4. Most valuable module
5. Suggestions for improvement
6. Topics you want to learn more about

### Continuous Improvement
This workshop is continuously updated based on:
- Participant feedback
- Industry best practices
- New GitHub features
- Security trends

---

## Additional Resources

### Cheat Sheets
- [GitHub Actions Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Security Testing Checklist](https://owasp.org/www-project-web-security-testing-guide/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

### Community
- GitHub Community Forum
- DevOps Stack Exchange
- r/devops subreddit
- CNCF Slack

### Tools & Services
- GitHub Advanced Security
- Dependabot
- CodeQL
- Trivy
- SonarCloud
- Snyk

---

**Workshop Version**: 1.0
**Last Updated**: 2024
**Instructor**: [Your Name]
**Contact**: [Your Email]

---

## Conclusion

Congratulations on completing the DevOps CI/CD & Security Workshop! You now have the knowledge and hands-on experience to:

✅ Build robust CI/CD pipelines
✅ Implement security at every stage
✅ Manage secrets and environments safely
✅ Protect critical branches
✅ Monitor and alert effectively
✅ Respond to incidents quickly

Remember: Security is not a feature, it's a continuous process. Keep learning, keep improving, and stay secure!

**Happy Automating! 🚀**
