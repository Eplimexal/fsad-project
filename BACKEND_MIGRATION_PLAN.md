# Spring Boot Backend Migration Plan (Replace React Mock/Fake Backend)

## Current Status Snapshot

- The React app calls an API base URL of `http://localhost:4000/api` by default, which matches the Node/Express fake backend currently living under `frontend/backend`. 
- Authentication and loan operations in the React app currently include **offline fallback behavior** (localStorage + mock data) when network calls fail.
- A Spring Boot project exists under `backend`, but it is still the starter template (single application class + default properties).

## 1) Remove Frontend Fake/Offline Backend Coupling

### A. Remove Node/Express backend from `frontend/backend`

Delete after Spring Boot parity is complete:

- `frontend/backend/src/server.js`
- `frontend/backend/src/data/store.js`
- `frontend/backend/src/middleware/auth.js`
- `frontend/backend/package.json`

### B. Remove frontend offline fallback logic

The frontend should fail fast with useful API errors instead of silently switching to localStorage mode.

- In `frontend/src/context/AuthContext.jsx`:
  - remove `MOCK_USERS` fallback helpers (`getLocalUsers`, `setLocalUsers`)
  - remove network-error fallback branch in `login`
  - remove network-error fallback branch in `register`
- In `frontend/src/context/LoanContext.jsx`:
  - remove `MOCK_*` imports and localStorage seed (`getOfflineData`, `saveOfflineData`)
  - remove catch-fallback branches in:
    - bootstrap load
    - `createLoanOffer`
    - `createLoanApplication`
    - `approveLoan`
    - `rejectApplication`
    - `addPayment`
- Remove `frontend/src/services/mockData.js` once unused.

### C. Update frontend runtime config/scripts

- Update default `VITE_API_URL` expectation to Spring Boot port (e.g., `http://localhost:8080/api`) if env var is not set.
- Replace/remove `dev:backend` script in `frontend/package.json` that currently starts the fake backend.
- Add `.env.example` under `frontend` with:
  - `VITE_API_URL=http://localhost:8080/api`

## 2) Build Spring Boot API to Match Existing Frontend Contract

The React code currently expects these routes and response shapes. Implement these first to avoid frontend rewrites.

### Required auth endpoints

- `POST /api/auth/register`
  - request: `{ name, email, password, role? }`
  - response: `{ user, token }`
- `POST /api/auth/login`
  - request: `{ email, password, role? }`
  - response: `{ user, token }`
- `GET /api/auth/me`
  - auth required
  - response: user object

### Required loan endpoints

- `GET /api/loans`
- `GET /api/offers`
- `POST /api/offers` (roles: lender/admin)
- `GET /api/applications`
- `POST /api/applications` (roles: borrower/admin)
- `PUT /api/applications/{id}/approve` (roles: lender/admin)
- `PUT /api/applications/{id}/reject` (roles: lender/admin)
- `POST /api/loans/{id}/payments` (roles: borrower/admin)

### Response shape compatibility

Keep these keys aligned with frontend usage:

- `loanOffers`, `applications`, `loans`
- IDs like `APP-*`, `L-*`, `O-*` can later be replaced by UUID/DB IDs, but frontend mapping should be updated in lockstep if changed.

## 3) Spring Boot Architecture to Implement

Create package structure under `backend/src/main/java/com/fsad`:

- `config/`
  - `SecurityConfig`
  - `CorsConfig`
  - `OpenApiConfig` (optional)
- `auth/`
  - `JwtService`, `JwtAuthenticationFilter`
  - `AuthController`, `AuthService`
  - `dto/` for login/register payloads + responses
- `user/`
  - `User` entity, `Role` enum
  - `UserRepository`, `UserService`
- `loan/`
  - `Loan`, `LoanOffer`, `Application`, `Payment` entities
  - repositories + services + controller(s)
  - `dto/` for create/update operations
- `common/`
  - exception classes + global exception handler
  - mapper utilities

## 4) Data & Persistence Decisions

- Configure `application.properties` for a real DB (MySQL is already in dependencies).
- Add Flyway/Liquibase for schema management.
- Add seed data strategy (dev profile) for demo users/roles and sample offers/applications.
- Ensure password hashing with BCrypt.

Recommended profile split:

- `application-dev.properties` (local DB)
- `application-test.properties` (H2/Testcontainers)
- `application-prod.properties`

## 5) Security & Auth Requirements

- JWT bearer auth compatible with frontend `Authorization: Bearer <token>` usage.
- Stateless security config.
- Role-based authorization for lender/borrower/admin endpoints.
- CORS allow frontend dev origin (`http://localhost:5173`) and deployed domain(s).

## 6) API Contract & Validation

- Use request DTOs + Bean Validation annotations (`@NotBlank`, `@Email`, etc.).
- Return consistent error format, e.g.:
  - `{ code, message, details?, timestamp }`
- Publish OpenAPI spec and validate contract with frontend.

## 7) Testing & Quality Gate

At minimum add:

- unit tests for services
- repository tests
- controller integration tests (`MockMvc`)
- authentication/authorization tests per role

Suggested checks in CI:

- `./mvnw test`
- frontend build + lint
- optional contract tests (frontend against mock/openapi)

## 8) Cutover Plan (Low-Risk Sequence)

1. Implement Spring Boot endpoints with contract parity.
2. Point frontend `.env` to Spring Boot (`VITE_API_URL=http://localhost:8080/api`).
3. Disable offline fallback branches behind a short-lived feature flag.
4. Run end-to-end manual flow:
   - register/login
   - lender creates offer
   - borrower applies
   - lender approves/rejects
   - borrower makes payment
5. Remove feature flag and delete all mock backend + mock data files.
6. Remove `frontend/backend` and docs referencing Node/Express backend.

## 9) Immediate Gaps in Current Backend Template

The Spring Boot project currently still needs:

- domain entities/repositories/services/controllers
- JWT security implementation
- DB config and migrations
- endpoint implementations expected by frontend
- error handling + validation
- test suite beyond default context-load test

## 10) Definition of Done for Migration

Migration is complete only when all are true:

- Frontend has no offline/mock fallback path.
- `frontend/backend` directory is removed.
- Frontend API points to Spring Boot backend.
- All currently used frontend API flows pass against Spring Boot.
- Automated tests pass in both frontend and backend.
