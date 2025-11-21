# GitHub Enterprise Features Workshop

## Workshop Overview
**Duration**: 2 hours (Focused Hands-On Workshop)
**Level**: Intermediate to Advanced
**Prerequisites**:
- Basic Git and GitHub knowledge
- GitHub Enterprise Cloud access
- Organization admin or owner permissions
- Familiarity with GitHub Actions

**Learning Objectives**:
- Configure GitHub Codespaces for secure development environments
- Set up GitHub Advanced Security (GHAS) features
- Use GitHub Copilot Enterprise effectively (including CLI and Copilot Spaces)
- Understand GitHub Spark for micro-apps
- Navigate and utilize GitHub Native Dashboards
- Configure GitHub Projects for enterprise project management
- Set up Issue Forms and Discussions

---

## Workshop Agenda

| Time | Module | Topics |
|------|--------|--------|
| 0:00-0:10 | **Introduction** | Overview & Enterprise Features Landscape |
| 0:10-0:40 | **Module 1** | Codespaces & Advanced Security (GHAS) |
| 0:40-1:10 | **Module 2** | Copilot Enterprise, CLI, Copilot Spaces & Spark |
| 1:10-1:40 | **Module 3** | Dashboards, Projects & Issue Forms |
| 1:40-1:55 | **Hands-On Challenge** | Mini Project |
| 1:55-2:00 | **Wrap-Up** | Q&A and Next Steps |

---

## Introduction (10 minutes)

### GitHub Enterprise Cloud Features Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GitHub Enterprise Cloud                           │
├─────────────────────────────────────────────────────────────────────┤
│  Development         │  Security            │  Management            │
│  ──────────────────  │  ──────────────────  │  ──────────────────    │
│  • Codespaces        │  • GHAS              │  • Projects            │
│  • Copilot + CLI     │  • Code Scanning     │  • Dashboards          │
│  • Copilot Spaces    │  • Secret Scanning   │  • Issue Forms         │
│  • Spark             │  • Dependabot        │  • Audit Logs          │
│  • Actions           │  • Push Protection   │  • Discussions         │
└─────────────────────────────────────────────────────────────────────┘
```

### What We'll Cover Today (from Task 4-6)

| Module | Features | Source |
|--------|----------|--------|
| 1 | Codespaces + GHAS + Audit Log | Task 4 |
| 2 | Copilot Enterprise + CLI + Copilot Spaces + Spark | Task 5 |
| 3 | Dashboards + Projects + Issue Forms | Task 5 & 6 |

### Enterprise Features Comparison

| Feature | Free | Team | Enterprise |
|---------|------|------|------------|
| Codespaces | Limited | ✅ | ✅ Advanced |
| Copilot Spaces | ❌ | ❌ | ✅ |
| Code Scanning | Public repos | ✅ | ✅ |
| Secret Scanning | Public repos | ✅ | ✅ + Push Protection |
| Copilot | Individual | Business | ✅ Knowledge Bases |
| SAML SSO | ❌ | ❌ | ✅ |
| Audit Log Streaming | ❌ | ❌ | ✅ |
| IP Allow Lists | ❌ | ❌ | ✅ |

---

## Module 1: Codespaces & Advanced Security (30 minutes)

### Part A: GitHub Codespaces (15 minutes)

#### Concept Overview (3 minutes)

**What is Codespaces?**
- Cloud-hosted development environments
- Pre-configured with tools, dependencies, and settings
- Accessible from any device with a browser
- Consistent environment for all team members

**Enterprise Security Benefits**:
| Benefit | Description |
|---------|-------------|
| Isolation | Code never leaves GitHub's cloud |
| Standardization | Same environment for all developers |
| Security Controls | Audit access, manage secrets centrally |
| Pre-configured Tools | Security tools pre-installed |

#### Hands-On: Configure Dev Container (12 minutes)

**Step 1: Create devcontainer.json**

Create `.devcontainer/devcontainer.json`:

```json
{
  "name": "Enterprise Dev Environment",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/aws-cli:1": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "GitHub.copilot",
        "GitHub.copilot-chat",
        "GitHub.vscode-pull-request-github",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "SonarSource.sonarlint-vscode",
        "ms-azuretools.vscode-docker",
        "eamodio.gitlens"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        }
      }
    }
  },

  "postCreateCommand": "npm install && npm run setup",
  "postStartCommand": "npm audit --audit-level=moderate || true",

  "forwardPorts": [3000, 5432],
  "portsAttributes": {
    "3000": { "label": "App", "onAutoForward": "notify" },
    "5432": { "label": "Database", "onAutoForward": "silent" }
  },

  "remoteUser": "node"
}
```

**Step 2: Configure Organization Settings**

```
Navigation: Organization → Settings → Codespaces
```

**Recommended Enterprise Settings**:
```yaml
Access Control:
  ☑ Enable Codespaces for selected repositories

