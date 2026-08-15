# Frontend

This is a lightweight React + Vite frontend scaffold for the Faamaumauga project. It includes data-entry forms for customers, meters, readings, invoices, and receipts and uses the backend API documented in docs/API-ENDPOINTS.md.

Quick start:

cd frontend
npm install
# create .env with VITE_API_URL (e.g. http://localhost:3000/api)
npm run dev

Notes:
- Auth: the Login form posts to /api/auth/login and stores the returned JWT in localStorage as `token`.
- API client: src/services/api.js reads VITE_API_URL or falls back to http://localhost:3000/api
- Forms: simple MUI-based forms that POST to the documented endpoints. They expect the backend to validate and return standard responses.

Learning notes and comments:
- Each React component file contains comments at the top explaining its purpose and how it maps to backend endpoints.
- This scaffold keeps form logic simple so you can trace one-to-one between form fields, API payloads, and SQL INSERTs in docs/FRONTEND-DATA-FLOW.md.
- Later, we can add client-side validation, select lists populated from GET endpoints, and nicer UX (toasts, progress indicators).
