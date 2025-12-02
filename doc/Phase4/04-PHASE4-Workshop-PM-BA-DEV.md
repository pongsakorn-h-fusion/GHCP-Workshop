# Phase 4: Workshop for PM, BA and Dev

## Copilot Agent, Spec Kit & Playwright Workshop

**Duration**: 2 hours
**Target Audience**: Project Manager (PM), Business Analyst (BA), Developer (Dev)
**Prerequisites**: Completion of Phase 1, 2, and 3

---

## ✅ Workshop Structure

### **Session 1: Introduction & Context**

#### Workshop Objectives
- Understand how AI tools enhance PM/BA and Dev collaboration
- Learn hands-on usage of Copilot Agent, Spec Kit, and Playwright
- Practice real-world workflow integration

---

#### Step 1: Understanding the Tools

**Copilot Agent** - AI assistant in GitHub
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

**Spec Kit** - Spec-Driven Development toolkit
- PM/BA: Define "what" and "why" before implementation
- Dev: Generate technical plans and tasks from specifications
- AI-powered workflow from requirements to code

**Playwright** - End-to-End Testing framework
- PM/BA: Map user journeys to test scenarios
- Dev: Automate browser testing across multiple platforms
- CI/CD: Integrate testing into deployment pipeline

---

#### Step 2: Live Demonstrations

**Demo 1: Copilot Agent in GitHub Issues (5 min)**

1. Instructor opens GitHub Issue in workshop repository
2. Types in Issue comment:
   ```markdown
   @copilot help write acceptance criteria for OTP login feature
   ```
3. Copilot responds with structured acceptance criteria
4. Shows how to refine and iterate with follow-up questions
5. Demonstrates @copilot in Pull Request reviews

**Expected Output:**
```markdown
## Acceptance Criteria: OTP Login

### Given
- User has registered phone number
- SMS service is operational

### When
- User requests OTP via phone number
- User enters OTP within 5 minutes

### Then
- User successfully logs in
- OTP is invalidated after use
...
```

---

**Demo 2: Spec Kit Workflow (5 min)**

1. Show `.specify/` directory structure in sample project
2. Open terminal and demonstrate commands:
   ```bash
   # Show directory
   ls -la .specify/

   # Show constitution
   cat .specify/memory/constitution/principles.md

   # Show spec
   cat .specify/specs/otp-login.md

   # Show generated plan
   cat .specify/plans/technical-plan.md
   ```

3. Open Copilot Chat and demonstrate slash command:
   ```markdown
   /speckit.specify
   Create a simple product search feature
   ```

4. Show how AI generates structured specification

**Key Takeaway:** Spec Kit creates traceability from requirements → plan → tasks → code

---

**Demo 3: Playwright Test Execution (5 min)**

1. Navigate to workshop sample project
2. Start the application:
   ```bash
   npm run dev
   ```

3. Run Playwright tests with browser visible:
   ```bash
   npx playwright test --headed --project=chromium
   ```

4. Show test execution in real-time:
   - Browser opens automatically
   - Test steps execute (click, type, verify)
   - Screenshots captured on failure

5. Open test report:
   ```bash
   npx playwright show-report
   ```

6. Walk through report:
   - Test results (passed/failed)
   - Screenshots and videos
   - Execution timeline

---

**✅ Checkpoint:**
- [ ] Everyone understands what each tool does
- [ ] Everyone has seen the tools in action
- [ ] Questions about tool capabilities answered
- [ ] Ready to do hands-on activities

---

### **Session 2: Copilot Agent Hands-on**

#### Activity Overview
PM/BA will create acceptance criteria using Copilot Agent in GitHub Issues
Dev will generate unit tests using Copilot Agent in VS Code

---

#### Activity 2.1: PM/BA - Create Acceptance Criteria with Copilot Agent

**Step 1: Open GitHub Repository**
1. Navigate to workshop repository on GitHub
2. Click on "Issues" tab
3. Click "New Issue" button

