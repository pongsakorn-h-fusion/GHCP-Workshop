# Phase 1: Foundation Setup & Team Workflow

## Overview

**Duration**: November 10-14, 2025 (5 days)
**Hands-On Workshop**: November 10-14, 2025

## Objectives

Establish the foundational structure of the GitHub Organization and team workflows, including enabling GitHub Copilot and initial hands-on training.

## Quick Links to Detailed Tasks

### Project Manager Tasks
- 📋 [Task 1: Plan GitHub Organization and Team Permissions](../Phase1/tasks/Task-01-PM-Organization.md)
- 🎫 [Task 2: Create Issue Templates and Triage Workflows](../Phase1/tasks/Task-02-PM-Issue-Templates.md)
- 🤖 [Task 3: Coordinate Copilot Activation](../Phase1/tasks/Task-03-PM-Copilot.md)

### Developer Tasks
- 📦 [Task 4: Create Main Repository and Connect IDE](../Phase1/tasks/Task-04-DEV-Repository.md)
- 📝 [Task 5: Write README and Contribution Guide](../Phase1/tasks/Task-05-DEV-Documentation.md)
- 🏷️ [Task 6: Set Up Issue Labels and Branch Structure](../Phase1/tasks/Task-06-DEV-Labels.md)

### QA Tasks
- ✅ [Task 7: Design Test Plan and Templates](../Phase1/tasks/Task-07-QA-Test-Plan.md)
- 🐛 [Task 8: Define Bug Labels and Severity Levels](../Phase1/tasks/Task-08-QA-Bug-Severity.md)
- 📊 [Task 9: Prepare Initial Test Data](../Phase1/tasks/Task-09-QA-Test-Data.md)

---

## Tasks to Complete

### 1️⃣ Plan GitHub Organization and Team Permissions
**Responsible**: PM
**Feature**: GitHub Projects / Organization Setup

📖 **[View Detailed Task Guide →](../plan/tasks/Task-01-PM-Organization.md)**

#### Details
- Define Organization structure
- Plan Team divisions and access permissions
- Prepare team member list and roles for each person

#### Preparation
- [ ] Collect all team member names
- [ ] Define roles for each person (Admin, Member, Outside Collaborator)
- [ ] Plan Teams division according to organizational structure
- [ ] Study GitHub Organization permissions and best practices

#### Deliverables
- Organization structure diagram
- Team and member list with roles
- Permission matrix

---

### 2️⃣ Create Issue Templates and Triage Workflows
**Responsible**: PM
**Feature**: GitHub Issues / Templates

📖 **[View Detailed Task Guide →](../plan/tasks/Task-02-PM-Issue-Templates.md)**

#### Details
- Design templates for Bug Report, Feature Request, Task
- Define issue prioritization workflow
- Prepare labels and milestones

#### Preparation
- [ ] Study GitHub Issue Templates format
- [ ] Collect information needed for each issue type
- [ ] Define triage workflow and SLA
- [ ] Design label system (type, priority, status)

#### Templates to Create
1. **Bug Report Template**
   - Description
   - Steps to Reproduce
   - Expected Behavior
   - Actual Behavior
   - Screenshots/Logs
   - Environment Information

2. **Feature Request Template**
   - Feature Description
   - Use Case
   - Proposed Solution
   - Alternatives Considered
   - Additional Context

3. **Task Template**
   - Task Description
   - Acceptance Criteria
   - Dependencies
   - Estimated Effort

#### Deliverables
- Issue template files (.github/ISSUE_TEMPLATE/)
- Label definitions
- Triage workflow documentation

---

### 3️⃣ Coordinate Copilot Activation
**Responsible**: PM
**Feature**: Copilot Administration / Setup

📖 **[View Detailed Task Guide →](../plan/tasks/Task-03-PM-Copilot.md)**

#### Details
- Understand Copilot usage scope for each role
- Plan license activation
- Prepare usage documentation

#### Preparation
- [ ] Check available license count
- [ ] Define Copilot usage policy
- [ ] Prepare installation and usage documentation
- [ ] Plan onboarding process