Machine types:
  ☑ 2-core (8 GB RAM)     # Default for most work
  ☑ 4-core (16 GB RAM)    # For larger projects
  ☐ 8-core (32 GB RAM)    # Restricted - requires approval

Timeout & Retention:
  Default idle timeout: 30 minutes
  Maximum idle timeout: 4 hours
  Default retention period: 14 days

Secrets:
  ☑ Allow Codespaces access to organization secrets

Cost Controls:
  Monthly spending limit: $500/user
  Alert threshold: 80%
```

**Step 3: Configure Secrets for Codespaces**

```
Navigation: Organization → Settings → Secrets → Codespaces
```

```yaml
Add secrets:
  NPM_TOKEN: (for private packages)
  AWS_ACCESS_KEY_ID: (for AWS services)
  DATABASE_URL: (for development database)

Repository access:
  ☑ Selected repositories only
```

---

### Part B: GitHub Advanced Security (15 minutes)

#### Concept Overview (3 minutes)

**GHAS Components**:

| Feature | What It Does | When It Runs |
|---------|--------------|--------------|
| **Code Scanning** | Finds vulnerabilities in code | On push/PR |
| **Secret Scanning** | Detects exposed credentials | Real-time |
| **Dependency Review** | Checks for vulnerable packages | On PR |
| **Push Protection** | Blocks secrets before commit | On push |

#### Hands-On: Enable GHAS (12 minutes)

**Step 1: Enable at Organization Level**

```
Navigation: Organization → Settings → Code security and analysis
```

**Enable These Features**:
```yaml
Dependency graph: ✅ Enabled for all repositories
Dependabot alerts: ✅ Enabled for all repositories
Dependabot security updates: ✅ Enabled for all repositories

GitHub Advanced Security:
  ☑ Automatically enable for new repositories

Secret scanning:
  ☑ Automatically enable for new repositories
  ☑ Push protection: Enabled
  ☑ Validity checks: Enabled

Code scanning:
  ☑ Default setup for new repositories
```

**Step 2: Create CodeQL Workflow**

Create `.github/workflows/codeql.yml`:

```yaml
name: "CodeQL Analysis"

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: ${{ matrix.language }}
        queries: +security-and-quality

    - name: Autobuild
      uses: github/codeql-action/autobuild@v3

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
      with:
        category: "/language:${{ matrix.language }}"
```

**Step 3: Create Dependency Review Workflow**

Create `.github/workflows/dependency-review.yml`:

```yaml
name: 'Dependency Review'

on:
  pull_request:
    branches: [ main, develop ]

permissions:
  contents: read
  pull-requests: write

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Dependency Review
        uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
          comment-summary-in-pr: always
```

**Step 4: View Security Overview**

```
Navigation: Organization → Security → Overview
```

**Key Views**:
- **Risk view**: Repositories with most alerts
- **Coverage view**: Which features are enabled
- **Alert trends**: Are we improving?

**Step 5: Configure Audit Log (Enterprise)**

```
Navigation: Enterprise → Settings → Audit log
```

**Streaming to SIEM**:
```yaml
Destinations:
  - Amazon S3
  - Azure Blob Storage
  - Google Cloud Storage
  - Splunk
  - Datadog

