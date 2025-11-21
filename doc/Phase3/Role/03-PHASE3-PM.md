# Phase 3: Security Workshop - Project Manager (PM) Role

**Role**: Project Manager
**Phase Duration**: November 24-28, 2025 (5 days)
**Prerequisites**: Completion of Phase 1 and Phase 2

---

## Overview

ในฐานะ Project Manager คุณจะรับผิดชอบในการกำหนดนโยบายความปลอดภัย, วางแผน Branch Protection Rules, และจัดทำแผนแก้ไขช่องโหว่ (Vulnerability Remediation Plan) รวมถึงการประสานงานกับทีมเพื่อให้แน่ใจว่าโครงการมีความปลอดภัยตามมาตรฐาน

---

## Tasks Overview

| Task | Description | Duration | Priority |
|------|-------------|----------|----------|
| Task 1 | Define Security and Branch Protection Policies | 3-4 hours | High |
| Task 2 | Review Impact and Vulnerability Remediation Plan | 2-3 hours | High |
| Task 3 | Configure GitHub Advanced Security Settings | 2-3 hours | Medium |
| Task 4 | Setup Security Monitoring Dashboard | 1-2 hours | Medium |

---

## Task 1: Define Security and Branch Protection Policies

### Objectives
- ออกแบบ Branch Protection Rules
- กำหนด Code Review Policy
- วางแผน Security Compliance

### Preparation Checklist
- [ ] ศึกษา GitHub Branch Protection Features
- [ ] กำหนด Code Review Requirements
- [ ] วางแผน Compliance Requirements
- [ ] เตรียม Security Policy Document

### Step-by-Step Guide

#### 1.1 Branch Protection Rules Design

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

**Feature Branches Pattern**
```
Pattern: feature/*
✅ Require pull request before merging
  ✅ Require approvals (1)
✅ Require status checks to pass
✅ Delete branch on merge
```

#### 1.2 Configure Branch Protection in GitHub

**Navigation**:
```
Repository → Settings → Branches → Add rule
```

**Configuration Steps**:

1. **Add Branch Protection Rule**
   - Branch name pattern: `main`
   - Enable all required settings as defined above

2. **Add Develop Branch Rule**
   - Branch name pattern: `develop`
   - Apply less strict rules

3. **Add Feature Branch Rule**
   - Branch name pattern: `feature/*`
   - Apply minimal protection rules

#### 1.3 Create CODEOWNERS File

สร้างไฟล์ `.github/CODEOWNERS`:

```
# Default owners for everything
*       @team-leads

# Frontend code
/src/frontend/     @frontend-team
/src/components/   @frontend-team
*.tsx              @frontend-team
*.css              @frontend-team

# Backend code
/src/backend/      @backend-team
/src/api/          @backend-team
*.java             @backend-team

# DevOps and Infrastructure
/.github/          @devops-team
/terraform/        @devops-team
/k8s/              @devops-team
Dockerfile         @devops-team

# Documentation
/docs/             @tech-writers
*.md               @tech-writers

# Critical configuration files
package.json       @tech-leads @devops-team
package-lock.json  @tech-leads @devops-team
.env.example       @devops-team @security-team

# Security-sensitive files
/src/auth/         @security-team @tech-leads
/src/security/     @security-team
```

#### 1.4 Define Code Review Policy

**Mandatory Reviews**
- All PRs require at least 1 approval
- PRs to main require 2 approvals
- At least one reviewer must be from CODEOWNERS
- Reviews must be from team members (not PR author)

**Review Guidelines Document**

สร้างไฟล์ `CODE_REVIEW_GUIDELINES.md`:

```markdown
# Code Review Guidelines

## Review Checklist

### Code Quality
- [ ] Code follows team coding standards
- [ ] No duplicate code (DRY principle)
- [ ] Functions are small and focused
- [ ] Variable names are meaningful
- [ ] Comments explain "why" not "what"

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS prevention measures
- [ ] Authentication/Authorization checks

### Testing
- [ ] Unit tests added/updated
- [ ] Test coverage maintained (>80%)
- [ ] Edge cases covered
- [ ] Tests are meaningful (not just coverage)

### Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Inline comments where necessary
- [ ] CHANGELOG updated for features

### Performance
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Async operations handled properly

## Review Response Time
- Critical/Security PRs: Within 4 hours
- High Priority PRs: Within 24 hours
- Normal PRs: Within 48 hours
- Low Priority PRs: Within 1 week
```

### Deliverables
- [ ] Branch protection rules configured
- [ ] CODEOWNERS file created
- [ ] Security policy document
- [ ] Code review guidelines

---

## Task 2: Review Impact and Vulnerability Remediation Plan

### Objectives
- ประเมินความรุนแรงของช่องโหว่ที่พบ
- จัดลำดับความสำคัญในการแก้ไข
- วางแผน Timeline สำหรับการแก้ไข

