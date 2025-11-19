# DevOps CI/CD & Security Workshop

## Workshop Overview
**Duration**: 2 hours (Focused Hands-On Workshop)
**Level**: Intermediate to Advanced
**Prerequisites**:
- Basic Git and GitHub knowledge
- Understanding of software development lifecycle
- Familiarity with Node.js (or Python/Java/Go)
- GitHub account with repository access

**Learning Objectives**:
- Set up CI/CD pipelines with integrated security scanning
- Implement secrets management and deployment environments
- Apply branch protection and security policies
- Configure monitoring and alerting

---

## Workshop Agenda

| Time | Module | Topics |
|------|--------|---------|
| 0:00-0:40 | **Module 1** | CI/CD Pipeline with Security |
| 0:40-1:20 | **Module 2** | Environments, Secrets & Branch Protection |
| 1:20-1:50 | **Module 3** | Monitoring & Hands-On Project |
| 1:50-2:00 | **Wrap-Up** | Q&A and Next Steps |

---

## Module 1: CI/CD Pipeline with Security (40 minutes)

### Quick Introduction (5 minutes)
**Key Concepts**:
- CI/CD automates build, test, and deployment
- GitHub Actions = Workflow automation platform
- Security should be integrated, not added later
- Pipeline stages: Build → Test → Scan → Deploy

### Hands-On: Complete CI/CD Pipeline (35 minutes)

**Task**: Create a production-ready CI/CD pipeline with security

```markdown
Step 1: Set up project (5 minutes)
1. Fork workshop repository
2. Clone to your machine
3. Review the sample Node.js Express application
```

**Step 2: Create Main CI Workflow (15 minutes)**

Create `.github/workflows/ci-security.yml`:

```yaml
name: CI with Security

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-test-scan:
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    steps:
      # 1. Checkout and Setup
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      # 2. Build and Test
      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage

      # 3. Security Scanning
      - name: Run npm security audit
        run: npm audit --audit-level=moderate

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

      # 4. Build Docker Image
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          load: true
          tags: workshop-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # 5. Container Security Scan
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: workshop-app:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
        continue-on-error: true

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v3
        if: always() && hashFiles('trivy-results.sarif') != ''
        with:
          sarif_file: 'trivy-results.sarif'
```

**Step 3: Test Pipeline (10 minutes)**

```markdown
Actions to perform:
1. Push workflow to GitHub
2. View workflow run in Actions tab
3. Check job logs for each step
4. Navigate to Security tab to see scan results
5. Introduce a test vulnerability (old package version)
6. Observe security alerts

Discussion Points:
- Why use npm ci instead of npm install?
- How does caching improve build times?
- When should the pipeline fail vs warn?
- How to handle false positives?
```

**Quick Tips**:
- Use `continue-on-error: true` for warnings
- Cache dependencies to speed up builds
- Run critical scans in parallel when possible
- Upload artifacts for detailed reports

**Expected Outcome**:
✅ Automated pipeline running build, test, and security scans
✅ Security findings visible in GitHub Security tab

---

## Module 2: Environments, Secrets & Branch Protection (40 minutes)

### Prerequisites

Before starting this module, ensure you have:
- Azure account with active subscription
- Azure resources created (see [Azure Setup Guide](Azure-Setup-Guide.md))
- Service principal credentials ready
- GitHub repository with sample application

**📚 If you haven't set up Azure resources yet, follow the [Azure Setup Guide](Azure-Setup-Guide.md) first.**

### 2.1 Environments & Secrets (20 minutes)

**Hands-On: Multi-Environment Deployment**

```markdown
Step 0: Setup Azure Resources (Before Workshop)

Option A - Azure App Service:
1. Login to Azure Portal (portal.azure.com)
2. Create Resource Group: workshop-rg
3. Create two App Services:
   - Staging: workshop-app-staging (Linux, Node 18)
   - Production: workshop-app-prod (Linux, Node 18)
4. Get deployment credentials using Azure CLI:
   az ad sp create-for-rbac --name "github-actions-workshop" \
     --role contributor \
     --scopes /subscriptions/{sub-id}/resourceGroups/workshop-rg \
     --sdk-auth

Option B - Azure Static Web Apps:
1. Login to Azure Portal
2. Create Static Web App: workshop-swa
3. Select GitHub as source (or Manual for workshop)
4. Copy the deployment token from Portal > Settings > API key

Step 1: Create Environments (5 minutes)
1. Go to Settings > Environments
2. Create "staging" environment
   - Add reviewer: yourself
3. Create "production" environment
   - Add 1 required reviewer
   - Enable wait timer: 5 minutes
   - Add deployment branch: main only
```

