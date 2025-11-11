# Task 6: Set Up Issue Labels and Branch Structure

**Role**: Developer
**Estimated Time**: 1-2 hours
**Feature**: General Copilot Usage

---

## Objective

Establish a consistent labeling system for issues and pull requests, and implement a clear branching strategy to support effective team collaboration and project management.

## Prerequisites

- Repository created and configured (Task 4 complete)
- Understanding of Git workflow
- Admin access to repository
- Familiarity with GitHub labels and branch protection

---

## Overview

This task creates:
1. **Issue Labels** - Organized categorization system
2. **Branch Protection Rules** - Safety guardrails for main branches
3. **Branching Strategy** - Clear workflow for feature development
4. **Documentation** - Guidelines for using labels and branches

---

## Step 1: Plan Label Strategy

### 1.1 Label Categories

Organize labels into categories:

**1. Type** - What kind of work?
- `type: bug` - Something isn't working
- `type: feature` - New functionality
- `type: enhancement` - Improvement to existing feature
- `type: documentation` - Documentation updates
- `type: refactor` - Code refactoring
- `type: test` - Testing related

**2. Priority** - How urgent?
- `priority: critical` - Drop everything
- `priority: high` - Important, schedule soon
- `priority: medium` - Normal priority
- `priority: low` - Nice to have

**3. Status** - What's happening?
- `status: triage` - Needs review
- `status: blocked` - Blocked by something
- `status: in-progress` - Being worked on
- `status: review` - In code review
- `status: ready` - Ready for deployment

**4. Area** - Which part of the system?
- `area: frontend` - Frontend related
- `area: backend` - Backend related
- `area: database` - Database related
- `area: devops` - DevOps/Infrastructure
- `area: api` - API related

**5. Special** - Additional context
- `good-first-issue` - Good for newcomers
- `help-wanted` - Need community help
- `duplicate` - Duplicate issue
- `wontfix` - Will not be addressed
- `needs-more-info` - Needs clarification

---

## Step 2: Create Labels on GitHub

### 2.1 Access Labels Settings

1. Go to repository on GitHub
2. Click **"Issues"** tab
3. Click **"Labels"** button
4. You'll see default labels - we'll customize these

### 2.2 Create Type Labels

For each type label, click **"New label"** and add:

**Bug**:
```
Name: type: bug
Description: Something isn't working correctly
Color: #d73a4a (red)
```

**Feature**:
```
Name: type: feature
Description: New feature or functionality
Color: #0e8a16 (green)
```

**Enhancement**:
```
Name: type: enhancement
Description: Improvement to existing feature
Color: #a2eeef (light blue)
```

**Documentation**:
```
Name: type: documentation
Description: Documentation updates or additions
Color: #0075ca (blue)
```

**Refactor**:
```
Name: type: refactor
Description: Code refactoring
Color: #fbca04 (yellow)
```

**Test**:
```
Name: type: test
Description: Test related changes
Color: #d4c5f9 (purple)
```

### 2.3 Create Priority Labels

**Critical**:
```
Name: priority: critical
Description: Urgent, needs immediate attention
Color: #b60205 (dark red)
```

**High**:
```
Name: priority: high
Description: Important, schedule soon
Color: #d93f0b (orange-red)
```

**Medium**:
```
Name: priority: medium
Description: Normal priority
Color: #fbca04 (yellow)
```

**Low**:
```
Name: priority: low
Description: Nice to have, low priority
Color: #0e8a16 (green)
```

### 2.4 Create Status Labels

**Triage**:
```
Name: status: triage
Description: Needs review and prioritization
Color: #d4c5f9 (light purple)
```

**Blocked**:
```
Name: status: blocked
Description: Blocked by dependencies or issues
Color: #e99695 (light red)
```

**In Progress**:
```
Name: status: in-progress
Description: Currently being worked on
Color: #0052cc (blue)
```

