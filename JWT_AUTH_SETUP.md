# JWT Authentication Setup Guide

## Overview

The CRM application uses JWT (JSON Web Tokens) for authentication. The system automatically registers and authenticates users on startup using credentials from environment variables.

## Frontend Setup

### Configuration File: `.env`

Located in the root directory (`crm_tool/.env`), this file contains your authentication credentials:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DEMO_EMAIL=admin@crm.local
VITE_DEMO_PASSWORD=AdminPassword123!
VITE_AUTO_LOGIN=true
```

### Configuration Options

| Variable | Purpose | Default | Required |
|----------|---------|---------|----------|
| `VITE_API_BASE_URL` | Backend API server URL | `http://localhost:8000` | No |
| `VITE_DEMO_EMAIL` | Username/email for authentication | `demo@pulse.app` | Yes |
| `VITE_DEMO_PASSWORD` | Password for authentication | `demo1234` | Yes |
| `VITE_AUTO_LOGIN` | Auto-login on app startup | `true` | No |

### Setting Custom Credentials

1. **Open `.env` file** in the `crm_tool/` directory
2. **Update `VITE_DEMO_EMAIL`** to your desired username (can be email format or simple username)
3. **Update `VITE_DEMO_PASSWORD`** to a secure password
4. **Save the file** and restart the development server

Example:
```env
VITE_DEMO_EMAIL=john.doe@company.com
VITE_DEMO_PASSWORD=SecurePassword123!@#
```

## Backend Setup

### Configuration File: `backend/.env`

The backend uses these JWT-related settings:

```env
JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Production Security

**⚠️ IMPORTANT**: Before deploying to production:

1. **Change JWT_SECRET_KEY to a strong random value**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Then update `backend/.env`:
   ```env
   JWT_SECRET_KEY=your-generated-secret-key-here
   ```

2. **Use environment-specific passwords** (not the same as development)

3. **Enable HTTPS** in production

4. **Set appropriate `ALLOWED_ORIGINS`** in `backend/.env`:
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

## Authentication Flow

```
1. App Startup
   ↓
2. Read VITE_DEMO_EMAIL and VITE_DEMO_PASSWORD from .env
   ↓
3. Attempt authApi.login() with credentials
   ↓
4. If login fails (user not found), authApi.register() creates user
   ↓
5. Successful login returns JWT token
   ↓
6. Token stored and used for all subsequent API requests
   ↓
7. Token automatically expires after ACCESS_TOKEN_EXPIRE_MINUTES
```

## API Endpoints

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "admin@crm.local",
  "password": "AdminPassword123!"
}

Response: 200 OK
```

### Login (Get JWT Token)
```bash
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@crm.local&password=AdminPassword123!

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using Token in Requests
All authenticated API requests must include the Authorization header:

```bash
GET /clients
Authorization: Bearer {access_token}
```

## Password Requirements

While there are no enforced password requirements, we recommend:

- **Minimum 12 characters** for production
- **Mix of uppercase, lowercase, numbers, and symbols**
- **Avoid common words or patterns**

Example strong password:
```
SecurePassword123!@#
```

## Troubleshooting

### Issue: "Unable to connect to the API"
- Verify backend is running: `cd backend && uvicorn app.main:app --reload`
- Check `VITE_API_BASE_URL` in `.env` matches backend URL
- Check firewall/CORS settings

### Issue: "Invalid credentials"
- Verify email/password in `.env` are correct
- Check backend database has the user record
- Ensure no extra whitespace in credentials

### Issue: "Token expired"
- Token lifetime is set by `ACCESS_TOKEN_EXPIRE_MINUTES` (default: 60)
- User will need to re-authenticate after token expiration
- In production, implement token refresh mechanism

### Issue: "User already exists"
- This is normal on subsequent app restarts
- Change password to update credentials
- Or delete user from database and restart

## Token Format

JWT tokens in this application contain:

```json
{
  "sub": "admin@crm.local",    // subject (user email)
  "exp": 1708883423,            // expiration time
  "iat": 1708879823             // issued at
}
```

## Security Best Practices

1. ✅ **Always use HTTPS in production**
2. ✅ **Keep JWT_SECRET_KEY secure and unique**
3. ✅ **Use strong, unique passwords** (min 12 chars)
4. ✅ **Rotate credentials regularly**
5. ✅ **Monitor access logs** for suspicious activity
6. ✅ **Set appropriate token expiration** time
7. ❌ **Never commit** `.env` or secret keys to version control
8. ❌ **Don't share** credentials in messages/docs

## Multiple Users

Currently, the app auto-logs in with a single credential. To support multiple users:

1. Remove auto-login (`VITE_AUTO_LOGIN=false`)
2. Build a dedicated login page
3. Implement user registration flow
4. Store selected credentials in browser (secure storage)

## Resetting Credentials

To reset authentication credentials:

### Option 1: Database Reset
```bash
# Delete the user from database and restart app
# App will re-register with credentials from .env
```

### Option 2: Change .env Credentials
```bash
# Update VITE_DEMO_EMAIL and/or VITE_DEMO_PASSWORD
# Restart app
# Previous credentials will stop working
```

## Development vs Production Checklist

| Item | Development | Production |
|------|-------------|-----------|
| JWT_SECRET_KEY | Generic (ok) | ✅ Strong random |
| Password | Simple (ok) | ✅ Complex |
| HTTPS | Not required | ✅ Required |
| Token Expiry | Long (ok) | ✅ Short (15-60 mins) |
| CORS Origins | Permissive | ✅ Strict |
| Error Messages | Detailed (ok) | ✅ Generic |

## Support

For issues with authentication:
1. Check backend logs: `tail -f backend.log`
2. Verify `.env` file exists and is readable
3. Ensure backend is running on correct port
4. Check browser console for error messages
