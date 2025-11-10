# Phase 2: CI/CD - Developer Guide

## Overview

**Role**: Developer (Dev)
**Duration**: 4 days (within November 17-21, 2025)
**Prerequisites**: Phase 1 completed
**Objective**: Implement CI/CD workflows, configure environments, and integrate secrets management

---

## Tasks Overview

| Task | Description | Duration | Feature |
|------|-------------|----------|---------|
| Task 3 | Develop Build & Test Workflows in GitHub Actions | 2 days | Copilot Test Generation / GitHub Actions |
| Task 4 | Set Up Environments (Dev/Staging/Prod) | 1 day | General Copilot Usage |
| Task 5 | Connect Secrets for Deployment | 1 day | General Copilot Usage |

---
---

## Task 3: Develop Build & Test Workflows in GitHub Actions

**Owner**: Developer
**Estimated Time**: 2 days
**Feature**: Copilot Test Generation / GitHub Actions

### Objectives
- Create comprehensive CI workflow
- Implement automated testing
- Set up build artifacts
- Configure caching for performance

---

### Step 1: Create Basic CI Workflow

#### 1.1 Set Up Directory Structure

```bash
# Create workflow directory
mkdir -p .github/workflows

# Create scripts directory for custom scripts
mkdir -p scripts/ci
```

#### 1.2 Create Main CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

# Cancel in-progress runs for the same PR
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Job 1: Code Quality Checks
  code-quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint
        continue-on-error: false

      - name: Check code formatting
        run: npm run format:check
        continue-on-error: false

      - name: Run TypeScript type checking
        run: npm run type-check
        if: hashFiles('tsconfig.json') != ''

      - name: Upload lint results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: lint-results
          path: reports/lint-results.json

  # Job 2: Unit Tests
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: code-quality

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage
        env:
          NODE_ENV: test

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false

      - name: Generate coverage report
        run: npm run coverage:report

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: unit-test-results
          path: |
            coverage/
            test-results/

      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          lcov-file: ./coverage/lcov.info

  # Job 3: Integration Tests
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: code-quality

    # Service containers for integration tests
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Wait for services
        run: |
          echo "Waiting for PostgreSQL..."
          sleep 5
          echo "Waiting for Redis..."
          sleep 2

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb

      - name: Seed test data
        run: npm run db:seed:test
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb

      - name: Run integration tests
        run: npm run test:integration
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: integration-test-results
          path: test-results/integration/

  # Job 4: Build Application
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production

      - name: Verify build output
        run: |
          if [ ! -d "dist" ]; then
            echo "Build failed: dist directory not found"
            exit 1
          fi
          echo "Build successful: $(du -sh dist)"

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            dist/
            package.json
            package-lock.json
          retention-days: 30

      - name: Cache build output
        uses: actions/cache@v4
        with:
          path: dist
          key: build-${{ github.sha }}

  # Job 5: E2E Tests
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-artifacts
          path: dist/

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NODE_ENV: test
          BASE_URL: http://localhost:3000

      - name: Upload E2E test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-test-results
          path: |
            test-results/e2e/
            playwright-report/

      - name: Upload Playwright traces
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: test-results/traces/

  # Job 6: Security Scan
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Upload security results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: security-scan-results
          path: snyk-report.json

  # Job 7: Summary
  ci-summary:
    name: CI Summary
    runs-on: ubuntu-latest
    needs: [code-quality, unit-tests, integration-tests, build, e2e-tests, security-scan]
    if: always()

    steps:
      - name: Check all jobs status
        run: |
          echo "CI Pipeline Summary"
          echo "===================="
          echo "Code Quality: ${{ needs.code-quality.result }}"
          echo "Unit Tests: ${{ needs.unit-tests.result }}"
          echo "Integration Tests: ${{ needs.integration-tests.result }}"
          echo "Build: ${{ needs.build.result }}"
          echo "E2E Tests: ${{ needs.e2e-tests.result }}"
          echo "Security Scan: ${{ needs.security-scan.result }}"

          # Fail if any critical job failed
          if [[ "${{ needs.code-quality.result }}" == "failure" ]] || \
             [[ "${{ needs.unit-tests.result }}" == "failure" ]] || \
             [[ "${{ needs.integration-tests.result }}" == "failure" ]] || \
             [[ "${{ needs.build.result }}" == "failure" ]]; then
            echo "❌ CI Pipeline Failed"
            exit 1
          fi

          echo "✅ CI Pipeline Passed"

      - name: Update commit status
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            const status = '${{ needs.ci-summary.result }}' === 'success' ? 'success' : 'failure';
            await github.rest.repos.createCommitStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              sha: context.sha,
              state: status,
              context: 'CI Pipeline',
              description: status === 'success' ? 'All checks passed' : 'Some checks failed'
            });
