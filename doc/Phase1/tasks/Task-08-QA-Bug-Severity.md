# Task 8: Define Bug Labels and Severity Levels

**Role**: QA (Quality Assurance)
**Estimated Time**: 1-2 hours
**Feature**: General Copilot Usage

---

## Objective

Establish clear bug severity definitions and labeling system to ensure consistent bug classification, prioritization, and resolution across the team.

## Prerequisites

- Repository with Issues enabled
- Understanding of bug lifecycle
- Team agreement on severity definitions
- Access to create GitHub labels

---

## Overview

This task creates:
1. **Bug Severity Guide** - Detailed classification system
2. **Bug Triage Workflow** - Process for handling bugs
3. **Bug Report Template** - Structured bug reporting
4. **GitHub Labels** - Visual bug classification
5. **SLA Definitions** - Response and resolution targets

---

## Step 1: Define Severity Levels

### 1.1 Create Severity Documentation

Create `docs/BUG_SEVERITY_GUIDE.md`:

````markdown
# Bug Severity and Priority Guide

## Overview

This document defines how to classify bugs by severity and priority to ensure consistent triaging and resolution.

## Severity Levels

Severity indicates the **impact** of the bug on the system.

### Critical (P0)

**Definition**: System is completely unusable or data is at risk

**Examples:**
- Application crashes on startup
- Data loss or corruption
- Security vulnerabilities (authentication bypass, data breach)
- Payment processing failures
- Database connection failures
- Complete service outage

**SLA**: Fix within **4 hours**
**Response Time**: **15 minutes**

**Required Actions:**
- Immediate notification to team leads
- Stop all other work if necessary
- May require hotfix deployment

**Example Bug Report:**
```
Title: [CRITICAL] Application crashes when user attempts login

Description: The application crashes immediately when any user
clicks the login button. Stack trace shows null pointer exception
in authentication service. This affects 100% of users.

Impact: All users unable to access the system
Severity: Critical (P0)
```

### High (P1)

**Definition**: Major feature is not working, significant impact

**Examples:**
- Key feature completely broken
- Major workflow interrupted
- API endpoint returns 500 errors
- Search functionality not working
- File upload fails for all users
- Critical report generation fails

**SLA**: Fix within **24 hours**
**Response Time**: **2 hours**

**Required Actions:**
- Assign to senior developer immediately
- Schedule fix for same day
- May require priority deployment

**Example Bug Report:**
```
Title: [HIGH] Users cannot upload profile pictures

Description: When users try to upload a profile picture,
the upload fails with a 500 error. Error logs show S3
connection timeout. Workaround: None available.

Impact: Users cannot complete profile setup
Severity: High (P1)
```

### Medium (P2)

**Definition**: Feature partially works or has a workaround

**Examples:**
- Feature works but has issues in edge cases
- UI element misaligned
- Non-critical validation errors
- Performance degradation (not severe)
- Minor data inconsistencies
- Error messages unclear

**SLA**: Fix within **3 days**
**Response Time**: **1 day**

**Required Actions:**
- Schedule fix in current sprint
- Document workaround if available

**Example Bug Report:**
```
Title: [MEDIUM] Date picker shows wrong format on Safari

Description: The date picker displays MM/DD/YYYY instead of
DD/MM/YYYY on Safari browser. Works correctly on Chrome and Firefox.
Workaround: Users can manually type date in correct format.

Impact: Minor UX issue for Safari users
Severity: Medium (P2)
```

### Low (P3)

**Definition**: Minor issue with minimal impact

**Examples:**
- Cosmetic issues
- Typos in non-critical areas
- Minor UI alignment issues
- Enhancement suggestions
- Documentation errors
- Logging improvements

**SLA**: Fix in **next release**
**Response Time**: **3 days**

**Required Actions:**
- Add to backlog
- Fix when convenient

**Example Bug Report:**
```
Title: [LOW] Button text has typo

Description: Submit button says "Sumbit" instead of "Submit"
on the contact form.

Impact: Cosmetic issue only
Severity: Low (P3)
```

## Priority vs Severity Matrix

Priority determines **when** the bug should be fixed (urgency).
Severity determines **impact** on the system.

| Severity | Business Impact | Workaround | Priority |
|----------|----------------|------------|----------|
| Critical | High | No | P0 |
| Critical | Low | Yes | P1 |
| High | High | No | P1 |
| High | Medium | Yes | P2 |
| Medium | Any | Any | P2 |
| Low | Any | Any | P3 |