**Review**:
```
Name: status: review
Description: In code review
Color: #5319e7 (purple)
```

**Ready**:
```
Name: status: ready
Description: Ready for deployment
Color: #0e8a16 (green)
```

### 2.5 Create Area Labels

**Frontend**:
```
Name: area: frontend
Description: Frontend related (UI, UX, client-side)
Color: #1d76db (blue)
```

**Backend**:
```
Name: area: backend
Description: Backend related (server, business logic)
Color: #0e8a16 (green)
```

**Database**:
```
Name: area: database
Description: Database related (schema, queries)
Color: #d93f0b (orange)
```

**DevOps**:
```
Name: area: devops
Description: DevOps, CI/CD, infrastructure
Color: #5319e7 (purple)
```

**API**:
```
Name: area: api
Description: API endpoints and integration
Color: #fbca04 (yellow)
```

### 2.6 Create Special Labels

**Good First Issue**:
```
Name: good-first-issue
Description: Good for newcomers to the project
Color: #7057ff (bright purple)
```

**Help Wanted**:
```
Name: help-wanted
Description: Extra attention needed, community help welcomed
Color: #008672 (teal)
```

**Duplicate**:
```
Name: duplicate
Description: This issue already exists
Color: #cfd3d7 (gray)
```

**Won't Fix**:
```
Name: wontfix
Description: Will not be addressed
Color: #ffffff (white)
```

**Needs More Info**:
```
Name: needs-more-info
Description: Requires additional information
Color: #d876e3 (pink)
```

---

## Step 3: Document Label Usage

### 3.1 Create Label Guide

Create `docs/LABELS.md`:

````markdown
# GitHub Labels Guide

## Overview

This document explains our labeling system for issues and pull requests.

## Label Categories

### Type Labels

Indicate what kind of work this is:

| Label | Usage | Example |
|-------|-------|---------|
| `type: bug` | Something broken or incorrect | Login fails with valid credentials |
| `type: feature` | New functionality | Add user profile page |
| `type: enhancement` | Improve existing feature | Speed up search query |
| `type: documentation` | Docs only | Update API documentation |
| `type: refactor` | Code refactoring | Restructure user service |
| `type: test` | Testing related | Add unit tests for auth |

**Rules**:
- Every issue/PR must have exactly **one** type label
- Add type label when creating or triaging issue

### Priority Labels

Indicate urgency:

| Label | Response Time | Fix Time | When to Use |
|-------|---------------|----------|-------------|
| `priority: critical` | 1 hour | 4 hours | System down, data loss, security breach |
| `priority: high` | 4 hours | 1 day | Major feature broken, many users affected |
| `priority: medium` | 1 day | 3 days | Normal bugs and features |
| `priority: low` | 3 days | 2 weeks | Nice-to-have, cosmetic issues |

**Rules**:
- Every issue must have exactly **one** priority label
- Priority assigned during triage
- Can be changed if situation changes

### Status Labels

Track progress:

| Label | Meaning | Next Step |
|-------|---------|-----------|
| `status: triage` | Needs review | PM/Lead reviews and prioritizes |
| `status: blocked` | Can't proceed | Identify and resolve blocker |
| `status: in-progress` | Being worked on | Developer implements solution |
| `status: review` | In code review | Reviewers approve or request changes |
| `status: ready` | Ready to deploy | Deploy to production |

**Rules**:
- Status changes as work progresses
- Update status when state changes
- Add comment explaining blocker if using `blocked`

### Area Labels

Identify affected system:

| Label | Scope |
|-------|-------|
| `area: frontend` | UI, React components, styling, client-side logic |
| `area: backend` | Server, API, business logic, controllers |
| `area: database` | Schema, migrations, queries, data models |
| `area: devops` | CI/CD, deployment, infrastructure, monitoring |
| `area: api` | API endpoints, integration, external services |

**Rules**:
- Can have multiple area labels if it spans systems
- Helps route to correct team
- Add during creation or triage