**Step 2: Select Feature Request Template**
1. Choose "Feature Request" template (if available)
2. Or start with blank issue

**Step 3: Write Feature Description**
Type the following in the issue body:
```markdown
## Feature: OTP Login System

### Description
Users should be able to log in using their phone number and a one-time password (OTP).

### Business Rules
- OTP expires after 5 minutes
- OTP can only be used once
- After 3 failed attempts, lock account for 30 minutes

@copilot Write detailed Acceptance Criteria for this feature using Given-When-Then format. Include edge cases.
```

**Step 4: Wait for Copilot Response**
- Copilot will generate acceptance criteria
- Response appears in ~5-10 seconds

**Expected Copilot Response:**
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

**Step 5: Review and Refine**
1. Read through the generated acceptance criteria
2. If you need more details, ask follow-up questions:
   ```markdown
   @copilot Add acceptance criteria for SMS delivery retry mechanism
   ```
3. Edit the response to match your project needs
4. Click "Submit new issue" when complete

**✅ Checkpoint for PM/BA:**
- [ ] Issue created with feature description
- [ ] Acceptance criteria generated with @copilot
- [ ] Edge cases identified
- [ ] Criteria refined and published

---

#### Activity 2.2: Dev - Generate Unit Tests with Copilot Agent

**Step 1: Open VS Code**
1. Open workshop sample project in VS Code
2. Navigate to `tests/unit/` folder
3. Open existing test file or create new one: `otp.test.js`

**Step 2: Write Test Description as Comment**
Type the following at the top of your test file:
```javascript
// @copilot Generate unit tests for function validateOTP that:
// - Takes parameters: otp (string), createdAt (timestamp)
// - Checks if OTP is correct and not expired (5 minutes)
// - Returns: { valid: boolean, message: string }
// - Covers these cases: correct OTP, incorrect OTP, expired OTP, exactly 5 minutes
```

**Step 3: Let Copilot Generate Tests**
1. Press Enter after the comment
2. Copilot will suggest test code
3. Press Tab to accept suggestions
4. Continue accepting suggestions for multiple test cases

**Expected Generated Test Code:**
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

**Step 4: Run the Tests**
1. Open terminal in VS Code
2. Run the tests:
   ```bash
   npm test
   ```
3. Verify tests pass (or fail as expected if implementation is missing)

**Step 5: Review Generated Tests**
1. Check if test cases cover all scenarios:
   - ✅ Correct OTP and not expired
   - ✅ Incorrect OTP
   - ✅ Expired OTP (> 5 minutes)
   - ✅ Edge case: exactly 5 minutes
2. Add missing test cases if needed
3. Refactor test names for clarity

**✅ Checkpoint for Dev:**
- [ ] Test file created with proper structure
- [ ] Tests generated using Copilot
- [ ] All test cases cover requirements
- [ ] Tests run successfully
- [ ] Code follows team standards

---

#### Collaboration Activity (Optional)

**PM/BA and Dev work together:**
1. Dev reviews Issue created by PM/BA
2. PM/BA reviews Unit Tests created by Dev
3. Discuss if tests cover all acceptance criteria
4. Refine both Issue and Tests together

**Questions to discuss:**
- Do the tests cover all edge cases from acceptance criteria?
- Are there any missing scenarios?
- Is the business logic clear from both documents?

---

### **Session 3: Spec Kit Workshop**

#### Understanding Spec-Driven Development

**Spec Kit** is GitHub's toolkit for Spec-Driven Development - a process that emphasizes:
1. Define "what" and "why" before "how"
2. Use AI to generate implementation plans
3. Maintain traceability from requirements to code

**Workflow Overview:**
```
PM/BA: Constitution → Specify → Clarify
  ↓
Dev: Plan → Tasks → Implement → Analyze
```

---

#### Pre-Activity: Setup Spec Kit