**Step 2: Add Secrets (5 minutes)**

**For Azure App Service Deployment (as defined in deploy.yml):**

The deploy.yml workflow requires the following secrets:

**Staging Environment Secrets** (Settings > Environments > staging > Add secret):
```markdown
Secret Name: AZURE_APP_NAME_STAGING
Value: Your App Service name for staging (e.g., workshop-app-staging)

Secret Name: AZURE_WEBAPP_PUBLISH_PROFILE_STAGING
Value: <publish-profile-xml-from-azure>
```

**Production Environment Secrets** (Settings > Environments > production > Add secret):
```markdown
Secret Name: AZURE_APP_NAME_PROD
Value: Your App Service name for production (e.g., workshop-app-prod)

Secret Name: AZURE_WEBAPP_PUBLISH_PROFILE_PROD
Value: <publish-profile-xml-from-azure>
```

**How to Get Publish Profile from Azure Portal:**

```bash
# Option 1: Using Azure Portal
1. Go to Azure Portal > App Service
2. Select your App Service (staging or prod)
3. Click "Get publish profile" in the top menu
4. Download the .publishsettings file
5. Open the file and copy all contents (entire XML)
6. Paste into the corresponding GitHub Environment Secret

# Option 2: Using Azure CLI
# For Staging
az webapp deployment list-publishing-profiles \
  --name workshop-app-staging \
  --resource-group workshop-rg \
  --xml

# For Production
az webapp deployment list-publishing-profiles \
  --name workshop-app-prod \
  --resource-group workshop-rg \
  --xml
```

**Summary of Required Secrets:**
- ✅ 2 secrets in staging environment
- ✅ 2 secrets in production environment
- ✅ Total of 4 secrets as defined in deploy.yml

**For Azure Static Web Apps (Alternative Option):**

```markdown
Repository Secrets:
- AZURE_STATIC_WEB_APPS_API_TOKEN (from Azure Portal)
```

**Step 3: Create Deployment Workflow (10 minutes)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    name: Build Application
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: node-app
          path: |
            .
            !node_modules
            !.git

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    environment: staging

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: node-app

      - name: Install dependencies
        run: npm ci --production

      - name: Deploy to Azure App Service (Staging)
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_APP_NAME_STAGING }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_STAGING }}
          package: .

      - name: Smoke test
        run: |
          echo "Running smoke tests..."
          sleep 30
          curl -f https://${{ secrets.AZURE_APP_NAME_STAGING }}.azurewebsites.net/health || echo "Health check endpoint not available yet"

      - name: Notify deployment
        if: success()
        run: |
          echo "✅ Deployed to Staging"
          echo "URL: https://${{ secrets.AZURE_APP_NAME_STAGING }}.azurewebsites.net"

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: production

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: node-app

      - name: Install dependencies
        run: npm ci --production

      - name: Deploy to Azure App Service (Production)
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_APP_NAME_PROD }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_PROD }}
          package: .

      - name: Health check
        run: |
          echo "Running health checks..."
          sleep 30
          curl -f https://${{ secrets.AZURE_APP_NAME_PROD }}.azurewebsites.net/health || echo "Health check endpoint not available yet"

      - name: Verify deployment
        run: |
          echo "Verifying deployment..."
          curl -f https://${{ secrets.AZURE_APP_NAME_PROD }}.azurewebsites.net/api/info

      - name: Notify deployment
        if: success()
        run: |
          echo "🚀 Deployed to Production"
          echo "URL: https://${{ secrets.AZURE_APP_NAME_PROD }}.azurewebsites.net"