### Special Labels

Additional context:

| Label | Purpose | Who Uses |
|-------|---------|----------|
| `good-first-issue` | Easy task for beginners | Maintainers |
| `help-wanted` | Need community help | Anyone |
| `duplicate` | Already reported | Triage team |
| `wontfix` | Won't be addressed | Maintainers |
| `needs-more-info` | Incomplete information | Triage team |

## How to Use Labels

### Creating an Issue

When creating issue:
1. Use issue template (auto-adds some labels)
2. Add `type` label based on issue type
3. Add `area` label for affected system
4. Add `status: triage` (will be prioritized)

### During Triage

PM/Lead adds:
1. `priority` label (critical/high/medium/low)
2. Remove `status: triage`
3. Assign to developer or add to backlog
4. Add additional labels as needed

### Working on Issue

Developer:
1. Add `status: in-progress` when starting
2. Update area labels if needed
3. Link PR to issue

### During Review

Reviewer:
1. Add `status: review` when PR submitted
2. Approve or request changes
3. Update `status: ready` when approved

### Special Cases

**Blocked Issue**:
```
- Add `status: blocked`
- Comment explaining blocker
- Link related issue if applicable
- Remove when unblocked
```

**Duplicate Issue**:
```
- Add `duplicate` label
- Comment with link to original
- Close issue
```

**Need More Information**:
```
- Add `needs-more-info` label
- Comment asking for specific details
- Wait for response
```

## Examples

### Bug Report Example

```
Title: Login button not responding on mobile
Labels: 
  - type: bug
  - priority: high
  - area: frontend
  - status: triage
```

### Feature Request Example

```
Title: Add export to CSV functionality
Labels:
  - type: feature
  - priority: medium
  - area: backend
  - area: api
  - status: triage
```

### Documentation Update Example

```
Title: Update API authentication docs
Labels:
  - type: documentation
  - priority: low
  - good-first-issue
```

## Best Practices

### DO ✅

- Apply labels consistently
- Update labels as work progresses
- Use multiple area labels if needed
- Add helpful comments when changing status
- Review labels during triage

### DON'T ❌

- Leave issues without labels
- Use multiple priority labels
- Use multiple type labels
- Forget to update status
- Create custom labels without discussion

## Maintenance

### Monthly Review

- Audit label usage
- Remove unused labels
- Update descriptions if needed
- Train new team members

### Adding New Labels

To propose new label:
1. Open issue explaining need
2. Suggest name, color, description
3. Discuss with team
4. Create if approved
5. Update this documentation

---

**Maintained by**: Engineering Team
**Last Updated**: November 2025
````

### 3.2 Save and Commit

```bash
git add docs/LABELS.md
git commit -m "docs: Add GitHub labels usage guide"
git push
```

---

## Step 4: Set Up Branch Protection Rules

### 4.1 Protect Main Branch

1. Go to repository **Settings**
2. Click **Branches** (left sidebar)
3. Under "Branch protection rules", click **"Add rule"**

**Branch name pattern**: `main`

**Settings to enable**:

```
✅ Require a pull request before merging
  ✅ Require approvals: 2
  ✅ Dismiss stale pull request approvals when new commits are pushed
  ✅ Require review from Code Owners (if using CODEOWNERS)

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Status checks (add when CI is set up):
    - build
    - test
    - lint

✅ Require conversation resolution before merging

✅ Require signed commits (optional)

✅ Require linear history (recommended)

✅ Include administrators (recommended for consistency)

❌ Allow force pushes (should be disabled)

❌ Allow deletions (should be disabled)
```

Click **"Create"** to save rule.

### 4.2 Protect Develop Branch

Repeat for `develop` branch with slightly relaxed rules:

**Branch name pattern**: `develop`

**Settings**:
```
✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale pull request approvals when new commits are pushed

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging

✅ Require conversation resolution before merging

❌ Allow force pushes (disabled)

❌ Allow deletions (disabled)
```