Events to stream:
  ☑ Repository events
  ☑ Organization events
  ☑ Enterprise events
  ☑ User events
```

---

## Module 2: Copilot Enterprise & GitHub Spark (30 minutes)

### Part A: GitHub Copilot Enterprise (20 minutes)

#### Concept Overview (3 minutes)

**Copilot Tiers Comparison**:

| Feature | Individual | Business | Enterprise |
|---------|------------|----------|------------|
| Code completions | ✅ | ✅ | ✅ |
| Chat in IDE | ✅ | ✅ | ✅ |
| Chat in GitHub.com | ❌ | ✅ | ✅ |
| CLI Support | ❌ | ✅ | ✅ |
| PR Summaries | ❌ | ❌ | ✅ |
| Knowledge Bases | ❌ | ❌ | ✅ |
| Fine-tuned models | ❌ | ❌ | ✅ |
| Admin & Audit | ❌ | Basic | ✅ Full |

#### Hands-On: Copilot Enterprise Features (17 minutes)

**Step 1: Configure Organization Policies**

```
Navigation: Organization → Settings → Copilot → Policies
```

**Recommended Settings**:
```yaml
Suggestions matching public code:
  ● Block suggestions matching public code

Copilot Chat in GitHub.com:
  ☑ Enabled for all members

Copilot in the CLI:
  ☑ Enabled

Knowledge bases:
  ☑ Allow knowledge base creation

Content exclusions:
  Add patterns:
    - "**/secrets/**"
    - "**/.env*"
    - "**/credentials/**"
```

**Step 2: Create Knowledge Base**

```
Navigation: Organization → Settings → Copilot → Knowledge bases → New
```

**Create Knowledge Base**:
```yaml
Name: Internal Documentation
Description: Company coding standards and architecture

Add repositories:
  ☑ org/coding-standards
  ☑ org/architecture-docs
  ☑ org/api-specifications

Indexing: Automatic (updates on push)
Access: All organization members
```

**Step 3: Use Copilot for PR Review**

When viewing a Pull Request:

1. Click **"Copilot"** dropdown
2. Select **"Generate summary"**
3. Review the AI-generated summary
4. Click **"Review with Copilot"** for code suggestions

**Example PR Summary Output**:
```markdown
## Summary
This PR adds user authentication middleware with JWT validation.

## Changes
- Added `authMiddleware.js` with token verification
- Updated `routes/api.js` to use authentication
- Added unit tests for auth functions

## Potential Issues
- Consider adding rate limiting to prevent brute force
- Token expiry should be configurable via environment variable
```

**Step 4: Chat with Codebase Context**

In GitHub.com, open Copilot Chat and try:

```
@github How does our authentication system work?

@github What's the coding standard for error handling in this repo?

@github Explain the deployment process based on our workflows

@github Find security vulnerabilities in this repository
```

**Step 5: Copilot in the CLI**

Install and use Copilot in your terminal:

```bash
# Install Copilot CLI extension
gh extension install github/gh-copilot

# Explain a command
gh copilot explain "git rebase -i HEAD~5"

# Suggest a command from natural language
gh copilot suggest "find all files modified in the last 24 hours"

# Git-specific help
gh copilot suggest "undo the last commit but keep changes"
```

**Quick Aliases for Daily Use**:
```bash
# Add to ~/.bashrc or ~/.zshrc
alias '??'='gh copilot explain'
alias '?!'='gh copilot suggest'
alias githelp='gh copilot suggest -t git'

# Usage:
# ?? "what does tar -xzvf do"
# ?! "compress all log files older than 7 days"
# githelp "squash last 3 commits"
```

**Common Use Cases**:
| Task | Example Prompt |
|------|----------------|
| File search | "find all PNG files larger than 1MB" |
| Git help | "cherry-pick a commit from another branch" |
| Docker | "run postgres with persistent volume" |
| K8s | "get all pods in error state" |
| Network | "check which process uses port 8080" |
| Security | "find files with world-writable permissions" |

**Step 6: View Copilot Metrics**

```
Navigation: Organization → Settings → Copilot → Metrics
```

```yaml
Key Metrics:
  Active users: XX / YY licensed
  Acceptance rate: XX%
  Lines of code accepted: XXX,XXX
  Top languages: JavaScript, Python, TypeScript
