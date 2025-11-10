# Phase 4: Automation, Auto PR Review & Agent Integration

## General Information

**Duration**: December 1-4, 2025 (4 days)
**Hands-On Workshop**: December 1-4, 2025
**Prerequisites**: Phase 1, 2, and 3 completed
**Wrap-up Meeting**: December 8, 2025 (On-site)

## Objectives

Enhance workflow with automation, AI agents, and auto PR review to increase efficiency and reduce repetitive tasks

## Tasks to Complete

### 🗺️ Develop Roadmap for AI Agent Integration
**Responsible**: PM
**Feature**: General Copilot Usage

#### Details
- Plan AI agents usage
- Define KPIs for monitoring
- Design metrics dashboard

#### Preparation
- [ ] Study AI agents and automation tools
- [ ] Define use cases for AI
- [ ] Design KPI framework
- [ ] Plan rollout strategy

#### AI Agent Use Cases

**1. Code Review Agent**
- Automated code quality checks
- Style and convention enforcement
- Complexity analysis
- Security vulnerability detection
- Best practice suggestions

**2. Documentation Agent**
- Auto-generate API documentation
- Update README files
- Create code comments
- Generate changelog
- Maintain architecture docs

**3. Testing Agent**
- Generate unit tests
- Create test cases from requirements
- Identify edge cases
- Suggest test improvements
- Report coverage gaps

**4. Issue Triage Agent**
- Auto-label issues
- Assign to appropriate team
- Detect duplicates
- Priority assessment
- Related issue linking

**5. Release Management Agent**
- Auto-generate release notes
- Version bump automation
- Dependency updates coordination
- Deployment orchestration
- Rollback automation

**6. Security Agent**
- Continuous vulnerability scanning
- Dependency audit
- Secret detection
- Security policy enforcement
- Compliance checking

#### AI Agent Integration Roadmap

**Phase 4.1: Foundation (Week 1)**
```markdown
### Week 1: Setup & Basic Automation
- [ ] Enable GitHub Actions automation
- [ ] Setup basic PR review bot
- [ ] Configure auto-labeling
- [ ] Implement auto-assignment
```

**Phase 4.2: Intelligence (Month 2)**
```markdown
### Month 2: AI-Powered Features
- [ ] Integrate Copilot for code review
- [ ] Setup intelligent test generation
- [ ] Deploy documentation automation
- [ ] Implement smart issue triage
```

**Phase 4.3: Optimization (Month 3)**
```markdown
### Month 3: Advanced Features
- [ ] Custom AI models for domain-specific tasks
- [ ] Predictive analytics for bugs
- [ ] Automated performance optimization
- [ ] Intelligent resource allocation
```

**Phase 4.4: Scale (Month 4-6)**
```markdown
### Months 4-6: Enterprise Scale
- [ ] Multi-repository automation
- [ ] Cross-team AI agents
- [ ] Advanced analytics dashboard
- [ ] Continuous improvement loops
```

#### KPI Framework

**Efficiency Metrics**
```yaml
Code Review Time:
  Current Baseline: 4 hours
  Target: 2 hours
  Measurement: Time from PR creation to approval

Pull Request Cycle Time:
  Current Baseline: 2 days
  Target: 1 day
  Measurement: Time from PR creation to merge

Automated Test Coverage:
  Current Baseline: 60%
  Target: 85%
  Measurement: Percentage of code covered by tests

Issue Response Time:
  Current Baseline: 24 hours
  Target: 4 hours
  Measurement: Time from issue creation to first response
```

**Quality Metrics**
```yaml
Bug Detection Rate:
  Target: 90% caught before production
  Measurement: Bugs found in review vs production

Code Quality Score:
  Target: Grade A
  Measurement: SonarQube/CodeClimate score

Security Vulnerability Fix Time:
  Target: < 7 days
  Measurement: Time from detection to resolution

False Positive Rate:
  Target: < 10%
  Measurement: Invalid automated findings
```

**Adoption Metrics**
```yaml
AI Agent Usage:
  Target: 80% of PRs reviewed by AI
  Measurement: PRs with AI review / Total PRs

Developer Satisfaction:
  Target: 4.5/5
  Measurement: Quarterly developer survey

Automation Coverage:
  Target: 70% of manual tasks
  Measurement: Automated tasks / Total repetitive tasks

ROI:
  Target: 200% within 6 months
  Measurement: (Time Saved × Hourly Rate) / Investment Cost
```

#### Metrics Dashboard Design

```markdown
## AI Agent Dashboard

### Overview (Top Level)
┌─────────────────────────────────────────┐
│  Active Agents: 6        Status: ✅     │
│  PRs Reviewed: 145       Uptime: 99.9%  │
│  Issues Triaged: 89      Errors: 2      │
└─────────────────────────────────────────┘

### Performance Metrics
┌─────────────────┬─────────────────┐
│ Avg Review Time │  Code Quality   │
│   2.3 hours ↓   │   Grade A ↑     │
│   -42% vs prev  │   +15% vs prev  │
└─────────────────┴─────────────────┘

### Agent Activity (Last 7 Days)
Code Review Agent:    ████████████ 145 PRs
Testing Agent:        ███████      89 tests generated
Documentation Agent:  █████        56 docs updated
Security Agent:       ██████       72 scans
Issue Triage Agent:   ████████     98 issues triaged
Release Agent:        ███          12 releases

### Savings
Time Saved This Month: 127 hours
Cost Savings: $15,240
ROI: 245%
```

#### Implementation Checklist

**Infrastructure Setup**
- [ ] GitHub Apps/Actions configured
- [ ] API tokens and permissions
- [ ] Monitoring infrastructure
- [ ] Alert systems
- [ ] Backup and failover

**Integration Points**
- [ ] CI/CD pipeline integration
- [ ] Issue tracker integration
- [ ] Communication tools (Slack, Teams)
- [ ] Project management tools
- [ ] Analytics platforms

**Documentation**
- [ ] Architecture documentation
- [ ] API documentation
- [ ] User guides
- [ ] Troubleshooting guides
- [ ] Best practices

**Training**
- [ ] Team onboarding materials
- [ ] Video tutorials
- [ ] Hands-on workshops
- [ ] FAQ documentation
- [ ] Support channels

#### Risk Assessment

**Technical Risks**
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI false positives | Medium | High | Human review gate |
| System downtime | High | Low | Redundancy, monitoring |
| Integration failures | Medium | Medium | Comprehensive testing |
| Performance degradation | Low | Medium | Load testing, optimization |

**Organizational Risks**
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Team resistance | High | Medium | Training, clear benefits |
| Over-reliance on AI | Medium | High | Guidelines, human oversight |
| Skill degradation | Medium | Low | Continuous learning programs |
| Privacy concerns | High | Low | Clear policies, compliance |

#### Deliverables
- AI agent integration roadmap
- KPI framework document
- Metrics dashboard design
- Implementation plan
- Risk assessment and mitigation plan
- Training materials

---

### ✅ Define Criteria for Auto PR Review
**Responsible**: PM
**Feature**: General Copilot Usage

#### Details
- Design review criteria
- Define adoption policy
- Plan rollout

#### Preparation
- [ ] Collect code review best practices
- [ ] Define automated check criteria
- [ ] Design escalation rules
- [ ] Plan gradual rollout

#### Auto PR Review Criteria

**Level 1: Automated Checks (Auto-Pass/Fail)**

**Code Quality**
```yaml
Linting:
  - All linting rules pass
  - No warnings allowed
  - Style guide compliance

Complexity:
  - Cyclomatic complexity < 10
  - Function length < 50 lines
  - Max nesting depth: 4

Duplication:
  - No code duplication > 6 lines
  - DRY principle violations: 0
```

**Testing**
```yaml
Test Coverage:
  - Overall coverage ≥ 80%
  - New code coverage ≥ 90%
  - No uncovered critical paths

Test Quality:
  - All tests pass
  - No skipped tests
  - Test runtime < 5 minutes
```

