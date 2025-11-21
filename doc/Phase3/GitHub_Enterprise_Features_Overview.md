# GitHub Enterprise Features Overview

## Introduction

This document provides a comprehensive overview of GitHub Enterprise Cloud features for enterprise organizations. These features enable secure development, AI-powered productivity, and enterprise-grade project management.

---

## GitHub Enterprise Cloud Architecture

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

---

## Features Comparison by Plan

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

## Development Features

### 1. GitHub Codespaces

Cloud-hosted development environments with enterprise controls.

**Key Benefits**:
| Benefit | Description |
|---------|-------------|
| Isolation | Code never leaves GitHub's cloud |
| Standardization | Same environment for all developers |
| Security Controls | Audit access, manage secrets centrally |
| Pre-configured Tools | Security tools pre-installed |

**Enterprise Settings**:
```yaml
Machine types:
  ☑ 2-core (8 GB RAM)     # Default
  ☑ 4-core (16 GB RAM)    # For larger projects
  ☐ 8-core (32 GB RAM)    # Restricted

Timeout & Retention:
  Default idle timeout: 30 minutes
  Default retention period: 14 days

Cost Controls:
  Monthly spending limit: $500/user
```

---

### 2. GitHub Copilot Enterprise

AI-powered code completion and chat with enterprise features.

**Copilot Tiers**:

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

**Enterprise-Only Features**:
- **Knowledge Bases**: Index internal documentation for context-aware assistance
- **PR Summaries**: Auto-generate pull request summaries
- **Code Review**: AI-assisted code review suggestions
- **Usage Metrics**: Track adoption and productivity gains

---

### 3. GitHub Copilot CLI

AI assistance directly in your terminal.

**Key Commands**:
```bash
# Install
gh extension install github/gh-copilot

# Explain a command
gh copilot explain "git rebase -i HEAD~5"

# Suggest a command
gh copilot suggest "find all files modified in the last 24 hours"

# Git-specific help
gh copilot suggest -t git "squash commits"
```

**Recommended Aliases**:
```bash
alias '??'='gh copilot explain'
alias '?!'='gh copilot suggest'
alias githelp='gh copilot suggest -t git'
```

---

### 4. GitHub Copilot Spaces (Preview)

AI-enhanced cloud development environments combining Codespaces with Copilot.

**Comparison**:
| Feature | Codespaces | Copilot Spaces |
|---------|------------|----------------|
| Cloud dev environment | ✅ | ✅ |
| Copilot code completion | Optional | ✅ Built-in |
| Project context awareness | ❌ | ✅ |
| AI-assisted onboarding | ❌ | ✅ |
| Task understanding | ❌ | ✅ |

**How to Use**:
```
Repository → Code → Codespaces → "New with Copilot"
OR
Issue/PR → "Open in Copilot Space"
```

**AI Commands in Copilot Space**:
```bash
@copilot How does this project work?
@copilot Help me with issue #123
@copilot Create endpoint following our patterns
@copilot Why is this test failing?
```

**Configuration** (`.github/copilot-space.yml`):
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

---

### 5. GitHub Spark (Preview)

AI-powered micro-app builder using natural language.

**Key Features**:
- Create apps without coding
- Natural language descriptions
- Instant deployment
- PWA support
- Team sharing

**Use Cases**:
| Category | Examples |
|----------|----------|
| Personal | Task trackers, habit logs, expense tracking |
| Team | Standup boards, polls, retrospectives |
| Enterprise | Internal tools, dashboards, forms |

---

## Security Features

### 1. GitHub Advanced Security (GHAS)

**Components**:

| Feature | What It Does | When It Runs |
|---------|--------------|--------------|
| **Code Scanning** | Finds vulnerabilities in code | On push/PR |
| **Secret Scanning** | Detects exposed credentials | Real-time |
| **Dependency Review** | Checks for vulnerable packages | On PR |
| **Push Protection** | Blocks secrets before commit | On push |

**Recommended Settings**:
```yaml
Dependency graph: ✅ Enabled for all repositories
Dependabot alerts: ✅ Enabled for all repositories
Dependabot security updates: ✅ Enabled for all repositories

Secret scanning:
  ☑ Automatically enable for new repositories
  ☑ Push protection: Enabled
  ☑ Validity checks: Enabled

Code scanning:
  ☑ Default setup for new repositories
```