```

**Step 7: GitHub Copilot Spaces (Preview)**

Copilot Spaces combines Codespaces with AI-powered project understanding.

**What is Copilot Spaces?**
| Feature | Codespaces | Copilot Spaces |
|---------|------------|----------------|
| Cloud dev environment | ✅ | ✅ |
| Copilot code completion | Optional | ✅ Built-in |
| Project context awareness | ❌ | ✅ |
| AI-assisted onboarding | ❌ | ✅ |
| Task understanding | ❌ | ✅ |

**Create a Copilot Space**:
```
Repository → Code → Codespaces → New with Copilot
OR
Issue/PR → "Open in Copilot Space"
```

**AI-Assisted Features**:
```bash
# Ask Copilot about the codebase
@copilot How does authentication work in this project?

# Get help with tasks
@copilot Help me implement the feature from issue #123

# Generate code with full context
@copilot Create a new API endpoint following our patterns
```

**Configure Copilot Space** - Create `.github/copilot-space.yml`:
```yaml
context:
  priority_paths:
    - "src/**"
    - "docs/architecture.md"
  exclude_paths:
    - "node_modules/**"
    - ".env*"

onboarding:
  message: |
    Welcome! Run `npm run dev` to start.
  entry_points:
    - path: "src/index.js"
      description: "Application entry point"

tasks:
  - name: "Add new endpoint"
    template: "Create REST endpoint following our patterns"
```

---

### Part B: GitHub Spark (10 minutes)

#### Concept Overview (2 minutes)

**What is GitHub Spark?**
- AI-powered micro-app builder
- Create apps using natural language
- No coding required
- Instant deployment and sharing
- PWA support (install as mobile app)

**Use Cases**:
| Category | Examples |
|----------|----------|
| Personal | Task trackers, habit logs, expense tracking |
| Team | Standup boards, polls, retrospectives |
| Enterprise | Internal tools, dashboards, forms |

#### Hands-On: Create a Spark (8 minutes)

**Step 1: Access GitHub Spark**

```
URL: https://github.com/spark
```

**Step 2: Create Team Standup Tracker**

Enter this prompt:
```
Create a team standup tracker where:
- Team members can post daily updates
- Each update has: Yesterday, Today, Blockers
- Show updates grouped by date
- Allow team members to add reactions
- Display a summary of blockers
```

**Step 3: Customize the Spark**

After generation:
- Change colors and theme
- Modify layout
- Add or remove features
- Set access permissions

**Step 4: Share with Team**

```yaml
Sharing options:
  ○ Private (only you)
  ● Team (organization members)
  ○ Public (anyone with link)
```

**Quick Exercise** - Try one of these:
```
1. "Build a sprint retrospective board with What Went Well,
   What Didn't, and Action Items columns. Let users vote."

2. "Create a project status dashboard with progress bars."

3. "Make a team poll app with pie chart results."
```

---

## Module 3: Dashboards, Projects & Issue Forms (30 minutes)

### Part A: GitHub Native Dashboards (10 minutes)

#### Available Dashboards

| Dashboard | Location | Key Metrics |
|-----------|----------|-------------|
| Security Overview | Org → Security | Alerts, coverage, trends |
| Actions | Org → Actions | Runs, success rate, costs |
| Copilot | Org → Settings → Copilot | Usage, adoption, value |
| Insights | Org → Insights | Activity, contributors |
| Enterprise | Enterprise → Overview | All orgs summary |

#### Hands-On: Navigate Dashboards (7 minutes)

**Security Dashboard**:
```
Navigation: Organization → Security → Overview
```

```yaml
Risk View:
  - Sort by: Most critical alerts first
  - Filter by: Team or repository
  - Action: Prioritize remediation

