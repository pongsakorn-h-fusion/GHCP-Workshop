# Task 6: GitHub Projects & Issues Enterprise Features

**Role**: All Roles (PM, Developer, QA)
**Estimated Time**: 2-3 hours
**Feature**: GitHub Projects, Issues, Discussions Enterprise Features

---

## Objectives

- ใช้งาน GitHub Projects (New) สำหรับ Enterprise
- ตั้งค่า Issue Forms และ Templates
- ใช้งาน GitHub Discussions
- เปิดใช้งาน Tasklists และ Sub-issues
- จัดการ Roadmaps และ Insights

## Prerequisites

- GitHub Enterprise Cloud license
- Repository or Organization admin access
- Understanding of project management concepts

---

## Part A: GitHub Projects (New) Enterprise Features

### Overview

GitHub Projects (New) ให้ความสามารถในการจัดการโปรเจคแบบ flexible:

| Feature | Free | Team | Enterprise |
|---------|------|------|------------|
| Unlimited projects | ✅ | ✅ | ✅ |
| Custom fields | ✅ | ✅ | ✅ |
| Views (Board, Table, Roadmap) | ✅ | ✅ | ✅ |
| Workflows automation | ✅ | ✅ | ✅ |
| Insights | Limited | ✅ | ✅ |
| Status updates | ❌ | ✅ | ✅ |
| Project templates | ❌ | ✅ | ✅ |
| Cross-org projects | ❌ | ❌ | ✅ |

---

### Step 1: Create Enterprise Project

#### 1.1 Create Organization Project

```
Organization → Projects → New project
```

**Template Options**:
- **Team backlog** - Kanban-style board for sprint planning
- **Team planning** - Table view with iterations
- **Roadmap** - Timeline view for release planning
- **Feature release** - Track features across releases
- **Bug tracking** - Issue triage and resolution
- **Start from scratch** - Custom setup

#### 1.2 Configure Project Settings

```
Project → Settings
```

**Basic Settings**:
```yaml
Name: Q4 2025 Development
Short description: Engineering team Q4 planning and tracking
README: |
  # Q4 2025 Development Project

  ## Overview
  Track all development work for Q4 2025

  ## Teams
  - Backend Team
  - Frontend Team
  - DevOps Team
  - QA Team

  ## Key Milestones
  - Sprint 1: Nov 1-14
  - Sprint 2: Nov 15-28
  - Sprint 3: Dec 1-14
  - Release: Dec 20

Visibility:
○ Private (organization members only)
● Public (within organization)
```

---

### Step 2: Configure Custom Fields

#### 2.1 Built-in Fields

Projects มี built-in fields พื้นฐาน:
- **Title** - Issue/PR title
- **Assignees** - Who's working on it
- **Status** - Current status (customizable)
- **Labels** - Issue labels
- **Milestone** - Associated milestone
- **Repository** - Source repository

#### 2.2 Add Custom Fields

```
Project → Settings → Custom fields → New field
```

**Recommended Custom Fields**:

**Priority Field** (Single select):
```yaml
Field name: Priority
Field type: Single select
Options:
  - 🔴 Critical
  - 🟠 High
  - 🟡 Medium
  - 🟢 Low
```

**Story Points Field** (Number):
```yaml
Field name: Story Points
Field type: Number
```

**Sprint Field** (Iteration):
```yaml
Field name: Sprint
Field type: Iteration
Duration: 2 weeks
Start date: 2025-11-01
```

**Team Field** (Single select):
```yaml
Field name: Team
Field type: Single select
Options:
  - Backend
  - Frontend
  - DevOps
  - QA
  - Design
```

**Type Field** (Single select):
```yaml
Field name: Type
Field type: Single select
Options:
  - 🆕 Feature
  - 🐛 Bug
  - 📝 Documentation
  - 🔧 Maintenance
  - 🔒 Security
```

**Estimate Field** (Single select):
```yaml
Field name: Estimate
Field type: Single select
Options:
  - XS (1-2 hours)
  - S (Half day)
  - M (1 day)
  - L (2-3 days)
  - XL (1 week)
```

---

### Step 3: Create Views

#### 3.1 Board View (Kanban)

```
Project → Add view → Board
```

