# Commit Message Guidelines

Use this prompt to write clear and consistent commit messages.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no functionality change)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies updates
- **ci**: CI/CD configuration changes
- **build**: Build system changes

## Scope

The scope specifies the area of the codebase affected:
- **api**: API-related changes
- **ui**: User interface changes
- **auth**: Authentication/authorization
- **db**: Database changes
- **config**: Configuration changes

## Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters
- Be concise and clear

## Body (Optional)

- Explain the "what" and "why", not "how"
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple points

## Footer (Optional)

- Reference issues: `Fixes #123`, `Closes #456`
- Note breaking changes: `BREAKING CHANGE: description`

## Examples

### Simple commit
```
feat(auth): add login with Google OAuth
```

### Detailed commit
```
fix(api): handle null values in user profile endpoint

- Add null checks for optional fields
- Return default values for missing data
- Update error messages for clarity

Fixes #234
```

### Breaking change
```
refactor(api): change response format for user endpoints

Previously responses were nested under 'data' key.
Now responses are returned directly.

BREAKING CHANGE: API response format has changed
Closes #345
```

## Tips

- Keep commits atomic (one logical change per commit)
- Commit often, push regularly
- Write as if you're explaining to a colleague
- Be specific about what changed
- Test before committing