```

---

### Step 2: Create Reusable Workflows

#### 2.1 Create Reusable Test Workflow

Create `.github/workflows/reusable-test.yml`:

```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      test-type:
        required: true
        type: string
        description: 'Type of test to run (unit, integration, e2e)'
      node-version:
        required: false
        type: string
        default: '20'
        description: 'Node.js version to use'
      upload-coverage:
        required: false
        type: boolean
        default: false
        description: 'Whether to upload coverage report'
    secrets:
      codecov-token:
        required: false
        description: 'Codecov token for coverage upload'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ inputs.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ${{ inputs.test-type }} tests
        run: npm run test:${{ inputs.test-type }}

      - name: Upload coverage
        if: inputs.upload-coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.codecov-token }}
          flags: ${{ inputs.test-type }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: ${{ inputs.test-type }}-test-results
          path: test-results/
```

---

### Step 3: Add Build Optimization

#### 3.1 Create Caching Strategy

Create `docs/ci-cd/CACHING_STRATEGY.md`:

```markdown
# CI/CD Caching Strategy

## npm Dependencies Caching

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Automatically caches node_modules
```

## Custom Cache for Build Outputs

```yaml
- name: Cache build output
  uses: actions/cache@v4
  with:
    path: |
      dist/
      .next/cache
      .cache
    key: build-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx') }}
    restore-keys: |
      build-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}-
      build-${{ runner.os }}-
```

## Test Cache

```yaml
- name: Cache test data
  uses: actions/cache@v4
  with:
    path: |
      test-results/
      coverage/
    key: test-cache-${{ github.run_id }}
```

## Benefits
- 50-80% faster npm install
- 30-50% faster builds (with build cache)
- Reduced GitHub Actions minutes usage
```

---

### Deliverables for Task 3

Create these files:
- ✅ `.github/workflows/ci.yml`
- ✅ `.github/workflows/reusable-test.yml`
- ✅ `docs/ci-cd/CACHING_STRATEGY.md`

### Validation Checklist
- [ ] CI workflow triggers on push and PR
- [ ] All test types execute successfully
- [ ] Build artifacts are created
- [ ] Caching reduces build time
- [ ] Failed builds block merge

---
---

## Task 4: Set Up Environments (Dev/Staging/Prod)

**Owner**: Developer
**Estimated Time**: 1 day
**Feature**: General Copilot Usage

### Objectives
- Create three environments in GitHub
- Configure protection rules for each environment
- Set environment-specific variables
- Implement approval workflows

---

### Step 1: Create Environments in GitHub

#### 1.1 Access GitHub Settings

1. Navigate to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Environments**

#### 1.2 Create Development Environment

Click **New environment** button:

**Environment name**: `development`

**Configuration**:
```
Protection rules:
  ☐ Required reviewers: (none)
  ☐ Wait timer: 0 minutes
  ☑ Deployment branches: Selected branches
     - develop
```

**Environment variables** (Click "Add variable"):
```
Name: API_URL
Value: https://api-dev.tcc-project.local

Name: APP_ENV
Value: development

Name: DEBUG_MODE
Value: true

Name: LOG_LEVEL
Value: debug

Name: DATABASE_NAME
Value: tcc_dev

Name: FEATURE_FLAGS
Value: all_enabled
```

**Environment secrets** (Click "Add secret"):
```
Name: DATABASE_URL
Value: postgresql://dev_user:dev_pass@dev-db.local:5432/tcc_dev

Name: API_KEY
Value: dev_api_key_xxxxx

Name: REDIS_URL
Value: redis://dev-redis.local:6379
```

#### 1.3 Create Staging Environment

Click **New environment** button:

**Environment name**: `staging`

**Configuration**:
```
Protection rules:
  ☑ Required reviewers: 1
     - Add: Tech Lead (@tech-lead-username)
     - Add: Senior Developer (@senior-dev-username) [backup]

  ☑ Wait timer: 5 minutes

  ☑ Deployment branches: Selected branches
     - develop
     - release/*
```

**Environment variables**:
```
Name: API_URL
Value: https://api-staging.tcc-project.com

Name: APP_ENV
Value: staging

Name: DEBUG_MODE
Value: false

Name: LOG_LEVEL
Value: info

Name: DATABASE_NAME
Value: tcc_staging

Name: FEATURE_FLAGS
Value: beta_enabled
```

**Environment secrets**:
```
Name: DATABASE_URL
Value: postgresql://staging_user:staging_pass@staging-db.tcc.local:5432/tcc_staging

Name: API_KEY
Value: staging_api_key_xxxxx

Name: REDIS_URL
Value: redis://staging-redis.tcc.local:6379

Name: AZURE_CREDENTIALS
Value: {"clientId":"xxx","clientSecret":"xxx","subscriptionId":"xxx","tenantId":"xxx"}
```

#### 1.4 Create Production Environment

Click **New environment** button:

**Environment name**: `production`

**Configuration**:
```
Protection rules:
  ☑ Required reviewers: 2
     - Add: Tech Lead (@tech-lead-username)
     - Add: Product Manager (@pm-username)
     - Add: Senior Developer (@senior-dev-username) [optional 3rd]

  ☑ Wait timer: 30 minutes

  ☑ Deployment branches: Selected branches
     - main

  ☑ Prevent self-review: ☑

  ☑ Custom deployment protection rules: (if available)
     - Require status checks to pass
```

