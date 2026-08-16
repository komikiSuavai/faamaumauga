# backend/README-MOCK.md
This file explains the mock backend server added to help smoke-test the frontend locally.

Files added:
- backend/server.js : Minimal Express server that implements the endpoints expected by the frontend and either uses your MySQL database (if configured) or an in-memory store.

How it works:
- The server reads environment variables from `backend/.env` (if present). You can copy `backend/.env.example` to `backend/.env` and set DB credentials and JWT secret.
- If DB credentials (DB_HOST, DB_USER, DB_NAME) are present and valid, the server will attempt to connect to MySQL and will insert records into the real tables.
- If DB is not available, the server falls back to an in-memory store so the frontend can still be tested.

Usage:
1. Install dependencies (from repo root):
   cd backend
   npm install

2. (Optional) Configure DB and JWT in backend/.env by copying .env.example:
   cp .env.example .env
   # edit backend/.env to set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

3. Start the mock server:
   npm run dev

4. Start the frontend (in another terminal):
   cd frontend
   npm install
   echo "VITE_API_URL=http://localhost:3000/api" > .env
   npm run dev

Now use the frontend UI at the Vite URL to login (default demo credentials: operator1 / password123) and exercise the forms.
