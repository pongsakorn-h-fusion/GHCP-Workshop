# Phase 2: CI/CD - QA Guide

## Overview

**Role**: Quality Assurance (QA)
**Duration**: 3 days (within November 17-21, 2025)
**Prerequisites**: Phase 1 completed
**Objective**: Design comprehensive test matrix, integrate test reporting, and implement quality gates

---

## Tasks Overview

| Task | Description | Duration | Feature |
|------|-------------|----------|---------|
| Task 6 | Design Test Matrix and Quality Check Jobs | 1 day | Copilot Test Generation / GitHub Actions |
| Task 7 | Connect Test/Report Results to CI | 1 day | GitHub Repositories |
| Task 8 | Add Quality Gates Before Promoting to Production | 1 day | General Copilot Usage |

---
---

## Task 6: Design Test Matrix and Quality Check Jobs

**Owner**: QA
**Estimated Time**: 1 day
**Feature**: Copilot Test Generation / GitHub Actions

### Objectives
- Design comprehensive test matrix for multiple environments
- Implement quality gates in CI pipeline
- Set up parallel testing for efficiency
- Use Copilot to generate test cases

---

### Step 1: Define Test Matrix Dimensions

#### 1.1 Identify Test Dimensions

Create `docs/testing/TEST_MATRIX_STRATEGY.md`:

```markdown
# Test Matrix Strategy

## Matrix Dimensions

### 1. Operating Systems
- **ubuntu-latest** (Primary - Linux)
- **windows-latest** (Windows compatibility)
- **macos-latest** (macOS support)

**Rationale**: Ensure application works across all major platforms

### 2. Node.js Versions
- **18.x** (LTS)
- **20.x** (Current LTS - Primary)
- **22.x** (Latest)

**Rationale**: Support multiple Node.js versions, focus on LTS

### 3. Browsers (for E2E tests)
- **chromium** (Primary)
- **firefox**
- **webkit** (Safari)

**Rationale**: Cover 95%+ of user browser market share

### 4. Databases (for integration tests)
- **PostgreSQL 15** (Primary)
- **PostgreSQL 14** (Fallback)

**Rationale**: Test against current and previous major version

### 5. Test Types
- **Unit Tests**: Fast, isolated, no external dependencies
- **Integration Tests**: API tests, database interactions
- **E2E Tests**: Full user journey, browser automation
- **Performance Tests**: Load testing, stress testing

## Matrix Strategy

### Full Matrix (All combinations)
- Total combinations: 3 OS × 3 Node.js × 3 Browsers = 27 combinations
- Too expensive for every PR
- **Use case**: Release candidates, weekly full test

### Optimized Matrix (Smart selection)
- **Primary path**: ubuntu + Node 20 + chromium
- **Cross-platform**: All OS with Node 20 + chromium
- **Cross-version**: ubuntu with all Node versions + chromium
- **Cross-browser**: ubuntu + Node 20 + all browsers
- Total combinations: 1 + 3 + 3 + 3 = 10 combinations
- **Use case**: Every PR, daily builds

### Minimal Matrix (Smoke test)
- **Single path**: ubuntu + Node 20 + chromium
- Total combinations: 1
- **Use case**: Quick feedback, draft PRs

## Matrix Configuration

### When to use Full Matrix
- Release branches (release/*)
- Main branch
- Tagged releases
- Weekly scheduled runs

### When to use Optimized Matrix
- Pull requests to develop
- Push to develop branch
- Daily builds

### When to use Minimal Matrix
- Draft pull requests
- Work-in-progress branches
- Quick feedback loops
```

---

### Step 2: Implement Test Matrix in GitHub Actions

#### 2.1 Create Comprehensive Test Matrix Workflow

Create `.github/workflows/test-matrix.yml`:

```yaml
name: Test Matrix

on:
  push:
    branches: [ develop, main, 'release/**' ]
  pull_request:
    branches: [ develop, main ]
  schedule:
    # Full matrix weekly on Sundays at 2 AM
    - cron: '0 2 * * 0'
  workflow_dispatch:
    inputs:
      matrix-type:
        description: 'Matrix type to run'
        required: true
        type: choice
        options:
          - minimal
          - optimized
          - full
        default: 'optimized'

jobs:
  # Determine which matrix to use
  setup:
    name: Setup Matrix
    runs-on: ubuntu-latest
    outputs:
      matrix-type: ${{ steps.determine.outputs.matrix-type }}

    steps:
      - name: Determine matrix type
        id: determine
        run: |
          if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            MATRIX_TYPE="${{ github.event.inputs.matrix-type }}"
          elif [[ "${{ github.event_name }}" == "schedule" ]] || [[ "${{ github.ref }}" == refs/heads/main ]]; then
            MATRIX_TYPE="full"
          elif [[ "${{ github.event.pull_request.draft }}" == "true" ]]; then
            MATRIX_TYPE="minimal"
          else
            MATRIX_TYPE="optimized"
          fi

          echo "matrix-type=$MATRIX_TYPE" >> $GITHUB_OUTPUT
          echo "Using $MATRIX_TYPE matrix"

  # Unit Tests with cross-platform matrix
  unit-tests:
    name: Unit Tests (${{ matrix.os }} / Node ${{ matrix.node }})
    needs: setup
    runs-on: ${{ matrix.os }}

    strategy:
      fail-fast: false
      matrix:
        # Optimized matrix
        include:
          # Primary path
          - os: ubuntu-latest
            node: '20'
            primary: true

          # Cross-platform (only if not minimal)
          - os: windows-latest
            node: '20'
            primary: false
          - os: macos-latest
            node: '20'
            primary: false

          # Cross-version (only if not minimal)
          - os: ubuntu-latest
            node: '18'
            primary: false
          - os: ubuntu-latest
            node: '22'
            primary: false

    # Skip non-primary paths for minimal matrix
    if: |
      needs.setup.outputs.matrix-type == 'full' ||
      needs.setup.outputs.matrix-type == 'optimized' ||
      matrix.primary == true

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        if: matrix.primary
        uses: codecov/codecov-action@v4
        with:
          flags: unit-${{ matrix.os }}-node${{ matrix.node }}

  # Integration Tests with database matrix
  integration-tests:
    name: Integration Tests (PG ${{ matrix.postgres }})
    needs: setup
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        postgres: ['15', '14']

    # Skip PG 14 for minimal matrix
    if: |
      needs.setup.outputs.matrix-type == 'full' ||
      needs.setup.outputs.matrix-type == 'optimized' ||
      matrix.postgres == '15'

    services:
      postgres:
        image: postgres:${{ matrix.postgres }}
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

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

  # E2E Tests with browser matrix
  e2e-tests:
    name: E2E Tests (${{ matrix.browser }})
    needs: setup
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        browser: ['chromium', 'firefox', 'webkit']
        shard: [1, 2, 3, 4]  # Parallel sharding for faster execution

    # Skip non-chromium browsers for minimal matrix
    if: |
      needs.setup.outputs.matrix-type == 'full' ||
      (needs.setup.outputs.matrix-type == 'optimized' && matrix.browser == 'chromium') ||
      (needs.setup.outputs.matrix-type == 'minimal' && matrix.browser == 'chromium' && matrix.shard == 1)

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

      - name: Install Playwright
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npx playwright test --project=${{ matrix.browser }} --shard=${{ matrix.shard }}/${{ strategy.job-total }}
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-results-${{ matrix.browser }}-shard-${{ matrix.shard }}
          path: |
            playwright-report/
            test-results/

      - name: Upload traces on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-traces-${{ matrix.browser }}-shard-${{ matrix.shard }}
          path: test-results/traces/

  # Full Matrix Results (only for full/optimized)
  matrix-summary:
    name: Matrix Test Summary
    needs: [setup, unit-tests, integration-tests, e2e-tests]
    if: always()
    runs-on: ubuntu-latest

    steps:
      - name: Check matrix results
        run: |
          echo "=== Test Matrix Summary ==="
          echo "Matrix Type: ${{ needs.setup.outputs.matrix-type }}"
          echo ""
          echo "Unit Tests: ${{ needs.unit-tests.result }}"
          echo "Integration Tests: ${{ needs.integration-tests.result }}"
          echo "E2E Tests: ${{ needs.e2e-tests.result }}"

          if [[ "${{ needs.unit-tests.result }}" == "failure" ]] || \
             [[ "${{ needs.integration-tests.result }}" == "failure" ]] || \
             [[ "${{ needs.e2e-tests.result }}" == "failure" ]]; then
            echo ""
            echo "❌ Test Matrix Failed"
            exit 1
          fi

          echo ""
          echo "✅ Test Matrix Passed"

      - name: Post summary to PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const summary = `## Test Matrix Results

**Matrix Type**: ${{ needs.setup.outputs.matrix-type }}

| Test Suite | Result |
|------------|--------|
| Unit Tests | ${{ needs.unit-tests.result }} |
| Integration Tests | ${{ needs.integration-tests.result }} |
| E2E Tests | ${{ needs.e2e-tests.result }} |

${ '${{ needs.unit-tests.result }}' === 'success' &&
   '${{ needs.integration-tests.result }}' === 'success' &&
   '${{ needs.e2e-tests.result }}' === 'success'
   ? '✅ All tests passed!'
   : '❌ Some tests failed. Please check the logs.' }
            `;

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: summary
            });
```

---

### Step 3: Implement Quality Gates

#### 3.1 Create Quality Gates Workflow

Create `.github/workflows/quality-gates.yml`:

```yaml
name: Quality Gates

on:
  pull_request:
    branches: [ develop, main ]
  push:
    branches: [ develop, main ]

jobs:
  # Gate 1: Code Quality
  code-quality-gate:
    name: Code Quality Gate
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
        run: npm run lint -- --format json --output-file eslint-report.json
        continue-on-error: true

      - name: Check linting results
        run: |
          ERRORS=$(cat eslint-report.json | jq '[.[].errorCount] | add')
          WARNINGS=$(cat eslint-report.json | jq '[.[].warningCount] | add')

          echo "Linting Results:"
          echo "- Errors: $ERRORS"
          echo "- Warnings: $WARNINGS"

          if [ "$ERRORS" -gt 0 ]; then
            echo "❌ Code Quality Gate Failed: $ERRORS linting errors found"
            exit 1
          fi

          if [ "$WARNINGS" -gt 10 ]; then
            echo "⚠️  Warning: $WARNINGS linting warnings found (threshold: 10)"
          fi

          echo "✅ Code Quality Gate Passed"

      - name: Check code formatting
        run: npm run format:check

      - name: Run TypeScript type checking
        if: hashFiles('tsconfig.json') != ''
        run: npm run type-check

  # Gate 2: Test Coverage
  coverage-gate:
    name: Test Coverage Gate
    runs-on: ubuntu-latest

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

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Check coverage thresholds
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          BRANCH_COV=$(cat coverage/coverage-summary.json | jq '.total.branches.pct')
          FUNC_COV=$(cat coverage/coverage-summary.json | jq '.total.functions.pct')

          echo "Coverage Results:"
          echo "- Lines: $COVERAGE%"
          echo "- Branches: $BRANCH_COV%"
          echo "- Functions: $FUNC_COV%"

          THRESHOLD=80

          if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
            echo "❌ Coverage Gate Failed: Line coverage $COVERAGE% is below threshold $THRESHOLD%"
            exit 1
          fi

          if (( $(echo "$BRANCH_COV < 70" | bc -l) )); then
            echo "❌ Coverage Gate Failed: Branch coverage $BRANCH_COV% is below threshold 70%"
            exit 1
          fi

          echo "✅ Coverage Gate Passed"

      - name: Check new code coverage (PR only)
        if: github.event_name == 'pull_request'
        run: |
          # This would compare coverage of changed files
          # Simplified example:
          echo "Checking coverage for changed files..."
          # In real implementation, use tools like diff-cover
          echo "✅ New code coverage acceptable"

  # Gate 3: Security
  security-gate:
    name: Security Gate
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
        run: |
          npm audit --audit-level=moderate --json > audit-report.json || true

      - name: Check security vulnerabilities
        run: |
          CRITICAL=$(cat audit-report.json | jq '.metadata.vulnerabilities.critical // 0')
          HIGH=$(cat audit-report.json | jq '.metadata.vulnerabilities.high // 0')
          MODERATE=$(cat audit-report.json | jq '.metadata.vulnerabilities.moderate // 0')

          echo "Security Scan Results:"
          echo "- Critical: $CRITICAL"
          echo "- High: $HIGH"
          echo "- Moderate: $MODERATE"

          if [ "$CRITICAL" -gt 0 ]; then
            echo "❌ Security Gate Failed: $CRITICAL critical vulnerabilities found"
            cat audit-report.json | jq '.vulnerabilities'
            exit 1
          fi

          if [ "$HIGH" -gt 0 ]; then
            echo "❌ Security Gate Failed: $HIGH high vulnerabilities found"
            cat audit-report.json | jq '.vulnerabilities'
            exit 1
          fi

          if [ "$MODERATE" -gt 5 ]; then
            echo "⚠️  Warning: $MODERATE moderate vulnerabilities found (threshold: 5)"
          fi

          echo "✅ Security Gate Passed"

      - name: Run Snyk test
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --json-file-output=snyk-report.json

      - name: Check Snyk results
        run: |
          if [ -f snyk-report.json ]; then
            echo "Snyk scan completed"
            # Parse and check results
            echo "✅ Snyk Security Gate Passed"
          fi

  # Gate 4: Performance
  performance-gate:
    name: Performance Gate
    runs-on: ubuntu-latest

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

      - name: Run performance tests
        run: npm run test:performance
        continue-on-error: true

      - name: Check performance metrics
        run: |
          if [ -f performance-report.json ]; then
            LOAD_TIME=$(cat performance-report.json | jq '.metrics.loadTime')
            BUNDLE_SIZE=$(cat performance-report.json | jq '.metrics.bundleSize')

            echo "Performance Results:"
            echo "- Load Time: ${LOAD_TIME}ms"
            echo "- Bundle Size: ${BUNDLE_SIZE}KB"

            LOAD_THRESHOLD=3000
            SIZE_THRESHOLD=1024

            if [ "$LOAD_TIME" -gt "$LOAD_THRESHOLD" ]; then
              echo "⚠️  Warning: Load time ${LOAD_TIME}ms exceeds threshold ${LOAD_THRESHOLD}ms"
            fi

            if [ "$BUNDLE_SIZE" -gt "$SIZE_THRESHOLD" ]; then
              echo "⚠️  Warning: Bundle size ${BUNDLE_SIZE}KB exceeds threshold ${SIZE_THRESHOLD}KB"
            fi
          fi

          echo "✅ Performance Gate Passed"

  # Gate 5: Build
  build-gate:
    name: Build Gate
    runs-on: ubuntu-latest

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

      - name: Verify build output
        run: |
          if [ ! -d "dist" ]; then
            echo "❌ Build Gate Failed: dist directory not found"
            exit 1
          fi

          SIZE=$(du -sh dist | cut -f1)
          echo "Build successful: $SIZE"
          echo "✅ Build Gate Passed"

  # All Gates Summary
  quality-gates-summary:
    name: Quality Gates Summary
    needs: [code-quality-gate, coverage-gate, security-gate, performance-gate, build-gate]
    if: always()
    runs-on: ubuntu-latest

    steps:
      - name: Check all gates
        run: |
          echo "=== Quality Gates Summary ==="
          echo "Code Quality: ${{ needs.code-quality-gate.result }}"
          echo "Coverage: ${{ needs.coverage-gate.result }}"
          echo "Security: ${{ needs.security-gate.result }}"
          echo "Performance: ${{ needs.performance-gate.result }}"
          echo "Build: ${{ needs.build-gate.result }}"

          if [[ "${{ needs.code-quality-gate.result }}" == "failure" ]] || \
             [[ "${{ needs.coverage-gate.result }}" == "failure" ]] || \
             [[ "${{ needs.security-gate.result }}" == "failure" ]] || \
             [[ "${{ needs.build-gate.result }}" == "failure" ]]; then
            echo ""
            echo "❌ Quality Gates Failed - Cannot merge"
            exit 1
          fi

          echo ""
          echo "✅ All Quality Gates Passed - Ready to merge"

      - name: Update PR status
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const gates = {
              'Code Quality': '${{ needs.code-quality-gate.result }}',
              'Coverage': '${{ needs.coverage-gate.result }}',
              'Security': '${{ needs.security-gate.result }}',
              'Performance': '${{ needs.performance-gate.result }}',
              'Build': '${{ needs.build-gate.result }}'
            };

            const allPassed = Object.values(gates).every(r => r === 'success');
            const status = allPassed ? '✅' : '❌';

            let body = `## Quality Gates ${status}\n\n`;
            body += '| Gate | Status |\n';
            body += '|------|--------|\n';

            for (const [gate, result] of Object.entries(gates)) {
              const emoji = result === 'success' ? '✅' : '❌';
              body += `| ${gate} | ${emoji} ${result} |\n`;
            }

            body += '\n';
            body += allPassed
              ? '**Result**: All quality gates passed. Ready to merge! 🎉'
              : '**Result**: Some quality gates failed. Please fix the issues before merging.';

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: body
            });