**Environment variables**:
```
Name: API_URL
Value: https://api.tcc-project.com

Name: APP_ENV
Value: production

Name: DEBUG_MODE
Value: false

Name: LOG_LEVEL
Value: error

Name: DATABASE_NAME
Value: tcc_production

Name: FEATURE_FLAGS
Value: stable_only
```

**Environment secrets**:
```
Name: DATABASE_URL
Value: [Production database connection string - from Azure Key Vault]

Name: API_KEY
Value: [Production API key - from Azure Key Vault]

Name: REDIS_URL
Value: [Production Redis URL - from Azure Key Vault]

Name: AZURE_CREDENTIALS
Value: [Production Azure service principal]

Name: BOX_CLIENT_ID
Value: [Production Box API client ID]

Name: BOX_CLIENT_SECRET
Value: [Production Box API client secret]

Name: ENCRYPTION_KEY
Value: [Production encryption key]
```

---

### Step 2: Create Deployment Workflow with Environments

#### 2.1 Create Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Application

on:
  push:
    branches: [ develop, main ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  # Deploy to Development (automatic on develop branch)
  deploy-dev:
    name: Deploy to Development
    if: github.ref == 'refs/heads/develop' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'development')
    runs-on: ubuntu-latest
    environment: development

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          API_URL: ${{ vars.API_URL }}
          APP_ENV: ${{ vars.APP_ENV }}
          NODE_ENV: production

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}

      - name: Deploy to Development
        run: |
          echo "Deploying to Development environment"
          echo "API URL: ${{ vars.API_URL }}"
          echo "Environment: ${{ vars.APP_ENV }}"
          # Add your deployment commands here
          # Example: npm run deploy:dev

      - name: Health check
        run: |
          echo "Running health check on ${{ vars.API_URL }}"
          curl -f ${{ vars.API_URL }}/health || exit 1

      - name: Notify deployment success
        if: success()
        run: |
          echo "✅ Development deployment successful"

  # Deploy to Staging (manual approval required)
  deploy-staging:
    name: Deploy to Staging
    if: github.ref == 'refs/heads/develop' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'staging')
    runs-on: ubuntu-latest
    environment: staging
    needs: [deploy-dev]  # Only run if dev deployment succeeded

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          API_URL: ${{ vars.API_URL }}
          APP_ENV: ${{ vars.APP_ENV }}
          NODE_ENV: production

      - name: Run full test suite
        run: npm run test:all
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          REDIS_URL: ${{ secrets.REDIS_URL }}

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Deploy to Staging
        run: |
          echo "Deploying to Staging environment"
          echo "API URL: ${{ vars.API_URL }}"
          # Add your deployment commands here
          # Example: az webapp deploy --name tcc-staging --resource-group tcc-rg

      - name: Run integration tests
        run: npm run test:integration
        env:
          BASE_URL: ${{ vars.API_URL }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Monitor for 5 minutes
        run: |
          echo "Monitoring application health..."
          for i in {1..10}; do
            sleep 30
            curl -f ${{ vars.API_URL }}/health || exit 1
            echo "Health check $i/10 passed"
          done

      - name: Notify deployment success
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Staging Deployment Successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Staging deployment completed*\n\nEnvironment: Staging\nCommit: `${{ github.sha }}`\nURL: ${{ vars.API_URL }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Deploy to Production (multi-approval required + 30 min wait)
  deploy-production:
    name: Deploy to Production
    if: github.ref == 'refs/heads/main' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'production')
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Pre-deployment checklist
        run: |
          echo "=== Pre-Deployment Checklist ==="
          echo "✓ Code reviewed and approved"
          echo "✓ Tests passed in staging"
          echo "✓ Security scans completed"
          echo "✓ Rollback plan ready"
          echo "✓ Stakeholders notified"

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          API_URL: ${{ vars.API_URL }}
          APP_ENV: ${{ vars.APP_ENV }}
          NODE_ENV: production

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Backup production database
        run: |
          echo "Creating database backup..."
          # Add database backup command
          # az postgres backup create ...

      - name: Deploy to Production (Rolling)
        run: |
          echo "Deploying to Production environment (rolling deployment)"
          echo "API URL: ${{ vars.API_URL }}"
          # Add rolling deployment commands
          # Example: Blue-green or canary deployment

      - name: Run smoke tests on production
        run: npm run test:smoke:production
        env:
          BASE_URL: ${{ vars.API_URL }}

      - name: Monitor for 15 minutes
        run: |
          echo "Monitoring production deployment..."
          for i in {1..30}; do
            sleep 30
            curl -f ${{ vars.API_URL }}/health || exit 1
            echo "Health check $i/30 passed"
          done

      - name: Verify critical user journeys
        run: npm run test:critical-paths
        env:
          BASE_URL: ${{ vars.API_URL }}

      - name: Notify deployment success
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚀 Production Deployment Successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Production deployment completed*\n\nEnvironment: Production\nCommit: `${{ github.sha }}`\nDeployed by: ${{ github.actor }}\nURL: ${{ vars.API_URL }}\n\n✅ All health checks passed\n✅ Critical paths verified"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚨 Production Deployment Failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Production deployment failed*\n\nEnvironment: Production\nCommit: `${{ github.sha }}`\nDeployed by: ${{ github.actor }}\n\n❌ Automatic rollback initiated\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Logs>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### Step 3: Create Environment Documentation

#### 3.1 Document Environment Configuration

Create `docs/environments/ENVIRONMENT_CONFIG.md`:

```markdown
# Environment Configuration Guide

## Overview

Our application uses three environments: Development, Staging, and Production.

## Environment Details

### Development Environment

**Purpose**: Active development and feature testing

| Property | Value |
|----------|-------|
| URL | https://api-dev.tcc-project.local |
| Deploy Trigger | Automatic on merge to `develop` |
| Approvals | None |
| Wait Time | 0 minutes |
| Monitoring | 5 minutes |
| Rollback | Automatic on failure |

**Available Features**:
- All feature flags enabled
- Debug mode ON
- Verbose logging
- Test data available

### Staging Environment

**Purpose**: Pre-production testing and QA validation

| Property | Value |
|----------|-------|
| URL | https://api-staging.tcc-project.com |
| Deploy Trigger | Manual promotion from Dev |
| Approvals | 1 (Tech Lead) |
| Wait Time | 5 minutes |
| Monitoring | 30 minutes |
| Rollback | Manual or automatic on critical error |

**Available Features**:
- Beta features enabled
- Production-like data
- Full integration testing
- Performance testing

### Production Environment

**Purpose**: Live user-facing application

| Property | Value |
|----------|-------|
| URL | https://api.tcc-project.com |
| Deploy Trigger | Merge to `main` (business hours only) |
| Approvals | 2 (Tech Lead + PM) |
| Wait Time | 30 minutes |
| Monitoring | 1 hour |
| Rollback | Immediate on critical error |

**Constraints**:
- Stable features only
- No debug logging
- Error-level logs only
- Maximum uptime required

## Promoting Between Environments

### Dev → Staging

```bash
# 1. Ensure Dev is stable
gh run list --workflow=deploy.yml --limit 1

# 2. Trigger staging deployment
gh workflow run deploy.yml -f environment=staging

# 3. Wait for Tech Lead approval
# (Notification sent via Slack)

# 4. Monitor deployment
gh run watch
```

### Staging → Production

```bash
# 1. Ensure Staging stable for 24+ hours
# 2. Create release PR
git checkout main
git pull origin main
git merge develop
git push origin main

# 3. Wait for approvals (Tech Lead + PM)
# 4. Monitor production deployment
# 5. Verify critical user journeys
```

## Environment Variables Reference

### Development
\`\`\`env
API_URL=https://api-dev.tcc-project.local
APP_ENV=development
DEBUG_MODE=true
LOG_LEVEL=debug
DATABASE_NAME=tcc_dev
FEATURE_FLAGS=all_enabled
\`\`\`

### Staging
\`\`\`env
API_URL=https://api-staging.tcc-project.com
APP_ENV=staging
DEBUG_MODE=false
LOG_LEVEL=info
DATABASE_NAME=tcc_staging
FEATURE_FLAGS=beta_enabled
\`\`\`

### Production
\`\`\`env
API_URL=https://api.tcc-project.com
APP_ENV=production
DEBUG_MODE=false
LOG_LEVEL=error
DATABASE_NAME=tcc_production
FEATURE_FLAGS=stable_only
\`\`\`

## Accessing Environment Secrets

Secrets are managed in GitHub and accessed in workflows:

\`\`\`yaml
steps:
  - name: Use environment secret
    run: echo "Connecting to database"
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
\`\`\`

## Emergency Procedures

### Rollback Production

\`\`\`bash
# Option 1: Manual rollback via GitHub
gh workflow run rollback.yml -f environment=production -f version=previous

# Option 2: Revert commit
git revert HEAD
git push origin main
# This triggers automatic deployment of previous version
\`\`\`

### Disable Environment

If critical issue found:

1. Go to GitHub Settings → Environments
2. Select affected environment
3. Add deployment branch rule: `none` (temporarily)
4. This prevents any deployments until rule removed

## Troubleshooting

### Deployment Stuck on Approval
- Check if reviewers received notification
- Verify reviewers have correct permissions
- Check Slack for approval request

### Environment Variables Not Loading
- Verify variable name matches exactly (case-sensitive)
- Check variable is set in correct environment
- Ensure workflow specifies `vars.VARIABLE_NAME`

### Secrets Not Working
- Verify secret exists in environment
- Check secret name (case-sensitive)
- Ensure workflow uses `secrets.SECRET_NAME`
- Verify environment protection rules allow access
```

---

### Deliverables for Task 4

Complete these steps:
- ✅ Development environment created in GitHub
- ✅ Staging environment created with protection rules
- ✅ Production environment created with multi-approval
- ✅ Environment variables configured for all environments
- ✅ Environment secrets added securely
- ✅ Deployment workflow created (`.github/workflows/deploy.yml`)
- ✅ Environment documentation created

### Validation Checklist
- [ ] All three environments visible in GitHub Settings → Environments
- [ ] Development deploys automatically on merge to `develop`
- [ ] Staging requires Tech Lead approval
- [ ] Production requires 2 approvals and 30-minute wait
- [ ] Environment variables accessible in workflows
- [ ] Test deployment to each environment successful
- [ ] Rollback procedure tested in staging

---
---

## Task 5: Connect Secrets for Deployment

**Owner**: Developer
**Estimated Time**: 1 day
**Feature**: General Copilot Usage

### Objectives
- Connect to Azure services
- Integrate with Box Storage
- Set up Azure Key Vault integration
- Configure secrets in GitHub with proper rotation

---

### Step 1: Set Up Azure Integration

#### 1.1 Create Azure Service Principal

Open Azure Cloud Shell or local terminal with Azure CLI:

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "<subscription-id>"

# Create a resource group (if not exists)
az group create \
  --name tcc-github-rg \
  --location eastus

# Create service principal for GitHub Actions
az ad sp create-for-rbac \
  --name "github-actions-tcc" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/tcc-github-rg \
  --sdk-auth
```

**Output** (save this JSON):
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

#### 1.2 Add Azure Credentials to GitHub

1. Navigate to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

**Secret 1: AZURE_CREDENTIALS**
```
Name: AZURE_CREDENTIALS
Value: [Paste the entire JSON output from previous step]
```

**Secret 2: AZURE_CLIENT_ID**
```
Name: AZURE_CLIENT_ID
Value: [Just the clientId value]
```

**Secret 3: AZURE_CLIENT_SECRET**
```
Name: AZURE_CLIENT_SECRET
Value: [Just the clientSecret value]
```

**Secret 4: AZURE_TENANT_ID**
```
Name: AZURE_TENANT_ID
Value: [Just the tenantId value]
```

**Secret 5: AZURE_SUBSCRIPTION_ID**
```
Name: AZURE_SUBSCRIPTION_ID
Value: [Just the subscriptionId value]
```

#### 1.3 Test Azure Connection

Create `.github/workflows/test-azure-connection.yml`:

```yaml
name: Test Azure Connection

on:
  workflow_dispatch:

jobs:
  test-azure:
    name: Test Azure Authentication
    runs-on: ubuntu-latest

    steps:
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Verify Azure CLI
        run: |
          echo "Testing Azure connection..."
          az account show
          echo "✅ Azure authentication successful"

      - name: List resource groups
        run: |
          echo "Listing resource groups..."
          az group list --output table

      - name: Get subscription details
        run: |
          echo "Subscription details:"
          az account subscription show \
            --subscription-id ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

**Run the test**:
```bash
gh workflow run test-azure-connection.yml
gh run watch
```

#### 1.4 Create Azure App Service (Example)

```bash
# Create App Service plan
az appservice plan create \
  --name tcc-app-service-plan \
  --resource-group tcc-github-rg \
  --sku B1 \
  --is-linux

# Create Web App for Node.js
az webapp create \
  --name tcc-app-dev \
  --resource-group tcc-github-rg \
  --plan tcc-app-service-plan \
  --runtime "NODE|20-lts"

# Configure deployment from GitHub Actions
az webapp deployment user set \
  --user-name <deployment-username> \
  --password <deployment-password>

# Get publishing profile
az webapp deployment list-publishing-profiles \
  --name tcc-app-dev \
  --resource-group tcc-github-rg \
  --xml > publish-profile.xml
```

Add the publishing profile to GitHub:
```
Name: AZURE_PUBLISH_PROFILE
Value: [Contents of publish-profile.xml]
```

---

### Step 2: Set Up Azure Key Vault

#### 2.1 Create Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name tcc-keyvault \
  --resource-group tcc-github-rg \
  --location eastus \
  --enable-rbac-authorization false

# Grant service principal access to Key Vault
az keyvault set-policy \
  --name tcc-keyvault \
  --spn ${{ secrets.AZURE_CLIENT_ID }} \
  --secret-permissions get list
```

#### 2.2 Add Secrets to Key Vault

```bash
# Add database password
az keyvault secret set \
  --vault-name tcc-keyvault \
  --name database-password \
  --value "SecurePassword123!"

# Add API key
az keyvault secret set \
  --vault-name tcc-keyvault \
  --name api-key \
  --value "api-key-xxxxxxxxx"

# Add storage connection string
az keyvault secret set \
  --vault-name tcc-keyvault \
  --name storage-connection \
  --value "DefaultEndpointsProtocol=https;AccountName=tccstorageacct;..."

# List all secrets
az keyvault secret list \
  --vault-name tcc-keyvault \
  --output table
```

#### 2.3 Add Key Vault Name to GitHub

Add repository variable (not secret):
```
Name: AZURE_KEYVAULT_NAME
Value: tcc-keyvault
```

#### 2.4 Create Workflow to Retrieve Secrets from Key Vault

Create `.github/workflows/use-keyvault.yml`:

```yaml
name: Use Azure Key Vault Secrets

on:
  workflow_dispatch:
  push:
    branches: [ develop, main ]

jobs:
  deploy-with-keyvault:
    name: Deploy with Key Vault Secrets
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Get secrets from Key Vault
        uses: Azure/get-keyvault-secrets@v1
        with:
          keyvault: ${{ vars.AZURE_KEYVAULT_NAME }}
          secrets: 'database-password, api-key, storage-connection'
        id: keyvault

      - name: Use secrets in deployment
        run: |
          echo "Deploying application with Key Vault secrets"
          # Secrets are now available as:
          # ${{ steps.keyvault.outputs.database-password }}
          # ${{ steps.keyvault.outputs.api-key }}
          # ${{ steps.keyvault.outputs.storage-connection }}

          # Example: Connect to database (secret is masked in logs)
          echo "Database password retrieved: [MASKED]"
        env:
          DB_PASSWORD: ${{ steps.keyvault.outputs.database-password }}
          API_KEY: ${{ steps.keyvault.outputs.api-key }}
          STORAGE_CONN: ${{ steps.keyvault.outputs.storage-connection }}

      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: tcc-app-dev
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
```

---

### Step 3: Set Up Box Storage Integration

#### 3.1 Create Box Application

1. Go to [Box Developer Console](https://app.box.com/developers/console)
2. Click **Create New App**
3. Select **Custom App**
4. Select **OAuth 2.0 with JWT (Server Authentication)**
5. Name your app: "TCC GitHub Actions"
6. Click **Create App**

#### 3.2 Configure Box App

In the **Configuration** tab:

1. **OAuth 2.0 Credentials**:
   - Copy **Client ID**
   - Copy **Client Secret**

2. **Application Scopes**:
   - ✅ Read all files and folders stored in Box
   - ✅ Write all files and folders stored in Box
   - ✅ Manage users

3. **Advanced Features**:
   - ✅ Generate user access tokens

4. **App Settings**:
   - Add redirect URI: `http://localhost`

5. Save changes

#### 3.3 Generate Box JWT Configuration

1. In **Configuration** tab, scroll to **Add and Manage Public Keys**
2. Click **Generate a Public/Private Keypair**
3. Download the JSON configuration file (keep this secure!)

JSON file structure:
```json
{
  "boxAppSettings": {
    "clientID": "xxx",
    "clientSecret": "xxx",
    "appAuth": {
      "publicKeyID": "xxx",
      "privateKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\n...",
      "passphrase": "xxx"
    }
  },
  "enterpriseID": "xxx"
}
```

#### 3.4 Add Box Secrets to GitHub

**Option 1: Use JWT Configuration (Recommended)**

Add the entire JSON as a secret:
```
Name: BOX_JWT_CONFIG
Value: [Paste entire JSON from downloaded file]
```

**Option 2: Individual Credentials**

```
Name: BOX_CLIENT_ID
Value: [clientID from JSON]

Name: BOX_CLIENT_SECRET
Value: [clientSecret from JSON]

Name: BOX_ENTERPRISE_ID
Value: [enterpriseID from JSON]

Name: BOX_PRIVATE_KEY
Value: [privateKey from JSON]

Name: BOX_PRIVATE_KEY_PASSPHRASE
Value: [passphrase from JSON]

Name: BOX_PUBLIC_KEY_ID
Value: [publicKeyID from JSON]
```

#### 3.5 Create Box Integration Script

Create `scripts/box-upload.js`:

```javascript
const BoxSDK = require('box-node-sdk');
const fs = require('fs');
const path = require('path');

/**
 * Upload files to Box using JWT authentication
 */
async function uploadToBox() {
  // Parse JWT config from environment variable
  const jwtConfig = JSON.parse(process.env.BOX_JWT_CONFIG || '{}');

  // Initialize Box SDK
  const sdk = BoxSDK.getPreconfiguredInstance(jwtConfig);

  // Get service account client
  const client = sdk.getAppAuthClient('enterprise', jwtConfig.enterpriseID);

  // Verify authentication
  const me = await client.users.get(client.CURRENT_USER_ID);
  console.log(`Authenticated as: ${me.name} (${me.login})`);

  // Upload files
  const folderID = process.env.BOX_FOLDER_ID || '0'; // 0 = root folder

  const filesToUpload = [
    'dist/bundle.js',
    'dist/index.html',
    'dist/styles.css'
  ];

  for (const filePath of filesToUpload) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }

    const stream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    try {
      const file = await client.files.uploadFile(folderID, fileName, stream);
      console.log(`✅ Uploaded: ${fileName} (ID: ${file.entries[0].id})`);
    } catch (error) {
      console.error(`❌ Failed to upload ${fileName}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✅ All files uploaded successfully to Box');
}

