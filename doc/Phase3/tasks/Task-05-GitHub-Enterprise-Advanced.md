# Task 5: GitHub Enterprise Advanced Features

**Role**: All Roles (PM, Developer, QA)
**Estimated Time**: 4-5 hours
**Feature**: GitHub Enterprise Cloud Advanced Features

---

## Objectives

- Understand and utilize GitHub Enterprise Advanced Features
- Configure GitHub Copilot Enterprise
- Set up GitHub Actions for Enterprise
- Enable SAML SSO and Team Synchronization
- Manage Enterprise Managed Users (EMU)
- Utilize GitHub Insights and API

## Prerequisites

- GitHub Enterprise Cloud license
- Organization owner/admin access
- Enterprise admin access (for some features)
- IdP access for SAML/SSO configuration

---

## Part A: GitHub Copilot Enterprise

### Overview

GitHub Copilot Enterprise provides additional capabilities beyond Copilot Individual:

| Feature | Individual | Business | Enterprise |
|---------|------------|----------|------------|
| Code completions | ✅ | ✅ | ✅ |
| Chat in IDE | ✅ | ✅ | ✅ |
| Chat in GitHub.com | ❌ | ❌ | ✅ |
| Pull request summaries | ❌ | ❌ | ✅ |
| Docset indexing | ❌ | ❌ | ✅ |
| Fine-tuned models | ❌ | ❌ | ✅ |
| Knowledge bases | ❌ | ❌ | ✅ |
| Admin controls | ❌ | ✅ | ✅ |
| Audit logs | ❌ | ✅ | ✅ |

---

### Step 1: Configure Copilot at Enterprise Level

#### 1.1 Enterprise Settings

```
Enterprise → Settings → Copilot
```

**Policy Settings**:
```
✅ Enable Copilot for all organizations
   OR
✅ Enable Copilot for selected organizations

Suggestions matching public code:
○ Allow
● Block (recommended for enterprise)

Copilot Chat:
✅ Enable in IDE
✅ Enable on GitHub.com
✅ Enable in CLI

Data retention:
○ Allow GitHub to use code snippets for improvements
● Do not allow (recommended for sensitive codebases)
```

#### 1.2 Organization Settings

```
Organization → Settings → Copilot → Access
```

**Member Access**:
```
Grant access to:
○ All members of the organization
● Selected teams/members

Selected teams:
✅ engineering-team
✅ qa-team
✅ devops-team
```

---

### Step 2: Copilot Knowledge Bases (Enterprise Only)

#### 2.1 Create Knowledge Base

Knowledge bases allow Copilot to reference your internal documentation and coding standards.

```
Organization → Settings → Copilot → Knowledge bases → Create
```

**Configuration**:
```yaml
Name: internal-docs
Description: Internal documentation and coding standards

Repositories to index:
- org/documentation
- org/coding-standards
- org/api-specs

Content types:
✅ Markdown files
✅ Code comments
✅ README files
✅ Wiki pages
```

#### 2.2 Using Knowledge Bases in Chat

```
# In Copilot Chat, reference the knowledge base:

@workspace /kb:internal-docs How do I implement authentication?

# Copilot will search the indexed documentation and provide
# context-aware responses based on your internal docs
```

#### 2.3 Best Practices for Knowledge Bases

1. **Keep documentation up-to-date** - Stale docs lead to outdated suggestions
2. **Structure content clearly** - Use headers, sections, and code examples
3. **Include examples** - Real-world examples improve Copilot responses
4. **Review indexed content** - Ensure no sensitive data is indexed

---

### Step 3: Copilot Pull Request Features

#### 3.1 Enable PR Summaries

```
Organization → Settings → Copilot → Pull requests
```

**Settings**:
```
✅ Enable Copilot-generated PR summaries
✅ Enable Copilot code review suggestions
✅ Enable Copilot test generation suggestions
```

#### 3.2 Using PR Features

**Auto-generate PR Summary**:
```
When creating a PR:
1. Click "Generate summary with Copilot" button
2. Review and edit the generated summary
3. Copilot analyzes:
   - Code changes
   - Commit messages
   - Related issues
   - Testing coverage
```

**Code Review with Copilot**:
```
In PR review:
1. Click "Review with Copilot"
2. Copilot provides:
   - Security concerns
   - Performance issues
   - Code quality suggestions
   - Best practice recommendations
```

#### 3.3 PR Summary Example

```markdown
## Summary
This PR implements user authentication using JWT tokens.

## Changes
- Added `AuthService` class for handling authentication
- Implemented login and logout endpoints
- Added middleware for token validation
- Created unit tests for auth flows

## Testing
- 15 new unit tests added
- All existing tests pass
- Manual testing completed for login flow

## Security Considerations
- Tokens expire after 1 hour
- Refresh tokens implemented
- Password hashing using bcrypt
```

---

### Step 4: Copilot Metrics and Audit