**Security**
```yaml
Vulnerabilities:
  - No high/critical vulnerabilities
  - No hardcoded secrets
  - No SQL injection risks

Dependencies:
  - No outdated critical dependencies
  - License compliance check
```

**Level 2: AI-Assisted Review (Suggestions)**

**Code Patterns**
- Detect anti-patterns
- Suggest better algorithms
- Identify performance issues
- Recommend refactoring

**Documentation**
- Missing function documentation
- Incomplete README updates
- Unclear variable names
- Complex logic without comments

**Best Practices**
- Framework-specific patterns
- Language idioms
- Architecture principles
- Team conventions

**Level 3: Human Review Required**

**Required for:**
- Security-sensitive changes
- Architecture modifications
- Public API changes
- Database schema changes
- Configuration changes
- Performance-critical code

**Review Guidelines:**
```markdown
### Human Review Checklist

#### Business Logic
- [ ] Correctly implements requirements
- [ ] Handles edge cases
- [ ] Error handling appropriate
- [ ] Business rules validated

#### Technical Design
- [ ] Follows architecture patterns
- [ ] Appropriate design patterns used
- [ ] Scalability considered
- [ ] Maintainability ensured

#### Quality
- [ ] Code is readable
- [ ] Tests are comprehensive
- [ ] Documentation is clear
- [ ] No obvious bugs

#### Security & Performance
- [ ] Security implications reviewed
- [ ] Performance acceptable
- [ ] Resource usage reasonable
- [ ] Data privacy maintained
```

#### Auto-Review Rules

**Auto-Approve Conditions (All must be true)**
```yaml
conditions:
  automated_checks: ALL_PASSED
  file_changes: < 10 files
  lines_changed: < 200 lines
  no_security_files: true
  no_config_changes: true
  ai_confidence: > 95%
  test_coverage: > 90%
  no_breaking_changes: true
  author_reputation: trusted
```

**Auto-Request-Changes Conditions (Any is true)**
```yaml
conditions:
  linting_failed: true
  tests_failed: true
  coverage_below_threshold: true
  security_issues_found: true
  secrets_detected: true
  complexity_too_high: true
  merge_conflicts: true
```

**Auto-Comment Conditions**
```yaml
provide_suggestions_for:
  - Code smells detected
  - Performance concerns
  - Documentation gaps
  - Test improvements
  - Refactoring opportunities
  - Best practice violations
```

#### Adoption Policy

**Phase 1: Observation Mode (Week 1-2)**
```markdown
- AI reviews PRs but doesn't block
- Developers can see AI comments
- Collect feedback and metrics
- Tune thresholds and rules
```

**Phase 2: Advisory Mode (Week 3-4)**
```markdown
- AI provides suggestions
- Flags issues for human review
- Auto-approve simple changes
- Manual approval for complex changes
```

**Phase 3: Enforcement Mode (Week 5+)**
```markdown
- AI can block PRs for violations
- Auto-approve trusted changes
- Mandatory checks enforced
- Human review for exceptions
```

#### Rollout Strategy

**Step 1: Pilot Team (Day 1-7)**
```markdown
Scope:
- Single small team
- Non-critical repository
- High-engagement developers

Goals:
- Validate configuration
- Collect initial feedback
- Identify issues
- Refine rules

Success Criteria:
- 80% satisfaction rate
- < 5% false positives
- Time savings measurable
```

**Step 2: Expand to Department (Day 8-21)**
```markdown
Scope:
- Multiple teams
- Mix of repositories
- Various project types

Goals:
- Test scalability
- Handle diverse use cases
- Refine team-specific rules
- Build confidence

Success Criteria:
- 75% adoption rate
- Positive ROI
- Minimal disruption
```

**Step 3: Organization-Wide (Day 22+)**
```markdown
Scope:
- All teams
- All repositories
- Full feature set

Goals:
- Achieve full automation
- Continuous improvement
- Knowledge sharing
- Best practice standardization

Success Criteria:
- 90% adoption rate
- Sustained time savings
- High satisfaction
- Clear ROI
```

#### Feedback Collection

**Weekly Developer Survey**
```markdown
## Auto PR Review Feedback

1. How satisfied are you with auto-review? (1-5)
2. Were suggestions helpful? (Yes/No/Sometimes)
3. Any false positives? (If yes, please describe)
4. Time saved per PR? (estimate in minutes)
5. What would you improve?

Overall Experience: ★★★★☆
```

**Metrics to Monitor**
- Review time reduction
- False positive rate
- Developer satisfaction
- Adoption rate
- Time to merge
- Code quality trends

#### Exception Handling

**When to Bypass Auto-Review**
```markdown
Valid Reasons:
- Emergency hotfix
- Experimental feature
- Documentation-only change
- Configuration testing

Process:
1. Add label: skip-auto-review
2. Provide justification
3. Require senior approval
4. Document in PR description
```

#### Deliverables
- Auto PR review criteria document
- Adoption policy
- Rollout plan
- Feedback collection system
- Exception handling procedures
- Training materials

---

### 🔗 Connect Actions with Internal APIs/Services
**Responsible**: Developer
**Feature**: GitHub Actions / Workflow Automation

#### Details
- Integrate with notification systems
- Connect logging and monitoring systems
- Test integration

#### Preparation
- [ ] Collect API endpoints to integrate
- [ ] Request credentials and permissions
- [ ] Study API documentation
- [ ] Plan error handling

#### Integration Points

**1. Notification Services**

**Slack Integration**
```yaml
name: Slack Notifications

on:
  pull_request:
    types: [opened, closed, reopened]
  issues:
    types: [opened, closed]
  workflow_run:
    workflows: ["CI"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Send Slack notification
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "channel": "#engineering",
            "username": "GitHub Bot",
            "icon_emoji": ":github:",
            "attachments": [{
              "color": "${{ job.status == 'success' && 'good' || 'danger' }}",
              "title": "${{ github.event.repository.name }}",
              "title_link": "${{ github.event.pull_request.html_url }}",
              "text": "${{ github.event.pull_request.title }}",
              "fields": [
                {
                  "title": "Author",
                  "value": "${{ github.actor }}",
                  "short": true
                },
                {
                  "title": "Status",
                  "value": "${{ job.status }}",
                  "short": true
                }
              ]
            }]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Microsoft Teams Integration**
```yaml
- name: Notify Teams
  run: |
    curl -H 'Content-Type: application/json' \
      -d '{
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0078D7",
        "summary": "Pull Request Update",
        "sections": [{
          "activityTitle": "New Pull Request",
          "activitySubtitle": "${{ github.repository }}",
          "activityImage": "${{ github.actor.avatar_url }}",
          "facts": [{
            "name": "Author",
            "value": "${{ github.actor }}"
          }, {
            "name": "Status",
            "value": "Opened"
          }],
          "markdown": true
        }]
      }' \
      ${{ secrets.TEAMS_WEBHOOK_URL }}
```

**Email Notifications**
```yaml
- name: Send Email
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.company.com
    server_port: 587
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
    subject: "[GitHub] ${{ github.repository }} - ${{ github.event_name }}"
    body: |
      Repository: ${{ github.repository }}
      Event: ${{ github.event_name }}
      Actor: ${{ github.actor }}

      ${{ github.event.pull_request.body || github.event.issue.body }}
    to: team@company.com
    from: github-bot@company.com
```

**2. Logging Services**

**Splunk Integration**
```yaml
- name: Send logs to Splunk
  run: |
    curl -k https://splunk.company.com:8088/services/collector \
      -H "Authorization: Splunk ${{ secrets.SPLUNK_TOKEN }}" \
      -d '{
        "event": {
          "repository": "${{ github.repository }}",
          "workflow": "${{ github.workflow }}",
          "run_id": "${{ github.run_id }}",
          "actor": "${{ github.actor }}",
          "event": "${{ github.event_name }}",
          "status": "${{ job.status }}",
          "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
        },
        "sourcetype": "github_actions",
        "index": "github"
      }'
