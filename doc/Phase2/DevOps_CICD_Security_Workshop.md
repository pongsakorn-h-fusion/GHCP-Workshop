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
      security-events: write
      contents: read
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
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      # 4. Build Docker Image
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
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

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
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

### 2.1 Environments & Secrets (20 minutes)

**Hands-On: Multi-Environment Deployment**

```markdown
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

```markdown
Repository Secrets (Settings > Secrets and variables > Actions):
- SLACK_WEBHOOK_URL (for notifications)

Staging Environment Secrets:
- DATABASE_URL: postgresql://staging-db:5432/app
- API_KEY: staging_key_xxx

Production Environment Secrets:
- DATABASE_URL: postgresql://prod-db:5432/app
- API_KEY: prod_key_xxx
```

**Step 3: Create Deployment Workflow (10 minutes)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Application

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Staging
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          echo "Deploying to Staging..."
          echo "Database: ${DATABASE_URL%%:*}://****"
          # Add your deployment script here

      - name: Smoke test
        run: |
          echo "Running smoke tests..."
          # curl -f https://staging.example.com/health

      - name: Notify Slack
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "✅ Deployed to Staging - ${{ github.sha }}"
            }

  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Production
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          echo "Deploying to Production..."
          # Add your deployment script here

      - name: Notify Slack
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "🚀 Deployed to Production - ${{ github.sha }}"
            }
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
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "your-username"
    labels:
      - "dependencies"
      - "security"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
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

**Quick Setup: Monitoring Workflow**

Create `.github/workflows/monitoring.yml`:

```yaml
name: Pipeline Monitor

on:
  workflow_run:
    workflows: ["CI with Security"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Check status and notify
        uses: slackapi/slack-github-action@v1
        if: github.event.workflow_run.conclusion == 'failure'
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "🚨 CI Pipeline Failed!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Pipeline:* ${{ github.event.workflow_run.name }}\n*Branch:* ${{ github.ref_name }}\n*Status:* ❌ Failed"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Logs"
                      },
                      "url": "${{ github.event.workflow_run.html_url }}"
                    }
                  ]
                }
              ]
            }

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

**Key Monitoring Points**:
- Pipeline success/failure notifications
- Auto-create issues for repeated failures
- Track deployment frequency
- Monitor security scan results

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
   - Trigger pipeline failure
   - Check Slack notification
   - Verify issue creation

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
- Pipeline failure notifications
- Automated issue creation
- Slack integrations
- Deployment tracking

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
3. Set up proper Slack/Teams integration
4. Document your CI/CD process

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
│   │   ├── ci-security.yml       # Main CI pipeline
│   │   ├── deploy.yml            # Deployment workflow
│   │   └── monitoring.yml        # Monitoring and alerts
│   ├── CODEOWNERS                # Code ownership
│   └── dependabot.yml            # Dependency management
├── src/
│   ├── app.js                    # Application code
│   ├── routes/
│   └── middleware/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── security/
├── Dockerfile
├── package.json
└── README.md
```

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
*Last Updated: 2024*
