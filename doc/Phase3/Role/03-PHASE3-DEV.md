# Phase 3: Security Workshop - Developer Role

**Role**: Developer
**Phase Duration**: November 24-28, 2025 (5 days)
**Prerequisites**: Completion of Phase 1 and Phase 2

---

## Overview

ในฐานะ Developer คุณจะรับผิดชอบในการเปิดใช้งานและตั้งค่า Dependabot, Secret Scanning, การแก้ไขช่องโหว่ที่พบ และการปรับปรุง Pair Programming Flow ร่วมกับ GitHub Copilot รวมถึงการใช้งาน GitHub Enterprise Features อย่าง Codespaces

---

## Tasks Overview

| Task | Description | Duration | Priority |
|------|-------------|----------|----------|
| Task 1 | Enable Dependabot and Fix Vulnerabilities | 3-4 hours | High |
| Task 2 | Configure Secret Scanning and Alerting | 2-3 hours | High |
| Task 3 | Improve Pair Programming Flow with Copilot | 2-3 hours | Medium |
| Task 4 | Setup GitHub Codespaces for Secure Development | 2-3 hours | Medium |

---

## Task 1: Enable Dependabot and Fix Vulnerabilities

### Objectives
- เปิดใช้งาน Dependabot Alerts
- Review และ Merge Security Updates
- ทดสอบหลังจากอัปเดต Dependencies

### Preparation Checklist
- [ ] ศึกษา Dependabot Features
- [ ] กำหนด Update Strategy
- [ ] เตรียม Test Suite
- [ ] วางแผน Rollback Procedure

### Step-by-Step Guide

#### 1.1 Enable Dependabot Alerts

**Navigation**:
```
Repository → Settings → Code security and analysis
```

**Enable Features**:
```
✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
```

#### 1.2 Configure Dependabot Version Updates

สร้างไฟล์ `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # NPM dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Bangkok"
    open-pull-requests-limit: 10
    reviewers:
      - "backend-team"
    assignees:
      - "tech-lead"
    labels:
      - "dependencies"
      - "automated"
    commit-message:
      prefix: "chore"
      include: "scope"
    groups:
      # Group minor and patch updates together
      production-dependencies:
        patterns:
          - "*"
        exclude-patterns:
          - "dev-*"
          - "@types/*"
        update-types:
          - "minor"
          - "patch"
      development-dependencies:
        patterns:
          - "dev-*"
          - "@types/*"
        update-types:
          - "minor"
          - "patch"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "github-actions"

  # Docker
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "docker"

  # Python (if applicable)
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "python"
```

#### 1.3 Advanced Dependabot Configuration

**Ignore Specific Dependencies**:
```yaml
ignore:
  - dependency-name: "express"
    versions: ["5.x"]  # Don't update to v5 yet
  - dependency-name: "lodash"
    update-types: ["version-update:semver-major"]
```

**Allow Specific Updates Only**:
```yaml
allow:
  - dependency-type: "direct"  # Only direct dependencies
  - dependency-type: "production"  # Only production deps
```

#### 1.4 Automated Dependabot PR Workflow

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
    - name: Dependabot metadata
      id: metadata
      uses: dependabot/fetch-metadata@v2
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"

    - name: Auto-approve patch updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
      run: gh pr review --approve "$PR_URL"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Auto-merge patch updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
      run: gh pr merge --auto --squash "$PR_URL"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Auto-approve minor updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-minor'
      run: gh pr review --approve "$PR_URL"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Label major updates for review
      if: steps.metadata.outputs.update-type == 'version-update:semver-major'
      run: gh pr edit "$PR_URL" --add-label "major-update,needs-review"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Comment on security updates
      if: steps.metadata.outputs.dependency-type == 'direct:production'
      run: |
        gh pr comment "$PR_URL" --body "This PR updates a production dependency. Please review carefully before merging."
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 1.5 Manual Vulnerability Fix Process

```bash
# 1. Check for outdated packages
npm outdated

# 2. View security audit
npm audit

# 3. View detailed audit report
npm audit --json > audit-report.json

# 4. Fix vulnerabilities automatically (safe fixes)
npm audit fix

# 5. Force fix (may include breaking changes)
npm audit fix --force

# 6. Update specific package
npm update package-name

# 7. Update to latest major version
npm install package-name@latest

# 8. Check for breaking changes
npm diff package-name
```

#### 1.6 Testing After Updates

```bash
# Run full test suite
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Build application
npm run build

# Start in development mode
npm run dev
```

#### 1.7 Vulnerability Fix Documentation Template

