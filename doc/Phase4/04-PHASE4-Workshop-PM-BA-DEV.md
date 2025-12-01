# Phase 4: Workshop สำหรับ PM, BA และ Dev

## Copilot Agent, Spec Kit & Playwright Workshop

**Duration**: 2 ชั่วโมง
**กลุ่มเป้าหมาย**: Project Manager (PM), Business Analyst (BA), Developer (Dev)
**Prerequisites**: Phase 1, 2, และ 3 เสร็จสมบูรณ์

---

## ✅ โครงสร้าง Workshop (2 ชั่วโมง)

### **ช่วงที่ 1: Introduction & Context (15 นาที)**

#### สำหรับ PM/BA:
- ทำความเข้าใจว่า Copilot Agent ช่วยเพิ่ม Productivity ใน GitHub Workflow อย่างไร
- การใช้ Spec Kit เพื่อกำหนด Requirement และ Test Specification
- ความสำคัญของ Acceptance Criteria ที่ชัดเจน

#### สำหรับ Dev:
- Overview ของ Copilot Agent, Spec Kit และ Playwright ในงานจริง
- การใช้ AI ช่วยในการ Generate Code และ Tests
- Integration กับ CI/CD Pipeline

#### กิจกรรม:
- **Demo Copilot Agent ตอบ Issue และ Review PR**
  ```markdown
  1. แสดงการใช้ Copilot Agent ใน GitHub Issues
  2. สาธิตการ Auto-generate Response จาก Issue
  3. แสดงการ Review PR อัตโนมัติ
  ```

#### Copilot Agent Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Copilot Agent Capabilities                │
├─────────────────────────────────────────────────────────────┤
│  📝 Issue Response    │  ตอบ Issues อัตโนมัติ              │
│  🔍 PR Review         │  Review Code และให้ Suggestions    │
│  🧪 Test Generation   │  สร้าง Test Cases จาก Requirements │
│  📋 Spec Generation   │  สร้าง Spec จาก Business Rules    │
└─────────────────────────────────────────────────────────────┘
```

---

### **ช่วงที่ 2: Copilot Agent Hands-on (30 นาที)**

#### PM/BA Focus:
- ใช้ Copilot Agent ช่วยเขียน Acceptance Criteria หรือ Test Scenario ใน Issue
- สร้าง User Stories ที่มีคุณภาพด้วย AI

**ตัวอย่าง Prompt สำหรับ PM/BA:**
```markdown
@copilot ช่วยเขียน Acceptance Criteria สำหรับ:
- Feature: ระบบ Login ด้วย OTP
- User: ลูกค้าทั่วไป
- Business Rule: OTP หมดอายุใน 5 นาที, ใช้ได้ครั้งเดียว
```

**Copilot Response Example:**
```markdown
## Acceptance Criteria: Login ด้วย OTP

### Given
- ผู้ใช้มีหมายเลขโทรศัพท์ที่ลงทะเบียนในระบบ
- ระบบ SMS ทำงานปกติ

### When
1. ผู้ใช้กรอกหมายเลขโทรศัพท์และกดขอ OTP
2. ผู้ใช้ได้รับ SMS และกรอก OTP ภายใน 5 นาที

### Then
- ผู้ใช้สามารถเข้าสู่ระบบได้สำเร็จ
- OTP ที่ใช้แล้วจะไม่สามารถใช้ซ้ำได้
- หาก OTP หมดอายุ ระบบแสดงข้อความ "OTP หมดอายุ กรุณาขอใหม่"

### Edge Cases
- [ ] กรอก OTP ผิด 3 ครั้ง → ล็อคบัญชี 30 นาที
- [ ] OTP หมดอายุ → แสดง error และให้ขอใหม่
- [ ] SMS ส่งไม่สำเร็จ → retry 3 ครั้ง แล้วแจ้ง error
```

#### Dev Focus:
- ใช้ Copilot Agent ช่วย Generate Unit Test และแก้ไขโค้ดใน Pull Request
- Review และ Refactor Code ด้วย AI Suggestions

**ตัวอย่าง Prompt สำหรับ Dev:**
```markdown
@copilot Generate unit tests สำหรับ function validateOTP ที่:
- รับ parameter: otp (string), createdAt (timestamp)
- เช็คว่า OTP ถูกต้องและไม่หมดอายุ (5 นาที)
- Return: { valid: boolean, message: string }
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

