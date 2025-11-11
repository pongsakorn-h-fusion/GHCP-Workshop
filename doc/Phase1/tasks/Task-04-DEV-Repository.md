# Task 4: Create Main Repository and Connect IDE

**Role**: Developer
**Estimated Time**: 1-2 hours
**Feature**: General Copilot Usage

---

## Objective

Set up the main application repository, configure local development environment, connect IDE with Copilot, and prepare the initial project structure.

## Prerequisites

- GitHub Organization created (Task 1)
- Git installed locally
- IDE installed (VS Code or IntelliJ)
- GitHub Copilot license assigned (Task 3)
- GitHub Copilot extension installed in IDE

---

## Step 1: Create Repository on GitHub

### 1.1 Navigate to Organization

Go to: `https://github.com/YOUR-ORG`

### 1.2 Create New Repository

1. Click **"New"** or **"New repository"** button
2. Fill in repository details:
   ```
   Repository name: main-application
   Description: Main application repository for TCC project
   Visibility: ● Private
   ```

3. Initialize repository with:
   - ✅ **Add a README file**
   - ✅ **Add .gitignore**: Choose appropriate template (e.g., Node, Python, Java)
   - ✅ **Choose a license**: MIT License (or as per company policy)

4. Click **"Create repository"**

### 1.3 Configure Repository Settings

Navigate to **Settings** tab in the repository:

**General Settings → Features**:
- ✅ Issues
- ✅ Projects  
- ✅ Wiki (optional)
- ✅ Discussions (optional)

**Pull Requests settings**:
- ✅ Allow merge commits
- ✅ Allow squash merging
- ✅ Allow rebase merging
- ✅ Always suggest updating pull request branches
- ✅ Automatically delete head branches

Click **"Save changes"**

---

## Step 2: Clone Repository Locally

### 2.1 Get Repository URL

1. Go to repository main page
2. Click green **"Code"** button
3. Copy URL:
   - HTTPS: `https://github.com/YOUR-ORG/main-application.git`
   - SSH: `git@github.com:YOUR-ORG/main-application.git` (recommended)

### 2.2 Clone the Repository

```bash
# Navigate to your workspace directory
cd ~/workspace
# Or on Windows:
# cd C:\Users\YourName\workspace

# Clone the repository
git clone https://github.com/YOUR-ORG/main-application.git

# Navigate into repository
cd main-application
```

### 2.3 Verify Clone

```bash
# Check remote configuration
git remote -v
# Should show:
# origin  https://github.com/YOUR-ORG/main-application.git (fetch)
# origin  https://github.com/YOUR-ORG/main-application.git (push)

# Check current branch
git branch
# Should show:
# * main
```

---

## Step 3: Configure Git

### 3.1 Set User Information

```bash
# Set your name (use your real name)
git config user.name "Your Full Name"

# Set your email (use company email)
git config user.email "your.email@tcc.com"

# Verify configuration
git config --list
```

### 3.2 Set Up SSH Keys (Recommended)

**Why SSH?**
- More secure than HTTPS
- No need to enter password repeatedly
- Industry best practice

**Generate SSH Key:**

```bash
# Generate new ED25519 SSH key
ssh-keygen -t ed25519 -C "your.email@tcc.com"

# Press Enter for default location (~/.ssh/id_ed25519)
# Enter a passphrase when prompted (recommended)

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH private key to agent
ssh-add ~/.ssh/id_ed25519
```

**Add SSH Key to GitHub:**

```bash
# Display and copy public key
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

Then:
1. Go to GitHub → Settings (your profile, not repository)
2. Click **SSH and GPG keys**
3. Click **"New SSH key"**
4. Fill in:
   - Title: "Work Laptop" (or descriptive name)
   - Key: Paste your public key
5. Click **"Add SSH key"**

**Test SSH Connection:**

```bash
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated..."
```

**Update Repository Remote to Use SSH:**

```bash
# Change remote URL to SSH
git remote set-url origin git@github.com:YOUR-ORG/main-application.git

# Verify
git remote -v
# Should now show SSH URLs
```

---

## Step 4: Create Branch Structure

### 4.1 Create Development Branch

```bash
# Create and checkout develop branch from main
git checkout -b develop

# Push develop branch to remote
git push -u origin develop
```

### 4.2 Verify Branches

```bash
# List all branches (local and remote)
git branch -a