```

**Alternative: Deploy to Azure Static Web Apps**

For static web applications (React, Vue, Angular):

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3

      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/" # App source code path
          api_location: "api" # Api source code path - optional
          output_location: "build" # Built app content directory
```

**Key Concepts**:
- Environment-specific secrets
- Approval gates for production
- Progressive deployment (staging → production)
- Never expose secrets in logs

---

### 2.2 Branch Protection & Security Policies (20 minutes)

**Hands-On: Secure Your Repository**

```markdown
Step 1: Configure Branch Protection (10 minutes)

Settings > Branches > Add rule for "main":

✅ Required settings:
□ Require a pull request before merging
  □ Require approvals: 1
  □ Dismiss stale PR approvals
□ Require status checks to pass
  □ Require branches to be up to date
  □ Status checks: build-test-scan
□ Require conversation resolution
□ Do not allow bypassing
□ Block force pushes
```

**Step 2: Create CODEOWNERS (3 minutes)**

Create `.github/CODEOWNERS`:

```
# Default owners
*                @your-username

# Security-sensitive files
/src/auth/       @security-team
/.github/        @devops-team
*.env.example    @devops-team
```

**Step 3: Configure Dependabot (5 minutes)**

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    reviewers:
      - 'pongsakorn-h-fusion'
    labels:
      - 'dependencies'
      - 'security'

  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'weekly'

```

**Step 4: Enable Secret Scanning (2 minutes)**

```markdown
Settings > Code security and analysis:
1. Enable "Secret scanning"
2. Enable "Push protection"
3. Test by trying to commit: API_KEY="ghp_xxxxxxxxxxxx"
   (Should be blocked!)
```

**Expected Outcome**:
✅ Protected main branch with required reviews
✅ Automatic dependency updates
✅ Secret leak prevention active

---

## Module 3: Monitoring & Hands-On Project (30 minutes)

### 3.1 Pipeline Monitoring (10 minutes)

**Objective**: Set up automated monitoring and notifications for your CI/CD pipelines

**Why Monitoring Matters**:
- Immediate notification when pipelines fail
- Track deployment success/failure
- Automatically create issues for recurring problems
- Keep team informed without manual checking

**Hands-On: Create Monitoring Workflow**

**Step 1: Set up Microsoft Teams Webhook (3 minutes)**

```markdown
1. In Microsoft Teams, go to your channel
2. Click ⋯ (More options) > Connectors
3. Search for "Incoming Webhook"
4. Click "Configure" and give it a name (e.g., "GitHub Pipeline Monitor")
5. Copy the webhook URL
6. In GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: MS_TEAMS_WEBHOOK_URL
   - Value: <paste-webhook-url>
```

**Alternative: Slack Integration**
```markdown
If using Slack instead:
1. Create a Slack App and enable Incoming Webhooks
2. Get webhook URL from Slack
3. Add as SLACK_WEBHOOK_URL secret in GitHub
4. Modify workflow to use slack-notify action instead
```

**Step 2: Create Monitoring Workflow (5 minutes)**

Create `.github/workflows/monitoring.yml`:

```yaml
name: Pipeline Monitor