**If not already installed, install Spec Kit CLI:**

```bash
# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Spec Kit
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Verify installation
specify --help
```

**Initialize for this workshop:**
```bash
# Navigate to workshop project
cd workshop-sample-project

# Check if .specify/ directory exists
ls -la .specify/

# If not exists, initialize:
specify init product-search --ai claude
```

---

#### Activity 3.1: PM/BA - Define Constitution and Specification

**Step 1: Open Copilot Chat in VS Code**
1. Open VS Code with workshop project
2. Open Copilot Chat panel (Ctrl+Shift+I or Cmd+Shift+I)
3. Ensure you're in Chat mode

**Step 2: Define Project Constitution**
Type in Copilot Chat:
```markdown
/speckit.constitution
Define principles for a Product Search feature:
- User-friendly search experience
- Fast response time (< 500ms)
- Mobile-first design
- Accessible to all users
- Minimal external dependencies
```

**Expected Output:**
- Copilot generates constitution document
- File saved to `.specify/memory/constitution/principles.md`
- Contains security, performance, and quality standards

**Step 3: Create Feature Specification**
Type in Copilot Chat:
```markdown
/speckit.specify
Create specification for Product Search feature:
- Users can search products by name
- Search should support partial matches
- Results displayed in grid layout
- Filter by category (Electronics, Clothing, Home)
- Sort by price or relevance
- Pagination with 20 items per page
- Handle empty results gracefully
```

**Expected Output:**
- Generated spec file in `.specify/specs/product-search.md`
- Includes:
  - Problem statement
  - User stories
  - Functional requirements
  - Non-functional requirements
  - Edge cases

**Step 4: Clarify Ambiguities**
Type in Copilot Chat:
```markdown
/speckit.clarify
Review the Product Search specification and ask questions about:
- Search algorithm (exact vs fuzzy matching)
- Performance under load
- Cache strategy
- Error handling
```

**Expected Output:**
- AI asks structured questions
- You answer in natural language
- Spec is updated with clarifications

**Step 5: Review Generated Spec**
1. Open `.specify/specs/product-search.md`
2. Read through all sections
3. Verify it matches your intent
4. Make manual edits if needed

**✅ Checkpoint for PM/BA:**
- [ ] Constitution created with clear principles
- [ ] Feature spec generated with requirements
- [ ] Clarification questions answered
- [ ] Spec file reviewed and finalized
- [ ] Ready to handoff to Dev team

---

#### Activity 3.2: Dev - Generate Technical Plan and Tasks

**Step 1: Review Specification**
1. Open `.specify/specs/product-search.md`
2. Read through requirements carefully
3. Understand acceptance criteria
4. Note any technical concerns

**Step 2: Generate Technical Implementation Plan**
Type in Copilot Chat:
```markdown
/speckit.plan
Based on the Product Search specification in .specify/specs/product-search.md,
create a technical implementation plan using:
- Node.js with Express for backend
- React for frontend
- MongoDB for product database
- Redis for search cache
- Jest for unit tests
- Playwright for E2E tests
```

**Expected Output:**
- Technical plan in `.specify/plans/technical-plan.md`
- Contains:
  - Architecture diagram
  - Tech stack details
  - API endpoints
  - Data structures
  - Testing strategy
  - Performance considerations

**Step 3: Generate Task Breakdown**
Type in Copilot Chat:
```markdown
/speckit.tasks
Break down the Product Search implementation into actionable tasks with:
- Clear task descriptions
- Time estimates
- Priority levels (P0, P1, P2)
- Dependencies
- Acceptance criteria per task
```

**Expected Output:**
- Task file in `.specify/tasks/task-breakdown.md`
- Tasks organized by priority
- Each task includes:
  - Description
  - Estimate (hours)
  - Dependencies
  - Acceptance criteria