# Should show:
#   * develop
#     main
#     remotes/origin/develop
#     remotes/origin/main
```

### 4.3 Set Default Branch (Optional)

If you want `develop` to be the default branch for new PRs:

1. Go to repository on GitHub
2. Navigate to **Settings → Branches**
3. Under "Default branch", click switch icon
4. Select `develop`
5. Click **"Update"**
6. Confirm the change

---

## Step 5: Open Project in IDE

### Option A: VS Code

#### 5.1 Open Repository

```bash
# From terminal (in repository directory)
code .

# Or use VS Code: File → Open Folder → Select main-application
```

#### 5.2 Install Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "eamodio.gitlens",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

When you open the workspace, VS Code will prompt to install these extensions.

#### 5.3 Configure Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "github.copilot.enable": {
    "*": true
  },
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true
}
```

#### 5.4 Verify Copilot in VS Code

- Look for GitHub Copilot icon in bottom status bar (right side)
- Should show **green checkmark** (active)
- Click icon to see status and settings
- If not active, click to troubleshoot

---

### Option B: IntelliJ IDEA

#### 5.1 Open Project

1. Launch IntelliJ IDEA
2. Click **File → Open**
3. Navigate to and select `main-application` folder
4. Click **"Open"**
5. Wait for project to index

#### 5.2 Configure VCS

- IntelliJ should auto-detect Git
- If not detected:
  1. Go to **VCS → Enable Version Control Integration**
  2. Select **Git**
  3. Click **OK**

#### 5.3 Install Required Plugins

1. Go to **File → Settings → Plugins**
2. Click **"Marketplace"** tab
3. Search and install:
   - **GitHub Copilot** (required)
   - **GitToolBox** (recommended)
   - **.ignore** (recommended)
4. Click **"Apply"** and restart IDE

#### 5.4 Verify Copilot in IntelliJ

1. Go to **Tools → GitHub Copilot**
2. Ensure **"Enable GitHub Copilot"** is checked
3. Look for Copilot icon in bottom status bar
4. Status should show as "Active"

---

## Step 6: Test IDE and Copilot Integration

### 6.1 Test Git Integration

Create a test file:

```bash
echo "# Test File" > test.md
```

In IDE:
1. Source control panel should show `test.md` as new file
2. **Stage** the file (click + icon or "Stage")
3. **Commit** with message: `test: Add test file`
4. **Push** to remote

Verify on GitHub that test.md appears in repository.

### 6.2 Test Copilot Code Suggestions

Create new file `test.js` in your IDE:

```javascript
// Function to calculate the sum of two numbers
```

1. Press **Enter** after the comment
2. Wait 1-2 seconds
3. Copilot should suggest function implementation
4. Press **Tab** to accept suggestion
5. Expected output:

```javascript
function sum(a, b) {
  return a + b;
}
```

If suggestions appear, Copilot is working! ✅

### 6.3 Test Copilot Chat

1. Open Copilot Chat:
   - **VS Code**: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac)
   - **IntelliJ**: `Ctrl+Shift+A`, type "Copilot Chat"

2. Ask a question:
   ```
   How do I read a file in Node.js?
   ```

3. Should receive response with code example

If chat responds, integration is complete! ✅

---

## Step 7: Create Initial Project Structure

### 7.1 Create Directory Structure

```bash
# Create standard application folders
mkdir -p src/{components,services,utils}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs
mkdir -p config
```

**Folder Purpose**:
- `src/` - Source code
  - `components/` - Reusable components
  - `services/` - Business logic services
  - `utils/` - Utility functions
- `tests/` - Test files
  - `unit/` - Unit tests
  - `integration/` - Integration tests
  - `e2e/` - End-to-end tests
- `docs/` - Documentation
- `config/` - Configuration files

### 7.2 Create Entry Point

Create `src/index.js`:

```javascript
/**
 * Main application entry point
 * 
 * This file initializes and starts the application.
 */

console.log('Hello from main application!');

/**
 * Starts the application
 */
function start() {
  console.log('Application started');
  // Additional startup logic here
}

module.exports = {
  start
};
```

### 7.3 Commit Project Structure

```bash
# Stage all new files
git add .

# Commit with descriptive message
git commit -m "chore: Add initial project structure with src, tests, and docs folders"

# Push to remote
git push
```

Verify on GitHub that folder structure is visible.

---

## Step 8: Add Team Members as Collaborators

### 8.1 Configure Team Access

1. Go to repository on GitHub
2. Click **Settings** tab
3. Click **Collaborators and teams** (left sidebar)
4. Click **"Add teams"** button
5. Add teams with appropriate permissions:

| Team | Permission Level | Reason |
|------|-----------------|--------|
| backend-team | Write | Can push code, create PRs |
| frontend-team | Write | Can push code, create PRs |
| devops-team | Admin | Full access for CI/CD setup |
| qa-team | Write | Can push test code, create issues |

