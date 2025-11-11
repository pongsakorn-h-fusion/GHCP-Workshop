# Task 1: Plan GitHub Organization and Team Permissions

**Role**: Project Manager (PM)
**Estimated Time**: 2-3 hours
**Feature**: General Copilot Usage

---

## Objectives

- Create GitHub Organization
- Set up team structure
- Invite and organize team members
- Configure organization security settings
- Document organization structure

## Prerequisites

- GitHub Enterprise Cloud account with Organization creation permissions
- List of all team members and their email addresses
- Understanding of team structure
- Budget approval for GitHub Enterprise

---

## Step 1: Create GitHub Organization

### 1.1 Login to GitHub Enterprise

```
Navigate to: https://github.com/
Login with your GitHub Enterprise account
```

### 1.2 Access Organization Creation

1. Click on your **profile picture** (top right corner)
2. Select **"Your organizations"**
3. Click **"New organization"** button

### 1.3 Choose Plan and Configure

**Select Plan**:
- Choose **"Enterprise Cloud"** plan
- Review pricing and features
- Click **"Next"**

**Organization Details**:
```
Organization Name: TCC-Engineering
Organization Email: devops@tcc.com
Billing Email: billing@tcc.com
Company Name: TCC
```

**Configuration Options**:
- Enable: ✅ Require two-factor authentication
- Enable: ✅ Allow members to create repositories
- Visibility: Private by default

### 1.4 Complete Setup

- Review all settings
- Click **"Create organization"**
- Verify organization is created
- Note the organization URL: `https://github.com/TCC-Engineering`

---

## Step 2: Set Up Organization Teams

### 2.1 Navigate to Teams Section

```
Go to: https://github.com/orgs/YOUR-ORG/teams
Click "Teams" in the left sidebar
```

### 2.2 Create Team Structure

**Team 1: Backend Team**

```
Team Name: backend-team
Description: Backend development team responsible for API and services
Visibility: Visible
Parent team: (none)
```

Click **"Create team"**

**Team 2: Frontend Team**

```
Team Name: frontend-team
Description: Frontend development team for web and mobile applications
Visibility: Visible
Parent team: (none)
```

**Team 3: DevOps Team**

```
Team Name: devops-team
Description: DevOps and infrastructure team for CI/CD and deployments
Visibility: Visible
Parent team: (none)
```

**Team 4: QA Team**

```
Team Name: qa-team
Description: Quality assurance team for testing and quality control
Visibility: Visible
Parent team: (none)
```

### 2.3 Verify Teams Created

Navigate to **Settings → Teams** and confirm all 4 teams are visible:
- ✅ backend-team
- ✅ frontend-team
- ✅ devops-team
- ✅ qa-team

---

## Step 3: Invite Team Members

### 3.1 Prepare Team Member List

Create a spreadsheet or table with team information:

| Name | Email | Team | Role | Access Level |
|------|-------|------|------|--------------|
| John Doe | john@tcc.com | backend-team | Senior Dev | Member |
| Jane Smith | jane@tcc.com | frontend-team | Tech Lead | Admin |
| Mike Johnson | mike@tcc.com | devops-team | DevOps Lead | Admin |
| Sarah Lee | sarah@tcc.com | qa-team | QA Lead | Member |

### 3.2 Invite Members to Organization

**For each team member**:

1. Navigate to: **Settings → People → Invite member**
2. Enter email address
3. Select role:
   - **Member**: Standard access
   - **Admin**: Administrative access
4. Click **"Send invitation"**
5. Repeat for all team members

**Invitation Tips**:
- Send invitations in batches (10-15 at a time)
- Track invitation status
- Follow up with members who haven't accepted within 24 hours
- Keep a record of invitation dates

### 3.3 Add Members to Teams

**For each team**:

1. Navigate to team page: `https://github.com/orgs/YOUR-ORG/teams/TEAM-NAME`
2. Click **"Members"** tab
3. Click **"Add a member"** button
4. Search for team member by username or name
5. Click **"Add [username] to [team]"**
6. Repeat for all team members

**Team Assignment Guidelines**:
- Assign members to their primary team
- Members can belong to multiple teams if needed
- Tech Leads should be team maintainers
- Ensure each team has at least one maintainer

---

## Step 4: Configure Organization Permissions

### 4.1 Set Base Permissions

Navigate to: **Settings → Member privileges**

**Base Permissions Configuration**:

```
Base permissions: Read
✓ Repository creation: Private repositories only
✓ Repository forking: Disabled
✓ Pages creation: Disabled
✓ Repository visibility change: Disabled
```

**Rationale**:
- **Read**: Members can see repositories but need explicit permission to contribute
- **Private only**: Ensures no accidental public repository creation
- **Forking disabled**: Maintains control over code distribution

### 4.2 Configure Team Permissions

**Set default team permissions**:

| Team | Default Repository Permission | Reasoning |
|------|-------------------------------|-----------|
| backend-team | Write | Can contribute to backend repositories |
| frontend-team | Write | Can contribute to frontend repositories |
| devops-team | Admin | Needs full access for CI/CD management |
| qa-team | Write | Can create issues, run tests, contribute |

**To set team permissions** (will be applied when repositories are added):
- Team settings will be configured per repository
- Document intended permissions for future reference

### 4.3 Configure Outside Collaborators Policy

```
Settings → Member privileges → Outside collaborators
```

**Configuration**:
- ✅ Enable: "Require approval for outside collaborators"
- Set expiration: 90 days
- Require justification for additions

---

## Step 5: Configure Security Settings

### 5.1 Enable Organization Security Features

Navigate to: **Settings → Code security and analysis**

**Enable All Security Features**:

```
✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
✅ Dependabot version updates (optional)
✅ Secret scanning
✅ Push protection for secret scanning
✅ Code scanning (CodeQL)
```

**For each feature, click "Enable" or "Enable for all repositories"**

### 5.2 Configure Two-Factor Authentication

Navigate to: **Settings → Authentication security**

**Require 2FA**:

```
✅ Require two-factor authentication for everyone in the organization

Grace period: 7 days
Notification: Email reminders sent automatically
```

**Important**: Inform team members about 2FA requirement before enabling

### 5.3 Configure Security Policies

**Create Security Policy**:

1. Navigate to organization home
2. Create `.github` repository in organization
3. Add `SECURITY.md` file

```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email: security@tcc.com
3. Include detailed description
4. Wait for response (within 48 hours)

## Security Practices

- All code must pass security scans
- Dependencies are regularly updated
- Secrets must never be committed
- 2FA required for all accounts
```

---

## Step 6: Document Organization Structure

### 6.1 Create Organization Documentation

**Create document**: `ORG_STRUCTURE.md` (in shared documentation system)

```markdown
# TCC GitHub Organization Structure

## Organization Details

- **Name**: TCC-Engineering
- **URL**: https://github.com/TCC-Engineering
- **Plan**: Enterprise Cloud
- **Created**: November 10, 2025
- **Owner**: [Your Name]

## Team Structure

### Backend Team
- **Purpose**: Backend API and service development
- **Members**: 8 developers
- **Repositories**: backend-api, shared-libraries, microservices
- **Default Permission**: Write
- **Lead**: [Backend Lead Name]

### Frontend Team
- **Purpose**: Web and mobile application development
- **Members**: 6 developers
- **Repositories**: web-app, mobile-app, component-library
- **Default Permission**: Write
- **Lead**: [Frontend Lead Name]

### DevOps Team
- **Purpose**: Infrastructure, CI/CD, and deployment management
- **Members**: 3 engineers
- **Repositories**: All (infrastructure code, deployment configs)
- **Default Permission**: Admin
- **Lead**: [DevOps Lead Name]

### QA Team
- **Purpose**: Testing, quality assurance, and test automation
- **Members**: 4 QA engineers
- **Repositories**: All (test access, quality monitoring)
- **Default Permission**: Write
- **Lead**: [QA Lead Name]

## Permission Matrix

| Team | Backend Repos | Frontend Repos | Infrastructure | Default Level |
|------|--------------|----------------|----------------|---------------|
| Backend | **Admin** | Read | Read | Member |
| Frontend | Read | **Admin** | Read | Member |
| DevOps | **Admin** | **Admin** | **Admin** | Admin |
| QA | Write | Write | Write | Member |

## Security Settings

- ✅ Two-factor authentication required
- ✅ Secret scanning enabled
- ✅ Dependabot enabled
- ✅ Code scanning enabled
- ✅ Private repositories by default

## Onboarding Process

### New Team Member Checklist
1. Receive invitation email
2. Accept invitation
3. Set up 2FA
4. Join assigned team(s)
5. Review security policy
6. Configure Git locally
7. Complete onboarding training

## Support Contacts

- **Organization Admin**: admin@tcc.com
- **IT Support**: it-support@tcc.com
- **Security Issues**: security@tcc.com
```