#### Copilot Features to Introduce
- **Copilot Code Completion**: Automatic code suggestions
- **Copilot Chat**: Conversational assistance
- **Copilot Commands**: Various slash commands
- **Context Awareness**: Using project context

#### Deliverables
- Copilot usage policy
- Quick start guide
- Best practices document
- Training materials

---

### 4️⃣ Create Main Repository and Connect IDE
**Responsible**: Developer
**Feature**: GitHub Repositories

📖 **[View Detailed Task Guide →](../plan/tasks/Task-04-DEV-Repository.md)**

#### Details
- Set up main repository
- Test IDE connection (VS Code/IntelliJ)
- Enable GitHub Copilot in each IDE

#### Preparation
- [ ] Define repository name and description
- [ ] Choose visibility (Public/Private/Internal)
- [ ] Prepare .gitignore template
- [ ] Install IDE to be used
- [ ] Install GitHub Copilot extension

#### Repository Initial Setup
```bash
# Clone repository
git clone <repository-url>

# Create initial branch structure
git checkout -b develop
git push -u origin develop

# Setup git configuration
git config user.name "Your Name"
git config user.email "your.email@company.com"
```

#### IDE Setup Checklist
- [ ] Visual Studio Code + GitHub Copilot extension
- [ ] IntelliJ IDEA + GitHub Copilot plugin (if used)
- [ ] Git integration configured
- [ ] Sign in to GitHub account
- [ ] Verify Copilot activation

#### Deliverables
- Main repository created
- Initial branch structure
- Team members added as collaborators
- IDE setup guide

---

### 5️⃣ Write README and Contribution Guide
**Responsible**: Developer
**Feature**: Copilot Chat / Documentation Assist

📖 **[View Detailed Task Guide →](../plan/tasks/Task-05-DEV-Documentation.md)**

#### Details
- Use Copilot Chat to help draft documentation
- Define coding standards and commit message conventions
- Specify contribution steps

#### Preparation
- [ ] Collect project information (purpose, tech stack, etc.)
- [ ] Define coding standards
- [ ] Define commit message format
- [ ] Plan contribution workflow

#### README.md Structure
```markdown
# Project Name

## Description
Brief description of the project

## Tech Stack
- Language/Framework
- Dependencies
- Tools

## Getting Started
### Prerequisites
### Installation
### Running the Application

## Project Structure
Directory structure explanation

## Contributing
Link to CONTRIBUTING.md

## License
License information
```

#### CONTRIBUTING.md Structure
```markdown
# Contributing Guide

## Code of Conduct
## How to Contribute
## Development Workflow
### Branch Naming Convention
### Commit Message Format
### Pull Request Process
## Coding Standards
## Testing Guidelines
```

#### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

#### Deliverables
- README.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md (optional)
- .github/pull_request_template.md

---

### 6️⃣ Set Up Issue Labels and Branch Structure
**Responsible**: Developer
**Feature**: GitHub Issues / Templates

📖 **[View Detailed Task Guide →](../plan/tasks/Task-06-DEV-Labels.md)**