## Bug Classification Flowchart

```
START
  ↓
Is system unusable? → YES → Critical (P0)
  ↓ NO
Is major feature broken? → YES → High (P1)
  ↓ NO
Is there a workaround? → YES → Medium (P2)
  ↓ NO
Is it a minor issue? → YES → Low (P3)
  ↓
END
```

## Examples by Category

### Data & Security

| Issue | Severity |
|-------|----------|
| Data loss | Critical |
| SQL injection vulnerability | Critical |
| Unauthorized data access | Critical |
| Data not saving | High |
| Data validation missing | Medium |
| Data format inconsistent | Low |

### Functionality

| Issue | Severity |
|-------|----------|
| Core feature completely broken | High |
| Feature works but errors in edge case | Medium |
| Feature enhancement needed | Low |
| Feature UI needs improvement | Low |

### Performance

| Issue | Severity |
|-------|----------|
| Application unresponsive | Critical |
| Page load > 10 seconds | High |
| Page load 3-5 seconds | Medium |
| Minor performance improvement | Low |

### UI/UX

| Issue | Severity |
|-------|----------|
| UI completely broken | High |
| UI element misaligned | Medium |
| Inconsistent styling | Low |
| Color scheme suggestion | Low |

## Bug Lifecycle

```
New → Triaged → In Progress → Testing → Resolved → Closed
        ↓
    Won't Fix / Duplicate
```

### Status Definitions

- **New**: Bug just reported, not yet reviewed
- **Triaged**: Bug reviewed and severity assigned
- **In Progress**: Developer is fixing the bug
- **Testing**: Fix is being tested by QA
- **Resolved**: Fix verified and ready for release
- **Closed**: Fix deployed to production
- **Won't Fix**: Decided not to fix (with justification)
- **Duplicate**: Same as another reported bug

## Triage Guidelines

### Questions to Ask

1. **Can users work around it?**
   - No workaround → Higher severity
   - Easy workaround → Lower severity

2. **How many users affected?**
   - All users → Higher severity
   - Specific use case → Lower severity

3. **Is data at risk?**
   - Data loss/corruption → Critical
   - Data display issue → Lower severity

4. **What is the business impact?**
   - Revenue impact → Higher priority
   - Cosmetic issue → Lower priority

### Escalation Criteria

Escalate to tech lead if:
- Severity is Critical or High
- Multiple users reporting same issue
- Issue affects production
- Unsure about severity classification

## Bug Report Quality Checklist

A good bug report includes:

- [ ] Clear, descriptive title with severity
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Environment details (browser, OS, version)
- [ ] Screenshots or error logs
- [ ] Impact assessment
- [ ] Workaround (if any)

### Good Bug Report Example

```markdown
# [HIGH] User profile update fails with 500 error

## Description
When users attempt to update their profile information,
the request fails with a 500 Internal Server Error.

## Steps to Reproduce
1. Log in as any user
2. Navigate to Profile Settings
3. Update any field (name, email, bio)
4. Click "Save Changes" button
5. Observe error message

## Expected Behavior
- Profile should be updated successfully
- Success message should be displayed
- Updated information should be visible

## Actual Behavior
- 500 Internal Server Error displayed
- Profile not updated
- Error logged: "Database connection timeout"

## Environment
- Browser: Chrome 119.0
- OS: Windows 11
- Environment: Production
- User Role: All users

## Impact
- Affects: All users (1000+ users)
- Business Impact: Users cannot update profiles
- Workaround: None available

## Additional Information
- Started occurring: 2025-11-10 09:00 AM
- Error logs attached
- Screenshot attached

## Suggested Severity
High (P1) - Major functionality broken, affects all users
```

### Bad Bug Report Example

```markdown
# Profile doesn't work

It's broken. Please fix.
```

❌ Problems:
- Vague title
- No details
- No reproduction steps
- No severity indicated
- No environment info

## SLA Summary Table

| Severity | Response Time | Fix Time | Who to Notify |
|----------|---------------|----------|---------------|
| Critical | 15 min | 4 hours | All leads + CTO |
| High | 2 hours | 24 hours | Team lead |
| Medium | 1 day | 3 days | Assigned dev |
| Low | 3 days | Next release | Backlog |

## Review and Updates

This guide should be reviewed:
- Quarterly by QA team
- After any major incident
- When team feedback suggests changes

**Last Updated**: 2025-11-10
**Version**: 1.0
**Owner**: QA Team
````

