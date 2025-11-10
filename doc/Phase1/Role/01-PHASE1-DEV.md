# Phase 1: Foundation Setup - Developer Role Guide

## Overview

This guide contains all tasks assigned to the **Developer** role in Phase 1 of the GitHub Enterprise and Copilot implementation at TCC. Follow each section carefully to ensure successful setup.

**Role**: Developer
**Duration**: Tasks 4-6 (November 10-14, 2025)
**Total Estimated Time**: 5-7 hours

---

## Table of Contents

- [Task 4: Create Main Repository and Connect IDE](#task-4-create-main-repository-and-connect-ide)
- [Task 5: Write README and Contribution Guide](#task-5-write-readme-and-contribution-guide)
- [Task 6: Set Up Issue Labels and Branch Structure](#task-6-set-up-issue-labels-and-branch-structure)

---

# Task 4: Create Main Repository and Connect IDE

**Responsible**: Developer
**Estimated Time**: 1-2 hours

## Objective

Set up the main application repository, configure local development environment, connect IDE with Copilot, and prepare the initial project structure.

## Prerequisites

- GitHub Organization created
- Git installed locally
- IDE installed (VS Code or IntelliJ)
- GitHub Copilot extension installed

## Step-by-Step Instructions

### Step 1: Create Repository on GitHub

1. **Navigate to Organization**
   ```
   Go to: https://github.com/YOUR-ORG
   ```

2. **Create New Repository**
   - Click "New" or "New repository"
   - Fill in details:
     ```
     Repository name: main-application
     Description: Main application repository
     Visibility: Private
     Initialize this repository with:
       ✅ Add a README file
       ✅ Add .gitignore: Choose template (e.g., Node, Python, Java)
       ✅ Choose a license: MIT License (or as per company policy)
     ```

3. **Click "Create repository"**

4. **Configure Repository Settings**
   ```
   Go to: Settings tab
   ```

   **General Settings:**
   - Features:
     - ✅ Issues
     - ✅ Projects
     - ✅ Wiki (optional)
     - ✅ Discussions (optional)

   **Pull Requests:**
   - ✅ Allow merge commits
   - ✅ Allow squash merging
   - ✅ Allow rebase merging
   - ✅ Always suggest updating pull request branches
   - ✅ Automatically delete head branches

### Step 2: Clone Repository Locally

1. **Get Repository URL**
   - Click green "Code" button
   - Copy HTTPS or SSH URL
   - Example: `https://github.com/YOUR-ORG/main-application.git`

2. **Clone Repository**
   ```bash
   # Navigate to your workspace
   cd ~/workspace
   # or
   cd C:\Users\YourName\workspace

   # Clone the repository
   git clone https://github.com/YOUR-ORG/main-application.git

   # Navigate into repository
   cd main-application
   ```

3. **Verify Clone**
   ```bash
   # Check remote
   git remote -v
   # Should show:
   # origin  https://github.com/YOUR-ORG/main-application.git (fetch)
   # origin  https://github.com/YOUR-ORG/main-application.git (push)

   # Check branch
   git branch
   # Should show:
   # * main
   ```

### Step 3: Configure Git

1. **Set User Information**
   ```bash
   # Set your name
   git config user.name "Your Full Name"

   # Set your email
   git config user.email "your.email@tcc.com"

   # Verify configuration
   git config --list
   ```

2. **Set Up SSH (Recommended)**

   **Generate SSH Key:**
   ```bash
   # Generate new SSH key
   ssh-keygen -t ed25519 -C "your.email@tcc.com"

   # Press Enter for default location
   # Enter passphrase (recommended)

   # Start SSH agent
   eval "$(ssh-agent -s)"

   # Add SSH key
   ssh-add ~/.ssh/id_ed25519
   ```

   **Add SSH Key to GitHub:**
   ```bash
   # Copy SSH public key
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```

   Then:
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Title: "Work Laptop"
   - Paste key
   - Click "Add SSH key"

   **Test Connection:**
   ```bash
   ssh -T git@github.com
   # Should see: Hi username! You've successfully authenticated...
   ```

   **Update Remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:YOUR-ORG/main-application.git
   ```

### Step 4: Create Branch Structure

1. **Create Development Branch**
   ```bash
   # Create and checkout develop branch
   git checkout -b develop

   # Push to remote
   git push -u origin develop
   ```

2. **Verify Branches**
   ```bash
   # List all branches
   git branch -a
   # Should show:
   # * develop
   #   main
   #   remotes/origin/develop
   #   remotes/origin/main
   ```

3. **Set Default Branch (Optional)**
   - Go to repository on GitHub
   - Settings → Branches
   - Change default branch to `develop` if desired
   - Click "Update" and confirm

### Step 5: Open Project in IDE

#### For VS Code:

1. **Open Repository**
   ```bash
   # From terminal
   code .

   # Or use VS Code File → Open Folder
   ```

2. **Install Recommended Extensions**

   Create `.vscode/extensions.json`:
   ```json
   {
     "recommendations": [
       "github.copilot",
       "github.copilot-chat",
       "eamodio.gitlens",
       "ms-vscode.vscode-eslint",
       "dbaeumer.vscode-eslint",
       "esbenp.prettier-vscode"
     ]
   }
   ```

3. **Configure Workspace Settings**

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
     "files.trimTrailingWhitespace": true
   }
   ```

4. **Verify Copilot**
   - Look for Copilot icon in bottom right
   - Should show green checkmark
   - Click icon to verify status

#### For IntelliJ IDEA:

1. **Open Project**
   - File → Open
   - Select `main-application` folder
   - Click "Open"

2. **Configure VCS**
   - Should auto-detect Git
   - If not: VCS → Enable Version Control Integration → Git

3. **Install Plugins**
   - File → Settings → Plugins
   - Install:
     - GitHub Copilot
     - GitToolBox
     - .ignore

4. **Verify Copilot**
   - Tools → GitHub Copilot
   - Check "Enable GitHub Copilot"
   - Look for Copilot status in bottom right

### Step 6: Test IDE and Copilot Integration

1. **Test Git Integration**

   Create test file:
   ```bash
   echo "# Test File" > test.md
   ```

   In IDE:
   - Should see test.md in source control panel
   - Stage the file
   - Commit with message: "test: Add test file"
   - Push to remote

2. **Test Copilot**

   Create new file `test.js`:
   ```javascript
   // Function to calculate the sum of two numbers
   ```

   - Press Enter
   - Wait for Copilot suggestion
   - Press Tab to accept
   - Should generate:
   ```javascript
   function sum(a, b) {
     return a + b;
   }
   ```

3. **Test Copilot Chat**
   - Open Copilot Chat (Ctrl+Shift+I)
   - Ask: "How do I read a file in Node.js?"
   - Should get response with code example

### Step 7: Create Initial Project Structure

1. **Create Project Folders**
   ```bash
   # Create standard structure
   mkdir -p src/{components,services,utils}
   mkdir -p tests/{unit,integration,e2e}
   mkdir -p docs
   mkdir -p config
   ```

2. **Create Index File**

   `src/index.js`:
   ```javascript
   /**
    * Main application entry point
    */

   console.log('Hello from main application!');

   // Export main function
   module.exports = {
     start: () => {
       console.log('Application started');
     }
   };
   ```

3. **Commit Structure**
   ```bash
   git add .
   git commit -m "chore: Add initial project structure"
   git push
   ```

### Step 8: Add Team Members as Collaborators

1. **Add Team Access**
   - Go to repository on GitHub
   - Settings → Collaborators and teams
   - Click "Add teams"
   - Select teams and permission level:
     - `backend-team`: Write
     - `frontend-team`: Write
     - `devops-team`: Admin
     - `qa-team`: Write

2. **Verify Access**
   - Team members should see repository in their organization
   - Team members can clone repository

### Step 9: Create IDE Setup Guide for Team

Create `docs/IDE_SETUP.md`:

```markdown
# IDE Setup Guide

## VS Code Setup

### 1. Install VS Code
Download from: https://code.visualstudio.com/

### 2. Install Required Extensions
- GitHub Copilot
- GitHub Copilot Chat
- GitLens
- ESLint
- Prettier

### 3. Clone Repository
\`\`\`bash
git clone git@github.com:YOUR-ORG/main-application.git
cd main-application
code .
\`\`\`

### 4. Verify Setup
- Copilot icon shows green checkmark
- Source control shows Git integration
- Extensions are active

## IntelliJ IDEA Setup

### 1. Install IntelliJ IDEA
Download from: https://www.jetbrains.com/idea/

### 2. Install Plugins
- GitHub Copilot
- GitToolBox

### 3. Clone Repository
- File → New → Project from Version Control
- Enter repository URL
- Click "Clone"

### 4. Verify Setup
- Copilot status shows in bottom right
- VCS integration is active

## Troubleshooting

### Copilot Not Working
1. Check you're signed in to GitHub
2. Verify license is activated
3. Reload IDE
4. Check status bar icon

### Git Authentication Issues
1. Set up SSH keys (see main README)
2. Or use Personal Access Token
3. Verify credentials in IDE settings

### Need Help?
- Slack: #dev-help
- Email: devops-team@tcc.com
```

### Step 10: Validation

**Checklist:**
- [ ] Repository created on GitHub
- [ ] Repository cloned locally
- [ ] Git configured (username, email)
- [ ] SSH keys set up (optional but recommended)
- [ ] Branch structure created (main, develop)
- [ ] IDE opened and connected to repository
- [ ] Copilot installed and verified in IDE
- [ ] Git integration tested (commit, push)
- [ ] Copilot suggestions working
- [ ] Team members added as collaborators
- [ ] Initial project structure created
- [ ] IDE setup guide created

**Expected Results:**
- Repository visible on GitHub
- Can push and pull from local
- Copilot shows green checkmark in IDE
- Copilot suggestions appear when coding
- All team members can access repository

**Test Commands:**
```bash
# Verify git configuration
git config --list

# Verify remote
git remote -v

# Verify branches
git branch -a

# Test push
echo "test" > test.txt
git add test.txt
git commit -m "test: Verify push access"
git push

# Clean up
git rm test.txt
git commit -m "test: Remove test file"
git push
```

## Deliverables

- ✅ Main application repository created
- ✅ Local development environment configured
- ✅ IDE connected with Copilot
- ✅ Initial project structure in place
- ✅ Team access configured
- ✅ IDE setup guide documented

## Success Metrics

- Repository accessible by all team members
- All developers have working Copilot integration
- Git workflows functional
- Development environment ready for coding

---

# Task 5: Write README and Contribution Guide

**Responsible**: Developer
**Estimated Time**: 2-3 hours

## Objective

Create comprehensive documentation including README, Contributing guidelines, Code of Conduct, and Pull Request templates to ensure consistent development practices across the team.

## Prerequisites

- Repository created and cloned
- IDE set up with Copilot
- Understanding of project purpose and tech stack

## Step-by-Step Instructions

### Step 1: Create Comprehensive README

1. **Open README.md** in your IDE

2. **Use Copilot to Help Write README**

   Start by adding a comment:
   ```markdown
   <!-- Create a comprehensive README for a Node.js application with sections for description, installation, usage, and contributing -->
   ```

3. **Write README Content**

```markdown
# Main Application

![Build Status](https://github.com/YOUR-ORG/main-application/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Description

Brief description of what this application does and its purpose.

### Key Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
  ```bash
  node --version
  ```

- **npm** (v10.x or higher) or **yarn** (v1.22.x or higher)
  ```bash
  npm --version
  ```

- **PostgreSQL** (v15 or higher)
  ```bash
  psql --version
  ```

- **Git**
  ```bash
  git --version
  ```

## Installation

### 1. Clone the Repository

```bash
git clone git@github.com:YOUR-ORG/main-application.git
cd main-application
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# External Services
API_KEY=your-api-key
```

### 4. Set Up Database

```bash
# Create database
createdb myapp_dev

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Server port | `3000` | No |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `DB_NAME` | Database name | - | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |

### Configuration Files

- `config/default.json` - Default configuration
- `config/development.json` - Development environment
- `config/production.json` - Production environment

## Running the Application

### Development Mode

Start the application with hot reload:

```bash
npm run dev
# or
yarn dev
```

Application will be available at: http://localhost:3000

### Production Mode

```bash
# Build application
npm run build

# Start production server
npm start
```

### Using Docker

```bash
# Build image
docker build -t main-application .

# Run container
docker run -p 3000:3000 --env-file .env main-application
```

Or use Docker Compose:

```bash
docker-compose up
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Unit Tests

```bash
npm run test:unit
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage report will be available at: `coverage/lcov-report/index.html`

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Project Structure

```
main-application/
├── src/
│   ├── components/       # Reusable components
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── controllers/      # Route controllers
│   └── index.js          # Application entry point
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── config/               # Configuration files
├── docs/                 # Documentation
├── scripts/              # Utility scripts
├── .github/              # GitHub workflows and templates
├── .env.example          # Example environment file
├── .gitignore            # Git ignore rules
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # NPM dependencies
└── README.md             # This file
```

## API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production: https://api.yourcompany.com/api
```

### Authentication

Most endpoints require authentication. Include JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

#### Users

```http
GET /api/users
POST /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

For full API documentation, see [API.md](docs/API.md)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Getting Help

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/YOUR-ORG/main-application/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/YOUR-ORG/main-application/discussions)
- **Slack**: #dev-help channel
- **Email**: devops-team@tcc.com

### Frequently Asked Questions

See our [FAQ](docs/FAQ.md) for common questions and answers.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## Roadmap

See our [project board](https://github.com/YOUR-ORG/main-application/projects) for upcoming features and improvements.

---

**Maintained by**: Engineering Team @ TCC
**Last Updated**: November 2025
```

4. **Save and Commit**
   ```bash
   git add README.md
   git commit -m "docs: Add comprehensive README"
   git push
   ```

### Step 2: Create Contributing Guide

1. **Create CONTRIBUTING.md**

```markdown
# Contributing to Main Application

First off, thank you for considering contributing to Main Application! It's people like you that make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible using our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml).

**Good Bug Reports Include:**

- A clear and descriptive title
- Detailed steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml).

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `beginner` - Simple issues to get started

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone git@github.com:YOUR-USERNAME/main-application.git
cd main-application
```

### 2. Create a Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-new-feature

# Or for bug fix
git checkout -b bugfix/fix-something
```

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical production fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

Examples:
- `feature/add-user-authentication`
- `bugfix/fix-login-error`
- `docs/update-readme`

### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your local settings
nano .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### 4. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Use meaningful variable and function names

### 5. Test Your Changes

```bash
# Run all tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check code coverage
npm run test:coverage
```

### 6. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with meaningful message
git commit -m "feat: Add user authentication"
```

See [Commit Message Guidelines](#commit-message-guidelines) below.

### 7. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

## Coding Standards

### JavaScript/TypeScript Style Guide

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications.

**Key Rules:**

```javascript
// ✅ Good
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad
function calculate_total(items){
  var sum = 0;
  for(var i=0;i<items.length;i++){
    sum=sum+items[i].price;
  }
  return sum;
}
```

### Code Organization

```javascript
// 1. Imports
import express from 'express';
import { validateUser } from './utils';

// 2. Constants
const PORT = process.env.PORT || 3000;

// 3. Type definitions (if TypeScript)
interface User {
  id: string;
  name: string;
}

// 4. Helper functions
function formatDate(date) {
  return date.toISOString();
}

// 5. Main functions
export function createUser(userData) {
  // Implementation
}

// 6. Exports
export default { createUser };
```

### Naming Conventions

```javascript
// Variables and functions: camelCase
const userCount = 10;
function getUserById(id) {}

// Classes: PascalCase
class UserService {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Private methods: prefix with underscore
function _validateInternally() {}

// Boolean variables: prefix with is/has/should
const isValid = true;
const hasPermission = false;
const shouldUpdate = true;
```

### Documentation

Use JSDoc for functions:

```javascript
/**
 * Calculate the total price of items
 * @param {Array<Object>} items - Array of items with price property
 * @param {number} discountPercent - Discount percentage to apply
 * @returns {number} Total price after discount
 * @throws {Error} If items array is empty
 * @example
 * calculateTotal([{price: 10}, {price: 20}], 10)
 * // Returns: 27
 */
function calculateTotal(items, discountPercent = 0) {
  if (items.length === 0) {
    throw new Error('Items array cannot be empty');
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 - discountPercent / 100);
}
```

### Error Handling

```javascript
// ✅ Good - Specific error handling
try {
  const user = await getUserById(id);
  return user;
} catch (error) {
  if (error.code === 'USER_NOT_FOUND') {
    throw new NotFoundError(`User ${id} not found`);
  }
  throw new DatabaseError('Failed to fetch user', error);
}

// ❌ Bad - Generic error handling
try {
  const user = await getUserById(id);
  return user;
} catch (error) {
  console.log(error);
  return null;
}
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of:

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Code style changes (formatting, semicolons, etc)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependency updates
- `ci` - CI/CD changes
- `build` - Build system changes

### Scope (Optional)

The scope should be the name of the affected module:

- `auth`
- `api`
- `database`
- `ui`
- `docs`

### Subject

- Use imperative, present tense: "change" not "changed" or "changes"
- Don't capitalize first letter
- No period at the end
- Maximum 72 characters

### Examples

```
feat(auth): add JWT token validation

Implement JWT token validation middleware to verify tokens on protected routes.

Closes #123
```

```
fix(api): resolve null pointer exception in user endpoint

Added null check before accessing user.email property.

Fixes #456
```

```
docs: update installation instructions

Added Docker installation steps and troubleshooting section.
```

```
test(auth): add unit tests for login function

Increased test coverage for authentication module to 85%.
```

### Breaking Changes

Breaking changes must be indicated in the footer:

```
feat(api): change user endpoint response format

BREAKING CHANGE: User endpoint now returns camelCase instead of snake_case.

Migration guide: Update all API clients to expect camelCase properties.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Branch is up to date with main

### PR Title

Follow commit message format:

```
feat: Add user profile page
fix: Resolve memory leak in data processor
docs: Update API documentation
```

### PR Description

Use the PR template and include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added
- [ ] Documentation updated
```

### Review Process

1. **Automatic Checks**
   - CI pipeline must pass
   - Code coverage must meet threshold (80%)
   - No linting errors

2. **Code Review**
   - At least 1 approval required
   - Address all review comments
   - Resolve all conversations

3. **Testing**
   - Reviewer tests changes locally
   - Verify all acceptance criteria met

4. **Merge**
   - Squash and merge preferred
   - Delete branch after merge

### Responding to Feedback

```bash
# Update your branch
git checkout feature/my-feature

# Make requested changes
# ... edit files ...

# Commit changes
git add .
git commit -m "fix: address review feedback"

# Push updates
git push origin feature/my-feature
```

## Testing Guidelines

### Test Structure

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      // Act
      const user = await UserService.createUser(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should throw error for invalid email', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      // Act & Assert
      await expect(UserService.createUser(userData))
        .rejects
        .toThrow('Invalid email format');
    });
  });
});
```

### Test Coverage

Aim for:
- **Overall**: ≥ 80%
- **Critical paths**: 100%
- **New features**: ≥ 90%

### Test Types

1. **Unit Tests**
   - Test individual functions
   - Mock external dependencies
   - Fast execution

2. **Integration Tests**
   - Test component interactions
   - Use test database
   - Test API endpoints

3. **E2E Tests**
   - Test complete user flows
   - Use real browser
   - Test critical paths only

## Getting Help

### Resources

- **Documentation**: [docs/](docs/)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Docs**: [docs/API.md](docs/API.md)
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)

### Community

- **Slack**: #dev-help channel
- **Email**: devops-team@tcc.com
- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bugs and features only

### Mentorship

New to the project? Request a mentor in #dev-help channel!

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README

Thank you for contributing!
```

