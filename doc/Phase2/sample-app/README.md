# Workshop App - Sample Node.js Express Application

A secure Express.js application demonstrating CI/CD and security best practices for the DevOps CI/CD & Security Workshop.

## Features

- ✅ RESTful API endpoints
- ✅ Security middleware (Helmet, rate limiting, input sanitization)
- ✅ Health check endpoints (health, readiness, liveness)
- ✅ Input validation and XSS protection
- ✅ Comprehensive test suite
- ✅ Docker support
- ✅ ESLint configuration
- ✅ Security headers
- ✅ Error handling

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration.

### 3. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the application in production mode |
| `npm run dev` | Start with nodemon for development |
| `npm test` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style issues |

## API Endpoints

### Health Checks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Application health status |
| `/health/ready` | GET | Readiness probe |
| `/health/live` | GET | Liveness probe |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/api/status` | GET | API status |
| `/api/users` | GET | Get all users |
| `/api/users/:id` | GET | Get user by ID |
| `/api/comments` | GET | Get all comments |
| `/api/comments` | POST | Create a comment |
| `/api/login` | POST | Login (demo) |
| `/api/admin/dashboard` | GET | Protected endpoint |

### Example Requests

**Get API Status:**
```bash
curl http://localhost:3000/api/status
```

**Get All Users:**
```bash
curl http://localhost:3000/api/users
```

**Create a Comment:**
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is a test comment",
    "author": "TestUser"
  }'
```

**Login (Demo):**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

**Access Protected Endpoint:**
```bash
curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer demo_token_12345"
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test tests/security.test.js
```

### Test Coverage

The project includes comprehensive tests for:
- ✅ Basic API functionality
- ✅ Security features (XSS, SQL injection, CSRF)
- ✅ Input validation
- ✅ Authentication & authorization
- ✅ Security headers
- ✅ Rate limiting

## Docker

### Build Docker Image

```bash
docker build -t workshop-app:latest .
```

### Run Docker Container

```bash
docker run -p 3000:3000 workshop-app:latest
```

### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

Run with:
```bash
docker-compose up
```

## Security Features

### 1. Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy
- Referrer-Policy

### 2. Input Validation
- Express-validator for request validation
- Custom sanitization middleware
- SQL injection protection
- XSS protection

### 3. Rate Limiting
- 100 requests per 15 minutes per IP on `/api/*` routes

### 4. Authentication
- Bearer token authentication (demo implementation)
- Protected routes

### 5. Error Handling
- Centralized error handler
- No error stack traces in production
- Proper HTTP status codes

## Project Structure

```
workshop-app/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── routes/
│   │   ├── health.js          # Health check routes
│   │   └── api.js             # API routes
│   └── middleware/
│       ├── security.js        # Security middleware
│       └── errorHandler.js    # Error handling
├── tests/
│   ├── app.test.js           # Application tests
│   └── security.test.js      # Security tests
├── .eslintrc.js              # ESLint configuration
├── Dockerfile                # Docker configuration
├── .dockerignore             # Docker ignore file
├── .gitignore               # Git ignore file
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## CI/CD Integration

This application is designed to work with GitHub Actions CI/CD pipelines:

### GitHub Actions Workflow Example

See the workshop guide for complete workflow examples including:
- Build and test
- Security scanning (CodeQL, Trivy)
- Docker image building
- Multi-environment deployment
- Monitoring and alerting

### Required Secrets

For CI/CD pipelines, configure these secrets in GitHub:
- `DATABASE_URL` - Database connection string
- `API_KEY` - API key for external services
- `SLACK_WEBHOOK_URL` - Slack notifications

## Security Considerations

⚠️ **Important Notes for Production:**

1. **Authentication**: The demo authentication is simplified. Use proper JWT with secret rotation in production.
2. **Database**: Replace in-memory storage with a real database.
3. **Secrets**: Never commit secrets. Use environment variables and secret management systems.
4. **HTTPS**: Always use HTTPS in production.
5. **Logging**: Implement proper logging with log aggregation (e.g., ELK, Splunk).
6. **Monitoring**: Add APM tools (e.g., New Relic, Datadog).

## Common Issues

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```bash
# Check Node version (should be 18+)
node --version

# Update dependencies
npm update
```

## Contributing

This is a workshop sample application. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Workshop Usage

This application is part of the **DevOps CI/CD & Security Workshop**. It demonstrates:

1. **Module 1**: CI/CD pipeline setup with build, test, and security scanning
2. **Module 2**: Environment management and secrets handling
3. **Module 3**: Monitoring and alerting integration

Follow the workshop guide to:
- Set up GitHub Actions workflows
- Configure security scanning
- Implement multi-environment deployment
- Add monitoring and alerting

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Helmet.js Security](https://helmetjs.github.io/)
- [Jest Testing Framework](https://jestjs.io/)
- [GitHub Actions](https://docs.github.com/actions)
- [OWASP Top 10](https://owasp.org/Top10/)

## License

MIT License - See LICENSE file for details

## Support

For workshop-related questions:
- Check the workshop guide
- Review the documentation
- Ask the instructor

---

**Happy Learning! 🚀**

*Version: 1.0.0*
*Last Updated: 2024*
