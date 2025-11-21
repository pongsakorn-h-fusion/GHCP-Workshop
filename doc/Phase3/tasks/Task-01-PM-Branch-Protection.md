# Task 1: Define Security and Branch Protection Policies

**Role**: Project Manager (PM)
**Estimated Time**: 3-4 hours
**Feature**: General Copilot Usage / GitHub Enterprise Security

---

## Objectives

- ออกแบบ Branch Protection Rules สำหรับทุก Branch
- กำหนด Code Review Policy
- สร้าง CODEOWNERS file
- วางแผน Security Compliance

## Prerequisites

- GitHub Enterprise Cloud account with admin permissions
- Repository with established branch structure
- Understanding of team roles and responsibilities
- Completion of Phase 1 and Phase 2

---

## Step 1: Design Branch Protection Strategy

### 1.1 Understanding Branch Protection Rules

Branch Protection Rules ช่วยป้องกันการเปลี่ยนแปลงที่ไม่พึงประสงค์บน branches ที่สำคัญ

**Available Protection Options**:
| Option | Description |
|--------|-------------|
| Require pull request | ต้องสร้าง PR ก่อน merge |
| Require approvals | ต้องมีการ approve จำนวนที่กำหนด |
| Dismiss stale reviews | ยกเลิก approval เมื่อมี commit ใหม่ |
| Require review from CODEOWNERS | ต้องได้รับ approval จาก code owners |
| Require status checks | ต้องผ่าน CI/CD checks |
| Require branches to be up to date | Branch ต้อง update กับ base branch |
| Require conversation resolution | ต้อง resolve ทุก conversation |
| Require signed commits | ต้อง sign commits |
| Require linear history | ไม่อนุญาต merge commits |
| Include administrators | บังคับใช้กับ admin ด้วย |
| Restrict who can push | จำกัดผู้ที่สามารถ push |
| Allow force pushes | อนุญาต force push |
| Allow deletions | อนุญาตลบ branch |

### 1.2 Branch Protection Matrix