**Step 4: Review Task Breakdown**
1. Open `.specify/tasks/task-breakdown.md`
2. Check if all requirements are covered
3. Verify task sizes are manageable
4. Identify any missing tasks

**Step 5: Run Quality Gate Analysis**
Type in Copilot Chat:
```markdown
/speckit.analyze
Verify consistency across:
- Constitution principles
- Feature specification
- Technical plan
- Task breakdown

Check for:
- Missing requirements
- Conflicting approaches
- Test coverage gaps
```

**Expected Output:**
- Analysis report showing:
  - ✅ Items aligned correctly
  - ⚠️ Potential issues
  - ❌ Critical problems
- Recommendations for fixes

**✅ Checkpoint for Dev:**
- [ ] Specification reviewed and understood
- [ ] Technical plan generated and validated
- [ ] Tasks broken down with estimates
- [ ] Dependencies identified
- [ ] Quality analysis passed
- [ ] Ready to start implementation

---

#### Complete Workflow Summary

```
.specify/
├── memory/constitution/
│   └── principles.md          ← PM/BA: /speckit.constitution
├── specs/
│   └── product-search.md      ← PM/BA: /speckit.specify + /speckit.clarify
├── plans/
│   └── technical-plan.md      ← Dev: /speckit.plan
└── tasks/
    └── task-breakdown.md      ← Dev: /speckit.tasks
                               ← Dev: /speckit.analyze (validation)
```

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

### **Session 4: Playwright Workshop**

#### Activity Overview
PM/BA will create user journey documents for testing
Dev will implement E2E tests using Playwright and Copilot

---

#### Understanding E2E Testing

**What is End-to-End Testing?**
- Simulates real user interactions with the application
- Tests complete user workflows from start to finish
- Runs in actual browsers (Chrome, Firefox, Safari)
- Verifies UI, functionality, and user experience

**User Journey to E2E Test Mapping:**
```
User Journey: OTP Login Flow
┌──────────────────────────────────────────────────────────┐
│ Step 1: Open Login Page                                  │
│         └─> test: Navigate to /login                     │
│                                                          │
│ Step 2: Enter Phone Number                               │
│         └─> test: Fill phone input, click Request OTP    │
│                                                          │
│ Step 3: Receive and Enter OTP                            │
│         └─> test: Fill OTP inputs, click Verify          │
│                                                          │
│ Step 4: Successfully Login                               │
│         └─> test: Verify URL = /dashboard                │
└──────────────────────────────────────────────────────────┘
```

---

#### Activity 4.1: PM/BA - Document User Journey for Testing

**Step 1: Create Test Scenario Document**
1. Create new file: `test-scenarios/product-search-flow.md`
2. Use the template from `test-scenarios/otp-login-flow.md` as reference

**Step 2: Write User Journey**
Document the complete user flow in natural language:
```markdown
## Scenario: Product Search Happy Path

### User Journey
Home Page → Enter Search Query → View Results → Filter by Category → Sort by Price → Select Product

### Test Steps

1. **Navigate to Home Page**
   - URL: http://localhost:3000
   - Expected: Homepage loads successfully

2. **Enter Search Query**
   - Action: Type "laptop" in search box
   - Element: [data-testid="search-input"]
   - Expected: Search box contains "laptop"

3. **Click Search Button**
   - Element: [data-testid="search-btn"]
   - Expected: Results page appears

4. **Verify Search Results**
   - Expected: At least 1 product displayed
   - Expected: Product cards show name, price, image

5. **Filter by Category**
   - Action: Select "Electronics" filter
   - Element: [data-testid="filter-electronics"]
   - Expected: Only electronics products shown

6. **Sort by Price**
   - Action: Select "Price: Low to High"
   - Element: [data-testid="sort-price-asc"]
   - Expected: Products sorted by ascending price

7. **Verify First Product**
   - Expected: First product has lowest price
   - Expected: All product cards visible
```