#### กิจกรรม:
**สร้าง Issue และสั่ง Copilot Agent ให้ช่วยเขียน Spec/Test**

```markdown
## Workshop Activity 2.1

### สำหรับ PM/BA:
1. สร้าง Issue ใหม่ใน Repository
2. ใช้ template "Feature Request"
3. เขียน description เบื้องต้น
4. ใช้ @copilot เพื่อ:
   - Generate Acceptance Criteria
   - สร้าง Test Scenarios
   - ระบุ Edge Cases

### สำหรับ Dev:
1. เปิด Issue ที่ PM/BA สร้าง
2. ใช้ @copilot เพื่อ:
   - Generate function skeleton
   - สร้าง Unit Tests
   - Suggest implementation approach
3. สร้าง PR และ link กับ Issue
```

---

### **ช่วงที่ 3: Spec Kit Workshop (35 นาที)**

#### PM/BA:
- สร้าง Test Specification จาก Business Requirement
- ใช้ Copilot ช่วย Generate Spec Template
- เข้าใจความสัมพันธ์ระหว่าง Spec และ Code

**Spec Template สำหรับ PM/BA:**
```markdown
# Feature Specification: [Feature Name]

## 1. Overview
- **Feature Name**:
- **Owner**:
- **Priority**:
- **Target Release**:

## 2. Business Context
### Problem Statement
[อธิบายปัญหาที่ต้องการแก้ไข]

### Business Value
[อธิบายคุณค่าทางธุรกิจ]

### Success Metrics
- [ ] Metric 1: [description] - Target: [value]
- [ ] Metric 2: [description] - Target: [value]

## 3. User Stories
### Story 1
**As a** [user type]
**I want** [functionality]
**So that** [benefit]

#### Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## 4. Test Scenarios
| ID | Scenario | Given | When | Then | Priority |
|----|----------|-------|------|------|----------|
| TS001 | | | | | High |
| TS002 | | | | | Medium |

## 5. Non-Functional Requirements
- **Performance**:
- **Security**:
- **Accessibility**:

## 6. Dependencies
- [ ] Dependency 1
- [ ] Dependency 2

## 7. Risks & Mitigations
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| | | | |
```

#### Dev:
- Integrate Spec Kit กับโค้ดจริง
- สร้าง Tests จาก Spec

**Integration Example:**
```typescript
// spec-kit.config.ts
import { defineConfig } from '@github/spec-kit';

export default defineConfig({
  specDir: './specs',
  testDir: './tests',
  outputFormat: 'markdown',
  features: {
    autoGenerate: true,
    linkToCode: true,
    traceability: true
  }
});
```

**Spec-to-Test Mapping:**
```typescript
// specs/login-otp.spec.ts
import { describe, spec, test } from '@github/spec-kit';

describe('OTP Login Feature', () => {
  spec('User can login with valid OTP', {
    given: ['User has registered phone number', 'SMS service is operational'],
    when: ['User requests OTP', 'User enters OTP within 5 minutes'],
    then: ['User is logged in successfully', 'OTP is invalidated'],
    priority: 'high',
    owner: 'auth-team'
  });

  test('should validate OTP correctly', async ({ page }) => {
    // Test implementation
    await page.goto('/login');
    await page.fill('[data-testid=phone]', '0812345678');
    await page.click('[data-testid=request-otp]');
    // ... continue test
  });
});
```

#### กิจกรรม:

**Clone Repo และสร้าง Spec**
```bash
# Clone Spec Kit Repository
git clone https://github.com/github/spec-kit.git
cd spec-kit

# Install dependencies
npm install

# Create your first spec
mkdir -p specs
touch specs/my-feature.spec.md
```