**Configuration**:
```yaml
View name: Sprint Board
Group by: Status
Column field: Status
Columns:
  - 📋 Backlog
  - 🔜 Ready
  - 🏃 In Progress
  - 👀 In Review
  - ✅ Done

Filters:
  Sprint: @current

Sort: Priority (ascending)
```

#### 3.2 Table View

```
Project → Add view → Table
```

**Configuration**:
```yaml
View name: Full Backlog
Visible fields:
  - Title
  - Status
  - Priority
  - Team
  - Assignees
  - Story Points
  - Sprint
  - Labels

Group by: Team
Sort: Priority, then Created date
```

#### 3.3 Roadmap View

```
Project → Add view → Roadmap
```

**Configuration**:
```yaml
View name: Release Roadmap
Date field: Sprint (iteration dates)
Zoom: Month

Markers:
  - Release v2.0: 2025-12-20
  - Code Freeze: 2025-12-15
  - QA Complete: 2025-12-18

Filters:
  Type: Feature
```

---

### Step 4: Configure Workflows

#### 4.1 Built-in Workflows

```
Project → Settings → Workflows
```

**Auto-add Issues**:
```yaml
Workflow: Item added to project
When: Any issue/PR is added to project
Then:
  - Set Status to: Backlog
  - Set Sprint to: @current
```

**Auto-close Issues**:
```yaml
Workflow: Item closed
When: Issue is closed
Then:
  - Set Status to: Done
  - Archive item after: 14 days
```

**PR Merged**:
```yaml
Workflow: Pull request merged
When: PR is merged
Then:
  - Set Status to: Done
  - Move linked issues to: Done
```

#### 4.2 Custom Automations with Actions

สร้างไฟล์ `.github/workflows/project-automation.yml`:

```yaml
name: Project Automation

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened, ready_for_review, closed]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
    - name: Add issue to project
      uses: actions/add-to-project@v0.5.0
      with:
        project-url: https://github.com/orgs/YOUR_ORG/projects/1
        github-token: ${{ secrets.PROJECT_TOKEN }}

  set-priority:
    runs-on: ubuntu-latest
    if: github.event.action == 'labeled'
    steps:
    - name: Set priority based on label
      uses: actions/github-script@v7
      with:
        script: |
          const labels = context.payload.issue.labels.map(l => l.name);

          let priority = 'Medium';
          if (labels.includes('critical') || labels.includes('security')) {
            priority = 'Critical';
          } else if (labels.includes('bug')) {
            priority = 'High';
          }

          // Update project item priority
          // Use GraphQL mutation

  move-to-in-review:
    runs-on: ubuntu-latest
    if: github.event.action == 'ready_for_review'
    steps:
    - name: Update linked issues
      uses: actions/github-script@v7
      with:
        script: |
          // Move linked issues to "In Review"
          const pr = context.payload.pull_request;
          // Parse linked issues and update status
```

---

### Step 5: Project Insights

#### 5.1 Access Insights

```
Project → Insights
```

**Available Charts**:
- **Burn up** - Progress over time
- **Burn down** - Remaining work over time
- **Velocity** - Story points completed per sprint
- **Distribution** - Items by status/priority/team

#### 5.2 Configure Custom Charts

```
Insights → New chart
```

**Example: Team Workload Chart**:
```yaml
Chart type: Bar chart
X-axis: Team
Y-axis: Count of items
Group by: Status
Filter: Sprint = @current
```

**Example: Priority Distribution**:
```yaml
Chart type: Pie chart
Group by: Priority
Filter: Status != Done
```

---

## Part B: GitHub Issues Enterprise Features

### Step 6: Issue Forms

#### 6.1 Create Issue Form

สร้างไฟล์ `.github/ISSUE_TEMPLATE/bug_report.yml`:

```yaml
name: Bug Report
description: Report a bug to help us improve
title: "[Bug]: "
labels: ["bug", "triage"]
projects: ["YOUR_ORG/1"]
assignees:
  - octocat

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
        Please provide as much detail as possible.

  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we reach you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: How severe is this bug?
      options:
        - Critical - System down/data loss
        - High - Major feature broken
        - Medium - Feature partially working
        - Low - Minor issue
    validations:
      required: true

  - type: dropdown
    id: environment
    attributes:
      label: Environment
      description: Where did this occur?
      multiple: true
      options:
        - Production
        - Staging
        - Development
        - Local
    validations:
      required: true

  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Describe the bug
      placeholder: Tell us what you see!
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: What should have happened?
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: How can we reproduce this?
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant log output
      render: shell

  - type: checkboxes
    id: terms
    attributes:
      label: Checklist
      description: Please confirm
      options:
        - label: I have searched for existing issues
          required: true
        - label: I have provided all requested information
          required: true
```