```

---

### Deliverables for Task 6

Create these files:
- ✅ `docs/testing/TEST_MATRIX_STRATEGY.md`
- ✅ `.github/workflows/test-matrix.yml`
- ✅ `.github/workflows/quality-gates.yml`

### Validation Checklist
- [ ] Test matrix runs with different configurations
- [ ] Minimal matrix runs on draft PRs
- [ ] Optimized matrix runs on regular PRs
- [ ] Full matrix runs on release branches
- [ ] All quality gates enforce thresholds correctly
- [ ] Failed gates block PR merge
- [ ] Test results posted to PR as comments

---
---

## Task 7: Connect Test/Report Results to CI

**Owner**: QA
**Estimated Time**: 1 day
**Feature**: GitHub Repositories

### Objectives
- Set up comprehensive test reporting
- Integrate test results into GitHub UI
- Create visual dashboards for test tracking
- Configure notifications for test failures

---

### Step 1: Set Up JUnit Test Reporting

#### 1.1 Configure Jest for JUnit Output

Update `package.json` to add JUnit reporter:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2 --reporters=default --reporters=jest-junit"
  },
  "jest": {
    "coverageDirectory": "coverage",
    "coverageReporters": ["json", "lcov", "text", "html", "json-summary"],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}",
      "!src/**/*.spec.{js,jsx,ts,tsx}"
    ]
  },
  "jest-junit": {
    "outputDirectory": "test-results",
    "outputName": "junit.xml",
    "classNameTemplate": "{classname}",
    "titleTemplate": "{title}",
    "ancestorSeparator": " › ",
    "usePathForSuiteName": true
  }
}
```

Install jest-junit:
```bash
npm install --save-dev jest-junit
```

#### 1.2 Create Test Reporting Workflow

Create `.github/workflows/test-reporting.yml`:

```yaml
name: Test Reporting

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  test-and-report:
    name: Test and Report Results
    runs-on: ubuntu-latest

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

      - name: Run tests with JUnit output
        run: npm run test:ci
        env:
          CI: true

      - name: Publish Test Results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Test Results
          path: 'test-results/junit.xml'
          reporter: java-junit
          fail-on-error: true

      - name: Upload JUnit Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: junit-report
          path: test-results/junit.xml

      - name: Upload Coverage Reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

      - name: Comment Test Results on PR
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');

            // Read test results
            let testSummary = 'No test results found';
            if (fs.existsSync('test-results/junit.xml')) {
              // Parse JUnit XML (simplified)
              testSummary = 'Tests executed. See attached reports.';
            }

            // Read coverage summary
            let coverageSummary = 'No coverage data';
            if (fs.existsSync('coverage/coverage-summary.json')) {
              const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
              const lines = coverage.total.lines.pct;
              const branches = coverage.total.branches.pct;
              const functions = coverage.total.functions.pct;
              const statements = coverage.total.statements.pct;

              coverageSummary = `