**Workshop Activity 3.1: สร้าง Spec File**
```markdown
## สำหรับ PM/BA:
1. สร้างไฟล์ specs/feature-name.spec.md
2. ใช้ template ด้านบน
3. กรอก Business Context และ User Stories
4. ให้ Dev review

## สำหรับ Dev:
1. Review Spec ที่ PM/BA สร้าง
2. เพิ่ม Technical Notes
3. สร้าง Test Cases จาก Spec
4. Run spec validation:
   ```bash
   npm run spec:validate
   npm run spec:test
   ```
```

**รัน Test จาก Spec:**
```bash
# Validate spec format
npm run spec:lint

# Generate tests from spec
npm run spec:generate-tests

# Run all spec tests
npm run spec:test

# Generate coverage report
npm run spec:coverage
```

---

### **ช่วงที่ 4: Playwright Workshop (30 นาที)**

#### PM/BA:
- เข้าใจการทำงานของ End-to-End Test และการ Mapping กับ User Journey
- Review Test Results และ Reports
- ทำความเข้าใจ Test Coverage

**User Journey to E2E Test Mapping:**
```
User Journey: สมัครสมาชิกและซื้อสินค้า
┌──────────────────────────────────────────────────────────┐
│ Step 1: เข้าหน้า Home                                    │
│         └─> test: homepage.spec.ts                       │
│                                                          │
│ Step 2: คลิก "สมัครสมาชิก"                               │
│         └─> test: registration.spec.ts                   │
│                                                          │
│ Step 3: กรอกข้อมูลและยืนยัน                              │
│         └─> test: registration-form.spec.ts              │
│                                                          │
│ Step 4: เข้าสู่ระบบ                                      │
│         └─> test: login.spec.ts                          │
│                                                          │
│ Step 5: เลือกสินค้าและเพิ่มลงตะกร้า                       │
│         └─> test: product-cart.spec.ts                   │
│                                                          │
│ Step 6: ชำระเงิน                                         │
│         └─> test: checkout.spec.ts                       │
│                                                          │
│ Step 7: ได้รับ Confirmation                              │
│         └─> test: order-confirmation.spec.ts             │
└──────────────────────────────────────────────────────────┘
```

#### Dev:
- เขียน Test Case ด้วย Playwright และใช้ Copilot ช่วย Generate Code
- Debug และ Run Tests
- Integration กับ CI/CD

**การติดตั้ง Playwright:**
```bash
# Install Playwright
npm init playwright@latest

# หรือเพิ่มใน project ที่มีอยู่
npm install -D @playwright/test

# Install browsers
npx playwright install
```

**โครงสร้าง Project:**
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

**ตัวอย่าง Test Case พร้อม Copilot:**
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
      .toContainText('OTP หมดอายุ');
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
      .toContainText('บัญชีถูกล็อค');
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

#### กิจกรรม:

**Workshop Activity 4.1: ติดตั้งและรัน Playwright**
```bash
# สร้าง project ใหม่
mkdir playwright-workshop
cd playwright-workshop
npm init -y

# ติดตั้ง Playwright
npm init playwright@latest

# รัน example tests
npx playwright test

# ดู report
npx playwright show-report
```

**Workshop Activity 4.2: เขียน Test Case**
```markdown
## สำหรับทุกคน:

### ขั้นตอนที่ 1: เลือก User Journey
PM/BA: กำหนด User Journey ที่ต้องการ test
- ตัวอย่าง: "ผู้ใช้สามารถค้นหาสินค้าและเพิ่มลงตะกร้าได้"

### ขั้นตอนที่ 2: เขียน Test Steps
PM/BA: เขียน Test Steps เป็นภาษาธรรมชาติ
```markdown
1. เข้าหน้า Home
2. พิมพ์ชื่อสินค้าในช่องค้นหา
3. กดปุ่มค้นหา
4. เลือกสินค้าจากผลลัพธ์
5. กดปุ่มเพิ่มลงตะกร้า
6. ตรวจสอบว่าสินค้าอยู่ในตะกร้า
```

### ขั้นตอนที่ 3: แปลงเป็น Code
Dev: ใช้ Copilot แปลง Steps เป็น Playwright Code
```