```markdown
## Vulnerability Fix: CVE-XXXX-XXXXX

### Package
package-name@1.2.3 → 1.2.5

### Vulnerability Details
- **Severity**: High
- **Type**: Cross-Site Scripting (XSS)
- **CVSS Score**: 7.5
- **Description**: Allows arbitrary code execution through unsanitized input

### Changes Made
1. Updated package-name from 1.2.3 to 1.2.5
2. Updated related peer dependencies
3. Modified code to use new API (if applicable)

### Testing
- [x] Unit tests passed
- [x] Integration tests passed
- [x] Security scan passed
- [x] Manual testing completed

### Deployment
- Dev: ✅ Deployed [Date] [Time]
- Staging: ✅ Deployed [Date] [Time]
- Production: ✅ Deployed [Date] [Time]

### Verification
- [x] No new vulnerabilities introduced
- [x] Application functioning normally
- [x] Performance not degraded
```

### Deliverables
- [ ] Dependabot enabled and configured
- [ ] Security updates auto-merged (where safe)
- [ ] Vulnerability fixes documented
- [ ] Testing procedures established

---

## Task 2: Configure Secret Scanning and Alerting

### Objectives
- เปิดใช้งาน Secret Scanning
- ตั้งค่า Notification Channels
- ทดสอบระบบแจ้งเตือน

### Preparation Checklist
- [ ] ศึกษา GitHub Secret Scanning Features
- [ ] กำหนด Alert Recipients
- [ ] วางแผน Response Procedures
- [ ] เตรียม Remediation Workflow

### Step-by-Step Guide

#### 2.1 Enable Secret Scanning

**Navigation**:
```
Repository → Settings → Code security and analysis
```

**Enable Features**:
```
✅ Secret scanning
✅ Push protection (prevent commits with secrets)
```

#### 2.2 Supported Secret Types

GitHub Secret Scanning รองรับ secrets หลายประเภท:
- AWS credentials (Access Key ID, Secret Access Key)
- Azure credentials (Client ID, Client Secret)
- Google Cloud credentials
- Database connection strings
- API keys (Stripe, SendGrid, Twilio, etc.)
- Private keys (RSA, SSH)
- OAuth tokens
- JWT secrets
- และอื่นๆ อีกมากมาย

#### 2.3 Push Protection Configuration

**How it works**:
```
Developer pushes code → GitHub scans → Secret detected → Push blocked

Error message:
❌ Push blocked: Secret detected in commit

   File: config/database.js
   Line: 12
   Type: AWS Access Key

   Options:
   1. Remove the secret from your commit
   2. Use GitHub Secrets instead
   3. If this is a false positive, you can bypass
```

#### 2.4 Secret Scanning Alert Workflow

สร้างไฟล์ `.github/workflows/secret-alert.yml`:

```yaml
name: Secret Scanning Alert Handler

on:
  secret_scanning_alert:
    types: [created, reopened]

jobs:
  handle-alert:
    runs-on: ubuntu-latest
    steps:
    - name: Get alert details
      id: alert
      uses: actions/github-script@v7
      with:
        script: |
          const alert = context.payload.alert;
          console.log(`Secret Type: ${alert.secret_type}`);
          console.log(`Location: ${alert.html_url}`);
          return alert;

    - name: Notify Security Team via Slack
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": ":rotating_light: Secret Detected!",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": "Secret Scanning Alert"
                }
              },
              {
                "type": "section",
                "fields": [
                  {
                    "type": "mrkdwn",
                    "text": "*Secret Type:*\n${{ github.event.alert.secret_type }}"
                  },
                  {
                    "type": "mrkdwn",
                    "text": "*Repository:*\n${{ github.repository }}"
                  }
                ]
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<${{ github.event.alert.html_url }}|View Alert>"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_SECURITY_WEBHOOK }}

    - name: Create Incident Issue
      uses: actions/github-script@v7
      with:
        script: |
          await github.rest.issues.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title: `[SECURITY] Secret Exposed: ${context.payload.alert.secret_type}`,
            body: `## Secret Scanning Alert\n\n**Type:** ${context.payload.alert.secret_type}\n**Location:** ${context.payload.alert.html_url}\n\n### Action Required\n1. Revoke the exposed secret immediately\n2. Generate new secret\n3. Update applications using the secret\n4. Investigate potential misuse\n\n/cc @security-team`,
            labels: ['security', 'critical', 'secret-exposure']
          });