```

**ELK Stack Integration**
```yaml
- name: Send to Elasticsearch
  run: |
    curl -X POST "https://elk.company.com:9200/github-actions/_doc" \
      -H "Content-Type: application/json" \
      -u "${{ secrets.ELK_USERNAME }}:${{ secrets.ELK_PASSWORD }}" \
      -d '{
        "@timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "repository": "${{ github.repository }}",
        "workflow": "${{ github.workflow }}",
        "run_id": "${{ github.run_id }}",
        "actor": "${{ github.actor }}",
        "event": "${{ github.event_name }}",
        "status": "${{ job.status }}"
      }'
```

**3. Monitoring Services**

**Datadog Integration**
```yaml
- name: Send metrics to Datadog
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/series" \
      -H "Content-Type: application/json" \
      -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
      -d '{
        "series": [{
          "metric": "github.actions.workflow",
          "type": "count",
          "points": [['$(date +%s)', 1]],
          "tags": [
            "repository:${{ github.repository }}",
            "workflow:${{ github.workflow }}",
            "status:${{ job.status }}"
          ]
        }]
      }'

- name: Send event to Datadog
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/events" \
      -H "Content-Type: application/json" \
      -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
      -d '{
        "title": "GitHub Actions: ${{ github.workflow }}",
        "text": "Workflow completed with status: ${{ job.status }}",
        "tags": ["github", "actions"],
        "alert_type": "${{ job.status == '\''success'\'' && '\''success'\'' || '\''error'\''}}"
      }'
```

**New Relic Integration**
```yaml
- name: Send to New Relic
  run: |
    curl -X POST "https://insights-collector.newrelic.com/v1/accounts/${{ secrets.NEWRELIC_ACCOUNT_ID }}/events" \
      -H "Content-Type: application/json" \
      -H "X-Insert-Key: ${{ secrets.NEWRELIC_INSERT_KEY }}" \
      -d '[{
        "eventType": "GitHubAction",
        "repository": "${{ github.repository }}",
        "workflow": "${{ github.workflow }}",
        "runId": "${{ github.run_id }}",
        "actor": "${{ github.actor }}",
        "status": "${{ job.status }}",
        "timestamp": '$(date +%s)'
      }]'
```

**4. Issue Tracking Integration**

**Jira Integration**
```yaml
- name: Create Jira ticket on failure
  if: failure()
  run: |
    curl -X POST "https://jira.company.com/rest/api/2/issue" \
      -H "Content-Type: application/json" \
      -u "${{ secrets.JIRA_USERNAME }}:${{ secrets.JIRA_API_TOKEN }}" \
      -d '{
        "fields": {
          "project": {"key": "DEVOPS"},
          "summary": "GitHub Actions Failure: ${{ github.workflow }}",
          "description": "Workflow ${{ github.workflow }} failed in ${{ github.repository }}\\n\\nRun: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\\n\\nActor: ${{ github.actor }}",
          "issuetype": {"name": "Bug"},
          "priority": {"name": "High"},
          "labels": ["github-actions", "automated"]
        }
      }'
```

**ServiceNow Integration**
```yaml
- name: Create ServiceNow incident
  if: failure()
  run: |
    curl -X POST "https://company.service-now.com/api/now/table/incident" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -u "${{ secrets.SERVICENOW_USERNAME }}:${{ secrets.SERVICENOW_PASSWORD }}" \
      -d '{
        "short_description": "GitHub Actions Failure: ${{ github.workflow }}",
        "description": "Workflow failed in ${{ github.repository }}",
        "urgency": "2",
        "impact": "2",
        "assignment_group": "DevOps Team",
        "category": "Software",
        "subcategory": "CI/CD"
      }'
```

**5. Cloud Services Integration**

**AWS Services**
```yaml
- name: Trigger AWS Lambda
  run: |
    aws lambda invoke \
      --function-name github-webhook-handler \
      --payload '{
        "repository": "${{ github.repository }}",
        "workflow": "${{ github.workflow }}",
        "status": "${{ job.status }}"
      }' \
      response.json
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: ap-southeast-1

- name: Send to AWS SNS
  run: |
    aws sns publish \
      --topic-arn ${{ secrets.AWS_SNS_TOPIC_ARN }} \
      --subject "GitHub Actions: ${{ github.workflow }}" \
      --message "Workflow ${{ github.workflow }} completed with status: ${{ job.status }}"
```

**Azure Services**
```yaml
- name: Trigger Azure Function
  run: |
    curl -X POST "${{ secrets.AZURE_FUNCTION_URL }}" \
      -H "Content-Type: application/json" \
      -H "x-functions-key: ${{ secrets.AZURE_FUNCTION_KEY }}" \
      -d '{
        "repository": "${{ github.repository }}",
        "workflow": "${{ github.workflow }}",
        "status": "${{ job.status }}"
      }'
```

**6. Custom Internal APIs**

**Deployment Registry API**
```yaml
- name: Register deployment
  run: |
    curl -X POST "https://api.company.com/deployments" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${{ secrets.INTERNAL_API_TOKEN }}" \
      -d '{
        "application": "${{ github.repository }}",
        "version": "${{ github.sha }}",
        "environment": "${{ github.event.inputs.environment }}",
        "deployed_by": "${{ github.actor }}",
        "deployed_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "status": "success"
      }'
```

**Build Artifact Registry**
```yaml
- name: Register build artifact
  run: |
    curl -X POST "https://artifacts.company.com/api/register" \
      -H "Content-Type: application/json" \
      -H "X-API-Key: ${{ secrets.ARTIFACT_API_KEY }}" \
      -d '{
        "name": "${{ github.repository }}",
        "version": "${{ github.ref_name }}",
        "commit": "${{ github.sha }}",
        "build_url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}",
        "artifacts": [
          {
            "type": "docker",
            "location": "registry.company.com/${{ github.repository }}:${{ github.sha }}"
          },
          {
            "type": "npm",
            "location": "npm.company.com/${{ github.repository }}@${{ github.ref_name }}"
          }
        ]
      }'
```

#### Reusable Integration Workflow

```yaml
# .github/workflows/integrations.yml
name: External Integrations

on:
  workflow_call:
    inputs:
      event_type:
        required: true
        type: string
      status:
        required: true
        type: string
      message:
        required: false
        type: string
    secrets:
      SLACK_WEBHOOK:
        required: true
      API_TOKEN:
        required: true

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Notify Slack
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "${{ inputs.event_type }}: ${{ inputs.message }}",
            "status": "${{ inputs.status }}"
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

    - name: Call Internal API
      run: |
        curl -X POST "https://api.company.com/events" \
          -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
          -d '{
            "type": "${{ inputs.event_type }}",
            "status": "${{ inputs.status }}",
            "message": "${{ inputs.message }}"
          }'

    - name: Log event
      run: |
        echo "${{ inputs.event_type }} completed with status ${{ inputs.status }}"
```

**Usage:**
```yaml
# In another workflow
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy application
      run: ./deploy.sh

  notify:
    needs: deploy
    uses: ./.github/workflows/integrations.yml
    with:
      event_type: "deployment"
      status: ${{ needs.deploy.result }}
      message: "Deployed to production"
    secrets:
      SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL }}
      API_TOKEN: ${{ secrets.INTERNAL_API_TOKEN }}
```

#### Error Handling and Retry Logic

```yaml
- name: Call API with retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 5
    max_attempts: 3
    retry_wait_seconds: 10
    command: |
      curl -f -X POST "https://api.company.com/endpoint" \
        -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
        -d '{"data": "value"}' \
        || exit 1

- name: Handle failure
  if: failure()
  run: |
    echo "Integration failed after retries"
    # Send alert
    curl -X POST "${{ secrets.ALERT_WEBHOOK }}" \
      -d '{"message": "Critical: API integration failed"}'
```

#### Testing Integration

```yaml
name: Test Integrations

on:
  workflow_dispatch:

