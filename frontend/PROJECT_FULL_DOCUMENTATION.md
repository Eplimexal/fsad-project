# LoanHub - Full Project Documentation

## 1) Overview
LoanHub is a role-based loan management platform with separate workflows for Admin, Lender, Borrower, and Analyst users. The project now includes:
- React frontend (Vite)
- Express backend API with JWT authentication
- File-based persistent datastore for development (`backend/src/data/db.json`)

## 2) Architecture
### Frontend
- `src/context/AuthContext.jsx`: authentication state + token persistence.
- `src/context/LoanContext.jsx`: loan, offer, application state synchronized through API.
- `src/services/api.js`: centralized Axios client and API wrappers.
- `src/hooks/useAuth.js`, `src/hooks/useLoan.js`: custom hooks for context access.

### Backend
- `backend/src/server.js`: API routes for auth, offers, applications, loans, and payments.
- `backend/src/middleware/auth.js`: JWT issuance and protected-route middleware.
- `backend/src/data/store.js`: persistent file database read/write + initial seed.

## 3) Security Model
- JWT-based authentication (`Authorization: Bearer <token>`).
- Role-based authorization enforced server-side for sensitive actions:
  - Offer creation: lender/admin
  - Application approval/rejection: lender/admin
  - Payment submission: borrower/admin
- Passwords are stored hashed (`bcryptjs`).

## 4) Implemented Improvements
1. Replaced mock-only frontend auth with backend-backed auth API.
2. Replaced in-memory-only loan data operations with backend API calls.
3. Fixed lint issues from hook export patterns and unused variables.
4. Applied a more serious, enterprise visual theme with subdued colors.
5. Added backend workspace with independent scripts and endpoints.
6. Added this centralized documentation file.

## 5) API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health`
- `GET /api/loans`
- `GET /api/offers`
- `POST /api/offers`
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id/approve`
- `PUT /api/applications/:id/reject`
- `POST /api/loans/:id/payments`

## 6) Local Run Instructions
### Frontend
```bash
npm install
npm run dev:frontend
```

### Backend
```bash
cd backend
npm install
npm run dev
```

> Backend defaults to `http://localhost:4000`; frontend expects `VITE_API_URL` or defaults to `http://localhost:4000/api`.

## 7) Default Demo Credentials
For seeded accounts, use `password123`:
- `admin@example.com`
- `lender@example.com`
- `borrower@example.com`
- `analyst@example.com`

## 8) Offline Fallback Behavior
- If the backend is unavailable, frontend auth and loan actions switch to localStorage-backed offline demo mode.
- This keeps login/registration and dashboard workflows functional for demos.

## 9) Known Limitations and Next Steps
- Current backend datastore is file-based and intended for development.
- Next step for production readiness: PostgreSQL, migrations, validation schema (Zod/Joi), rate-limiting, audit logs, and test coverage expansion.
