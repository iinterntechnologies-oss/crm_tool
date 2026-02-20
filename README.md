# Pulse CRM

A modern, full-stack CRM application built with **React + Vite** frontend and **FastAPI** backend. Manage leads, customers, clients, goals, tasks, and activities with real-time analytics and secure JWT authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Features

- 👥 **Lead Management** - Track and convert leads into customers
- 🎯 **Goal Tracking** - Set and monitor CRM goals with progress tracking
- 📋 **Task Management** - Create and manage tasks with assignments
- 📊 **Analytics Dashboard** - Real-time metrics and performance insights
- 💾 **Customer Database** - Comprehensive customer and client profiles
- 🔐 **Secure Authentication** - JWT-based auth with role support
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 📱 **Activity Timeline** - Track all customer interactions

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

### Backend
- **FastAPI** - Python async web framework
- **PostgreSQL** - Data persistence (Supabase compatible)
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **JWT** - Authentication

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Python** 3.10+ ([download](https://www.python.org/))
- **PostgreSQL** (local or [Supabase](https://supabase.com/) cloud)
- **Git** for version control

## Quick Start

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file (optional):**
   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   VITE_DEMO_EMAIL=demo@pulse.local
   VITE_DEMO_PASSWORD=demo1234
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173` (or next available port)

### Backend Setup

1. **Create and activate Python virtual environment:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   copy backend\.env.example backend\.env  # Windows
   cp backend/.env.example backend/.env  # macOS/Linux
   ```
   Update the following in `backend/.env`:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SECRET_KEY` - JWT secret for signing tokens
   - Other optional settings

4. **Run the backend:**
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```
   API health check: `http://localhost:8000/health`

## Project Structure

```
crm_tool/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── Leads.tsx        # Leads management
│   ├── Customers.tsx    # Customer profiles
│   ├── Tasks.tsx        # Task management
│   └── ...
├── backend/             # FastAPI application
│   ├── app/
│   │   ├── main.py      # App entry point
│   │   ├── models.py    # Database models
│   │   ├── schemas.py   # Pydantic schemas
│   │   ├── crud.py      # Database operations
│   │   └── routers/     # API endpoints
│   └── requirements.txt  # Python dependencies
├── public/              # Static assets
├── package.json         # Frontend dependencies
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite configuration
```

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login and get JWT token |

**Login example:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Resources

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| **Leads** | `GET/POST /leads`, `PATCH/DELETE /leads/{id}` | Manage leads |
| **Customers** | `GET/POST /customers`, `PATCH/DELETE /customers/{id}` | Customer profiles |
| **Clients** | `GET/POST /clients`, `PATCH/DELETE /clients/{id}` | Client management |
| **Goals** | `GET/POST /goals`, `PATCH/DELETE /goals/{id}` | Goal tracking |
| **Tasks** | `GET/POST /tasks`, `PATCH/DELETE /tasks/{id}` | Task management |
| **Activities** | `GET/POST /activities` | Activity logs |
| **Stats** | `GET /stats` | Analytics data |

All endpoints require JWT authentication via `Authorization: Bearer {token}` header.

## Configuration

### Environment Variables

**Frontend** (`.env.local`):
```
VITE_API_BASE_URL=http://localhost:8000
VITE_DEMO_EMAIL=demo@pulse.local
VITE_DEMO_PASSWORD=demo1234
```

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://user:password@localhost/crm_db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## Development

### Frontend Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Backend Development
```bash
# Run with auto-reload
uvicorn backend.app.main:app --reload --port 8000

# Database migrations (if applicable)
alembic upgrade head
```

## Testing

Test scripts are included in the root directory:
- `test_register_endpoint.py` - Test user registration
- `test_usercreate.py` - Test user creation
- `test_schema.py` - Test data schemas

Run tests with:
```bash
python test_register_endpoint.py
python test_usercreate.py
python test_schema.py
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Blank frontend page** | Ensure frontend is running on correct port and backend is accessible |
| **Auth errors (401/403)** | Verify `VITE_API_BASE_URL` matches backend URL; check JWT token in headers |
| **Database connection fails** | Check `DATABASE_URL` in `backend/.env`; ensure PostgreSQL is running |
| **CORS errors** | Verify backend CORS settings allow frontend origin |
| **Port already in use** | Change port in server command or kill existing process |
| **Module not found (Python)** | Activate virtual environment and reinstall: `pip install -r backend/requirements.txt` |

## Support

For issues, questions, or contributions, please refer to the project documentation or open an issue in the repository.