jobs:
  test-slack:
    runs-on: ubuntu-latest
    steps:
    - name: Test Slack
      run: |
        response=$(curl -s -o /dev/null -w "%{http_code}" \
          -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
          -d '{"text":"Test message"}')
        if [ "$response" != "200" ]; then
          echo "Slack integration failed"
          exit 1
        fi

  test-api:
    runs-on: ubuntu-latest
    steps:
    - name: Test Internal API
      run: |
        response=$(curl -s -w "%{http_code}" \
          -H "Authorization: Bearer ${{ secrets.INTERNAL_API_TOKEN }}" \
          https://api.company.com/health)
        if [ "$response" != "200" ]; then
          echo "API integration failed"
          exit 1
        fi
```

#### Deliverables
- Integration workflows configured
- API connections tested
- Error handling implemented
- Retry logic in place
- Documentation updated
- Monitoring alerts configured

---

### 🔍 Configure Auto PR Review
**Responsible**: Developer
**Feature**: General Copilot Usage

#### Details
- Configure review bots
- Create review rules
- Test automated reviews

#### Preparation
- [ ] Choose auto-review tools
- [ ] Define review rules
- [ ] Configure bot permissions
- [ ] Prepare test cases

#### Auto PR Review Tools

**1. GitHub Actions PR Review Bot**

```yaml
# .github/workflows/pr-review.yml
name: Auto PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  auto-review:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Get PR files
      id: files
      run: |
        echo "changed=$(gh pr view ${{ github.event.pull_request.number }} --json files -q '.files[].path' | tr '\n' ' ')" >> $GITHUB_OUTPUT
      env:
        GH_TOKEN: ${{ github.token }}

    - name: Check file size limits
      run: |
        for file in ${{ steps.files.outputs.changed }}; do
          size=$(wc -c < "$file")
          if [ "$size" -gt 1000000 ]; then
            echo "::error file=$file::File too large (${size} bytes)"
            exit 1
          fi
        done

    - name: Run linter
      run: npm run lint

    - name: Check code complexity
      uses: gr2m/check-code-complexity@v1
      with:
        max-complexity: 10

    - name: Security check
      uses: github/super-linter@v5
      env:
        DEFAULT_BRANCH: main
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Auto-approve if conditions met
      if: success()
      uses: hmarr/auto-approve-action@v3
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}

    - name: Add review comment
      uses: actions/github-script@v7
      with:
        script: |
          const fs = require('fs');
          const { data: reviews } = await github.rest.pulls.listReviews({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.payload.pull_request.number
          });

          // Check if already reviewed
          const botReview = reviews.find(r => r.user.login === 'github-actions[bot]');
          if (botReview) return;

          // Post review
          await github.rest.pulls.createReview({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.payload.pull_request.number,
            event: 'COMMENT',
            body: `## Automated Review Results\n\n✅ All automated checks passed!\n\n- Linting: ✅\n- Tests: ✅\n- Security: ✅\n- Complexity: ✅`
          });
```

**2. Code Review AI Bot**

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Get PR diff
      id: diff
      run: |
        gh pr diff ${{ github.event.pull_request.number }} > pr.diff
      env:
        GH_TOKEN: ${{ github.token }}

    - name: Analyze with AI
      uses: anc95/ChatGPT-CodeReview@main
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      with:
        model: gpt-4
        review_comment_lgtm: true
```

**3. Danger JS Integration**

```yaml
# .github/workflows/danger.yml
name: Danger

on: [pull_request]

jobs:
  danger:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install Danger
      run: npm install -g danger

    - name: Run Danger
      run: danger ci
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Dangerfile.js:**
```javascript
import { danger, warn, fail, message } from 'danger';

// Check PR size
const bigPRThreshold = 500;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR! Consider breaking it down into smaller PRs.');
}

// Check for description
if (danger.github.pr.body.length < 10) {
  fail('Please add a description to your PR.');
}

// Check for tests
const hasAppChanges = danger.git.modified_files.some(f => f.startsWith('src/'));
const hasTestChanges = danger.git.modified_files.some(f => f.includes('test'));

if (hasAppChanges && !hasTestChanges) {
  warn('This PR modifies app code but no tests were added/updated.');
}

// Check for TODO comments
const newTodos = danger.git.modified_files
  .filter(f => f.endsWith('.js') || f.endsWith('.ts'))
  .map(f => danger.github.utils.fileContents(f))
  .filter(contents => contents.includes('TODO'));

if (newTodos.length > 0) {
  warn(`This PR adds ${newTodos.length} TODO comment(s). Please create issues for them.`);
}

// Check for console.log
const filesWithConsole = [];
for (const file of danger.git.modified_files) {
  const contents = await danger.github.utils.fileContents(file);
  if (contents.includes('console.log')) {
    filesWithConsole.push(file);
  }
}

if (filesWithConsole.length > 0) {
  warn(`Found console.log in: ${filesWithConsole.join(', ')}`);
}

// Encourage changelog
const hasChangelog = danger.git.modified_files.includes('CHANGELOG.md');
if (!hasChangelog) {
  message('Consider updating the CHANGELOG.md file.');
}

// Check for breaking changes
if (danger.github.pr.title.includes('[BREAKING]')) {
  fail('⚠️ This PR contains breaking changes! Make sure to update documentation and bump major version.');
}

// Label assignment suggestions
const labels = [];
if (hasTestChanges) labels.push('has-tests');
if (danger.github.pr.additions + danger.github.pr.deletions < 50) labels.push('small-change');
if (filesWithConsole.length > 0) labels.push('needs-cleanup');

if (labels.length > 0) {
  message(`Suggested labels: ${labels.join(', ')}`);
}
```

**4. Custom Review Bot**

```yaml
# .github/workflows/custom-review-bot.yml
name: Custom Review Bot

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Run custom review script
      uses: actions/github-script@v7
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const { owner, repo } = context.repo;
          const pull_number = context.payload.pull_request.number;

          // Get PR files
          const { data: files } = await github.rest.pulls.listFiles({
            owner,
            repo,
            pull_number
          });

          let comments = [];
          let approveReview = true;

          // Check each file
          for (const file of files) {
            // Check file size
            if (file.changes > 300) {
              comments.push({
                path: file.filename,
                line: 1,
                body: '⚠️ This file has many changes. Consider breaking it into smaller commits.'
              });
            }

            // Check for specific patterns
            if (file.patch) {
              // Check for hardcoded credentials
              if (file.patch.match(/password|secret|api_key/i)) {
                comments.push({
                  path: file.filename,
                  line: 1,
                  body: '🔒 Potential credentials detected. Please review.'
                });
                approveReview = false;
              }

              // Check for TODO comments
              if (file.patch.includes('TODO')) {
                comments.push({
                  path: file.filename,
                  line: 1,
                  body: '📝 TODO found. Consider creating an issue.'
                });
              }

              // Check for console.log
              if (file.patch.includes('console.log')) {
                comments.push({
                  path: file.filename,
                  line: 1,
                  body: '🐛 console.log detected. Remove before merging.'
                });
                approveReview = false;
              }
            }
          }

          // Post review
          if (comments.length > 0) {
            await github.rest.pulls.createReview({
              owner,
              repo,
              pull_number,
              event: approveReview ? 'COMMENT' : 'REQUEST_CHANGES',
              body: `## Automated Review\n\n${comments.length} issue(s) found.`,
              comments: comments
            });
          } else if (files.length < 10 && context.payload.pull_request.additions < 100) {
            // Auto-approve small PRs
            await github.rest.pulls.createReview({
              owner,
              repo,
              pull_number,
              event: 'APPROVE',
              body: '✅ Automated approval for small PR with no issues detected.'
            });
          }
```

**5. Advanced Rules with Reviewdog**

```yaml
name: Reviewdog

on: [pull_request]

