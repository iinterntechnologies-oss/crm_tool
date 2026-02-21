# 🚀 Quick Start - JWT Authentication Setup

## Step 1: Configure Credentials

The app uses JWT authentication. Configure your login credentials:

### Option A: Use Default Credentials (Development)
The app comes with default credentials:
- **Email**: `admin@crm.local`
- **Password**: `AdminPassword123!`

These are already set in the `.env` file.

### Option B: Customize Credentials

1. **Open `.env` file** in the `crm_tool/` directory:
   ```
   crm_tool/.env
   ```

2. **Update the credentials**:
   ```env
   VITE_DEMO_EMAIL=your-email@company.com
   VITE_DEMO_PASSWORD=YourSecurePassword123!
   ```

3. **Save the file** and restart the development server:
   ```bash
   npm run dev
   ```

## Step 2: Start the Backend

In a terminal, start the backend API:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

The backend will run on: `http://localhost:8000`

## Step 3: Start the Frontend

In another terminal, start the frontend:

```bash
cd crm_tool
npm run dev
```

The frontend will run on: `http://localhost:5173` or `http://localhost:3000`

## Step 4: First Login

On startup, the app will:
1. ✅ Attempt to login with the credentials in `.env`
2. ✅ If user doesn't exist, auto-register them
3. ✅ Automatically log in and load the dashboard

You should see:
- ✅ Dashboard loading with all data
- ✅ "CRM" badge in the sidebar
- ✅ No error messages

## Troubleshooting

### ❌ "Cannot connect to API"
- **Check**: Is the backend running on `http://localhost:8000`?
  ```bash
  cd backend
  python -m uvicorn app.main:app --reload
  ```
- **Check**: Is `VITE_API_BASE_URL` correct in `.env`?
  ```env
  VITE_API_BASE_URL=http://localhost:8000
  ```

### ❌ "Invalid credentials"
- **Check**: Verify email exists in `.env`:
  ```bash
  cat crm_tool/.env | grep VITE_DEMO_EMAIL
  ```
- **Fix**: Update `.env` with correct credentials
- **Reset**: Delete user from database and restart app

### ❌ "Database connection failed"
- **Check**: Is PostgreSQL running with the correct connection string?
- **Check**: `backend/.env` has correct `DATABASE_URL`
- **Check**: Database exists and migrations have run

## Security Notes

⚠️ **For Development Only**:
- `.env` file should NOT be committed to version control
- Change `JWT_SECRET_KEY` in `backend/.env` before production
- Use strong passwords (min 12 characters)

## More Details

For comprehensive authentication setup guide, see:
📖 [JWT_AUTH_SETUP.md](JWT_AUTH_SETUP.md)

## Password Format Recommendation

While not enforced, use passwords like:
```
SecurePassword123!@#
MyApp2024Security!
CRM_Admin_Pass#123
```

- 12+ characters
- Mix of uppercase, lowercase, numbers, symbols
- No common words or dictionary terms
- Unique per environment (dev/staging/prod)

## Need Help?

1. **Check browser console**: Open DevTools (F12) → Console tab for error details
2. **Check backend logs**: Watch terminal where backend is running
3. **Review** `JWT_AUTH_SETUP.md` for detailed configuration guide