Coverage View:
  - Check: Which repos lack protection
  - Goal: 100% coverage

Trends:
  - Metric: Mean Time to Remediation (MTTR)
  - Goal: Decreasing trend
```

**Actions Dashboard**:
```
Navigation: Organization → Settings → Actions → Management
```

```yaml
Workflow Performance:
  - Success rate: XX%
  - Average duration: X min
  - Failed runs: X

Cost Analysis:
  - Minutes used: XXX / YYY
  - Projected cost: $XXX
```

**Enterprise Dashboard** (Enterprise only):
```
Navigation: Enterprise → Overview
```

```yaml
Summary:
  - Total organizations
  - Total members
  - License utilization
  - Security alerts across all orgs
```

---

### Part B: GitHub Projects Enterprise (10 minutes)

#### Hands-On: Create Enterprise Project

**Step 1: Create New Project**

```
Navigation: Organization → Projects → New project
```

Select Template: **Team Planning**

**Step 2: Configure Custom Fields**

```
Project → Settings → Custom fields → New field
```

```yaml
Field 1 - Priority:
  Type: Single select
  Options: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low

Field 2 - Story Points:
  Type: Number

Field 3 - Sprint:
  Type: Iteration
  Duration: 2 weeks

Field 4 - Team:
  Type: Single select
  Options: Backend, Frontend, DevOps, QA

Field 5 - Type:
  Type: Single select
  Options: 🆕 Feature, 🐛 Bug, 📝 Docs, 🔒 Security
```

**Step 3: Create Views**

**Board View** (Kanban):
```yaml
Name: Sprint Board
Group by: Status
Columns: Backlog → Ready → In Progress → Review → Done
Filter: Sprint = @current
Sort: Priority (ascending)
```

**Table View** (Backlog):
```yaml
Name: Full Backlog
Columns: Title, Status, Priority, Team, Points, Sprint
Group by: Team
```

**Roadmap View**:
```yaml
Name: Release Roadmap
Date field: Sprint
Zoom: Month
Filter: Type = Feature
```

**Step 4: Configure Automation**

```
Project → Settings → Workflows
```

```yaml
Item added to project:
  ☑ Set Status to: Backlog

Item closed:
  ☑ Set Status to: Done

Pull request merged:
  ☑ Set Status to: Done
```

**Step 5: View Insights**

```
Project → Insights → New chart
```

```yaml
Chart: Bar chart
X-axis: Status
Y-axis: Count
Filter: Sprint = @current
```

---

### Part C: Issue Forms & Discussions (10 minutes)

#### Hands-On: Create Issue Forms

**Step 1: Bug Report Form**

Create `.github/ISSUE_TEMPLATE/bug_report.yml`:

```yaml
name: Bug Report
description: Report a bug to help us improve
title: "[Bug]: "
labels: ["bug", "triage"]
projects: ["YOUR_ORG/1"]

body:
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - Critical - System down
        - High - Major feature broken
        - Medium - Feature partially working
        - Low - Minor issue
    validations:
      required: true

  - type: dropdown
    id: environment
    attributes:
      label: Environment
      multiple: true
      options:
        - Production
        - Staging
        - Development
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: What happened?
      placeholder: Describe the bug
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Relevant logs
      render: shell

  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: I have searched for existing issues
          required: true
```

**Step 2: Feature Request Form**

Create `.github/ISSUE_TEMPLATE/feature_request.yml`:

```yaml
name: Feature Request
description: Suggest a new feature
title: "[Feature]: "
labels: ["enhancement"]

body:
  - type: dropdown
    id: area
    attributes:
      label: Feature Area
      options:
        - Frontend/UI
        - Backend/API
        - Infrastructure
        - Security
        - Documentation
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: What problem does this solve?
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
    validations:
      required: true