jobs:
  reviewdog:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - uses: reviewdog/action-eslint@v1
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        reporter: github-pr-review
        eslint_flags: 'src/**/*.js'

    - uses: reviewdog/action-shellcheck@v1
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        reporter: github-pr-review

    - uses: reviewdog/action-markdownlint@v0
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        reporter: github-pr-review
```

#### Review Rules Configuration

```javascript
// .github/review-rules.js
module.exports = {
  rules: [
    {
      name: 'size-check',
      condition: (pr) => pr.additions + pr.deletions > 500,
      action: 'warn',
      message: 'PR is large. Consider splitting into smaller PRs.'
    },
    {
      name: 'test-required',
      condition: (pr, files) => {
        const hasCodeChanges = files.some(f => f.startsWith('src/'));
        const hasTestChanges = files.some(f => f.includes('test'));
        return hasCodeChanges && !hasTestChanges;
      },
      action: 'request_changes',
      message: 'Tests required for code changes.'
    },
    {
      name: 'security-review',
      condition: (pr, files) => {
        return files.some(f =>
          f.includes('auth') ||
          f.includes('security') ||
          f.includes('crypto')
        );
      },
      action: 'request_manual_review',
      reviewers: ['security-team'],
      message: 'Security-sensitive changes require manual review.'
    },
    {
      name: 'breaking-changes',
      condition: (pr) => pr.title.includes('[BREAKING]'),
      action: 'request_manual_review',
      reviewers: ['tech-leads'],
      labels: ['breaking-change'],
      message: 'Breaking changes require tech lead approval.'
    },
    {
      name: 'auto-approve-docs',
      condition: (pr, files) => {
        return files.every(f =>
          f.endsWith('.md') ||
          f.startsWith('docs/')
        ) && pr.additions + pr.deletions < 100;
      },
      action: 'approve',
      message: 'Auto-approved documentation changes.'
    }
  ]
};
```

#### Auto-Merge Configuration

```yaml
# .github/workflows/auto-merge.yml
name: Auto Merge

on:
  pull_request:
    types: [labeled, unlabeled, synchronize, opened, reopened, ready_for_review]
  pull_request_review:
    types: [submitted]
  check_suite:
    types: [completed]
  status: {}

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    steps:
    - name: Auto merge
      uses: pascalgn/automerge-action@v0.15.6
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        MERGE_LABELS: "automerge,!work-in-progress"
        MERGE_REMOVE_LABELS: "automerge"
        MERGE_METHOD: "squash"
        MERGE_COMMIT_MESSAGE: "pull-request-title"
        MERGE_FORKS: "false"
        MERGE_RETRIES: "6"
        MERGE_RETRY_SLEEP: "10000"
        UPDATE_LABELS: "automerge"
        UPDATE_METHOD: "rebase"
```

#### Monitoring Auto Reviews

```javascript
// scripts/review-stats.js
const { Octokit } = require('@octokit/rest');

async function getReviewStats() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const { data: prs } = await octokit.rest.pulls.list({
    owner: 'your-org',
    repo: 'your-repo',
    state: 'closed',
    per_page: 100
  });

  const stats = {
    total: prs.length,
    autoApproved: 0,
    autoRequestedChanges: 0,
    manualReview: 0,
    avgTimeToReview: 0
  };

  for (const pr of prs) {
    const { data: reviews } = await octokit.rest.pulls.listReviews({
      owner: 'your-org',
      repo: 'your-repo',
      pull_number: pr.number
    });

    const botReview = reviews.find(r => r.user.type === 'Bot');
    if (botReview) {
      if (botReview.state === 'APPROVED') stats.autoApproved++;
      if (botReview.state === 'CHANGES_REQUESTED') stats.autoRequestedChanges++;
    } else {
      stats.manualReview++;
    }
  }

  console.log('Auto Review Statistics:');
  console.log(`Total PRs: ${stats.total}`);
  console.log(`Auto Approved: ${stats.autoApproved} (${(stats.autoApproved/stats.total*100).toFixed(1)}%)`);
  console.log(`Auto Requested Changes: ${stats.autoRequestedChanges} (${(stats.autoRequestedChanges/stats.total*100).toFixed(1)}%)`);
  console.log(`Manual Review: ${stats.manualReview} (${(stats.manualReview/stats.total*100).toFixed(1)}%)`);
}

getReviewStats();
```

#### Deliverables
- Auto PR review workflows configured
- Review bots deployed
- Review rules documented
- Auto-merge setup (where appropriate)
- Monitoring dashboard
- Team training completed

---

### 📊 Add Logging and Monitoring After Deployment
**Responsible**: Developer
**Feature**: Copilot Test Generation / GitHub Actions

#### Details
- Configure post-deployment monitoring
- Create automated notifications
- Test alert system

#### Preparation
- [ ] Define metrics to monitor
- [ ] Choose monitoring tools
- [ ] Design alert rules
- [ ] Plan incident response

#### Post-Deployment Monitoring Workflow

```yaml
# .github/workflows/post-deploy-monitor.yml
name: Post-Deployment Monitoring

on:
  workflow_run:
    workflows: ["Deploy to Production"]
    types: [completed]

jobs:
  monitor:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
    - name: Wait for deployment to stabilize
      run: sleep 60

    - name: Health Check
      id: health
      run: |
        response=$(curl -s -o /dev/null -w "%{http_code}" https://api.company.com/health)
        if [ "$response" != "200" ]; then
          echo "health=failed" >> $GITHUB_OUTPUT
          exit 1
        else
          echo "health=passed" >> $GITHUB_OUTPUT
        fi

    - name: Check Response Time
      id: perf
      run: |
        time=$(curl -o /dev/null -s -w '%{time_total}\n' https://api.company.com)
        echo "response_time=$time" >> $GITHUB_OUTPUT
        if (( $(echo "$time > 2.0" | bc -l) )); then
          echo "⚠️ Response time is high: ${time}s"
          exit 1
        fi

    - name: Check Error Rate
      id: errors
      run: |
        # Query monitoring system for error rate
        error_rate=$(curl -s "https://monitoring.company.com/api/error-rate?minutes=5" | jq '.rate')
        echo "error_rate=$error_rate" >> $GITHUB_OUTPUT

        if (( $(echo "$error_rate > 0.01" | bc -l) )); then
          echo "⚠️ Error rate is high: ${error_rate}%"
          exit 1
        fi

    - name: Smoke Tests
      run: |
        # Run critical path tests
        npm run test:smoke

    - name: Verify Key Features
      run: |
        # Test critical endpoints
        curl -f https://api.company.com/api/users || exit 1
        curl -f https://api.company.com/api/products || exit 1

    - name: Check Database Connections
      run: |
        response=$(curl -s https://api.company.com/api/health/database)
        status=$(echo $response | jq -r '.status')
        if [ "$status" != "healthy" ]; then
          echo "Database connection failed"
          exit 1
        fi

    - name: Verify External Integrations
      run: |
        # Check third-party services
        for service in payment email sms; do
          status=$(curl -s "https://api.company.com/api/health/$service" | jq -r '.status')
          if [ "$status" != "healthy" ]; then
            echo "Service $service is unhealthy"
            exit 1
          fi
        done

    - name: Deployment Success Notification
      if: success()
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "✅ Production Deployment Successful",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Production Deployment Successful*\n\n• Health Check: ✅\n• Response Time: ${{ steps.perf.outputs.response_time }}s\n• Error Rate: ${{ steps.errors.outputs.error_rate}}%\n• All Systems: Operational"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

    - name: Rollback on Failure
      if: failure()
      run: |
        echo "Deployment validation failed, initiating rollback..."
        curl -X POST "https://api.company.com/api/deploy/rollback" \
          -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}"

    - name: Failure Notification
      if: failure()
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "🚨 Production Deployment Issues Detected",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Production Deployment Issues*\n\n❌ Health checks failed\n🔄 Rollback initiated\n\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Details>"
                }
              }
            ]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_ALERT_WEBHOOK }}

    - name: Create Incident
      if: failure()
      run: |
        curl -X POST "https://api.pagerduty.com/incidents" \
          -H "Authorization: Token token=${{ secrets.PAGERDUTY_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{
            "incident": {
              "type": "incident",
              "title": "Production Deployment Failed",
              "service": {
                "id": "${{ secrets.PAGERDUTY_SERVICE_ID }}",
                "type": "service_reference"
              },
              "urgency": "high",
              "body": {
                "type": "incident_body",
                "details": "Deployment to production failed health checks"
              }
            }
          }'
