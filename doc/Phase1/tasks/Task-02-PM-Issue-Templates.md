# Task 2: Create Issue Templates and Triage Workflows

**Role**: Project Manager (PM)
**Estimated Time**: 3-4 hours
**Feature**: General Copilot Usage

---

## Objectives

- Create standardized issue templates for bug reports, feature requests, and tasks
- Set up issue configuration
- Document triage workflow
- Train team on issue management process

## Prerequisites

- GitHub Organization created (Task 1 complete)
- At least one repository created (can be temporary)
- Text editor (VS Code recommended with GitHub Copilot)
- Understanding of team workflow

---

## Step 1: Create Issue Template Directory

### 1.1 Set Up Local Repository

If you don't have a repository yet, create a temporary one for templates:

```bash
# Create temporary directory
mkdir github-templates
cd github-templates

# Initialize git repository
git init

# Create GitHub directory structure
mkdir -p .github/ISSUE_TEMPLATE
cd .github/ISSUE_TEMPLATE
```

**Alternative**: If repository already exists, clone it:

```bash
git clone git@github.com:YOUR-ORG/YOUR-REPO.git
cd YOUR-REPO
mkdir -p .github/ISSUE_TEMPLATE
cd .github/ISSUE_TEMPLATE
```

---

## Step 2: Create Bug Report Template

### 2.1 Create Bug Report File

```bash
# Create bug report template file
touch bug_report.yml
```

### 2.2 Edit Bug Report Template

Open `bug_report.yml` in your text editor and add:

```yaml
name: Bug Report
description: File a bug report to help us improve
title: "[Bug]: "
labels: ["bug", "triage"]
assignees:
  - qa-team
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!

  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false

  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: Tell us what you see!
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce this bug?
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
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
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots to help explain your problem.
    validations:
      required: false

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: How severe is this bug?
      options:
        - Critical - System down
        - High - Major feature broken
        - Medium - Feature partially working
        - Low - Minor issue
    validations:
      required: true

  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Please provide environment details
      placeholder: |
        - OS: [e.g. iOS]
        - Browser [e.g. chrome, safari]
        - Version [e.g. 22]
    validations:
      required: false

  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant log output.
      render: shell
    validations:
      required: false
```

**Save the file**

---

## Step 3: Create Feature Request Template

### 3.1 Create Feature Request File

```bash
touch feature_request.yml
```

### 3.2 Edit Feature Request Template

```yaml
name: Feature Request
description: Suggest an idea for this project
title: "[Feature]: "
labels: ["enhancement", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature!

  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: A clear and concise description of what the problem is.
      placeholder: I'm always frustrated when [...]
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen.
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Describe alternatives you've considered
      description: A clear description of any alternative solutions or features you've considered.
    validations:
      required: false

  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: How important is this feature?
      options:
        - Critical - Business blocker
        - High - Important for user experience
        - Medium - Nice to have
        - Low - Future enhancement
    validations:
      required: true

  - type: textarea
    id: additional
    attributes:
      label: Additional context
      description: Add any other context, mockups, or screenshots about the feature request here.
    validations:
      required: false
```

---

## Step 4: Create Task Template

### 4.1 Create Task File

```bash
touch task.yml
```

### 4.2 Edit Task Template

```yaml
name: Task
description: Create a task for development work
title: "[Task]: "
labels: ["task"]
body:
  - type: markdown
    attributes:
      value: |
        Create a new task for the team.

  - type: textarea
    id: description
    attributes:
      label: Task Description
      description: Detailed description of what needs to be done
    validations:
      required: true

  - type: textarea
    id: acceptance-criteria
    attributes:
      label: Acceptance Criteria
      description: What defines this task as complete?
      placeholder: |
        - [ ] Criterion 1
        - [ ] Criterion 2
        - [ ] Criterion 3
    validations:
      required: true

  - type: textarea
    id: dependencies
    attributes:
      label: Dependencies
      description: Are there any dependencies or blockers?
    validations:
      required: false

  - type: dropdown
    id: estimate
    attributes:
      label: Estimated Effort
      description: How long will this take?
      options:
        - Small (< 1 day)
        - Medium (1-3 days)
        - Large (3-5 days)
        - Extra Large (> 5 days)
    validations:
      required: true

  - type: input
    id: assignee
    attributes:
      label: Suggested Assignee
      description: Who should work on this?
    validations:
      required: false
```

---

## Step 5: Create Issue Configuration File

### 5.1 Create Config File