**Integration กับ CI/CD:**
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

### **ช่วงที่ 5: Q&A + Best Practices (10 นาที)**

#### การใช้ Copilot Agent อย่างมีประสิทธิภาพ

**Best Practices:**

1. **เขียน Prompt ที่ชัดเจน**
   ```markdown
   ❌ "ช่วยเขียน test"
   ✅ "ช่วยเขียน unit test สำหรับ function validateEmail
       ที่รับ email string และ return boolean
       โดย test ทั้ง valid และ invalid cases"
   ```

2. **ให้ Context เพียงพอ**
   ```markdown
   @copilot Context:
   - ระบบใช้ TypeScript
   - Testing framework: Jest
   - ต้อง cover edge cases

   Task: Generate tests for...
   ```

3. **Review และปรับแต่ง Output**
   - ไม่ใช้ generated code โดยไม่ review
   - ปรับให้เข้ากับ coding standards ของทีม
   - ตรวจสอบ edge cases

#### การ Integrate Spec Kit + Playwright ใน CI/CD

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

#### Tips สำหรับแต่ละ Role

**สำหรับ PM:**
- ใช้ Copilot ช่วยเขียน User Stories และ Acceptance Criteria
- Review Test Coverage Reports เพื่อตรวจสอบความครบถ้วน
- ติดตาม Test Results ใน GitHub Actions

**สำหรับ BA:**
- ใช้ Spec Kit สร้าง Specification ที่ชัดเจน
- Map User Journey กับ Test Cases
- Collaborate กับ Dev ในการ Review Specs

**สำหรับ Dev:**
- ใช้ Copilot Generate Tests จาก Specs
- Integrate Playwright กับ CI/CD Pipeline
- Auto-generate Code จาก Acceptance Criteria

---

## ✅ สิ่งที่ต้องเตรียม

### สำหรับทุกคน:
- [ ] GitHub Account + เปิดใช้งาน Copilot Agent
- [ ] VS Code + GitHub Copilot Extension
- [ ] Node.js (v18+) + npm
- [ ] Git installed และ configured

### สำหรับ Dev:
- [ ] ติดตั้ง Playwright:
  ```bash
  npm init playwright@latest
  ```
- [ ] Clone Spec Kit Repository:
  ```bash
  git clone https://github.com/github/spec-kit
  cd spec-kit && npm install
  ```
- [ ] ตัวอย่าง Web App สำหรับทดสอบ (local หรือ staging)

### Environment Check:
```bash
# ตรวจสอบ Node.js version
node --version  # ควรเป็น v18 ขึ้นไป

# ตรวจสอบ npm
npm --version

# ตรวจสอบ git
git --version

# ตรวจสอบ Playwright (หลังติดตั้ง)
npx playwright --version
```

---

## ✅ Workshop Checklist

### ก่อน Workshop:
- [ ] ทุกคนมี GitHub account และ access ถูกต้อง
- [ ] Copilot license activated
- [ ] IDE และ extensions พร้อมใช้งาน
- [ ] Repository ที่ใช้ workshop สร้างเรียบร้อย

### ระหว่าง Workshop:
- [ ] Demo Copilot Agent ทำงานได้
- [ ] ทุกคนสามารถสร้าง Issue และใช้ Copilot ได้
- [ ] PM/BA สร้าง Spec ได้สำเร็จ
- [ ] Dev รัน Playwright tests ได้

### หลัง Workshop:
- [ ] เก็บ feedback จากผู้เข้าร่วม
- [ ] รวบรวม Best Practices ที่พบ
- [ ] อัปเดต documentation
- [ ] วางแผน follow-up sessions

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
- [Playwright Documentation](https://playwright.dev/)

### Video Tutorials:
- GitHub Copilot Agent Overview
- Spec Kit Getting Started
- Playwright for Beginners

### Sample Repositories:
- Spec Kit Examples
- Playwright Test Examples
- E2E Testing Best Practices

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