### Vulnerability Assessment Framework

#### Severity Levels

**Critical (CVSS 9.0-10.0)**
- Remote code execution
- Authentication bypass
- Data breach potential
- **Timeline**: Fix immediately (< 24 hours)
- **Example**: SQL Injection in login, RCE vulnerabilities

**High (CVSS 7.0-8.9)**
- Privilege escalation
- SQL injection
- XSS vulnerabilities
- **Timeline**: Fix within 7 days
- **Example**: Stored XSS, IDOR vulnerabilities

**Medium (CVSS 4.0-6.9)**
- Information disclosure
- CSRF vulnerabilities
- Weak cryptography
- **Timeline**: Fix within 30 days
- **Example**: Sensitive data in logs, weak password policy

**Low (CVSS 0.1-3.9)**
- Minor information leaks
- Non-critical issues
- **Timeline**: Fix in next release
- **Example**: Missing security headers, verbose error messages

#### Priority Matrix

```
Priority = Severity × Exploitability × Business Impact

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

### Vulnerability Tracking with GitHub Projects

**Create Security Project Board**

Navigate to: `Projects → New project → Board`

**Columns**:
1. **New** - Unreviewed vulnerabilities
2. **Triaged** - Assessed and categorized
3. **In Progress** - Being fixed
4. **Testing** - Under verification
5. **Resolved** - Fixed and verified
6. **False Positive** - Not applicable

**Custom Fields**:
- Severity (Critical/High/Medium/Low)
- CVSS Score
- CVE ID (if applicable)
- Affected Component
- Assigned Team
- Due Date

### Remediation Plan Template

```markdown
## Vulnerability: [CVE-XXXX-XXXXX or Internal ID]

### Description
Brief description of the vulnerability

### Severity: [Critical/High/Medium/Low]
CVSS Score: [X.X]

### Affected Components
- Package: package-name@version
- Files: /src/path/to/file.js
- Environments: Production, Staging

### Impact Assessment
- Who is affected: [All users / Admin users / Specific feature users]
- Data at risk: [Customer data / Internal data / None]
- Service impact: [Service down / Degraded / None]

### Remediation Plan
1. [Step 1: What needs to be done]
2. [Step 2: Code changes required]
3. [Step 3: Testing requirements]
4. [Step 4: Deployment plan]

### Timeline
- Discovery: [Date]
- Triage: [Date] - [Duration]
- Fix Development: [Date] - [Duration]
- Testing: [Date] - [Duration]
- Production Deployment: [Date]

### Assignee
- Primary: @developer-name
- Reviewer: @security-team

### Verification
- [ ] Unit tests pass
- [ ] Security scan passes
- [ ] Manual penetration test
- [ ] Deployed to staging
- [ ] Deployed to production
- [ ] Monitoring confirms fix

### Post-Fix Actions
- [ ] Update documentation
- [ ] Team notification
- [ ] Incident report (if critical)
```

### Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| Time to Triage | < 24 hours | - |
| Critical Fix Time | < 24 hours | - |
| High Fix Time | < 7 days | - |
| Medium Fix Time | < 30 days | - |
| Open Vulnerabilities | 0 critical/high | - |
| False Positive Rate | < 10% | - |

### Deliverables
- [ ] Vulnerability assessment report
- [ ] Prioritized remediation backlog
- [ ] Remediation timeline
- [ ] Resource allocation plan
- [ ] Progress tracking dashboard

---

## Task 3: Configure GitHub Advanced Security Settings

### Objectives
- เปิดใช้งาน GitHub Advanced Security
- ตั้งค่า Code Scanning
- กำหนด Security Alerts Configuration

### GitHub Advanced Security Features

**Features to Enable**:
```
Repository → Settings → Code security and analysis

✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
✅ Secret scanning
✅ Push protection
✅ Code scanning
```

### Security Policy Configuration

สร้างไฟล์ `SECURITY.md` ใน repository:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.x.x   | :white_check_mark: |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability:

### Do NOT
- Open a public GitHub issue
- Share details on social media
- Exploit the vulnerability

### Do
1. **Email**: security@company.com
2. **Encrypt** sensitive details using our PGP key
3. **Include**:
   - Type of vulnerability
   - Steps to reproduce
   - Affected versions
   - Potential impact

### Response Timeline
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Resolution Target**: Based on severity
  - Critical: 24 hours
  - High: 7 days
  - Medium: 30 days
  - Low: Next release

### Recognition
We maintain a security hall of fame for responsible disclosure.
Contributors will be credited (with permission) in our security advisories.

## Security Measures

- All code reviewed before merge
- Automated security scanning (CodeQL, Dependabot)
- Regular penetration testing
- Employee security training
- Incident response procedures

## Contact

- Security Team: security@company.com
- PGP Key: [Link to PGP key]
```

### Deliverables
- [ ] GitHub Advanced Security enabled
- [ ] Security policy created
- [ ] Alert notification configured
- [ ] Security team trained on features

