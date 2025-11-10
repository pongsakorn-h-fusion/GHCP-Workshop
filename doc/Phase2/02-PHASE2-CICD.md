# Phase 2: CI/CD, Environments & Secrets

## General Information

**Duration**: November 17-21, 2025 (5 days)
**Hands-On Workshop**: November 17-21, 2025
**Prerequisites**: Phase 1 completed

## Objectives

Build a robust and secure CI/CD pipeline, properly manage environments (Dev/Staging/Production) and secrets, including setting up quality gates.

## Tasks to be Executed

### 🎯 Define CI/CD Policy and Manage Secrets/Environments
**Owner**: PM
**Feature**: General Copilot Usage

#### Details
- Plan deployment process
- Define secrets management policy
- Design environment promotion flow

#### Preparation
- [ ] Define deployment strategy (Blue-Green, Canary, Rolling)
- [ ] Plan approval process for each environment
- [ ] Define secrets management policy
- [ ] Design rollback strategy

#### CI/CD Policy Elements

**1. Build Policy**
- Must build successfully before merge
- Run automated tests
- Code quality checks passed
- No critical vulnerabilities

**2. Deployment Policy**
- Automated deployment to Dev
- Manual approval for Staging
- Multi-level approval for Production
- Rollback plan required

**3. Secrets Management Policy**
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Audit secrets access

**4. Environment Promotion Flow**
```
[Dev] → Auto Deploy
   ↓
[Staging] → Manual Approval (Tech Lead)
   ↓
[Production] → Multi Approval (Tech Lead + PM)
```

#### Deliverables
- CI/CD policy document
- Deployment workflow diagram
- Secrets management guidelines
- Approval matrix

---

### 📊 Monitor Build & Test Pipeline Progress
**Owner**: PM
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Review pipeline configuration
- Monitor metrics and success rate
- Resolve issues that occur

#### Preparation
- [ ] Define KPIs for pipeline
- [ ] Set up monitoring and alerting
- [ ] Prepare dashboard for tracking metrics
- [ ] Plan for review and improvement

#### Key Metrics to Track

**Build Metrics**
- Build success rate
- Build duration (target: < 10 minutes)
- Build frequency per day
- Failed build reasons

**Test Metrics**
- Test pass rate (target: > 95%)
- Test coverage (target: > 80%)
- Test execution time
- Flaky test count

**Deployment Metrics**
- Deployment frequency
- Deployment success rate
- Time to deploy
- Rollback frequency

#### Dashboard Components
- Pipeline status overview
- Recent build history
- Test results trends
- Deployment timeline
- Failure analysis

#### Deliverables
- Metrics dashboard
- Weekly progress reports
- Issue tracking for pipeline problems
- Improvement recommendations

---

### ⚙️ Develop Build & Test Workflows in GitHub Actions
**Owner**: Developer
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Create workflows for build and test
- Use Copilot to help write YAML configuration
- Set up automated testing

#### Preparation
- [ ] Study GitHub Actions syntax
- [ ] Prepare build scripts
- [ ] Set up test framework
- [ ] Plan workflow structure

#### Basic CI Workflow Structure

```yaml
name: CI Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build application
      run: npm run build

    - name: Upload artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: dist/
```

#### Advanced Workflow Features

**1. Matrix Strategy**
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

**2. Caching**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**3. Conditional Steps**
```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging
```

**4. Reusable Workflows**
```yaml
jobs:
  call-workflow:
    uses: ./.github/workflows/reusable-workflow.yml
    with:
      environment: staging
```

#### Test Workflow Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run unit tests
      run: npm run test:unit
    - name: Upload coverage
      uses: codecov/codecov-action@v4

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
    steps:
    - uses: actions/checkout@v4
    - name: Run integration tests
      run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run E2E tests
      run: npm run test:e2e
