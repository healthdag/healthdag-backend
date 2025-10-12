# HealthLease Hub API Endpoint Tester

A comprehensive testing script for all HealthLease Hub API endpoints with both interactive and non-interactive modes.

## Features

- 🔐 **Authentication Flow**: Automatic user registration and login
- 🧪 **Comprehensive Testing**: Tests all API endpoints across all categories
- 🎯 **Interactive Mode**: Menu-driven interface for selective testing
- 🤖 **Non-Interactive Mode**: Automated sequential testing for CI/CD
- 📊 **Detailed Results**: Response times, status codes, and error reporting
- 🎨 **Colorized Output**: Easy-to-read colored console output
- ⚡ **Fast Execution**: Optimized for quick testing cycles

## Installation

The required dependencies are already included in `package.json`:

```bash
bun install
```

## Usage

### Interactive Mode (Default)

Run the interactive tester:

```bash
bun run test:endpoints
```

This will present you with a menu to:
- Authenticate with the API
- Test individual endpoints
- Test entire categories
- Run all tests
- View test results

### Non-Interactive Mode (CI/CD)

Run automated testing without user interaction:

```bash
bun run test:endpoints:ci
```

This mode:
- Attempts authentication with default credentials
- Runs all endpoint tests sequentially
- Exits with code 0 (success) or 1 (failure)
- Perfect for CI/CD pipelines

### Direct Execution

You can also run the script directly:

```bash
# Interactive mode
bun run test-endpoints.ts

# Non-interactive mode
bun run test-endpoints.ts --non-interactive
```

## Configuration

The tester can be configured via environment variables:

```bash
# API base URL (default: http://localhost:3000)
export API_BASE_URL="https://your-api-domain.com"

# Run the tester
bun run test:endpoints
```

## Test Categories

The tester covers all API endpoint categories:

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management (`/api/user`)
- `GET /api/user/me` - Get user profile
- `PUT /api/user/me` - Update user profile
- `POST /api/user/wallet/connect` - Connect wallet
- `POST /api/user/wallet/did` - Create DID
- `GET /api/user/wallet/did/status` - Get DID status

### Documents (`/api/documents`)
- `GET /api/documents` - List user documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get specific document

### Marketplace (`/api/marketplace`)
- `GET /api/marketplace/studies` - Browse studies
- `GET /api/marketplace/studies/:id` - Get study details
- `POST /api/marketplace/studies/:id/apply` - Apply to study
- `GET /api/marketplace/leases/:id/status` - Get lease status

### Emergency (`/api/emergency`)
- `POST /api/emergency/qr` - Generate QR code
- `POST /api/emergency/access` - Request emergency access

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get activity feed

### Settings (`/api/settings`)
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### Access Logs (`/api/access-logs`)
- `GET /api/access-logs` - Get access logs

### System (`/`)
- `GET /health` - Health check
- `GET /` - API information

## Authentication Flow

The tester handles authentication automatically:

1. **Registration**: Attempts to register a test user
2. **Login**: If registration fails (user exists), attempts login
3. **Token Management**: Stores JWT token for authenticated requests
4. **Fallback**: Continues testing public endpoints if authentication fails

### Default Credentials

- **Email**: `test@example.com`
- **Password**: `password123`

You can override these in interactive mode by entering different credentials.

## Output Format

### Interactive Mode
```
🏥 HealthLease Hub API Endpoint Tester
============================================================
Base URL: http://localhost:3000
Timeout: 10000ms
============================================================

🔐 Authenticating...
✅ Authentication successful
User: test@example.com

🧪 Testing AUTH endpoints
------------------------------------------------------------
Testing POST /api/auth/register...
POST    /api/auth/register                                    SUCCESS 201 (245ms)
Testing POST /api/auth/login...
POST    /api/auth/login                                       SUCCESS 200 (156ms)
Testing POST /api/auth/logout...
POST    /api/auth/logout                                      SUCCESS 200 (89ms)
```

### Non-Interactive Mode
```
🤖 Running in non-interactive mode
============================================================
🔐 Authenticating...
✅ Authentication successful
User: test@example.com

🚀 Running all endpoint tests
============================================================

🧪 Testing AUTH endpoints
------------------------------------------------------------
POST    /api/auth/register                                    SUCCESS 201 (245ms)
POST    /api/auth/login                                       SUCCESS 200 (156ms)
POST    /api/auth/logout                                      SUCCESS 200 (89ms)

🧪 Testing USER endpoints
------------------------------------------------------------
GET     /api/user/me                                          SUCCESS 200 (123ms)
PUT     /api/user/me                                          SUCCESS 200 (167ms)
POST    /api/user/wallet/connect                              SUCCESS 200 (234ms)
POST    /api/user/wallet/did                                  SUCCESS 202 (189ms)
GET     /api/user/wallet/did/status                           SUCCESS 200 (145ms)

============================================================
TEST SUMMARY
============================================================
Total Tests: 25
Successful: 23
Failed: 2
Skipped: 0
Duration: 4.2s
============================================================
```

## Error Handling

The tester gracefully handles various error scenarios:

- **Network Errors**: Connection timeouts, DNS failures
- **Authentication Errors**: Invalid credentials, expired tokens
- **API Errors**: 4xx and 5xx HTTP status codes
- **Validation Errors**: Invalid request data

Failed tests are clearly marked and included in the summary.

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test:endpoints:ci
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

### Docker Example

```dockerfile
FROM oven/bun:1

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

# Run API tests
RUN bun run test:endpoints:ci

EXPOSE 3000
CMD ["bun", "run", "start"]
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure the API server is running
   - Check the `API_BASE_URL` environment variable
   - Verify the port is correct

2. **Authentication Failures**
   - Check if the database is accessible
   - Verify user registration/login endpoints work
   - Ensure JWT secret is configured

3. **Timeout Errors**
   - Increase the timeout in the script
   - Check server performance
   - Verify network connectivity

### Debug Mode

Enable debug logging by setting the `DEBUG` environment variable:

```bash
DEBUG=true bun run test:endpoints
```

## Contributing

To add new endpoints to the tester:

1. Add the endpoint definition to the `ENDPOINTS` object in `test-endpoints.ts`
2. Specify the HTTP method, endpoint path, and any required data
3. Set `requiresAuth: true` for authenticated endpoints
4. Test both successful and error scenarios

## License

This testing script is part of the HealthLease Hub project and follows the same licensing terms.