```

#### Continuous Monitoring Setup

```yaml
# .github/workflows/continuous-monitoring.yml
name: Continuous Monitoring

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
    - name: Check Production Health
      run: |
        endpoints=(
          "https://api.company.com/health"
          "https://api.company.com/api/status"
          "https://app.company.com"
        )

        failed=()
        for endpoint in "${endpoints[@]}"; do
          response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
          if [ "$response" != "200" ]; then
            failed+=("$endpoint")
          fi
        done

        if [ ${#failed[@]} -gt 0 ]; then
          echo "Failed endpoints: ${failed[*]}"
          exit 1
        fi

    - name: Check Performance Metrics
      run: |
        # Get metrics from monitoring system
        metrics=$(curl -s "https://monitoring.company.com/api/metrics" \
          -H "Authorization: Bearer ${{ secrets.MONITORING_TOKEN }}")

        cpu=$(echo $metrics | jq '.cpu_usage')
        memory=$(echo $metrics | jq '.memory_usage')

        if (( $(echo "$cpu > 80" | bc -l) )); then
          echo "⚠️ High CPU usage: ${cpu}%"
          # Send alert but don't fail
        fi

        if (( $(echo "$memory > 85" | bc -l) )); then
          echo "⚠️ High memory usage: ${memory}%"
        fi

    - name: Check Error Logs
      run: |
        # Query logs for errors in last 5 minutes
        errors=$(curl -s "https://logs.company.com/api/query" \
          -d '{"query":"level:error","time":"5m"}' | jq '.count')

        if [ "$errors" -gt 100 ]; then
          echo "🚨 High error rate detected: $errors errors"
          exit 1
        fi

    - name: Alert on Failure
      if: failure()
      run: |
        curl -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
          -H "Content-Type: application/json" \
          -d '{
            "text": "🚨 Production monitoring alert",
            "attachments": [{
              "color": "danger",
              "title": "Service Health Check Failed",
              "text": "One or more health checks failed",
              "ts": '$(date +%s)'
            }]
          }'
```

#### Application Performance Monitoring (APM)

```yaml
# Configure APM in deployment
- name: Enable APM
  run: |
    # New Relic
    export NEW_RELIC_APP_NAME="MyApp-Production"
    export NEW_RELIC_LICENSE_KEY="${{ secrets.NEW_RELIC_LICENSE }}"

    # Datadog
    export DD_SERVICE="myapp"
    export DD_ENV="production"
    export DD_VERSION="${{ github.sha }}"
    export DD_API_KEY="${{ secrets.DATADOG_API_KEY }}"

    # Deploy with APM enabled
    ./deploy.sh

- name: Verify APM Data
  run: |
    sleep 30  # Wait for initial data

    # Check if APM is receiving data
    response=$(curl -s "https://api.newrelic.com/v2/applications.json" \
      -H "X-Api-Key: ${{ secrets.NEW_RELIC_API_KEY }}")

    reporting=$(echo $response | jq -r '.applications[0].reporting')
    if [ "$reporting" != "true" ]; then
      echo "⚠️ APM not receiving data"
    fi
```

#### Log Aggregation

```yaml
- name: Setup Log Forwarding
  run: |
    # Configure log shipping to centralized system
    cat > /etc/filebeat/filebeat.yml <<EOF
    filebeat.inputs:
    - type: log
      paths:
        - /var/log/app/*.log
      fields:
        app: myapp
        environment: production
        deployment: ${{ github.sha }}

    output.elasticsearch:
      hosts: ["https://elasticsearch.company.com:9200"]
      username: "${{ secrets.ES_USERNAME }}"
      password: "${{ secrets.ES_PASSWORD }}"
    EOF

    systemctl restart filebeat

- name: Create Log Dashboard Link
  run: |
    dashboard_url="https://kibana.company.com/app/dashboards#/view/production?deployment=${{ github.sha }}"
    echo "📊 Logs Dashboard: $dashboard_url"

    # Post to PR or commit
    gh api repos/${{ github.repository }}/commits/${{ github.sha }}/comments \
      -f body="📊 [View Logs Dashboard]($dashboard_url)"
  env:
    GH_TOKEN: ${{ github.token }}
```

#### Custom Metrics Collection

```javascript
// scripts/collect-metrics.js
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

async function collectDeploymentMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    deployment_id: process.env.GITHUB_SHA,
    repository: process.env.GITHUB_REPOSITORY,
    metrics: {}
  };

  try {
    // Collect health metrics
    const health = await axios.get('https://api.company.com/health');
    metrics.metrics.health_status = health.data.status;
    metrics.metrics.uptime = health.data.uptime;

    // Collect performance metrics
    const perf = await axios.get('https://api.company.com/metrics/performance');
    metrics.metrics.response_time_p50 = perf.data.p50;
    metrics.metrics.response_time_p95 = perf.data.p95;
    metrics.metrics.response_time_p99 = perf.data.p99;

    // Collect business metrics
    const business = await axios.get('https://api.company.com/metrics/business');
    metrics.metrics.active_users = business.data.active_users;
    metrics.metrics.requests_per_minute = business.data.rpm;
    metrics.metrics.error_rate = business.data.error_rate;

    // Store metrics
    await axios.post('https://metrics.company.com/api/store', metrics, {
      headers: {
        'Authorization': `Bearer ${process.env.METRICS_TOKEN}`
      }
    });

    console.log('✅ Metrics collected successfully');
    console.log(JSON.stringify(metrics, null, 2));

    // Check thresholds
    if (metrics.metrics.error_rate > 0.01) {
      console.error('❌ Error rate above threshold');
      process.exit(1);
    }

    if (metrics.metrics.response_time_p95 > 2000) {
      console.error('❌ Response time above threshold');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Failed to collect metrics:', error.message);
    process.exit(1);
  }
}

collectDeploymentMetrics();
```

#### Alerting Rules

```yaml
# alerting-rules.yml
rules:
  - name: HighErrorRate
    condition: error_rate > 0.01
    severity: critical
    notification:
      - slack: "#production-alerts"
      - pagerduty: "on-call-team"
      - email: "ops@company.com"
    message: "Error rate is above 1%"

  - name: SlowResponse
    condition: response_time_p95 > 2000
    severity: warning
    notification:
      - slack: "#performance"
    message: "95th percentile response time above 2s"

  - name: HighCPU
    condition: cpu_usage > 80
    duration: 5m
    severity: warning
    notification:
      - slack: "#infrastructure"
    message: "CPU usage above 80% for 5 minutes"

  - name: ServiceDown
    condition: health_status != "healthy"
    severity: critical
    notification:
      - slack: "#production-alerts"
      - pagerduty: "on-call-team"
      - sms: "+1234567890"
    message: "Service health check failed"

  - name: DeploymentFailed
    condition: deployment_status == "failed"
    severity: high
    notification:
      - slack: "#deployments"
      - email: "devops@company.com"
    message: "Deployment to production failed"
```

#### Dashboards

**Grafana Dashboard Configuration:**
```json
{
  "dashboard": {
    "title": "Production Deployment Monitoring",
    "panels": [
      {
        "title": "Deployment Timeline",
        "type": "graph",
        "targets": [{
          "expr": "deployment_events{environment='production'}"
        }]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [{
          "expr": "rate(http_errors_total[5m])"
        }],
        "alert": {
          "conditions": [{
            "evaluator": {
              "params": [0.01],
              "type": "gt"
            }
          }]
        }
      },
      {
        "title": "Response Time (P95)",
        "type": "graph",
        "targets": [{
          "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
        }]
      },
      {
        "title": "Active Requests",
        "type": "stat",
        "targets": [{
          "expr": "http_requests_in_flight"
        }]
      }
    ]
  }
}
```

#### Deliverables
- Post-deployment monitoring workflows
- Continuous health check automation
- APM integration
- Log aggregation setup
- Custom metrics collection
- Alerting rules configured
- Monitoring dashboards
- Runbooks for common issues

---

### 🧪 Create Test Scenarios for Agent/Automation Features
**Responsible**: QA
**Feature**: Copilot Test Generation / GitHub Actions

[Content continues in next part due to length...]

#### Details
- Design test cases for AI agents
- Test automation workflows
- Validate bot behaviors

#### Preparation
- [ ] Collect automation features list
- [ ] Define expected behaviors
- [ ] Prepare test data
- [ ] Plan validation criteria

#### Test Scenarios for AI Agents

**1. Code Review Agent Tests**

```javascript
describe('Code Review Agent', () => {
  it('should detect code quality issues', async () => {
    const pr = await createTestPR({
      files: [{
        name: 'test.js',
        content: `
          function veryLongFunctionNameThatViolatesNamingConvention() {
            var x = 1;  // Should use const/let
            for(var i=0;i<100;i++){  // Bad formatting
              console.log(i);  // console.log in production code
            }
          }
        `
      }]
    });

    const review = await waitForBotReview(pr.number);

    expect(review.comments).toContainEqual(
      expect.objectContaining({
        body: expect.stringContaining('naming convention')
      })
    );
    expect(review.comments).toContainEqual(
      expect.objectContaining({
        body: expect.stringContaining('console.log')
      })
    );
  });

  it('should approve simple documentation changes', async () => {
    const pr = await createTestPR({
      files: [{
        name: 'README.md',
        content: '# Updated documentation\n\nMinor typo fixes.'
      }]
    });

    const review = await waitForBotReview(pr.number);
    expect(review.state).toBe('APPROVED');
  });

  it('should request human review for security changes', async () => {
    const pr = await createTestPR({
      files: [{
        name: 'src/auth/login.js',
        content: 'function authenticate(user, password) { /* ... */ }'
      }]
    });

    const review = await waitForBotReview(pr.number);
    expect(review.body).toContain('security');
    expect(pr.requested_reviewers).toContain('security-team');
  });
});
```

**2. Auto-Labeling Agent Tests**

```javascript
describe('Auto-Labeling Agent', () => {
  it('should label PRs based on file changes', async () => {
    const pr = await createTestPR({
      files: [
        { name: 'src/frontend/App.jsx', content: '...' },
        { name: 'src/frontend/styles.css', content: '...' }
      ]
    });

    await waitForLabels(pr.number);
    const labels = await getPRLabels(pr.number);

    expect(labels).toContain('frontend');
    expect(labels).not.toContain('backend');
  });

  it('should add size labels', async () => {
    const largePR = await createTestPR({
      additions: 600,
      deletions: 200
    });

    await waitForLabels(largePR.number);
    const labels = await getPRLabels(largePR.number);

    expect(labels).toContain('size/large');
  });

  it('should detect breaking changes from title', async () => {
    const pr = await createTestPR({
      title: '[BREAKING] Remove deprecated API'
    });

    await waitForLabels(pr.number);
    const labels = await getPRLabels(pr.number);

    expect(labels).toContain('breaking-change');
  });
});
```

**3. Issue Triage Agent Tests**

```javascript
describe('Issue Triage Agent', () => {
  it('should auto-assign issues based on labels', async () => {
    const issue = await createTestIssue({
      title: 'Bug in user authentication',
      labels: ['bug', 'authentication']
    });

    await waitForAssignment(issue.number);
    const assignees = await getIssueAssignees(issue.number);

    expect(assignees).toContain('auth-team');
  });

  it('should detect and link duplicate issues', async () => {
    const issue1 = await createTestIssue({
      title: 'Login page not loading',
      body: 'The login page shows a white screen'
    });

    const issue2 = await createTestIssue({
      title: 'Cannot access login',
      body: 'Login page is blank'
    });

    await waitForDuplicateDetection(issue2.number);
    const comments = await getIssueComments(issue2.number);

    expect(comments).toContainEqual(
      expect.objectContaining({
        body: expect.stringContaining(`duplicate of #${issue1.number}`)
      })
    );
  });

  it('should prioritize critical bugs', async () => {
    const issue = await createTestIssue({
      title: 'Production server down',
      body: 'All users unable to access the application'
    });

    await waitForLabels(issue.number);
    const labels = await getIssueLabels(issue.number);

    expect(labels).toContain('priority: critical');
  });
});
```

**4. Documentation Agent Tests**

```javascript
describe('Documentation Agent', () => {
  it('should generate API documentation from code', async () => {
    const pr = await createTestPR({
      files: [{
        name: 'src/api/users.js',
        content: `
          /**
           * Create a new user
           */
          export async function createUser(data) {
            // Implementation
          }
        `
      }]
    });

    await waitForDocGeneration(pr.number);
    const files = await getPRFiles(pr.number);

    expect(files).toContainEqual(
      expect.objectContaining({
        filename: 'docs/api/users.md'
      })
    );
  });

  it('should update changelog automatically', async () => {
    const pr = await createTestPR({
      title: 'feat: Add user export feature',
      labels: ['feature']
    });

    await mergePR(pr.number);
    await waitForChangelogUpdate();

    const changelog = await readFile('CHANGELOG.md');
    expect(changelog).toContain('Add user export feature');
  });
});
```

**5. Auto-Merge Agent Tests**

```javascript
describe('Auto-Merge Agent', () => {
  it('should auto-merge when conditions are met', async () => {
    const pr = await createTestPR({
      title: 'chore: Update dependencies',
      labels: ['automerge'],
      author: 'dependabot[bot]'
    });

    // Wait for checks to pass
    await waitForChecks(pr.number);

    // Wait for reviews
    await approvePR(pr.number, 'tech-lead');

    // Wait for auto-merge
    await sleep(10000);

    const prStatus = await getPRStatus(pr.number);
    expect(prStatus.merged).toBe(true);
  });

  it('should not auto-merge without required approvals', async () => {
    const pr = await createTestPR({
      labels: ['automerge']
    });

    await waitForChecks(pr.number);
    await sleep(30000);  // Wait longer than usual merge time

    const prStatus = await getPRStatus(pr.number);
    expect(prStatus.merged).toBe(false);
  });

  it('should not auto-merge if checks fail', async () => {
    const pr = await createTestPR({
      labels: ['automerge'],
      files: [{
        name: 'test.js',
        content: 'const x = ;'  // Syntax error
      }]
    });

    await approvePR(pr.number, 'tech-lead');
    await waitForChecks(pr.number);

    const prStatus = await getPRStatus(pr.number);
    expect(prStatus.merged).toBe(false);
  });
});
```

#### End-to-End Automation Tests

```javascript
describe('Complete Automation Flow', () => {
  it('should handle full PR lifecycle automatically', async () => {
    // 1. Create PR
    const pr = await createTestPR({
      title: 'feat: Add new feature',
      files: [{
        name: 'src/feature.js',
        content: validFeatureCode
      }, {
        name: 'src/feature.test.js',
        content: validTestCode
      }]
    });

    // 2. Verify auto-labeling
    await waitForLabels(pr.number);
    const labels = await getPRLabels(pr.number);
    expect(labels).toContain('feature');
    expect(labels).toContain('has-tests');

    // 3. Wait for CI/CD
    await waitForChecks(pr.number);
    const checks = await getChecks(pr.number);
    expect(checks.every(c => c.conclusion === 'success')).toBe(true);

    // 4. Verify auto-review
    await waitForBotReview(pr.number);
    const review = await getLatestBotReview(pr.number);
    expect(review.state).toBe('APPROVED');

    // 5. Manual approval
    await approvePR(pr.number, 'tech-lead');

    // 6. Auto-merge
    await waitForMerge(pr.number);
    const prStatus = await getPRStatus(pr.number);
    expect(prStatus.merged).toBe(true);

    // 7. Verify post-merge actions
    await sleep(5000);
    const changelog = await readFile('CHANGELOG.md');
    expect(changelog).toContain('Add new feature');

    // 8. Check deployment
    await waitForDeployment();
    const deploymentStatus = await getDeploymentStatus('staging');
    expect(deploymentStatus.state).toBe('success');
  });
});
```

#### Performance Tests

```javascript
describe('Agent Performance', () => {
  it('should process PRs within acceptable time', async () => {
    const startTime = Date.now();

    const pr = await createTestPR({
      files: [{ name: 'test.js', content: '...' }]
    });

    await waitForBotReview(pr.number);

    const processingTime = Date.now() - startTime;
    expect(processingTime).toBeLessThan(30000);  // 30 seconds
  });

  it('should handle multiple PRs concurrently', async () => {
    const prs = await Promise.all([
      createTestPR({ title: 'PR 1' }),
      createTestPR({ title: 'PR 2' }),
      createTestPR({ title: 'PR 3' }),
      createTestPR({ title: 'PR 4' }),
      createTestPR({ title: 'PR 5' })
    ]);

    const reviews = await Promise.all(
      prs.map(pr => waitForBotReview(pr.number))
    );

    expect(reviews.every(r => r !== null)).toBe(true);
  });
});
```

#### Error Handling Tests

```javascript
describe('Agent Error Handling', () => {
  it('should handle API rate limits gracefully', async () => {
    // Create many PRs to trigger rate limit
    const prs = [];
    for (let i = 0; i < 100; i++) {
      prs.push(await createTestPR({ title: `PR ${i}` }));
    }

    // All should eventually get processed
    for (const pr of prs) {
      const review = await waitForBotReview(pr.number, 60000);
      expect(review).not.toBeNull();
    }
  });

  it('should retry on temporary failures', async () => {
    // Mock API failure
    mockAPIFailure('/repos/.../pulls/1/reviews', { times: 2 });

    const pr = await createTestPR();
    const review = await waitForBotReview(pr.number);

    expect(review).not.toBeNull();
    expect(getAPICallCount()).toBeGreaterThan(1);  // Retried
  });

  it('should log errors for debugging', async () => {
    const pr = await createTestPR({
      files: [{ name: 'invalid', content: null }]  // Cause error
    });

    await waitForBotAttempt(pr.number);

    const logs = await getAgentLogs();
    expect(logs).toContainEqual(
      expect.objectContaining({
        level: 'error',
        pr_number: pr.number
      })
    );
  });
});
```

#### Test Utilities

```javascript
// test/helpers/github-helpers.js
async function createTestPR(options = {}) {
  const { title, files, labels, ...rest } = options;

  // Create branch
  const branch = `test-${Date.now()}`;
  await createBranch(branch);

  // Add files
  if (files) {
    for (const file of files) {
      await commitFile(branch, file.name, file.content);
    }
  }

  // Create PR
  const pr = await github.pulls.create({
    owner,
    repo,
    title: title || 'Test PR',
    head: branch,
    base: 'main',
    ...rest
  });

  // Add labels
  if (labels) {
    await github.issues.addLabels({
      owner,
      repo,
      issue_number: pr.data.number,
      labels
    });
  }

  return pr.data;
}