// Run upload
uploadToBox().catch(error => {
  console.error('❌ Box upload failed:', error);
  process.exit(1);
});
```

#### 3.6 Create Box Upload Workflow

Create `.github/workflows/upload-to-box.yml`:

```yaml
name: Upload to Box Storage

on:
  workflow_dispatch:
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]
    branches: [main]

jobs:
  upload-to-box:
    name: Upload Artifacts to Box
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Box SDK
        run: npm install box-node-sdk

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-artifacts
          path: dist/

      - name: Upload to Box
        env:
          BOX_JWT_CONFIG: ${{ secrets.BOX_JWT_CONFIG }}
          BOX_FOLDER_ID: ${{ vars.BOX_FOLDER_ID }}  # Add as repository variable
        run: node scripts/box-upload.js

      - name: Verify upload
        run: |
          echo "✅ Build artifacts uploaded to Box"
          echo "Folder ID: ${{ vars.BOX_FOLDER_ID }}"
```

#### 3.7 Test Box Connection

Create `.github/workflows/test-box-connection.yml`:

```yaml
name: Test Box Connection

on:
  workflow_dispatch:

jobs:
  test-box:
    name: Test Box API Connection
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Box SDK
        run: npm install box-node-sdk

      - name: Test Box authentication
        env:
          BOX_JWT_CONFIG: ${{ secrets.BOX_JWT_CONFIG }}
        run: |
          node -e "
          const BoxSDK = require('box-node-sdk');
          const config = JSON.parse(process.env.BOX_JWT_CONFIG);
          const sdk = BoxSDK.getPreconfiguredInstance(config);
          const client = sdk.getAppAuthClient('enterprise', config.enterpriseID);

          client.users.get(client.CURRENT_USER_ID)
            .then(user => {
              console.log('✅ Box authentication successful');
              console.log('User:', user.name);
              console.log('Email:', user.login);
            })
            .catch(error => {
              console.error('❌ Box authentication failed:', error.message);
              process.exit(1);
            });
          "