---

### 2. Audit Log & Compliance

**Audit Log Streaming Destinations**:
- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- Splunk
- Datadog

**Events to Stream**:
```yaml
☑ Repository events
☑ Organization events
☑ Enterprise events
☑ User events
```

---

## Management Features

### 1. GitHub Native Dashboards

| Dashboard | Location | Key Metrics |
|-----------|----------|-------------|
| Security Overview | Org → Security | Alerts, coverage, trends |
| Actions | Org → Actions | Runs, success rate, costs |
| Copilot | Org → Settings → Copilot | Usage, adoption, value |
| Insights | Org → Insights | Activity, contributors |
| Enterprise | Enterprise → Overview | All orgs summary |

**Security Dashboard Views**:
```yaml
Risk View:
  - Repositories with most alerts
  - Alert severity breakdown
  - Prioritize remediation

Coverage View:
  - Features enabled per repo
  - Goal: 100% coverage

Trends:
  - Mean Time to Remediation (MTTR)
  - Alert open/close rate
```

---

### 2. GitHub Projects (New)

**Features**:
| Feature | Description |
|---------|-------------|
| Custom Fields | Priority, Story Points, Sprint, Team |
| Multiple Views | Board, Table, Roadmap |
| Automation | Auto-add, auto-close, status updates |
| Insights | Burn-down, velocity, distribution |

**Recommended Custom Fields**:
```yaml
Priority: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low
Story Points: Number field
Sprint: Iteration (2 weeks)
Team: Backend, Frontend, DevOps, QA
Type: 🆕 Feature, 🐛 Bug, 📝 Docs, 🔒 Security
```

**Views**:
- **Board View**: Kanban-style sprint board
- **Table View**: Full backlog with filtering
- **Roadmap View**: Timeline visualization

---

### 3. Issue Forms

Structured issue creation with templates.

**Bug Report Form Example**:
```yaml
name: Bug Report
title: "[Bug]: "
labels: ["bug", "triage"]

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

  - type: textarea
    id: description
    attributes:
      label: What happened?
```

---

### 4. GitHub Discussions

Community collaboration features.

**Categories**:
```yaml
- 📣 Announcements (Announcement format)
- 💬 General (Open discussion)
- 💡 Ideas (Open discussion)
- 🙏 Q&A (Question/Answer format)
- 🙌 Show and Tell (Open discussion)
```

---

## Quick Reference

### CLI Commands Summary

```bash
# Codespaces
gh codespace create -r owner/repo -b main
gh codespace list
gh codespace code -c <name>

# Copilot CLI
gh copilot explain "command"
gh copilot suggest "task description"

# Security
gh api /repos/{owner}/{repo}/dependabot/alerts
gh api /repos/{owner}/{repo}/code-scanning/alerts

# Projects
gh project list --owner ORG_NAME
gh project item-add PROJECT_NUMBER --owner ORG --url ISSUE_URL

# Enterprise Admin
gh api /orgs/{org}/audit-log
gh api /orgs/{org}/copilot/billing/seats
```

---

## Implementation Roadmap

```yaml
Week 1:
  - Enable GHAS on key repositories
  - Install Copilot CLI extension
  - Create devcontainer for main project
  - Set up organization Project

Month 1:
  - Achieve 100% GHAS coverage
  - Create Copilot knowledge base
  - Configure Copilot Spaces for key repos
  - Roll out Issue Forms to all repos

Ongoing:
  - Monitor Security Overview weekly
  - Track Copilot adoption metrics
  - Review and improve processes
```

---

## Resources

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

## Related Documents

- [Workshop Guide](./GitHub_Enterprise_Features_Workshop.md) - 2-hour hands-on workshop
- [Task 4: GitHub Enterprise Security Features](./tasks/Task-04-GitHub-Enterprise-Features.md)
- [Task 5: GitHub Enterprise Advanced Features](./tasks/Task-05-GitHub-Enterprise-Advanced.md)
- [Task 6: GitHub Projects & Issues Enterprise](./tasks/Task-06-GitHub-Projects-Enterprise.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