```

#### 2.5 Secret Remediation Process

**When a secret is detected**:

1. **Immediate Actions** (Within 1 hour)
   ```bash
   # 1. Revoke the exposed secret immediately
   # Go to AWS Console / Azure Portal / Service Provider
   # Deactivate or delete the compromised credential

   # 2. Generate new secret
   # Create new credentials in the respective service

   # 3. Update GitHub Secrets
   # Repository → Settings → Secrets and variables → Actions
   # Update the secret value
   ```

2. **Remove from Git History** (If needed)
   ```bash
   # Option 1: BFG Repo-Cleaner (recommended)
   # Download from https://rtyley.github.io/bfg-repo-cleaner/

   # Create a file with secrets to remove
   echo "AKIAIOSFODNN7EXAMPLE" >> secrets.txt
   echo "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" >> secrets.txt

   # Run BFG
   java -jar bfg.jar --replace-text secrets.txt repo.git

   # Clean up
   cd repo.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive

   # Option 2: git filter-repo (if BFG not available)
   pip install git-filter-repo
   git filter-repo --path path/to/secret-file --invert-paths

   # Force push (after team notification!)
   git push origin --force --all
   ```

3. **Verify Removal**
   ```bash
   # Search entire history for the secret
   git log -S "SECRET_STRING" --all

   # Verify it's truly removed
   git grep "SECRET_STRING" $(git rev-list --all)
   ```

4. **Document Incident**
   - Create incident report
   - Notify affected parties
   - Update procedures if needed

#### 2.6 Custom Secret Patterns

สร้างไฟล์ `.github/secret_scanning.yml` สำหรับ Organization-specific secrets:

```yaml
custom_patterns:
  - name: "Internal API Key"
    pattern: "internal_key_[a-zA-Z0-9]{32}"
    description: "Internal API keys used for service-to-service communication"

  - name: "Database Password Pattern"
    pattern: "DB_PASS=[a-zA-Z0-9@$!%*?&]{16,}"
    description: "Database passwords in configuration files"

  - name: "Company Token"
    pattern: "COMPANY_TOKEN_[0-9]{10}_[a-z]{20}"
    description: "Company-specific API tokens"

  - name: "JWT Secret"
    pattern: "JWT_SECRET=[a-zA-Z0-9]{64}"
    description: "JWT signing secrets"
```

#### 2.7 Prevention Measures

**Pre-commit Hook** (`.git/hooks/pre-commit`):

```bash
#!/bin/bash

# Patterns to check
patterns=(
    "AKIA[0-9A-Z]{16}"  # AWS Access Key
    "password\s*=\s*['\"]"
    "api[_-]?key\s*=\s*['\"]"
    "secret[_-]?key\s*=\s*['\"]"
    "-----BEGIN.*PRIVATE KEY-----"
)

echo "Checking for secrets..."

for pattern in "${patterns[@]}"; do
    if git diff --cached | grep -iE "$pattern"; then
        echo "❌ Potential secret detected in commit!"
        echo "Pattern matched: $pattern"
        echo "Please remove the secret and use environment variables instead."
        exit 1
    fi
done

echo "✅ No secrets detected"
exit 0
```

**Install git-secrets tool**:
```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets && make install

# Setup for repository
cd your-repo
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'COMPANY_API_KEY_[A-Z0-9]+'
```

**.gitignore Best Practices**:
```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging

# Configuration files with secrets
config/secrets.js
config/credentials.json
config/database.yml

# Keys and certificates
*.pem
*.key
*.p12
*.pfx
id_rsa
id_dsa

# Cloud provider configs
.aws/
.gcloud/
.azure/

# IDE settings that might contain tokens
.vscode/settings.json
.idea/
```

### Deliverables
- [ ] Secret scanning enabled
- [ ] Push protection activated
- [ ] Alert notifications configured
- [ ] Remediation procedures documented
- [ ] Prevention measures implemented

---

## Task 3: Improve Pair Programming Flow with Copilot

### Objectives
- ทดลองใช้ Copilot ใน Pair Programming
- ทดสอบการทำงานร่วมกับ AI Agents
- แบ่งปัน Best Practices

### AI-Enhanced Pair Programming Model

```
Traditional:
Driver (writes code) ↔ Navigator (reviews and guides)

AI-Enhanced:
Driver ↔ Copilot (suggests code) ↔ Navigator
         ↑                           ↑
         └─── Both review suggestions ───┘
```

### Copilot Advanced Features

#### 3.1 Copilot Chat

```
# In IDE Chat Panel:

User: "Create a function to validate Thai national ID"
Copilot: [Generates function with checksum validation]

User: "Add unit tests for edge cases"
Copilot: [Generates comprehensive test cases]

User: "What are the security implications of storing this ID?"
Copilot: [Explains data privacy concerns and recommendations]
```

#### 3.2 Inline Chat (Ctrl+I / Cmd+I)

```javascript
// Select this code block, then Ctrl+I
function processPayment(amount, card) {
  // TODO: implement payment processing
}