2. **Save and Commit**
   ```bash
   git add CONTRIBUTING.md
   git commit -m "docs: Add contribution guidelines"
   git push
   ```

### Step 3: Create Code of Conduct

1. **Create CODE_OF_CONDUCT.md**

```markdown
# Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to a positive environment:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior:

* The use of sexualized language or imagery
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information without explicit permission
* Other conduct which could reasonably be considered inappropriate in a professional setting

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement at devops-team@tcc.com.

All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 2.0.

[homepage]: https://www.contributor-covenant.org
```

2. **Save and Commit**
   ```bash
   git add CODE_OF_CONDUCT.md
   git commit -m "docs: Add code of conduct"
   git push
   ```

### Step 4: Create Pull Request Template

1. **Create .github/pull_request_template.md**

```markdown
## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test updates

## Related Issues

<!-- Link to related issues, e.g., "Fixes #123" or "Relates to #456" -->

Fixes #

## How Has This Been Tested?

<!-- Describe the tests you ran to verify your changes -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] E2E tests

**Test Configuration:**
- OS:
- Browser (if applicable):
- Node version:

## Screenshots (if applicable)

<!-- Add screenshots to demonstrate changes -->

## Checklist

<!-- Mark completed items with an "x" -->

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
- [ ] I have checked my code and corrected any misspellings
- [ ] I have updated the CHANGELOG.md (if applicable)

## Additional Notes

<!-- Add any additional notes for reviewers -->

## Reviewer Checklist

<!-- For reviewers to complete -->

- [ ] Code reviewed
- [ ] Tests pass
- [ ] Documentation is adequate
- [ ] Changes align with project standards
```

