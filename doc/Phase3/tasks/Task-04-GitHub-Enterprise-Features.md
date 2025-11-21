# Task 4: GitHub Enterprise Security Features

**Role**: All Roles (PM, Developer, QA)
**Estimated Time**: 3-4 hours
**Feature**: GitHub Enterprise Cloud Security Features

---

## Objectives

- เข้าใจและใช้งาน GitHub Enterprise Security Features
- ตั้งค่า GitHub Codespaces สำหรับ Secure Development
- ใช้งาน GitHub Advanced Security Features
- เปิดใช้งาน Audit Log และ Compliance Features

## Prerequisites

- GitHub Enterprise Cloud license
- Organization admin access (for some features)
- Repository admin access
- Understanding of security concepts

---

## Part A: GitHub Codespaces for Secure Development

### Overview

GitHub Codespaces ให้ความสามารถในการพัฒนาในสภาพแวดล้อมที่ปลอดภัยบน cloud โดยมีข้อดีด้านความปลอดภัยดังนี้:

1. **Isolation** - ไม่มีข้อมูลสำคัญบนเครื่อง local
2. **Standardization** - ทุกคนใช้ environment เดียวกัน
3. **Security Controls** - ควบคุม access และ audit ได้
4. **Pre-configured Tools** - เครื่องมือ security ติดตั้งไว้แล้ว

---

### Step 1: Configure Codespaces at Organization Level

#### 1.1 Organization Settings

```
Organization → Settings → Codespaces
```

**Security Settings**:
```
✅ Enable Codespaces for this organization

Access:
- Selected repositories only (recommended)
- Or: All repositories

Port visibility:
✅ Private (default) - Only accessible via authenticated GitHub
❌ Public - Accessible to anyone

Codespace retention:
- Maximum idle timeout: 30 minutes
- Default retention period: 14 days (non-active codespaces)
```

**Cost Controls**:
```
Machine types allowed:
✅ 2-core (4 GB RAM)
✅ 4-core (8 GB RAM)
❌ 8-core (16 GB RAM) - Restrict unless needed
❌ 16-core (32 GB RAM) - Restrict unless needed

Spending limits:
- Set monthly spending limit per user
- Alert when approaching limit
```

#### 1.2 Repository Access

```
Organization → Settings → Codespaces → Repository access

Selected repositories:
✅ main-project
✅ api-service
✅ frontend-app
❌ legacy-system (not enabled)
```

---

### Step 2: Create Secure Dev Container Configuration

#### 2.1 Basic Configuration

สร้างไฟล์ `.devcontainer/devcontainer.json`:

```json
{
  "name": "Secure Development Environment",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "..",
    "args": {
      "VARIANT": "20-bullseye"
    }
  },

  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {
      "version": "latest",
      "moby": true
    },
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
        "redhat.vscode-yaml",
        "streetsidesoftware.code-spell-checker",
        "eamodio.gitlens",
        "usernamehw.errorlens",
        "ms-vscode.vscode-typescript-next"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "eslint.validate": [
          "javascript",
          "typescript",
          "javascriptreact",
          "typescriptreact"
        ],
        "sonarlint.rules": {
          "javascript:S2068": { "level": "on" },
          "javascript:S5131": { "level": "on" },
          "javascript:S2245": { "level": "on" }
        },
        "files.exclude": {
          "**/.git": true,
          "**/.DS_Store": true,
          "**/node_modules": true
        },
        "terminal.integrated.defaultProfile.linux": "bash"
      }
    },
    "codespaces": {
      "openFiles": [
        "README.md"
      ]
    }
  },

  "forwardPorts": [3000, 3001, 5432, 6379],

  "portsAttributes": {
    "3000": {
      "label": "Application",
      "onAutoForward": "notify"
    },
    "3001": {
      "label": "API Server",
      "onAutoForward": "silent"
    },
    "5432": {
      "label": "PostgreSQL",
      "onAutoForward": "ignore"
    },
    "6379": {
      "label": "Redis",
      "onAutoForward": "ignore"
    }
  },

  "secrets": {
    "DATABASE_URL": {
      "description": "Database connection string (will be provided securely)"
    },
    "API_KEY": {
      "description": "External API key for third-party services"
    },
    "JWT_SECRET": {
      "description": "Secret key for JWT token signing"
    }
  },

  "containerEnv": {
    "NODE_ENV": "development",
    "LOG_LEVEL": "debug",
    "TZ": "Asia/Bangkok"
  },

  "postCreateCommand": "bash .devcontainer/post-create.sh",
  "postStartCommand": "bash .devcontainer/post-start.sh",

  "remoteUser": "node",

  "hostRequirements": {
    "cpus": 4,
    "memory": "8gb",
    "storage": "32gb"
  }
}
```

