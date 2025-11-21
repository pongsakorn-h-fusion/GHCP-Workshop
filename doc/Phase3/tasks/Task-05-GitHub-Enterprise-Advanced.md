# Task 5: GitHub Enterprise Advanced Features

**Role**: All Roles (PM, Developer, QA)
**Estimated Time**: 4-5 hours
**Feature**: GitHub Enterprise Cloud Advanced Features

---

## Objectives

- เข้าใจและใช้งาน GitHub Enterprise Advanced Features
- ตั้งค่า GitHub Copilot Enterprise
- ใช้งาน GitHub Actions for Enterprise
- เปิดใช้งาน SAML SSO และ Team Sync
- จัดการ Enterprise Managed Users (EMU)
- ใช้งาน GitHub Insights และ API

## Prerequisites

- GitHub Enterprise Cloud license
- Organization owner/admin access
- Enterprise admin access (for some features)
- IdP access for SAML/SSO configuration

---

## Part A: GitHub Copilot Enterprise

### Overview

GitHub Copilot Enterprise ให้ความสามารถเพิ่มเติมจาก Copilot Individual:

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
- `copilot.cfb_suggestions_shown`
- `copilot.cfb_suggestion_accepted`
- `copilot.chat_conversation`
- `copilot.pr_summary_generated`

---

## Part B: Enterprise Identity Management

### Step 5: Configure SAML Single Sign-On (SSO)

#### 5.1 SAML SSO Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│    IdP      │────▶│   GitHub    │
│             │     │ (Okta/Azure │     │ Enterprise  │
│             │◀────│  /OneLogin) │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
```

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
- [ ] Test with a few users first
- [ ] Document recovery procedures
- [ ] Ensure admins have recovery codes
- [ ] Communicate rollout timeline to users

### Security Settings
- [ ] Enable "Require SAML SSO"
- [ ] Set session timeout (recommended: 8 hours)
- [ ] Enable "Require 2FA through IdP"
- [ ] Configure IP allow lists (if needed)

### After Enabling
- [ ] Monitor login failures
- [ ] Document troubleshooting steps
- [ ] Set up alerting for SSO issues
```

---

### Step 6: Team Synchronization

#### 6.1 Enable Team Sync

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
Azure AD Group → GitHub Team
─────────────────────────────────
Engineering    → engineering-team
QA             → qa-team
DevOps         → devops-team
Management     → org-admins
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

---

### Step 7: Enterprise Managed Users (EMU)

#### 7.1 EMU Overview

Enterprise Managed Users ให้การควบคุมเต็มรูปแบบ:

| Feature | Regular Org | EMU |
|---------|-------------|-----|
| User provisioning | Manual | Automated via IdP |
| User lifecycle | User-controlled | Company-controlled |
| Username format | Any | `shortcode_username` |
| Personal repos | Allowed | Blocked |
| Public contributions | Allowed | Blocked |
| External collaborators | Allowed | Limited |

#### 7.2 EMU Configuration

```
Enterprise → Settings → Authentication security → Enterprise Managed Users
```

**SCIM Provisioning**:
```yaml
Provisioning endpoint: https://api.github.com/scim/v2/enterprises/YOUR_ENTERPRISE

Required SCIM attributes:
- userName
- name.givenName
- name.familyName
- emails
- externalId

Optional attributes:
- displayName
- active
```

#### 7.3 EMU User Lifecycle

```
┌─────────────┐
│ IdP creates │
│ user account│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ SCIM syncs  │
│ to GitHub   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ User gets   │
│ GitHub EMU  │
│ account     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Team sync   │
│ assigns     │
│ permissions │
└─────────────┘
```

---

## Part C: GitHub Actions for Enterprise

### Step 8: Actions Enterprise Features

#### 8.1 Self-Hosted Runners

**Benefits**:
- Run on your infrastructure
- Access internal resources
- Custom hardware/software
- Cost control

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
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz

# Configure runner
./config.sh --url https://github.com/YOUR_ORG --token YOUR_TOKEN

# Run as service
sudo ./svc.sh install
sudo ./svc.sh start
```

#### 8.3 Runner Labels and Targeting

```yaml
# Workflow targeting specific runners
jobs:
  deploy:
    runs-on: [self-hosted, production, linux, x64]
    steps:
      - name: Deploy to production
        run: ./deploy.sh
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
```

#### 9.2 Required Workflows (Enterprise)

```
Enterprise → Settings → Actions → Required workflows
```

**Configure Required Workflow**:
```yaml
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
```

**Apply to Repositories**:
```
Required workflow: security-scan.yml
Apply to:
○ All repositories
● Selected repositories:
  - org/main-app
  - org/api-service
```

---

### Step 10: Larger Runners (Enterprise)

#### 10.1 Configure Larger Runners

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

```yaml
# Using GPU runner for ML workflows
jobs:
  train-model:
    runs-on: [self-hosted, gpu, linux]
    steps:
    - name: Train ML model
      run: python train.py
      env:
        CUDA_VISIBLE_DEVICES: 0