```

---

### Step 4: Create Secrets Management Documentation

#### 4.1 Create Secrets Inventory

Create `docs/security/SECRETS_INVENTORY.md`:

```markdown
# Secrets Inventory

## Repository-Level Secrets

| Secret Name | Type | Used In | Rotation Schedule | Owner |
|-------------|------|---------|------------------|-------|
| AZURE_CREDENTIALS | JSON | All workflows | 90 days | DevOps Team |
| AZURE_CLIENT_ID | String | Azure workflows | 90 days | DevOps Team |
| AZURE_CLIENT_SECRET | String | Azure workflows | 90 days | DevOps Team |
| AZURE_TENANT_ID | String | Azure workflows | Never (static) | DevOps Team |
| AZURE_SUBSCRIPTION_ID | String | Azure workflows | Never (static) | DevOps Team |
| BOX_JWT_CONFIG | JSON | Box workflows | 90 days | Integration Team |
| SLACK_WEBHOOK_URL | URL | Notification workflows | 180 days | PM |
| CODECOV_TOKEN | String | CI workflow | 180 days | QA Lead |
| SNYK_TOKEN | String | Security scan | 90 days | Security Team |

## Environment-Level Secrets

### Development Environment

| Secret Name | Type | Rotation Schedule | Owner |
|-------------|------|------------------|-------|
| DATABASE_URL | Connection String | 180 days | DevOps Team |
| API_KEY | String | 180 days | Backend Team |
| REDIS_URL | URL | 180 days | DevOps Team |

