# Task 2: Enable Dependabot and Configure Secret Scanning

**Role**: Developer
**Estimated Time**: 3-4 hours
**Feature**: GitHub Security / Dependabot / Secret Scanning

---

## Objectives

- เปิดใช้งาน Dependabot Alerts และ Security Updates
- ตั้งค่า Version Updates อัตโนมัติ
- เปิดใช้งาน Secret Scanning และ Push Protection
- ตั้งค่า Alert Notifications

## Prerequisites

- GitHub Enterprise Cloud account with write permissions
- Repository with package.json (npm) or other dependency files
- Understanding of dependency management
- Completion of Phase 1 and Phase 2

---

## Part A: Dependabot Configuration

### Step 1: Enable Dependabot Features

#### 1.1 Navigate to Security Settings

```
Repository → Settings → Code security and analysis
```

#### 1.2 Enable Features

**Enable in order**:
```
1. ✅ Dependency graph - Enables dependency tracking
2. ✅ Dependabot alerts - Alerts for vulnerable dependencies
3. ✅ Dependabot security updates - Auto PRs for security fixes
4. ✅ Dependabot version updates - Auto PRs for version updates (optional)
```

**For each feature**:
- Click "Enable" button
- Wait for confirmation
- Verify status shows "Enabled"

---

### Step 2: Create Dependabot Configuration

#### 2.1 Create Configuration File

สร้างไฟล์ `.github/dependabot.yml`:

```yaml
# Dependabot Configuration
# https://docs.github.com/en/code-security/dependabot/dependabot-version-updates

version: 2

registries:
  # Private npm registry (if needed)
  npm-private:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.NPM_TOKEN }}

updates:
  # ========================================
  # NPM Dependencies
  # ========================================
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Bangkok"

    # PR settings
    open-pull-requests-limit: 10

    # Assignees and reviewers
    reviewers:
      - "backend-team"
    assignees:
      - "tech-lead"

    # Labels
    labels:
      - "dependencies"
      - "automated"
      - "security"

    # Commit message format
    commit-message:
      prefix: "chore(deps)"
      include: "scope"

    # Group updates to reduce PR noise
    groups:
      # Production dependencies
      production-deps:
        patterns:
          - "*"
        exclude-patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "jest*"
          - "@testing-library/*"
        update-types:
          - "minor"
          - "patch"

      # Development dependencies
      dev-deps:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "typescript"
        update-types:
          - "minor"
          - "patch"

      # Testing dependencies
      testing:
        patterns:
          - "jest*"
          - "@testing-library/*"
          - "cypress"
        update-types:
          - "minor"
          - "patch"

    # Ignore specific packages
    ignore:
      # Don't update to Express 5 yet (breaking changes)
      - dependency-name: "express"
        versions: ["5.x"]

      # Skip React major updates (requires migration)
      - dependency-name: "react"
        update-types: ["version-update:semver-major"]

      - dependency-name: "react-dom"
        update-types: ["version-update:semver-major"]

    # Allow only certain update types
    allow:
      - dependency-type: "direct"  # Only direct dependencies

    # Vendor dependencies
    vendor: false

  # ========================================
  # GitHub Actions
  # ========================================
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Bangkok"
    labels:
      - "dependencies"
      - "github-actions"
      - "ci-cd"
    commit-message:
      prefix: "ci(deps)"

  # ========================================
  # Docker
  # ========================================
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "docker"
    commit-message:
      prefix: "chore(docker)"

  # ========================================
  # Terraform (if applicable)
  # ========================================
  - package-ecosystem: "terraform"
    directory: "/terraform"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "terraform"
      - "infrastructure"
    reviewers:
      - "devops-team"
    commit-message:
      prefix: "chore(terraform)"

  # ========================================
  # Python (if applicable)
  # ========================================
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "python"
    commit-message:
      prefix: "chore(python)"
```

---

### Step 3: Create Automated PR Handling Workflow

#### 3.1 Auto-merge Workflow

สร้างไฟล์ `.github/workflows/dependabot-auto-merge.yml`:

```yaml
name: Dependabot Auto-Merge

on: pull_request

permissions:
  pull-requests: write
  contents: write

jobs:
  dependabot-auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Fetch Dependabot metadata
      id: metadata
      uses: dependabot/fetch-metadata@v2
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"

    - name: Log metadata
      run: |
        echo "Package: ${{ steps.metadata.outputs.dependency-names }}"
        echo "Update type: ${{ steps.metadata.outputs.update-type }}"
        echo "Dependency type: ${{ steps.metadata.outputs.dependency-type }}"
        echo "Package ecosystem: ${{ steps.metadata.outputs.package-ecosystem }}"

    # Auto-approve and merge patch updates
    - name: Auto-approve patch updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
      run: |
        gh pr review --approve "$PR_URL"
        echo "Approved patch update"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Auto-merge patch updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
      run: |
        gh pr merge --auto --squash "$PR_URL"
        echo "Enabled auto-merge for patch update"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # Auto-approve minor updates (but don't auto-merge)
    - name: Auto-approve minor updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-minor'
      run: |
        gh pr review --approve "$PR_URL"
        echo "Approved minor update - manual merge required"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # Label major updates for manual review
    - name: Label major updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-major'
      run: |
        gh pr edit "$PR_URL" --add-label "major-update,needs-review,breaking-change"
        gh pr comment "$PR_URL" --body "This is a **major version update** that may contain breaking changes. Please review carefully before merging."
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # Security updates get priority
    - name: Handle security updates
      if: steps.metadata.outputs.dependency-type == 'direct:production'
      run: |
        gh pr edit "$PR_URL" --add-label "security"
        gh pr comment "$PR_URL" --body "This is a **security update**. Please prioritize review and merge."
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### Step 4: Manual Vulnerability Fix Process

#### 4.1 View Current Vulnerabilities

```bash
# View npm audit report
npm audit

# View detailed report
npm audit --json > audit-report.json

# View summary
npm audit --audit-level=moderate
```

#### 4.2 Fix Vulnerabilities

```bash
# Automatic fix (safe changes only)
npm audit fix

# Force fix (may include breaking changes)
npm audit fix --force

# Dry run to see what will change
npm audit fix --dry-run

# Update specific package
npm update package-name

# Update to latest version
npm install package-name@latest
```

#### 4.3 Document Fixes

สร้างเอกสาร vulnerability fix:

```markdown
## Vulnerability Fix Record

**Date**: 2025-11-24
**Fixed by**: @developer-name

### Vulnerability Details
- **Package**: lodash
- **CVE**: CVE-2021-23337
- **Severity**: High
- **CVSS Score**: 7.2

### Fix Applied
- Updated lodash from 4.17.15 to 4.17.21

### Testing
- [x] Unit tests passed
- [x] Integration tests passed
- [x] Security scan passed
- [x] Manual testing completed

### Deployment
- Dev: 2025-11-24 10:00
- Staging: 2025-11-24 14:00
- Production: 2025-11-24 16:00
```

---

## Part B: Secret Scanning Configuration

### Step 5: Enable Secret Scanning

#### 5.1 Navigate to Security Settings

```
Repository → Settings → Code security and analysis
```

#### 5.2 Enable Features

```
✅ Secret scanning - Detect secrets in code
✅ Push protection - Block commits with secrets
```

---

### Step 6: Configure Push Protection

#### 6.1 Understanding Push Protection

When enabled, GitHub will:
1. Scan commits before they're pushed
2. Block commits containing secrets
3. Notify the developer of the issue

**Supported Secret Types**:
- AWS Keys (Access Key ID, Secret Access Key)
- Azure Credentials
- Google Cloud Credentials
- GitHub Tokens
- Stripe Keys
- Database Connection Strings
- Private Keys
- JWT Secrets
- And 100+ more patterns

#### 6.2 Developer Experience

When a secret is detected:

```
$ git push origin feature/my-feature

remote: error: GH013: Repository has push protection enabled

remote: ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
remote:
remote:  — Push blocked
remote:
remote:  Secrets detected in commit abc123def456:
remote:
remote:  Location: config/database.js:12
remote:  Secret type: AWS Access Key ID
remote:
remote:  To push the commit, remove the secret from your commit history.
remote:
remote:  If this is a false positive, you can bypass this check using:
remote:  - Web: https://github.com/org/repo/security/secret-scanning/...
remote:  - CLI: git push --push-option=skip-secret-scanning
remote:
remote: ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 7: Configure Alert Notifications