#### Details
- Create label system according to team guidelines
- Define branch structure (main, develop, feature/*, hotfix/*)
- Set up branch naming convention

#### Label Categories

**Type Labels**
- `type: bug` - Something isn't working
- `type: feature` - New feature or request
- `type: enhancement` - Improvement to existing feature
- `type: documentation` - Documentation updates
- `type: refactor` - Code refactoring

**Priority Labels**
- `priority: critical` - Critical priority
- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority

**Status Labels**
- `status: triage` - Needs triage
- `status: in-progress` - Work in progress
- `status: review` - In review
- `status: blocked` - Blocked by something
- `status: wont-fix` - Won't be fixed

**Area Labels**
- `area: frontend` - Frontend related
- `area: backend` - Backend related
- `area: database` - Database related
- `area: devops` - DevOps/Infrastructure related

#### Branch Structure

```
main (production)
  └── develop (integration)
      ├── feature/user-authentication
      ├── feature/payment-integration
      ├── bugfix/login-error
      └── hotfix/critical-security-fix
```

#### Branch Naming Convention
- `feature/<feature-name>` - New features
- `bugfix/<bug-description>` - Bug fixes
- `hotfix/<critical-fix>` - Critical production fixes
- `refactor/<refactor-description>` - Code refactoring
- `docs/<doc-description>` - Documentation updates

#### Deliverables
- Complete label set created
- Branch structure documentation
- Branch naming convention guide

---

### 7️⃣ Design Test Plan and Templates
**Responsible**: QA
**Feature**: GitHub Issues / Templates

📖 **[View Detailed Task Guide →](../plan/tasks/Task-07-QA-Test-Plan.md)**

#### Details
- Create test plan template in Issues
- Define test case format
- Prepare checklist for testing

#### Preparation
- [ ] Study test plan best practices
- [ ] Define test case format
- [ ] Prepare test checklist templates
- [ ] Plan test coverage

#### Test Plan Template Structure
```markdown
# Test Plan: [Feature Name]

## Objective
What is being tested and why

## Scope
### In Scope
### Out of Scope

## Test Strategy
- Unit Testing
- Integration Testing
- E2E Testing
- Performance Testing
- Security Testing

## Test Cases
| ID | Description | Priority | Status |
|----|-------------|----------|--------|
| TC001 | ... | High | Pending |

## Test Environment
- Environment details
- Test data requirements

## Entry/Exit Criteria
### Entry Criteria
### Exit Criteria

## Risks and Mitigation
```

#### Test Case Template
```markdown
## Test Case ID: TC-XXX

**Title**: [Test case title]
**Priority**: High/Medium/Low
**Type**: Functional/Non-functional

### Preconditions
- List of preconditions

### Test Steps
1. Step 1
2. Step 2
3. Step 3

### Expected Result
What should happen

### Actual Result
What actually happened (filled during testing)

### Status
Pass/Fail/Blocked

### Notes
Additional information
```

#### Deliverables
- Test plan template
- Test case template
- Test checklist template
- Test documentation guidelines

---

### 8️⃣ Define Bug Labels and Severity Levels
**Responsible**: QA
**Feature**: General Copilot Usage

📖 **[View Detailed Task Guide →](../plan/tasks/Task-08-QA-Bug-Severity.md)**

#### Details
- Design bug severity classification system (Critical, High, Medium, Low)
- Create labels for categorizing bugs
- Define SLA for each severity level

#### Severity Levels

**Critical (P0)**
- System is down or unusable
- Data loss or corruption
- Security vulnerabilities
- **SLA**: Fix within 4 hours

**High (P1)**
- Major feature not working
- Significant impact on users
- No workaround available
- **SLA**: Fix within 24 hours

**Medium (P2)**
- Feature partially working
- Moderate impact on users
- Workaround available
- **SLA**: Fix within 3 days

**Low (P3)**
- Minor issues
- Cosmetic problems
- Little impact on users
- **SLA**: Fix in next sprint

#### Bug Workflow
```
[New Bug] → [Triage] → [In Progress] → [In Review] → [Testing] → [Closed]
                ↓
           [Won't Fix]
```

#### Bug Report Quality Checklist
- [ ] Clear title describing the issue
- [ ] Detailed description
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Screenshots/logs attached
- [ ] Environment information
- [ ] Severity level assigned

#### Deliverables
- Severity level definitions
- Bug labels created
- SLA documentation
- Bug triage workflow

---

### 9️⃣ Prepare Initial Test Data
**Responsible**: QA
**Feature**: Copilot Test Generation / GitHub Actions

📖 **[View Detailed Task Guide →](../plan/tasks/Task-09-QA-Test-Data.md)**

#### Details
- Collect test data for initial testing
- Create mock data or fixtures
- Prepare test environment

#### Preparation
- [ ] Analyze data requirements
- [ ] Create test data generation script
- [ ] Prepare database fixtures
- [ ] Set up test environment

#### Test Data Categories

**1. User Data**
- Valid user accounts
- Invalid user data
- Edge cases (special characters, max length, etc.)

**2. Transaction Data**
- Success scenarios
- Failure scenarios
- Boundary values

**3. Configuration Data**
- Various configuration combinations
- Environment-specific settings

#### Test Data Management
```
test-data/
├── fixtures/
│   ├── users.json
│   ├── products.json
│   └── orders.json
├── mock/
│   ├── api-responses/
│   └── service-stubs/
└── scripts/
    ├── generate-test-data.js
    └── seed-database.js
```

#### Best Practices
- Use realistic but anonymized data
- Version control test data
- Document data generation process
- Automate data setup/teardown
- Keep test data separate from production

#### Deliverables
- Test data files
- Data generation scripts
- Test environment setup guide
- Data documentation

---

## Hands-On Workshop (10-14 Nov 2025)

### Purpose
Enable the team to practice setting up Organization, Repository, and using Copilot.

### Schedule (Example)

#### Day 1: GitHub Organization & Setup
- Morning: Overview and GitHub Organization setup
- Afternoon: Repository creation and team collaboration

#### Day 2: GitHub Copilot Introduction
- Morning: Copilot features and capabilities
- Afternoon: Hands-on coding with Copilot

#### Day 3: Issues & Project Management
- Morning: Issue templates and workflows
- Afternoon: Project boards and automation

#### Day 4: Documentation & Best Practices
- Morning: Writing documentation with Copilot
- Afternoon: Branch strategies and git workflows

#### Day 5: Testing & Quality
- Morning: Test planning and test data
- Afternoon: Review and Q&A

### Workshop Activities

#### Activity 1: Organization Setup
- Create teams
- Add members
- Set up permissions

#### Activity 2: Repository Creation
- Create first repository
- Clone and setup local environment
- Push first commit

#### Activity 3: Copilot Basics
- Code completion
- Generate functions
- Write unit tests
- Generate documentation

#### Activity 4: Issue Management
- Create issue from template
- Assign and label issues
- Link PRs to issues

#### Activity 5: Collaboration
- Create feature branch
- Make changes
- Create pull request
- Review and merge

---

## Pre-Workshop Preparation

### For Everyone
- [ ] GitHub Enterprise account ready
- [ ] Copilot license activated
- [ ] IDE installed successfully (VS Code or IntelliJ)
- [ ] Git installed and configured
- [ ] Sufficient internet speed

### For PM
- [ ] Organization structure finalized
- [ ] Team and member list ready
- [ ] Workshop agenda prepared
- [ ] Training materials ready

### For Developer
- [ ] Sample repository prepared
- [ ] Code examples ready
- [ ] Demo scripts prepared
- [ ] Troubleshooting guide ready

### For QA
- [ ] Test scenarios prepared
- [ ] Test data ready
- [ ] Quality checklist prepared
- [ ] Evaluation criteria defined

---

## Success Criteria

Evaluation criteria for Phase 1 success:

- [ ] GitHub Organization setup completed
- [ ] All team members can access repositories
- [ ] Copilot activated and working for everyone
- [ ] Issue templates and labels ready to use
- [ ] README and CONTRIBUTING guide completed
- [ ] Branch structure defined and understood by all
- [ ] Test plans and test data ready
- [ ] All team members completed workshop and hands-on activities
- [ ] Workshop feedback collected

---

## Common Issues & Troubleshooting

### Issue: Cannot activate Copilot
**Solution**: Verify that license is assigned and IDE extension is updated to the latest version

### Issue: Git push fails (Permission denied)
**Solution**: Check SSH keys or use Personal Access Token

### Issue: Copilot not showing suggestions
**Solution**: Verify that file is saved and extension is enabled

### Issue: Merge conflicts
**Solution**: Pull latest changes before push and use merge tools in IDE

---

## Resources

### Documentation
- [GitHub Organizations Documentation](https://docs.github.com/en/organizations)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)

### Video Tutorials
- GitHub Organization Setup
- GitHub Copilot Getting Started
- Effective Issue Management

### Templates & Examples
- [GitHub Templates Repository](https://github.com/github)
- Community best practices

---

## Next Phase

Upon completion of Phase 1, prepare for:
**[Phase 2: CI/CD, Environments & Secrets →](./02-PHASE2-CICD.md)**

---

**Phase Owner**: Pongsakorn H.
**Last Updated**: November 2025
**Version**: 1.0