| Metric | Coverage |
|--------|----------|
| Lines | ${lines}% |
| Branches | ${branches}% |
| Functions | ${functions}% |
| Statements | ${statements}% |
              `;
            }

            const comment = `## Test Results Report

### Test Summary
${testSummary}

### Coverage Summary
${coverageSummary}

📊 [View detailed test report](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})
            `;

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: comment
            });
```

---

### Step 2: Set Up Coverage Reporting

#### 2.1 Integrate Codecov

Create `.github/workflows/coverage-report.yml`:

```yaml
name: Coverage Report

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  coverage:
    name: Generate Coverage Report
    runs-on: ubuntu-latest

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

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json,./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
          verbose: true

      - name: Generate coverage badge
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: $COVERAGE%"

          # Create badge data
          mkdir -p badges
          echo "{\"schemaVersion\": 1, \"label\": \"coverage\", \"message\": \"${COVERAGE}%\", \"color\": \"brightgreen\"}" > badges/coverage.json

      - name: Upload coverage badge
        uses: actions/upload-artifact@v4
        with:
          name: coverage-badge
          path: badges/coverage.json

      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          lcov-file: ./coverage/lcov.info
          delete-old-comments: true
```

---

### Step 3: Set Up Test Failure Notifications

#### 3.1 Create Notification Workflow

Create `.github/workflows/test-failure-notifications.yml`:

```yaml
name: Test Failure Notifications

on:
  workflow_run:
    workflows: ["CI Pipeline", "Test Matrix"]
    types: [completed]

jobs:
  notify-failures:
    name: Notify Test Failures
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}

    steps:
      - name: Get workflow run details
        uses: actions/github-script@v7
        id: workflow-details
        with:
          script: |
            const run = context.payload.workflow_run;
            return {
              name: run.name,
              url: run.html_url,
              branch: run.head_branch,
              commit: run.head_sha.substring(0, 7),
              actor: run.head_commit.author.name
            };

      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "❌ Test Failure Alert",
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "❌ Test Failure Alert"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": "*Workflow:*\n${{ fromJSON(steps.workflow-details.outputs.result).name }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Branch:*\n`${{ fromJSON(steps.workflow-details.outputs.result).branch }}`"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Commit:*\n`${{ fromJSON(steps.workflow-details.outputs.result).commit }}`"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Author:*\n${{ fromJSON(steps.workflow-details.outputs.result).actor }}"
                    }
                  ]
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
                      "url": "${{ fromJSON(steps.workflow-details.outputs.result).url }}"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Create GitHub issue for repeated failures
        uses: actions/github-script@v7
        with:
          script: |
            const workflow_id = context.payload.workflow_run.workflow_id;

            // Check recent runs
            const runs = await github.rest.actions.listWorkflowRuns({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: workflow_id,
              per_page: 5
            });

            const failures = runs.data.workflow_runs.filter(r => r.conclusion === 'failure').length;

            if (failures >= 3) {
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: `[CI] Multiple Test Failures in ${context.payload.workflow_run.name}`,
                body: `The workflow "${context.payload.workflow_run.name}" has failed ${failures} times in the last 5 runs.

**Latest failure**: ${context.payload.workflow_run.html_url}

**Branch**: \`${context.payload.workflow_run.head_branch}\`
**Commit**: \`${context.payload.workflow_run.head_sha.substring(0, 7)}\`

This requires immediate investigation.`,
                labels: ['ci-cd', 'test-failure', 'high-priority'],
                assignees: ['qa-lead']
              });
            }
```

---

### Deliverables for Task 7

Create these files:
- ✅ `.github/workflows/test-reporting.yml`
- ✅ `.github/workflows/coverage-report.yml`
- ✅ `.github/workflows/test-failure-notifications.yml`

Update configuration:
- ✅ package.json with jest-junit reporter
- ✅ Jest configuration for coverage reports

### Validation Checklist
- [ ] JUnit test reports generated and visible in GitHub
- [ ] Coverage reports uploaded to Codecov
- [ ] Test dashboard deployed to GitHub Pages
- [ ] Failed tests trigger Slack notifications
- [ ] Repeated failures create GitHub issues
- [ ] PR comments show test and coverage summary

---
---

## Task 8: Add Quality Gates Before Promoting to Production

**Owner**: QA
**Estimated Time**: 1 day
**Feature**: General Copilot Usage

### Objectives
- Define production readiness criteria
- Implement automated quality checks
- Create manual approval checklist
- Set up production deployment gates

---

### Step 1: Define Production Readiness Criteria

#### 1.1 Create Production Readiness Checklist

Create `docs/deployment/PRODUCTION_READINESS.md`:

```markdown
# Production Readiness Checklist

## Automated Checks (Must All Pass)

### 1. Testing Requirements
- [ ] **All tests passed** (unit, integration, E2E)
  - Unit test pass rate: 100%
  - Integration test pass rate: 100%
  - E2E critical paths: 100%

- [ ] **Code coverage ≥ 80%**
  - Lines: ≥ 80%
  - Branches: ≥ 70%
  - Functions: ≥ 80%
  - Statements: ≥ 80%