---

## Step 5: Document Branching Strategy

### 5.1 Create Branching Guide

Create `docs/BRANCHING_STRATEGY.md`:

````markdown
# Branching Strategy

## Overview

We follow a **Git Flow** inspired branching strategy with two main branches and feature/fix branches.

## Branch Types

### Main Branches

**`main`** (Production):
- Always deployable
- Contains production code
- Protected: Requires PR + 2 approvals
- Never commit directly
- Only merge from `develop` via release PR

**`develop`** (Integration):
- Integration branch
- Latest development changes
- Protected: Requires PR + 1 approval
- Merge feature branches here
- Deploy to staging environment

### Supporting Branches

**Feature Branches** (`feature/*`):
- New features or enhancements
- Branch from: `develop`
- Merge into: `develop`
- Naming: `feature/issue-number-short-description`
- Example: `feature/123-add-user-authentication`

**Bugfix Branches** (`fix/*` or `bugfix/*`):
- Bug fixes
- Branch from: `develop`
- Merge into: `develop`
- Naming: `fix/issue-number-short-description`
- Example: `fix/456-login-error`

**Hotfix Branches** (`hotfix/*`):
- Critical production fixes
- Branch from: `main`
- Merge into: Both `main` AND `develop`
- Naming: `hotfix/issue-number-description`
- Example: `hotfix/789-security-patch`

**Release Branches** (`release/*`):
- Prepare for production release
- Branch from: `develop`
- Merge into: `main` and back to `develop`
- Naming: `release/v1.2.3`
- Example: `release/v1.0.0`

---

## Workflow Examples

### Working on a New Feature

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/123-add-dashboard

# 3. Make changes and commit
git add .
git commit -m "feat: Add user dashboard"

# 4. Push to remote
git push -u origin feature/123-add-dashboard

# 5. Open Pull Request on GitHub
# - Base: develop
# - Compare: feature/123-add-dashboard

# 6. After PR approval, merge and delete branch
```

### Fixing a Bug

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create fix branch
git checkout -b fix/456-login-error

# 3. Fix bug and commit
git add .
git commit -m "fix: Resolve login timeout issue"

# 4. Push and create PR
git push -u origin fix/456-login-error

# PR: fix/456-login-error → develop
```

### Emergency Hotfix

```bash
# 1. Branch from main (production)
git checkout main
git pull origin main
git checkout -b hotfix/789-security-patch

# 2. Fix issue
git add .
git commit -m "fix: Patch security vulnerability CVE-2025-1234"

# 3. Push branch
git push -u origin hotfix/789-security-patch

# 4. Create TWO pull requests:
# PR 1: hotfix/789 → main (priority)
# PR 2: hotfix/789 → develop (after #1 merged)

# 5. After both merged, delete hotfix branch
```

### Creating a Release

```bash
# 1. Branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Update version numbers, changelog
# Edit package.json, CHANGELOG.md, etc.

# 3. Commit version bump
git add .
git commit -m "chore: Bump version to 1.2.0"

# 4. Push release branch
git push -u origin release/v1.2.0

# 5. Create PR to main
# PR: release/v1.2.0 → main

# 6. After merge to main, create tag
git checkout main
git pull
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# 7. Merge back to develop
# PR: release/v1.2.0 → develop
```

---

## Branch Naming Conventions

### Format

```
<type>/<issue-number>-<short-description>
```

### Rules

- Use lowercase
- Use hyphens to separate words
- Include issue number if exists
- Keep description short (3-5 words max)
- Use descriptive names

### Examples

✅ **Good**:
```
feature/123-user-authentication
fix/456-login-timeout
hotfix/789-security-patch
refactor/321-user-service
docs/update-api-documentation
```

❌ **Bad**:
```
feature/new-feature (not descriptive)
fix-bug (no issue number, not descriptive)
johns-branch (personal, not descriptive)
temp (meaningless)
test (too generic)
```