#### 2.2 Custom Dockerfile

สร้างไฟล์ `.devcontainer/Dockerfile`:

```dockerfile
# Base image
ARG VARIANT=20-bullseye
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git-secrets \
        jq \
        curl \
        wget \
        gnupg2 \
        lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages for security
RUN npm install -g \
    npm-audit-resolver \
    snyk \
    @commitlint/cli \
    @commitlint/config-conventional \
    eslint \
    prettier

# Install git-secrets
RUN git clone https://github.com/awslabs/git-secrets.git /tmp/git-secrets \
    && cd /tmp/git-secrets && make install \
    && rm -rf /tmp/git-secrets

# Create directories
RUN mkdir -p /workspace/.vscode-server/extensions

# Copy configuration files
COPY .devcontainer/scripts/ /usr/local/bin/
RUN chmod +x /usr/local/bin/*.sh

# Set up security configurations
USER node
WORKDIR /workspace
```

#### 2.3 Post-Create Script

สร้างไฟล์ `.devcontainer/post-create.sh`:

```bash
#!/bin/bash

echo "Running post-create setup..."

# Install dependencies
npm ci

# Setup git-secrets
git secrets --install -f
git secrets --register-aws

# Add custom patterns
git secrets --add 'COMPANY_API_KEY_[A-Z0-9]+'
git secrets --add 'password\s*=\s*["\047][^"\047]+'

# Setup pre-commit hooks
cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash

# Run git-secrets check
git secrets --pre_commit_hook -- "$@"
if [ $? -ne 0 ]; then
    echo "git-secrets found potential secrets!"
    exit 1
fi

# Run lint-staged
npx lint-staged
HOOK

chmod +x .git/hooks/pre-commit

# Create local environment file
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "Created .env.local from template"
fi

echo "Post-create setup completed!"
```

#### 2.4 Post-Start Script

สร้างไฟล์ `.devcontainer/post-start.sh`:

```bash
#!/bin/bash

echo "Running post-start tasks..."

# Verify security tools are available
echo "Checking security tools..."
command -v git-secrets >/dev/null 2>&1 && echo "✅ git-secrets available" || echo "❌ git-secrets not found"
command -v snyk >/dev/null 2>&1 && echo "✅ snyk available" || echo "❌ snyk not found"

# Run quick security check
echo "Running security audit..."
npm audit --audit-level=high

# Check for outdated packages
echo "Checking for outdated packages..."
npm outdated

echo "Post-start tasks completed!"
```

---

### Step 3: Codespaces Secrets Management

#### 3.1 Configure Codespaces Secrets

```
Repository → Settings → Secrets and variables → Codespaces
```

**Add Secrets**:
```
Name: DATABASE_URL
Value: postgresql://user:pass@host:5432/db

Name: API_KEY
Value: sk_live_xxxxx

Name: JWT_SECRET
Value: your-jwt-secret-key
```

**Organization-wide Secrets**:
```
Organization → Settings → Secrets and variables → Codespaces

Shared secrets across repositories:
- NPM_TOKEN
- SONAR_TOKEN
- SNYK_TOKEN
```

#### 3.2 Access Secrets in Codespace

Secrets จะถูก inject เป็น environment variables:

```javascript
// Access in code
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// Verify secrets are available
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not configured in Codespaces secrets');
  process.exit(1);
}
```

---

## Part B: GitHub Advanced Security (GHAS)

### Overview

