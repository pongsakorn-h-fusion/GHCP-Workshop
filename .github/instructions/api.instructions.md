# API Development Instructions

Path-specific instructions for API development.

## API Design Principles

- Follow RESTful conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Return appropriate HTTP status codes
- Use consistent naming conventions

## Endpoint Structure

```
GET    /api/resource         - List all resources
GET    /api/resource/:id     - Get specific resource
POST   /api/resource         - Create new resource
PUT    /api/resource/:id     - Update entire resource
PATCH  /api/resource/:id     - Partial update
DELETE /api/resource/:id     - Delete resource
```

## Request/Response Format

- Use JSON for request and response bodies
- Include proper headers (Content-Type, Authorization)
- Implement pagination for list endpoints
- Return consistent error messages

## Security

- Validate all input data
- Implement authentication and authorization
- Use HTTPS for all endpoints
- Prevent SQL injection and XSS attacks
- Rate limit endpoints

## Error Handling

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Documentation

- Document all endpoints using OpenAPI/Swagger
- Include example requests and responses
- Document authentication requirements
