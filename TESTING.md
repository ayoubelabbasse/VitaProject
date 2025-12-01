# Testing Guide

This project includes comprehensive tests for authentication and login functionality.

## Test Structure

```
__tests__/
├── api/
│   └── auth/
│       └── login.test.ts          # Login API endpoint tests
├── lib/
│   ├── auth.test.ts                # Authentication utilities tests
│   └── users.test.ts               # User management tests
└── integration/
    └── login-flow.test.ts          # End-to-end authentication flow tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- login.test.ts
```

## Manual Testing

### Test Login Manually
```bash
node scripts/test-login.js
```

Make sure your dev server is running (`npm run dev`) before running this script.

### Test Credentials

**Admin User:**
- Email: `admin@vita.ma`
- Password: `admin123`

**Customer User:**
- Email: `user@test.com`
- Password: `user123`

## Test Coverage

### Authentication Tests
- ✅ Password hashing and verification
- ✅ JWT token generation and verification
- ✅ User lookup by email (case-insensitive)
- ✅ Login API endpoint (success and error cases)
- ✅ Registration API endpoint
- ✅ User info endpoint (`/api/auth/me`)
- ✅ Complete authentication flow (register → login → get user)

### Error Handling
- ✅ Invalid credentials
- ✅ Missing required fields
- ✅ Malformed JSON requests
- ✅ Invalid tokens

## Test Results

Run `npm test` to see current test status. All tests should pass before deploying to production.