| Branch | Approvals | Status Checks | Up-to-date | Signed | Force Push |
|--------|-----------|---------------|------------|--------|------------|
| main | 2 | Required | Yes | Yes | No |
| develop | 1 | Required | No | No | No |
| feature/* | 1 | Required | No | No | No |
| release/* | 2 | Required | Yes | Yes | No |
| hotfix/* | 1 | Required | No | No | No |

---

## Step 2: Configure Main Branch Protection

### 2.1 Navigate to Branch Protection

```
Repository → Settings → Branches → Add rule
```

### 2.2 Main Branch Configuration

**Branch name pattern**: `main`

**Pull Request Requirements**:
```
✅ Require a pull request before merging
   ✅ Require approvals: 2
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require review from Code Owners
   ✅ Require approval of the most recent reviewable push
```

**Status Checks**:
```
✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging

Required status checks:
- CI
- Tests
- Security Scan
- Code Coverage
```

**Additional Settings**:
```
✅ Require conversation resolution before merging
✅ Require signed commits
✅ Require linear history
✅ Do not allow bypassing the above settings
```

**Push Restrictions**:
```
✅ Restrict who can push to matching branches
   Allowed: Repository Administrators only

❌ Allow force pushes
❌ Allow deletions
```

### 2.3 Verification

After saving, verify the protection is active:
- Try to push directly to main (should fail)
- Create a PR without approvals (merge button should be disabled)

---

## Step 3: Configure Develop Branch Protection

### 3.1 Develop Branch Configuration

**Branch name pattern**: `develop`

**Pull Request Requirements**:
```
✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed
```

**Status Checks**:
```
✅ Require status checks to pass before merging
   ❌ Require branches to be up to date before merging

Required status checks:
- CI
- Tests
```

**Additional Settings**:
```
✅ Require conversation resolution before merging
❌ Require signed commits
❌ Require linear history
❌ Do not allow bypassing the above settings
```

**Push Restrictions**:
```
❌ Restrict who can push to matching branches
❌ Allow force pushes
❌ Allow deletions
```

---

## Step 4: Configure Feature Branch Protection

### 4.1 Feature Branch Configuration

**Branch name pattern**: `feature/*`

**Pull Request Requirements**:
```
✅ Require a pull request before merging
   ✅ Require approvals: 1
```

**Status Checks**:
```
✅ Require status checks to pass before merging
   ❌ Require branches to be up to date before merging

Required status checks:
- CI
- Tests
```

**Additional Settings**:
```
❌ Require conversation resolution before merging
❌ Require signed commits
❌ Require linear history
```

**Push Restrictions**:
```
❌ Allow force pushes
✅ Allow deletions (after merge)
```

---

## Step 5: Create CODEOWNERS File

### 5.1 Create the File

สร้างไฟล์ `.github/CODEOWNERS` ใน repository:

```
# ========================================
# CODEOWNERS for [Project Name]
# ========================================
# These owners will be automatically requested for review
# when someone opens a pull request that modifies code they own.

# ----------------------------------------
# Default Owners (for everything not specified below)
# ----------------------------------------
*                           @tech-leads

# ----------------------------------------
# Frontend Code
# ----------------------------------------
/src/frontend/              @frontend-team @frontend-lead
/src/components/            @frontend-team
/src/styles/                @frontend-team
/src/pages/                 @frontend-team
*.tsx                       @frontend-team
*.jsx                       @frontend-team
*.css                       @frontend-team
*.scss                      @frontend-team

# ----------------------------------------
# Backend Code
# ----------------------------------------
/src/backend/               @backend-team @backend-lead
/src/api/                   @backend-team
/src/services/              @backend-team
/src/models/                @backend-team
/src/controllers/           @backend-team
*.java                      @backend-team
*.go                        @backend-team

# ----------------------------------------
# Database
# ----------------------------------------
/src/database/              @database-team @dba-lead
/migrations/                @database-team @dba-lead
*.sql                       @database-team

# ----------------------------------------
# DevOps & Infrastructure
# ----------------------------------------
/.github/                   @devops-team
/.github/workflows/         @devops-team @security-team
/terraform/                 @devops-team @infra-lead
/kubernetes/                @devops-team
/k8s/                       @devops-team
/helm/                      @devops-team
/docker/                    @devops-team
Dockerfile                  @devops-team
docker-compose*.yml         @devops-team
*.tf                        @devops-team @infra-lead

# ----------------------------------------
# Security-Sensitive Files
# ----------------------------------------
/src/auth/                  @security-team @tech-leads
/src/security/              @security-team
/src/middleware/auth*       @security-team
.env.example                @devops-team @security-team
SECURITY.md                 @security-team

# ----------------------------------------
# Documentation
# ----------------------------------------
/docs/                      @tech-writers @tech-leads
*.md                        @tech-writers
README.md                   @tech-leads
CONTRIBUTING.md             @tech-leads
CHANGELOG.md                @tech-leads

# ----------------------------------------
# Configuration Files
# ----------------------------------------
package.json                @tech-leads @devops-team
package-lock.json           @tech-leads @devops-team
tsconfig.json               @tech-leads
.eslintrc*                  @tech-leads
.prettierrc*                @tech-leads
jest.config.*               @qa-team

# ----------------------------------------
# Tests
# ----------------------------------------
/tests/                     @qa-team
/test/                      @qa-team
/__tests__/                 @qa-team
*.test.ts                   @qa-team
*.test.js                   @qa-team
*.spec.ts                   @qa-team
*.spec.js                   @qa-team
/cypress/                   @qa-team
/e2e/                       @qa-team
```

### 5.2 CODEOWNERS Best Practices

1. **Use Teams, Not Individual Users**
   - Teams scale better as people join/leave
   - Easier to manage permissions

2. **Order Matters**
   - Later patterns override earlier ones
   - Put specific patterns after general ones

3. **Test Your Patterns**
   ```bash
   # Check which owners apply to a file
   git check-attr -a path/to/file
   ```

4. **Keep It Updated**
   - Review quarterly
   - Update when team structure changes

---

## Step 6: Define Code Review Policy

### 6.1 Create Code Review Guidelines

สร้างไฟล์ `docs/CODE_REVIEW_GUIDELINES.md`:

```markdown
# Code Review Guidelines

## Purpose

Code reviews are essential for:
- Maintaining code quality
- Knowledge sharing
- Finding bugs early
- Ensuring security compliance

## Review Requirements

### PR Types and Required Approvals

| PR Type | Approvals | Reviewers |
|---------|-----------|-----------|
| Feature (main) | 2 | CODEOWNERS + Tech Lead |
| Feature (develop) | 1 | CODEOWNERS |
| Hotfix | 1 | Tech Lead |
| Documentation | 1 | Any team member |

### Response Time SLA

| Priority | Response Time |
|----------|--------------|
| Critical/Security | 4 hours |
| High | 24 hours |
| Normal | 48 hours |
| Low | 1 week |

## Review Checklist

### Code Quality
- [ ] Code follows team style guide
- [ ] No duplicate code
- [ ] Functions are focused and small
- [ ] Variable names are meaningful
- [ ] No commented-out code

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication checks in place

### Testing
- [ ] Unit tests added/updated
- [ ] Test coverage maintained (>80%)
- [ ] Edge cases tested
- [ ] Integration tests if needed

### Documentation
- [ ] README updated if needed
- [ ] API docs updated
- [ ] Comments explain "why"
- [ ] CHANGELOG updated

### Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms used
- [ ] No memory leaks
- [ ] Async properly handled

## Review Process

### For Reviewers

1. **Understand the Context**
   - Read the PR description
   - Check linked issues
   - Understand the goal

2. **Review the Code**
   - Check logic and flow
   - Verify security measures
   - Look for edge cases
   - Review test coverage

3. **Provide Feedback**
   - Be constructive
   - Explain your reasoning
   - Suggest alternatives
   - Use "Suggestion:" prefix for optional changes

4. **Approve or Request Changes**
   - Approve if all criteria met
   - Request changes with clear explanation
   - Don't block for minor issues

### For PR Authors

1. **Before Requesting Review**
   - Self-review your changes
   - Run all tests locally
   - Update documentation
   - Write clear PR description

2. **During Review**
   - Respond to all comments
   - Ask for clarification if needed
   - Make requested changes promptly
   - Re-request review after changes

3. **After Approval**
   - Squash commits if needed
   - Ensure CI passes
   - Merge promptly
   - Delete branch after merge

## Review Types

### Standard Review
- Full code review
- All checklist items
- Used for features and bug fixes

### Quick Review
- Focused review
- Critical items only
- Used for documentation and small changes

### Security Review
- Security-focused review
- Required for auth/security code
- Involves security team
```

---

## Step 7: Document Security Policy

### 7.1 Create SECURITY.md

สร้างไฟล์ `SECURITY.md` ใน root ของ repository:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.x.x   | :white_check_mark: |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. Thank you for helping keep our project safe.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

**Instead, please:**

1. **Email**: security@yourcompany.com
2. **PGP Key**: [Link to public key]
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Affected versions
   - Potential impact
   - Any suggested fixes

### What to Expect

| Stage | Timeline |
|-------|----------|
| Acknowledgment | Within 48 hours |
| Initial Assessment | Within 5 business days |
| Status Update | Weekly until resolved |
| Fix Timeline | Based on severity |

### Severity Response Times

| Severity | Fix Timeline |
|----------|--------------|
| Critical | 24 hours |
| High | 7 days |
| Medium | 30 days |
| Low | Next release |

### Recognition

We maintain a security hall of fame. With your permission:
- Your name will be credited in our security advisories
- You may be eligible for our bug bounty program

## Security Practices

### Code Security
- All code reviewed before merge
- Automated security scanning (CodeQL, Dependabot)
- No secrets in code (use environment variables)
- Input validation required

### Access Control
- Principle of least privilege
- Regular access reviews
- MFA required for all accounts
- Service accounts rotated quarterly

### Monitoring
- 24/7 security monitoring
- Incident response procedures in place
- Regular penetration testing
- Security audits annually

## Contact

- **Security Team**: security@yourcompany.com
- **Emergency**: +1-XXX-XXX-XXXX (24/7 hotline)
```

---

## Step 8: Validation and Testing

### 8.1 Test Branch Protection Rules

**Test Scenario 1: Direct Push to Main**
```bash
# Should fail
git checkout main
echo "test" > test.txt
git add test.txt
git commit -m "Test commit"
git push origin main

# Expected: Permission denied
```

**Test Scenario 2: PR Without Approvals**
```bash
# Create branch and PR
git checkout -b feature/test-protection
echo "test" > test.txt
git add test.txt
git commit -m "Test commit"
git push origin feature/test-protection

# Create PR via GitHub
# Expected: Merge button disabled until approvals received
```

**Test Scenario 3: PR with Failing Checks**
- Create PR with intentional test failure
- Expected: Merge blocked with "Checks failing" message

### 8.2 Validation Checklist

**Branch Protection**:
- [ ] Main branch protected
- [ ] Develop branch protected
- [ ] Feature branches have rules
- [ ] Direct push blocked
- [ ] Force push blocked
- [ ] Branch deletion prevented

**CODEOWNERS**:
- [ ] File created correctly
- [ ] Teams assigned properly
- [ ] PR auto-assigns reviewers
- [ ] Required review working

**Documentation**:
- [ ] SECURITY.md created
- [ ] Code review guidelines documented
- [ ] Team notified of policies

---

## Deliverables

✅ **Completed Deliverables**:
1. Branch protection rules for main, develop, feature/*
2. CODEOWNERS file
3. Code review guidelines
4. Security policy document

📋 **Documentation Created**:
- Branch protection configuration
- CODEOWNERS mappings
- CODE_REVIEW_GUIDELINES.md
- SECURITY.md

---

## Common Issues & Solutions

### Issue: CODEOWNERS not working
**Solution**:
- Ensure file is in `.github/CODEOWNERS` or `/CODEOWNERS`
- Check team names are correct (use @org/team-name)
- Verify branch protection requires CODEOWNERS review

### Issue: Status checks not appearing
**Solution**:
- Run workflow at least once
- Status check names must match exactly
- Check workflow is triggering on correct events

### Issue: Admins can bypass rules
**Solution**:
- Enable "Do not allow bypassing the above settings"
- Note: This applies to admin users too

---

## Next Steps

- [ ] Monitor rule effectiveness
- [ ] Review quarterly
- [ ] Update as team changes
- [ ] Train team on policies

---

**Related Tasks**:
- Next: [Task 2: Vulnerability Remediation Plan](Task-02-PM-Vulnerability-Plan.md)
- See also: [Developer Branch Protection](Task-03-DEV-Dependabot.md)

---

**Prepared by**: PM Team
**Last Updated**: November 2025
**Version**: 1.0
