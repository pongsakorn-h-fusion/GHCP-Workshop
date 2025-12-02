# Phase 4: Workshop for PM, BA and Dev

## Copilot Agent, Spec Kit & Playwright Workshop

**Duration**: 2 hours
**Target Audience**: Project Manager (PM), Business Analyst (BA), Developer (Dev)
**Prerequisites**: Completion of Phase 1, 2, and 3

---

## ✅ Workshop Structure (2 Hours)

### **Session 1: Introduction & Context (15 minutes)**

#### For PM/BA:
- Understanding how Copilot Agent increases productivity in GitHub Workflow
- Using Spec Kit to define Requirements and Test Specifications
- Importance of clear Acceptance Criteria

#### For Dev:
- Overview of Copilot Agent, Spec Kit and Playwright in real-world scenarios
- Using AI to assist in Code and Test Generation
- Integration with CI/CD Pipeline

#### Activities:
- **Demo Copilot Agent responding to Issues and reviewing PRs**
  ```markdown
  1. Demonstrate using Copilot Agent in GitHub Issues
  2. Show auto-generated responses from Issues
  3. Demonstrate automatic PR review
  ```

#### Copilot Agent Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Copilot Agent Capabilities                │
├─────────────────────────────────────────────────────────────┤
│  📝 Issue Response    │  Automated Issue responses          │
│  🔍 PR Review         │  Code review with suggestions       │
│  🧪 Test Generation   │  Generate test cases from specs     │
│  📋 Spec Generation   │  Generate specs from business rules │
└─────────────────────────────────────────────────────────────┘
```

---

### **Session 2: Copilot Agent Hands-on (30 minutes)**

#### PM/BA Focus:
- Use Copilot Agent to write Acceptance Criteria or Test Scenarios in Issues
- Create quality User Stories with AI assistance

**Example Prompt for PM/BA:**
```markdown
@copilot Write Acceptance Criteria for:
- Feature: OTP Login System
- User: General customers
- Business Rule: OTP expires in 5 minutes, single use only
```

**Copilot Response Example:**
```markdown
## Acceptance Criteria: OTP Login

### Given
- User has registered phone number in the system
- SMS service is operational

### When
1. User enters phone number and requests OTP
2. User receives SMS and enters OTP within 5 minutes

### Then
- User can successfully log in
- Used OTP cannot be reused
- If OTP expires, system displays "OTP expired, please request a new one"

### Edge Cases
- [ ] Enter wrong OTP 3 times → lock account for 30 minutes
- [ ] OTP expired → show error and allow new request
- [ ] SMS delivery failed → retry 3 times then notify error
```

#### Dev Focus:
- Use Copilot Agent to generate Unit Tests and fix code in Pull Requests
- Review and Refactor Code with AI Suggestions

**Example Prompt for Dev:**
```markdown
@copilot Generate unit tests for function validateOTP that:
- Takes parameters: otp (string), createdAt (timestamp)
- Checks if OTP is correct and not expired (5 minutes)
- Returns: { valid: boolean, message: string }
```

**Generated Test Example:**
```javascript
describe('validateOTP', () => {
  it('should return valid when OTP is correct and not expired', () => {
    const otp = '123456';
    const createdAt = Date.now() - (2 * 60 * 1000); // 2 minutes ago

    const result = validateOTP(otp, '123456', createdAt);

    expect(result.valid).toBe(true);
    expect(result.message).toBe('OTP verified successfully');
  });

  it('should return invalid when OTP is expired', () => {
    const otp = '123456';
    const createdAt = Date.now() - (6 * 60 * 1000); // 6 minutes ago

    const result = validateOTP(otp, '123456', createdAt);

    expect(result.valid).toBe(false);
    expect(result.message).toBe('OTP has expired');
  });

  it('should return invalid when OTP is incorrect', () => {
    const otp = '123456';
    const createdAt = Date.now();

    const result = validateOTP(otp, '654321', createdAt);

    expect(result.valid).toBe(false);
    expect(result.message).toBe('Invalid OTP');
  });

  it('should handle edge case at exactly 5 minutes', () => {
    const otp = '123456';
    const createdAt = Date.now() - (5 * 60 * 1000); // Exactly 5 minutes

    const result = validateOTP(otp, '123456', createdAt);

    expect(result.valid).toBe(true);
  });
});
```

#### Activities:
**Create Issue and ask Copilot Agent to help write Spec/Test**

```markdown
## Workshop Activity 2.1