```bash
# Navigate to ISSUE_TEMPLATE directory
cd .github/ISSUE_TEMPLATE

# Create config file
touch config.yml
```

### 5.2 Edit Config File

```yaml
blank_issues_enabled: false
contact_links:
  - name: Ask a Question
    url: https://github.com/YOUR-ORG/YOUR-REPO/discussions
    about: Ask questions and discuss with the community
  - name: Security Issue
    url: https://github.com/YOUR-ORG/YOUR-REPO/security/advisories/new
    about: Report security vulnerabilities privately
  - name: Documentation
    url: https://docs.yourcompany.com
    about: Check our documentation for answers
```

**Note**: Update URLs to match your organization

---

## Step 6: Push Templates to Repository

### 6.1 Commit Templates

```bash
# Navigate to repository root
cd ../../..

# Stage files
git add .github/

# Commit with descriptive message
git commit -m "feat: Add issue templates for bug reports, features, and tasks"
```

### 6.2 Push to GitHub

```bash
# If new repository, set remote
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git branch -M main

# Push to GitHub
git push -u origin main
```

### 6.3 Verify Templates

1. Navigate to your repository on GitHub
2. Click **"Issues"** tab
3. Click **"New issue"** button
4. You should see three template options:
   - 🐛 Bug Report
   - ✨ Feature Request
   - 📋 Task

**Test each template**:
- Click on each template
- Verify all fields display correctly
- Test dropdown options
- Check markdown rendering
- Cancel without creating issue

---

## Step 7: Create Triage Workflow Documentation

### 7.1 Create Workflow Document

Create `docs/workflows/ISSUE_TRIAGE_WORKFLOW.md`:

```markdown
# Issue Triage Workflow

## Overview

All new issues go through a triage process to ensure proper prioritization and assignment.

## Triage Schedule

- **Daily Triage**: Monday - Friday, 9:00 AM
- **Duration**: 15-30 minutes
- **Attendees**:
  - Project Manager (Lead)
  - Tech Lead
  - QA Lead (for bugs)
- **Location**: Conference Room / Zoom

## Triage Process

### Step 1: Review New Issues

**Filter for new issues**:
```
Label: triage
Status: Open
Sort by: Created (oldest first)
```

Review each issue in order.

### Step 2: Validate Issue

For each issue, check:

✅ **Completeness**:
- [ ] Title is clear and descriptive
- [ ] All required fields filled out
- [ ] Steps to reproduce (for bugs)
- [ ] Acceptance criteria (for features)

❌ **If incomplete**:
1. Add label: `needs-more-info`
2. Comment asking for missing information
3. Template response:
   ```
   Hi @username, thanks for the issue!

   To help us address this, could you please provide:
   - [Missing information 1]
   - [Missing information 2]

   Once we have this info, we'll triage this issue.
   ```
4. Move to next issue

✅ **If complete**: Continue to next step

### Step 3: Check for Duplicates

- Search existing issues for similar reports
- Use keywords from title and description
- Check both open and closed issues

**If duplicate found**:
1. Add label: `duplicate`
2. Comment with link to original:
   ```
   Duplicate of #123
   ```
3. Close the duplicate issue
4. Add comment to original if new information provided

### Step 4: Categorize Issue

Add appropriate **type label**:

- `type: bug` - Something isn't working
- `type: feature` - New functionality
- `type: enhancement` - Improvement to existing feature
- `type: documentation` - Documentation updates
- `type: refactor` - Code refactoring

### Step 5: Prioritize

Add appropriate **priority label**:

- `priority: critical` - Immediate action required
  - Examples: System down, data loss, security breach

- `priority: high` - Important, schedule soon
  - Examples: Major feature broken, significant user impact

- `priority: medium` - Normal priority
  - Examples: Minor feature issues, enhancements

- `priority: low` - Can be scheduled later
  - Examples: Nice-to-have features, minor improvements

**Decision Matrix**:

| Impact | Users Affected | Workaround | Priority |
|--------|----------------|------------|----------|
| Critical | All/Most | No | Critical |
| High | Many | No | High |
| High | Few | Yes | Medium |
| Medium | Some | Yes | Medium |
| Low | Few | Yes | Low |

### Step 6: Assign Area

Add **area label**:

- `area: frontend` - Frontend related
- `area: backend` - Backend related
- `area: database` - Database related
- `area: devops` - DevOps/Infrastructure

**This helps route to the correct team.**

### Step 7: Assign Owner

**Assignment Guidelines**:

- **Critical/High bugs**: Assign to senior team member
- **Features**: Assign to team lead for distribution
- **Low priority**: Add to backlog, assign during sprint planning

**Use GitHub assignment**:
```
Assignees: @username
```

Or assign to team:
```
Assignees: @org/team-name
```

### Step 8: Remove Triage Label

- Remove `triage` label
- Issue is now ready for work

### Step 9: Update Project Board (Optional)

If using GitHub Projects:
1. Add issue to project
2. Set status to appropriate column:
   - Backlog
   - To Do
   - In Progress
   - Done

## SLA (Service Level Agreement)

| Priority | Response Time | Resolution Target |
|----------|---------------|-------------------|
| Critical | 1 hour | 4 hours |
| High | 4 hours | 24 hours |
| Medium | 1 day | 3 days |
| Low | 3 days | 2 weeks |

**Response Time**: Time to first meaningful response
**Resolution Target**: Time to fix/implement

## Triage Checklist Template

Use this checklist for each issue:

```markdown
## Triage Checklist