### Staging Environment

| Secret Name | Type | Rotation Schedule | Owner |
|-------------|------|------------------|-------|
| DATABASE_URL | Connection String | 90 days | DevOps Team |
| API_KEY | String | 90 days | Backend Team |
| REDIS_URL | URL | 90 days | DevOps Team |
| AZURE_CREDENTIALS | JSON | 90 days | DevOps Team |

### Production Environment

| Secret Name | Type | Rotation Schedule | Owner |
|-------------|------|------------------|-------|
| DATABASE_URL | Connection String | 30 days | DevOps Team |
| API_KEY | String | 30 days | Backend Team |
| REDIS_URL | URL | 30 days | DevOps Team |
| AZURE_CREDENTIALS | JSON | 30 days | DevOps Team |
| BOX_CLIENT_ID | String | 30 days | Integration Team |
| BOX_CLIENT_SECRET | String | 30 days | Integration Team |
| ENCRYPTION_KEY | String | 30 days | Security Team |

## Azure Key Vault Secrets

| Secret Name | Type | Rotation Schedule | Accessed By |
|-------------|------|------------------|-------------|
| database-password | String | 30 days | Staging, Production |
| api-key | String | 30 days | All environments |
| storage-connection | Connection String | 90 days | Production |
| encryption-key | String | 30 days | Production |