### 1.2 Save Documentation

```bash
git add docs/BUG_SEVERITY_GUIDE.md
git commit -m "docs: Add bug severity classification guide with SLA definitions"
git push
```

---

## Step 2: Create Bug Labels in GitHub

### 2.1 Navigate to Labels

1. Go to repository on GitHub
2. Click **"Issues"** tab
3. Click **"Labels"** button

### 2.2 Create Severity Labels

Click **"New label"** for each severity level:

**Critical**:
```
Name: severity: critical
Description: Critical - System unusable or data at risk
Color: #b60205 (dark red)
```

**High**:
```
Name: severity: high
Description: High - Major feature broken
Color: #d93f0b (orange-red)
```

**Medium**:
```
Name: severity: medium
Description: Medium - Feature partially working
Color: #fbca04 (yellow)
```

**Low**:
```
Name: severity: low
Description: Low - Minor issue
Color: #0e8a16 (green)
```

### 2.3 Create Bug Lifecycle Labels

**New**:
```
Name: bug-status: new
Description: Newly reported bug
Color: #d4c5f9 (light purple)
```

**Triaged**:
```
Name: bug-status: triaged
Description: Bug reviewed and assessed
Color: #bfdadc (light blue)
```

**In Progress**:
```
Name: bug-status: in-progress
Description: Bug fix in progress
Color: #0052cc (blue)
```

**Testing**:
```
Name: bug-status: testing
Description: Bug fix being tested
Color: #5319e7 (purple)
```

**Resolved**:
```
Name: bug-status: resolved
Description: Bug fixed and verified
Color: #0e8a16 (green)
```

**Won't Fix**:
```
Name: bug-status: wont-fix
Description: Decided not to fix
Color: #ffffff (white with black border)
```

**Duplicate**:
```
Name: bug-status: duplicate
Description: Duplicate of another bug
Color: #cfd3d7 (gray)
```

---

## Step 3: Create Bug Report Template

### 3.1 Create Detailed Bug Template

Create `.github/ISSUE_TEMPLATE/bug_report_detailed.yml`:

````yaml
name: Detailed Bug Report
description: Report a bug with detailed information
title: "[BUG]: "
labels: ["type: bug", "bug-status: new"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for reporting a bug! Please provide as much detail as possible.

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: How severe is this bug?
      options:
        - Critical (P0) - System unusable or data at risk
        - High (P1) - Major feature broken
        - Medium (P2) - Feature partially working
        - Low (P3) - Minor issue
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: Clear description of the bug
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: Detailed steps to reproduce the issue
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. Scroll to '...'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What should happen?
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happens?
    validations:
      required: true

  - type: textarea
    id: impact
    attributes:
      label: Impact Assessment
      description: How does this affect users/business?
      placeholder: |
        - Number of users affected:
        - Business impact:
        - Revenue impact:
    validations:
      required: true

  - type: textarea
    id: workaround
    attributes:
      label: Workaround
      description: Is there a temporary workaround?
      placeholder: "Describe any workaround, or write 'None'"
    validations:
      required: false

  - type: input
    id: environment
    attributes:
      label: Environment
      description: Where did this occur?
      placeholder: "e.g., Production, Staging, Development"
    validations:
      required: true

  - type: dropdown
    id: browser
    attributes:
      label: Browser
      description: Which browser?
      options:
        - Chrome
        - Firefox
        - Safari
        - Edge
        - Other
        - Not applicable
    validations:
      required: false

  - type: input
    id: os
    attributes:
      label: Operating System
      description: Which OS?
      placeholder: "e.g., Windows 11, macOS 14, Ubuntu 22.04"
    validations:
      required: false

  - type: textarea
    id: logs
    attributes:
      label: Error Logs
      description: Paste any relevant error logs
      render: shell
    validations:
      required: false

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: Add screenshots if applicable
      placeholder: "Drag and drop images here"
    validations:
      required: false

  - type: input
    id: version
    attributes:
      label: Application Version
      description: Which version?
      placeholder: "e.g., v1.2.3"
    validations:
      required: false

  - type: checkboxes
    id: checklist
    attributes:
      label: Reporter Checklist
      options:
        - label: I have searched existing issues to avoid duplicates
          required: true
        - label: I have provided steps to reproduce
          required: true
        - label: I have assessed the impact
          required: true
````

### 3.2 Save and Commit

```bash
git add .github/ISSUE_TEMPLATE/bug_report_detailed.yml
git commit -m "feat: Add detailed bug report template with severity classification"
git push
```

---

## Step 4: Create Bug Triage Workflow

### 4.1 Document Triage Process

Create `docs/BUG_TRIAGE_WORKFLOW.md`:

(See full workflow documentation in original - includes daily triage meeting structure, triage steps, escalation procedures, and SLA monitoring)

### 4.2 Save and Commit

```bash
git add docs/BUG_TRIAGE_WORKFLOW.md
git commit -m "docs: Add bug triage workflow and SLA guidelines"
git push
```

---

## Step 5: Team Training

### 5.1 Schedule Training Session

**Training Details**:
- Duration: 1 hour
- Attendees: All team members
- Format: Interactive presentation + exercises

**Training Agenda**:
1. Introduction to bug severity levels (15 min)
2. Classification decision tree walkthrough (15 min)
3. Hands-on classification exercises (20 min)
4. Triage workflow overview (10 min)

### 5.2 Classification Exercises

Provide these scenarios for team to classify:

**Scenario 1:**
```
The application login page returns a 500 error for all users.
Nobody can log in.

Answer: Critical (P0)
Reason: System unusable for all users
```

**Scenario 2:**
```
The export to PDF button doesn't work in Safari,
but works in Chrome. Users can use Chrome as workaround.

Answer: Medium (P2)
Reason: Feature partially working, workaround available
```

**Scenario 3:**
```
A button has a typo: "Clsoe" instead of "Close"

Answer: Low (P3)
Reason: Cosmetic issue only
```

---

## Step 6: Validation

### 6.1 Validation Checklist

**Documentation**:
- [ ] Severity guide created and comprehensive
- [ ] Bug triage workflow documented
- [ ] SLA times defined and agreed upon
- [ ] Examples provided for each severity level

**GitHub Configuration**:
- [ ] Severity labels created in GitHub
- [ ] Bug status labels created
- [ ] Detailed bug report template created
- [ ] Labels have appropriate colors and descriptions

**Team Readiness**:
- [ ] Team trained on severity classification
- [ ] Team understands triage workflow
- [ ] SLA expectations communicated
- [ ] Escalation procedures clear

**Testing**:
- [ ] Create sample bug reports
- [ ] Practice triaging them
- [ ] Verify labels work correctly
- [ ] Ensure team can classify consistently

### 6.2 Test Bug Classification

**Exercise**: Create 5 sample bugs and triage them:
1. Critical bug
2. High severity bug
3. Medium severity bug
4. Low severity bug
5. Edge case requiring discussion

Verify team reaches consensus on classification.

---

## Deliverables

✅ **Completed Items**:
1. Bug Severity Guide document (`BUG_SEVERITY_GUIDE.md`)
2. Bug severity labels in GitHub (Critical, High, Medium, Low)
3. Bug lifecycle labels in GitHub (7 status labels)
4. Detailed bug report template (`.github/ISSUE_TEMPLATE/bug_report_detailed.yml`)
5. Bug triage workflow document (`BUG_TRIAGE_WORKFLOW.md`)
6. Team training completed

---

## Success Metrics

- **Classification Consistency**: >95% of bugs properly classified
- **Triage Speed**: All new bugs triaged within 24 hours
- **SLA Compliance**: >90% bugs meet SLA targets
- **Team Agreement**: Team reaches consensus on severity definitions

---

## Next Steps

1. ✅ Bug severity system established
2. → Begin daily bug triage meetings
3. → Monitor SLA compliance
4. → Refine process based on feedback
5. → Proceed to [Task 9: Prepare Initial Test Data](Task-09-QA-Test-Data.md)

---

## Best Practices

### DO ✅

- Classify consistently using the guide
- Update severity if situation changes
- Document reasoning for edge cases
- Escalate critical bugs immediately
- Review and improve process regularly

### DON'T ❌

- Classify based on personal opinion
- Skip impact assessment
- Ignore workarounds when assigning severity
- Delay triaging critical bugs
- Forget to communicate SLA expectations

---

**Related Tasks**:
- Previous: [Task 7: Design Test Plan Templates](Task-07-QA-Test-Plan.md)
- Next: [Task 9: Prepare Initial Test Data](Task-09-QA-Test-Data.md)
- See also: [Task 2: Create Issue Templates](Task-02-PM-Issue-Templates.md)

---

**Prepared by**: QA Team
**Last Updated**: November 2025
**Version**: 1.0