- [ ] Issue is complete and clear
- [ ] Not a duplicate
- [ ] Type label added
- [ ] Priority label added
- [ ] Area label added
- [ ] Owner assigned
- [ ] Added to sprint/backlog (if applicable)
- [ ] `triage` label removed
```

## Special Cases

### Security Issues

- **DO NOT** discuss publicly
- Move to private security advisory
- Notify security team immediately
- Follow security incident procedure

### External Contributor Issues

- Thank them for contribution
- Be extra helpful with information requests
- May take longer to triage
- Assign clear next steps

### Invalid/Spam Issues

- Add label: `invalid`
- Close immediately
- No detailed explanation needed
- Block user if repeated spam

## Triage Metrics

Track these metrics weekly:

- Number of issues triaged
- Average triage time per issue
- % of issues needing more information
- % of duplicate issues
- SLA compliance rate

**Goal**: Triage all new issues within 24 hours

## Triage Tips

1. **Be Respectful**: Always thank reporter
2. **Be Clear**: Give specific feedback
3. **Be Fast**: Triage within 24 hours
4. **Be Consistent**: Use same criteria
5. **Escalate**: When uncertain, ask team lead

## Tools

- **GitHub Issues**: Issue tracking
- **GitHub Projects**: Project management (optional)
- **Slack**: #triage channel for discussion
- **Labels**: Consistent labeling system

## Documentation References

- [Bug Severity Guide](../BUG_SEVERITY_GUIDE.md)
- [Issue Labels](../LABELS.md)
- [Team Assignments](../TEAM_STRUCTURE.md)
```

### 7.2 Save and Commit Documentation

```bash
# Create docs directory if it doesn't exist
mkdir -p docs/workflows

# Save the document
# (File should be created as shown above)

# Commit
git add docs/workflows/ISSUE_TRIAGE_WORKFLOW.md
git commit -m "docs: Add issue triage workflow documentation"
git push
```

---

## Step 8: Train Team on Issue Management

### 8.1 Schedule Training Session

**Training Agenda** (30 minutes):

```markdown
# Issue Management Training

## Session Details
- Duration: 30 minutes
- Attendees: All team members
- Format: Interactive demo
- Materials: Issue templates, workflow doc

## Agenda

1. Introduction (5 min)
   - Why we need standardized issues
   - Benefits of triage process

2. Issue Templates Demo (10 min)
   - Show each template
   - Explain when to use each
   - Live demo of creating issue

3. Triage Workflow (10 min)
   - Walk through process
   - Explain labels and priorities
   - Show SLA targets

4. Q&A (5 min)
   - Answer questions
   - Clarify confusion
   - Get feedback
```

### 8.2 Create Quick Reference Guide

Create `docs/quick-reference/ISSUES_QUICK_GUIDE.md`:

```markdown
# Issues Quick Reference Guide

## Creating Issues

### Bug Report
Use when: Something is broken or not working correctly
Label: `bug`, `triage`
Required: Steps to reproduce, expected vs actual behavior

### Feature Request
Use when: Proposing new functionality
Label: `enhancement`, `triage`
Required: Problem description, proposed solution

### Task
Use when: Creating work item for team
Label: `task`
Required: Description, acceptance criteria

## Issue Labels

### Type
- `type: bug` - Something broken
- `type: feature` - New functionality
- `type: enhancement` - Improvement
- `type: documentation` - Docs update

### Priority
- `priority: critical` - Fix ASAP (4 hours)
- `priority: high` - Fix soon (24 hours)
- `priority: medium` - Normal (3 days)
- `priority: low` - When convenient (2 weeks)

### Area
- `area: frontend`
- `area: backend`
- `area: database`
- `area: devops`

### Status
- `status: triage` - Needs triage
- `status: in-progress` - Being worked on
- `status: review` - In review
- `status: blocked` - Blocked by something

## Common Actions

### Create Issue
1. Go to repository
2. Click "Issues"
3. Click "New issue"
4. Select template
5. Fill out form
6. Submit

### Triage Issue (PM/Lead Only)
1. Read issue thoroughly
2. Check completeness
3. Add type, priority, area labels
4. Assign owner
5. Remove `triage` label

### Work on Issue
1. Assigned issues appear in your dashboard
2. Comment when starting work
3. Create branch: `feature/issue-123-description`
4. Submit PR when complete
5. Link PR to issue: "Closes #123"

## Need Help?

- **Questions**: #dev-help Slack channel
- **Bugs with templates**: @pm-username
- **Triage questions**: Attend daily triage or ask PM
```

---

## Step 9: Validation and Testing

### 9.1 Validation Checklist

**Templates Created**:
- [ ] Bug report template exists and works
- [ ] Feature request template exists and works
- [ ] Task template exists and works
- [ ] Config file created and configured
- [ ] All templates have proper labels
- [ ] Required fields marked correctly

**Workflow Documentation**:
- [ ] Triage workflow documented
- [ ] SLA targets defined
- [ ] Process is clear and actionable
- [ ] Quick reference guide created

**Team Readiness**:
- [ ] Training session completed
- [ ] Team understands when to use each template
- [ ] Triage team identified
- [ ] Daily triage scheduled

**Testing**:
- [ ] Created test issue with each template
- [ ] Verified labels auto-apply
- [ ] Tested template validation
- [ ] Confirmed dropdown options work
- [ ] Checked markdown rendering

### 9.2 Test Each Template

**Create test issues** (can delete after):

1. **Test Bug Report**:
   - Create new issue
   - Select "Bug Report"
   - Fill out all fields
   - Submit
   - Verify labels: `bug`, `triage`
   - Delete issue after verification

2. **Test Feature Request**:
   - Select "Feature Request"
   - Fill required fields
   - Check priority dropdown
   - Verify labels: `enhancement`, `triage`
   - Delete test issue

3. **Test Task**:
   - Select "Task"
   - Test acceptance criteria section
   - Check effort estimation dropdown
   - Delete test issue

### 9.3 Conduct Practice Triage

**Practice Session** (15 minutes):

1. Create 3-5 test issues
2. Gather triage team
3. Walk through triage process
4. Practice labeling and assignment
5. Get feedback
6. Clean up test issues

---

## Step 10: Ongoing Maintenance

### 10.1 Regular Reviews

**Weekly**:
- Review triage effectiveness
- Check SLA compliance
- Gather team feedback

**Monthly**:
- Review and update templates
- Analyze common issues
- Refine workflow

**Quarterly**:
- Full process review
- Update documentation
- Conduct refresher training

### 10.2 Continuous Improvement

**Track Metrics**:
- Issues triaged per day
- % requiring more info
- % of duplicates
- SLA compliance rate

**Gather Feedback**:
- Anonymous surveys
- Retrospective discussions
- Direct feedback from team

---

## Deliverables

✅ **Issue Templates**:
1. Bug Report template (`bug_report.yml`)
2. Feature Request template (`feature_request.yml`)
3. Task template (`task.yml`)
4. Configuration file (`config.yml`)

✅ **Documentation**:
1. Issue Triage Workflow
2. Quick Reference Guide
3. Training materials

✅ **Process**:
1. Daily triage scheduled
2. Team trained
3. SLA targets defined

---

## Success Metrics

- **Template Adoption**: >90% of issues use templates
- **Triage Speed**: All issues triaged within 24 hours
- **SLA Compliance**: >85% issues meet SLA targets
- **Team Satisfaction**: Positive feedback on process

---

**Related Tasks**:
- Previous: [Task 1: Plan GitHub Organization](Task-01-PM-Organization.md)
- Next: [Task 3: Coordinate Copilot Activation](Task-03-PM-Copilot.md)
- See also: [Task 6: Set Up Issue Labels](Task-06-DEV-Labels.md)

---

**Prepared by**: PM Team
**Last Updated**: November 2025
**Version**: 1.0