#### 7.1 Create Alert Workflow

สร้างไฟล์ `.github/workflows/secret-scanning-alert.yml`:

```yaml
name: Secret Scanning Alert Handler

on:
  secret_scanning_alert:
    types: [created, reopened]

jobs:
  handle-secret-alert:
    runs-on: ubuntu-latest
    steps:
    - name: Get Alert Details
      id: alert
      uses: actions/github-script@v7
      with:
        script: |
          const alert = context.payload.alert;
          console.log('Secret Type:', alert.secret_type);
          console.log('Secret Location:', alert.html_url);
          return {
            type: alert.secret_type,
            url: alert.html_url,
            state: alert.state
          };

    - name: Notify Security Team (Slack)
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": ":rotating_light: Secret Scanning Alert",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": ":rotating_light: Secret Detected in Repository"
                }
              },
              {
                "type": "section",
                "fields": [
                  {
                    "type": "mrkdwn",
                    "text": "*Repository:*\n${{ github.repository }}"
                  },
                  {
                    "type": "mrkdwn",
                    "text": "*Secret Type:*\n${{ github.event.alert.secret_type }}"
                  }
                ]
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<${{ github.event.alert.html_url }}|View Alert Details>"
                }
              },
              {
                "type": "context",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": "*Action Required:* Revoke the exposed secret immediately!"
                  }
                ]
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}

    - name: Create Security Incident Issue
      uses: actions/github-script@v7
      with:
        script: |
          const alert = context.payload.alert;

          await github.rest.issues.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title: `[SECURITY] Secret Exposed: ${alert.secret_type}`,
            body: `## Secret Scanning Alert

          **Severity:** Critical
          **Secret Type:** ${alert.secret_type}
          **Alert URL:** ${alert.html_url}

          ### Immediate Actions Required

          1. **Revoke the secret** - Go to the service provider and invalidate/rotate the credential
          2. **Generate new secret** - Create a new credential
          3. **Update applications** - Update any services using this secret
          4. **Investigate** - Check for unauthorized access using the exposed secret

          ### Timeline
          - [ ] Secret revoked
          - [ ] New secret generated
          - [ ] Applications updated
          - [ ] Investigation completed
          - [ ] Post-mortem documented

          /cc @security-team @${context.payload.sender.login}`,
            labels: ['security', 'critical', 'secret-exposure', 'incident']
          });
```

---

### Step 8: Secret Remediation Process

#### 8.1 When Secret is Detected

**Step 1: Immediate Revocation** (Within 15 minutes)
```bash
# 1. Identify the service provider
# 2. Go to their console
# 3. Revoke/Delete the exposed credential

# For AWS:
aws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --user-name USERNAME

# For GitHub:
# Go to Settings → Developer settings → Personal access tokens → Delete
```

**Step 2: Generate New Secret**
```bash
# Generate new credentials at the service provider
# Example for AWS:
aws iam create-access-key --user-name USERNAME
```

**Step 3: Update Applications**
```bash
# Update GitHub Secrets
# Repository → Settings → Secrets and variables → Actions

# Or via CLI:
gh secret set AWS_ACCESS_KEY_ID --body "NEW_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY --body "NEW_SECRET_KEY"
```

**Step 4: Remove from Git History** (If needed)

```bash
# Using BFG Repo-Cleaner (recommended)
# Download: https://rtyley.github.io/bfg-repo-cleaner/

# Create file with secrets to remove
echo "AKIAIOSFODNN7EXAMPLE" >> secrets.txt
echo "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" >> secrets.txt

# Clone bare repo
git clone --mirror git://github.com/org/repo.git

# Run BFG
java -jar bfg.jar --replace-text secrets.txt repo.git

# Clean up and push
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push
```

#### 8.2 Document the Incident