---

## Task 4: Setup Security Monitoring Dashboard

### Objectives
- สร้าง Dashboard สำหรับติดตาม Security Metrics
- ตั้งค่า Alerts และ Notifications
- กำหนด Reporting Schedule

### Dashboard Components

**Key Metrics to Display**:
1. Open Vulnerabilities by Severity
2. Time to Resolution (Average)
3. Security Scan Status
4. Dependabot Alerts Status
5. Code Scanning Findings
6. Secret Scanning Alerts

### GitHub Security Overview

Access at: `Organization → Security → Overview`

**Available Views**:
- Security alerts across repositories
- Dependabot alerts summary
- Code scanning alerts summary
- Secret scanning alerts summary

### Notification Configuration

**Slack Integration for Security Alerts**:

```yaml
# .github/workflows/security-notification.yml
name: Security Alert Notification

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  security-report:
    runs-on: ubuntu-latest
    steps:
    - name: Get Security Summary
      run: |
        # Generate security report
        echo "Security Report for $(date)"

    - name: Send to Slack
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "Weekly Security Report",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": "Weekly Security Report"
                }
              },
              {
                "type": "section",
                "fields": [
                  {"type": "mrkdwn", "text": "*Critical:* 0"},
                  {"type": "mrkdwn", "text": "*High:* 2"},
                  {"type": "mrkdwn", "text": "*Medium:* 5"},
                  {"type": "mrkdwn", "text": "*Low:* 8"}
                ]
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}
```

### Weekly Security Report Template

```markdown
# Weekly Security Report

**Period**: [Start Date] - [End Date]
**Generated**: [Date]

## Summary

| Severity | Open | Closed This Week | New This Week |
|----------|------|------------------|---------------|
| Critical | 0    | 0                | 0             |
| High     | 2    | 3                | 1             |
| Medium   | 5    | 2                | 0             |
| Low      | 8    | 1                | 2             |

## Key Highlights
- [Highlight 1]
- [Highlight 2]

## Action Items
1. [Action item 1] - Assigned to: @name - Due: [Date]
2. [Action item 2] - Assigned to: @name - Due: [Date]

## Next Week Focus
- [Focus area 1]
- [Focus area 2]
```

### Deliverables
- [ ] Security dashboard configured
- [ ] Alert notifications set up
- [ ] Weekly report automation
- [ ] Team training on dashboard usage

---

## GitHub Enterprise Features for PM

### GitHub Codespaces for Secure Development

**Benefits for PM**:
- Pre-configured secure development environments
- Standardized tooling across team
- No sensitive data on local machines
- Audit trail of development activities

**Configuration**:
```json
// .devcontainer/devcontainer.json
{
  "name": "Secure Development Environment",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "GitHub.copilot",
        "GitHub.vscode-pull-request-github",
        "ms-azuretools.vscode-docker"
      ]
    }
  },
  "postCreateCommand": "npm install",
  "forwardPorts": [3000],
  "secrets": {
    "API_KEY": {
      "description": "API Key for external service"
    }
  }
}
```

### GitHub Actions for Compliance

**Automated Compliance Checks**:
```yaml
name: Compliance Check

on:
  pull_request:
    branches: [main]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: License Compliance
      run: npx license-checker --summary

    - name: Security Policy Check
      run: |
        if [ ! -f "SECURITY.md" ]; then
          echo "SECURITY.md is required"
          exit 1
        fi

    - name: CODEOWNERS Check
      run: |
        if [ ! -f ".github/CODEOWNERS" ]; then
          echo "CODEOWNERS file is required"
          exit 1
        fi
```

---

## Workshop Activities for PM

### Activity 1: Branch Protection Setup (1 hour)
- Configure protection rules for main branch
- Test PR requirements
- Validate CODEOWNERS

### Activity 2: Vulnerability Assessment (1.5 hours)
- Review sample vulnerability report
- Prioritize vulnerabilities
- Create remediation plan

### Activity 3: Security Dashboard (1 hour)
- Configure security alerts
- Set up notifications
- Create weekly report template

### Activity 4: Policy Documentation (1 hour)
- Create security policy
- Document code review guidelines
- Define incident response procedure

---

## Success Criteria for PM

- [ ] Branch protection rules active and tested
- [ ] CODEOWNERS file created and working
- [ ] Security policies documented and communicated
- [ ] Vulnerability tracking system operational
- [ ] Security dashboard configured
- [ ] Team trained on security processes
- [ ] Weekly reporting established

---

## Resources

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Security Overview](https://docs.github.com/en/code-security/security-overview/about-the-security-overview)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)

---

**Related Documents**:
- [Phase 3 Main Document](../03-PHASE3-SECURITY.md)
- [Developer Role](./03-PHASE3-DEV.md)
- [QA Role](./03-PHASE3-QA.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