```

#### Deliverables
- `.github/workflows/ci.yml`
- `.github/workflows/test.yml`
- Workflow documentation
- Troubleshooting guide

---

### 🌍 Set Up Environments (Dev/Staging/Prod)
**Owner**: Developer
**Feature**: General Copilot Usage

#### Details
- Create environments in GitHub
- Define approval process
- Set up environment-specific variables

#### Preparation
- [ ] Define list of required environments
- [ ] Plan approval workflow
- [ ] Collect environment-specific configurations
- [ ] Set up protection rules

#### Environment Setup in GitHub

**1. Create Environments**
- Navigate to: Repository → Settings → Environments
- Create: development, staging, production

**2. Protection Rules**

**Development**
- No approvals required
- Auto-deploy on push to develop branch
- Wait timer: 0 minutes

**Staging**
- 1 reviewer required
- Allowed reviewers: Tech Leads
- Wait timer: 5 minutes
- Restrict to specific branches: develop

**Production**
- 2 reviewers required
- Allowed reviewers: Tech Leads + PM
- Wait timer: 30 minutes
- Restrict to specific branches: main
- Deployment schedule: Business hours only

#### Environment Variables

**Development**
```yaml
API_URL: https://api-dev.example.com
DEBUG_MODE: true
LOG_LEVEL: debug
DATABASE_NAME: myapp_dev
```

**Staging**
```yaml
API_URL: https://api-staging.example.com
DEBUG_MODE: false
LOG_LEVEL: info
DATABASE_NAME: myapp_staging
```

**Production**
```yaml
API_URL: https://api.example.com
DEBUG_MODE: false
LOG_LEVEL: error
DATABASE_NAME: myapp_prod
```

#### Deployment Workflow with Environments

```yaml
name: Deploy

on:
  push:
    branches: [ develop, main ]

jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: development
    steps:
    - name: Deploy to Dev
      run: |
        echo "Deploying to ${{ vars.API_URL }}"
        # Deploy commands

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: deploy-dev
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - name: Deploy to Staging
      run: |
        echo "Deploying to ${{ vars.API_URL }}"
        # Deploy commands

  deploy-prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Deploy to Production
      run: |
        echo "Deploying to ${{ vars.API_URL }}"
        # Deploy commands
```

#### Deliverables
- Environments configured in GitHub
- Environment-specific variables set
- Deployment workflow with environment gates
- Environment access documentation

---

### 🔐 Connect Secrets for Deployment
**Owner**: Developer
**Feature**: General Copilot Usage

#### Details
- Connect to Azure, Box Storage, Key Vault
- Set up secrets in GitHub
- Test access to external services

#### Preparation
- [ ] Collect necessary credentials
- [ ] Study how to connect to each service
- [ ] Plan secrets organization
- [ ] Define policy for rotating secrets

#### Types of Secrets

**1. GitHub Secrets (Repository Level)**
- Database credentials
- API keys
- Service account tokens

**2. GitHub Secrets (Organization Level)**
- Shared credentials
- Enterprise service accounts
- Common API keys

**3. Environment Secrets**
- Environment-specific credentials
- Protected by environment rules

#### Azure Integration

```yaml
- name: Azure Login
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- name: Deploy to Azure App Service
  uses: azure/webapps-deploy@v2
  with:
    app-name: ${{ secrets.AZURE_APP_NAME }}
    publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
```

**Required Azure Secrets:**
- `AZURE_CREDENTIALS`: Service principal credentials
- `AZURE_APP_NAME`: App service name
- `AZURE_PUBLISH_PROFILE`: Publish profile

#### Azure Key Vault Integration

```yaml
- name: Get secrets from Key Vault
  uses: Azure/get-keyvault-secrets@v1
  with:
    keyvault: ${{ secrets.AZURE_KEYVAULT_NAME }}
    secrets: 'database-password, api-key, storage-connection'
  id: keyvault

- name: Use secret
  run: |
    echo "Database password retrieved"
  env:
    DB_PASSWORD: ${{ steps.keyvault.outputs.database-password }}
```

#### Box Storage Integration

```yaml
- name: Upload to Box
  env:
    BOX_CLIENT_ID: ${{ secrets.BOX_CLIENT_ID }}
    BOX_CLIENT_SECRET: ${{ secrets.BOX_CLIENT_SECRET }}
    BOX_ACCESS_TOKEN: ${{ secrets.BOX_ACCESS_TOKEN }}
  run: |
    # Upload files to Box
    npm run upload-to-box
```

#### Secrets Management Best Practices

1. **Never hardcode secrets**
   ```yaml
   # ❌ Bad
   - run: echo "password123"

   # ✅ Good
   - run: echo ${{ secrets.PASSWORD }}
   ```

2. **Use environment secrets for environment-specific data**
   ```yaml
   environment: production
   # Secrets are scoped to this environment
   ```

3. **Mask secrets in logs**
   ```yaml
   - name: Add mask
     run: echo "::add-mask::${{ secrets.SECRET_VALUE }}"
   ```

4. **Rotate secrets regularly**
   - Set expiration dates
   - Document rotation procedures
   - Automate where possible

#### Testing External Services Connection

```yaml
name: Test Service Connections