#### 4.1 View Usage Metrics

```
Organization → Settings → Copilot → Usage
```

**Available Metrics**:
- Active users per day/week/month
- Acceptance rate of suggestions
- Lines of code accepted
- Languages used
- Most active repositories

#### 4.2 Audit Copilot Usage

```
Organization → Settings → Audit log
Filter: action:copilot
```

**Tracked Events**:
- `copilot.cfb_suggestions_shown` - Suggestions displayed to user
- `copilot.cfb_suggestion_accepted` - User accepted a suggestion
- `copilot.chat_conversation` - Chat interaction occurred
- `copilot.pr_summary_generated` - PR summary was generated

#### 4.3 Usage Report Example

| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Active Users | 45 | 42 | +7% |
| Suggestions Shown | 12,450 | 11,200 | +11% |
| Suggestions Accepted | 4,980 | 4,200 | +19% |
| Acceptance Rate | 40% | 37.5% | +2.5% |
| Lines Accepted | 8,750 | 7,400 | +18% |

---

## Part B: Enterprise Identity Management

### Step 5: Configure SAML Single Sign-On (SSO)

#### 5.1 SAML SSO Overview

SAML SSO allows enterprise users to authenticate using their corporate identity provider.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│    IdP      │────▶│   GitHub    │
│             │     │ (Okta/Azure │     │ Enterprise  │
│             │◀────│  /OneLogin) │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Benefits**:
- Centralized authentication
- Automated user provisioning/deprovisioning
- Consistent access policies
- Enhanced security with MFA through IdP

#### 5.2 Enable SAML SSO

```
Organization → Settings → Authentication security → SAML single sign-on
```

**Configuration Steps**:

1. **Get GitHub SSO URLs**:
   ```
   Assertion Consumer Service URL: https://github.com/orgs/YOUR_ORG/saml/consume
   Entity ID: https://github.com/orgs/YOUR_ORG
   ```

2. **Configure IdP** (Example: Okta):
   ```
   Application → Add Application → SAML 2.0

   Single sign on URL: https://github.com/orgs/YOUR_ORG/saml/consume
   Audience URI: https://github.com/orgs/YOUR_ORG
   Name ID format: EmailAddress

   Attribute Statements:
   - emails: user.email
   - name: user.displayName
   - login: user.login
   ```

3. **Configure GitHub**:
   ```
   Sign on URL: https://your-idp.com/sso/saml
   Issuer: https://your-idp.com/issuer
   Public certificate: [Paste IdP certificate]

   ✅ Enable SAML authentication
   ✅ Require SAML authentication for all members
   ```

#### 5.3 SAML SSO Best Practices

```markdown
## SAML SSO Configuration Checklist

### Before Enabling
- [ ] Test with a pilot group first
- [ ] Document recovery procedures
- [ ] Ensure admins have recovery codes saved
- [ ] Communicate rollout timeline to all users
- [ ] Verify IdP is properly configured

### Security Settings
- [ ] Enable "Require SAML SSO" after testing
- [ ] Set session timeout (recommended: 8 hours)
- [ ] Enable "Require 2FA through IdP"
- [ ] Configure IP allow lists (if needed)

### After Enabling
- [ ] Monitor login failures in audit log
- [ ] Document troubleshooting steps
- [ ] Set up alerting for SSO issues
- [ ] Schedule regular access reviews
```

---

### Step 6: Team Synchronization

#### 6.1 Enable Team Sync

Team Sync automatically synchronizes IdP groups with GitHub teams.

```
Organization → Settings → Authentication security → Team synchronization
```

**Prerequisites**:
- SAML SSO enabled and enforced
- IdP supports SCIM or group sync

#### 6.2 Configure Team Sync with Azure AD

```
Azure AD Configuration:
1. Enterprise Applications → GitHub → Provisioning
2. Set Provisioning Mode: Automatic
3. Configure Admin Credentials:
   - Tenant URL: https://api.github.com/scim/v2/organizations/YOUR_ORG
   - Secret Token: [GitHub PAT with admin:org scope]
4. Map Azure AD groups to GitHub teams
```

**Mapping Example**:
```yaml
Azure AD Group        →  GitHub Team
────────────────────────────────────────
Engineering           →  engineering-team
QA                    →  qa-team
DevOps                →  devops-team
Management            →  org-admins
Frontend Developers   →  frontend-team
Backend Developers    →  backend-team
```

#### 6.3 Configure Team Sync with Okta

```
Okta Configuration:
1. Applications → GitHub Enterprise → Push Groups
2. Add group mappings:

   Okta Group: Engineering
   GitHub Team: engineering-team

   Okta Group: QA
   GitHub Team: qa-team
```

#### 6.4 Team Sync Benefits