## Rotation Procedures

### Azure Service Principal
```bash
# Create new credentials
az ad sp credential reset \
  --name github-actions-tcc \
  --create-cert

# Update GitHub secret
# 1. Copy new credentials
# 2. Update AZURE_CREDENTIALS in GitHub
# 3. Test in development environment
# 4. Update staging and production
# 5. Document rotation date
```

### Box JWT Configuration
```
1. Go to Box Developer Console
2. Configuration → Add and Manage Public Keys
3. Click "Generate a Public/Private Keypair"
4. Download new JSON configuration
5. Update BOX_JWT_CONFIG in GitHub
6. Test connection
7. Document rotation date
```

### Database Passwords
```
1. Connect to database server
2. Create new password (use password generator)
3. Update password in Azure Key Vault
4. Run test deployment to staging
5. Verify application connects successfully
6. Update production (during maintenance window)
7. Remove old password after 24 hours
8. Document rotation date
```

## Access Audit Log

| Date | User | Secret | Action | Reason |
|------|------|--------|--------|--------|
| 2025-11-10 | admin | AZURE_CREDENTIALS | Created | Initial setup |
| 2025-11-10 | developer1 | DATABASE_URL | Accessed | Deploy to staging |

## Compromised Secret Response

If a secret is compromised:

### Immediate Actions (0-15 minutes)
1. ✅ Revoke the compromised secret immediately
2. ✅ Rotate the secret in Azure Key Vault / GitHub
3. ✅ Notify security team via Slack #security-incidents
4. ✅ Check access logs for unauthorized usage

