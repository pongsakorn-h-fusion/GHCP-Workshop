// Security middleware

// Additional security headers
const securityHeaders = (req, res, next) => {
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
};

// XSS sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        // Remove potential XSS vectors
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
  }

  next();
};

// SQL injection protection (for query parameters)
const validateQueryParams = (req, res, next) => {
  const dangerousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL meta-characters
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, // Modified SQLi
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, // SQLi
    /((\%27)|(\'))union/i, // Union-based SQLi
  ];

  const queryString = JSON.stringify(req.query);

  const hasSQLInjection = dangerousPatterns.some((pattern) => pattern.test(queryString));

  if (hasSQLInjection) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Potentially malicious input detected',
    });
  }

  return next();
};

// CSRF token validation (simplified for demo)
const csrfProtection = (req, res, next) => {
  // Skip GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'];

  // In production, validate against session-stored token
  if (!csrfToken) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token is required for this request',
    });
  }

  return next();
};

module.exports = {
  securityHeaders,
  sanitizeInput,
  validateQueryParams,
  csrfProtection,
};