GitHub Advanced Security ประกอบด้วย:
1. **Code Scanning** - ตรวจหาช่องโหว่ในโค้ด
2. **Secret Scanning** - ตรวจหา secrets ที่ commit ผิดพลาด
3. **Dependency Review** - ตรวจสอบ dependencies ก่อน merge
4. **Security Overview** - Dashboard สรุปสถานะความปลอดภัย

---

### Step 4: Enable GitHub Advanced Security

#### 4.1 Organization Level

```
Organization → Settings → Code security and analysis
```

**Enable Features**:
```
✅ Dependency graph (required for other features)
✅ Dependabot alerts
✅ Dependabot security updates
✅ GitHub Advanced Security (requires license)
  ✅ Code scanning
  ✅ Secret scanning
  ✅ Secret scanning push protection
```

#### 4.2 Repository Level

```
Repository → Settings → Code security and analysis
```

**Enable All Features**:
```
✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
✅ Code scanning
   - Default setup (recommended)
   - Advanced setup (custom CodeQL)
✅ Secret scanning
✅ Secret scanning push protection
```

---

### Step 5: Configure Code Scanning

#### 5.1 Default Setup

```
Repository → Settings → Code security and analysis → Code scanning
Click "Set up" → "Default"
```

GitHub จะสร้าง workflow อัตโนมัติที่รันทุกครั้งที่ push

#### 5.2 Advanced Setup with Custom CodeQL

สร้างไฟล์ `.github/workflows/codeql-analysis.yml`:

```yaml
name: "CodeQL Analysis"

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 3 * * 1'  # Every Monday at 3 AM

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
        language: ['javascript', 'typescript']

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: ${{ matrix.language }}
        queries: +security-extended,security-and-quality
        config-file: ./.github/codeql/codeql-config.yml

    - name: Autobuild
      uses: github/codeql-action/autobuild@v3

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
      with:
        category: "/language:${{ matrix.language }}"
```

#### 5.3 Custom CodeQL Configuration

สร้างไฟล์ `.github/codeql/codeql-config.yml`:

```yaml
name: "Custom CodeQL Configuration"

# Disable default queries and use custom set
disable-default-queries: false

# Add security queries
queries:
  - uses: security-extended
  - uses: security-and-quality

# Custom query suites
query-filters:
  - exclude:
      id: js/useless-expression

# Path filters
paths-ignore:
  - node_modules
  - '**/test/**'
  - '**/*.test.js'
  - '**/*.spec.js'
  - '**/vendor/**'
  - '**/dist/**'
  - '**/build/**'
```

---

### Step 6: Configure Dependency Review

#### 6.1 Enable Dependency Review

Dependency Review จะแสดง dependency changes ใน PR automatically เมื่อเปิดใช้ GitHub Advanced Security

#### 6.2 Create Dependency Review Workflow

สร้างไฟล์ `.github/workflows/dependency-review.yml`:

```yaml
name: 'Dependency Review'

on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
    - name: 'Checkout Repository'
      uses: actions/checkout@v4

    - name: 'Dependency Review'
      uses: actions/dependency-review-action@v4
      with:
        fail-on-severity: high
        allow-licenses: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC
        deny-licenses: GPL-3.0, AGPL-3.0
        comment-summary-in-pr: always
        vulnerability-check: true
        license-check: true
```

---

## Part C: Security Overview Dashboard

### Step 7: Access Security Overview

#### 7.1 Organization Security Overview

```
Organization → Security → Overview
```

**Available Views**:
- **Risk**: Repositories with most security alerts
- **Coverage**: Repositories with security features enabled
- **Alert trends**: Security alert trends over time

#### 7.2 Repository Security Tab

```
Repository → Security
```

**Sections**:
- **Security advisories**: Published advisories
- **Dependabot alerts**: Vulnerable dependencies
- **Code scanning alerts**: Code vulnerabilities
- **Secret scanning alerts**: Exposed secrets

---

### Step 8: Configure Security Policies

#### 8.1 Default Security Configurations

```
Organization → Settings → Code security and analysis → Global settings
```

**Configure Defaults**:
```
Apply configuration to new repositories:
✅ Enable Dependabot alerts
✅ Enable Dependabot security updates
✅ Enable dependency graph
✅ Enable secret scanning
✅ Enable push protection
✅ Enable code scanning default setup
```