### 6.2 Share Documentation

**Distribution**:
1. Email document to all team leads
2. Post in team Slack channel
3. Add to company wiki/knowledge base
4. Review in team meeting
5. Get approval from leadership

---

## Step 7: Validation and Testing

### 7.1 Validation Checklist

**Organization Setup**:
- [ ] Organization created and accessible
- [ ] Organization URL is correct
- [ ] Billing configured properly
- [ ] Organization logo/avatar uploaded (optional)

**Team Structure**:
- [ ] All 4 teams created (backend, frontend, devops, qa)
- [ ] Team descriptions are clear
- [ ] Team visibility settings correct

**Team Members**:
- [ ] All invitations sent
- [ ] Track invitation acceptance (>80% accepted within 48 hours)
- [ ] All members added to correct teams
- [ ] Team leads have maintainer role

**Permissions**:
- [ ] Base permissions set to Read
- [ ] Repository creation restricted to private
- [ ] Team default permissions documented

**Security**:
- [ ] All security features enabled
- [ ] 2FA requirement configured
- [ ] Secret scanning active
- [ ] Security policy documented

**Documentation**:
- [ ] Organization structure documented
- [ ] Permission matrix created
- [ ] Documentation shared with team
- [ ] Leadership approval received

### 7.2 Test Organization Access

**Verification Steps**:

1. **Test Member Access**:
   ```
   - Ask team member to log in
   - Verify they see organization
   - Confirm they can see their team
   - Check they can't see sensitive repos yet
   ```

2. **Test Team Functionality**:
   ```
   - Navigate to team page
   - Verify team members are listed
   - Check team discussions (if enabled)
   - Test @mentions work
   ```

3. **Test Security Settings**:
   ```
   - Verify 2FA prompt appears for new members
   - Check secret scanning is active
   - Confirm Dependabot alerts are enabled
   ```

### 7.3 Common Issues and Solutions

**Issue 1: Invitations not received**
```
Solution:
- Check spam/junk folders
- Verify email address is correct
- Resend invitation
- Use alternative email if needed
```

**Issue 2: Can't create teams**
```
Solution:
- Verify you have Owner permissions
- Check organization settings allow team creation
- Contact GitHub support if issue persists
```

**Issue 3: 2FA causing issues**
```
Solution:
- Provide clear 2FA setup instructions
- Offer help session for team
- Have IT support available
- Consider 7-day grace period
```

**Issue 4: Security features not available**
```
Solution:
- Confirm Enterprise Cloud plan is active
- Check billing is current
- Wait 24 hours for features to activate
- Contact GitHub support
```

---

## Step 8: Next Steps

### Immediate Actions (Week 1)

- [ ] Monitor invitation acceptance rate
- [ ] Follow up with members who haven't joined
- [ ] Schedule organization overview meeting
- [ ] Begin Task 2 (Issue Templates)

### Short-term Actions (Week 2-3)

- [ ] Create first repositories
- [ ] Set up repository permissions
- [ ] Configure branch protection rules
- [ ] Begin onboarding sessions

### Documentation to Maintain

- [ ] Update member list monthly
- [ ] Review team structure quarterly
- [ ] Audit permissions every 6 months
- [ ] Update security policy as needed

---

## Deliverables

✅ **Completed Deliverables**:
1. GitHub Organization created
2. Four teams established (backend, frontend, devops, qa)
3. All team members invited
4. Security features enabled
5. 2FA requirement configured
6. Organization structure documented
7. Permission matrix defined

📋 **Documentation Created**:
- Organization structure document
- Permission matrix
- Security policy
- Onboarding checklist

---

## Success Metrics

- **Organization Setup**: Complete within 1 day
- **Invitation Acceptance**: >80% within 48 hours, 100% within 1 week
- **Security Compliance**: 100% of members with 2FA within grace period
- **Documentation**: All documents reviewed and approved

---

**Related Tasks**:
- Next: [Task 2: Create Issue Templates and Triage Workflows](Task-02-PM-Issue-Templates.md)
- See also: [Task 4: Create Main Repository](Task-04-DEV-Repository.md)

---

**Prepared by**: PM Team
**Last Updated**: November 2025
**Version**: 1.0