### For PM/BA:
1. Create new Issue in Repository
2. Use "Feature Request" template
3. Write initial description
4. Use @copilot to:
   - Generate Acceptance Criteria
   - Create Test Scenarios
   - Identify Edge Cases

### For Dev:
1. Open Issue created by PM/BA
2. Use @copilot to:
   - Generate function skeleton
   - Create Unit Tests
   - Suggest implementation approach
3. Create PR and link to Issue
```

---

### **Session 3: Spec Kit Workshop (35 minutes)**

#### Understanding Spec-Driven Development
**Spec Kit** is GitHub's toolkit for Spec-Driven Development - a structured process where you define the "what" and "why" before the "how", using AI agents to help generate implementation plans and code.

#### Setup Spec Kit (5 minutes)

**Install Spec Kit CLI:**
```bash
# Install Spec Kit
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Or for one-time usage
uvx --from git+https://github.com/github/spec-kit.git specify init my-project
```

**Initialize Project:**
```bash
# Initialize with your preferred AI agent
specify init otp-login-feature --ai claude
# or --ai copilot
# or --ai cursor-agent
```

This creates a `.specify/` directory with:
- `memory/constitution/` - Project principles
- `specs/` - Feature specifications
- `plans/` - Technical implementation plans
- `tasks/` - Task breakdowns

---

#### PM/BA Workflow with Spec Kit (15 minutes)

**Step 1: Define Project Constitution**
Use `/speckit.constitution` command to establish non-negotiable principles:

```markdown
/speckit.constitution
This is an authentication system with:
- Security as top priority
- Minimal external dependencies
- Mobile-friendly design
- Accessibility compliance (WCAG AA)
```

**Step 2: Create Feature Specification**
Use `/speckit.specify` command to define requirements:

```markdown
/speckit.specify
Build an OTP login system where:
- Users login with phone number and OTP
- OTP expires in 5 minutes
- Account locks after 3 failed attempts
- Support for SMS delivery retry
- Real-time OTP expiry countdown
```

**Step 3: Clarify Requirements**
Use `/speckit.clarify` to run structured questioning:

```markdown
/speckit.clarify
```

The AI will ask specific questions about:
- Edge cases you haven't considered
- Performance requirements
- Error handling scenarios
- User experience details

**Step 4: Review Generated Specification**
Spec Kit generates a markdown file in `.specify/specs/` with:
- Problem statement
- User stories
- Acceptance criteria
- Test scenarios
- Non-functional requirements

---

#### Dev Workflow with Spec Kit (15 minutes)

**Step 5: Create Technical Plan**
Use `/speckit.plan` to generate implementation plan:

```markdown
/speckit.plan
Use:
- Node.js with Express
- In-memory storage for demo
- Simple HTML/CSS/JS frontend
- Jest for unit tests
- Playwright for E2E tests
```

**Step 6: Generate Task Breakdown**
Use `/speckit.tasks` to create detailed tasks:

```markdown
/speckit.tasks
```

This generates `.specify/tasks/` with:
- Implementation tasks
- Testing tasks
- Documentation tasks
- Priority and dependencies

**Step 7: Implement with AI Assistance**
Use `/speckit.implement` to start building:

```markdown
/speckit.implement task-001-otp-validation
```

**Step 8: Quality Gate Analysis**
Use `/speckit.analyze` to ensure consistency:

```markdown
/speckit.analyze
```

Checks that:
- Specs align with constitution
- Plans match specifications
- Tasks cover all requirements

---

#### Complete Workflow Example

```markdown
# 1. Establish principles
/speckit.constitution
Secure, minimal dependencies, mobile-friendly

# 2. Define feature
/speckit.specify
OTP login with 5-minute expiry and account locking

