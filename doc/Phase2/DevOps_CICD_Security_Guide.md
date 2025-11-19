# DevOps CI/CD & Security Guide

## Overview
This guide provides step-by-step instructions for setting up CI/CD pipelines, managing environments and secrets, and implementing security best practices in GitHub.

---

## CI/CD Pipeline Setup
### Steps:
1. **Define CI/CD policy and oversee Secrets/Environments setup**
2. **Track progress of Build & Test pipeline configuration**
3. **Develop build & test workflows in GitHub Actions**

### Example Workflow (Build & Test):
```yaml
name: CI Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

### Environment & Promotion:
```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: echo "Deploying to Staging"

  deploy-prod:
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    steps:
      - name: Deploy to Production
        run: echo "Deploying to Production"
```

![CI/CD Pipeline Diagram](ci_cd_pipeline.png)

---

## Environment & Secrets Management
- Add secrets in GitHub Settings → Secrets → Actions
- Example usage:
```yaml
- name: Login to Azure
  run: az login --service-principal -u ${{ secrets.AZURE_CLIENT_ID }} -p ${{ secrets.AZURE_CLIENT_SECRET }} --tenant ${{ secrets.AZURE_TENANT_ID }}
```

---

## Security & Branch Protection
### Branch Protection Rules:
- Require Pull Request Reviews
- Require Status Checks
- Block force pushes

### Dependabot Configuration:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Secret Scanning & Alerts:
- Enable in GitHub Settings → Code Security & Analysis

![Security Flow Diagram](security_flow.png)

---

## Security Testing
### Negative Test Example (JavaScript):
```javascript
test('SQL Injection attempt should fail', async () => {
  const response = await request(app)
    .post('/login')
    .send({ username: "' OR 1=1 --", password: "fake" });
  expect(response.status).toBe(400);
});
```

---

## Hands-On Checklist
- Configure CI/CD workflows
- Set up environments and secrets
- Apply branch protection rules
- Enable Dependabot and secret scanning
- Implement security tests