async function waitForBotReview(prNumber, timeout = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const { data: reviews } = await github.pulls.listReviews({
      owner,
      repo,
      pull_number: prNumber
    });

    const botReview = reviews.find(r => r.user.type === 'Bot');
    if (botReview) return botReview;

    await sleep(1000);
  }

  throw new Error(`Bot review not found within ${timeout}ms`);
}

async function waitForLabels(prNumber) {
  // Implementation
}

async function waitForChecks(prNumber) {
  // Implementation
}
```

#### CI/CD Integration for Agent Tests

```yaml
# .github/workflows/test-agents.yml
name: Test Automation Agents

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  test-agents:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Run agent tests
      run: npm run test:agents
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        TEST_REPO: ${{ github.repository }}

    - name: Generate report
      if: always()
      run: npm run test:report

    - name: Upload results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: agent-test-results
        path: test-results/

    - name: Notify on failure
      if: failure()
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "🤖 Agent tests failed",
            "blocks": [{
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Automation agent tests failed. <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Results>"
              }
            }]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### Deliverables
- Comprehensive agent test suite
- Automation workflow tests
- Performance tests
- Error handling tests
- Test utilities and helpers
- CI/CD integration for agent testing
- Test reports and documentation

---

### ✅ Test Alerting/Monitoring and Quality After Release
**Responsible**: QA
**Feature**: Copilot Test Generation / GitHub Actions