```markdown
## Security Incident Report

**Incident ID**: SEC-2025-001
**Date Discovered**: 2025-11-24 10:30 UTC
**Date Resolved**: 2025-11-24 11:15 UTC
**Severity**: High

### Summary
AWS Access Key was accidentally committed to the repository.

### Timeline
- 10:30 - Secret detected by GitHub Secret Scanning
- 10:32 - Security team notified via Slack
- 10:35 - AWS key revoked
- 10:40 - New key generated
- 10:45 - Applications updated with new key
- 11:00 - Git history cleaned
- 11:15 - Incident resolved

### Root Cause
Developer copied environment file instead of using .env.example

### Impact
- No unauthorized access detected
- Key was exposed for approximately 45 minutes

### Remediation Actions
1. [x] Revoked exposed credential
2. [x] Generated new credential
3. [x] Updated applications
4. [x] Cleaned git history
5. [x] Added pre-commit hook

### Prevention Measures
1. Added git-secrets pre-commit hook
2. Updated developer training
3. Enhanced .gitignore template
4. Added CI/CD secret scanning check
```

---

### Step 9: Prevention Measures

#### 9.1 Install git-secrets

```bash
# Install git-secrets
brew install git-secrets  # macOS

# Or clone and install manually
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets && make install

# Setup for repository
cd your-repo
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'COMPANY_API_KEY_[A-Z0-9]{32}'
git secrets --add 'password\s*=\s*["\047][^"\047]+'
```

#### 9.2 Pre-commit Hook

สร้างไฟล์ `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Running pre-commit security checks..."

# Check for secrets using git-secrets
if command -v git-secrets &> /dev/null; then
    git secrets --pre_commit_hook -- "$@"
    if [ $? -ne 0 ]; then
        echo -e "${RED}git-secrets found potential secrets!${NC}"
        exit 1
    fi
fi

# Custom pattern checks
PATTERNS=(
    "AKIA[0-9A-Z]{16}"           # AWS Access Key
    "password\s*=\s*['\"]"       # Password in config
    "api[_-]?key\s*=\s*['\"]"    # API Key
    "secret[_-]?key\s*=\s*['\"]" # Secret Key
    "-----BEGIN.*PRIVATE KEY"    # Private Key
    "sk_live_[a-zA-Z0-9]{24}"    # Stripe Key
    "ghp_[a-zA-Z0-9]{36}"        # GitHub Token
    "xox[baprs]-[0-9]{12}-"      # Slack Token
)

for pattern in "${PATTERNS[@]}"; do
    if git diff --cached --diff-filter=ACMR | grep -qE "$pattern"; then
        echo -e "${RED}Potential secret detected matching pattern: $pattern${NC}"
        echo "Please remove the secret and use environment variables instead."
        exit 1
    fi
done

echo -e "${GREEN}No secrets detected${NC}"
exit 0
```

#### 9.3 Update .gitignore

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging
.env.test

# Secrets and credentials
secrets/
credentials/
*.pem
*.key
*.p12
*.pfx
id_rsa*
id_dsa*
id_ed25519*

# Cloud provider configs
.aws/
.gcloud/
.azure/

# IDE settings that might contain tokens
.vscode/settings.json
.idea/workspace.xml
*.code-workspace

# Database files
*.sqlite
*.db

# Log files that might contain sensitive data
logs/
*.log
```

---

## Deliverables

✅ **Completed Deliverables**:
1. Dependabot enabled and configured
2. dependabot.yml created with all package ecosystems
3. Auto-merge workflow for minor/patch updates
4. Secret scanning enabled
5. Push protection activated
6. Alert notification workflow
7. Prevention measures implemented

📋 **Files Created**:
- `.github/dependabot.yml`
- `.github/workflows/dependabot-auto-merge.yml`
- `.github/workflows/secret-scanning-alert.yml`
- `.git/hooks/pre-commit`
- Updated `.gitignore`

---

## Testing Checklist

- [ ] Dependabot alerts visible in Security tab
- [ ] Dependabot creates PRs for outdated packages
- [ ] Auto-merge works for patch updates
- [ ] Secret scanning detects test secrets
- [ ] Push protection blocks secret commits
- [ ] Notifications sent to Slack
- [ ] Pre-commit hook catches secrets locally

---

**Related Tasks**:
- [Task 1: Branch Protection](Task-01-PM-Branch-Protection.md)
- [Task 3: Security Tests](Task-03-QA-Security-Tests.md)

---

**Prepared by**: Developer Team
**Last Updated**: November 2025
**Version**: 1.0