```

**Step 3: Configure Template Chooser**

Create `.github/ISSUE_TEMPLATE/config.yml`:

```yaml
blank_issues_enabled: false
contact_links:
  - name: Security Vulnerabilities
    url: https://github.com/ORG/REPO/security/advisories/new
    about: Report security issues privately

  - name: Questions
    url: https://github.com/ORG/REPO/discussions/new
    about: Ask questions in Discussions
```

**Step 4: Enable Discussions**

```
Repository → Settings → Features → Discussions ✅
```

**Configure Categories**:
```yaml
Categories:
  - 📣 Announcements (Announcement format)
  - 💬 General (Open discussion)
  - 💡 Ideas (Open discussion)
  - 🙏 Q&A (Question/Answer format)
  - 🙌 Show and Tell (Open discussion)
```

---

## Hands-On Challenge (15 minutes)

### Mini Project: Set Up Enterprise Repository

**Objective**: Configure a repository with all enterprise features learned today.

**Requirements Checklist**:

```markdown
## Enterprise Repository Setup Checklist

### Module 1: Codespaces & Security
- [ ] Created `.devcontainer/devcontainer.json`
- [ ] Added VS Code extensions (Copilot, ESLint, etc.)
- [ ] Configured post-create commands
- [ ] Enabled Dependabot alerts
- [ ] Enabled secret scanning + push protection
- [ ] Created `.github/workflows/codeql.yml`
- [ ] Created `.github/workflows/dependency-review.yml`
- [ ] Verified Security tab shows all features

### Module 2: Copilot, Copilot Spaces & Spark
- [ ] Copilot CLI extension installed (`gh extension install github/gh-copilot`)
- [ ] Tested `gh copilot explain` and `gh copilot suggest`
- [ ] Added shell aliases for quick access
- [ ] Created `.github/copilot-space.yml` configuration
- [ ] Tested Copilot Space from Issue/PR
- [ ] (Bonus) Created a Spark for team use

### Module 3: Projects & Issue Forms
- [ ] Created organization Project
- [ ] Added custom fields (Priority, Team, Sprint)
- [ ] Created views (Board, Table, Roadmap)
- [ ] Enabled automation workflows
- [ ] Created `.github/ISSUE_TEMPLATE/bug_report.yml`
- [ ] Created `.github/ISSUE_TEMPLATE/feature_request.yml`
- [ ] Created `.github/ISSUE_TEMPLATE/config.yml`
- [ ] Enabled Discussions

### Verification
- [ ] Can create Codespace from repository
- [ ] Security overview shows the repository
- [ ] Project board shows repository issues
- [ ] Issue forms appear when creating new issue
```

---

## Wrap-Up & Q&A (5 minutes)

### Key Takeaways

| Feature | Key Benefit | Action Item |
|---------|-------------|-------------|
| Codespaces | Secure, consistent dev environments | Configure devcontainer for key repos |
| GHAS | Automated security scanning | Enable for all repositories |
| Copilot Enterprise | AI-powered productivity | Create knowledge bases |
| Copilot CLI | Terminal AI assistance | Install extension + aliases |
| Copilot Spaces | AI-enhanced dev environments | Create copilot-space.yml configs |
| Spark | Quick internal tools | Build team utilities |
| Dashboards | Visibility and metrics | Review weekly |
| Projects | Enterprise tracking | Standardize across teams |
| Issue Forms | Structured issue creation | Create templates for all repos |

### Next Steps

```yaml
This Week:
  - Enable GHAS on 3 key repositories
  - Install Copilot CLI extension
  - Create devcontainer for main project
  - Set up organization Project

This Month:
  - Achieve 100% GHAS coverage
  - Create Copilot knowledge base
  - Configure Copilot Spaces for key repos
  - Build team dashboard with Spark
  - Roll out Issue Forms to all repos

Ongoing:
  - Monitor Security Overview weekly
  - Track Copilot adoption metrics
  - Review and improve processes