### 8.2 Verify Team Access

**Ask team members to**:
1. Navigate to organization: `https://github.com/YOUR-ORG`
2. Verify they can see `main-application` repository
3. Try cloning repository
4. Confirm they can see all branches

---

## Step 9: Create IDE Setup Guide for Team

Create `docs/IDE_SETUP.md`:

````markdown
# IDE Setup Guide

This guide helps team members set up their development environment.

## Prerequisites

- Git installed
- GitHub account with organization access
- IDE installed (VS Code or IntelliJ IDEA)
- GitHub Copilot license assigned

---

## VS Code Setup

### 1. Install VS Code

Download from: https://code.visualstudio.com/

### 2. Install Required Extensions

Open VS Code and install these extensions:

1. **GitHub Copilot** (Required)
   - Extension ID: `GitHub.copilot`
   
2. **GitHub Copilot Chat** (Required)
   - Extension ID: `GitHub.copilot-chat`
   
3. **GitLens** (Recommended)
   - Extension ID: `eamodio.gitlens`
   
4. **ESLint** (Recommended)
   - Extension ID: `dbaeumer.vscode-eslint`
   
5. **Prettier** (Recommended)
   - Extension ID: `esbenp.prettier-vscode`

**Installation Method**:
- Press `Ctrl+Shift+X` to open Extensions
- Search for each extension
- Click "Install"

### 3. Clone Repository

```bash
# Using SSH (recommended)
git clone git@github.com:YOUR-ORG/main-application.git

# Or using HTTPS
git clone https://github.com/YOUR-ORG/main-application.git

# Navigate to directory
cd main-application

# Open in VS Code
code .
```

### 4. Sign In to GitHub Copilot

1. Click Copilot icon in bottom status bar
2. Click "Sign in to GitHub"
3. Authenticate in browser
4. Return to VS Code
5. Verify green checkmark appears

### 5. Verify Setup

- ✅ Copilot icon shows green checkmark
- ✅ Source control shows Git integration
- ✅ Can see repository files
- ✅ Extensions are active

---

## IntelliJ IDEA Setup

### 1. Install IntelliJ IDEA

Download from: https://www.jetbrains.com/idea/

**Editions**:
- Community Edition (Free) - For Java, Kotlin
- Ultimate Edition (Paid) - All languages, frameworks

### 2. Install Required Plugins

1. Open IntelliJ IDEA
2. Go to **File → Settings → Plugins**
3. Click **"Marketplace"** tab
4. Install these plugins:
   - **GitHub Copilot** (Required)
   - **GitToolBox** (Recommended)
   - **.ignore** (Recommended)
5. Restart IDE when prompted

### 3. Clone Repository

**Option A: From Welcome Screen**
1. Click "Get from VCS"
2. Enter repository URL
3. Choose directory location
4. Click "Clone"

**Option B: From Menu**
1. File → New → Project from Version Control
2. Enter repository URL
3. Click "Clone"

### 4. Sign In to GitHub Copilot

1. After installation, Copilot prompt appears
2. Click "Sign in to GitHub"
3. Authenticate in browser
4. Return to IntelliJ
5. Check status in bottom bar

### 5. Verify Setup

- ✅ Copilot icon visible in bottom status bar
- ✅ VCS integration active
- ✅ Can see Git branches
- ✅ Copilot status shows "Active"

---

## Common Issues and Solutions

### Issue: Copilot Not Working

**Symptoms**: No suggestions, red X on icon

**Solutions**:
1. Check you're signed in to GitHub
2. Verify Copilot license is assigned (check with PM)
3. Restart IDE
4. Check internet connection
5. Try disabling and re-enabling Copilot

**VS Code**:
- Click Copilot icon → View logs
- Check for error messages

**IntelliJ**:
- Tools → GitHub Copilot → Check status
- View → Tool Windows → Notifications

### Issue: Git Authentication Failed

**Symptoms**: Can't push/pull, authentication errors

**Solutions**:

**For SSH**:
1. Verify SSH key is added to GitHub
2. Test: `ssh -T git@github.com`
3. Check SSH agent is running
4. Re-add key: `ssh-add ~/.ssh/id_ed25519`

**For HTTPS**:
1. Use Personal Access Token (PAT) instead of password
2. Generate PAT: GitHub → Settings → Developer settings → Personal access tokens
3. Use PAT as password when prompted

### Issue: Can't See Repository

**Symptoms**: Repository not visible in organization