on:
  workflow_run:
    workflows: ['CI Pipeline', 'Deploy to Azure']
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Microsoft Teams on Failure
        if: github.event.workflow_run.conclusion == 'failure'
        uses: aliencube/microsoft-teams-actions@v0.8.0
        with:
          webhook_uri: ${{ secrets.MS_TEAMS_WEBHOOK_URL }}
          title: '🚨 Pipeline Failed'
          summary: '${{ github.event.workflow_run.name }} failed on ${{ github.event.workflow_run.head_branch }}'
          theme_color: 'FF0000'
          sections: |
            [
              {
                "activityTitle": "Pipeline Failure Details",
                "activitySubtitle": "${{ github.repository }}",
                "facts": [
                  {
                    "name": "Pipeline:",
                    "value": "${{ github.event.workflow_run.name }}"
                  },
                  {
                    "name": "Branch:",
                    "value": "${{ github.event.workflow_run.head_branch }}"
                  },
                  {
                    "name": "Commit:",
                    "value": "${{ github.event.workflow_run.head_sha }}"
                  },
                  {
                    "name": "Author:",
                    "value": "${{ github.event.workflow_run.head_commit.author.name }}"
                  },
                  {
                    "name": "Status:",
                    "value": "❌ Failed"
                  }
                ]
              }
            ]
          actions: |
            [
              {
                "@type": "OpenUri",
                "name": "View Workflow Run",
                "targets": [
                  {
                    "os": "default",
                    "uri": "${{ github.event.workflow_run.html_url }}"
                  }
                ]
              },
              {
                "@type": "OpenUri",
                "name": "View Repository",
                "targets": [
                  {
                    "os": "default",
                    "uri": "${{ github.event.workflow_run.repository.html_url }}"
                  }
                ]
              }
            ]

      - name: Notify Microsoft Teams on Success
        if: github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.name == 'Deploy to Azure'
        uses: aliencube/microsoft-teams-actions@v0.8.0
        with:
          webhook_uri: ${{ secrets.MS_TEAMS_WEBHOOK_URL }}
          title: '✅ Deployment Successful'
          summary: '${{ github.event.workflow_run.name }} completed successfully on ${{ github.event.workflow_run.head_branch }}'
          theme_color: '00FF00'
          sections: |
            [
              {
                "activityTitle": "Deployment Success",
                "activitySubtitle": "${{ github.repository }}",
                "facts": [
                  {
                    "name": "Pipeline:",
                    "value": "${{ github.event.workflow_run.name }}"
                  },
                  {
                    "name": "Branch:",
                    "value": "${{ github.event.workflow_run.head_branch }}"
                  },
                  {
                    "name": "Commit:",
                    "value": "${{ github.event.workflow_run.head_sha }}"
                  },
                  {
                    "name": "Author:",
                    "value": "${{ github.event.workflow_run.head_commit.author.name }}"
                  },
                  {
                    "name": "Status:",
                    "value": "✅ Success"
                  }
                ]
              }
            ]
          actions: |
            [
              {
                "@type": "OpenUri",
                "name": "View Workflow Run",
                "targets": [
                  {
                    "os": "default",
                    "uri": "${{ github.event.workflow_run.html_url }}"
                  }
                ]
              }
            ]

      - name: Create issue on repeated failures
        if: github.event.workflow_run.conclusion == 'failure'
        uses: actions/github-script@v6
        with:
          script: |
            const { data: runs } = await github.rest.actions.listWorkflowRuns({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: context.payload.workflow_run.workflow_id,
              per_page: 3
            });

            const failures = runs.workflow_runs.filter(r => r.conclusion === 'failure').length;

            if (failures >= 3) {
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: '🚨 Pipeline Failing Repeatedly',
                body: 'The CI pipeline has failed 3 times in a row. Please investigate.',
                labels: ['bug', 'ci-failure', 'high-priority']
              });
            }