# 3. Clarify details
/speckit.clarify

# 4. Create technical plan
/speckit.plan
Node.js, Express, Jest, Playwright

# 5. Break down tasks
/speckit.tasks

# 6. Implement
/speckit.implement

# 7. Verify quality
/speckit.analyze
```

---

#### Workshop Activity 3.1: Hands-on Spec Kit

**For PM/BA (15 minutes):**
1. Initialize Spec Kit project
2. Define constitution for your feature
3. Use `/speckit.specify` to create specification
4. Run `/speckit.clarify` and answer questions
5. Review generated spec file

**For Dev (15 minutes):**
1. Review spec created by PM/BA
2. Use `/speckit.plan` to create technical plan
3. Use `/speckit.tasks` to generate task list
4. Review task breakdown
5. Run `/speckit.analyze` to verify consistency

**Checkpoint:**
- [ ] Constitution established
- [ ] Specification created with Acceptance Criteria
- [ ] Technical plan generated
- [ ] Task breakdown complete
- [ ] Quality analysis passed

---

#### Spec Kit Directory Structure

```
project/
├── .specify/
│   ├── memory/
│   │   └── constitution/
│   │       └── principles.md       # Project principles
│   ├── specs/
│   │   └── otp-login.md           # Feature specification
│   ├── plans/
│   │   └── technical-plan.md      # Implementation plan
│   └── tasks/
│       └── task-breakdown.md      # Detailed tasks
├── src/
└── tests/
```

---

#### Key Benefits of Spec-Driven Development

1. **Intent-Driven**: Focus on "what" and "why" before "how"
2. **AI-Friendly**: Structured format works well with AI agents
3. **Traceability**: Clear link from requirements to implementation
4. **Quality Gates**: Built-in validation and consistency checks
5. **Collaboration**: PM/BA and Dev work from same source of truth

---

### **Session 4: Playwright Workshop (30 minutes)**

#### PM/BA:
- Understand End-to-End Testing and mapping to User Journey
- Review Test Results and Reports
- Understand Test Coverage

**User Journey to E2E Test Mapping:**
```
User Journey: Register and Purchase Products
┌──────────────────────────────────────────────────────────┐
│ Step 1: Navigate to Home page                            │
│         └─> test: homepage.spec.ts                       │
│                                                          │
│ Step 2: Click "Register"                                 │
│         └─> test: registration.spec.ts                   │
│                                                          │
│ Step 3: Fill form and confirm                            │
│         └─> test: registration-form.spec.ts              │
│                                                          │
│ Step 4: Login to system                                  │
│         └─> test: login.spec.ts                          │
│                                                          │
│ Step 5: Select product and add to cart                   │
│         └─> test: product-cart.spec.ts                   │
│                                                          │
│ Step 6: Checkout                                         │
│         └─> test: checkout.spec.ts                       │
│                                                          │
│ Step 7: Receive Confirmation                             │
│         └─> test: order-confirmation.spec.ts             │
└──────────────────────────────────────────────────────────┘
```

#### Dev:
- Write Test Cases with Playwright and use Copilot to generate code
- Debug and Run Tests
- Integration with CI/CD

**Installing Playwright:**
```bash
# Install Playwright
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test

# Install browsers
npx playwright install
```

**Project Structure:**
```
project/
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   └── registration.spec.ts
│   │   ├── products/
│   │   │   ├── catalog.spec.ts
│   │   │   └── cart.spec.ts
│   │   └── checkout/
│   │       ├── payment.spec.ts
│   │       └── confirmation.spec.ts
│   └── fixtures/
│       └── test-data.json
├── playwright.config.ts
└── package.json
```

**Test Case Example with Copilot:**
```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