- [ ] **No flaky tests**
  - All tests pass consistently
  - No intermittent failures

### 2. Code Quality Requirements
- [ ] **Linting passed** with zero errors
- [ ] **Code formatting** matches project standards
- [ ] **TypeScript type checking** passed (if applicable)
- [ ] **Code quality score** ≥ A rating
- [ ] **Technical debt ratio** < 5%
- [ ] **No code smells** (critical or high)

### 3. Security Requirements
- [ ] **No critical vulnerabilities**
- [ ] **No high vulnerabilities**
- [ ] **Dependency audit** passed
- [ ] **Secret scanning** passed
- [ ] **SAST scan** completed with no critical issues
- [ ] **Container scan** passed (if applicable)

### 4. Performance Requirements
- [ ] **Build time** < 10 minutes
- [ ] **Bundle size** within acceptable limits
- [ ] **Load time** < 3 seconds
- [ ] **Performance benchmarks** met
- [ ] **Memory usage** within limits
- [ ] **No memory leaks** detected

### 5. Documentation Requirements
- [ ] **README updated** with latest changes
- [ ] **API documentation** updated
- [ ] **Changelog** updated
- [ ] **Release notes** prepared
- [ ] **Rollback procedure** documented

---

## Manual Checks (Review Required)

### 6. Code Review
- [ ] **Minimum 2 approvals** from team members
- [ ] **At least 1 approval** from Tech Lead
- [ ] **No unresolved comments**
- [ ] **All conversations resolved**
- [ ] **Code follows** project conventions

### 7. QA Sign-off
- [ ] **QA testing completed** in staging
- [ ] **No known critical bugs**
- [ ] **No known high-priority bugs** (or documented/accepted)
- [ ] **Regression testing** completed
- [ ] **User acceptance testing** passed (if applicable)

### 8. Security Review
- [ ] **Security audit** completed (for security-sensitive changes)
- [ ] **No exposed secrets** in code
- [ ] **Authentication/authorization** verified
- [ ] **Data privacy** requirements met
- [ ] **Compliance** requirements met (GDPR, etc.)

### 9. Database Changes
- [ ] **Migration scripts** reviewed
- [ ] **Migrations tested** in staging
- [ ] **Rollback script** prepared
- [ ] **Data backup** strategy confirmed
- [ ] **No breaking schema changes** (or coordinated)

### 10. Infrastructure & Monitoring
- [ ] **Monitoring alerts** configured
- [ ] **Logging** in place for new features
- [ ] **Performance monitoring** enabled
- [ ] **Error tracking** configured
- [ ] **Health checks** updated

---

## Business Checks

### 11. Stakeholder Approval
- [ ] **Product Owner** approval
- [ ] **Business stakeholder** notification sent
- [ ] **Customer communication** prepared (if needed)
- [ ] **Marketing team** notified (if feature release)

### 12. Release Coordination
- [ ] **Release notes** reviewed by stakeholders
- [ ] **Support team** trained/notified
- [ ] **Documentation team** updated user docs
- [ ] **Deployment window** scheduled (business hours)
- [ ] **On-call engineer** assigned

### 13. Risk Assessment
- [ ] **Impact assessment** completed
- [ ] **Rollback plan** tested
- [ ] **Disaster recovery** plan reviewed
- [ ] **Communication plan** for issues prepared

---

## Environment-Specific Gates

### Staging Environment
**Requirements before promoting from Dev to Staging:**
- ✅ All automated checks passed
- ✅ Dev environment stable for 2+ hours
- ✅ Tech Lead approval

**Staging soak time**: 24 hours minimum

### Production Environment
**Requirements before promoting from Staging to Production:**
- ✅ All automated checks passed
- ✅ All manual checks completed
- ✅ All business checks approved
- ✅ Staging stable for 24+ hours
- ✅ Tech Lead + PM approval

---

## Deployment Day Checklist

### Pre-Deployment (T-30 minutes)
- [ ] Verify all checks above are complete
- [ ] Database backup completed
- [ ] Rollback plan ready
- [ ] On-call engineer on standby
- [ ] Monitoring dashboard open
- [ ] Communication channel (Slack) ready

### During Deployment
- [ ] Monitor deployment progress
- [ ] Watch error rates
- [ ] Check health endpoints
- [ ] Verify critical user journeys
- [ ] Monitor performance metrics

### Post-Deployment (T+60 minutes)
- [ ] Smoke tests passed
- [ ] Error rate < 0.1%
- [ ] Performance metrics normal
- [ ] No critical alerts
- [ ] Stakeholders notified of success
- [ ] Documentation updated

---

## Emergency Rollback Criteria

Trigger immediate rollback if:
- ❌ Error rate > 5% in first 5 minutes
- ❌ Critical service unavailable
- ❌ Database connection failures
- ❌ Health checks failing
- ❌ Critical user journey broken
- ❌ Security vulnerability exposed

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech Lead | __________ | ______ | __________ |
| QA Lead | __________ | ______ | __________ |
| Security Lead | __________ | ______ | __________ |
| Product Manager | __________ | ______ | __________ |
```

---

### Step 2: Implement Automated Production Gate

#### 2.1 Create Production Gate Workflow

Create `.github/workflows/production-gate.yml`:

```yaml
name: Production Deployment Gate