**Solutions**:
1. Verify you accepted organization invitation
2. Check with PM that you're added to correct team
3. Refresh GitHub page
4. Check repository permissions

### Issue: Workspace Settings Not Working

**Symptoms**: Code not formatting, linting not working

**Solutions**:
1. Ensure extensions are installed and enabled
2. Check `.vscode/settings.json` exists
3. Reload window: `Ctrl+Shift+P` → "Reload Window"
4. Verify extension settings don't conflict

---

## Getting Help

### Internal Support

- **Slack**: #dev-help channel
- **Email**: devops-team@tcc.com
- **Documentation**: `/docs` folder in repository

### External Resources

- **VS Code Docs**: https://code.visualstudio.com/docs
- **IntelliJ Docs**: https://www.jetbrains.com/help/idea/
- **GitHub Copilot Docs**: https://docs.github.com/copilot
- **Git Docs**: https://git-scm.com/doc

---

## Next Steps

After setup is complete:

1. ✅ Read `README.md` in repository root
2. ✅ Review `CONTRIBUTING.md` for contribution guidelines
3. ✅ Join daily standup meetings
4. ✅ Pick up first task from project board
5. ✅ Attend Copilot training session (if not yet completed)

**Welcome to the team! Happy coding! 🚀**
````

Save and commit:

```bash
git add docs/IDE_SETUP.md
git commit -m "docs: Add IDE setup guide for team members"
git push
```

---

## Step 10: Validation

### 10.1 Validation Checklist

**Repository Setup**:
- [ ] Repository created on GitHub
- [ ] Repository is private
- [ ] README, .gitignore, and license added
- [ ] Repository settings configured
- [ ] Team access configured

**Local Setup**:
- [ ] Repository cloned locally
- [ ] Git configured (user.name, user.email)
- [ ] SSH keys set up (recommended)
- [ ] Develop branch created and pushed

**IDE Configuration**:
- [ ] IDE opened and connected to repository
- [ ] Copilot extension installed
- [ ] Copilot verified and working
- [ ] Workspace settings configured (VS Code)
- [ ] Git integration tested

**Project Structure**:
- [ ] Directory structure created
- [ ] Entry point file created (`src/index.js`)
- [ ] Structure committed and pushed
- [ ] Visible on GitHub

**Team Onboarding**:
- [ ] Team members added as collaborators
- [ ] IDE setup guide created
- [ ] Team can access repository

### 10.2 Testing Commands

```bash
# Test 1: Verify Git configuration
git config --list | grep user

# Test 2: Verify remote connection
git remote -v

# Test 3: Verify branches
git branch -a

# Test 4: Test push access
echo "test" > test-file.txt
git add test-file.txt
git commit -m "test: Verify push access"
git push

# Test 5: Clean up test file
git rm test-file.txt
git commit -m "test: Remove test file"
git push

# Test 6: Verify SSH (if configured)
ssh -T git@github.com
```

### 10.3 Expected Results

✅ **Successful Setup Indicators**:
- Repository visible on GitHub with all files
- Can push and pull without errors
- Copilot icon shows green checkmark in IDE
- Copilot provides suggestions when typing code
- All team members can clone and access repository
- Git operations work smoothly

❌ **Common Issues**:
- Red X on Copilot icon → Check license assignment
- Authentication errors → Set up SSH or PAT
- No suggestions → Check Copilot is enabled and signed in
- Can't push → Check write permissions

---

## Deliverables

✅ **Completed Items**:
1. Main application repository created and configured
2. Local development environment set up
3. IDE connected with working Copilot integration
4. Initial project structure created (`src/`, `tests/`, `docs/`, `config/`)
5. Team members added with appropriate permissions
6. IDE setup guide documented for team onboarding

---

## Success Metrics

- **Repository Access**: 100% of team members can clone and access
- **Copilot Integration**: 100% of developers have working Copilot
- **Git Workflow**: All developers can commit and push successfully
- **Development Readiness**: Environment ready for actual development work

---

## Next Steps

1. ✅ Repository is ready for development
2. → Proceed to [Task 5: Write README and Contribution Guide](Task-05-DEV-Documentation.md)
3. → Set up CI/CD pipelines (Phase 2)
4. → Begin feature development

---

**Related Tasks**:
- Previous: [Task 3: Coordinate Copilot Activation](Task-03-PM-Copilot.md)
- Next: [Task 5: Write README and Contribution Guide](Task-05-DEV-Documentation.md)
- See also: [Task 6: Set Up Issue Labels](Task-06-DEV-Labels.md)

---

**Prepared by**: Development Team
**Last Updated**: November 2025
**Version**: 1.0
