# Pulse CRM

Pulse CRM is a React + Vite frontend with a FastAPI backend. The UI manages leads, saved leads, clients, goals, and customers. The backend persists data in Postgres (Supabase compatible) and exposes REST endpoints secured by JWT.

## Prerequisites

- Node.js 18+
- Python 3.10+
- Postgres database (local or Supabase)

## Frontend setup

1. Install dependencies:
   `npm install`
2. (Optional) Create a .env.local for frontend settings:
   - `VITE_API_BASE_URL=http://localhost:8000`
   - `VITE_DEMO_EMAIL=demo@pulse.local`
   - `VITE_DEMO_PASSWORD=demo1234`
3. Run the app:
   `npm run dev`

The frontend runs on http://localhost:3001 if 3000 is busy.

## Backend setup (FastAPI)

The backend lives in [backend](backend).

1. Create a Python environment and install dependencies:
   `python -m venv .venv`
   `.venv\Scripts\activate`
   `pip install -r backend/requirements.txt`
2. Copy env file and fill in values:
   `copy backend\.env.example backend\.env`
3. Update `DATABASE_URL` with your Postgres connection string.
4. Run the API:
   `uvicorn backend.app.main:app --reload --port 8000`

Health check: http://localhost:8000/health

## API overview

- Auth:
  - `POST /auth/register`
  - `POST /auth/login`
- Leads: `GET/POST /leads`, `PATCH/DELETE /leads/{id}`
- Clients: `GET/POST /clients`, `PATCH/DELETE /clients/{id}`
- Customers: `GET/POST /customers`, `PATCH/DELETE /customers/{id}`
- Goals: `GET/POST /goals`, `PATCH/DELETE /goals/{id}`
- Stats: `GET /stats`

## Data persistence

All CRM data is stored in the Postgres database configured by `DATABASE_URL` in [backend/.env](backend/.env).

## Common issues

- Blank page: ensure the frontend is running on the correct port.
- Auth errors: verify `VITE_API_BASE_URL` and backend is running.
- CSP errors: ensure you are not injecting a restrictive CSP header via a proxy.