[Continuing with remaining content...]

#### Details
- Test monitoring system
- Validate alert triggers
- Post-release quality checks

#### Preparation
- [ ] Define monitoring test scenarios
- [ ] Prepare test data
- [ ] Plan validation criteria
- [ ] Collect quality metrics

[Content would continue with detailed test scenarios, scripts, and workflows for monitoring and quality validation...]

#### Deliverables
- Monitoring system validation tests
- Alert trigger tests
- Post-release quality checklist
- Performance validation results
- Quality metrics report

---

### 📋 Summarize Test Results and Prepare Reports
**Responsible**: QA
**Feature**: GitHub Repositories

#### Details
- Collect test results
- Create reports for team
- Prepare lessons learned

[Content would continue with report templates and summary procedures...]

#### Deliverables
- Final test results summary
- Project report
- Lessons learned document
- Recommendations for future
- Knowledge transfer materials

---

## Hands-On Workshop (1-4 Dec 2025)

[Content for workshop activities...]

---

## Wrap-up Meeting (8 Dec 2025)

### Objectives
- Summarize all 4 phases progress
- Present metrics and achievements
- Share lessons learned
- Plan next steps and broader rollout

### Agenda

**Morning Session (9:00 - 12:00)**
1. Project Overview and Timeline Review (30 min)
2. Phase-by-Phase Summary (60 min)
   - Phase 1: Foundation Setup
   - Phase 2: CI/CD Implementation
   - Phase 3: Security Enhancement
   - Phase 4: Automation & AI
3. Metrics and KPI Review (45 min)
4. Demo: Key Features (45 min)

**Lunch Break (12:00 - 13:00)**

**Afternoon Session (13:00 - 17:00)**
1. Challenges and Solutions (45 min)
2. Lessons Learned (45 min)
3. Team Feedback and Testimonials (30 min)
4. ROI Analysis (30 min)
5. Roadmap for Next 6 Months (45 min)
6. Q&A and Discussion (45 min)

### Materials to Prepare

- [ ] Presentation slides
- [ ] Metrics dashboard
- [ ] Demo environment
- [ ] Success stories
- [ ] Before/after comparisons
- [ ] ROI calculations
- [ ] Feedback summary
- [ ] Roadmap document
- [ ] Handover documentation

---

## Success Criteria

- [ ] All automation agents deployed and functioning
- [ ] Auto PR review operational
- [ ] External integrations working
- [ ] Monitoring and alerting validated
- [ ] Post-deployment checks automated
- [ ] Team trained on all features
- [ ] Documentation complete
- [ ] Positive ROI demonstrated
- [ ] High team satisfaction
- [ ] Sustainable for long-term operation

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [Probot Framework](https://probot.github.io/)
- [Danger JS](https://danger.systems/js/)

---

## Next Steps

After completing Phase 4:
1. Continue monitoring and optimization
2. Expand automation to more repositories
3. Share best practices across organization
4. Plan advanced features
5. Regular review and improvement cycles

**[← Phase 3: Security & Protection](./03-PHASE3-SECURITY.md)**

---

**Phase Owner**: Pongsakorn H.
**Last Updated**: November 2025
**Version**: 1.0