#### 8.2 Security Advisories

**Create Private Advisory**:
```
Repository → Security → Advisories → New draft security advisory
```

**Advisory Information**:
```
Ecosystem: npm
Package name: your-package
Affected versions: < 1.2.3
Patched versions: >= 1.2.3
Severity: High
CVE identifier: CVE-XXXX-XXXXX (if known)

Description:
A detailed description of the vulnerability...

Impact:
What can happen if exploited...

Remediation:
How to fix the vulnerability...
```

---

## Part D: Audit Log and Compliance

### Step 9: Access Audit Log

#### 9.1 Organization Audit Log

```
Organization → Settings → Audit log
```

**Available Filters**:
```
# Filter by action
action:repo.create
action:repo.destroy
action:org.invite_member
action:team.add_member

# Filter by actor
actor:username

# Filter by date
created:>2025-11-01

# Filter by repository
repo:org/repo-name
```

**Important Events to Monitor**:
- `repo.access` - Repository access changes
- `org.add_member` - New members added
- `team.add_repository` - Team access changes
- `protected_branch.update` - Branch protection changes
- `secret_scanning_alert.create` - Secret detected
- `dependabot_alerts.new_alert` - New vulnerability

#### 9.2 Export Audit Log

```
Organization → Settings → Audit log → Export

Options:
- Git events
- JSON format
- Date range
```

---

### Step 10: Configure Audit Log Streaming

#### 10.1 Stream to External SIEM

```
Organization → Settings → Audit log → Log streaming
```

**Supported Destinations**:
- Amazon S3
- Azure Blob Storage
- Azure Event Hubs
- Google Cloud Storage
- Splunk
- Datadog

**Configure S3 Streaming**:
```json
{
  "bucket": "your-audit-log-bucket",
  "region": "ap-southeast-1",
  "prefix": "github-audit-logs/",
  "encryption": "AES256"
}
```

#### 10.2 Audit Log API

```bash
# Get audit log events via API
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/orgs/YOUR_ORG/audit-log?phrase=action:repo.create"
```

**Sample Response**:
```json
{
  "action": "repo.create",
  "actor": "username",
  "repo": "org/repo-name",
  "created_at": 1700000000000,
  "org": "org-name",
  "visibility": "private"
}
```

---

## Deliverables

✅ **Completed**:
1. Codespaces configured with secure dev container
2. GitHub Advanced Security enabled
3. Code scanning configured
4. Dependency review workflow created
5. Security Overview accessible
6. Audit log monitoring configured

📋 **Files Created**:
- `.devcontainer/devcontainer.json`
- `.devcontainer/Dockerfile`
- `.devcontainer/post-create.sh`
- `.devcontainer/post-start.sh`
- `.github/workflows/codeql-analysis.yml`
- `.github/workflows/dependency-review.yml`
- `.github/codeql/codeql-config.yml`

---

## Verification Checklist

- [ ] Codespaces can be created for repository
- [ ] Security tools available in Codespace
- [ ] Code scanning runs on push/PR
- [ ] Dependency review shows in PRs
- [ ] Secret scanning active
- [ ] Push protection working
- [ ] Audit log accessible
- [ ] Security Overview shows data

---

## Best Practices Summary

### Codespaces Security
1. Use specific, locked base images
2. Don't store secrets in container
3. Use Codespaces secrets for sensitive data
4. Set appropriate timeouts
5. Limit machine types by need

### GHAS Security
1. Enable all security features
2. Configure appropriate severity thresholds
3. Set up notifications for alerts
4. Regularly review and resolve alerts
5. Use security policies consistently

### Audit and Compliance
1. Enable audit log streaming
2. Set up alerting for critical events
3. Review audit logs regularly
4. Retain logs per compliance requirements
5. Document security procedures

---

**Related Tasks**:
- [Task 1: Branch Protection](Task-01-PM-Branch-Protection.md)
- [Task 2: Dependabot & Secret Scanning](Task-02-DEV-Dependabot-SecretScanning.md)
- [Task 3: Security Tests](Task-03-QA-Security-Tests.md)

---

**Prepared by**: Workshop Team
**Last Updated**: November 2025
**Version**: 1.0