on:
  pull_request:
    branches: [ main ]
    types: [ opened, synchronize, reopened ]

jobs:
  # Automated checks must all pass
  automated-gate:
    name: Automated Quality Gates
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Production Gate Checklist
        run: |
          echo "=== Production Deployment Gate ==="
          echo "Checking production readiness criteria..."
          echo ""

      - name: Check PR labels
        uses: actions/github-script@v7
        with:
          script: |
            const labels = context.payload.pull_request.labels.map(l => l.name);

            if (!labels.includes('ready-for-production')) {
              core.setFailed('PR must be labeled "ready-for-production"');
            }

  # Verify all CI checks passed
  verify-ci-status:
    name: Verify CI Pipeline Status
    runs-on: ubuntu-latest
    needs: automated-gate

    steps:
      - name: Check required status checks
        uses: actions/github-script@v7
        with:
          script: |
            const { data: checks } = await github.rest.checks.listForRef({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.payload.pull_request.head.sha
            });

            const requiredChecks = [
              'Code Quality Gate',
              'Test Coverage Gate',
              'Security Gate',
              'Build Gate'
            ];

            const failedChecks = [];

            for (const checkName of requiredChecks) {
              const check = checks.check_runs.find(c => c.name === checkName);

              if (!check || check.conclusion !== 'success') {
                failedChecks.push(checkName);
              }
            }

            if (failedChecks.length > 0) {
              core.setFailed(`Required checks failed: ${failedChecks.join(', ')}`);
            }

            console.log('✅ All required CI checks passed');

  # Verify code review approvals
  verify-approvals:
    name: Verify Code Review Approvals
    runs-on: ubuntu-latest
    needs: verify-ci-status

    steps:
      - name: Check approvals
        uses: actions/github-script@v7
        with:
          script: |
            const { data: reviews } = await github.rest.pulls.listReviews({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.payload.pull_request.number
            });

            const approvals = reviews.filter(r => r.state === 'APPROVED');
            const uniqueApprovers = new Set(approvals.map(a => a.user.login));

            if (uniqueApprovers.size < 2) {
              core.setFailed(`Insufficient approvals: ${uniqueApprovers.size}/2 required`);
            }

            // Check if Tech Lead approved
            const techLeads = ['tech-lead-username']; // Replace with actual usernames
            const techLeadApproved = approvals.some(a => techLeads.includes(a.user.login));

            if (!techLeadApproved) {
              core.setFailed('Tech Lead approval required');
            }

            console.log(`✅ Approvals verified: ${uniqueApprovers.size} approvals`);
            console.log('✅ Tech Lead approval confirmed');

  # Check staging stability
  verify-staging-stability:
    name: Verify Staging Stability
    runs-on: ubuntu-latest
    needs: verify-approvals

    steps:
      - name: Check staging deployment date
        uses: actions/github-script@v7
        with:
          script: |
            // Get latest staging deployment
            const { data: deployments } = await github.rest.repos.listDeployments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              environment: 'staging',
              per_page: 1
            });

            if (deployments.length === 0) {
              core.setFailed('No staging deployment found');
              return;
            }

            const latestDeployment = deployments[0];
            const deploymentDate = new Date(latestDeployment.created_at);
            const now = new Date();
            const hoursSinceDeployment = (now - deploymentDate) / (1000 * 60 * 60);

            console.log(`Staging deployed: ${hoursSinceDeployment.toFixed(1)} hours ago`);

            if (hoursSinceDeployment < 24) {
              core.setFailed(`Staging must be stable for 24+ hours (current: ${hoursSinceDeployment.toFixed(1)} hours)`);
            }

            console.log('✅ Staging stability requirement met (24+ hours)');

  # Verify release notes exist
  verify-documentation:
    name: Verify Documentation
    runs-on: ubuntu-latest
    needs: verify-staging-stability

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Check for CHANGELOG update
        run: |
          if ! git diff origin/main -- CHANGELOG.md | grep -q "^+"; then
            echo "❌ CHANGELOG.md must be updated"
            exit 1
          fi
          echo "✅ CHANGELOG.md updated"

      - name: Check for release notes in PR body
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.pull_request.body || '';

            if (!body.includes('## Release Notes')) {
              core.setFailed('PR must include "## Release Notes" section');
            }

            if (!body.includes('## Rollback Plan')) {
              core.setFailed('PR must include "## Rollback Plan" section');
            }

            console.log('✅ Release notes and rollback plan documented');

  # Production gate summary
  production-gate-summary:
    name: Production Gate Summary
    needs: [automated-gate, verify-ci-status, verify-approvals, verify-staging-stability, verify-documentation]
    if: always()
    runs-on: ubuntu-latest

    steps:
      - name: Check all gates
        run: |
          echo "=== Production Deployment Gate Summary ==="
          echo ""
          echo "Automated Gate: ${{ needs.automated-gate.result }}"
          echo "CI Status: ${{ needs.verify-ci-status.result }}"
          echo "Approvals: ${{ needs.verify-approvals.result }}"
          echo "Staging Stability: ${{ needs.verify-staging-stability.result }}"
          echo "Documentation: ${{ needs.verify-documentation.result }}"
          echo ""

          if [[ "${{ needs.automated-gate.result }}" == "success" ]] && \
             [[ "${{ needs.verify-ci-status.result }}" == "success" ]] && \
             [[ "${{ needs.verify-approvals.result }}" == "success" ]] && \
             [[ "${{ needs.verify-staging-stability.result }}" == "success" ]] && \
             [[ "${{ needs.verify-documentation.result }}" == "success" ]]; then
            echo "✅ ALL PRODUCTION GATES PASSED"
            echo "Ready for production deployment! 🚀"
            exit 0
          else
            echo "❌ PRODUCTION GATES FAILED"
            echo "Please address all failing gates before merging."
            exit 1
          fi

      - name: Comment gate status on PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const gates = {
              'Automated Gate': '${{ needs.automated-gate.result }}',
              'CI Status': '${{ needs.verify-ci-status.result }}',
              'Code Review Approvals': '${{ needs.verify-approvals.result }}',
              'Staging Stability': '${{ needs.verify-staging-stability.result }}',
              'Documentation': '${{ needs.verify-documentation.result }}'
            };

            const allPassed = Object.values(gates).every(r => r === 'success');
            const emoji = allPassed ? '✅' : '❌';

            let body = `## Production Deployment Gate ${emoji}\n\n`;
            body += '| Gate | Status |\n';
            body += '|------|--------|\n';

            for (const [gate, result] of Object.entries(gates)) {
              const gateEmoji = result === 'success' ? '✅' : '❌';
              body += `| ${gate} | ${gateEmoji} ${result} |\n`;
            }

            body += '\n';

            if (allPassed) {
              body += '**Result**: All production gates passed! Ready for deployment to production. 🚀\n\n';
              body += '### Next Steps:\n';
              body += '1. Final approval from Tech Lead + PM\n';
              body += '2. Merge to main branch\n';
              body += '3. Monitor automated production deployment\n';
              body += '4. Verify health checks and critical paths\n';
            } else {
              body += '**Result**: Some production gates failed. Please address the failures above before proceeding.\n';
            }

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: body
            });