on: workflow_dispatch

jobs:
  test-azure:
    runs-on: ubuntu-latest
    steps:
    - name: Test Azure Connection
      run: |
        az login --service-principal \
          -u ${{ secrets.AZURE_CLIENT_ID }} \
          -p ${{ secrets.AZURE_CLIENT_SECRET }} \
          --tenant ${{ secrets.AZURE_TENANT_ID }}
        az account show

  test-keyvault:
    runs-on: ubuntu-latest
    steps:
    - name: Test Key Vault Access
      run: |
        az keyvault secret list \
          --vault-name ${{ secrets.AZURE_KEYVAULT_NAME }}

  test-box:
    runs-on: ubuntu-latest
    steps:
    - name: Test Box API
      run: |
        curl -X GET https://api.box.com/2.0/users/me \
          -H "Authorization: Bearer ${{ secrets.BOX_ACCESS_TOKEN }}"
```

#### Deliverables
- All required secrets configured
- External services connected
- Connection test workflow
- Secrets rotation schedule
- Secrets documentation (without actual values)

---

### ✅ Design Test Matrix and Quality Check Jobs
**Owner**: QA
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Create test matrix for multiple environments
- Add quality gates in pipeline
- Use Copilot to help generate test cases

#### Preparation
- [ ] Define test dimensions (OS, browser, version)
- [ ] Design quality gates criteria
- [ ] Prepare test scenarios
- [ ] Plan parallel testing

#### Test Matrix Strategy

```yaml
name: Test Matrix

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20, 22]
        browser: [chrome, firefox, safari]
        exclude:
          - os: windows-latest
            browser: safari
          - os: ubuntu-latest
            browser: safari
      fail-fast: false

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}

    - name: Run tests on ${{ matrix.browser }}
      run: npm run test:${{ matrix.browser }}
```

#### Quality Gates

**1. Code Quality Gate**
```yaml
  code-quality:
    runs-on: ubuntu-latest
    steps:
    - name: Run linter
      run: npm run lint

    - name: Check code formatting
      run: npm run format:check

    - name: SonarQube Scan
      uses: sonarsource/sonarqube-scan-action@master

    - name: Quality Gate
      run: |
        QUALITY_GATE=$(curl -s "$SONAR_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY")
        STATUS=$(echo $QUALITY_GATE | jq -r '.projectStatus.status')
        if [ "$STATUS" != "OK" ]; then
          echo "Quality gate failed"
          exit 1
        fi
```

**2. Test Coverage Gate**
```yaml
  coverage-check:
    runs-on: ubuntu-latest
    steps:
    - name: Run tests with coverage
      run: npm run test:coverage

    - name: Check coverage threshold
      run: |
        COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
        THRESHOLD=80
        if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
          echo "Coverage $COVERAGE% is below threshold $THRESHOLD%"
          exit 1
        fi
```

**3. Security Gate**
```yaml
  security-check:
    runs-on: ubuntu-latest
    steps:
    - name: Run security audit
      run: npm audit --audit-level=moderate

    - name: Check for vulnerabilities
      run: |
        VULN_COUNT=$(npm audit --json | jq '.metadata.vulnerabilities.high + .metadata.vulnerabilities.critical')
        if [ "$VULN_COUNT" -gt 0 ]; then
          echo "Found $VULN_COUNT high/critical vulnerabilities"
          exit 1
        fi
```

**4. Performance Gate**
```yaml
  performance-check:
    runs-on: ubuntu-latest
    steps:
    - name: Run performance tests
      run: npm run test:performance

    - name: Check performance metrics
      run: |
        LOAD_TIME=$(cat performance-report.json | jq '.metrics.loadTime')
        THRESHOLD=3000
        if [ "$LOAD_TIME" -gt "$THRESHOLD" ]; then
          echo "Load time ${LOAD_TIME}ms exceeds threshold ${THRESHOLD}ms"
          exit 1
        fi
```

#### Comprehensive Quality Pipeline

```yaml
name: Quality Pipeline

on: [push, pull_request]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    # Code Quality
    - name: Lint Check
      run: npm run lint
      continue-on-error: false

    # Unit Tests
    - name: Unit Tests
      run: npm run test:unit
      continue-on-error: false

    # Integration Tests
    - name: Integration Tests
      run: npm run test:integration
      continue-on-error: false

    # Code Coverage
    - name: Coverage Check
      run: npm run test:coverage
      continue-on-error: false

    # Security Scan
    - name: Security Audit
      run: npm audit
      continue-on-error: false

    # All gates must pass
    - name: Quality Gate Summary
      if: success()
      run: echo "✅ All quality gates passed!"

    - name: Quality Gate Failed
      if: failure()
      run: |
        echo "❌ Quality gates failed"
        exit 1