---

## Pull Request Guidelines

### Creating a PR

1. **Base Branch**: Usually `develop`
2. **Title**: Follow commit convention (feat:, fix:, etc.)
3. **Description**: Use PR template
4. **Labels**: Add appropriate labels
5. **Reviewers**: Request 1-2 reviewers
6. **Link Issue**: Use "Closes #123" in description

### PR Checklist

Before submitting:
- [ ] Branch is up to date with base
- [ ] All tests pass
- [ ] Code is linted
- [ ] Documentation updated
- [ ] Commits are clean
- [ ] PR description is complete

### After PR Merged

```bash
# Switch to develop
git checkout develop

# Pull latest
git pull origin develop

# Delete local feature branch
git branch -d feature/123-add-dashboard

# Delete remote branch (usually auto-deleted)
git push origin --delete feature/123-add-dashboard
```

---

## Branch Protection Rules

### Main Branch

- ✅ Require PR
- ✅ Require 2 approvals
- ✅ Require passing status checks
- ✅ Require up-to-date branch
- ❌ No direct pushes
- ❌ No force pushes
- ❌ No deletions

### Develop Branch

- ✅ Require PR
- ✅ Require 1 approval
- ✅ Require passing status checks
- ❌ No direct pushes
- ❌ No force pushes

---

## Common Scenarios

### Scenario 1: Feature Takes Too Long

If feature branch gets behind `develop`:

```bash
# On your feature branch
git checkout feature/123-my-feature

# Fetch latest
git fetch origin

# Rebase on develop
git rebase origin/develop

# Resolve conflicts if any
# Then force push (only on feature branches!)
git push --force-with-lease
```

### Scenario 2: Need to Fix PR After Review

```bash
# Make requested changes
git add .
git commit -m "fix: Address review feedback"

# Push to same branch
git push

# PR automatically updates
```

### Scenario 3: Accidentally Committed to Wrong Branch

```bash
# If not pushed yet
git reset HEAD~1 --soft

# Switch to correct branch
git checkout correct-branch

# Commit again
git add .
git commit -m "Your message"
```

---

## Best Practices

### DO ✅

- Branch from latest `develop`
- Keep branches short-lived (< 1 week)
- Delete branches after merge
- Sync with `develop` regularly
- Use descriptive branch names
- Link PRs to issues
- Write clear commit messages

### DON'T ❌

- Commit directly to `main` or `develop`
- Create long-lived feature branches
- Use force push on shared branches
- Leave branches undeleted after merge
- Use generic names like "test" or "temp"
- Skip PR process
- Push broken code

---

## Troubleshooting

### Can't Push to Branch

**Error**: "Protected branch"

**Solution**: Create PR instead of direct push

### Branch Diverged

**Error**: "Your branch has diverged"

**Solution**:
```bash
git fetch origin
git rebase origin/develop
# Or merge if rebase is complicated
git merge origin/develop
```

### Need to Update PR

**Solution**: Just push more commits to same branch

---

## Getting Help

- **Questions**: #dev-help Slack channel
- **Branch issues**: Ask in PR comments
- **Complex merges**: Pair with senior developer

---

**Maintained by**: Engineering Team
**Last Updated**: November 2025
````

### 5.2 Save and Commit

```bash
git add docs/BRANCHING_STRATEGY.md
git commit -m "docs: Add branching strategy guide"
git push
```

---

## Step 6: Create CODEOWNERS File (Optional)

### 6.1 Create CODEOWNERS

Create `.github/CODEOWNERS`:

```
# CODEOWNERS file
# Lines starting with # are comments
# Each line is a file pattern followed by one or more owners

# Default owners for everything in the repo
* @YOUR-ORG/backend-team

# Frontend code
/src/components/** @YOUR-ORG/frontend-team
/src/styles/** @YOUR-ORG/frontend-team

# Backend code
/src/services/** @YOUR-ORG/backend-team
/src/controllers/** @YOUR-ORG/backend-team
/src/models/** @YOUR-ORG/backend-team

# DevOps
/.github/workflows/** @YOUR-ORG/devops-team
/docker/** @YOUR-ORG/devops-team
/scripts/** @YOUR-ORG/devops-team

# Documentation
/docs/** @YOUR-ORG/backend-team @YOUR-ORG/frontend-team
README.md @YOUR-ORG/backend-team
CONTRIBUTING.md @YOUR-ORG/backend-team

# Tests
/tests/** @YOUR-ORG/qa-team

# Configuration
package.json @YOUR-ORG/devops-team
.eslintrc.js @YOUR-ORG/backend-team
```

### 6.2 Save and Commit

```bash
git add .github/CODEOWNERS
git commit -m "chore: Add CODEOWNERS file for automatic review assignment"
git push
```

---

## Step 7: Validation

### 7.1 Validation Checklist

**Labels**:
- [ ] All label categories created (type, priority, status, area, special)
- [ ] Labels have appropriate colors
- [ ] Labels have clear descriptions
- [ ] Label guide documented

**Branch Protection**:
- [ ] Main branch protected
- [ ] Develop branch protected
- [ ] PR required for both branches
- [ ] Approval requirements set
- [ ] Status checks configured (or noted for Phase 2)
- [ ] Force push disabled
- [ ] Branch deletion disabled

**Documentation**:
- [ ] LABELS.md created with usage guide
- [ ] BRANCHING_STRATEGY.md created with workflows
- [ ] CODEOWNERS file created (optional)
- [ ] All documents committed and pushed

**Team Understanding**:
- [ ] Team briefed on labeling system
- [ ] Team understands branching strategy
- [ ] Questions answered

### 7.2 Test Branch Protection

Try to push directly to main:

```bash
# This should FAIL
git checkout main
echo "test" > test.txt
git add test.txt
git commit -m "test: Direct commit"
git push

# Expected: Error message about protection
```

If it fails (as expected), protection is working! ✅

### 7.3 Test Label Creation

1. Go to repository **Issues**
2. Create a new issue
3. Check that all your custom labels are available
4. Apply labels and verify they display correctly

---

## Deliverables

✅ **Labels System**:
1. Complete label set created (25+ labels)
2. Organized by category (type, priority, status, area, special)
3. Label usage guide documented

✅ **Branch Protection**:
1. Main branch protected
2. Develop branch protected
3. PR workflow enforced

✅ **Documentation**:
1. LABELS.md - Label usage guide
2. BRANCHING_STRATEGY.md - Branch workflow guide
3. CODEOWNERS - Code ownership (optional)

---

## Success Metrics

- **Consistency**: All issues/PRs properly labeled
- **Safety**: No direct commits to protected branches
- **Clarity**: Team understands label and branch system
- **Efficiency**: Labels help organize and prioritize work

---

## Next Steps

1. ✅ Labels and branching configured
2. → Train team on label usage
3. → Train team on branching workflow
4. → Begin development with new system
5. → Monitor and refine as needed

---

## Tips for Success

1. **Be Consistent**: Always use labels and follow branching strategy
2. **Keep It Simple**: Don't create too many labels
3. **Document Changes**: Update guides when system evolves
4. **Train New Members**: Include in onboarding
5. **Review Regularly**: Audit label usage monthly
6. **Get Feedback**: Ask team what works and what doesn't
7. **Lead by Example**: Maintainers should model correct usage

---

**Related Tasks**:
- Previous: [Task 5: Write README and Contributing Guide](Task-05-DEV-Documentation.md)
- Next: [Task 7: Design Test Plan and Templates](Task-07-QA-Test-Plan.md)
- See also: [Task 2: Create Issue Templates](Task-02-PM-Issue-Templates.md)

---

**Prepared by**: Development Team
**Last Updated**: November 2025
**Version**: 1.0