**Step 3: Define Test Data**
```markdown
### Test Data
| Field | Value | Purpose |
|-------|-------|---------|
| Search Query | "laptop" | Valid product search |
| Category | Electronics | Filter test |
| Sort Option | Price: Low to High | Sort test |
```

**Step 4: Specify Expected Results**
```markdown
### Expected Results
- ✅ Search returns relevant products
- ✅ Products can be filtered by category
- ✅ Products can be sorted by price
- ✅ UI remains responsive during operations
- ✅ No error messages displayed
```

**✅ Checkpoint for PM/BA:**
- [ ] User journey documented step-by-step
- [ ] Test data specified clearly
- [ ] Expected results defined
- [ ] Edge cases considered
- [ ] Document ready for Dev to implement

---

#### Activity 4.2: Dev - Implement E2E Test with Playwright

**Step 1: Ensure Playwright is Installed**
```bash
# Check if Playwright is installed
npx playwright --version

# If not installed, run:
npm init playwright@latest

# Install browsers
npx playwright install chromium
```

**Step 2: Create Test File**
1. Navigate to `tests/e2e/` directory
2. Create new file: `product-search.spec.js`
3. Open in VS Code

**Step 3: Write Test Structure with Copilot**
Type the following comment in your test file:
```javascript
// @copilot Generate Playwright E2E test for Product Search feature
// User Journey:
// 1. Navigate to home page
// 2. Enter "laptop" in search box
// 3. Click search button
// 4. Verify search results displayed
// 5. Filter by "Electronics" category
// 6. Sort by "Price: Low to High"
// 7. Verify products are sorted correctly
//
// Use data-testid selectors for all elements
// Include proper assertions with expect()
```

**Step 4: Accept Copilot Suggestions**
Copilot will generate something like:
```javascript
import { test, expect } from '@playwright/test';

test.describe('Product Search Flow', () => {
  test('should search, filter, and sort products successfully', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Product Store/);

    // Enter search query
    await page.fill('[data-testid="search-input"]', 'laptop');

    // Click search button
    await page.click('[data-testid="search-btn"]');

    // Wait for results
    await page.waitForSelector('[data-testid="product-card"]');

    // Verify search results
    const products = page.locator('[data-testid="product-card"]');
    await expect(products).toHaveCountGreaterThan(0);

    // Filter by Electronics
    await page.click('[data-testid="filter-electronics"]');
    await page.waitForTimeout(500); // Wait for filter

    // Sort by price ascending
    await page.selectOption('[data-testid="sort-select"]', 'price-asc');
    await page.waitForTimeout(500); // Wait for sort

    // Verify sorting
    const prices = await page.locator('[data-testid="product-price"]').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));

    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  });
});
```

**Step 5: Run the Test**
1. Ensure application is running:
   ```bash
   npm run dev
   ```

2. In another terminal, run Playwright test with visible browser:
   ```bash
   npx playwright test product-search.spec.js --headed --project=chromium
   ```

3. Watch the test execute in the browser

**Step 6: Review Test Results**
1. Check terminal output:
   ```
   Running 1 test using 1 worker
   ✓  product-search.spec.js:3:3 › Product Search Flow (2.5s)

   1 passed (3s)
   ```

2. If test fails, review error messages and screenshots

**Step 7: Generate and View Test Report**
```bash
# Generate HTML report
npx playwright show-report

# Opens browser with detailed report showing:
# - Test results (passed/failed)
# - Screenshots at each step
# - Test duration
# - Error messages (if any)
```

**✅ Checkpoint for Dev:**
- [ ] Test file created with proper structure
- [ ] Test implements all steps from user journey
- [ ] Uses data-testid selectors (not CSS classes)
- [ ] Includes proper assertions
- [ ] Test runs successfully
- [ ] Test report reviewed

---

#### Optional: Integration with CI/CD

**For teams wanting to automate tests in GitHub Actions:**
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

### **Session 5: Q&A + Best Practices**

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