2. **Save and Commit**
   ```bash
   git add .github/pull_request_template.md
   git commit -m "docs: Add PR template"
   git push
   ```

### Step 5: Create CHANGELOG

1. **Create CHANGELOG.md**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- README documentation
- Contributing guidelines
- Code of Conduct
- Pull Request template

## [1.0.0] - 2025-11-10

### Added
- Initial release
- Basic project structure
- Development environment setup

[Unreleased]: https://github.com/YOUR-ORG/main-application/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR-ORG/main-application/releases/tag/v1.0.0
```

2. **Save and Commit**
   ```bash
   git add CHANGELOG.md
   git commit -m "docs: Add changelog"
   git push
   ```

### Step 6: Validation

**Checklist:**
- [ ] README.md created with all sections
- [ ] CONTRIBUTING.md created with guidelines
- [ ] CODE_OF_CONDUCT.md created
- [ ] Pull Request template created
- [ ] CHANGELOG.md created
- [ ] All documents reviewed for accuracy
- [ ] Links in documents work correctly
- [ ] Documents are easy to understand
- [ ] Team members can follow instructions

**Expected Results:**
- New contributors can understand project
- Setup instructions are clear and work
- Contributing process is documented
- All team members agree on standards

**Test:**
- Ask a new team member to follow README setup instructions
- Have someone review CONTRIBUTING.md for clarity
- Verify all links work

## Deliverables

- ✅ Comprehensive README.md
- ✅ Contributing guidelines (CONTRIBUTING.md)
- ✅ Code of Conduct (CODE_OF_CONDUCT.md)
- ✅ Pull Request template
- ✅ Changelog (CHANGELOG.md)

## Success Metrics

- New team members can set up project using README
- Contributing guide is clear and actionable
- All documentation links work
- Team agrees on coding standards

---

# Task 6: Set Up Issue Labels and Branch Structure

**Responsible**: Developer
**Estimated Time**: 1-2 hours

## Objective

Create a consistent labeling system for GitHub Issues and establish a robust branching strategy to support team collaboration and code quality.

## Prerequisites

- Repository created with admin access
- Understanding of team workflow

## Step-by-Step Instructions

### Step 1: Create Issue Labels

1. **Navigate to Labels**
   ```
   Repository → Issues → Labels
   ```

2. **Delete Default Labels (Optional)**
   - Click on each default label
   - Click "Delete label"
   - Confirm deletion

3. **Create Type Labels**

   Click "New label" for each:

   **Bug Label:**
   ```
   Name: type: bug
   Description: Something isn't working
   Color: #d73a4a (red)
   ```

   **Feature Label:**
   ```
   Name: type: feature
   Description: New feature or request
   Color: #0075ca (blue)
   ```

   **Enhancement Label:**
   ```
   Name: type: enhancement
   Description: Improvement to existing feature
   Color: #a2eeef (light blue)
   ```

   **Documentation Label:**
   ```
   Name: type: documentation
   Description: Documentation updates
   Color: #0075ca (blue)
   ```

   **Refactor Label:**
   ```
   Name: type: refactor
   Description: Code refactoring
   Color: #fbca04 (yellow)
   ```

4. **Create Priority Labels**

   **Critical:**
   ```
   Name: priority: critical
   Description: Critical priority - immediate action required
   Color: #b60205 (dark red)
   ```

   **High:**
   ```
   Name: priority: high
   Description: High priority
   Color: #d93f0b (red-orange)
   ```

   **Medium:**
   ```
   Name: priority: medium
   Description: Medium priority
   Color: #fbca04 (yellow)
   ```

   **Low:**
   ```
   Name: priority: low
   Description: Low priority
   Color: #0e8a16 (green)
   ```

5. **Create Status Labels**

   **Triage:**
   ```
   Name: status: triage
   Description: Needs triage
   Color: #ededed (gray)
   ```

   **In Progress:**
   ```
   Name: status: in-progress
   Description: Work in progress
   Color: #0052cc (dark blue)
   ```

   **Review:**
   ```
   Name: status: review
   Description: In review
   Color: #5319e7 (purple)
   ```

   **Blocked:**
   ```
   Name: status: blocked
   Description: Blocked by something
   Color: #000000 (black)
   ```

   **Won't Fix:**
   ```
   Name: status: wont-fix
   Description: Won't be fixed
   Color: #ffffff (white)
   ```

6. **Create Area Labels**

   **Frontend:**
   ```
   Name: area: frontend
   Description: Frontend related
   Color: #1d76db (blue)
   ```

   **Backend:**
   ```
   Name: area: backend
   Description: Backend related
   Color: #0e8a16 (green)
   ```

   **Database:**
   ```
   Name: area: database
   Description: Database related
   Color: #d4c5f9 (light purple)
   ```

   **DevOps:**
   ```
   Name: area: devops
   Description: DevOps/Infrastructure related
   Color: #f9d0c4 (light orange)
   ```

7. **Create Additional Labels**

   **Good First Issue:**
   ```
   Name: good first issue
   Description: Good for newcomers
   Color: #7057ff (purple)
   ```

   **Help Wanted:**
   ```
   Name: help wanted
   Description: Extra attention is needed
   Color: #008672 (teal)
   ```

   **Dependencies:**
   ```
   Name: dependencies
   Description: Pull requests that update a dependency file
   Color: #0366d6 (blue)
   ```

   **Breaking Change:**
   ```
   Name: breaking-change
   Description: Introduces breaking changes
   Color: #d73a4a (red)
   ```

### Step 2: Use GitHub CLI to Create Labels (Alternative Method)

If you prefer automation:

1. **Install GitHub CLI**
   ```bash
   # macOS
   brew install gh

   # Windows
   winget install --id GitHub.cli

   # Linux
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh
   ```

2. **Authenticate**
   ```bash
   gh auth login
   ```

3. **Create Labels Script**

   Create `scripts/create-labels.sh`:

   ```bash
   #!/bin/bash

   # Repository (format: owner/repo)
   REPO="YOUR-ORG/main-application"

   # Type labels
   gh label create "type: bug" --description "Something isn't working" --color "d73a4a" --repo $REPO
   gh label create "type: feature" --description "New feature or request" --color "0075ca" --repo $REPO
   gh label create "type: enhancement" --description "Improvement to existing feature" --color "a2eeef" --repo $REPO
   gh label create "type: documentation" --description "Documentation updates" --color "0075ca" --repo $REPO
   gh label create "type: refactor" --description "Code refactoring" --color "fbca04" --repo $REPO

   # Priority labels
   gh label create "priority: critical" --description "Critical priority" --color "b60205" --repo $REPO
   gh label create "priority: high" --description "High priority" --color "d93f0b" --repo $REPO
   gh label create "priority: medium" --description "Medium priority" --color "fbca04" --repo $REPO
   gh label create "priority: low" --description "Low priority" --color "0e8a16" --repo $REPO

   # Status labels
   gh label create "status: triage" --description "Needs triage" --color "ededed" --repo $REPO
   gh label create "status: in-progress" --description "Work in progress" --color "0052cc" --repo $REPO
   gh label create "status: review" --description "In review" --color "5319e7" --repo $REPO
   gh label create "status: blocked" --description "Blocked" --color "000000" --repo $REPO
   gh label create "status: wont-fix" --description "Won't be fixed" --color "ffffff" --repo $REPO

   # Area labels
   gh label create "area: frontend" --description "Frontend related" --color "1d76db" --repo $REPO
   gh label create "area: backend" --description "Backend related" --color "0e8a16" --repo $REPO
   gh label create "area: database" --description "Database related" --color "d4c5f9" --repo $REPO
   gh label create "area: devops" --description "DevOps related" --color "f9d0c4" --repo $REPO

   # Additional labels
   gh label create "good first issue" --description "Good for newcomers" --color "7057ff" --repo $REPO
   gh label create "help wanted" --description "Extra attention needed" --color "008672" --repo $REPO
   gh label create "dependencies" --description "Dependency updates" --color "0366d6" --repo $REPO
   gh label create "breaking-change" --description "Breaking changes" --color "d73a4a" --repo $REPO

   echo "Labels created successfully!"
   ```

4. **Run Script**
   ```bash
   chmod +x scripts/create-labels.sh
   ./scripts/create-labels.sh
   ```

### Step 3: Document Branch Structure

1. **Create Branch Strategy Document**

   Create `docs/BRANCHING_STRATEGY.md`:

   ```markdown
   # Branching Strategy

   ## Overview

   We follow a simplified Git Flow branching model.

   ## Branch Types

   ### Main Branches

   #### `main`
   - **Purpose**: Production-ready code
   - **Protected**: Yes
   - **Lifetime**: Permanent
   - **Deployed to**: Production
   - **Merge from**: `release/*` branches only
   - **Rules**:
     - Requires PR review (2 approvals)
     - Must pass all CI checks
     - Cannot force push
     - Cannot delete

   #### `develop`
   - **Purpose**: Integration branch for features
   - **Protected**: Yes
   - **Lifetime**: Permanent
   - **Deployed to**: Development environment
   - **Merge from**: `feature/*`, `bugfix/*`, `hotfix/*`
   - **Rules**:
     - Requires PR review (1 approval)
     - Must pass all CI checks
     - Cannot force push

   ### Supporting Branches

   #### `feature/*`
   - **Purpose**: Develop new features
   - **Created from**: `develop`
   - **Merge to**: `develop`
   - **Lifetime**: Temporary (delete after merge)
   - **Naming**: `feature/feature-name`

   **Examples:**
   - `feature/user-authentication`
   - `feature/payment-integration`
   - `feature/dashboard-redesign`

   **Workflow:**
   ```bash
   # Create feature branch
   git checkout develop
   git pull origin develop
   git checkout -b feature/user-authentication

   # Work on feature
   # ... make changes ...
   git add .
   git commit -m "feat: implement user authentication"

   # Keep updated with develop
   git fetch origin
   git rebase origin/develop

   # Push feature branch
   git push origin feature/user-authentication

   # Create PR to develop
   # After merge, delete branch
   git branch -d feature/user-authentication
   git push origin --delete feature/user-authentication
   ```

   #### `bugfix/*`
   - **Purpose**: Fix bugs in develop
   - **Created from**: `develop`
   - **Merge to**: `develop`
   - **Lifetime**: Temporary
   - **Naming**: `bugfix/bug-description`

   **Examples:**
   - `bugfix/login-error`
   - `bugfix/null-pointer-exception`
   - `bugfix/memory-leak`

   **Workflow:**
   ```bash
   git checkout develop
   git checkout -b bugfix/login-error
   # ... fix bug ...
   git commit -m "fix: resolve login error"
   git push origin bugfix/login-error
   # Create PR, merge, delete branch
   ```

   #### `hotfix/*`
   - **Purpose**: Fix critical bugs in production
   - **Created from**: `main`
   - **Merge to**: `main` AND `develop`
   - **Lifetime**: Temporary
   - **Naming**: `hotfix/critical-issue`

   **Examples:**
   - `hotfix/security-vulnerability`
   - `hotfix/data-loss-bug`
   - `hotfix/server-crash`

   **Workflow:**
   ```bash
   # Create hotfix from main
   git checkout main
   git checkout -b hotfix/security-vulnerability

   # Fix the issue
   # ... make changes ...
   git commit -m "fix: patch security vulnerability"

   # Merge to main
   git checkout main
   git merge --no-ff hotfix/security-vulnerability
   git tag -a v1.0.1 -m "Hotfix: Security patch"
   git push origin main --tags

   # Merge to develop
   git checkout develop
   git merge --no-ff hotfix/security-vulnerability
   git push origin develop

   # Delete hotfix branch
   git branch -d hotfix/security-vulnerability
   ```

   #### `release/*`
   - **Purpose**: Prepare new production release
   - **Created from**: `develop`
   - **Merge to**: `main` AND `develop`
   - **Lifetime**: Temporary
   - **Naming**: `release/v1.2.0`

   **Workflow:**
   ```bash
   # Create release branch
   git checkout develop
   git checkout -b release/v1.2.0

   # Final adjustments
   # - Bump version numbers
   # - Update CHANGELOG.md
   # - Final bug fixes only

   # Merge to main
   git checkout main
   git merge --no-ff release/v1.2.0
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin main --tags

   # Merge back to develop
   git checkout develop
   git merge --no-ff release/v1.2.0
   git push origin develop

   # Delete release branch
   git branch -d release/v1.2.0
   ```

   ## Commit Message Format

   Follow [Conventional Commits](https://www.conventionalcommits.org/):

   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   **Types:**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation
   - `style`: Formatting
   - `refactor`: Code restructuring
   - `perf`: Performance improvement
   - `test`: Adding tests
   - `chore`: Maintenance
   - `ci`: CI/CD changes

   **Examples:**
   ```
   feat(auth): add JWT token validation
   fix(api): resolve null pointer in user endpoint
   docs: update installation instructions
   refactor(database): optimize query performance
   ```

   ## Pull Request Workflow

   1. Create branch from appropriate base branch
   2. Make changes and commit
   3. Push branch to remote
   4. Create Pull Request
   5. Assign reviewers
   6. Address review comments
   7. Merge after approval
   8. Delete branch

   ## Branch Protection Rules

   ### Main Branch
   - Require pull request reviews (2)
   - Require status checks to pass
   - Require conversation resolution
   - Require signed commits (optional)
   - Include administrators
   - Restrict who can push (admins only)

   ### Develop Branch
   - Require pull request reviews (1)
   - Require status checks to pass
   - Allow force pushes: No

   ## Keeping Branches Updated

   ### Update Feature Branch with Develop
   ```bash
   git checkout feature/my-feature
   git fetch origin
   git rebase origin/develop
   # Or use merge if team prefers
   git merge origin/develop
   ```

   ### Resolve Merge Conflicts
   ```bash
   # If conflicts occur during rebase
   # Edit conflicted files
   git add <resolved-files>
   git rebase --continue

   # Or abort and try again
   git rebase --abort
   ```

   ## Best Practices

   1. **Keep branches short-lived** - Merge within 2-3 days
   2. **One feature per branch** - Don't mix multiple features
   3. **Commit often** - Small, focused commits
   4. **Pull before push** - Always update local branch first
   5. **Write good commit messages** - Clear and descriptive
   6. **Delete merged branches** - Keep repository clean
   7. **Use PR templates** - Ensure consistent PR descriptions
   8. **Tag releases** - Use semantic versioning
   9. **Never commit to main directly** - Always use PRs
   10. **Keep CI green** - Fix broken builds immediately

   ## Examples

   ### Starting New Feature
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/user-profile
   # Work on feature...
   git push origin feature/user-profile
   # Create PR on GitHub
   ```

   ### Updating Feature Branch
   ```bash
   git checkout feature/user-profile
   git fetch origin
   git rebase origin/develop
   git push --force-with-lease origin feature/user-profile
   ```

   ### Releasing New Version
   ```bash
   # From develop
   git checkout -b release/v2.0.0
   # Update version, changelog
   git commit -m "chore: prepare v2.0.0 release"

   # Merge to main
   git checkout main
   git merge --no-ff release/v2.0.0
   git tag -a v2.0.0 -m "Release v2.0.0"

   # Merge back to develop
   git checkout develop
   git merge --no-ff release/v2.0.0

   # Push everything
   git push origin main develop --tags
   ```

   ## Troubleshooting

   ### Accidentally Committed to Wrong Branch
   ```bash
   # If not pushed yet
   git reset HEAD~1
   git stash
   git checkout correct-branch
   git stash pop
   ```

   ### Need to Undo Last Commit
   ```bash
   # Keep changes
   git reset --soft HEAD~1

   # Discard changes
   git reset --hard HEAD~1
   ```

   ### Merge Conflict During Rebase
   ```bash
   # Resolve conflicts in files
   git add <resolved-files>
   git rebase --continue

   # Or abort
   git rebase --abort
   ```
   ```

2. **Save and Commit**
   ```bash
   git add docs/BRANCHING_STRATEGY.md
   git commit -m "docs: Add branching strategy guide"
   git push
   ```

### Step 4: Set Up Branch Protection Rules

1. **Navigate to Branch Settings**
   ```
   Repository → Settings → Branches
   ```

2. **Add Rule for Main Branch**

   Click "Add rule":

   ```
   Branch name pattern: main

   Protect matching branches:
   ✅ Require a pull request before merging
      ✅ Require approvals: 2
      ✅ Dismiss stale pull request approvals when new commits are pushed
      ✅ Require review from Code Owners

   ✅ Require status checks to pass before merging
      ✅ Require branches to be up to date before merging
      Status checks (add as they become available):
         - CI
         - Tests
         - Lint

   ✅ Require conversation resolution before merging

   ✅ Require signed commits (optional)

   ✅ Require linear history

   ✅ Include administrators

   ✅ Restrict who can push to matching branches
      Add: devops-team (or specific admins)

   ✅ Allow force pushes: No

   ✅ Allow deletions: No
   ```

   Click "Create"

3. **Add Rule for Develop Branch**

   Click "Add rule":

   ```
   Branch name pattern: develop

   Protect matching branches:
   ✅ Require a pull request before merging
      ✅ Require approvals: 1

   ✅ Require status checks to pass before merging
      Status checks:
         - CI
         - Tests

   ✅ Require conversation resolution before merging

   ✅ Allow force pushes: No

   ✅ Allow deletions: No
   ```

   Click "Create"

### Step 5: Create Branch Naming Cheat Sheet

Create `docs/BRANCH_NAMING_CHEATSHEET.md`:

```markdown
# Branch Naming Cheat Sheet

## Quick Reference

| Purpose | Pattern | Example | Base Branch |
|---------|---------|---------|-------------|
| New feature | `feature/description` | `feature/user-auth` | develop |
| Bug fix | `bugfix/description` | `bugfix/login-error` | develop |
| Hotfix | `hotfix/description` | `hotfix/security-patch` | main |
| Release | `release/vX.Y.Z` | `release/v1.2.0` | develop |
| Documentation | `docs/description` | `docs/update-readme` | develop |
| Refactoring | `refactor/description` | `refactor/user-service` | develop |
| Performance | `perf/description` | `perf/optimize-query` | develop |
| Testing | `test/description` | `test/add-unit-tests` | develop |

## Naming Rules

### DO ✅
- Use lowercase
- Use hyphens to separate words
- Be descriptive but concise
- Use present tense verbs
- Keep under 50 characters

**Good Examples:**
```
feature/add-user-authentication
bugfix/fix-memory-leak
hotfix/patch-xss-vulnerability
docs/update-api-documentation
refactor/simplify-user-service
```

### DON'T ❌
- Use spaces
- Use underscores (use hyphens instead)
- Use camelCase or PascalCase
- Use vague names
- Include ticket numbers only

**Bad Examples:**
```
feature/New_Feature          # Underscores
feature/newFeature           # camelCase
feature/stuff                # Vague
bugfix/123                   # Only ticket number
feature/this is a feature    # Spaces
```

## Common Patterns

### Features
```
feature/user-registration
feature/payment-integration
feature/email-notifications
feature/search-functionality
feature/admin-dashboard
```

### Bug Fixes
```
bugfix/login-redirect
bugfix/null-pointer-error
bugfix/database-connection
bugfix/validation-error
bugfix/ui-alignment
```

### Hotfixes
```
hotfix/security-vulnerability
hotfix/data-corruption
hotfix/server-crash
hotfix/memory-leak
```

### Documentation
```
docs/api-endpoints
docs/installation-guide
docs/architecture-diagram
docs/contributing-guidelines
```

### Refactoring
```
refactor/database-queries
refactor/authentication-logic
refactor/error-handling
refactor/api-routes
```

## With Ticket Numbers

If your team uses ticket tracking:

```
feature/PROJ-123-user-authentication
bugfix/PROJ-456-login-error
hotfix/PROJ-789-security-patch
```

## Quick Commands

### Create and Switch
```bash
# Feature
git checkout -b feature/my-new-feature

# Bug fix
git checkout -b bugfix/fix-something

# Hotfix
git checkout -b hotfix/critical-fix
```

### Push New Branch
```bash
git push -u origin feature/my-new-feature
```

### List Branches
```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a
```

### Delete Branch
```bash
# Delete local
git branch -d feature/my-feature

# Delete remote
git push origin --delete feature/my-feature
```

## Tips

1. **Start with the type** - Makes it easy to filter and search
2. **Be specific** - Avoid generic names like "fix" or "update"
3. **Use issue numbers** - If applicable: `feature/123-add-auth`
4. **Keep it short** - Aim for 3-5 words maximum
5. **Match your commits** - Branch name should relate to commits

## Need Help?

Ask in #dev-help channel or check [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md)
```

### Step 6: Validation

**Checklist:**
- [ ] All label categories created
- [ ] Labels have consistent naming
- [ ] Labels have appropriate colors
- [ ] Branch protection rules set for main
- [ ] Branch protection rules set for develop
- [ ] Branching strategy documented
- [ ] Branch naming guide created
- [ ] Team understands branch workflow

**Test:**
```bash
# Test branch creation
git checkout -b feature/test-branch
git push origin feature/test-branch

# Try to push to main directly (should fail)
git checkout main
echo "test" > test.txt
git add test.txt
git commit -m "test"
git push origin main  # Should be rejected

# Clean up
git reset --hard HEAD~1
git checkout develop
git branch -D feature/test-branch
git push origin --delete feature/test-branch
```

## Deliverables

- ✅ Comprehensive label system in GitHub
- ✅ Branch protection rules configured
- ✅ Branching strategy documented
- ✅ Branch naming guide created
- ✅ Labels script for automation (optional)

## Success Metrics

- All labels created and color-coded
- Branch protection prevents direct commits to main
- Team understands branching model
- Documentation is clear and actionable

---

## Developer Role - Phase 1 Summary

### Tasks Completed

1. ✅ **Task 4**: Main repository created and IDE connected with Copilot
2. ✅ **Task 5**: Comprehensive documentation written (README, Contributing, Code of Conduct)
3. ✅ **Task 6**: Label system and branching strategy established

### Total Time Investment

- Task 4: 1-2 hours
- Task 5: 2-3 hours
- Task 6: 1-2 hours
- **Total**: 4-7 hours

### Key Achievements

- ✅ Development environment ready
- ✅ Project documentation complete
- ✅ Collaboration workflows established
- ✅ Team can start coding with confidence

### Next Steps for Developers

1. Review all documentation
2. Clone repository and verify setup
3. Test Copilot integration
4. Familiarize with branch strategy
5. Practice creating feature branches
6. Begin Phase 2 development tasks

---

**Prepared by**: Development Team
**Last Updated**: November 2025
**Version**: 1.0