```

#### Deliverables
- Test matrix configuration
- Quality gates implementation
- Test execution workflows
- Quality metrics dashboard
- Gate failure notifications

---

### 📈 Connect Test/Report Results to CI
**Owner**: QA
**Feature**: GitHub Repositories

#### Details
- Set up test reporting
- Integrate test results into GitHub
- Create dashboard for tracking test results

#### Preparation
- [ ] Choose test reporting tools
- [ ] Study GitHub Actions reporting features
- [ ] Design report format
- [ ] Plan result storage

#### Test Reporting with GitHub Actions

**1. JUnit Report**
```yaml
- name: Run tests
  run: npm test -- --reporter=junit --reporter-option=output=test-results.xml

- name: Publish Test Results
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Test Results
    path: test-results.xml
    reporter: java-junit
```

**2. Coverage Report**
```yaml
- name: Generate coverage report
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    file: ./coverage/coverage-final.json
    flags: unittests
    name: codecov-umbrella

- name: Comment coverage on PR
  uses: romeovs/lcov-reporter-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    lcov-file: ./coverage/lcov.info
```

**3. Test Summary**
```yaml
- name: Test Summary
  uses: test-summary/action@v2
  with:
    paths: "test-results/**/*.xml"
  if: always()
```

**4. Custom Test Report**
```yaml
- name: Generate custom report
  run: node scripts/generate-test-report.js

- name: Upload report as artifact
  uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: reports/test-report.html

- name: Deploy report to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./reports
```

#### Test Results Dashboard

**Using GitHub Actions Dashboard**
- View test results in Actions tab
- Check individual job logs
- Download test artifacts

**Using GitHub Pages for Reports**
```yaml
name: Deploy Test Reports

on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]

jobs:
  deploy-reports:
    runs-on: ubuntu-latest
    steps:
    - name: Download reports
      uses: actions/download-artifact@v4
      with:
        name: test-report

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

#### Notification Integration