| Benefit | Description |
|---------|-------------|
| Automated provisioning | New employees get correct access immediately |
| Automated deprovisioning | Leaving employees lose access automatically |
| Consistent permissions | Team changes in IdP reflect in GitHub |
| Reduced admin overhead | No manual team management needed |
| Audit compliance | Single source of truth for access |

---

### Step 7: Enterprise Managed Users (EMU)

#### 7.1 EMU Overview

Enterprise Managed Users provides maximum control over user accounts.

| Feature | Regular Org | EMU |
|---------|-------------|-----|
| User provisioning | Manual invite | Automated via IdP |
| User lifecycle | User-controlled | Company-controlled |
| Username format | Any | `shortcode_username` |
| Personal repos | Allowed | Blocked |
| Public contributions | Allowed | Blocked |
| External collaborators | Allowed | Limited |
| Account recovery | User manages | Admin manages |

#### 7.2 EMU Configuration

```
Enterprise → Settings → Authentication security → Enterprise Managed Users
```

**SCIM Provisioning**:
```yaml
Provisioning endpoint: https://api.github.com/scim/v2/enterprises/YOUR_ENTERPRISE

Required SCIM attributes:
- userName (required)
- name.givenName (required)
- name.familyName (required)
- emails (required)
- externalId (required)

Optional attributes:
- displayName
- active
```

#### 7.3 EMU User Lifecycle

```
┌─────────────────┐
│ IdP creates     │
│ user account    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SCIM syncs      │
│ to GitHub       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User gets       │
│ GitHub EMU      │
│ account         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Team sync       │
│ assigns         │
│ permissions     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User can now    │
│ access repos    │
└─────────────────┘
```

#### 7.4 When to Use EMU

**Use EMU when**:
- Maximum security control is required
- Users should not have personal GitHub activities
- All development must stay within enterprise
- Strict compliance requirements exist

**Use Regular Org when**:
- Users need personal GitHub accounts
- External collaboration is common
- Open source contribution is encouraged

---

## Part C: GitHub Actions for Enterprise

### Step 8: Actions Enterprise Features

#### 8.1 Self-Hosted Runners

Self-hosted runners allow you to run workflows on your own infrastructure.

**Benefits**:
- Run on your infrastructure
- Access internal resources (databases, APIs)
- Custom hardware/software configurations
- Cost control for heavy usage
- Data sovereignty compliance

**Setup Runner Group**:
```
Organization → Settings → Actions → Runner groups → New runner group
```

**Configuration**:
```yaml
Name: production-runners
Visibility: Selected repositories
Repositories:
  - org/main-app
  - org/api-service

Workflow access:
✅ Allow public repositories (if needed)
✅ Allow selected workflows only:
  - deploy-production.yml
  - security-scan.yml
```

#### 8.2 Install Self-Hosted Runner

```bash
# Download runner package
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz

# Configure runner
./config.sh --url https://github.com/YOUR_ORG \
  --token YOUR_TOKEN \
  --name production-runner-1 \
  --labels production,linux,x64

# Run as service
sudo ./svc.sh install
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

#### 8.3 Runner Labels and Targeting

```yaml
# Workflow targeting specific runners
jobs:
  deploy:
    runs-on: [self-hosted, production, linux, x64]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to production
        run: ./deploy.sh
        env:
          INTERNAL_API: ${{ secrets.INTERNAL_API_URL }}
```

#### 8.4 Runner Security Best Practices

```markdown
## Self-Hosted Runner Security Checklist

### Infrastructure
- [ ] Dedicated machines for runners (not shared)
- [ ] Network isolation from sensitive systems
- [ ] Regular security patching
- [ ] Encrypted storage for runner data

### Access Control
- [ ] Runner groups limit repository access
- [ ] Workflow restrictions in place
- [ ] Secrets not exposed to untrusted workflows
- [ ] Audit logging enabled

### Monitoring
- [ ] Resource utilization monitored
- [ ] Failed job alerting configured
- [ ] Runner health checks automated
- [ ] Log retention policy defined
```

---

### Step 9: Actions Policies

#### 9.1 Organization Actions Policies

```
Organization → Settings → Actions → General
```

**Policies**:
```
Actions permissions:
○ Allow all actions and reusable workflows
○ Allow select actions and reusable workflows
● Disable actions (most restrictive)