// Type: "Implement secure payment processing with Stripe"
// Copilot generates implementation
```

#### 3.3 Copilot Commands

```
/explain - Explain selected code in detail
/fix - Fix bugs in selected code
/tests - Generate unit tests for code
/doc - Generate documentation
/optimize - Suggest performance optimizations
/simplify - Simplify complex code
```

**Example Usage**:
```javascript
// Select complex function
// Type: /explain

// Copilot response:
/*
 * This function implements a binary search algorithm
 * for finding a target value in a sorted array.
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 *
 * Parameters:
 * - arr: Sorted array of numbers
 * - target: Value to find
 *
 * Returns: Index of target or -1 if not found
 */
```

### Pair Programming Workflows

#### Workflow 1: Security Code Review

```
Navigator: "Let's review this authentication function for vulnerabilities"
Driver: Selects code block
Driver: Types /explain to understand current implementation

Copilot: Explains the code flow

Navigator: "Ask Copilot about security issues"
Driver: "What security vulnerabilities exist in this code?"

Copilot: Points out:
- Password stored in plain text
- No rate limiting
- SQL injection risk
- Missing input validation

Driver: Uses /fix to get secure implementation
Navigator: Reviews suggested fixes
Both: Discuss and refine the solution
```

#### Workflow 2: Test-Driven Development with Security

```
Navigator: "Let's write security tests first"
Driver: Types test structure

// security.test.js
describe('Authentication Security', () => {
  // Copilot suggests test cases
});

// Type: /tests - suggest security test cases

Copilot suggests:
- SQL injection tests
- XSS prevention tests
- Rate limiting tests
- Password strength tests
- Session management tests

Driver: Implements each test
Navigator: Reviews coverage
Driver: Implements actual security functions
```

#### Workflow 3: Vulnerability Fix Session

```
1. Identify vulnerability (from Dependabot/Security scan)
2. Navigator explains the vulnerability
3. Driver uses Copilot to understand impact
4. Both discuss fix approach
5. Driver codes fix with Copilot assistance
6. Navigator reviews changes
7. Both verify tests pass
8. Document the fix
```

### Copilot Pair Programming Best Practices

**Do's**:
- Review Copilot suggestions carefully before accepting
- Use Copilot to generate boilerplate code
- Ask Copilot to explain unfamiliar code patterns
- Use Copilot for test generation
- Leverage Copilot for security code review
- Provide clear context through comments

**Don'ts**:
- Blindly accept all suggestions
- Rely on Copilot for security-critical code without review
- Ignore edge cases in generated code
- Skip testing generated code
- Share sensitive data in prompts
- Assume generated code is always secure

### Example Secure Coding Session

```javascript
// 1. Navigator: "Let's create a secure password hashing function"

// 2. Driver types clear intent:
// Function to securely hash user passwords using bcrypt
// Requirements:
// - Use bcrypt with salt rounds
// - Handle errors properly
// - Follow OWASP guidelines

// 3. Copilot generates:
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
  const saltRounds = 12;

  // Validate input
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Invalid password input');
  }

  if (plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  try {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (error) {
    console.error('Password hashing failed:', error.message);
    throw new Error('Password hashing failed');
  }
}

// 4. Navigator: "Add password verification function"
// 5. Driver types: // Function to verify password against hash

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Password verification failed:', error.message);
    return false;
  }
}