**Slack Notification**
```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Test failed in ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Tests failed on branch `${{ github.ref }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Results>"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Email Notification**
```yaml
- name: Send email on test failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Test Failure - ${{ github.repository }}
    body: Tests failed in workflow ${{ github.workflow }}
    to: team@example.com
```

#### Deliverables
- Test reporting workflows
- Coverage reports integration
- Test results dashboard
- Notification system
- Historical test data

---

### 🚪 Add Quality Gates Before Promoting to Production
**Owner**: QA
**Feature**: General Copilot Usage

#### Details
- Define criteria for passing quality gates
- Set up automated checks
- Create approval process

#### Preparation
- [ ] Define quality criteria
- [ ] Design gate workflow
- [ ] Prepare checklist for manual review
- [ ] Plan escalation process

#### Production Readiness Checklist

**Automated Checks (Must Pass)**
- [ ] All tests passed (unit, integration, E2E)
- [ ] Code coverage ≥ 80%
- [ ] No high/critical vulnerabilities
- [ ] Performance benchmarks met
- [ ] Code quality score ≥ A
- [ ] All linting rules passed
- [ ] Documentation updated

**Manual Checks (Review Required)**
- [ ] Code review completed (2+ approvals)
- [ ] QA sign-off received
- [ ] Security review completed
- [ ] Performance testing completed
- [ ] Database migrations reviewed
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

**Business Checks**
- [ ] Product owner approval
- [ ] Stakeholder notification sent
- [ ] Release notes prepared
- [ ] Support team notified

#### Pre-Production Gate Workflow

```yaml
name: Production Gate

on:
  pull_request:
    branches: [ main ]

jobs:
  automated-checks:
    runs-on: ubuntu-latest
    steps:
    - name: Run all automated checks
      run: |
        npm run lint
        npm run test:all
        npm run security:scan
        npm run performance:test

    - name: Check quality metrics
      run: node scripts/check-quality-gates.js

  manual-approvals:
    needs: automated-checks
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Wait for approvals
      run: echo "Waiting for required approvals..."

    - name: Verify checklist
      run: |
        # Check if all checklist items are completed
        node scripts/verify-prod-checklist.js

  deploy-to-production:
    needs: manual-approvals
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Deploy
      run: npm run deploy:production

    - name: Verify deployment
      run: npm run verify:production

    - name: Notify stakeholders
      run: node scripts/notify-deployment.js
```

#### Quality Gates Script Example

```javascript
// scripts/check-quality-gates.js
const fs = require('fs');

const gates = [
  {
    name: 'Code Coverage',
    check: () => {
      const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
      return coverage.total.lines.pct >= 80;
    },
    threshold: '80%'
  },
  {
    name: 'Test Pass Rate',
    check: () => {
      const results = JSON.parse(fs.readFileSync('test-results.json'));
      return results.passRate >= 95;
    },
    threshold: '95%'
  },
  {
    name: 'Performance',
    check: () => {
      const perf = JSON.parse(fs.readFileSync('performance-results.json'));
      return perf.loadTime <= 3000;
    },
    threshold: '< 3000ms'
  }
];

let allPassed = true;
gates.forEach(gate => {
  const passed = gate.check();
  console.log(`${passed ? '✅' : '❌'} ${gate.name}: ${gate.threshold}`);
  if (!passed) allPassed = false;
});

if (!allPassed) {
  console.error('Quality gates failed!');
  process.exit(1);
}

console.log('✅ All quality gates passed!');
```

#### Deliverables
- Quality gates configuration
- Automated check scripts
- Manual review checklist
- Approval workflow
- Gate monitoring dashboard

---

## Hands-On Workshop (November 17-21, 2025)

### Objectives
Enable team members to practice building CI/CD pipelines, managing environments and secrets.

### Schedule (Example)

#### Day 1: GitHub Actions Basics
- Morning: Introduction to GitHub Actions
- Afternoon: Creating first workflow

#### Day 2: CI Pipeline
- Morning: Build and test workflows
- Afternoon: Quality checks and gates

#### Day 3: Environments & Deployment
- Morning: Environment setup and protection rules
- Afternoon: Deployment workflows

#### Day 4: Secrets & External Services
- Morning: Secrets management
- Afternoon: Azure/Box integration

#### Day 5: Testing & Quality
- Morning: Test automation and reporting
- Afternoon: End-to-end pipeline test

### Workshop Activities

#### Activity 1: Create Basic CI Workflow
- Create workflow file
- Add build and test steps
- Test and debug

#### Activity 2: Setup Environments
- Create Dev/Staging/Prod environments
- Configure protection rules
- Setup approval workflows

#### Activity 3: Configure Secrets
- Add repository secrets
- Configure environment secrets
- Test secret access

#### Activity 4: Implement Quality Gates
- Add linting checks
- Add test coverage checks
- Add security scans

#### Activity 5: Deploy Application
- Deploy to Dev (automated)
- Deploy to Staging (with approval)
- Deploy to Production (with gates)

---

## Preparation Before Workshop

### For Everyone
- [ ] GitHub repository with code
- [ ] Understanding of YAML syntax
- [ ] Basic knowledge of CI/CD concepts

### For PM
- [ ] Approval workflow designed
- [ ] Quality criteria defined
- [ ] Stakeholder list prepared

### For Developer
- [ ] Application buildable locally
- [ ] Test suite ready
- [ ] External service credentials available
  - Azure credentials
  - Box API credentials
  - Key Vault access

### For QA
- [ ] Test scenarios documented
- [ ] Quality metrics defined
- [ ] Test data prepared

---

## Success Criteria

- [ ] CI/CD pipeline running successfully
- [ ] Automated builds on every push
- [ ] Tests running automatically
- [ ] Environments configured with proper protection
- [ ] Secrets managed securely
- [ ] External services integrated
- [ ] Quality gates enforcing standards
- [ ] Test results visible and tracked
- [ ] Deployment to all environments working
- [ ] Team members comfortable with workflows

---

## Common Issues & Troubleshooting

### Issue: Workflow not triggering
**Solution**: Check trigger conditions and branch names

### Issue: Permission denied in workflow
**Solution**: Check GITHUB_TOKEN permissions in workflow

### Issue: Secrets not accessible
**Solution**: Check secret names and environment configuration

### Issue: Tests failing in CI but passing locally
**Solution**: Check environment variables and dependencies

### Issue: Deployment failing
**Solution**: Check credentials and deployment scripts

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments)
- [Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## Next Phase

**[← Phase 1: Foundation Setup](./01-PHASE1-FOUNDATION.md)** | **[Phase 3: Security & Branch Protection →](./03-PHASE3-SECURITY.md)**

---

**Phase Owner**: Pongsakorn H.
**Last Updated**: November 2025
**Version**: 1.0