Selected actions:
✅ Allow actions created by GitHub
✅ Allow actions by Marketplace verified creators
✅ Allow specified actions and reusable workflows:
   - actions/*
   - github/*
   - docker/*
   - azure/*
   - your-org/*
```

#### 9.2 Required Workflows (Enterprise)

Required workflows run automatically on all matching repositories.

```
Enterprise → Settings → Actions → Required workflows
```

**Configure Required Workflow**:
```yaml
# .github/workflows/required-security-scan.yml
# This workflow runs on all PRs across the enterprise

name: Required Security Scan

on:
  pull_request:
    branches: [main, develop]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Run security scan
      uses: your-org/security-action@v1

    - name: Check for vulnerabilities
      run: |
        if [ -f security-report.json ]; then
          CRITICAL=$(jq '.critical' security-report.json)
          if [ "$CRITICAL" -gt 0 ]; then
            echo "Critical vulnerabilities found!"
            exit 1
          fi
        fi
```

**Apply to Repositories**:
```
Required workflow: security-scan.yml
Apply to:
○ All repositories
● Selected repositories:
  - org/main-app
  - org/api-service
  - org/frontend-app
```

---

### Step 10: Larger Runners (Enterprise)

#### 10.1 Configure Larger Runners

GitHub-hosted larger runners provide more compute power.

```
Organization → Settings → Actions → Runners → New GitHub-hosted runner
```

**Available Sizes**:
| Size | vCPUs | RAM | Storage | Use Case |
|------|-------|-----|---------|----------|
| Standard | 2 | 7 GB | 14 GB | Most workflows |
| 4-core | 4 | 16 GB | 150 GB | Medium builds |
| 8-core | 8 | 32 GB | 300 GB | Large builds |
| 16-core | 16 | 64 GB | 600 GB | Complex builds |
| 32-core | 32 | 128 GB | 1200 GB | Very large builds |
| 64-core | 64 | 256 GB | 2040 GB | Maximum performance |

#### 10.2 GPU Runners

For machine learning and GPU-intensive workloads:

```yaml
# Using GPU runner for ML workflows
jobs:
  train-model:
    runs-on: [self-hosted, gpu, linux]
    steps:
    - uses: actions/checkout@v4

    - name: Setup Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'

    - name: Train ML model
      run: python train.py
      env:
        CUDA_VISIBLE_DEVICES: 0
```

#### 10.3 macOS and Windows Runners

```yaml
# Cross-platform build matrix
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        include:
          - os: macos-latest
            runner: macos-latest-xlarge  # Larger macOS runner

    runs-on: ${{ matrix.runner || matrix.os }}
    steps:
    - uses: actions/checkout@v4
    - name: Build
      run: ./build.sh
```

---

## Part D: GitHub Insights & API

### Step 11: GitHub Insights

#### 11.1 Organization Insights

```
Organization → Insights
```

**Available Dashboards**:
| Dashboard | Description |
|-----------|-------------|
| Pulse | Activity overview (PRs, issues, commits) |
| Contributors | Contribution statistics by member |
| Community | Community health metrics |
| Traffic | Repository traffic data |
| Commits | Commit activity over time |
| Code frequency | Lines added/removed over time |
| Dependency graph | Dependency relationships |

#### 11.2 Enterprise Insights

```
Enterprise → Insights
```

**Enterprise Metrics**:
```
Overview:
- Total repositories: 150
- Total members: 200
- Active contributors (30 days): 85
- Pull requests merged (30 days): 450

Security:
- Dependabot alerts: 23 open
- Code scanning alerts: 5 open
- Secret scanning alerts: 0 open

Actions:
- Workflow runs (30 days): 12,500
- Success rate: 94%
- Average duration: 8 minutes
```

---

### Step 12: GitHub API for Enterprise

#### 12.1 REST API Examples

**List Organization Members**:
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/orgs/YOUR_ORG/members"
```

**Get Repository Security Alerts**:
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/YOUR_ORG/REPO/dependabot/alerts"
```

**List Enterprise Audit Log**:
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/enterprises/YOUR_ENTERPRISE/audit-log?phrase=action:repo.create"
```

**Get Copilot Billing Information**:
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/orgs/YOUR_ORG/copilot/billing"
```

#### 12.2 GraphQL API Examples

**Query Organization Statistics**:
```graphql
query {
  organization(login: "YOUR_ORG") {
    repositories(first: 100) {
      totalCount
      nodes {
        name
        pullRequests(states: OPEN) {
          totalCount
        }
        issues(states: OPEN) {
          totalCount
        }
        vulnerabilityAlerts(first: 10) {
          totalCount
        }
      }
    }
    membersWithRole(first: 100) {
      totalCount
    }
  }
}
```

**Query Team Members**:
```graphql
query {
  organization(login: "YOUR_ORG") {
    team(slug: "engineering-team") {
      name
      members(first: 50) {
        nodes {
          login
          name
          email
        }
      }
    }
  }
}
```

#### 12.3 Webhook Configuration

```
Organization → Settings → Webhooks → Add webhook
```

**Enterprise Webhook Events**:
```yaml
Payload URL: https://your-server.com/github-webhook
Content type: application/json
Secret: your-webhook-secret

Events:
✅ Dependabot alerts
✅ Secret scanning alerts
✅ Code scanning alerts
✅ Repository events
✅ Organization events
✅ Member events
✅ Team events
```

**Sample Webhook Handler (Node.js)**:
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

app.post('/github-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!verifySignature(req.body, signature)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'];
  const payload = JSON.parse(req.body);

  switch (event) {
    case 'secret_scanning_alert':
      handleSecretAlert(payload);
      break;
    case 'dependabot_alert':
      handleDependabotAlert(payload);
      break;
    case 'code_scanning_alert':
      handleCodeScanningAlert(payload);
      break;
    default:
      console.log(`Received event: ${event}`);
  }

  res.status(200).send('OK');
});

function handleSecretAlert(payload) {
  console.log('Secret alert:', payload.alert.secret_type);
  // Send notification, create ticket, etc.
}

function handleDependabotAlert(payload) {
  console.log('Dependabot alert:', payload.alert.dependency.package.name);
  // Notify team, prioritize fix, etc.
}

function handleCodeScanningAlert(payload) {
  console.log('Code scanning alert:', payload.alert.rule.description);
  // Create issue, notify developers, etc.
}

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

---

## Part E: Enterprise Compliance Features

### Step 13: IP Allow Lists

#### 13.1 Configure IP Allow Lists

IP allow lists restrict access to your organization from specific IP addresses.

```
Organization → Settings → Authentication security → IP allow list
```

**Add IP Ranges**:
```
Name: Office Network
IP address or range: 203.0.113.0/24
Description: Main office IP range

Name: VPN
IP address or range: 198.51.100.0/24
Description: Corporate VPN exit points

Name: CI/CD
IP address or range: 192.0.2.0/24
Description: GitHub Actions and CI/CD systems
```

#### 13.2 Enable Enforcement

```
IP allow list settings:
✅ Enable IP allow list
✅ Enable IP allow list for installed GitHub Apps

⚠️ Warning: Ensure all legitimate access points are added before enabling
```

#### 13.3 IP Allow List Considerations

| Consideration | Recommendation |
|---------------|----------------|
| Remote workers | Add VPN IP ranges |
| CI/CD systems | Add runner IP addresses |
| Third-party integrations | Add service IP ranges |
| Emergency access | Document bypass procedures |
| Testing | Test thoroughly before enforcement |

---

### Step 14: Repository Rules (Rulesets)

#### 14.1 Create Organization Ruleset

Rulesets provide consistent policy enforcement across repositories.

```
Organization → Settings → Rules → Rulesets → New ruleset
```

**Ruleset Configuration**:
```yaml
Name: production-protection
Enforcement status: Active

Bypass list:
  - Organization admins
  - Repository admins (with justification)

Target repositories:
  - Include: All repositories
  - Exclude: *-sandbox, *-test

Target branches:
  - Include: main, release/*

Rules:
  ✅ Restrict deletions
  ✅ Require linear history
  ✅ Require deployments to succeed
     - Environment: production
  ✅ Require signed commits
  ✅ Require a pull request before merging
     - Required approvals: 2
     - Dismiss stale reviews: Yes
     - Require review from code owners: Yes
  ✅ Require status checks to pass
     - Required checks: ci, security-scan, tests
  ✅ Block force pushes
```

#### 14.2 Tag Protection Rules

```yaml
Name: release-tag-protection
Target tags:
  - Include: v*

Rules:
  ✅ Restrict who can create matching tags
     - Only organization admins
  ✅ Require signed tags
```

---

### Step 15: Export Compliance Data

#### 15.1 Migration and Backup

```
Organization → Settings → Actions → Export
```

**Export Options**:
- Repository data (code, issues, PRs)
- Wiki content
- Actions workflows
- Project boards

#### 15.2 Compliance Reports

Generate compliance reports via API:

```bash
# Actions billing report
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/orgs/YOUR_ORG/settings/billing/actions" \
  -o actions-billing.json

# Audit log export
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/orgs/YOUR_ORG/audit-log?phrase=created:>2025-01-01" \
  -o audit-log.json

# Security alerts summary
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/orgs/YOUR_ORG/dependabot/alerts" \
  -o security-alerts.json
```

---

## Part F: GitHub Mobile & CLI Enterprise

### Step 16: GitHub Mobile for Enterprise

#### 16.1 Mobile App Configuration

```
Organization → Settings → Mobile policy
```

**Settings**:
```
✅ Allow GitHub Mobile access
✅ Require device management (MDM)
✅ Require biometric authentication

Allowed features:
✅ View repositories
✅ View pull requests
✅ Review code
✅ Approve pull requests
❌ Merge pull requests (optional restriction)
✅ View issues
✅ Create issues
```

#### 16.2 Mobile Use Cases

| Use Case | Mobile Feature |
|----------|----------------|
| On-call response | View and triage issues |
| Quick code review | Review PR changes |
| Approve deployments | Approve environment deployments |
| Monitor CI/CD | Check workflow status |
| Stay updated | Push notifications for mentions |

---

### Step 17: GitHub CLI Enterprise Features

#### 17.1 CLI Authentication for Enterprise

```bash
# Login with Enterprise account
gh auth login --hostname github.your-company.com

# Or for SAML SSO
gh auth login
# Follow SSO flow when prompted

# Verify authentication
gh auth status
```

#### 17.2 Enterprise CLI Commands

```bash
# List organization members
gh api orgs/YOUR_ORG/members --jq '.[].login'

# View audit log
gh api orgs/YOUR_ORG/audit-log --jq '.[] | {action, actor, created_at}'

# List Copilot seat assignments
gh api orgs/YOUR_ORG/copilot/billing/seats --jq '.seats[].assignee.login'

# Export security alerts
gh api repos/YOUR_ORG/REPO/dependabot/alerts \
  --jq '.[] | {severity, package: .dependency.package.name}'

# List self-hosted runners
gh api orgs/YOUR_ORG/actions/runners --jq '.runners[] | {name, status, os}'

# Get repository rulesets
gh api repos/YOUR_ORG/REPO/rulesets --jq '.[].name'
```

#### 17.3 CLI Aliases for Common Tasks

```bash
# Add useful aliases
gh alias set audit 'api orgs/YOUR_ORG/audit-log'
gh alias set members 'api orgs/YOUR_ORG/members --jq ".[].login"'
gh alias set alerts 'api repos/$1/dependabot/alerts'

# Usage
gh audit
gh members
gh alerts YOUR_ORG/REPO
```

---

## Part G: GitHub Spark (Preview)

### Overview

GitHub Spark is an AI-native tool for creating and sharing micro-apps ("sparks") using natural language, without writing or deploying code. It's designed for personal productivity and enterprise use.

### Step 18: Understanding GitHub Spark

#### 18.1 What is GitHub Spark?

| Feature | Description |
|---------|-------------|
| **Natural Language Development** | Describe your app in plain English |
| **AI-Powered Generation** | Automatically generates functional web apps |
| **No Code Required** | Build apps without writing code |
| **Instant Deployment** | Apps are live immediately |
| **Data Persistence** | Built-in managed data storage |
| **PWA Support** | Install as mobile/desktop apps |
| **Sharing** | Share sparks with team members |

#### 18.2 Spark Use Cases

**Personal Productivity**:
- Task trackers and to-do lists
- Habit trackers
- Personal dashboards
- Note-taking apps
- Expense trackers

**Team Collaboration**:
- Meeting schedulers
- Team polls and voting
- Status boards
- Sprint retrospective tools
- Knowledge bases

**Enterprise Applications**:
- Internal tools and utilities
- Data visualization dashboards
- Workflow automation interfaces
- Customer feedback collectors
- Inventory management

#### 18.3 Creating a Spark

```
Steps to create a Spark:
1. Go to https://github.com/spark
2. Click "Create Spark"
3. Describe your app in natural language
4. Review and refine the generated app
5. Customize appearance and behavior
6. Share with your team
```

**Example Prompts**:

```
Prompt 1: "Create a team standup tracker where team members can
post daily updates with what they did yesterday, what they're
doing today, and any blockers"

Prompt 2: "Build a simple expense tracker that lets me log
expenses with category, amount, and date, and shows a monthly
summary chart"

Prompt 3: "Make a sprint retrospective board with three columns:
What went well, What didn't go well, and Action items. Team
members should be able to add cards and vote on them"
```

#### 18.4 Spark Features

**Live Preview**:
- Real-time preview as you describe changes
- Instant updates without deployment

**Revision History**:
- Track all changes to your spark
- Revert to previous versions
- Compare different iterations

**Data Management**:
```yaml
Built-in Data Features:
  - Persistent storage across sessions
  - Automatic data backup
  - Export data as JSON/CSV
  - Data stays with the spark owner
```

**Customization Options**:
```yaml
Appearance:
  - Theme colors
  - Layout options
  - Typography settings
  - Brand logos

Behavior:
  - Access controls (private/team/public)
  - Notification settings
  - Data retention rules
```

#### 18.5 Spark for Enterprise

**Enterprise Administration**:
```
Organization → Settings → Spark
```

**Configuration Options**:
```yaml
Enable Spark for organization: ✅
Allow public sparks: ○ Yes / ● No
Data retention: 90 days
Allowed domains: company.com
User limits:
  - Max sparks per user: 50
  - Max data storage per spark: 100MB
```

**Governance Features**:
- Audit logs for spark creation/sharing
- Data residency controls
- Access management through teams
- Compliance with enterprise policies

#### 18.6 Best Practices for Spark

```yaml
Development:
  - Start with clear, specific descriptions
  - Iterate in small steps
  - Test with real data scenarios
  - Get feedback from end users

Security:
  - Don't store sensitive data in sparks
  - Use appropriate access controls
  - Review generated code for security
  - Follow data classification policies

Maintenance:
  - Document spark purpose and usage
  - Assign owners for team sparks
  - Regular review of active sparks
  - Archive unused sparks
```

---

## Part H: GitHub Native Dashboards

### Overview

GitHub provides native dashboards for monitoring organization health, security posture, development velocity, and resource utilization.

### Step 19: Organization Dashboard

#### 19.1 Organization Overview Dashboard

```
Organization → Insights → Overview
```

**Dashboard Components**:

| Section | Metrics |
|---------|---------|
| **Activity** | Commits, PRs, Issues per week |
| **Members** | Active contributors, new members |
| **Repositories** | Total repos, public vs private |
| **Growth** | Trends over time |

#### 19.2 Security Dashboard

```
Organization → Security → Overview
```

**Security Overview Sections**:

```yaml
Risk View:
  - Repositories with open alerts
  - Alert age and severity
  - Unresolved vulnerabilities
  - Exposed secrets count

Coverage View:
  - Dependabot enabled: X/Y repos
  - Code scanning enabled: X/Y repos
  - Secret scanning enabled: X/Y repos
  - Push protection enabled: X/Y repos

Alert Trends:
  - New alerts this week
  - Closed alerts this week
  - Mean time to remediation
  - Alert by severity breakdown
```

**Filtering Options**:
```yaml
Filters:
  - Repository: All / Specific repos
  - Team: All / Specific teams
  - Severity: Critical, High, Medium, Low
  - Tool: Dependabot, CodeQL, Secret scanning
  - Time range: 7 days, 30 days, 90 days
```

#### 19.3 Actions Dashboard

```
Organization → Actions → Management
```

**Actions Metrics**:

```yaml
Workflow Runs:
  - Total runs this month
  - Success rate percentage
  - Average run duration
  - Failed runs breakdown

Runner Utilization:
  - Active runners count
  - Runner usage hours
  - Queue wait times
  - Runner type distribution

Cost Analysis:
  - GitHub-hosted minutes used
  - Storage usage (artifacts, caches)
  - Projected monthly cost
  - Cost by repository
```

#### 19.4 Copilot Dashboard

```
Organization → Settings → Copilot → Policies → Metrics
```

**Copilot Metrics**:

```yaml
Usage Statistics:
  - Active users: X / Y licensed
  - Acceptance rate: XX%
  - Lines of code accepted: XXX,XXX
  - Most used languages: JavaScript, Python, TypeScript

Adoption Metrics:
  - New users this month
  - Usage trend over time
  - Team adoption rates
  - Feature usage breakdown

Value Metrics:
  - Time saved estimate
  - Productivity improvement
  - Code quality indicators
```

### Step 20: Enterprise Dashboard

#### 20.1 Enterprise Overview

```
Enterprise → Overview
```

**Enterprise Metrics**:

```yaml
Organization Summary:
  - Total organizations
  - Total members across orgs
  - Active users (last 30 days)
  - Pending invitations

Resource Usage:
  - Total repositories
  - Storage consumption
  - Bandwidth usage
  - Actions minutes

License Utilization:
  - Seats consumed: X / Y
  - GHAS licenses: X / Y
  - Copilot licenses: X / Y
  - Available seats
```

#### 20.2 Enterprise Security Dashboard

```
Enterprise → Code Security
```

**Enterprise Security Overview**:

```yaml
Across All Organizations:
  Alert Summary:
    - Critical alerts: XX
    - High alerts: XX
    - Medium alerts: XX
    - Low alerts: XX

  Coverage Summary:
    - Repos with Dependabot: XX%
    - Repos with code scanning: XX%
    - Repos with secret scanning: XX%

  Trend Analysis:
    - Alerts opened vs closed
    - MTTR by severity
    - Top vulnerable dependencies
```

#### 20.3 Audit Log Dashboard

```
Enterprise → Settings → Audit log
```

**Audit Log Views**:

```yaml
Recent Activity:
  - Authentication events
  - Repository changes
  - Permission modifications
  - Policy updates

Filters:
  - Actor: user/app
  - Action: create, update, delete
  - Date range
  - Organization
  - Repository

Export Options:
  - JSON export
  - CSV export
  - API access
  - Stream to SIEM
```

### Step 21: Custom Dashboard with GitHub API

#### 21.1 Build Custom Dashboard

Create a custom dashboard using GitHub API and GraphQL:

**Dashboard Data Collection Script**:

```javascript
// dashboard-collector.js
const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function collectDashboardMetrics(org) {
  const metrics = {
    timestamp: new Date().toISOString(),
    organization: org,
    repositories: {},
    security: {},
    actions: {},
    members: {}
  };

  // Repository metrics
  const repos = await octokit.paginate(octokit.repos.listForOrg, {
    org,
    per_page: 100
  });

  metrics.repositories = {
    total: repos.length,
    public: repos.filter(r => !r.private).length,
    private: repos.filter(r => r.private).length,
    archived: repos.filter(r => r.archived).length,
    forked: repos.filter(r => r.fork).length
  };

  // Security alerts summary
  const alertsQuery = `
    query($org: String!) {
      organization(login: $org) {
        repositories(first: 100) {
          nodes {
            name
            vulnerabilityAlerts(first: 100) {
              totalCount
            }
          }
        }
      }
    }
  `;

  const alertsData = await graphql(alertsQuery, {
    org,
    headers: { authorization: `token ${process.env.GITHUB_TOKEN}` }
  });

  metrics.security = {
    reposWithAlerts: alertsData.organization.repositories.nodes
      .filter(r => r.vulnerabilityAlerts.totalCount > 0).length,
    totalAlerts: alertsData.organization.repositories.nodes
      .reduce((sum, r) => sum + r.vulnerabilityAlerts.totalCount, 0)
  };

  // Member metrics
  const members = await octokit.paginate(octokit.orgs.listMembers, {
    org,
    per_page: 100
  });

  metrics.members = {
    total: members.length
  };

  return metrics;
}

// Export for dashboard use
module.exports = { collectDashboardMetrics };
```

#### 21.2 Dashboard Visualization

**GitHub Actions Workflow for Dashboard Updates**:

```yaml
name: Update Dashboard Metrics

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install @octokit/rest @octokit/graphql

      - name: Collect metrics
        env:
          GITHUB_TOKEN: ${{ secrets.DASHBOARD_TOKEN }}
          ORG_NAME: ${{ github.repository_owner }}
        run: |
          node scripts/collect-metrics.js > metrics.json

      - name: Upload metrics artifact
        uses: actions/upload-artifact@v4
        with:
          name: dashboard-metrics
          path: metrics.json

      - name: Update dashboard page
        run: |
          # Generate static dashboard HTML
          node scripts/generate-dashboard.js

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dashboard
```

#### 21.3 Dashboard Best Practices

```yaml
Design Principles:
  - Show actionable metrics
  - Use consistent time ranges
  - Highlight anomalies and trends
  - Enable drill-down capability

Update Frequency:
  - Security alerts: Real-time or hourly
  - Usage metrics: Daily
  - Trend analysis: Weekly
  - Cost reports: Monthly

Access Control:
  - Limit dashboard access to appropriate roles
  - Use read-only tokens for data collection
  - Audit dashboard access
  - Encrypt sensitive metrics
```

---

## Deliverables

✅ **Features Configured**:
1. GitHub Copilot Enterprise with Knowledge Bases
2. SAML SSO and Team Synchronization
3. Enterprise Managed Users (if applicable)
4. Self-hosted runners and runner groups
5. Required workflows
6. IP allow lists
7. Organization rulesets
8. Webhooks and API integration
9. Mobile and CLI access
10. GitHub Spark for micro-apps
11. Native dashboards (Security, Actions, Copilot)
12. Custom dashboard with GitHub API

📋 **Documentation Created**:
- Copilot usage guidelines
- SSO setup documentation
- Runner management guide
- API integration examples
- Compliance reporting procedures
- Spark governance guidelines
- Dashboard configuration guide

---

## Verification Checklist

- [ ] Copilot Enterprise features accessible to licensed users
- [ ] Knowledge bases indexed and searchable
- [ ] SAML SSO working for all users
- [ ] Team sync active and updating
- [ ] Self-hosted runners operational
- [ ] Required workflows running on target repos
- [ ] IP allow list enforced (if applicable)
- [ ] Rulesets applied to repositories
- [ ] Webhooks receiving events
- [ ] Mobile access configured
- [ ] CLI authentication working
- [ ] GitHub Spark enabled and configured
- [ ] Organization dashboards accessible
- [ ] Security dashboard showing correct metrics
- [ ] Custom dashboard workflow running

---

## Best Practices Summary

### Identity Management
1. Always use SAML SSO for enterprise
2. Enable team sync for automated provisioning
3. Regularly audit user access
4. Implement least privilege principle
5. Use EMU for maximum control when required

### Copilot Enterprise
1. Create knowledge bases for internal documentation
2. Monitor usage metrics and acceptance rates
3. Set appropriate content exclusions
4. Train teams on effective usage
5. Review generated code for security

### Actions Enterprise
1. Use self-hosted runners for sensitive workloads
2. Implement required workflows for security
3. Restrict allowed actions to trusted sources
4. Monitor runner utilization
5. Set appropriate spending limits

### Compliance
1. Enable audit log streaming to SIEM
2. Configure IP allow lists for network control
3. Use rulesets for consistent policies
4. Generate regular compliance reports
5. Document all security configurations

---

**Related Tasks**:
- [Task 4: GitHub Enterprise Security Features](Task-04-GitHub-Enterprise-Features.md)
- [Task 6: GitHub Projects & Issues Enterprise](Task-06-GitHub-Projects-Enterprise.md)
- [Task 1: Branch Protection](Task-01-PM-Branch-Protection.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