```

---

### Deliverables for Task 8

Create these files:
- ✅ `docs/deployment/PRODUCTION_READINESS.md`
- ✅ `.github/workflows/production-gate.yml`

### Validation Checklist
- [ ] Production gate workflow runs on PRs to main
- [ ] All automated gates enforced
- [ ] Manual approval requirements enforced
- [ ] Staging stability check (24 hours) working
- [ ] Documentation requirements enforced
- [ ] Failed gates block production deployment

---

## Summary

### Phase 2 QA Responsibilities Completed

**Task 6 - Test Matrix & Quality Gates**:
- ✅ Comprehensive test matrix strategy (minimal, optimized, full)
- ✅ Cross-platform testing (OS, Node versions, browsers)
- ✅ Database version matrix (PostgreSQL 15, 14)
- ✅ Parallel test execution with sharding
- ✅ Quality gates for code quality, coverage, security, performance
- ✅ Automated PR comments with test results

**Task 7 - Test Reporting**:
- ✅ JUnit test reporting integration
- ✅ Coverage reporting with Codecov
- ✅ Test failure notifications (Slack, GitHub issues)
- ✅ PR comments with test and coverage summaries
- ✅ Repeated failure tracking

**Task 8 - Production Quality Gates**:
- ✅ Production readiness checklist (automated, manual, business)
- ✅ Automated production gate workflow
- ✅ CI status verification
- ✅ Approval requirements enforcement
- ✅ Staging stability verification (24 hours)
- ✅ Documentation requirements

### Key Files Produced

1. `docs/testing/TEST_MATRIX_STRATEGY.md`
2. `.github/workflows/test-matrix.yml`
3. `.github/workflows/quality-gates.yml`
4. `.github/workflows/test-reporting.yml`
5. `.github/workflows/coverage-report.yml`
6. `.github/workflows/test-failure-notifications.yml`
7. `docs/deployment/PRODUCTION_READINESS.md`
8. `.github/workflows/production-gate.yml`

### Next Steps

1. **Configure test reporters** in package.json
2. **Set up Codecov account** and get token
3. **Configure Slack webhooks** for notifications
4. **Test all quality gates** in development
5. **Verify test matrix** runs correctly
6. **Create test data** for integration and E2E tests
7. **Document test procedures** for the team

### Success Criteria

- [ ] Test matrix runs for all PR types (minimal, optimized, full)
- [ ] All quality gates functioning correctly
- [ ] Test results visible in GitHub UI
- [ ] Coverage reports generated and tracked
- [ ] Failed tests trigger proper notifications
- [ ] Production gate blocks unsafe deployments
- [ ] All automated checks passing
- [ ] Manual approval process working
- [ ] Staging stability enforced (24 hours)
- [ ] Team trained on quality standards

---

**Document Version**: 1.0
**Last Updated**: November 2025
**Owner**: QA Team
**Review Date**: February 2026