#### 6.2 Feature Request Form

สร้างไฟล์ `.github/ISSUE_TEMPLATE/feature_request.yml`:

```yaml
name: Feature Request
description: Suggest a new feature
title: "[Feature]: "
labels: ["enhancement", "feature-request"]
projects: ["YOUR_ORG/1"]

body:
  - type: markdown
    attributes:
      value: |
        ## Feature Request
        Thanks for suggesting a new feature!

  - type: dropdown
    id: area
    attributes:
      label: Feature Area
      description: What area does this feature affect?
      options:
        - Frontend/UI
        - Backend/API
        - Database
        - Infrastructure
        - Security
        - Performance
        - Documentation
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: Business Priority
      description: How important is this feature?
      options:
        - Critical - Blocking business
        - High - Major business impact
        - Medium - Nice to have
        - Low - Future consideration
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: What problem does this solve?
      placeholder: Describe the problem or opportunity
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: How would you like this to work?
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Any other solutions you've thought about?

  - type: textarea
    id: context
    attributes:
      label: Additional Context
      description: Screenshots, mockups, examples, etc.
```

---

### Step 7: Tasklists and Sub-issues

#### 7.1 Enable Tasklists (Beta)

```
Organization → Settings → Features → Tasklists
✅ Enable Tasklists
```

#### 7.2 Create Tasklists in Issues

**Markdown Syntax**:
```markdown
## Implementation Tasks

```[tasklist]
### Backend Tasks
- [ ] Design database schema
- [ ] Create API endpoints
- [ ] Write unit tests
- [ ] Integration testing

### Frontend Tasks
- [ ] Create UI components
- [ ] Connect to API
- [ ] Add validation
- [ ] E2E testing
```
```

#### 7.3 Convert Tasklist Items to Issues

```
In the tasklist:
1. Hover over a task item
2. Click "..." menu
3. Select "Convert to issue"
4. The task becomes a linked sub-issue
```

---

### Step 8: Issue Templates Configuration

#### 8.1 Template Chooser

สร้างไฟล์ `.github/ISSUE_TEMPLATE/config.yml`:

```yaml
blank_issues_enabled: false
contact_links:
  - name: Security Vulnerabilities
    url: https://github.com/YOUR_ORG/REPO/security/advisories/new
    about: Report security vulnerabilities privately

  - name: Questions & Discussions
    url: https://github.com/YOUR_ORG/REPO/discussions/new
    about: Ask questions in Discussions instead of creating issues

  - name: Documentation
    url: https://docs.your-company.com
    about: Check our documentation for answers
```

---

## Part C: GitHub Discussions Enterprise

### Step 9: Enable and Configure Discussions

#### 9.1 Enable Discussions

```
Repository → Settings → Features → Discussions
✅ Enable Discussions
```

#### 9.2 Configure Categories

```
Discussions → Categories → New category
```

**Recommended Categories**:

```yaml
- name: 📣 Announcements
  description: Official announcements from the team
  format: Announcement
  emoji: 📣

- name: 💬 General
  description: General discussions and conversations
  format: Open-ended discussion
  emoji: 💬

- name: 💡 Ideas
  description: Share ideas and feature suggestions
  format: Open-ended discussion
  emoji: 💡

- name: 🙏 Q&A
  description: Ask questions and get answers
  format: Question / Answer
  emoji: 🙏

- name: 🙌 Show and Tell
  description: Share what you've built
  format: Open-ended discussion
  emoji: 🙌

- name: 🗳️ Polls
  description: Community polls and voting
  format: Poll
  emoji: 🗳️
```

#### 9.3 Discussion Forms

สร้างไฟล์ `.github/DISCUSSION_TEMPLATE/q-and-a.yml`:

```yaml
title: "[Q&A] "
labels:
  - question
body:
  - type: markdown
    attributes:
      value: |
        ## Question
        Please provide as much context as possible.

  - type: dropdown
    id: topic
    attributes:
      label: Topic
      options:
        - Installation
        - Configuration
        - Usage
        - Integration
        - Other
    validations:
      required: true

  - type: textarea
    id: question
    attributes:
      label: Your Question
      description: What would you like to know?
    validations:
      required: true

  - type: textarea
    id: context
    attributes:
      label: Context
      description: Any relevant context or what you've tried

  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: I have searched existing discussions
          required: true
        - label: I have checked the documentation
          required: true
```

---

### Step 10: Discussions to Issues Workflow

#### 10.1 Convert Discussion to Issue

```
In Discussion:
1. Click "Create issue from discussion"
2. Select repository
3. Add labels and assignees
4. Create issue (linked to discussion)
```

#### 10.2 Automate with Actions

```yaml
name: Discussion Automation

on:
  discussion:
    types: [created, answered]

jobs:
  label-discussion:
    runs-on: ubuntu-latest
    if: github.event.action == 'created'
    steps:
    - name: Add labels based on category
      uses: actions/github-script@v7
      with:
        script: |
          const category = context.payload.discussion.category.name;
          let labels = [];

          if (category === 'Q&A') {
            labels = ['question', 'needs-answer'];
          } else if (category === 'Ideas') {
            labels = ['idea', 'needs-review'];
          }

          if (labels.length > 0) {
            await github.rest.graphql(`
              mutation {
                addLabelsToLabelable(input: {
                  labelableId: "${context.payload.discussion.node_id}",
                  labelIds: [/* label IDs */]
                }) { clientMutationId }
              }
            `);
          }

  notify-on-answer:
    runs-on: ubuntu-latest
    if: github.event.action == 'answered'
    steps:
    - name: Notify team
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "Discussion answered!",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Discussion Answered*\n<${{ github.event.discussion.html_url }}|${{ github.event.discussion.title }}>"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Part D: Project Status Updates (Enterprise)

### Step 11: Status Updates

#### 11.1 Create Status Update

```
Project → Status updates → New update
```

**Status Update Template**:
```markdown
## Sprint 5 Status Update

**Date**: November 21, 2025
**Overall Status**: 🟡 On Track with Risks

### Progress Summary
- Completed: 15 story points
- In Progress: 8 story points
- Remaining: 12 story points

### Key Accomplishments
- ✅ User authentication module completed
- ✅ Database migration scripts ready
- ✅ API documentation updated

### Blockers & Risks
- ⚠️ Third-party API integration delayed
- ⚠️ 2 team members on leave next week

### Next Week Focus
- Complete payment integration
- Begin security testing
- Prepare for UAT

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Velocity | 25 pts | 23 pts |
| Bug Count | < 5 | 3 |
| Test Coverage | 80% | 78% |
```

#### 11.2 Status Update Automation

```yaml
name: Weekly Status Reminder

on:
  schedule:
    - cron: '0 9 * * 5'  # Every Friday at 9 AM

jobs:
  remind-status-update:
    runs-on: ubuntu-latest
    steps:
    - name: Send reminder
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "📊 Time for weekly status update!",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Hey team! Please update the project status.\n<https://github.com/orgs/YOUR_ORG/projects/1|Go to Project>"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Deliverables

✅ **Features Configured**:
1. GitHub Projects with custom fields and views
2. Automated workflows
3. Project insights and charts
4. Issue forms for all issue types
5. Tasklists enabled
6. Discussions with categories
7. Status updates configured

📋 **Files Created**:
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/DISCUSSION_TEMPLATE/q-and-a.yml`
- `.github/workflows/project-automation.yml`

---

## Verification Checklist

- [ ] Project created with custom fields
- [ ] Multiple views configured (Board, Table, Roadmap)
- [ ] Workflows automating item management
- [ ] Issue forms working correctly
- [ ] Tasklists enabled and functional
- [ ] Discussions categories set up
- [ ] Status updates being created

---

**Related Tasks**:
- [Task 5: GitHub Enterprise Advanced](Task-05-GitHub-Enterprise-Advanced.md)
- [Task 1: Branch Protection](Task-01-PM-Branch-Protection.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