```

### Resources

| Resource | Link |
|----------|------|
| GitHub Enterprise Docs | https://docs.github.com/enterprise-cloud |
| GHAS Documentation | https://docs.github.com/code-security |
| Codespaces Guide | https://docs.github.com/codespaces |
| Copilot Enterprise | https://docs.github.com/copilot |
| Copilot CLI | https://docs.github.com/copilot/github-copilot-in-the-cli |
| GitHub Projects | https://docs.github.com/issues/planning-and-tracking |
| Issue Forms | https://docs.github.com/communities/using-templates-to-encourage-useful-issues-and-pull-requests |

---

## Appendix: Quick Reference Cards

### Codespaces CLI Commands

```bash
# Create Codespace
gh codespace create -r owner/repo -b main

# List Codespaces
gh codespace list

# Open in VS Code
gh codespace code -c <name>

# Open in browser
gh codespace view -c <name> -w

# Stop Codespace
gh codespace stop -c <name>

# Delete Codespace
gh codespace delete -c <name>

# SSH into Codespace
gh codespace ssh -c <name>
```

### Copilot CLI Commands

```bash
# Install
gh extension install github/gh-copilot

# Explain a command
gh copilot explain "command here"

# Suggest a command
gh copilot suggest "what you want to do"

# Git-specific help
gh copilot suggest -t git "squash commits"

# Shell-specific help
gh copilot suggest -t shell "find large files"

# Update extension
gh extension upgrade gh-copilot
```

### Copilot Spaces Quick Reference

```bash
# Create Copilot Space from repository
Repository → Code → Codespaces → "New with Copilot"

# Open from Issue/PR
Issue/PR → "Open in Copilot Space"

# In Copilot Space, use these commands:
@copilot How does this project work?
@copilot Help me with issue #123
@copilot Create endpoint following our patterns
@copilot Why is this test failing?
```

**copilot-space.yml Quick Template**:
```yaml
context:
  priority_paths: ["src/**", "docs/**"]
  exclude_paths: ["node_modules/**", ".env*"]
onboarding:
  message: "Welcome! Run npm run dev to start."
tasks:
  - name: "Add endpoint"
    template: "Create REST endpoint"
```

### Security CLI Commands

```bash
# List Dependabot alerts
gh api /repos/{owner}/{repo}/dependabot/alerts \
  --jq '.[] | {severity: .security_advisory.severity, package: .dependency.package.name}'

# List code scanning alerts
gh api /repos/{owner}/{repo}/code-scanning/alerts \
  --jq '.[] | {rule: .rule.id, severity: .rule.security_severity_level}'

# List secret scanning alerts
gh api /repos/{owner}/{repo}/secret-scanning/alerts \
  --jq '.[] | {type: .secret_type, state: .state}'

# Organization security overview
gh api /orgs/{org}/security-managers
```

### Project CLI Commands

```bash
# List projects
gh project list --owner ORG_NAME

# View project items
gh project item-list PROJECT_NUMBER --owner ORG_NAME

# Add issue to project
gh project item-add PROJECT_NUMBER --owner ORG_NAME --url ISSUE_URL

# Create project
gh project create --owner ORG_NAME --title "Project Name"

# Close project
gh project close PROJECT_NUMBER --owner ORG_NAME
```

### Enterprise Admin CLI Commands

```bash
# List organization members
gh api /orgs/{org}/members --jq '.[].login'

# View audit log
gh api /orgs/{org}/audit-log --jq '.[] | {action, actor: .actor, created_at}'

# List Copilot seats
gh api /orgs/{org}/copilot/billing/seats --jq '.seats[].assignee.login'

# List self-hosted runners
gh api /orgs/{org}/actions/runners --jq '.runners[] | {name, status}'

# Get repository rulesets
gh api /repos/{owner}/{repo}/rulesets --jq '.[].name'
```

---

**Workshop Materials**:
- [Task 4: GitHub Enterprise Security Features](./tasks/Task-04-GitHub-Enterprise-Features.md)
- [Task 5: GitHub Enterprise Advanced Features](./tasks/Task-05-GitHub-Enterprise-Advanced.md)
- [Task 6: GitHub Projects & Issues Enterprise](./tasks/Task-06-GitHub-Projects-Enterprise.md)

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 3.0
