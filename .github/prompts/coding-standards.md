# Coding Standards Prompt

Use this prompt to ensure code follows project standards.

## Code Quality Standards

### Naming Conventions
- Use descriptive, meaningful names
- Follow language-specific conventions (camelCase, PascalCase, snake_case)
- Avoid abbreviations unless widely recognized
- Use consistent terminology throughout the codebase

### Code Structure
- Keep functions small and focused (single responsibility)
- Maximum function length: 50 lines (guideline)
- Maximum file length: 300 lines (guideline)
- Use proper indentation (2 or 4 spaces, consistent)

### Comments and Documentation
- Write self-documenting code first
- Add comments for complex logic only
- Use JSDoc/docstrings for public APIs
- Keep comments up to date with code changes

### Error Handling
- Handle errors explicitly
- Use appropriate error types
- Provide meaningful error messages
- Log errors with context

### Security
- Validate all user input
- Sanitize output
- Use parameterized queries
- Store secrets securely
- Follow OWASP guidelines

### Performance
- Avoid premature optimization
- Use efficient algorithms
- Consider time and space complexity
- Profile before optimizing

### Testing
- Write tests for new code
- Maintain test coverage above 80%
- Test edge cases
- Keep tests fast and isolated

### Code Review Checklist
- [ ] Code follows style guide
- [ ] Functions are small and focused
- [ ] Names are clear and descriptive
- [ ] Error handling is appropriate
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] No code duplication