// @copilot: Generate E2E test for OTP login flow
test.describe('OTP Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully with valid OTP', async ({ page }) => {
    // Step 1: Enter phone number
    await page.fill('[data-testid="phone-input"]', '0812345678');
    await page.click('[data-testid="request-otp-btn"]');

    // Step 2: Wait for OTP input to appear
    await expect(page.locator('[data-testid="otp-input"]')).toBeVisible();

    // Step 3: Enter OTP (mock for testing)
    await page.fill('[data-testid="otp-input"]', '123456');
    await page.click('[data-testid="verify-btn"]');

    // Step 4: Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
  });

  test('should show error for expired OTP', async ({ page }) => {
    await page.fill('[data-testid="phone-input"]', '0812345678');
    await page.click('[data-testid="request-otp-btn"]');

    // Simulate waiting for OTP to expire (mock)
    await page.evaluate(() => {
      window.localStorage.setItem('mockOTPExpired', 'true');
    });

    await page.fill('[data-testid="otp-input"]', '123456');
    await page.click('[data-testid="verify-btn"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('OTP expired');
  });

  test('should lock account after 3 failed attempts', async ({ page }) => {
    await page.fill('[data-testid="phone-input"]', '0812345678');
    await page.click('[data-testid="request-otp-btn"]');

    // Attempt wrong OTP 3 times
    for (let i = 0; i < 3; i++) {
      await page.fill('[data-testid="otp-input"]', '000000');
      await page.click('[data-testid="verify-btn"]');
      if (i < 2) {
        await page.waitForSelector('[data-testid="error-message"]');
        await page.fill('[data-testid="otp-input"]', '');
      }
    }

    await expect(page.locator('[data-testid="account-locked"]'))
      .toContainText('Account locked');
  });
});
```

**Playwright Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Activities:

**Workshop Activity 4.1: Install and Run Playwright**
```bash
# Create new project
mkdir playwright-workshop
cd playwright-workshop
npm init -y

# Install Playwright
npm init playwright@latest

# Run example tests
npx playwright test

# View report
npx playwright show-report
```

**Workshop Activity 4.2: Write Test Case**
```markdown
## For Everyone:

### Step 1: Choose User Journey
PM/BA: Define User Journey to test
- Example: "User can search for products and add to cart"

### Step 2: Write Test Steps
PM/BA: Write Test Steps in natural language
```markdown
1. Navigate to Home page
2. Type product name in search box
3. Click search button
4. Select product from results
5. Click add to cart button
6. Verify product is in cart
```

### Step 3: Convert to Code
Dev: Use Copilot to convert Steps to Playwright Code
```

**Integration with CI/CD:**
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install --with-deps

    - name: Run Playwright tests
      run: npx playwright test

    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

### **Session 5: Q&A + Best Practices (10 minutes)**

#### Using Copilot Agent Effectively

**Best Practices:**

1. **Write Clear Prompts**
   ```markdown
   ❌ "Help write test"
   ✅ "Write unit test for function validateEmail
       that takes email string and returns boolean
       including tests for both valid and invalid cases"
   ```

2. **Provide Sufficient Context**
   ```markdown
   @copilot Context:
   - System uses TypeScript
   - Testing framework: Jest
   - Must cover edge cases

   Task: Generate tests for...
   ```

3. **Review and Refine Output**
   - Don't use generated code without review
   - Adapt to team coding standards
   - Verify edge cases

#### Integrating Spec Kit + Playwright in CI/CD

```yaml
# .github/workflows/spec-test.yml
name: Spec Validation & E2E Tests

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  validate-specs:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Validate Specs
      run: npm run spec:validate

    - name: Generate Tests from Specs
      run: npm run spec:generate

    - name: Run Spec Tests
      run: npm run spec:test

  e2e-tests:
    needs: validate-specs
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright
      run: npx playwright install --with-deps

    - name: Run E2E Tests
      run: npx playwright test

    - name: Upload Results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: test-results
        path: |
          playwright-report/
          test-results/