// 6. Navigator: "Now let's add tests"
// 7. Driver: /tests
```

### Deliverables
- [ ] Pair programming guidelines documented
- [ ] Copilot best practices compiled
- [ ] Team training sessions completed
- [ ] Feedback mechanism established

---

## Task 4: Setup GitHub Codespaces for Secure Development

### Objectives
- ตั้งค่า GitHub Codespaces สำหรับทีม
- สร้าง Secure Development Environment
- กำหนด Coding Standards ใน Codespace

### GitHub Codespaces Benefits for Security

1. **Isolated Environment** - No sensitive data on local machines
2. **Standardized Tooling** - Same tools and configs for everyone
3. **Pre-configured Security** - Security tools pre-installed
4. **Audit Trail** - Track development activities
5. **Quick Onboarding** - New developers productive immediately

### Step-by-Step Setup

#### 4.1 Create Dev Container Configuration

สร้างไฟล์ `.devcontainer/devcontainer.json`:

```json
{
  "name": "Secure Development Environment",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/aws-cli:1": {},
    "ghcr.io/devcontainers/features/azure-cli:1": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "GitHub.copilot",
        "GitHub.copilot-chat",
        "GitHub.vscode-pull-request-github",
        "ms-azuretools.vscode-docker",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "SonarSource.sonarlint-vscode",
        "streetsidesoftware.code-spell-checker",
        "eamodio.gitlens",
        "usernamehw.errorlens",
        "bradlc.vscode-tailwindcss"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],
        "sonarlint.rules": {
          "javascript:S2068": {"level": "on"},
          "javascript:S5131": {"level": "on"}
        }
      }
    }
  },

  "postCreateCommand": "npm install && npm run setup:dev",

  "forwardPorts": [3000, 3001, 5432],

  "portsAttributes": {
    "3000": {
      "label": "Application",
      "onAutoForward": "notify"
    },
    "3001": {
      "label": "API Server",
      "onAutoForward": "silent"
    }
  },

  "secrets": {
    "DATABASE_URL": {
      "description": "Database connection string"
    },
    "API_KEY": {
      "description": "External API key"
    }
  },

  "containerEnv": {
    "NODE_ENV": "development",
    "LOG_LEVEL": "debug"
  },

  "remoteUser": "node"
}
```

#### 4.2 Create Dockerfile for Custom Image

สร้างไฟล์ `.devcontainer/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install security tools
RUN apt-get update && apt-get install -y \
    git-secrets \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g \
    npm-audit-resolver \
    snyk \
    @commitlint/cli \
    @commitlint/config-conventional

# Install git-secrets and configure
RUN git clone https://github.com/awslabs/git-secrets.git /tmp/git-secrets \
    && cd /tmp/git-secrets && make install \
    && rm -rf /tmp/git-secrets

# Create setup script
COPY setup-security.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/setup-security.sh

USER node
```

#### 4.3 Security Setup Script

สร้างไฟล์ `.devcontainer/setup-security.sh`:

```bash
#!/bin/bash

echo "Setting up security tools..."

# Setup git-secrets
git secrets --install -f
git secrets --register-aws

# Add custom patterns
git secrets --add 'COMPANY_API_KEY_[A-Z0-9]+'
git secrets --add 'password\s*=\s*["\047][^"\047]+'

# Setup pre-commit hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run git-secrets check
git secrets --pre_commit_hook -- "$@"

# Run lint-staged
npx lint-staged
EOF

chmod +x .git/hooks/pre-commit

echo "Security setup complete!"
```

#### 4.4 Codespace Security Policies

**Organization Settings**:
```
Organization → Settings → Codespaces

Security:
✅ Restrict port visibility - Private only by default
✅ Require prebuild secrets review
✅ Enable GPG verification for commits

Allowed repositories:
✅ Selected repositories (choose specific repos)

Machine types:
✅ Limit to 4-core machines (cost control)
```

#### 4.5 Using Codespaces

**Create Codespace**:
```
Repository → Code → Codespaces → Create codespace on main
```

**Keyboard Shortcuts**:
```
Ctrl+Shift+P / Cmd+Shift+P - Command Palette
Ctrl+` / Cmd+` - Terminal
Ctrl+Shift+G / Cmd+Shift+G - Source Control
```

**Codespace Best Practices**:
1. Always use HTTPS for Git operations
2. Use Codespace secrets for sensitive data
3. Don't commit secrets to repository
4. Stop Codespace when not in use
5. Use prebuild for faster startup

### Deliverables
- [ ] Codespace configuration created
- [ ] Security tools pre-installed
- [ ] Team trained on Codespace usage
- [ ] Codespace policies documented

---

## Workshop Activities for Developer

### Activity 1: Dependabot Configuration (1.5 hours)
- Enable Dependabot alerts
- Create dependabot.yml configuration
- Test auto-merge workflow

### Activity 2: Secret Scanning Setup (1.5 hours)
- Enable secret scanning
- Configure push protection
- Test with sample (fake) secrets
- Practice remediation process

### Activity 3: Copilot Pair Programming (2 hours)
- Practice with a partner
- Use Copilot commands for security review
- Document best practices learned

### Activity 4: Codespaces Setup (1 hour)
- Create dev container config
- Test Codespace environment
- Verify security tools work

---

## Success Criteria for Developer

- [ ] Dependabot enabled and configured
- [ ] At least one security update merged
- [ ] Secret scanning active
- [ ] Push protection tested
- [ ] Pair programming session completed
- [ ] Codespace environment working
- [ ] Security tools documented

---

## Resources

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)

---

**Related Documents**:
- [Phase 3 Main Document](../03-PHASE3-SECURITY.md)
- [PM Role](./03-PHASE3-PM.md)
- [QA Role](./03-PHASE3-QA.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