```

**Step 3: Test the Monitoring (2 minutes)**

```markdown
1. Push the monitoring.yml workflow to GitHub
2. Trigger a workflow failure (e.g., break a test)
3. Check Microsoft Teams for failure notification
4. Fix the test and verify success notification (for deployments)
5. Check if issue was created after 3 consecutive failures
```

**How the Monitoring Works**:

1. **Trigger**: `workflow_run` event activates when specified workflows complete
   - Monitors: 'CI Pipeline' and 'Deploy to Azure' workflows
   - Triggers on: completion (success or failure)

2. **Failure Notifications**:
   - Sends Microsoft Teams notification with red theme
   - Includes: workflow name, branch, commit SHA, author
   - Provides links to workflow run and repository
   - Triggered only when `conclusion == 'failure'`

3. **Success Notifications**:
   - Only for successful deployments ('Deploy to Azure')
   - Sends green-themed Teams notification
   - Helps track deployment frequency
   - Confirms production releases

4. **Automated Issue Creation**:
   - Uses `actions/github-script` to query recent workflow runs
   - Checks last 3 runs for the same workflow
   - Creates GitHub issue if 3+ consecutive failures detected
   - Labels: 'bug', 'ci-failure', 'high-priority'

**Important Notes**:
- Workflow names in `workflows:` array must match exactly
  - 'CI Pipeline' should match your `name:` in ci-security.yml
  - 'Deploy to Azure' should match your `name:` in deploy.yml
- Requires `MS_TEAMS_WEBHOOK_URL` secret configured
- Issue creation requires default `GITHUB_TOKEN` permissions

**Customization Options**:

```yaml
# Change notification threshold
if (failures >= 2) {  # Alert after 2 failures instead of 3

# Add more monitored workflows
workflows: ['CI Pipeline', 'Deploy to Azure', 'Security Scan']

# Customize issue body
body: `The pipeline has failed ${failures} times.\n\nLast failed run: ${context.payload.workflow_run.html_url}`
```

**Key Monitoring Benefits**:
- Real-time failure alerts to team channel
- Automatic issue tracking for persistent problems
- Deployment success visibility
- Reduced mean-time-to-detection (MTTD)
- No manual pipeline checking needed

---

### 3.2 Hands-On Capstone Project (20 minutes)

**Challenge: Complete End-to-End Setup**

```markdown
Task: Implement everything you've learned!

Requirements Checklist:
□ CI pipeline with build, test, lint
□ Security scanning (CodeQL + Trivy)
□ Multi-environment deployment
□ Secrets properly configured
□ Branch protection enabled
□ Monitoring and alerts working

Implementation Steps:

1. Review Your Pipeline (5 min)
   - Verify all jobs run successfully
   - Check security scan results
   - Test with a PR

2. Test Deployment Flow (5 min)
   - Merge to main
   - Observe staging deployment
   - Approve production deployment
   - Verify notifications

3. Test Security Features (5 min)
   - Try to push a secret (should fail)
   - Create PR without approval (should block)
   - Introduce vulnerable dependency
   - Check Dependabot alerts

4. Verify Monitoring (5 min)
   - Trigger pipeline failure (intentionally break a test)
   - Check Microsoft Teams for failure notification
   - Trigger 2 more failures to test issue creation
   - Verify GitHub issue was automatically created
   - Fix the test and check success notification

Success Criteria:
✅ All CI checks pass
✅ Deployments work with approval gates
✅ Security scans detect vulnerabilities
✅ Branch protection blocks direct pushes
✅ Notifications work correctly
```

**Bonus Challenges** (if time permits):
- Add health check endpoints
- Implement smoke tests
- Create custom status checks
- Add metrics collection

---

## Workshop Wrap-Up (10 minutes)

### What We Covered

**1. CI/CD Pipeline** ✅
- Automated build and test
- Integrated security scanning (CodeQL, Trivy)
- Docker container builds
- Multi-stage pipelines

**2. Security & Governance** ✅
- Secrets management
- Environment protection
- Branch protection rules
- Automated dependency updates
- Secret scanning and prevention

**3. Monitoring & Alerts** ✅
- Pipeline failure notifications via Microsoft Teams
- Automated issue creation for repeated failures
- Deployment success tracking
- Integration with collaboration tools (Teams/Slack)

### Best Practices Checklist

```markdown
✅ Never commit secrets to repository
✅ Use environment-specific secrets
✅ Require PR reviews for main branch
✅ Enable branch protection and status checks
✅ Run security scans on every PR
✅ Use approval gates for production
✅ Monitor pipeline health
✅ Automate dependency updates
✅ Enable secret scanning with push protection
✅ Document your workflows
```

### Common Pitfalls to Avoid

1. **Secrets Exposure**
   - ❌ Hardcoding secrets in code
   - ✅ Use GitHub Secrets with environment separation

2. **Insufficient Testing**
   - ❌ Only testing on main branch
   - ✅ Test on every PR

3. **No Rollback Strategy**
   - ❌ Deploy and hope for the best
   - ✅ Keep previous version, add health checks

4. **Ignoring Security Alerts**
   - ❌ Dismissing Dependabot PRs
   - ✅ Review and update regularly

5. **Poor Monitoring**
   - ❌ Finding out about failures manually
   - ✅ Automated alerts to team channels

### Next Steps

**Immediate Actions**:
1. Apply this setup to your real projects
2. Enable GitHub Advanced Security (if available)
3. Configure Microsoft Teams/Slack webhooks for all repositories
4. Document your CI/CD process and runbooks
5. Set up monitoring dashboards for pipeline metrics

**Continue Learning**:
- **Advanced CI/CD**: Blue-green deployments, canary releases
- **Infrastructure as Code**: Terraform, Pulumi
- **Container Orchestration**: Kubernetes deployments
- **Observability**: Logs, metrics, traces (Grafana, Prometheus)
- **GitOps**: ArgoCD, Flux

**Useful Resources**:
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [GitHub Security Best Practices](https://docs.github.com/code-security)
- [OWASP Top 10](https://owasp.org/Top10/)
- [DevSecOps Manifesto](https://www.devsecops.org/)

### Q&A - Common Questions

**Q: How often should we run security scans?**
A: On every PR + daily scheduled scans + before deployment

**Q: Should we block on all security findings?**
A: Block on CRITICAL, review HIGH, monitor MEDIUM/LOW

**Q: How many environments do we need?**
A: Minimum: staging + production. Ideal: dev + staging + production

**Q: When to use manual approval?**
A: Always for production. Consider for staging in regulated industries.

**Q: How to handle hotfixes?**
A: Create hotfix branch, fast-track review, deploy, backport to main

---

## Post-Workshop Resources

### Sample Project Structure

```
workshop-project/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                # Main CI pipeline
│   │   ├── deploy.yml            # Deployment workflow (Azure)
│   │   └── monitoring.yml        # Monitoring and alerts
│   ├── CODEOWNERS                # Code ownership
│   └── dependabot.yml            # Dependency management
├── tests/
│   └── unit/
│       └── server.test.js        # Unit tests
├── server.js                     # Main application
├── package.json                  # Dependencies and scripts
├── jest.config.js                # Test configuration
├── .eslintrc.js                  # Linting rules
├── .prettierrc                   # Code formatting
├── .env.example                  # Environment variables template
└── README.md                     # Documentation
```

**📦 Sample Application Available:**
- Complete working Node.js app in [sample-app/](https://github.com/pongsakorn-h-fusion/sample-project.git) directory
- Includes all necessary configuration files
- Pre-configured GitHub Actions workflows
- Ready to deploy to Azure

### Quick Reference - Workflow Templates

**Minimal CI Pipeline**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

**Security Scan Only**:
```yaml
name: Security
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: github/codeql-action/init@v2
      - uses: github/codeql-action/analyze@v2
```

**Simple Deployment**:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - run: echo "Deploy script here"
```

### Troubleshooting Guide

**Pipeline Fails Immediately**
- Check workflow syntax with GitHub's validator
- Verify all required secrets are set
- Check runner availability

**Security Scan False Positives**
- Review and dismiss in Security tab
- Add to ignore list if appropriate
- Update to patched version if available

**Deployment Blocked**
- Check environment protection rules
- Verify required reviewers
- Ensure status checks passed

**Secrets Not Working**
- Verify secret names match exactly (case-sensitive)
- Check environment scope
- Ensure workflow has correct permissions

---

## Feedback Form

Please help us improve this workshop:

1. **Content Clarity** (1-5): ___
2. **Hands-On Exercises** (1-5): ___
3. **Workshop Pace** (too slow / just right / too fast): ___
4. **Most Valuable Topic**: ___
5. **Suggestions for Improvement**: ___

---

## Certificate of Completion

**Congratulations!** 🎉

You have completed the **DevOps CI/CD & Security Workshop** and can now:

✅ Build automated CI/CD pipelines
✅ Integrate security scanning in workflows
✅ Manage secrets and environments safely
✅ Implement branch protection policies
✅ Set up monitoring and alerting
✅ Deploy applications securely

**Workshop Completion Date**: _________
**Instructor**: _________

---

**Remember**: Security is not a destination, it's a journey. Keep learning, keep improving, and stay secure!

**Happy Automating! 🚀**

---

*Workshop Version: 2.0 (2-Hour Format)*
*Last Updated: 2025*
