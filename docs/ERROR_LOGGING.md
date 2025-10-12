# Error Logging Guide for HealthLease Hub

## Overview

Comprehensive error logging has been implemented across the HealthLease Hub backend to help you quickly identify and fix issues. This guide explains the logging system and how to use it effectively.

## What Was Added

### 1. **Global Error Handler** (`src/server.ts`)
- Catches all unhandled errors that escape route handlers
- Logs detailed error information including stack traces
- Returns detailed errors in development, generic messages in production
- Logs the following for each error:
  - Error message
  - Stack trace
  - Request path
  - HTTP method
  - Timestamp

### 2. **Enhanced Controller Logging** (`src/features/auth/auth-controller.ts`)
- All auth endpoints now log errors before returning responses
- Different log levels for different error types:
  - ⚠️ **Warning** - Expected errors (validation, unauthorized, conflicts)
  - ❌ **Error** - Unexpected errors (internal server errors)
  - ✅ **Success** - Successful operations (implicit)

### 3. **Service Initialization Logging** (`src/routes/auth.routes.ts`)
- Logs each step of service initialization
- Shows exactly where initialization fails if it does
- Helps identify Prisma or service configuration issues

### 4. **Token Blacklist Service Logging** (`src/core/services/token-blacklist-service.ts`)
- Detailed logging during blacklist initialization
- Shows Prisma client availability
- Logs database connection issues
- Doesn't crash the server if initialization fails

### 5. **Centralized Error Logger Utility** (`src/core/utils/error-logger.ts`)
- Reusable logging functions for consistent error handling
- Functions available:
  - `logError()` - Log errors with full context
  - `logWarning()` - Log warnings
  - `logInfo()` - Log informational messages
  - `logSuccess()` - Log successful operations
  - `logDebug()` - Debug logs (only in development mode)

## Log Format

All logs follow a consistent format with emojis for quick visual scanning:

```
❌ [CATEGORY] ERROR: {
  timestamp: "2025-10-12T...",
  message: "Error message",
  stack: "Error stack trace...",
  context: { /* additional context */ },
  error: { /* full error object */ }
}
```

### Log Levels

| Emoji | Level | When to Use |
|-------|-------|-------------|
| ✅ | Success | Operation completed successfully |
| ℹ️ | Info | Informational messages |
| ⚠️ | Warning | Expected errors (validation, auth failures) |
| ❌ | Error | Unexpected errors, system failures |
| 🐛 | Debug | Debug information (only in dev mode) |
| 🔧 | Setup | Service initialization |
| 🔐 | Security | Auth/security related |

## How to Use the Error Logger

### In Your Controllers

```typescript
import { logError, logWarning, logInfo } from '../../core/utils/error-logger'

async myHandler(c: Context): Promise<Response> {
  try {
    // Your logic here
    logInfo('MY_FEATURE', 'Operation started', { userId: '123' })
    
    // Success
    return c.json({ success: true })
  } catch (error) {
    if (error instanceof ValidationError) {
      logWarning('MY_FEATURE', error.message, { 
        endpoint: 'POST /api/my-endpoint',
        userId: c.get('userId')
      })
      return c.json({ error: error.message }, 400)
    }
    
    // Unexpected error
    logError('MY_FEATURE', error, {
      endpoint: 'POST /api/my-endpoint',
      userId: c.get('userId'),
      method: c.req.method,
      path: c.req.path
    })
    
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
```

### In Your Services

```typescript
import { logError, logSuccess } from '../utils/error-logger'

async myServiceMethod(data: any): Promise<void> {
  try {
    // Your logic
    await this.prisma.something.create({ data })
    
    logSuccess('MY_SERVICE', 'Record created', { id: data.id })
  } catch (error) {
    logError('MY_SERVICE', error, { 
      operation: 'create',
      data 
    })
    throw error
  }
}
```

## Debugging Tips

### 1. **Check Server Logs on Startup**
Look for initialization messages:
```
🔧 Initializing auth services...
✅ PrismaClient initialized
✅ AuthService initialized
✅ AuthController initialized
```

If you see errors here, the service failed to initialize.

### 2. **Watch for Error Patterns**
Common error patterns and what they mean:

#### Prisma Errors
```
❌ FAILED TO INITIALIZE TOKEN BLACKLIST:
  prismaAvailable: true
  blacklistedTokenModelAvailable: false
```
**Solution**: Run `bunx prisma generate` to regenerate Prisma client.

#### Database Connection Errors
```
❌ [DATABASE] ERROR:
  message: "Can't reach database server"
```
**Solution**: Check `DATABASE_URL` in `.env` file and database connection.

#### Validation Errors
```
⚠️ Registration validation error: Password must be at least 8 characters
```
**Solution**: These are expected - fix the input data.

### 3. **Enable Debug Mode**
Set in your `.env` file:
```env
DEBUG=true
NODE_ENV=development
```

This enables:
- Debug logs via `logDebug()`
- Detailed error responses from API
- Additional environment variable logging on startup

### 4. **Check Full Stack Traces**
When you see an error, the stack trace shows exactly where it occurred:
```
❌ REGISTRATION ERROR:
  stack: "Error: ...
    at AuthService.register (auth-service.ts:92)
    at AuthController.register (auth-controller.ts:57)
    ..."
```

Follow the stack trace from top to bottom to find the root cause.

## Common Error Scenarios

### 1. **Internal Server Error with No Logs**
If you get 500 errors but see no logs:
- The error might be thrown before reaching your handler
- Check the global error handler output
- Look for unhandled promise rejections

### 2. **Service Initialization Failures**
If the server starts but endpoints don't work:
- Check service initialization logs
- Verify Prisma client is generated
- Check database connection

### 3. **Silent Failures**
If operations seem to work but don't:
- Add `logInfo()` or `logDebug()` calls to trace execution
- Check if try-catch blocks are swallowing errors
- Verify async/await usage

## Environment Variables

Control logging behavior with:

```env
# Show debug logs
DEBUG=true

# Environment mode (affects error detail in responses)
NODE_ENV=development

# Log level (if you want to filter)
LOG_LEVEL=info
```

## Best Practices

1. **Always log errors before returning responses**
2. **Include context** - userId, endpoint, operation type
3. **Use appropriate log levels** - don't use error for validation failures
4. **Log in both controllers and services** for complete trace
5. **Don't log sensitive data** - passwords, tokens, etc.
6. **Use structured logging** - pass objects, not strings

## Testing the Logging

Try making a request that will fail to see the logging in action:

```bash
# Test registration with invalid data
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid", "password": "123"}'
```

You should see detailed logs in your terminal showing exactly what went wrong.

## Next Steps

To add logging to other features:

1. Import the error logger utility
2. Add try-catch blocks if missing
3. Log errors with appropriate context
4. Test by triggering errors
5. Verify logs appear in terminal

---

**Need Help?** Check the terminal logs first - they now contain everything you need to debug issues!