```

#### Tips for Each Role

**For PM:**
- Use Copilot to write User Stories and Acceptance Criteria
- Review Test Coverage Reports to verify completeness
- Monitor Test Results in GitHub Actions

**For BA:**
- Use Spec Kit to create clear Specifications
- Map User Journey to Test Cases
- Collaborate with Dev to Review Specs

**For Dev:**
- Use Copilot to Generate Tests from Specs
- Integrate Playwright with CI/CD Pipeline
- Auto-generate Code from Acceptance Criteria

---

## ✅ Prerequisites

### For Everyone:
- [ ] GitHub Account + Copilot Agent enabled
- [ ] VS Code + GitHub Copilot Extension
- [ ] Node.js (v18+) + npm
- [ ] Git installed and configured
- [ ] Python 3.8+ (for Spec Kit CLI)
- [ ] uv package manager (for Spec Kit)

### For PM/BA:
- [ ] Install Spec Kit CLI:
  ```bash
  # Install uv (Python package manager)
  curl -LsSf https://astral.sh/uv/install.sh | sh

  # Install Spec Kit
  uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
  ```
- [ ] Preferred AI agent (Claude Code, GitHub Copilot, or Cursor)

### For Dev:
- [ ] All PM/BA prerequisites
- [ ] Install Playwright:
  ```bash
  npm init playwright@latest
  ```
- [ ] Sample Web App for testing (local or staging)

### Environment Check:
```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check Python version
python --version  # Should be 3.8 or higher

# Check npm
npm --version

# Check git
git --version

# Check uv (for Spec Kit)
uv --version

# Check Spec Kit installation
specify --help

# Check Playwright (after installation)
npx playwright --version
```

---

## ✅ Workshop Checklist

### Before Workshop:
- [ ] Everyone has GitHub account with proper access
- [ ] Copilot license activated
- [ ] IDE and extensions ready
- [ ] Workshop repository created

### During Workshop:
- [ ] Demo Copilot Agent working
- [ ] Everyone can create Issues and use Copilot
- [ ] PM/BA successfully created Spec
- [ ] Dev successfully ran Playwright tests

### After Workshop:
- [ ] Collect feedback from participants
- [ ] Document Best Practices discovered
- [ ] Update documentation
- [ ] Plan follow-up sessions

---

## 📊 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Participant Satisfaction | ≥ 4.0/5.0 | Post-workshop survey |
| Hands-on Completion Rate | ≥ 90% | Activities completed |
| Copilot Usage Understanding | ≥ 80% | Quiz/Assessment |
| Spec Kit Adoption | ≥ 70% | Follow-up check |
| Playwright Integration | 100% | CI/CD pipeline active |

---

## 📚 Resources

### Documentation:
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Spec Kit Repository](https://github.com/github/spec-kit)
- [Spec Kit Official Site](https://speckit.org/)
- [Spec Kit Documentation](https://github.com/github/spec-kit/tree/main/docs)
- [Playwright Documentation](https://playwright.dev/)

### Articles & Guides:
- [Spec-Driven Development with AI - GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Diving Into Spec-Driven Development - Microsoft](https://developer.microsoft.com/blog/spec-driven-development-spec-kit)
- [GitHub Spec Kit Guide - LogRocket](https://blog.logrocket.com/github-spec-kit/)

### Video Tutorials:
- GitHub Copilot Agent Overview
- Spec Kit Quick Start Tutorial
- Playwright for Beginners

### Sample Repositories:
- [Spec Kit Examples](https://github.com/topics/spec-kit)
- Playwright Test Examples
- E2E Testing Best Practices

### Commands Reference:

**Spec Kit Commands:**
- `/speckit.constitution` - Define project principles
- `/speckit.specify` - Create feature specifications
- `/speckit.clarify` - Run structured questioning
- `/speckit.plan` - Generate technical plan
- `/speckit.tasks` - Create task breakdown
- `/speckit.implement` - Execute implementation
- `/speckit.analyze` - Quality gate analysis

---

## 🔗 Related Documents

- [Phase 4: Automation, Auto PR Review & Agent Integration](./04-PHASE4-AUTOMATION.md)
- [Phase 3: Security & Branch Protection](../phase3/03-PHASE3-SECURITY.md)
- [Phase 2: CI/CD & Environments](../phase2/02-PHASE2-CICD.md)
- [Phase 1: Foundation Setup](../phase1/01-PHASE1-FOUNDATION.md)

---

**Workshop Owner**: Pongsakorn H.
**Last Updated**: December 2025
**Version**: 1.0