```

---

## Part D: GitHub Insights & API

### Step 11: GitHub Insights

#### 11.1 Organization Insights

```
Organization → Insights
```

**Available Dashboards**:
- **Pulse**: Activity overview
- **Contributors**: Contribution statistics
- **Community**: Community health metrics
- **Traffic**: Repository traffic data
- **Commits**: Commit activity
- **Code frequency**: Code changes over time
- **Dependency graph**: Dependency insights

#### 11.2 Enterprise Insights

```
Enterprise → Insights
```

**Enterprise Metrics**:
```
Overview:
- Total repositories
- Total members
- Active contributors
- Pull request statistics

Security:
- Dependabot alerts
- Code scanning alerts
- Secret scanning alerts

Actions:
- Workflow runs
- Runner utilization
- Billing usage
```

---

### Step 12: GitHub API for Enterprise

#### 12.1 REST API Examples

**List Organization Members**:
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
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
  "https://api.github.com/enterprises/YOUR_ENTERPRISE/audit-log"
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

**Query Copilot Usage**:
```graphql
query {
  enterprise(slug: "YOUR_ENTERPRISE") {
    billingInfo {
      copilotBusinessUsers: {
        totalSeats
        activeSeats
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

**Sample Webhook Handler**:
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
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
  // Send to Slack, create ticket, etc.
}
```

---

## Part E: Enterprise Compliance Features

### Step 13: IP Allow Lists

#### 13.1 Configure IP Allow Lists

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
Description: GitHub Actions runners
```

#### 13.2 Enable Enforcement

```
IP allow list settings:
✅ Enable IP allow list
✅ Enable IP allow list for installed GitHub Apps

Note: Ensure all legitimate access points are added before enabling
```

---

### Step 14: Repository Rules (Rulesets)

#### 14.1 Create Organization Ruleset

```
Organization → Settings → Rules → Rulesets → New ruleset
```

**Ruleset Configuration**:
```yaml
Name: production-protection
Enforcement status: Active
Bypass list:
  - Organization admins

Target repositories:
- Include: All repositories
- Exclude: *-sandbox

Target branches:
- Include: main, release/*

Rules:
✅ Restrict deletions
✅ Require linear history
✅ Require deployments to succeed
   - production
✅ Require signed commits
✅ Require a pull request before merging
   - Required approvals: 2
   - Dismiss stale reviews
   - Require review from code owners
✅ Require status checks to pass
   - ci
   - security-scan
   - tests
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
- Repository data
- Issues and pull requests
- Wiki content
- Actions workflows

#### 15.2 Compliance Reports

```bash
# Generate compliance report via API
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/orgs/YOUR_ORG/settings/billing/actions" \
  -o actions-billing.json

curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/orgs/YOUR_ORG/audit-log?phrase=action:repo" \
  -o audit-log.json
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

---

### Step 17: GitHub CLI Enterprise Features

#### 17.1 CLI Authentication for Enterprise

```bash
# Login with Enterprise account
gh auth login --hostname github.your-company.com

# Or for SAML SSO
gh auth login
# Follow SSO flow when prompted
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
gh api repos/YOUR_ORG/REPO/dependabot/alerts --jq '.[] | {severity, package: .dependency.package.name}'
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

📋 **Documentation Created**:
- Copilot usage guidelines
- SSO setup documentation
- Runner management guide
- API integration examples
- Compliance reporting procedures

---

## Verification Checklist

- [ ] Copilot Enterprise features accessible
- [ ] Knowledge bases indexed
- [ ] SAML SSO working for all users
- [ ] Team sync active
- [ ] Self-hosted runners operational
- [ ] Required workflows running
- [ ] IP allow list enforced
- [ ] Rulesets applied
- [ ] Webhooks receiving events
- [ ] Mobile access configured

---

## Best Practices Summary

### Identity Management
1. Always use SAML SSO for enterprise
2. Enable team sync for automated provisioning
3. Regularly audit user access
4. Implement least privilege principle
5. Use EMU for maximum control

### Copilot Enterprise
1. Create knowledge bases for internal docs
2. Monitor usage and acceptance rates
3. Set appropriate content exclusions
4. Train teams on effective usage
5. Review generated code for security

### Actions Enterprise
1. Use self-hosted runners for sensitive workloads
2. Implement required workflows
3. Restrict allowed actions
4. Monitor runner utilization
5. Set appropriate spending limits

### Compliance
1. Enable audit log streaming
2. Configure IP allow lists
3. Use rulesets for consistent policies
4. Regular compliance reporting
5. Document all configurations

---

**Related Tasks**:
- [Task 4: GitHub Enterprise Security Features](Task-04-GitHub-Enterprise-Features.md)
- [Task 1: Branch Protection](Task-01-PM-Branch-Protection.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