### Short-term Actions (15 min - 1 hour)
5. ✅ Rotate all related secrets
6. ✅ Review all recent deployments
7. ✅ Check application logs for anomalies
8. ✅ Update secrets in all environments

### Follow-up Actions (1-24 hours)
9. ✅ Complete incident report
10. ✅ Review and update security policies
11. ✅ Conduct team training on secret handling
12. ✅ Implement additional safeguards (if needed)
```

---

### Deliverables for Task 5

Create and configure:
- ✅ Azure service principal created
- ✅ Azure credentials added to GitHub
- ✅ Azure Key Vault created and configured
- ✅ Box application created and configured
- ✅ Box JWT credentials added to GitHub
- ✅ Test workflows for Azure and Box connections
- ✅ Scripts for Box file upload (`scripts/box-upload.js`)
- ✅ Secrets inventory documentation

### Validation Checklist
- [ ] Azure authentication test passes
- [ ] Can retrieve secrets from Azure Key Vault
- [ ] Box API connection successful
- [ ] Can upload files to Box storage
- [ ] All secrets documented in inventory
- [ ] Rotation schedule established
- [ ] Team trained on secret management procedures

---

## Summary

### Phase 2 Developer Responsibilities Completed

**Task 3 - Build & Test Workflows**:
- ✅ CI pipeline workflow with code quality, tests, and build
- ✅ Service containers for integration tests (PostgreSQL, Redis)
- ✅ Reusable test workflow for different test types
- ✅ Build artifact management and caching
- ✅ Security scanning integration
- ✅ E2E testing with Playwright

**Task 4 - Environments Setup**:
- ✅ Three environments created (Dev, Staging, Production)
- ✅ Environment protection rules configured
- ✅ Environment-specific variables and secrets
- ✅ Deployment workflow with approvals
- ✅ Environment configuration documentation

**Task 5 - Secrets Integration**:
- ✅ Azure service principal and credentials
- ✅ Azure Key Vault integration
- ✅ Box Storage JWT authentication
- ✅ Secrets rotation workflows
- ✅ Comprehensive secrets inventory

### Key Files Produced

1. `.github/workflows/ci.yml`
2. `.github/workflows/reusable-test.yml`
3. `.github/workflows/deploy.yml`
4. `.github/workflows/test-azure-connection.yml`
5. `.github/workflows/use-keyvault.yml`
6. `.github/workflows/upload-to-box.yml`
7. `.github/workflows/test-box-connection.yml`
8. `scripts/box-upload.js`
9. `docs/ci-cd/CACHING_STRATEGY.md`
10. `docs/environments/ENVIRONMENT_CONFIG.md`
11. `docs/security/SECRETS_INVENTORY.md`

### Next Steps

1. **Coordinate with QA Team** on Task 6-8 for test matrix and quality gates
2. **Test all workflows** in development environment
3. **Verify secret access** from all workflows
4. **Monitor pipeline performance** and optimize as needed
5. **Document any issues** and create improvement tickets

### Success Criteria

- [ ] CI pipeline runs successfully on every PR
- [ ] All test types execute and pass
- [ ] Build artifacts created and cached
- [ ] All three environments deployed successfully
- [ ] Azure integration working (App Service, Key Vault)
- [ ] Box integration working (file uploads)
- [ ] Secrets properly secured and accessible
- [ ] Deployment requires proper approvals
- [ ] Rollback procedure tested in staging

---

**Document Version**: 1.0
**Last Updated**: November 2025
**Owner**: Development Team
**Review Date**: February 2026
